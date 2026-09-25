// Message Board submissions.
//
// Sends through Resend (https://resend.com) when these are set in .env.local
// (and in the host's environment variables when deployed):
//   RESEND_API_KEY      your Resend API key
//   CONTACT_TO_EMAIL    where messages should land
//   CONTACT_FROM_EMAIL  optional; a sender on a domain verified with Resend
//                       (defaults to Resend's onboarding@resend.dev test sender)
// Without them the route answers 503 and the form falls back to the
// visitor's own mail app, so the board still works before email is set up.

const MAX = { name: 100, email: 200, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// best-effort per-instance throttle: 5 messages per IP per 10 minutes
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > LIMIT;
}

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  // bots fill the hidden field; tell them it worked and drop it
  if (str(body.company)) return Response.json({ ok: true });

  const name = str(body.name);
  const email = str(body.email);
  const message = str(body.message);

  const problems: string[] = [];
  if (!name || name.length > MAX.name) problems.push("name");
  if (!EMAIL_RE.test(email) || email.length > MAX.email) problems.push("email");
  if (message.length < 2 || message.length > MAX.message) problems.push("message");
  if (problems.length) return Response.json({ error: "invalid", fields: problems }, { status: 400 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return Response.json({ error: "rate_limited" }, { status: 429 });

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!key || !to) return Response.json({ error: "not_configured" }, { status: 503 });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "Wii Portfolio <onboarding@resend.dev>",
      to: [to],
      reply_to: email,
      subject: `Message Board: ${name}`,
      text: `${message}\n\n— ${name} <${email}>`,
    }),
  });

  if (!res.ok) {
    console.error("contact: resend failed", res.status, await res.text().catch(() => ""));
    return Response.json({ error: "send_failed" }, { status: 502 });
  }
  return Response.json({ ok: true });
}
