"use client";

import { SceneSvg, useScene, type SceneVariant } from "./SceneSvg";
import { RobotArm, SmartCamera, type Pt } from "./parts";
import { EDUCATION, NAME } from "@/lib/site";

// About Me: my Mii at a desk, half software, half hardware. Code types itself
// out on the laptop on one side while a little UR arm inspects parts with its
// camera on the other, and the Mii waves hello. On the splash, a "right now"
// card sits on the left and a few quick facts on the right.

type Props = { variant: SceneVariant; className?: string };

const BLUE = "#3b82c4";
const INK = "#3a3a3f";
const SKIN = "#f5d0ac";
const HAIR = "#2b2522";
const SHIRT = "#3b82c4";
const DUR = "7s";
const DESK_Y = 200;

// the arm is drawn at half size; these are in its own (unscaled) frame
const ARM_AT = { x: 606, y: DESK_Y - 15.5, scale: 0.5 };
const ARM_BASE: Pt = [0, 0];
const ARM_TARGETS: Pt[] = [
  [100, -80],
  [100, -50],
  [124, -104],
  [164, -50],
  [124, -104],
  [100, -80],
];
const ARM_TIMES = "0;0.14;0.36;0.56;0.8;1";
const ARM_SPLINES = Array(5).fill("0.45 0 0.25 1").join(";");

// where the camera fires, as fractions of DUR (when it arrives over each part)
const SNAPS = [0.14, 0.56];

const CODE = [
  { w: 46, c: "#c792ea", indent: 0 },
  { w: 62, c: "#82aaff", indent: 8 },
  { w: 38, c: "#c3e88d", indent: 16 },
  { w: 54, c: "#89ddff", indent: 16 },
  { w: 30, c: "#f78c6c", indent: 8 },
  { w: 58, c: "#82aaff", indent: 8 },
  { w: 22, c: "#c792ea", indent: 0 },
];

const FACTS = [
  { icon: "pin", text: "Toronto, ON" },
  { icon: "cap", text: `TMU CS '26 · ${EDUCATION.honours}` },
  { icon: "gear", text: "Robots, vision & code" },
];

function FactIcon({ kind, x, y }: { kind: string; x: number; y: number }) {
  const s = { fill: "none", stroke: BLUE, strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="12" fill="#eaf5fc" />
      {kind === "pin" && (
        <>
          <path d="M0 6 C-5 0 -5.5 -2 -5.5 -3.5 A5.5 5.5 0 0 1 5.5 -3.5 C5.5 -2 5 0 0 6 Z" {...s} />
          <circle cy="-3.5" r="1.8" fill={BLUE} />
        </>
      )}
      {kind === "cap" && (
        <>
          <path d="M-7 -2 L0 -5.5 L7 -2 L0 1.5 Z" {...s} />
          <path d="M-4 0 V3.5 Q0 6 4 3.5 V0" {...s} />
        </>
      )}
      {kind === "gear" && (
        <>
          <circle r="3.2" {...s} />
          <path d="M0 -7V-4.5M0 4.5V7M-7 0H-4.5M4.5 0H7M-5 -5L-3.2 -3.2M3.2 3.2L5 5M-5 5L-3.2 3.2M3.2 -3.2L5 -5" {...s} />
        </>
      )}
    </g>
  );
}

