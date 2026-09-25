"use client";

import { SceneSvg, useScene, type SceneVariant } from "./SceneSvg";
import { RobotArm, SmartCamera, type Pt } from "./parts";

// Vision-guided robotics, the way it actually runs on a line:
//   1. the UR moves the wrist camera over the infeed and snaps a picture
//   2. the vision tool finds the part and reports its pose (X, Y, θ)
//   3. the pose goes to the robot, the tool turns to match θ
//   4. the UR picks the part with the vacuum cup and seats it in the fixture
// The floating display on the left is the camera's view of the same thing.

type Props = { variant: SceneVariant; className?: string };

const GREEN = "#4f9d69";
const CYAN = "#5ad7ff";
const DUR = "8s";

// the arm is drawn 1.2× so it can reach from infeed to fixture
const BASE: Pt = [440, 168];
const S = 1.2;
const toLocal = ([x, y]: Pt): Pt => [BASE[0] + (x - BASE[0]) / S, BASE[1] + (y - BASE[1]) / S];

const PART_X = 566; // part to pick, on the infeed
const CUP_DX = 26 * S; // vacuum cup sits this far right of the flange centre
const FIXTURE_X = 710;
const HIGH = 70;
const LOW = 106.4; // cup touches the top of a part on a table

const SNAP: Pt = [PART_X, HIGH];
const ABOVE_PICK: Pt = [PART_X - CUP_DX, HIGH];
const PICK: Pt = [PART_X - CUP_DX, LOW];
const ABOVE_PLACE: Pt = [FIXTURE_X - CUP_DX, HIGH];
const PLACE: Pt = [FIXTURE_X - CUP_DX, LOW];

const TARGETS = [SNAP, SNAP, ABOVE_PICK, PICK, PICK, ABOVE_PICK, ABOVE_PLACE, PLACE, PLACE, ABOVE_PLACE, SNAP].map(toLocal);
const KEY_TIMES = "0;0.1;0.18;0.26;0.32;0.4;0.58;0.66;0.72;0.8;1";
const KEY_SPLINES = Array(10).fill("0.45 0 0.2 1").join(";");

// camera view (top-down) of the infeed tray
const VIEW = { x: 76, y: 58, w: 160, h: 108 };
const FOUND = { x: 150, y: 116, theta: 32 };
const OTHERS = [
  { x: 104, y: 88, theta: -18 },
  { x: 204, y: 90, theta: 64 },
  { x: 206, y: 144, theta: -40 },
];
const READOUT = [
  ["X", "412.6"],
  ["Y", "128.3"],
  ["θ", "32.4°"],
  ["SCORE", "0.98"],
];

function TopPart({ x, y, theta, color = "#f2a63d" }: { x: number; y: number; theta: number; color?: string }) {
  return (
    <g transform={`rotate(${theta} ${x} ${y})`}>
      <rect x={x - 17} y={y - 8} width="34" height="16" rx="3" fill={color} stroke="#c7771a" strokeWidth="1" />
      <circle cx={x - 8} cy={y} r="3" fill="#8a4d12" />
      <circle cx={x + 8} cy={y} r="3" fill="#8a4d12" />
    </g>
  );
}

function SidePart({ x, y, w = 30 }: { x: number; y: number; w?: number }) {
  return (
    <g>
      <rect x={x - w / 2} y={y} width={w} height="12" rx="2" fill="#f2a63d" stroke="#c7771a" />
      <rect x={x - w / 2 + 3} y={y + 2} width={w - 6} height="2.5" rx="1" fill="#ffffff" opacity="0.45" />
    </g>
  );
}

