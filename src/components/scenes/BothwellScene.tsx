"use client";

import { SceneSvg, useScene, type SceneVariant } from "./SceneSvg";

// The shop floor and the IT desk that keeps it running: a stamping press
// punches out brackets while, at the desk, a PowerShell onboarding script
// types itself out, the ticket queue gets checked off, and a Linux laptop
// finishes provisioning.

type Props = { variant: SceneVariant; className?: string };

const BROWN = "#8a5a2b";
const DESK_DUR = "6s";
const PRESS_DUR = "2s";

const PS_LINES = [
  { text: "PS> .\\New-Hire.ps1", color: "#ffffff" },
  { text: "Creating user…  OK", color: "#9fe8b0" },
  { text: "Installing apps… OK", color: "#9fe8b0" },
  { text: "Mapping drives…  OK", color: "#9fe8b0" },
];
const TICKETS = [0, 1, 2, 3, 4];

export default function BothwellScene({ variant, className }: Props) {
  const { id, ref, animate } = useScene();

  const anim = (props: React.SVGProps<SVGAnimateElement>) =>
    animate ? <animate repeatCount="indefinite" {...props} /> : null;

  return (
    <SceneSvg variant={variant} className={className} title="Bothwell Accurate Co." titleColor="#6e4520" bandColor={BROWN}>
      <defs>
        <linearGradient id={id("wall")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f6f2ec" />
          <stop offset="100%" stopColor="#e3dbcf" />
        </linearGradient>
        <linearGradient id={id("floor")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cdd3ce" />
          <stop offset="100%" stopColor="#b6beb8" />
        </linearGradient>
        <linearGradient id={id("pane")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e9f6ff" />
          <stop offset="100%" stopColor="#b8dcf2" />
        </linearGradient>
        <linearGradient id={id("machine")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c98d1f" />
          <stop offset="35%" stopColor="#f2bd4c" />
          <stop offset="100%" stopColor="#c98d1f" />
        </linearGradient>
        <linearGradient id={id("steel")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e4e8eb" />
          <stop offset="100%" stopColor="#9aa4ab" />
        </linearGradient>
        <linearGradient id={id("desk")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b98a57" />
          <stop offset="100%" stopColor="#9a6d3f" />
        </linearGradient>
        <radialGradient id={id("lampGlow")} cx="50%" cy="0%" r="100%">
          <stop offset="0%" stopColor="#fff3c4" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#fff3c4" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id("beacon")} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb238" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffb238" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id("spark")} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff8d6" />
          <stop offset="100%" stopColor="#ffcf4d" stopOpacity="0" />
        </radialGradient>
        <clipPath id={id("psClip")}>
          <rect x="455" y="121" width="94" height="66" />
        </clipPath>
        <pattern id={id("hazard")} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="10" height="10" fill="#f5c400" />
          <rect width="5" height="10" fill="#2b2d31" />
        </pattern>
      </defs>

      {/* ---------- building ---------- */}
      <rect x="-200" y="-40" width="1360" height="280" fill={ref("wall")} />
      {/* clerestory windows */}
      {Array.from({ length: 8 }, (_, i) => (
        <g key={i}>
          <rect x={30 + i * 118} y="54" width="96" height="36" rx="2" fill={ref("pane")} stroke="#b3aa9c" strokeWidth="3" />
          <line x1={78 + i * 118} y1="54" x2={78 + i * 118} y2="90" stroke="#b3aa9c" strokeWidth="2" />
        </g>
      ))}
      {/* roof truss */}
      <rect x="-200" y="16" width="1360" height="5" fill="#8e979e" />
      <rect x="-200" y="42" width="1360" height="4" fill="#8e979e" />
      <path d={Array.from({ length: 30 }, (_, i) => `M${i * 40 - 60} 44 L${i * 40 - 40} 18 L${i * 40 - 20} 44`).join(" ")} fill="none" stroke="#a3abb1" strokeWidth="2.5" />
      <rect x="-200" y="200" width="1360" height="40" fill="#d8cfc1" />
      <rect x="-200" y="198" width="1360" height="3" fill={BROWN} opacity="0.35" />

      {/* hanging shop lights */}
      {[300, 640].map((x, i) => (
        <g key={x}>
          {animate && <animateTransform attributeName="transform" type="rotate" values={`-2 ${x} 46;2 ${x} 46;-2 ${x} 46`} dur={`${4 + i}s`} repeatCount="indefinite" />}
          <line x1={x} y1="46" x2={x} y2="96" stroke="#5f686f" strokeWidth="1.5" />
          <polygon points={`${x - 14},108 ${x + 14},108 ${x + 70},238 ${x - 70},238`} fill={ref("lampGlow")} opacity="0.45" />
          <path d={`M${x - 16} 108 Q${x} 88 ${x + 16} 108 Z`} fill="#4b555c" />
          <ellipse cx={x} cy="108" rx="10" ry="2.5" fill="#fff6d0" />
        </g>
      ))}

      {/* ---------- floor ---------- */}
      <rect x="-200" y="238" width="1360" height="70" fill={ref("floor")} />
      <rect x="-200" y="246" width="1360" height="3" fill="#f5c400" opacity="0.85" />

      {/* ---------- stamping press ---------- */}
      <ellipse cx="275" cy="240" rx="96" ry="5" fill="#000" opacity="0.12" />
      <rect x="196" y="96" width="24" height="142" rx="3" fill={ref("machine")} />
      <rect x="330" y="96" width="24" height="142" rx="3" fill={ref("machine")} />
      <rect x="188" y="84" width="174" height="30" rx="5" fill={ref("machine")} />
      <rect x="188" y="84" width="174" height="6" rx="3" fill="#f7cf73" />
      <rect x="244" y="92" width="62" height="14" rx="3" fill="#3a3f44" />
      <text x="275" y="102" textAnchor="middle" fontSize="7" fontWeight="800" letterSpacing="1" fill="#f5c400" style={{ fontFamily: "Arial, sans-serif" }}>
        BAC-200
      </text>
      {/* beacon */}
      <rect x="268" y="72" width="14" height="12" rx="3" fill="#ff9d1c" />
      <circle cx="275" cy="74" r="16" fill={ref("beacon")} opacity="0.4">
        {anim({ attributeName: "opacity", values: "0.15;0.7;0.15", dur: "1s" })}
      </circle>
      {/* hydraulic cylinder + ram */}
      <rect x="266" y="114" width="18" height="10" fill={ref("steel")} />
      <g>
        {animate && (
          <animateTransform attributeName="transform" type="translate" values="0 0;0 0;0 38;0 38;0 0" keyTimes="0;0.3;0.45;0.55;1" calcMode="spline" keySplines="0 0 1 1;0.7 0 1 1;0 0 1 1;0.3 0 0.2 1" dur={PRESS_DUR} repeatCount="indefinite" />
        )}
        <rect x="268" y="118" width="14" height="18" fill={ref("steel")} />
        <rect x="224" y="134" width="102" height="22" rx="2" fill="#5b646b" />
        <rect x="224" y="134" width="102" height="4" fill="#79838b" />
        <polygon points="262,156 288,156 275,166" fill="#3e454b" />
      </g>
      {/* bed + die */}
      <rect x="220" y="204" width="110" height="34" fill="#5b646b" />
      <rect x="220" y="204" width="110" height="4" fill="#79838b" />
      <polygon points="258,204 292,204 280,194 270,194" fill="#3e454b" />
      <rect x="220" y="226" width="110" height="6" fill={ref("hazard")} opacity="0.9" />
      {/* the sheet: flat before the hit, bent after */}
      <g>
        {anim({ attributeName: "opacity", values: "1;1;0;0;1", keyTimes: "0;0.45;0.46;0.95;1", dur: PRESS_DUR })}
        <rect x="244" y="190" width="62" height="4" rx="1" fill="#c9d1d7" stroke="#8d979e" strokeWidth="0.8" />
      </g>
      <g opacity="0">
        {anim({ attributeName: "opacity", values: "0;0;1;1;0", keyTimes: "0;0.45;0.46;0.95;1", dur: PRESS_DUR })}
        <path d="M244 180 L275 196 L306 180" fill="none" stroke="#c9d1d7" strokeWidth="4" strokeLinejoin="round" />
        <path d="M244 180 L275 196 L306 180" fill="none" stroke="#8d979e" strokeWidth="0.8" />
      </g>
      {/* impact flash */}
      <circle cx="275" cy="190" r="22" fill={ref("spark")} opacity="0">
        {anim({ attributeName: "opacity", values: "0;0;0.9;0;0", keyTimes: "0;0.44;0.46;0.6;1", dur: PRESS_DUR })}
      </circle>
      {/* control box */}
      <rect x="336" y="140" width="30" height="40" rx="3" fill="#3a3f44" />
      <circle cx="345" cy="152" r="3.5" fill="#4fd17a" />
      <circle cx="357" cy="152" r="3.5" fill="#e8463a" />
      <rect x="342" y="162" width="18" height="10" rx="1.5" fill="#1d2a22" />
      <rect x="344" y="165" width="8" height="4" fill="#7cfc9a">
        {anim({ attributeName: "width", values: "2;14;2", dur: PRESS_DUR })}
      </rect>

      {/* finished brackets bin */}
      <rect x="376" y="208" width="44" height="30" rx="2" fill="#6b7780" />
      <rect x="376" y="208" width="44" height="5" fill="#85929b" />
      {[384, 396, 408].map((x, i) => (
        <path key={x} d={`M${x - 8} ${202 - i * 2} L${x} ${208 - i * 2} L${x + 8} ${202 - i * 2}`} fill="none" stroke="#c9d1d7" strokeWidth="3" strokeLinejoin="round" />
      ))}

      {/* ---------- IT desk ---------- */}
      <ellipse cx="665" cy="240" rx="240" ry="5" fill="#000" opacity="0.1" />
      <rect x="436" y="206" width="460" height="9" rx="2" fill={ref("desk")} />
      <rect x="446" y="215" width="8" height="24" fill="#6f4a29" />
      <rect x="878" y="215" width="8" height="24" fill="#6f4a29" />

      {/* monitor 1: PowerShell onboarding script */}
      <rect x="494" y="194" width="22" height="12" fill="#4b555c" />
      <rect x="484" y="203" width="42" height="4" rx="2" fill="#4b555c" />
      <rect x="448" y="114" width="108" height="80" rx="5" fill="#2e3238" />
      <rect x="453" y="119" width="98" height="70" rx="2" fill="#012456" />
      <g clipPath={ref("psClip")} fontSize="7.2" fontWeight="700" style={{ fontFamily: "'Courier New', monospace" }}>
        {PS_LINES.map((line, i) => {
          const y = 132 + i * 13;
          const start = 0.08 + i * 0.17;
          return (
            <g key={i}>
              <text x="458" y={y} fill={line.color}>
                {line.text}
              </text>
              {/* a cover that slides off to the right, "typing" the line out */}
              <rect x={animate ? 456 : 560} y={y - 8} width="96" height="11" fill="#012456">
                {anim({
                  attributeName: "x",
                  values: "456;456;556;556;456",
                  keyTimes: `0;${start};${start + 0.13};0.96;1`,
                  dur: DESK_DUR,
                })}
              </rect>
            </g>
          );
        })}
        <rect x="458" y="178" width="5" height="7" fill="#ffffff">
          {anim({ attributeName: "opacity", values: "1;0;1", dur: "0.9s", calcMode: "discrete", keyTimes: "0;0.5;1" })}
        </rect>
      </g>

      {/* monitor 2: the ticket queue */}
      <rect x="610" y="194" width="22" height="12" fill="#4b555c" />
      <rect x="600" y="203" width="42" height="4" rx="2" fill="#4b555c" />
      <rect x="566" y="114" width="110" height="80" rx="5" fill="#2e3238" />
      <rect x="571" y="119" width="100" height="70" rx="2" fill="#f7f9fb" />
      <rect x="571" y="119" width="100" height="12" rx="2" fill={BROWN} />
      <text x="576" y="128" fontSize="7" fontWeight="800" fill="#ffffff" style={{ fontFamily: "Arial, sans-serif" }}>
        Tickets
      </text>
      <text x="666" y="128" textAnchor="end" fontSize="7" fontWeight="800" fill="#ffe3b8" style={{ fontFamily: "Arial, sans-serif" }}>
        200+ solved
      </text>
      {TICKETS.map((t) => {
        const y = 136 + t * 10.5;
        const at = 0.1 + t * 0.16;
        return (
          <g key={t}>
            <rect x="576" y={y} width="90" height="8" rx="2" fill="#ffffff" stroke="#e1e6ea" strokeWidth="0.8" />
            <rect x="590" y={y + 2.6} width={30 + ((t * 17) % 26)} height="2.6" rx="1" fill="#c3cbd2" />
            <text x="640" y={y + 6} fontSize="4.8" fontWeight="700" fill="#8a949c" style={{ fontFamily: "Arial, sans-serif" }}>
              {t % 2 ? "WIN" : "LINUX"}
            </text>
            <circle cx="583" cy={y + 4} r="3" fill="#e1e6ea" />
            <g opacity={animate ? 0 : 1}>
              {anim({ attributeName: "opacity", values: "0;0;1;1;0", keyTimes: `0;${at};${at + 0.03};0.95;1`, dur: DESK_DUR })}
              <circle cx="583" cy={y + 4} r="3.4" fill="#4f9d69" />
              <path d={`M581.4 ${y + 4} l1.2 1.3 2.2-2.5`} fill="none" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </g>
        );
      })}

      {/* laptop: Linux box being provisioned */}
      <polygon points="690,200 772,200 780,206 682,206" fill="#b9c0c7" />
      <rect x="694" y="146" width="74" height="54" rx="4" fill="#2e3238" />
      <rect x="698" y="150" width="66" height="44" rx="2" fill="#16191c" />
      <g fontSize="5.6" fontWeight="700" style={{ fontFamily: "'Courier New', monospace" }}>
        <text x="702" y="159" fill="#9fe8b0">
          $ sudo apt upgrade
        </text>
        <text x="702" y="168" fill="#c3cbd2">
          setting up…
        </text>
      </g>
      <rect x="702" y="176" width="58" height="5" rx="2.5" fill="#2e353b" />
      <rect x="702" y="176" width={animate ? 0 : 58} height="5" rx="2.5" fill="#e3a531">
        {anim({ attributeName: "width", values: "0;58;58;0", keyTimes: "0;0.8;0.96;1", dur: DESK_DUR })}
      </rect>
      <g opacity={animate ? 0 : 1}>
        {anim({ attributeName: "opacity", values: "0;0;1;1;0", keyTimes: "0;0.8;0.83;0.95;1", dur: DESK_DUR })}
        <circle cx="752" cy="164" r="5.5" fill="#4f9d69" />
        <path d="M749.5 164 l1.8 1.9 3.3-3.6" fill="none" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* keyboard, mug */}
      <polygon points="500,200 590,200 596,206 494,206" fill="#d9dee3" />
      <rect x="800" y="186" width="16" height="20" rx="3" fill="#ffffff" stroke="#d6cbb8" />
      <path d="M816 191 q7 0 7 5 q0 5 -7 5" fill="none" stroke="#d6cbb8" strokeWidth="2" />
      <rect x="802" y="192" width="12" height="4" fill={BROWN} opacity="0.6" />

      {/* desktop tower */}
      <rect x="836" y="178" width="34" height="28" rx="2" fill="#3a3f44" />
      <rect x="840" y="182" width="26" height="3" rx="1" fill="#5b646b" />
      <rect x="840" y="188" width="26" height="3" rx="1" fill="#5b646b" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={844 + i * 6} cy="198" r="1.6" fill={i === 1 ? "#f5c400" : "#7cfc9a"}>
          {anim({ attributeName: "opacity", values: "1;0.2;1", dur: `${0.7 + i * 0.35}s` })}
        </circle>
      ))}
    </SceneSvg>
  );
}
