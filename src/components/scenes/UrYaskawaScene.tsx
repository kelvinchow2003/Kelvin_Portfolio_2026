"use client";

import { SceneSvg, useScene, type SceneVariant } from "./SceneSvg";
import { Gripper, RobotArm, type Pt } from "./parts";

// Two robots, two languages, one interface. The UR picks a part and sets it
// on the shared table; the Yaskawa takes it the rest of the way. Up top the
// translator lines up each UR Script command with its INFORM equivalent as
// the move happens.

type Props = { variant: SceneVariant; className?: string };

const ORANGE = "#c0562f";
const DUR = "8s";
const UP = 108;
const DOWN = 144;

const UR_BASE: Pt = [262, 160];
const YA_BASE: Pt = [698, 160];
const UR_PICK = 336;
const HANDOFF = 480;
const YA_PLACE = 624;

// the UR works the first half of the cycle, the Yaskawa the second
const KEY_TIMES = "0;0.08;0.14;0.3;0.38;0.44;0.55;0.6;0.66;0.8;0.86;0.92;1";
const KEY_SPLINES = Array(12).fill("0.4 0 0.2 1").join(";");
const UR_TARGETS: Pt[] = [
  [UR_PICK, UP], [UR_PICK, DOWN], [UR_PICK, UP], [HANDOFF - 8, UP], [HANDOFF - 8, DOWN], [HANDOFF - 8, UP],
  [UR_PICK, UP], [UR_PICK, UP], [UR_PICK, UP], [UR_PICK, UP], [UR_PICK, UP], [UR_PICK, UP], [UR_PICK, UP],
];
const YA_TARGETS: Pt[] = [
  [YA_PLACE, UP], [YA_PLACE, UP], [YA_PLACE, UP], [YA_PLACE, UP], [YA_PLACE, UP], [YA_PLACE, UP],
  [HANDOFF + 8, UP], [HANDOFF + 8, DOWN], [HANDOFF + 8, UP], [YA_PLACE, UP], [YA_PLACE, DOWN], [YA_PLACE, UP], [YA_PLACE, UP],
];

const LINES = [
  { ur: "movej(p_pick)", inform: "MOVJ C00001 VJ=50" },
  { ur: "set_digital_out(0,True)", inform: "DOUT OT#(1) ON" },
  { ur: "movel(p_handoff)", inform: "MOVL C00002 V=200" },
  { ur: "set_digital_out(0,False)", inform: "DOUT OT#(1) OFF" },
];

function Part({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x - 10} y={y} width="20" height="12" rx="6" fill="#4f9d69" stroke="#2f7a4a" />
      <circle cx={x} cy={y + 6} r="2.5" fill="#2f7a4a" />
    </g>
  );
}

function Table({ x }: { x: number }) {
  return (
    <g>
      <rect x={x - 30} y="206" width="60" height="6" rx="2" fill="#8d969e" />
      <rect x={x - 26} y="212" width="5" height="22" fill="#8d969e" />
      <rect x={x + 21} y="212" width="5" height="22" fill="#8d969e" />
    </g>
  );
}

function Pedestal({ x, label, color }: { x: number; label: string; color: string }) {
  return (
    <g>
      <rect x={x - 26} y="188" width="52" height="46" rx="3" fill="#b3bcc3" />
      <rect x={x - 32} y="186" width="64" height="6" rx="2" fill="#5f6a71" />
      <rect x={x - 22} y="206" width="44" height="12" rx="2" fill={color} />
      <text x={x} y="215" textAnchor="middle" fontSize="7" fontWeight="900" letterSpacing="0.5" fill="#ffffff" style={{ fontFamily: "Arial, sans-serif" }}>
        {label}
      </text>
    </g>
  );
}

