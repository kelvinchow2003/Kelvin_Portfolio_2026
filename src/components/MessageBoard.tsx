"use client";

import { useState } from "react";
import { EMAIL } from "@/lib/site";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "mailto" } // email isn't set up on the server; handed off to the visitor's mail app
  | { kind: "error"; message: string };

const FIELD =
  "wii-field w-full rounded-xl px-3.5 py-2.5 text-[15px] text-[#3a3a3f] outline-none placeholder:text-[#a0a0a8]";

export default function MessageBoard() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setStatus({ kind: "sending" });

    let res: Response | null = null;
    try {
      res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch {
      res = null;
    }

    if (res?.ok) {
      form.reset();
      setStatus({ kind: "sent" });
      return;
    }
    if (res?.status === 400) {
      setStatus({ kind: "error", message: "Check your name, email, and message, then try again." });
      return;
    }
    if (res?.status === 429) {
      setStatus({ kind: "error", message: "That's a lot of messages! Give it a few minutes and try again." });
      return;
    }
    // not configured, the provider failed, or the network is down: fall back to the mail app
    const subject = encodeURIComponent(`Hello from your Wii portfolio — ${data.name}`);
    const body = encodeURIComponent(`${data.message}\n\n— ${data.name} (${data.email})`);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    setStatus({ kind: "mailto" });
  }

  if (status.kind === "sent") {
    return (
      <div className="wii-panel-chip mt-6 rounded-2xl p-5 text-center" role="status">
        <p className="font-rodin text-lg font-bold text-[#3a3a3f]">Message posted! ✉️</p>
        <p className="mt-1 text-sm text-[#6a6a70]">Thanks for writing. I&apos;ll get back to you soon.</p>
        <button type="button" onClick={() => setStatus({ kind: "idle" })} className="wii-pill-sm mt-4">
          Write another
        </button>
      </div>
    );
  }

  const sending = status.kind === "sending";

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#6b6b72]">Name</span>
          <input name="name" required maxLength={100} autoComplete="name" className={FIELD} placeholder="Your name" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#6b6b72]">Email</span>
          <input name="email" type="email" required maxLength={200} autoComplete="email" className={FIELD} placeholder="you@example.com" />
        </label>
      </div>
      <label className="block">
        <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#6b6b72]">Message</span>
        <textarea name="message" required minLength={2} maxLength={5000} rows={4} className={`${FIELD} resize-y`} placeholder="Say hi, ask about a project, or offer me a job…" />
      </label>
      {/* honeypot: hidden from people, irresistible to bots */}
      <input name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 opacity-0" />

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button type="submit" disabled={sending} className="wii-pill-sm disabled:opacity-60">
          {sending ? "Posting…" : "Post Message"}
        </button>
        <p className="text-sm text-[#6a6a70]" role="status" aria-live="polite">
          {status.kind === "error" && <span className="text-[#c0392b]">{status.message}</span>}
          {status.kind === "mailto" && <>Opened your mail app with the message filled in. Just hit send.</>}
        </p>
      </div>
    </form>
  );
}
