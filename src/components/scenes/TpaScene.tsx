"use client";

import { SceneSvg, useScene, type SceneVariant } from "./SceneSvg";

// A sunny Toronto afternoon: a car pulls up to a Green P garage, taps at the
// pay station, the gate lifts, and it rolls inside while the spaces sign
// ticks down by one.
//
// Everything that moves shares one 8s clock. The car is drawn between the
// garage's back layers and its front layers (right-hand wall, planter, gate),
// so driving right carries it behind the wall and into the garage.

type Props = { variant: SceneVariant; className?: string };

const GREEN = "#1f9a4b";
const DUR = "8s";

// car: in from off-screen, stop at the gate, hold, then drive in and stay hidden
const CAR_TIMES = "0;0.3;0.45;0.72;1";
const CAR_SPLINES = "0.25 0.6 0.35 1;0 0 1 1;0.55 0 0.85 0.7;0 0 1 1";
const CAR_Y = 208;
const CAR_XS = [-140, 278, 278, 720, 720];
// wheel spin matched to distance travelled (r = 10.5 → ~66 units per turn)
const WHEEL_DEG = [0, 2280, 2280, 4690, 4690];

const PARKED = [
  { x: 490, row: 0, color: "#e8463a" },
  { x: 566, row: 0, color: "#ffffff" },
  { x: 715, row: 0, color: "#3aa0e0" },
  { x: 850, row: 0, color: "#f5c400" },
  { x: 520, row: 1, color: "#7a8a99" },
  { x: 640, row: 1, color: "#1f9a4b" },
  { x: 790, row: 1, color: "#e8463a" },
];
const SLOT_ROWS = [
  { top: 100, bottom: 126 },
  { top: 144, bottom: 170 },
];
const COLUMNS = [470, 545, 620, 695, 770, 845, 912];

function Cloud({ y, scale, begin }: { y: number; scale: number; begin: string }) {
  return (
    <g opacity="0.95">
      <animateTransform attributeName="transform" type="translate" from="-220 0" to="1180 0" dur="90s" begin={begin} repeatCount="indefinite" />
      <g transform={`translate(0 ${y}) scale(${scale})`}>
        <ellipse cx="0" cy="0" rx="34" ry="14" fill="#ffffff" />
        <ellipse cx="22" cy="-8" rx="22" ry="16" fill="#ffffff" />
        <ellipse cx="-18" cy="-4" rx="18" ry="12" fill="#ffffff" />
        <ellipse cx="4" cy="6" rx="40" ry="8" fill="#eef6fb" />
      </g>
    </g>
  );
}

function Tree({ x }: { x: number }) {
  return (
    <g>
      <ellipse cx={x} cy="240" rx="22" ry="3" fill="#000" opacity="0.1" />
      <rect x={x - 3} y="200" width="6" height="40" rx="2" fill="#8b6a4a" />
      <circle cx={x} cy="186" r="22" fill="#5fae6a" />
      <circle cx={x - 14} cy="198" r="15" fill="#58a05b" />
      <circle cx={x + 14} cy="197" r="15" fill="#6bbb6f" />
      <circle cx={x - 6} cy="176" r="10" fill="#7cc47a" opacity="0.8" />
    </g>
  );
}

