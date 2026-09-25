"use client";

import { SceneSvg, useScene, type SceneVariant } from "./SceneSvg";

// Left: a 3D stereo vision head scans a bin of jumbled parts and locks onto
// a pick pose. Middle: the Python bridge. Right: the PLC cabinet. Data
// packets ride the cables: pose to the bridge, tags into the PLC, and an
// acknowledgement back; the stack light goes green when the PLC takes it.

type Props = { variant: SceneVariant; className?: string };

const BLUE = "#3f6fa3";
const DUR = "5s";

const PARTS = [
  { x: 214, y: 196, r: -20, w: 26 },
  { x: 240, y: 204, r: 15, w: 30 },
  { x: 268, y: 194, r: 40, w: 24 },
  { x: 296, y: 204, r: -8, w: 28 },
  { x: 228, y: 186, r: 70, w: 22 },
  { x: 284, y: 186, r: -35, w: 26 },
  { x: 312, y: 192, r: 20, w: 22 },
];
const TARGET = PARTS[2];

const CABLE_CAM = "M262 66 C330 66 340 60 360 60 C420 60 440 90 452 124";
const CABLE_PLC = "M540 170 C570 170 580 150 606 150";
const CABLE_ACK = "M606 158 C580 158 570 178 540 178";

function Packet({ path, text, color, at, reverse = false }: { path: string; text: string; color: string; at: number; reverse?: boolean }) {
  const w = text.length * 5 + 12;
  const [a, b] = reverse ? ["1", "0"] : ["0", "1"];
  return (
    <g opacity="0">
      <animateMotion path={path} keyTimes={`0;${at};${at + 0.14};1`} keyPoints={`${a};${a};${b};${b}`} calcMode="linear" dur={DUR} repeatCount="indefinite" />
      <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes={`0;${at};${at + 0.02};${at + 0.12};${at + 0.14};1`} dur={DUR} repeatCount="indefinite" />
      <rect x={-w / 2} y="-7" width={w} height="14" rx="7" fill={color} stroke="#ffffff" strokeWidth="1.2" />
      <text x="0" y="3" textAnchor="middle" fontSize="7.5" fontWeight="800" fill="#ffffff" style={{ fontFamily: "'Courier New', monospace" }}>
        {text}
      </text>
    </g>
  );
}

