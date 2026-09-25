"use client";

import { SceneSvg, useScene, type SceneVariant } from "./SceneSvg";

// Describe a part in chat; watch it get built in CAD. Each tool call the
// assistant makes over MCP lands as a feature in the IronCAD viewport:
// catalog lookup, base block, flange, holes, fillet.

type Props = { variant: SceneVariant; className?: string };

const INK = "#4a4a52";
const ORANGE = "#e07b39";
const DUR = "9s";

// isometric projection of part coordinates (mm) into the viewport
const O = { x: 612, y: 150 };
const K = 1.6;
const iso = (x: number, y: number, z: number) => [O.x + (x - y) * 0.866 * K, O.y + (x + y) * 0.5 * K - z * K] as const;
const pts = (...p: (readonly [number, number])[]) => p.map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`).join(" ");

// the three visible faces of an axis-aligned block
function Block({ x0, x1, y0, y1, z0, z1 }: { x0: number; x1: number; y0: number; y1: number; z0: number; z1: number }) {
  return (
    <g stroke="#3d4a58" strokeWidth="0.9" strokeLinejoin="round">
      <polygon points={pts(iso(x0, y1, z0), iso(x1, y1, z0), iso(x1, y1, z1), iso(x0, y1, z1))} fill="#8ea1b5" />
      <polygon points={pts(iso(x1, y0, z0), iso(x1, y1, z0), iso(x1, y1, z1), iso(x1, y0, z1))} fill="#a9bacb" />
      <polygon points={pts(iso(x0, y0, z1), iso(x1, y0, z1), iso(x1, y1, z1), iso(x0, y1, z1))} fill="#d3dde7" />
    </g>
  );
}

// a round hole drawn on a face; u and v are that face's two in-plane axes
function Hole({ c, u, v, r }: { c: readonly [number, number, number]; u: "x" | "y"; v: "y" | "z"; r: number }) {
  const ring = Array.from({ length: 20 }, (_, i) => {
    const a = (i / 20) * Math.PI * 2;
    const p = [...c] as [number, number, number];
    p[u === "x" ? 0 : 1] += Math.cos(a) * r;
    p[v === "y" ? 1 : 2] += Math.sin(a) * r;
    return iso(...p);
  });
  return <polygon points={pts(...ring)} fill="#34404c" stroke="#1f2830" strokeWidth="0.8" />;
}

const CALLS = [
  { text: "catalog.find(\"L-bracket\")", at: 0.15 },
  { text: "create_block(60, 40, 6)", at: 0.24 },
  { text: "add_flange(h=40)", at: 0.38 },
  { text: "cut_holes(M6, n=2)", at: 0.52 },
  { text: "fillet(r=3)", at: 0.66 },
];

export default function IronCadScene({ variant, className }: Props) {
  const { id, ref, animate } = useScene();
  const anim = (props: React.SVGProps<SVGAnimateElement>) =>
    animate ? <animate dur={DUR} repeatCount="indefinite" {...props} /> : null;
  const appear = (at: number) => ({
    opacity: animate ? 0 : 1,
    child: anim({ attributeName: "opacity", values: "0;0;1;1;0", keyTimes: `0;${at};${at + 0.02};0.95;1` }),
  });

  const base = appear(0.26);
  const holes = appear(0.54);
  const fillet = appear(0.68);
  const done = appear(0.78);

  return (
    <SceneSvg variant={variant} className={className} title="IronCAD MCP Server" titleColor="#3a3a42" bandColor={INK}>
      <defs>
        <linearGradient id={id("bg")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5f5f7" />
          <stop offset="100%" stopColor="#e2e2e8" />
        </linearGradient>
        <linearGradient id={id("viewport")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f7f9fb" />
          <stop offset="100%" stopColor="#dde4ec" />
        </linearGradient>
        <clipPath id={id("flange")}>
          <rect x="520" y={animate ? 150 : 40} width="200" height="200">
            {anim({ attributeName: "y", values: "150;150;40;40;150", keyTimes: "0;0.38;0.48;0.95;1", calcMode: "spline", keySplines: "0 0 1 1;0.3 0 0.2 1;0 0 1 1;0 0 1 1" })}
          </rect>
        </clipPath>
      </defs>

      <rect x="-200" y="-40" width="1360" height="360" fill={ref("bg")} />

      {/* ---------- chat ---------- */}
      <rect x="46" y="30" width="254" height="204" rx="10" fill="#ffffff" stroke="#dadae2" strokeWidth="1.5" />
      <circle cx="64" cy="47" r="8" fill={ORANGE} />
      <text x="64" y="50.5" textAnchor="middle" fontSize="9" fontWeight="900" fill="#ffffff" style={{ fontFamily: "Arial, sans-serif" }}>
        C
      </text>
      <text x="77" y="50.5" fontSize="8.5" fontWeight="800" fill="#2e2e34" style={{ fontFamily: "Arial, sans-serif" }}>
        Claude
      </text>
      <rect x="226" y="40" width="64" height="14" rx="7" fill="#f3f0ee" stroke="#e6dcd4" />
      <circle cx="235" cy="47" r="2.4" fill="#1f9a4b" />
      <text x="241" y="50" fontSize="6.5" fontWeight="700" fill="#6b5b50" style={{ fontFamily: "Arial, sans-serif" }}>
        IronCAD MCP
      </text>
      <line x1="46" y1="60" x2="300" y2="60" stroke="#ececf1" />

      {/* user's request */}
      <rect x="120" y="68" width="170" height="30" rx="9" fill="#ece9ff" />
      <text x="130" y="80" fontSize="7" fontWeight="600" fill="#2e2e34" style={{ fontFamily: "Arial, sans-serif" }}>
        Build a 60 mm L-bracket with two
      </text>
      <text x="130" y="91" fontSize="7" fontWeight="600" fill="#2e2e34" style={{ fontFamily: "Arial, sans-serif" }}>
        M6 holes, from my parts catalog.
      </text>

      {/* typing, then the tool calls */}
      <g opacity={animate ? 1 : 0}>
        {anim({ attributeName: "opacity", values: "0;1;1;0;0", keyTimes: "0;0.04;0.12;0.13;1" })}
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={60 + i * 8} cy="112" r="2.6" fill="#b8b8c4">
            {animate && <animate attributeName="opacity" values="0.3;1;0.3" dur="0.9s" begin={`${i * 0.15}s`} repeatCount="indefinite" />}
          </circle>
        ))}
      </g>
      <g opacity={animate ? 0 : 1}>
        {anim({ attributeName: "opacity", values: "0;0;1;1;0", keyTimes: "0;0.12;0.13;0.95;1" })}
        <text x="56" y="115" fontSize="7" fontWeight="600" fill="#2e2e34" style={{ fontFamily: "Arial, sans-serif" }}>
          On it, building it in IronCAD:
        </text>
      </g>
      {CALLS.map((c, i) => {
        const y = 124 + i * 17;
        const shown = appear(c.at);
        const ok = appear(c.at + 0.1);
        return (
          <g key={c.text} opacity={shown.opacity}>
            {shown.child}
            <rect x="56" y={y} width="232" height="13" rx="4" fill="#f6f6f9" stroke="#e4e4ea" />
            <text x="74" y={y + 9} fontSize="6.6" fontWeight="700" fill="#4a4a52" style={{ fontFamily: "'Courier New', monospace" }}>
              {c.text}
            </text>
            <circle cx="65" cy={y + 6.5} r="3.6" fill="none" stroke="#c9c9d4" strokeWidth="1.4" strokeDasharray="6 4">
              {animate && <animateTransform attributeName="transform" type="rotate" from={`0 65 ${y + 6.5}`} to={`360 65 ${y + 6.5}`} dur="0.8s" repeatCount="indefinite" />}
            </circle>
            <g opacity={ok.opacity}>
              {ok.child}
              <circle cx="65" cy={y + 6.5} r="4.2" fill="#1f9a4b" />
              <path d={`M63 ${y + 6.5} l1.5 1.6 2.8-3.2`} fill="none" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </g>
        );
      })}

      {/* ---------- MCP link ---------- */}
      <path d="M300 132 C330 132 350 132 392 132" fill="none" stroke="#b8b8c4" strokeWidth="3" strokeLinecap="round" />
      <path d="M300 132 C330 132 350 132 392 132" fill="none" stroke={ORANGE} strokeWidth="3" strokeLinecap="round" strokeDasharray="6 10">
        {animate && <animate attributeName="stroke-dashoffset" from="32" to="0" dur="0.7s" repeatCount="indefinite" />}
      </path>
      <rect x="326" y="120" width="40" height="24" rx="5" fill="#2e2e34" />
      <rect x="332" y="116" width="4" height="6" fill="#8d969e" />
      <rect x="356" y="116" width="4" height="6" fill="#8d969e" />
      <text x="346" y="135.5" textAnchor="middle" fontSize="8" fontWeight="900" letterSpacing="0.5" fill="#ffffff" style={{ fontFamily: "Arial, sans-serif" }}>
        MCP
      </text>

      {/* ---------- CAD window ---------- */}
      <rect x="392" y="30" width="512" height="204" rx="8" fill="#ffffff" stroke="#c9ccd4" strokeWidth="1.5" />
      <path d="M392 50 V38 a8 8 0 0 1 8 -8 H896 a8 8 0 0 1 8 8 V50 Z" fill="#3c4450" />
      <text x="404" y="43.5" fontSize="7.5" fontWeight="800" fill="#ffffff" style={{ fontFamily: "Arial, sans-serif" }}>
        IronCAD · bracket
      </text>
      {/* toolbar */}
      <rect x="392" y="50" width="512" height="16" fill="#eef0f3" />
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={458 + i * 16} y="53" width="11" height="10" rx="2" fill={i === 1 || i === 5 ? "#c7d6e6" : "#dde1e7"} />
      ))}
      {/* catalog */}
      <rect x="392" y="66" width="58" height="168" fill="#f5f6f8" />
      <text x="398" y="77" fontSize="6.2" fontWeight="800" fill="#6b6f78" style={{ fontFamily: "Arial, sans-serif" }}>
        CATALOG
      </text>
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x="398" y={82 + i * 36} width="46" height="30" rx="4" fill="#ffffff" stroke="#dde1e7" />
          <path d={`M410 ${104 + i * 36} l10 -6 l14 7 l-10 6 z`} fill="#c7d6e6" />
          {i === 1 && <path d={`M410 ${104 + i * 36} v-12 l4 -2 v12`} fill="#9fb3c8" />}
        </g>
      ))}
      <rect x="397" y="117" width="48" height="32" rx="5" fill="none" stroke={ORANGE} strokeWidth="2" opacity={animate ? 0 : 1}>
        {anim({ attributeName: "opacity", values: "0;0;1;1;0;0", keyTimes: "0;0.15;0.16;0.26;0.28;1" })}
      </rect>

      {/* viewport */}
      <rect x="450" y="66" width="454" height="158" fill={ref("viewport")} />
      <g stroke="#c9d3de" strokeWidth="0.8">
        {Array.from({ length: 9 }, (_, i) => {
          const t = -40 + i * 20;
          const [ax, ay] = iso(t, -40, 0);
          const [bx, by] = iso(t, 100, 0);
          const [cx, cy] = iso(-40, t, 0);
          const [dx, dy] = iso(120, t, 0);
          return (
            <g key={i}>
              <line x1={ax} y1={ay} x2={bx} y2={by} />
              <line x1={cx} y1={cy} x2={dx} y2={dy} />
            </g>
          );
        })}
      </g>
      {/* view cube */}
      <g transform="translate(870 88)">
        <polygon points="0,-10 9,-5 0,0 -9,-5" fill="#e3e8ee" stroke="#aeb7c2" strokeWidth="0.6" />
        <polygon points="-9,-5 0,0 0,10 -9,5" fill="#c9d3de" stroke="#aeb7c2" strokeWidth="0.6" />
        <polygon points="9,-5 0,0 0,10 9,5" fill="#d6dee7" stroke="#aeb7c2" strokeWidth="0.6" />
      </g>

      {/* the part, one feature per tool call */}
      <g opacity={base.opacity}>
        {base.child}
        <Block x0={0} x1={60} y0={0} y1={40} z0={0} z1={6} />
        <g opacity={holes.opacity}>
          {holes.child}
          <Hole c={[16, 26, 6]} u="x" v="y" r={4} />
          <Hole c={[44, 26, 6]} u="x" v="y" r={4} />
        </g>
      </g>
      <g clipPath={ref("flange")}>
        <Block x0={0} x1={60} y0={0} y1={6} z0={6} z1={40} />
        <g opacity={holes.opacity}>
          {holes.child}
          <Hole c={[18, 6, 26]} u="x" v="z" r={4.5} />
          <Hole c={[42, 6, 26]} u="x" v="z" r={4.5} />
        </g>
      </g>
      {/* fillet along the inside corner */}
      <g opacity={fillet.opacity}>
        {fillet.child}
        <line x1={iso(0, 6, 6)[0]} y1={iso(0, 6, 6)[1]} x2={iso(60, 6, 6)[0]} y2={iso(60, 6, 6)[1]} stroke={ORANGE} strokeWidth="3" strokeLinecap="round" />
      </g>
      {/* dimension */}
      <g opacity={base.opacity}>
        {base.child}
        <line x1={iso(0, 46, 0)[0]} y1={iso(0, 46, 0)[1]} x2={iso(60, 46, 0)[0]} y2={iso(60, 46, 0)[1]} stroke="#e07b39" strokeWidth="1" />
        <text x={iso(30, 52, 0)[0]} y={iso(30, 52, 0)[1]} textAnchor="middle" fontSize="7.5" fontWeight="800" fill="#e07b39" style={{ fontFamily: "Arial, sans-serif" }}>
          60 mm
        </text>
      </g>

      {/* status bar */}
      <rect x="450" y="224" width="454" height="10" fill="#eef0f3" />
      <g opacity={done.opacity}>
        {done.child}
        <circle cx="460" cy="229" r="3" fill="#1f9a4b" />
        <text x="467" y="231.5" fontSize="6.2" fontWeight="700" fill="#4a4a52" style={{ fontFamily: "Arial, sans-serif" }}>
          Part built · 4 features
        </text>
      </g>
    </SceneSvg>
  );
}