export default function UrYaskawaScene({ variant, className }: Props) {
  const { id, ref, animate } = useScene();
  const anim = (props: React.SVGProps<SVGAnimateElement>) =>
    animate ? <animate dur={DUR} repeatCount="indefinite" {...props} /> : null;
  const shown = (values: string, keyTimes: string, still: number) => ({
    opacity: animate ? values.split(";")[0] : still,
    child: anim({ attributeName: "opacity", values, keyTimes }),
  });

  const urCarry = shown("0;0;1;1;0;0", "0;0.08;0.09;0.38;0.39;1", 0);
  const yaCarry = shown("0;0;1;1;0;0", "0;0.6;0.61;0.86;0.87;1", 0);
  const atPick = shown("1;1;0;0;1", "0;0.08;0.09;0.95;1", 1);
  const atHandoff = shown("0;0;1;1;0;0", "0;0.38;0.39;0.6;0.61;1", 0);
  const atPlace = shown("0;0;1;1;0", "0;0.86;0.87;0.96;1", 0);

  return (
    <SceneSvg variant={variant} className={className} title="UR ↔ Yaskawa Translator" titleColor="#9a3f1e" bandColor={ORANGE}>
      <defs>
        <linearGradient id={id("wall")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fffaf6" />
          <stop offset="100%" stopColor="#f1e1d6" />
        </linearGradient>
      </defs>

      <rect x="-200" y="-40" width="1360" height="360" fill={ref("wall")} />
      <rect x="-200" y="232" width="1360" height="80" fill="#d9c8bb" />
      <rect x="-200" y="238" width="1360" height="3" fill="#f5c400" opacity="0.8" />

      {/* ---------- translator panel ---------- */}
      <rect x="338" y="18" width="284" height="90" rx="8" fill="#ffffff" stroke="#ead6c8" strokeWidth="1.5" />
      <text x="408" y="32" textAnchor="middle" fontSize="7.5" fontWeight="900" letterSpacing="0.8" fill="#3f6fa3" style={{ fontFamily: "Arial, sans-serif" }}>
        UR SCRIPT
      </text>
      <text x="552" y="32" textAnchor="middle" fontSize="7.5" fontWeight="900" letterSpacing="0.8" fill="#1f64b0" style={{ fontFamily: "Arial, sans-serif" }}>
        YASKAWA INFORM
      </text>
      <rect x="344" y="37" width="272" height="15" rx="3" fill={ORANGE} opacity="0.14" stroke={ORANGE} strokeWidth="0.8">
        {animate && (
          <animateTransform attributeName="transform" type="translate" values="0 0;0 16;0 32;0 48" keyTimes="0;0.25;0.5;0.75" calcMode="discrete" dur={DUR} repeatCount="indefinite" />
        )}
      </rect>
      <g fontSize="6.4" fontWeight="700" style={{ fontFamily: "'Courier New', monospace" }}>
        {LINES.map((l, i) => (
          <g key={i}>
            <text x="350" y={47 + i * 16} fill="#3a3f44">
              {l.ur}
            </text>
            <text x="486" y={47 + i * 16} fill="#3a3f44">
              {l.inform}
            </text>
          </g>
        ))}
      </g>
      <g>
        {animate && <animate attributeName="opacity" values="0.4;1;0.4" dur="1.2s" repeatCount="indefinite" />}
        <path d="M468 70 h10 M474 65 l5 5 -5 5 M476 84 h-10 M470 79 l-5 5 5 5" fill="none" stroke={ORANGE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* ---------- cell ---------- */}
      <Table x={UR_PICK} />
      <Table x={HANDOFF} />
      <Table x={YA_PLACE} />
      <rect x={HANDOFF - 24} y="202" width="48" height="4" rx="1" fill={ORANGE} opacity="0.4" />

      <g opacity={atPick.opacity}>
        {atPick.child}
        <Part x={UR_PICK} y={194} />
      </g>
      <g opacity={atHandoff.opacity}>
        {atHandoff.child}
        <Part x={HANDOFF} y={190} />
      </g>
      <g opacity={atPlace.opacity}>
        {atPlace.child}
        <Part x={YA_PLACE} y={194} />
      </g>

      <Pedestal x={UR_BASE[0]} label="UR" color="#3f6fa3" />
      <Pedestal x={YA_BASE[0]} label="YASKAWA" color="#1f64b0" />

      <RobotArm base={UR_BASE} targets={UR_TARGETS} keyTimes={KEY_TIMES} keySplines={KEY_SPLINES} dur={DUR} animate={animate} restIndex={0}>
        <Gripper />
        <g opacity={urCarry.opacity}>
          {urCarry.child}
          <Part x={0} y={12} />
        </g>
      </RobotArm>
      <RobotArm base={YA_BASE} targets={YA_TARGETS} keyTimes={KEY_TIMES} keySplines={KEY_SPLINES} dur={DUR} animate={animate} restIndex={0} look="yaskawa" mirror>
        <Gripper />
        <g opacity={yaCarry.opacity}>
          {yaCarry.child}
          <Part x={0} y={12} />
        </g>
      </RobotArm>
    </SceneSvg>
  );
}