export default function AboutScene({ variant, className }: Props) {
  const { id, ref, animate } = useScene();
  const anim = (props: React.SVGProps<SVGAnimateElement>) => (animate ? <animate dur={DUR} repeatCount="indefinite" {...props} /> : null);
  const float = (dur: string, dy = 3) =>
    animate ? <animateTransform attributeName="transform" type="translate" values={`0 0;0 -${dy};0 0`} dur={dur} repeatCount="indefinite" /> : null;
  const flashTimes = `0;${SNAPS[0]};${SNAPS[0] + 0.03};${SNAPS[1]};${SNAPS[1] + 0.03};1`;

  return (
    <SceneSvg variant={variant} className={className} title="About Me" titleColor="#2a5f93" bandColor={BLUE}>
      <defs>
        <linearGradient id={id("wall")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f7fbfe" />
          <stop offset="100%" stopColor="#e2f0fa" />
        </linearGradient>
        <linearGradient id={id("sky")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8fd3ee" />
          <stop offset="100%" stopColor="#d5f0fb" />
        </linearGradient>
        <linearGradient id={id("desk")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f3e6cf" />
          <stop offset="100%" stopColor="#e3cfae" />
        </linearGradient>
        <linearGradient id={id("deskFront")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dcc6a2" />
          <stop offset="100%" stopColor="#cdb48b" />
        </linearGradient>
        <clipPath id={id("window")}>
          <rect x="560" y="26" width="150" height="92" rx="6" />
        </clipPath>
      </defs>

      {/* ---------- room ---------- */}
      <rect x="-200" y="-40" width="1360" height="360" fill={ref("wall")} />
      <g opacity="0.5">
        {Array.from({ length: 30 }, (_, i) => (
          <rect key={i} x="-200" y={-40 + i * 8} width="1360" height="1" fill="#d8e9f5" />
        ))}
      </g>

      {/* window with drifting clouds */}
      <rect x="554" y="20" width="162" height="104" rx="9" fill="#ffffff" stroke="#c9dceb" strokeWidth="2" />
      <g clipPath={ref("window")}>
        <rect x="560" y="26" width="150" height="92" fill={ref("sky")} />
        <g fill="#ffffff" opacity="0.95">
          {animate && <animateTransform attributeName="transform" type="translate" values="-60 0;60 0" dur="18s" repeatCount="indefinite" />}
          <ellipse cx="600" cy="60" rx="22" ry="9" />
          <ellipse cx="614" cy="54" rx="14" ry="9" />
          <ellipse cx="672" cy="88" rx="18" ry="7" />
          <ellipse cx="684" cy="83" rx="11" ry="7" />
        </g>
      </g>
      <line x1="635" y1="26" x2="635" y2="118" stroke="#ffffff" strokeWidth="4" />
      <line x1="560" y1="72" x2="710" y2="72" stroke="#ffffff" strokeWidth="4" />

      {/* pennant on the wall */}
      <g transform="translate(236 40)">
        {animate && <animateTransform attributeName="transform" type="rotate" values="-2 0 0;2 0 0;-2 0 0" dur="5s" repeatCount="indefinite" additive="sum" />}
        <path d="M0 0 L66 14 L0 28 Z" fill="#004c9b" />
        <text x="8" y="18" fontSize="9" fontWeight="900" fill="#ffd100" style={{ fontFamily: "var(--font-nunito), Arial, sans-serif" }}>
          TMU
        </text>
      </g>

      {/* ---------- the Mii ---------- */}
      <g>
        {float("3.2s", 2)}
        {/* torso (the desk hides the rest) */}
        <path d="M436 206 V172 Q436 146 462 144 H498 Q524 146 524 172 V206 Z" fill={SHIRT} />
        <path d="M470 144 L480 156 L490 144 Z" fill="#ffffff" opacity="0.9" />
        <rect x="473" y="134" width="14" height="12" rx="4" fill={SKIN} />

        {/* left arm, typing on the laptop */}
        <g>
          {animate && <animateTransform attributeName="transform" type="translate" values="0 0;-1.5 1;0 0;1 0.5;0 0" dur="0.9s" repeatCount="indefinite" />}
          <path d="M446 158 Q424 176 414 194" fill="none" stroke={SHIRT} strokeWidth="15" strokeLinecap="round" />
          <circle cx="412" cy="196" r="7.5" fill={SKIN} />
        </g>

        {/* right arm, waving now and then */}
        <g>
          {animate && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 514 156;0 514 156;-16 514 156;6 514 156;-16 514 156;6 514 156;0 514 156;0 514 156"
              keyTimes="0;0.5;0.58;0.66;0.74;0.82;0.9;1"
              dur={DUR}
              repeatCount="indefinite"
            />
          )}
          <path d="M514 156 Q540 140 548 112" fill="none" stroke={SHIRT} strokeWidth="15" strokeLinecap="round" />
          <circle cx="549" cy="106" r="9" fill={SKIN} />
        </g>

        {/* head */}
        <ellipse cx="444" cy="104" rx="6" ry="9" fill={SKIN} />
        <ellipse cx="516" cy="104" rx="6" ry="9" fill={SKIN} />
        <ellipse cx="480" cy="100" rx="35" ry="39" fill={SKIN} />
        <path d="M444 98 Q442 58 480 58 Q520 58 516 98 Q510 80 494 76 Q476 88 452 84 Q446 90 444 98 Z" fill={HAIR} />
        <path d="M462 94 q6 -4 12 0 M486 94 q6 -4 12 0" fill="none" stroke={HAIR} strokeWidth="2.6" strokeLinecap="round" />
        <g fill={HAIR}>
          <ellipse cx="468" cy="105" rx="3.4" ry="5">
            {animate && <animate attributeName="ry" values="5;5;0.6;5;5" keyTimes="0;0.9;0.93;0.96;1" dur="4s" repeatCount="indefinite" />}
          </ellipse>
          <ellipse cx="492" cy="105" rx="3.4" ry="5">
            {animate && <animate attributeName="ry" values="5;5;0.6;5;5" keyTimes="0;0.9;0.93;0.96;1" dur="4s" repeatCount="indefinite" />}
          </ellipse>
        </g>
        <ellipse cx="458" cy="118" rx="6" ry="3.5" fill="#f29a9a" opacity="0.35" />
        <ellipse cx="502" cy="118" rx="6" ry="3.5" fill="#f29a9a" opacity="0.35" />
        <path d="M478 112 q2 4 4 0" fill="none" stroke="#d9a47e" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M468 122 Q480 132 492 122" fill="none" stroke="#9c4a3c" strokeWidth="2.6" strokeLinecap="round" />
      </g>

      {/* ---------- desk ---------- */}
      <rect x="196" y={DESK_Y} width="568" height="12" rx="3" fill={ref("desk")} stroke="#cdb892" />
      <rect x="206" y={DESK_Y + 12} width="548" height="120" fill={ref("deskFront")} />
      <rect x="206" y={DESK_Y + 12} width="548" height="4" fill="#b99f76" opacity="0.5" />

      {/* laptop, screen turned toward us, code typing itself out */}
      <rect x="296" y="116" width="118" height="78" rx="6" fill="#2e3238" />
      <rect x="301" y="121" width="108" height="66" rx="2" fill="#0f1a24" />
      {CODE.map((line, i) => {
        const at = 0.04 + i * 0.1;
        return (
          <rect key={i} x={308 + line.indent} y={128 + i * 8} height="4" rx="2" fill={line.c} width={animate ? 0 : line.w}>
            {anim({ attributeName: "width", values: `0;0;${line.w};${line.w};0`, keyTimes: `0;${at};${at + 0.08};0.94;1` })}
          </rect>
        );
      })}
      <rect x="308" y="184" width="5" height="1.5" fill="#ffffff">
        {animate && <animate attributeName="opacity" values="1;0;1" dur="0.9s" calcMode="discrete" keyTimes="0;0.5;1" repeatCount="indefinite" />}
      </rect>
      <path d="M288 194 H422 L430 201 H280 Z" fill="#c9d1d8" stroke="#a3adb5" strokeWidth="1" />
      <circle cx="355" cy="118.5" r="1.2" fill="#5b636a" />

      {/* mug */}
      <g>
        <rect x="248" y="178" width="24" height="22" rx="4" fill="#ffffff" stroke="#c7d2db" />
        <path d="M272 184 q8 0 8 6 q0 6 -8 6" fill="none" stroke="#c7d2db" strokeWidth="3" />
        <path d="M254 172 q-4 -6 0 -12 M262 172 q-4 -6 0 -12" fill="none" stroke="#c7d2db" strokeWidth="1.6" strokeLinecap="round" opacity="0.8">
          {animate && <animate attributeName="opacity" values="0.1;0.8;0.1" dur="3s" repeatCount="indefinite" />}
        </path>
      </g>

      {/* nameplate */}
      <path d="M432 200 L440 186 H520 L528 200 Z" fill="#ffffff" stroke="#c7d2db" />
      <text x="480" y="197" textAnchor="middle" fontSize="7.5" fontWeight="900" letterSpacing="0.6" fill={INK} style={{ fontFamily: "var(--font-nunito), Arial, sans-serif" }}>
        {NAME.toUpperCase()}
      </text>

      {/* ---------- the little robot, inspecting parts ---------- */}
      {[656, 688].map((x, i) => (
        <g key={x}>
          <rect x={x - 7} y={DESK_Y - 8} width="14" height="8" rx="1.5" fill={i === 0 ? "#f2a63d" : "#4f9d69"} />
          <rect x={x - 7} y={DESK_Y - 8} width="14" height="2" rx="1" fill="#ffffff" opacity="0.4" />
        </g>
      ))}
      <g transform={`translate(${ARM_AT.x} ${ARM_AT.y}) scale(${ARM_AT.scale})`}>
        <RobotArm
          base={ARM_BASE}
          targets={ARM_TARGETS}
          keyTimes={ARM_TIMES}
          keySplines={ARM_SPLINES}
          dur={DUR}
          animate={animate}
          restIndex={1}
        >
          <SmartCamera
            flash={
              <ellipse cx="0" cy="33" rx="14" ry="4" fill="#ffffff" opacity={animate ? 0 : 0.8}>
                {anim({ attributeName: "opacity", values: "0;1;0;1;0;0", keyTimes: flashTimes })}
              </ellipse>
            }
          />
        </RobotArm>
      </g>

      {/* ---------- splash only: right now, and quick facts ---------- */}
      {variant === "splash" && (
        <g style={{ fontFamily: "Arial, sans-serif" }}>
          <g>
            {float("5s")}
            <rect x="50" y="64" width="148" height="128" rx="16" fill="#ffffff" stroke="#b9dcf2" strokeWidth="2" />
            <circle cx="70" cy="88" r="4.5" fill="#e05a4e">
              {animate && <animate attributeName="opacity" values="1;0.3;1" dur="1.4s" repeatCount="indefinite" />}
            </circle>
            <text x="80" y="92" fontSize="9.5" fontWeight="900" letterSpacing="2" fill="#e05a4e">
              RIGHT NOW
            </text>
            <text x="64" y="122" fontSize="18" fontWeight="900" fill={INK} style={{ fontFamily: "var(--font-nunito), Arial, sans-serif" }}>
              Application
            </text>
            <text x="64" y="143" fontSize="18" fontWeight="900" fill={INK} style={{ fontFamily: "var(--font-nunito), Arial, sans-serif" }}>
              Engineer
            </text>
            <rect x="64" y="156" width="4" height="22" rx="2" fill="#4f9d69" />
            <text x="74" y="165" fontSize="9" fontWeight="700" fill="#6b6b72">
              at
            </text>
            <text x="74" y="177" fontSize="10.5" fontWeight="800" fill="#3d7a52">
              Shelley Automation
            </text>
          </g>

          <g>
            {float("5.6s")}
            {FACTS.map((f, i) => (
              <g key={f.icon}>
                <rect x="738" y={70 + i * 42} width="176" height="32" rx="16" fill="#ffffff" stroke="#b9dcf2" strokeWidth="1.5" />
                <FactIcon kind={f.icon} x={756} y={86 + i * 42} />
                <text x="774" y={90 + i * 42} fontSize="9.5" fontWeight="800" fill={INK}>
                  {f.text}
                </text>
              </g>
            ))}
          </g>
        </g>
      )}
    </SceneSvg>
  );
}
