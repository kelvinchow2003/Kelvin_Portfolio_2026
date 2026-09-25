"use client";

import { SceneSvg, useScene, type SceneVariant } from "./SceneSvg";
import { Gripper, RobotArm, SmartCamera, type Pt } from "./parts";

// Spreadsheet → configurator → robot. The pick-point sheet is read row by
// row, the cursor hits "Generate", a UR script writes itself, and the arm
// (camera on the flange, gripper below) runs the pick and place it describes.

type Props = { variant: SceneVariant; className?: string };

const BLUE = "#5aa0d8";
const DUR = "6s";

const BASE: Pt = [650, 160];
const PICK_X = 572;
const PLACE_X = 740;
const UP = 108;
const DOWN = 144; // fingers reach the part on the table
const TARGETS: Pt[] = [
  [PICK_X, UP],
  [PICK_X, DOWN],
  [PICK_X, DOWN],
  [PICK_X, UP],
  [PLACE_X, UP],
  [PLACE_X, DOWN],
  [PLACE_X, DOWN],
  [PLACE_X, UP],
  [PICK_X, UP],
];
const KEY_TIMES = "0;0.12;0.22;0.32;0.55;0.65;0.75;0.85;1";
const EASE = "0.4 0 0.2 1";
const KEY_SPLINES = Array(8).fill(EASE).join(";");

const SCRIPT = [
  { text: "def pick_place():", color: "#c792ea" },
  { text: "  cam.trigger()", color: "#9fe8b0" },
  { text: "  movel(p_pick)", color: "#82aaff" },
  { text: "  grip(True)", color: "#9fe8b0" },
  { text: "  movel(p_place)", color: "#82aaff" },
];

function Part({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x - 11} y={y} width="22" height="12" rx="2" fill="#f2a63d" stroke="#c7771a" />
      <rect x={x - 8} y={y + 2} width="16" height="2.5" rx="1" fill="#ffffff" opacity="0.5" />
    </g>
  );
}