// the Green P mark: white P in a green disc with a thin white inner ring
function GreenP({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={GREEN} stroke="#ffffff" strokeWidth={r * 0.1} />
      <circle cx={cx} cy={cy} r={r * 0.8} fill="none" stroke="#ffffff" strokeWidth={r * 0.04} opacity="0.55" />
      <path
        d={`M${cx - r * 0.3} ${cy + r * 0.5} V${cy - r * 0.5} H${cx + r * 0.05} A${r * 0.28} ${r * 0.28} 0 0 1 ${cx + r * 0.05} ${cy + r * 0.06} H${cx - r * 0.3}`}
        fill="none"
        stroke="#ffffff"
        strokeWidth={r * 0.2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <ellipse cx={cx - r * 0.3} cy={cy - r * 0.45} rx={r * 0.45} ry={r * 0.22} fill="#ffffff" opacity="0.18" transform={`rotate(-30 ${cx - r * 0.3} ${cy - r * 0.45})`} />
    </g>
  );
}

// `url` rather than `ref`: in React 19 a `ref` prop would be treated as a DOM ref
function Car({ url, animate }: { url: (name: string) => string; animate: boolean }) {
  const wheel = (cx: number) => (
    <g>
      <circle cx={cx} cy="34" r="12.5" fill="#2b2f35" />
      <circle cx={cx} cy="34" r="10.5" fill="#1f2328" />
      <circle cx={cx} cy="34" r="6" fill="#d9dee3" />
      <g>
        {animate && (
          <animateTransform attributeName="transform" type="rotate" values={WHEEL_DEG.map((d) => `${d} ${cx} 34`).join(";")} keyTimes={CAR_TIMES} calcMode="spline" keySplines={CAR_SPLINES} dur={DUR} repeatCount="indefinite" />
        )}
        {[0, 72, 144, 216, 288].map((a) => (
          <line key={a} x1={cx} y1="34" x2={cx} y2="29" stroke="#8d969e" strokeWidth="1.6" strokeLinecap="round" transform={`rotate(${a} ${cx} 34)`} />
        ))}
      </g>
      <circle cx={cx} cy="34" r="1.8" fill="#6b747c" />
    </g>
  );

  return (
    <g transform={animate ? undefined : `translate(${CAR_XS[1]} ${CAR_Y})`}>
      {animate && (
        <animateTransform attributeName="transform" type="translate" values={CAR_XS.map((x) => `${x} ${CAR_Y}`).join(";")} keyTimes={CAR_TIMES} calcMode="spline" keySplines={CAR_SPLINES} dur={DUR} repeatCount="indefinite" />
      )}
      <ellipse cx="60" cy="45" rx="60" ry="4" fill="#000" opacity="0.25" />
      <path
        d="M6 34 Q3 34 3 30 L3 24 Q3 18 10 17 L28 15 L40 4 Q43 1 49 1 L82 1 Q89 1 93 5 L104 15 L112 16 Q118 17 118 23 L118 30 Q118 34 114 34 Z"
        fill={url("carBody")}
        stroke="#a8261d"
        strokeWidth="1"
      />
      <path d="M31 15 L42 5 Q44 4 48 4 L62 4 L62 15 Z" fill={url("glass")} />
      <path d="M66 4 L81 4 Q87 4 90 7 L99 15 L66 15 Z" fill={url("glass")} />
      <path d="M8 19 Q40 17 116 20" stroke="#ffffff" strokeWidth="1.6" fill="none" opacity="0.45" />
      <line x1="64" y1="17" x2="64" y2="31" stroke="#a8261d" strokeWidth="1" />
      <rect x="68" y="20" width="7" height="2" rx="1" fill="#a8261d" />
      <rect x="40" y="20" width="7" height="2" rx="1" fill="#a8261d" />
      <rect x="3" y="28" width="115" height="6" rx="3" fill="#2b2f35" />
      <rect x="112" y="19" width="6" height="5" rx="2" fill="#fff6c8" />
      <rect x="3" y="19" width="4" height="6" rx="1.5" fill="#b3261e" />
      {/* brake lights while it waits at the gate */}
      <circle cx="4" cy="22" r="7" fill={url("brake")} opacity="0">
        {animate && <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;0.24;0.3;0.45;0.5;1" dur={DUR} repeatCount="indefinite" />}
      </circle>
      {wheel(28)}
      {wheel(94)}
    </g>
  );
}

export default function TpaScene({ variant, className }: Props) {
  const { id, ref, animate } = useScene();

  return (
    <SceneSvg variant={variant} className={className} title="Toronto Parking Authority" titleColor="#1c7a3d" bandColor={GREEN}>
      <defs>
        <linearGradient id={id("sky")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a9d8f7" />
          <stop offset="55%" stopColor="#d9effc" />
          <stop offset="100%" stopColor="#f6fbfe" />
        </linearGradient>
        <radialGradient id={id("sun")} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fffbe6" />
          <stop offset="30%" stopColor="#fff2b8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fff2b8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id("concrete")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f1eee8" />
          <stop offset="100%" stopColor="#dcd7ce" />
        </linearGradient>
        <linearGradient id={id("slot")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22272c" />
          <stop offset="100%" stopColor="#3d454c" />
        </linearGradient>
        <linearGradient id={id("interior")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1b1f23" />
          <stop offset="70%" stopColor="#343b42" />
          <stop offset="100%" stopColor="#4a525a" />
        </linearGradient>
        {/* the car darkens as it rolls into the garage */}
        <linearGradient id={id("shade")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#15191c" stopOpacity="0" />
          <stop offset="100%" stopColor="#15191c" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id={id("road")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6f767d" />
          <stop offset="100%" stopColor="#555b61" />
        </linearGradient>
        <linearGradient id={id("carBody")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff6f5e" />
          <stop offset="55%" stopColor="#e8463a" />
          <stop offset="100%" stopColor="#c0342a" />
        </linearGradient>
        <linearGradient id={id("glass")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e6f6ff" />
          <stop offset="100%" stopColor="#7fb9dc" />
        </linearGradient>
        <radialGradient id={id("brake")} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff4d3d" />
          <stop offset="100%" stopColor="#ff4d3d" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id("halo")} cx="50%" cy="50%" r="50%">
          <stop offset="55%" stopColor="#5ce08a" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#5ce08a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id("lamp")} cx="50%" cy="0%" r="100%">
          <stop offset="0%" stopColor="#fff7d6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#fff7d6" stopOpacity="0" />
        </radialGradient>
        <pattern id={id("hazard")} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="10" height="10" fill="#f5c400" />
          <rect width="5" height="10" fill="#2b2d31" />
        </pattern>
        <pattern id={id("armStripes")} width="16" height="8" patternUnits="userSpaceOnUse">
          <rect width="16" height="8" fill="#ffffff" />
          <rect width="8" height="8" fill="#e8463a" />
        </pattern>
      </defs>

      {/* ---------- sky & city ---------- */}
      <rect x="-200" y="-40" width="1360" height="290" fill={ref("sky")} />
      <circle cx="880" cy="34" r="80" fill={ref("sun")} />
      {animate ? (
        <>
          <Cloud y={40} scale={1} begin="-10s" />
          <Cloud y={72} scale={0.7} begin="-45s" />
          <Cloud y={28} scale={0.85} begin="-72s" />
        </>
      ) : (
        <g transform="translate(260 0)">
          <Cloud y={40} scale={1} begin="0s" />
        </g>
      )}

      {/* far skyline, with the CN Tower */}
      <g fill="#c9dbe9">
        <rect x="20" y="150" width="46" height="90" />
        <rect x="70" y="120" width="36" height="120" />
        <rect x="112" y="160" width="50" height="80" />
        <rect x="168" y="104" width="30" height="136" />
        <rect x="204" y="140" width="44" height="100" />
        <rect x="330" y="132" width="40" height="108" />
        <rect x="376" y="112" width="34" height="128" />
        <rect x="416" y="150" width="48" height="90" />
        <rect x="900" y="120" width="44" height="120" />
      </g>
      <g fill="#b4c9da">
        <polygon points="294,240 297.5,96 302.5,96 306,240" />
        <rect x="298.8" y="12" width="2.4" height="86" />
        <ellipse cx="300" cy="104" rx="14" ry="6" />
        <rect x="288" y="98" width="24" height="7" rx="3" />
        <ellipse cx="300" cy="76" rx="5" ry="3" />
        <rect x="140" y="178" width="60" height="62" />
        <rect x="250" y="168" width="36" height="72" />
        <rect x="316" y="186" width="54" height="54" />
      </g>
      <g fill="#ffffff" opacity="0.55">
        {[184, 196, 208, 220].map((y) => [148, 160, 172, 184].map((x) => <rect key={`${x}-${y}`} x={x} y={y} width="6" height="5" />))}
      </g>

      {/* ---------- street ---------- */}
      <rect x="-200" y="238" width="1360" height="8" fill="#dcd8d0" />
      <rect x="-200" y="244" width="1360" height="2" fill="#b9b4aa" />
      <rect x="-200" y="246" width="1360" height="60" fill={ref("road")} />
      <g fill="#f2f2f2" opacity="0.8">
        {Array.from({ length: 16 }, (_, i) => (
          <rect key={i} x={i * 70 - 20} y="276" width="36" height="3" rx="1.5" />
        ))}
      </g>

      <Tree x={60} />
      <Tree x={226} />
      {/* street lamp */}
      <rect x="126" y="150" width="4" height="90" fill="#58636b" />
      <path d="M128 152 Q128 140 142 140 L150 140" fill="none" stroke="#58636b" strokeWidth="4" strokeLinecap="round" />
      <rect x="144" y="140" width="16" height="5" rx="2" fill="#434c53" />

      {/* ---------- garage: back layers ---------- */}
      <rect x="462" y="88" width="466" height="150" fill={ref("concrete")} />
      <rect x="458" y="86" width="474" height="12" rx="2" fill="#d6d0c5" />
      <rect x="458" y="96" width="474" height="3" fill={GREEN} opacity="0.8" />

      {SLOT_ROWS.map((row, r) => (
        <g key={r}>
          <rect x="470" y={row.top} width="450" height={row.bottom - row.top} fill={ref("slot")} />
          {/* ceiling light strips */}
          {[500, 580, 660, 740, 820, 890].map((x) => (
            <g key={x}>
              <rect x={x} y={row.top + 1} width="22" height="2" rx="1" fill="#fdfbe8" />
              <polygon points={`${x},${row.top + 3} ${x + 22},${row.top + 3} ${x + 34},${row.bottom} ${x - 12},${row.bottom}`} fill={ref("lamp")} opacity="0.25" />
            </g>
          ))}
          {/* parked cars peeking over the parapet */}
          {PARKED.filter((p) => p.row === r).map((p) => (
            <g key={p.x}>
              <path d={`M${p.x} ${row.bottom} v-8 q0-4 5-4 l6-6 q2-2 5-2 h16 q3 0 5 2 l6 6 q5 0 5 4 v8 z`} fill={p.color} opacity="0.92" />
              <path d={`M${p.x + 12} ${row.bottom - 12} l4-4 h14 l4 4 z`} fill="#9fcbe6" opacity="0.8" />
            </g>
          ))}
          {/* railings */}
          <line x1="470" y1={row.bottom - 7} x2="920" y2={row.bottom - 7} stroke="#aeb6bc" strokeWidth="1.5" />
        </g>
      ))}
      {COLUMNS.map((x) => (
        <rect key={x} x={x - 5} y="99" width="10" height="85" fill="#ece8e1" stroke="#d3cdc2" strokeWidth="0.8" />
      ))}
      <rect x="462" y="126" width="466" height="18" fill="#e7e3dc" />
      <line x1="462" y1="135" x2="928" y2="135" stroke="#d3cdc2" />
      <rect x="462" y="170" width="466" height="14" fill="#e7e3dc" />

      {/* entrance sign with running chevrons */}
      <rect x="532" y="171" width="108" height="12" rx="3" fill={GREEN} />
      <text x="570" y="180.5" textAnchor="middle" fontSize="8.5" fontWeight="800" letterSpacing="1" fill="#ffffff" style={{ fontFamily: "Arial, sans-serif" }}>
        ENTRANCE
      </text>
      {[610, 618, 626].map((x, i) => (
        <path key={x} d={`M${x} 174 l4 3 -4 3`} fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {animate && <animate attributeName="opacity" values="0.25;1;0.25" dur="1.2s" begin={`${i * 0.2}s`} repeatCount="indefinite" />}
        </path>
      ))}

      {/* ground floor, left of the entrance */}
      <rect x="462" y="184" width="58" height="54" fill={ref("concrete")} />

      {/* entrance interior */}
      <rect x="520" y="184" width="130" height="54" fill={ref("interior")} />
      {[540, 580, 620].map((x) => (
        <rect key={x} x={x} y="187" width="18" height="2" rx="1" fill="#fdfbe8" opacity="0.9" />
      ))}
      <polygon points="520,238 650,238 656,246 514,246" fill="#c9c4ba" />
      <rect x="600" y="198" width="30" height="16" rx="2" fill="#2a3035" />
      <text x="615" y="209.5" textAnchor="middle" fontSize="10" fontWeight="800" fill="#6be394" style={{ fontFamily: "Arial, sans-serif" }}>
        P1
      </text>

      {/* pay station, right beside the driver's window */}
      <rect x="342" y="186" width="24" height="56" rx="4" fill={GREEN} />
      <rect x="346" y="191" width="16" height="12" rx="2" fill="#11261a" />
      <path d="M350 197l3 3 5-5" fill="none" stroke="#7cfc9a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0">
        {animate && <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;0.33;0.35;0.62;0.66;1" dur={DUR} repeatCount="indefinite" />}
      </path>
      <rect x="346" y="191" width="16" height="12" rx="2" fill="#7cfc9a" opacity="0">
        {animate && <animate attributeName="opacity" values="0;0;0.45;0;0" keyTimes="0;0.33;0.345;0.4;1" dur={DUR} repeatCount="indefinite" />}
      </rect>
      <rect x="349" y="208" width="10" height="2" rx="1" fill="#0d1f14" />

      {/* ---------- the car ---------- */}
      <Car url={ref} animate={animate} />

      {/* ---------- garage: front layers (the car passes behind these) ---------- */}
      <rect x="520" y="184" width="130" height="54" fill={ref("shade")} />

      <rect x="650" y="184" width="278" height="54" fill={ref("concrete")} />
      <rect x="650" y="184" width="3" height="54" fill="#c7c1b6" />
      {/* available-spaces sign */}
      <rect x="668" y="190" width="84" height="26" rx="3" fill="#1f2428" stroke="#5b646b" />
      <circle cx="681" cy="203" r="8" fill={GREEN} />
      <text x="681" y="207" textAnchor="middle" fontSize="11" fontWeight="900" fill="#ffffff" style={{ fontFamily: "Arial, sans-serif" }}>
        P
      </text>
      <text x="720" y="200" textAnchor="middle" fontSize="6" fontWeight="700" letterSpacing="1" fill="#f5c400" style={{ fontFamily: "Arial, sans-serif" }}>
        SPACES
      </text>
      <g fontSize="12" fontWeight="700" fill="#6be394" style={{ fontFamily: "'Courier New', monospace" }} textAnchor="middle">
        <text x="720" y="212">
          128
          {animate && <animate attributeName="opacity" values="1;0;1" keyTimes="0;0.7;0.98" calcMode="discrete" dur={DUR} repeatCount="indefinite" />}
        </text>
        <text x="720" y="212" opacity="0">
          127
          {animate && <animate attributeName="opacity" values="0;1;0" keyTimes="0;0.7;0.98" calcMode="discrete" dur={DUR} repeatCount="indefinite" />}
        </text>
      </g>
      {/* pedestrian door */}
      <rect x="862" y="196" width="30" height="42" rx="2" fill="#9fb3bf" stroke="#7d8f9a" />
      <line x1="877" y1="196" x2="877" y2="238" stroke="#7d8f9a" />
      <GreenP cx={800} cy={210} r={13} />

      {/* planter along the front */}
      <rect x="650" y="228" width="278" height="28" rx="3" fill="#cfc8bb" />
      <rect x="650" y="228" width="278" height="4" fill="#e3ddd2" />
      {Array.from({ length: 14 }, (_, i) => (
        <circle key={i} cx={662 + i * 20} cy={228} r={i % 2 ? 9 : 11} fill={i % 3 ? "#5fae6a" : "#6bbb6f"} />
      ))}

      {/* clearance bar */}
      <line x1="530" y1="184" x2="530" y2="191" stroke="#6b747c" strokeWidth="1" />
      <line x1="640" y1="184" x2="640" y2="191" stroke="#6b747c" strokeWidth="1" />
      <rect x="524" y="191" width="122" height="5" rx="2" fill={ref("hazard")} />

      {/* barrier gate */}
      <rect x="496" y="206" width="18" height="36" rx="3" fill="#f1f1f1" stroke="#b8bec4" />
      <rect x="496" y="206" width="18" height="6" rx="2" fill={GREEN} />
      <g transform={animate ? undefined : "rotate(80 505 216)"}>
        {animate && (
          <animateTransform attributeName="transform" type="rotate" values="0 505 216;0 505 216;80 505 216;80 505 216;0 505 216;0 505 216" keyTimes="0;0.38;0.46;0.8;0.88;1" calcMode="spline" keySplines="0 0 1 1;0.4 0 0.2 1;0 0 1 1;0.4 0 0.2 1;0 0 1 1" dur={DUR} repeatCount="indefinite" />
        )}
        <rect x="402" y="213" width="104" height="6" rx="3" fill={ref("armStripes")} stroke="#c9cdd1" strokeWidth="0.8" />
        <circle cx="505" cy="216" r="4" fill="#58636b" />
      </g>

      {/* the big Green P, mounted off the garage's front corner */}
      <rect x="462" y="126" width="18" height="4" fill="#8d969e" />
      <rect x="462" y="148" width="18" height="4" fill="#8d969e" />
      <circle cx="444" cy="140" r="46" fill={ref("halo")} opacity="0.5">
        {animate && <animate attributeName="opacity" values="0.3;0.75;0.3" dur="3s" repeatCount="indefinite" />}
      </circle>
      <GreenP cx={444} cy={140} r={32} />
    </SceneSvg>
  );
}
