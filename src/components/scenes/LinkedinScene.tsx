"use client";

import { SceneSvg, useScene, type SceneVariant } from "./SceneSvg";

// The profile, alive: the network draws itself in around the card, a cursor
// hits Connect, skills pick up endorsements, the experience list slides in,
// and reactions float up off a post.

type Props = { variant: SceneVariant; className?: string };

const BLUE = "#0a66c2";
const DUR = "7s";

const EXPERIENCE = [
  { letter: "S", color: "#4f9d69", org: "Shelley Automation", role: "Application Engineer" },
  { letter: "P", color: "#1f9a4b", org: "Toronto Parking Authority", role: "System Support Engineer Co-op" },
  { letter: "G", color: "#6b5b3e", org: "Green and Spiegel LLP", role: "Junior IT Developer Co-op" },
  { letter: "B", color: "#8a5a2b", org: "Bothwell Accurate Co.", role: "IT Developer Co-op" },
];

const SKILLS = ["Machine Vision", "Robotics", "Python", "PowerShell", "Next.js"];

// network nodes around the card, each wired to the card's nearest edge
const NODES = [
  { x: 48, y: 40, c: "#e8b64c" },
  { x: 150, y: 24, c: "#5ba3d9" },
  { x: 262, y: 44, c: "#d9534f" },
  { x: 700, y: 30, c: "#6c4fd9" },
  { x: 812, y: 22, c: "#4f9d69" },
  { x: 918, y: 46, c: "#f2a63d" },
  { x: 24, y: 210, c: "#2e8bc0" },
  { x: 930, y: 214, c: "#c0562f" },
];

const REACTIONS = [
  { color: BLUE, glyph: "like", x: 736, begin: 0 },
  { color: "#44712e", glyph: "clap", x: 758, begin: 0.8 },
  { color: "#df704d", glyph: "heart", x: 748, begin: 1.6 },
  { color: BLUE, glyph: "like", x: 770, begin: 2.3 },
  { color: "#df704d", glyph: "heart", x: 740, begin: 3.1 },
];

function Glyph({ kind }: { kind: string }) {
  if (kind === "heart") return <path d="M0 3 C-6 -1 -4 -6 0 -3 C4 -6 6 -1 0 3 Z" fill="#ffffff" />;
  if (kind === "clap") return <path d="M-3 3 L-3 -3 Q-1 -6 1 -3 L1 -1 L4 -1 L3 3 Z" fill="#ffffff" />;
  return <path d="M-4 4 V-1 H-2 L0 -5 Q2 -5 1.5 -2 H4 L3 4 Z" fill="#ffffff" />;
}

function Silhouette({ cx, cy, r, color }: { cx: number; cy: number; r: number; color: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={color} />
      <circle cx={cx} cy={cy - r * 0.2} r={r * 0.36} fill="#ffffff" opacity="0.9" />
      <path d={`M${cx - r * 0.62} ${cy + r * 0.66} q${r * 0.62} ${-r * 0.8} ${r * 1.24} 0`} fill="#ffffff" opacity="0.9" />
    </g>
  );
}