export default function CognexUrScene({ variant, className }: Props) {
  const { id, ref, animate } = useScene();
  const anim = (props: React.SVGProps<SVGAnimateElement>) =>
    animate ? <animate dur={DUR} repeatCount="indefinite" {...props} /> : null;

  return (
    <SceneSvg variant={variant} className={className} title="Cognex → UR Configurator" titleColor="#2f6f9f" bandColor={BLUE}>
      <defs>
        <linearGradient id={id("wall")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f6fbfe" />
          <stop offset="100%" stopColor="#dcebf6" />
        </linearGradient>
        <linearGradient id={id("pedestal")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8c979e" />
          <stop offset="40%" stopColor="#c3ccd2" />
          <stop offset="100%" stopColor="#7d878e" />
        </linearGradient>
      </defs>

      <rect x="-200" y="-40" width="1360" height="360" fill={ref("wall")} />
      <rect x="-200" y="232" width="1360" height="80" fill="#c9d4dc" />

      {/* ---------- spreadsheet ---------- */}
      <rect x="60" y="44" width="176" height="150" rx="6" fill="#ffffff" stroke="#cfdbe4" strokeWidth="1.5" />
      <rect x="60" y="44" width="176" height="16" rx="6" fill="#1f7a45" />
      <rect x="60" y="54" width="176" height="6" fill="#1f7a45" />
      <text x="70" y="55.5" fontSize="7.5" fontWeight="800" fill="#ffffff" style={{ fontFamily: "Arial, sans-serif" }}>
        pick_points.xlsx
      </text>
      {["ID", "X", "Y", "Rz"].map((h, c) => (
        <text key={h} x={74 + c * 40} y="72" fontSize="7" fontWeight="800" fill="#1f7a45" style={{ fontFamily: "Arial, sans-serif" }}>
          {h}
        </text>
      ))}
      {Array.from({ length: 8 }, (_, r) => (
        <g key={r}>
          {[0, 1, 2, 3].map((c) => (
            <rect key={c} x={68 + c * 40} y={78 + r * 13} width="38" height="11" fill="#ffffff" stroke="#e1e8ee" strokeWidth="0.8" />
          ))}
          <rect x="72" y={81 + r * 13} width="12" height="4" rx="1" fill="#b8c4ce" />
          <rect x="112" y={81 + r * 13} width={14 + ((r * 7) % 12)} height="4" rx="1" fill="#d3dbe2" />
          <rect x="152" y={81 + r * 13} width={10 + ((r * 5) % 14)} height="4" rx="1" fill="#d3dbe2" />
          <rect x="192" y={81 + r * 13} width="12" height="4" rx="1" fill="#d3dbe2" />
        </g>
      ))}
      <rect x="67" y="77" width="162" height="13" fill={BLUE} opacity="0.18" stroke={BLUE}>
        {animate && (
          <animateTransform attributeName="transform" type="translate" values="0 0;0 13;0 26;0 39;0 52;0 65;0 78;0 91" keyTimes="0;0.125;0.25;0.375;0.5;0.625;0.75;0.875" calcMode="discrete" dur={DUR} repeatCount="indefinite" />
        )}
      </rect>

      {/* flow arrow */}
      <path d="M244 118 h28" stroke={BLUE} strokeWidth="3" strokeLinecap="round" strokeDasharray="4 5">
        {animate && <animate attributeName="stroke-dashoffset" from="18" to="0" dur="0.8s" repeatCount="indefinite" />}
      </path>
      <path d="M270 112 l7 6 -7 6" fill="none" stroke={BLUE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

      {/* ---------- configurator ---------- */}
      <rect x="286" y="36" width="206" height="170" rx="8" fill="#ffffff" stroke="#cfdbe4" strokeWidth="1.5" />
      <rect x="286" y="36" width="206" height="18" rx="8" fill="#2e3238" />
      <rect x="286" y="46" width="206" height="8" fill="#2e3238" />
      <rect x="294" y="41" width="10" height="8" rx="2" fill="#f5c400" />
      <text x="310" y="48.5" fontSize="7.5" fontWeight="800" fill="#ffffff" style={{ fontFamily: "Arial, sans-serif" }}>
        Cognex → UR Configurator
      </text>
      {["Job file", "Camera IP", "Tool offset"].map((label, i) => (
        <g key={label}>
          <text x="296" y={70 + i * 17} fontSize="6.5" fontWeight="700" fill="#6b7580" style={{ fontFamily: "Arial, sans-serif" }}>
            {label}
          </text>
          <rect x="344" y={63 + i * 17} width="138" height="10" rx="2" fill="#f4f7fa" stroke="#d3dde5" />
          <rect x="348" y={66.5 + i * 17} width={40 + i * 18} height="3" rx="1" fill="#b8c4ce" />
        </g>
      ))}
      {/* generate button */}
      <g>
        <rect x="344" y="113" width="90" height="16" rx="8" fill={BLUE}>
          {anim({ attributeName: "fill", values: `${BLUE};${BLUE};#2f7fbf;${BLUE};${BLUE}`, keyTimes: "0;0.07;0.08;0.12;1" })}
        </rect>
        <text x="389" y="124" textAnchor="middle" fontSize="7.5" fontWeight="800" fill="#ffffff" style={{ fontFamily: "Arial, sans-serif" }}>
          Generate Script
        </text>
      </g>
      {/* script output */}
      <rect x="294" y="136" width="190" height="62" rx="3" fill="#1b2230" />
      <g fontSize="6.8" fontWeight="700" style={{ fontFamily: "'Courier New', monospace" }}>
        {SCRIPT.map((line, i) => {
          const at = 0.1 + i * 0.05;
          return (
            <text key={i} x="300" y={147 + i * 11} fill={line.color} opacity={animate ? 0 : 1}>
              {anim({ attributeName: "opacity", values: "0;0;1;1;0", keyTimes: `0;${at};${at + 0.01};0.95;1` })}
              {line.text}
            </text>
          );
        })}
      </g>
      {/* cursor */}
      <g transform={animate ? undefined : "translate(420 124)"}>
        {animate && (
          <animateTransform attributeName="transform" type="translate" values="470 190;470 190;420 124;420 124;470 190" keyTimes="0;0.02;0.07;0.14;0.3" calcMode="spline" keySplines="0 0 1 1;0.4 0 0.2 1;0 0 1 1;0.4 0 0.2 1" dur={DUR} repeatCount="indefinite" />
        )}
        <path d="M0 0 L0 14 L4 10.5 L7 17 L9.5 16 L6.5 9.5 L11.5 9.5 Z" fill="#ffffff" stroke="#1d2024" strokeWidth="1.2" strokeLinejoin="round" />
      </g>

      {/* ---------- cell ---------- */}
      {/* pick and place tables */}
      <rect x={PICK_X - 30} y="206" width="60" height="6" rx="2" fill="#8d969e" />
      <rect x={PICK_X - 26} y="212" width="5" height="22" fill="#8d969e" />
      <rect x={PICK_X + 21} y="212" width="5" height="22" fill="#8d969e" />
      <rect x={PLACE_X - 30} y="206" width="60" height="6" rx="2" fill="#8d969e" />
      <rect x={PLACE_X - 26} y="212" width="5" height="22" fill="#8d969e" />
      <rect x={PLACE_X + 21} y="212" width="5" height="22" fill="#8d969e" />
      <rect x={PLACE_X - 24} y="202" width="48" height="4" rx="1" fill="#4f9d69" opacity="0.5" />

      <g opacity="1">
        {anim({ attributeName: "opacity", values: "1;1;0;0;1", keyTimes: "0;0.22;0.23;0.92;1" })}
        <Part x={PICK_X} y={194} />
      </g>
      <g opacity="0">
        {anim({ attributeName: "opacity", values: "0;0;1;1;0", keyTimes: "0;0.74;0.75;0.9;0.95" })}
        <Part x={PLACE_X} y={190} />
      </g>

      {/* pedestal */}
      <rect x={BASE[0] - 26} y={BASE[1] + 28} width="52" height="46" rx="3" fill={ref("pedestal")} />
      <rect x={BASE[0] - 32} y={BASE[1] + 26} width="64" height="6" rx="2" fill="#5f6a71" />

      <RobotArm base={BASE} targets={TARGETS} keyTimes={KEY_TIMES} keySplines={KEY_SPLINES} dur={DUR} animate={animate} restIndex={3}>
        <Gripper />
        {/* part in the gripper while it's carried */}
        <g opacity="0">
          {anim({ attributeName: "opacity", values: "0;0;1;1;0;0", keyTimes: "0;0.22;0.23;0.74;0.75;1" })}
          <Part x={0} y={12} />
        </g>
        <g transform="translate(24 -30) scale(0.7)">
          <SmartCamera
            flash={
              <circle cx="0" cy="31" r="9" fill="#fff2b8" opacity="0">
                {anim({ attributeName: "opacity", values: "0;0.9;0;0", keyTimes: "0;0.03;0.1;1" })}
              </circle>
            }
          />
        </g>
      </RobotArm>
    </SceneSvg>
  );
}