export default function ShelleyScene({ variant, className }: Props) {
  const { id, ref, animate } = useScene();
  const anim = (props: React.SVGProps<SVGAnimateElement>) =>
    animate ? <animate dur={DUR} repeatCount="indefinite" {...props} /> : null;
  // an element that fades in and out on the cycle; `still` is its reduced-motion state
  const on = (keyTimes: string, values = "0;0;1;1;0", still = 1) => ({
    opacity: animate ? Number(values.split(";")[0]) : still,
    child: anim({ attributeName: "opacity", values, keyTimes }),
  });

  const flash = on("0;0.03;0.05;0.1;0.14", "0;0;1;0.2;0", 0);
  const found = on("0;0.08;0.1;0.94;1");
  const pickedOnTable = on("0;0.31;0.32;0.95;1", "1;1;0;0;1");
  const carried = on("0;0.31;0.32;0.71;0.72;1", "0;0;1;1;0;0", 0);
  const placed = on("0;0.71;0.72;0.97;1", "0;0;1;1;0", 0);
  const link = on("0;0.08;0.1;0.2;0.24", "0;0;1;1;0", 0);
  const aligning = on("0;0.12;0.14;0.32;0.34");
  const executing = on("0;0.24;0.26;0.9;0.92");

  return (
    <SceneSvg variant={variant} className={className} title="Shelley Automation" titleColor="#3f7a56" bandColor={GREEN}>
      <defs>
        <linearGradient id={id("bg")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#081019" />
          <stop offset="100%" stopColor="#10263a" />
        </linearGradient>
        <radialGradient id={id("aura")} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2c6a8f" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#2c6a8f" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id("spot")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dff6ff" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#dff6ff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={id("floor")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f2233" />
          <stop offset="100%" stopColor="#060d14" />
        </linearGradient>
        <linearGradient id={id("steel")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2a333b" />
          <stop offset="45%" stopColor="#56626c" />
          <stop offset="100%" stopColor="#222a31" />
        </linearGradient>
        <linearGradient id={id("fov")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7cfc9a" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#7cfc9a" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id={id("glass")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5ad7ff" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#5ad7ff" stopOpacity="0.05" />
        </linearGradient>
        <pattern id={id("grid")} width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M28 0H0V28" fill="none" stroke="#1d3a52" strokeWidth="1" />
        </pattern>
        <pattern id={id("hazard")} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="10" height="10" fill="#f5c400" />
          <rect width="5" height="10" fill="#1a1d21" />
        </pattern>
        <clipPath id={id("view")}>
          <rect x={VIEW.x} y={VIEW.y} width={VIEW.w} height={VIEW.h} rx="3" />
        </clipPath>
      </defs>

      {/* ---------- the cell ---------- */}
      <rect x="-200" y="-40" width="1360" height="280" fill={ref("bg")} />
      <rect x="-200" y="-40" width="1360" height="272" fill={ref("grid")} opacity="0.6" />
      <ellipse cx="560" cy="150" rx="330" ry="130" fill={ref("aura")} />
      <polygon points="470,-10 650,-10 760,232 360,232" fill={ref("spot")} />
      <rect x="-200" y="232" width="1360" height="80" fill={ref("floor")} />
      <g stroke={CYAN} strokeWidth="1" opacity="0.22">
        {Array.from({ length: 25 }, (_, i) => (
          <line key={i} x1={480 + (i - 12) * 40} y1="232" x2={480 + (i - 12) * 110} y2="310" />
        ))}
        {[244, 262, 288].map((y) => (
          <line key={y} x1="-200" y1={y} x2="1160" y2={y} />
        ))}
      </g>
      <line x1="-200" y1="232" x2="1160" y2="232" stroke={CYAN} strokeWidth="1.5" opacity="0.55" />

      {/* light-curtain posts */}
      {[352, 812].map((x) => (
        <g key={x}>
          <rect x={x - 4} y="96" width="8" height="136" rx="2" fill="#1d252c" stroke="#33414c" />
          {Array.from({ length: 10 }, (_, i) => (
            <circle key={i} cx={x} cy={104 + i * 12.5} r="1.6" fill="#ff5a4e">
              {animate && <animate attributeName="opacity" values="1;0.35;1" dur="1.4s" begin={`${i * 0.1}s`} repeatCount="indefinite" />}
            </circle>
          ))}
          <rect x={x - 6} y="230" width="12" height="4" rx="1" fill="#33414c" />
        </g>
      ))}

      {/* ---------- infeed and fixture ---------- */}
      {[
        { x: 566, w: 96 },
        { x: FIXTURE_X, w: 80 },
      ].map((t) => (
        <g key={t.x}>
          <rect x={t.x - t.w / 2} y="206" width={t.w} height="7" rx="2" fill="#3a4550" stroke="#56646f" />
          <rect x={t.x - t.w / 2 + 5} y="213" width="5" height="21" fill="#2a333b" />
          <rect x={t.x + t.w / 2 - 10} y="213" width="5" height="21" fill="#2a333b" />
        </g>
      ))}
      {/* parts lying at random on the infeed */}
      <SidePart x={598} y={194} w={22} />
      <g opacity={pickedOnTable.opacity}>
        {pickedOnTable.child}
        <SidePart x={PART_X} y={194} />
      </g>
      {/* fixture nests, parts all squared up */}
      {[-24, 0, 24].map((dx) => (
        <rect key={dx} x={FIXTURE_X + dx - 11} y="200" width="22" height="6" rx="1" fill="#1d252c" stroke={GREEN} strokeWidth="0.8" />
      ))}
      <SidePart x={FIXTURE_X - 24} y={188} w={20} />
      <SidePart x={FIXTURE_X + 24} y={188} w={20} />
      <g opacity={placed.opacity}>
        {placed.child}
        <SidePart x={FIXTURE_X} y={188} w={20} />
      </g>
      <rect x={FIXTURE_X - 38} y="236" width="76" height="5" fill={ref("hazard")} opacity="0.8" />

      {/* ---------- UR on its pedestal ---------- */}
      <rect x={BASE[0] - 30} y="204" width="60" height="30" rx="3" fill={ref("steel")} />
      <rect x={BASE[0] - 36} y="202" width="72" height="6" rx="2" fill="#56626c" />
      <rect x={BASE[0] - 30} y="216" width="60" height="3" fill={GREEN} />
      <rect x={BASE[0] - 44} y="236" width="88" height="5" fill={ref("hazard")} opacity="0.8" />

      <g transform={`translate(${BASE[0]} ${BASE[1]}) scale(${S}) translate(${-BASE[0]} ${-BASE[1]})`}>
        <RobotArm base={BASE} targets={TARGETS} keyTimes={KEY_TIMES} keySplines={KEY_SPLINES} dur={DUR} animate={animate} restIndex={0}>
          {/* adapter plate carrying the camera and the vacuum cup */}
          <rect x="-20" y="0" width="52" height="4" rx="1" fill="#4a5359" />
          <g transform="translate(0 4)">
            <SmartCamera
              flash={
                <g opacity={flash.opacity}>
                  {flash.child}
                  <ellipse cx="0" cy="31" rx="11" ry="3" fill="#ffffff" />
                </g>
              }
            />
          </g>
          {/* field of view as it snaps */}
          <g opacity={flash.opacity}>
            {flash.child}
            <polygon points="-5,36 5,36 30,70 -30,70" fill={ref("fov")} />
          </g>
          <rect x="23" y="4" width="6" height="30" rx="1" fill="#8d969e" />
          <rect x="21" y="16" width="10" height="4" rx="1" fill="#4a5359" />
          <polygon points="20,34 32,34 34,40 18,40" fill="#1d2024" />
          <g opacity={carried.opacity}>
            {carried.child}
            <rect x="13.5" y="40" width="25" height="10" rx="2" fill="#f2a63d" stroke="#c7771a" strokeWidth="0.8" />
          </g>
        </RobotArm>
      </g>

      {/* ---------- vision display: the camera's view of the same pick ---------- */}
      <g>
        {animate && <animateTransform attributeName="transform" type="translate" values="0 0;0 -3;0 0" dur="5s" repeatCount="indefinite" />}
        <rect x="64" y="34" width="256" height="170" rx="8" fill={ref("glass")} stroke={CYAN} strokeWidth="1.2" strokeOpacity="0.6" />
        <path d="M64 50 v-8 a8 8 0 0 1 8 -8 h14" fill="none" stroke={CYAN} strokeWidth="2.5" />
        <path d="M320 188 v8 a8 8 0 0 1 -8 8 h-14" fill="none" stroke={CYAN} strokeWidth="2.5" />
        <text x="76" y="49" fontSize="8" fontWeight="800" letterSpacing="1.4" fill={CYAN} style={{ fontFamily: "'Courier New', monospace" }}>
          ROBOT GUIDANCE
        </text>
        <circle cx="306" cy="46" r="3" fill="#ff5a4e">
          {animate && <animate attributeName="opacity" values="1;0.2;1" dur="1s" repeatCount="indefinite" />}
        </circle>
        <text x="298" y="49" textAnchor="end" fontSize="6.5" fontWeight="700" fill="#8fb4c9" style={{ fontFamily: "'Courier New', monospace" }}>
          LIVE
        </text>

        {/* live image */}
        <g clipPath={ref("view")}>
          <rect x={VIEW.x} y={VIEW.y} width={VIEW.w} height={VIEW.h} fill="#1c2a33" />
          <rect x={VIEW.x} y={VIEW.y} width={VIEW.w} height={VIEW.h} fill={ref("grid")} opacity="0.7" />
          {OTHERS.map((p, i) => (
            <TopPart key={i} {...p} color="#d98f2e" />
          ))}
          <g opacity={pickedOnTable.opacity}>
            {pickedOnTable.child}
            <TopPart {...FOUND} />
          </g>
          {/* exposure flash */}
          <rect x={VIEW.x} y={VIEW.y} width={VIEW.w} height={VIEW.h} fill="#ffffff" opacity="0">
            {anim({ attributeName: "opacity", values: "0;0;0.55;0;0", keyTimes: "0;0.05;0.06;0.1;1" })}
          </rect>
          {/* pattern match with pose axes */}
          <g opacity={found.opacity}>
            {found.child}
            <g transform={`rotate(${FOUND.theta} ${FOUND.x} ${FOUND.y})`}>
              <rect x={FOUND.x - 21} y={FOUND.y - 12} width="42" height="24" rx="4" fill="none" stroke="#7cfc9a" strokeWidth="1.6" strokeDasharray="5 3" />
              <line x1={FOUND.x} y1={FOUND.y} x2={FOUND.x + 30} y2={FOUND.y} stroke="#ff5a4e" strokeWidth="1.8" />
              <path d={`M${FOUND.x + 30} ${FOUND.y} l-5 -3 v6 z`} fill="#ff5a4e" />
              <line x1={FOUND.x} y1={FOUND.y} x2={FOUND.x} y2={FOUND.y - 24} stroke="#7cfc9a" strokeWidth="1.8" />
              <path d={`M${FOUND.x} ${FOUND.y - 24} l-3 5 h6 z`} fill="#7cfc9a" />
            </g>
            <circle cx={FOUND.x} cy={FOUND.y} r="3" fill="none" stroke="#ffffff" strokeWidth="1.2" />
          </g>
          {/* the tool turning to match θ before it goes in */}
          <g opacity={aligning.opacity}>
            {aligning.child}
            <g transform={animate ? undefined : `rotate(${FOUND.theta} ${FOUND.x} ${FOUND.y})`}>
              {animate && (
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  values={`0 ${FOUND.x} ${FOUND.y};0 ${FOUND.x} ${FOUND.y};${FOUND.theta} ${FOUND.x} ${FOUND.y};${FOUND.theta} ${FOUND.x} ${FOUND.y}`}
                  keyTimes="0;0.16;0.26;1"
                  calcMode="spline"
                  keySplines="0 0 1 1;0.4 0 0.2 1;0 0 1 1"
                  dur={DUR}
                  repeatCount="indefinite"
                />
              )}
              <circle cx={FOUND.x} cy={FOUND.y} r="13" fill="none" stroke={CYAN} strokeWidth="1.4" strokeDasharray="3 3" />
              <line x1={FOUND.x - 20} y1={FOUND.y} x2={FOUND.x + 20} y2={FOUND.y} stroke={CYAN} strokeWidth="1" opacity="0.8" />
            </g>
          </g>
        </g>
        <rect x={VIEW.x} y={VIEW.y} width={VIEW.w} height={VIEW.h} rx="3" fill="none" stroke="#33536a" />

        {/* pose readout */}
        <g fontSize="7.5" fontWeight="700" style={{ fontFamily: "'Courier New', monospace" }}>
          {READOUT.map(([k, v], i) => (
            <g key={k}>
              <text x="244" y={68 + i * 15} fill="#8fb4c9">
                {k}
              </text>
              <text x="310" y={68 + i * 15} textAnchor="end" fill="#e8fbff" opacity={found.opacity}>
                {found.child}
                {v}
              </text>
            </g>
          ))}
        </g>
        <g opacity={found.opacity}>
          {found.child}
          <rect x="244" y="126" width="66" height="14" rx="7" fill={GREEN} />
          <text x="277" y="136" textAnchor="middle" fontSize="7.5" fontWeight="900" letterSpacing="1" fill="#ffffff" style={{ fontFamily: "Arial, sans-serif" }}>
            FOUND
          </text>
        </g>
        {/* pose handed to the robot */}
        <rect x="76" y="174" width="234" height="20" rx="4" fill="#0b1822" stroke="#23405a" />
        <text x="84" y="187" fontSize="7" fontWeight="700" fill="#8fb4c9" style={{ fontFamily: "'Courier New', monospace" }}>
          → UR
        </text>
        <text x="112" y="187" fontSize="7" fontWeight="700" fill="#7cfc9a" opacity={link.opacity} style={{ fontFamily: "'Courier New', monospace" }}>
          {link.child}
          movel(p[.413,.128,.20,0,3.14,.57])
        </text>
        <text x="112" y="187" fontSize="7" fontWeight="700" fill="#e8fbff" opacity={executing.opacity} style={{ fontFamily: "'Courier New', monospace" }}>
          {executing.child}
          executing pick → place
        </text>
      </g>

      {/* data link from the camera to the display at the moment of the snap */}
      <path d={`M320 110 C400 110 460 60 ${PART_X - 4} 128`} fill="none" stroke={CYAN} strokeWidth="1.5" strokeDasharray="4 4" opacity={link.opacity}>
        {link.child}
        {animate && <animate attributeName="stroke-dashoffset" from="16" to="0" dur="0.5s" repeatCount="indefinite" />}
      </path>
    </SceneSvg>
  );
}