export default function LinkedinScene({ variant, className }: Props) {
  const { id, ref, animate } = useScene();
  const anim = (props: React.SVGProps<SVGAnimateElement>) =>
    animate ? <animate dur={DUR} repeatCount="indefinite" {...props} /> : null;
  const appear = (at: number) => ({
    opacity: animate ? 0 : 1,
    child: anim({ attributeName: "opacity", values: "0;0;1;1;0", keyTimes: `0;${at};${at + 0.03};0.95;1` }),
  });
  const connected = appear(0.46);
  const connect = {
    opacity: 1,
    child: anim({ attributeName: "opacity", values: "1;1;0;0;1", keyTimes: "0;0.45;0.46;0.97;1" }),
  };

  return (
    <SceneSvg variant={variant} className={className} title="LinkedIn Channel" titleColor={BLUE} bandColor={BLUE}>
      <defs>
        <linearGradient id={id("bg")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f6fafe" />
          <stop offset="100%" stopColor="#d8e8f6" />
        </linearGradient>
        <linearGradient id={id("banner")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0a66c2" />
          <stop offset="100%" stopColor="#5aa0d8" />
        </linearGradient>
        <linearGradient id={id("postImg")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#10263a" />
          <stop offset="100%" stopColor="#2c6a8f" />
        </linearGradient>
        <clipPath id={id("card")}>
          <rect x="330" y="26" width="300" height="212" rx="10" />
        </clipPath>
      </defs>

      <rect x="-200" y="-40" width="1360" height="360" fill={ref("bg")} />

      {/* ---------- network ---------- */}
      {NODES.map((n, i) => {
        const ex = n.x < 480 ? 330 : 630;
        const ey = Math.min(220, Math.max(40, n.y + 40));
        const at = 0.02 + i * 0.04;
        return (
          <g key={i}>
            <path d={`M${n.x} ${n.y} Q${(n.x + ex) / 2} ${(n.y + ey) / 2 - 30} ${ex} ${ey}`} fill="none" stroke="#9cc3e6" strokeWidth="1.4" strokeDasharray="400" strokeDashoffset={animate ? 400 : 0}>
              {anim({ attributeName: "stroke-dashoffset", values: "400;400;0;0;400", keyTimes: `0;${at};${at + 0.18};0.95;1` })}
            </path>
            <g>
              {animate && <animateTransform attributeName="transform" type="translate" values="0 0;0 -3;0 0" dur={`${3 + (i % 3)}s`} repeatCount="indefinite" />}
              <circle cx={n.x} cy={n.y} r="14" fill="#ffffff" opacity="0.8" />
              <Silhouette cx={n.x} cy={n.y} r={11} color={n.c} />
            </g>
          </g>
        );
      })}

      {/* ---------- endorsements ---------- */}
      {SKILLS.map((s, i) => {
        const y = 84 + i * 30;
        const w = s.length * 5.4 + 20;
        const at = 0.15 + i * 0.1;
        const plus = appear(at);
        return (
          <g key={s}>
            <rect x={290 - w} y={y} width={w} height="18" rx="9" fill="#ffffff" stroke="#c7dcef" />
            <text x={290 - w / 2} y={y + 12} textAnchor="middle" fontSize="8" fontWeight="800" fill="#1d3a57" style={{ fontFamily: "Arial, sans-serif" }}>
              {s}
            </text>
            {animate && (
              <g opacity="0">
                <animateTransform attributeName="transform" type="translate" values="0 0;0 0;0 -16;0 -16" keyTimes={`0;${at};${at + 0.12};1`} dur={DUR} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;0;1;0;0" keyTimes={`0;${at};${at + 0.03};${at + 0.14};1`} dur={DUR} repeatCount="indefinite" />
                <rect x={284 - w} y={y - 2} width="20" height="12" rx="6" fill={BLUE} />
                <text x={294 - w} y={y + 6.5} textAnchor="middle" fontSize="7" fontWeight="900" fill="#ffffff" style={{ fontFamily: "Arial, sans-serif" }}>
                  +1
                </text>
              </g>
            )}
            <g opacity={plus.opacity}>
              {plus.child}
              <circle cx={290 - w - 8} cy={y + 9} r="4" fill="#1f9a4b" />
              <path d={`M${288 - w - 8} ${y + 9} l1.4 1.5 2.6-3`} fill="none" stroke="#ffffff" strokeWidth="1.1" strokeLinecap="round" />
            </g>
          </g>
        );
      })}

      {/* ---------- profile card ---------- */}
      <rect x="334" y="32" width="300" height="212" rx="10" fill="#0a3a6b" opacity="0.1" />
      <rect x="330" y="26" width="300" height="212" rx="10" fill="#ffffff" stroke="#d3e2f0" />
      <g clipPath={ref("card")}>
        <rect x="330" y="26" width="300" height="46" fill={ref("banner")} />
        <path d="M330 60 q40 -14 80 0 t80 0 t80 0 t80 0 V72 H330 Z" fill="#ffffff" opacity="0.12">
          {animate && <animateTransform attributeName="transform" type="translate" values="0 0;-40 0;0 0" dur="8s" repeatCount="indefinite" />}
        </path>
        <circle cx="590" cy="38" r="30" fill="#ffffff" opacity="0.08" />
      </g>
      <circle cx="372" cy="74" r="26" fill="#ffffff" />
      <Silhouette cx={372} cy={74} r={23} color="#7fa6c9" />
      <circle cx="390" cy="92" r="6" fill="#1f9a4b" stroke="#ffffff" strokeWidth="2" />

      <text x="342" y="118" fontSize="14" fontWeight="900" fill="#1d2226" style={{ fontFamily: "var(--font-nunito), Arial, sans-serif" }}>
        Kelvin Chow
      </text>
      <text x="342" y="130" fontSize="7" fontWeight="600" fill="#38434f" style={{ fontFamily: "Arial, sans-serif" }}>
        Application Engineer · Machine Vision &amp; Robotics
      </text>
      <text x="342" y="140" fontSize="6.5" fill="#6b7780" style={{ fontFamily: "Arial, sans-serif" }}>
        CS Honours · Toronto Metropolitan University
      </text>

      {/* connect button, clicked */}
      <g opacity={connect.opacity}>
        {connect.child}
        <rect x="540" y="104" width="80" height="18" rx="9" fill={BLUE} />
        <text x="580" y="116" textAnchor="middle" fontSize="8" fontWeight="800" fill="#ffffff" style={{ fontFamily: "Arial, sans-serif" }}>
          + Connect
        </text>
      </g>
      <g opacity={connected.opacity}>
        {connected.child}
        <rect x="540" y="104" width="80" height="18" rx="9" fill="#ffffff" stroke={BLUE} strokeWidth="1.5" />
        <text x="580" y="116" textAnchor="middle" fontSize="8" fontWeight="800" fill={BLUE} style={{ fontFamily: "Arial, sans-serif" }}>
          ✓ Connected
        </text>
      </g>
      <g transform={animate ? undefined : "translate(592 116)"}>
        {animate && (
          <animateTransform attributeName="transform" type="translate" values="660 190;660 190;592 116;592 116;660 190" keyTimes="0;0.3;0.42;0.5;0.62" calcMode="spline" keySplines="0 0 1 1;0.4 0 0.2 1;0 0 1 1;0.4 0 0.2 1" dur={DUR} repeatCount="indefinite" />
        )}
        <path d="M0 0 L0 14 L4 10.5 L7 17 L9.5 16 L6.5 9.5 L11.5 9.5 Z" fill="#ffffff" stroke="#1d2024" strokeWidth="1.2" strokeLinejoin="round" />
      </g>

      {/* experience */}
      <line x1="342" y1="148" x2="618" y2="148" stroke="#e3ebf3" />
      <text x="342" y="160" fontSize="8" fontWeight="800" fill="#1d2226" style={{ fontFamily: "Arial, sans-serif" }}>
        Experience
      </text>
      {EXPERIENCE.map((e, i) => {
        const y = 166 + i * 18;
        const row = appear(0.08 + i * 0.07);
        return (
          <g key={e.org} opacity={row.opacity}>
            {row.child}
            <rect x="342" y={y} width="14" height="14" rx="3" fill={e.color} />
            <text x="349" y={y + 10.5} textAnchor="middle" fontSize="8.5" fontWeight="900" fill="#ffffff" style={{ fontFamily: "Arial, sans-serif" }}>
              {e.letter}
            </text>
            <text x="362" y={y + 6} fontSize="7" fontWeight="800" fill="#1d2226" style={{ fontFamily: "Arial, sans-serif" }}>
              {e.org}
            </text>
            <text x="362" y={y + 13.5} fontSize="6" fill="#6b7780" style={{ fontFamily: "Arial, sans-serif" }}>
              {e.role}
            </text>
          </g>
        );
      })}

      {/* ---------- a post, with reactions floating off it ---------- */}
      <rect x="682" y="72" width="224" height="150" rx="10" fill="#ffffff" stroke="#d3e2f0" />
      <Silhouette cx={700} cy={90} r={10} color="#7fa6c9" />
      <text x="716" y="89" fontSize="7.5" fontWeight="800" fill="#1d2226" style={{ fontFamily: "Arial, sans-serif" }}>
        Kelvin Chow
      </text>
      <text x="716" y="98" fontSize="6" fill="#6b7780" style={{ fontFamily: "Arial, sans-serif" }}>
        Application Engineer
      </text>
      <text x="692" y="114" fontSize="7" fill="#38434f" style={{ fontFamily: "Arial, sans-serif" }}>
        New build: a vision-guided robot cell
      </text>
      <rect x="692" y="120" width="204" height="76" rx="5" fill={ref("postImg")} />
      {/* tiny robot-guidance cell in the post image */}
      <g stroke="#dfe4e8" strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M770 186 V156 L800 142 L812 160" />
      </g>
      <circle cx="770" cy="156" r="5" fill="#8ec3ea" />
      <circle cx="800" cy="142" r="4.5" fill="#8ec3ea" />
      <rect x="805" y="160" width="14" height="10" rx="2" fill="#ffd100" />
      <polygon points="808,170 816,170 826,188 798,188" fill="#7cfc9a" opacity="0.35">
        {animate && <animate attributeName="opacity" values="0.1;0.6;0.1" dur="2s" repeatCount="indefinite" />}
      </polygon>
      <rect x="752" y="186" width="36" height="8" fill="#56626c" />
      <rect x="796" y="188" width="36" height="6" fill="#3a4550" />
      {/* reaction bar */}
      <g>
        {[
          { x: 700, c: BLUE, g: "like" },
          { x: 710, c: "#44712e", g: "clap" },
          { x: 720, c: "#df704d", g: "heart" },
        ].map((r) => (
          <g key={r.x} transform={`translate(${r.x} 208)`}>
            <circle r="6" fill={r.c} stroke="#ffffff" strokeWidth="1.5" />
            <g transform="scale(0.8)">
              <Glyph kind={r.g} />
            </g>
          </g>
        ))}
      </g>
      <rect x="836" y="202" width="60" height="12" rx="6" fill="#eef3f8" />
      <text x="866" y="210.5" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="#38434f" style={{ fontFamily: "Arial, sans-serif" }}>
        Comment
      </text>
      {animate &&
        REACTIONS.map((r, i) => (
          <g key={i} opacity="0">
            <animateTransform attributeName="transform" type="translate" values={`${r.x} 206;${r.x + (i % 2 ? 10 : -10)} 150;${r.x} 90`} dur="3.2s" begin={`${r.begin}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.7;1" dur="3.2s" begin={`${r.begin}s`} repeatCount="indefinite" />
            <circle r="8" fill={r.color} stroke="#ffffff" strokeWidth="1.5" />
            <Glyph kind={r.glyph} />
          </g>
        ))}
    </SceneSvg>
  );
}