export default function AperaScene({ variant, className }: Props) {
  const { id, ref, animate } = useScene();
  const anim = (props: React.SVGProps<SVGAnimateElement>) =>
    animate ? <animate dur={DUR} repeatCount="indefinite" {...props} /> : null;

  return (
    <SceneSvg variant={variant} className={className} title="Apera PLC Bridge" titleColor="#2d5580" bandColor={BLUE}>
      <defs>
        <linearGradient id={id("wall")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f6f9fb" />
          <stop offset="100%" stopColor="#dde6ee" />
        </linearGradient>
        <linearGradient id={id("steel")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e4e8eb" />
          <stop offset="100%" stopColor="#9aa4ab" />
        </linearGradient>
        <linearGradient id={id("cabinet")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#d7dde2" />
          <stop offset="100%" stopColor="#b8c1c8" />
        </linearGradient>
        <linearGradient id={id("scan")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7cfc9a" stopOpacity="0" />
          <stop offset="50%" stopColor="#7cfc9a" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#7cfc9a" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={id("beam")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bfe8ff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#bfe8ff" stopOpacity="0.05" />
        </linearGradient>
        <clipPath id={id("bin")}>
          <rect x="196" y="160" width="136" height="54" />
        </clipPath>
        <radialGradient id={id("glow")} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#5cff8a" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#5cff8a" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="-200" y="-40" width="1360" height="360" fill={ref("wall")} />
      <rect x="-200" y="226" width="1360" height="80" fill="#c7d0d7" />
      <rect x="-200" y="232" width="1360" height="3" fill="#f5c400" opacity="0.8" />

      {/* ---------- vision cell ---------- */}
      <rect x="150" y="30" width="8" height="200" fill={ref("steel")} />
      <rect x="370" y="30" width="8" height="200" fill={ref("steel")} />
      <rect x="146" y="26" width="236" height="10" rx="2" fill={ref("steel")} />
      <rect x="240" y="36" width="44" height="22" rx="4" fill="#2e3238" />
      <rect x="240" y="36" width="44" height="6" rx="3" fill={BLUE} />
      {[248, 276].map((x) => (
        <g key={x}>
          <circle cx={x} cy="52" r="5" fill="#1d2024" />
          <circle cx={x} cy="52" r="2.6" fill="#6fd0ff" />
        </g>
      ))}
      <rect x="258" y="48" width="8" height="7" rx="1.5" fill="#bfe8ff" />
      <polygon points="248,58 276,58 330,210 196,210" fill={ref("beam")} />

      {/* bin of parts */}
      <rect x="192" y="210" width="144" height="18" rx="2" fill="#4a6b8f" />
      <g clipPath={ref("bin")}>
        {PARTS.map((p, i) => (
          <g key={i} transform={`rotate(${p.r} ${p.x} ${p.y})`}>
            <rect x={p.x - p.w / 2} y={p.y - 5} width={p.w} height="10" rx="5" fill="#c9d1d7" stroke="#8d979e" />
            <circle cx={p.x} cy={p.y} r="2.4" fill="#8d979e" />
          </g>
        ))}
        {/* structured-light sweep */}
        <rect x="170" y="160" width="40" height="54" fill={ref("scan")}>
          {anim({ attributeName: "x", values: "170;330;330", keyTimes: "0;0.3;1" })}
        </rect>
        {/* point cloud */}
        {PARTS.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y - 6} r="1.6" fill="#1f9a4b" opacity="0">
            {anim({ attributeName: "opacity", values: "0;0;1;1;0", keyTimes: `0;${((p.x - 196) / 136) * 0.3};${((p.x - 196) / 136) * 0.3 + 0.02};0.9;1` })}
          </circle>
        ))}
      </g>
      <path d="M192 178 v50 h144 v-50" fill="none" stroke="#4a6b8f" strokeWidth="5" strokeLinejoin="round" />
      {/* pick pose */}
      <g opacity={animate ? 0 : 1}>
        {anim({ attributeName: "opacity", values: "0;0;1;1;0", keyTimes: "0;0.3;0.33;0.9;1" })}
        <circle cx={TARGET.x} cy={TARGET.y} r="11" fill="none" stroke="#1f9a4b" strokeWidth="2" />
        <path d={`M${TARGET.x} ${TARGET.y - 16}v8M${TARGET.x} ${TARGET.y + 8}v8M${TARGET.x - 16} ${TARGET.y}h8M${TARGET.x + 8} ${TARGET.y}h8`} stroke="#1f9a4b" strokeWidth="2" />
        <path d={`M${TARGET.x} ${TARGET.y} l10 -26`} stroke="#e8463a" strokeWidth="2" />
      </g>

      {/* ---------- cables ---------- */}
      <path d={CABLE_CAM} fill="none" stroke="#3a4148" strokeWidth="3" strokeLinecap="round" />
      <path d="M540 174 C570 174 580 154 606 154" fill="none" stroke="#3a4148" strokeWidth="3" strokeLinecap="round" />

      {/* ---------- the bridge (industrial PC) ---------- */}
      <rect x="420" y="206" width="120" height="8" rx="2" fill="#8d969e" />
      <rect x="430" y="214" width="6" height="16" fill="#8d969e" />
      <rect x="524" y="214" width="6" height="16" fill="#8d969e" />
      <rect x="418" y="124" width="124" height="82" rx="6" fill="#2e3238" />
      <rect x="424" y="130" width="112" height="70" rx="3" fill="#14181c" />
      <g fontSize="6.4" fontWeight="700" style={{ fontFamily: "'Courier New', monospace" }}>
        <text x="429" y="141" fill="#8aa0b0">
          # bridge.py
        </text>
        <text x="429" y="152" fill="#ffd866">
          from pycomm3 import
        </text>
        <text x="429" y="161" fill="#ffd866">
          {"  LogixDriver"}
        </text>
        <text x="429" y="172" fill="#9fe8b0">
          pose = vision.recv()
        </text>
        <text x="429" y="181" fill="#9fe8b0">
          plc.write(pose)
        </text>
        <text x="429" y="193" fill="#6fd0ff" opacity={animate ? 0 : 1}>
          {anim({ attributeName: "opacity", values: "0;0;1;1;0", keyTimes: "0;0.84;0.86;0.95;1" })}
          ✓ ack from PLC
        </text>
      </g>

      {/* ---------- PLC cabinet ---------- */}
      <rect x="606" y="42" width="190" height="186" rx="4" fill={ref("cabinet")} stroke="#98a2a9" strokeWidth="2" />
      <rect x="616" y="52" width="170" height="166" fill="#f1ede4" />
      {/* open door */}
      <polygon points="796,42 850,54 850,218 796,228" fill="#c9d1d7" stroke="#98a2a9" strokeWidth="2" />
      <rect x="836" y="120" width="6" height="22" rx="2" fill="#6b747c" />
      {/* wire ducts */}
      <rect x="622" y="60" width="158" height="12" fill="#b9c0c7" />
      <rect x="622" y="170" width="158" height="12" fill="#b9c0c7" />
      <g stroke="#9aa4ab">
        {Array.from({ length: 16 }, (_, i) => (
          <g key={i}>
            <line x1={626 + i * 10} y1="60" x2={626 + i * 10} y2="72" />
            <line x1={626 + i * 10} y1="170" x2={626 + i * 10} y2="182" />
          </g>
        ))}
      </g>
      {/* rack */}
      <rect x="628" y="80" width="146" height="82" rx="3" fill="#3a3f44" />
      <rect x="632" y="84" width="26" height="74" rx="2" fill="#5b646b" />
      <text x="645" y="126" textAnchor="middle" fontSize="5" fontWeight="800" fill="#d9dee3" transform="rotate(-90 645 122)" style={{ fontFamily: "Arial, sans-serif" }}>
        POWER
      </text>
      {Array.from({ length: 6 }, (_, i) => {
        const x = 662 + i * 18;
        return (
          <g key={i}>
            <rect x={x} y="84" width="15" height="74" rx="2" fill="#2a2e32" stroke="#4a5359" />
            <rect x={x + 2} y="88" width="11" height="4" rx="1" fill={i === 0 ? BLUE : i < 3 ? "#e3a531" : "#1f9a4b"} />
            {[0, 1, 2, 3].map((j) => (
              <circle key={j} cx={x + 7.5} cy={100 + j * 7} r="1.6" fill={j % 2 ? "#ffb238" : "#5cff8a"} opacity="0.3">
                {animate && (
                  <animate attributeName="opacity" values="0.3;1;0.3" dur={`${0.6 + ((i + j) % 4) * 0.25}s`} repeatCount="indefinite" />
                )}
              </circle>
            ))}
            {i === 0 && (
              <text x={x + 7.5} y="150" textAnchor="middle" fontSize="4.5" fontWeight="800" fill="#9fe8b0" style={{ fontFamily: "Arial, sans-serif" }}>
                RUN
              </text>
            )}
          </g>
        );
      })}
      {/* terminal blocks */}
      {Array.from({ length: 20 }, (_, i) => (
        <rect key={i} x={626 + i * 8} y="190" width="6" height="18" rx="1" fill={i % 5 === 4 ? "#e3a531" : "#8d969e"} />
      ))}

      {/* stack light */}
      <rect x="696" y="36" width="10" height="8" fill="#6b747c" />
      <rect x="694" y="4" width="14" height="8" rx="2" fill="#b3261e" />
      <rect x="694" y="13" width="14" height="8" rx="2" fill="#c98d1f" />
      <rect x="694" y="22" width="14" height="10" rx="2" fill="#1f7a45" />
      <rect x="694" y="22" width="14" height="10" rx="2" fill="#5cff8a" opacity={animate ? 0 : 1}>
        {anim({ attributeName: "opacity", values: "0;0;1;1;0", keyTimes: "0;0.62;0.64;0.85;0.9" })}
      </rect>
      <circle cx="701" cy="27" r="20" fill={ref("glow")} opacity="0">
        {anim({ attributeName: "opacity", values: "0;0;0.8;0;0", keyTimes: "0;0.62;0.64;0.85;1" })}
      </circle>

      {/* data on the wire */}
      {animate && (
        <>
          <Packet path={CABLE_CAM} text="pose" color="#1f9a4b" at={0.34} />
          <Packet path={CABLE_PLC} text="PICK_X" color={BLUE} at={0.5} />
          <Packet path={CABLE_ACK} text="ACK" color="#e3a531" at={0.7} />
        </>
      )}
    </SceneSvg>
  );
}
