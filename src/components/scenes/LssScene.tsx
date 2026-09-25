"use client";

import { SceneSvg, useScene, type SceneVariant } from "./SceneSvg";
import { Monitor } from "./parts";

// A community pool on test day: a swimmer does lengths, the pace clock
// sweeps, and on the deck a laptop reads the CSV of results and prints a
// finished test sheet, which gets its checkmarks and drops into the folder.

type Props = { variant: SceneVariant; className?: string };

const BLUE = "#2e8bc0";
const DUR = "5s";
const PENNANTS = ["#e8463a", "#f5c400", "#2e8bc0", "#ffffff"];

function LaneRope({ y }: { y: number }) {
  return (
    <g>
      <line x1="-20" y1={y} x2="980" y2={y} stroke="#1c6f9e" strokeWidth="1" />
      {Array.from({ length: 100 }, (_, i) => (
        <ellipse key={i} cx={i * 10} cy={y} rx="4.4" ry="3" fill={i % 10 < 3 ? "#e8463a" : i % 10 < 7 ? "#ffffff" : "#2e5fb8"} />
      ))}
    </g>
  );
}

export default function LssScene({ variant, className }: Props) {
  const { id, ref, animate } = useScene();
  const anim = (props: React.SVGProps<SVGAnimateElement>) =>
    animate ? <animate dur={DUR} repeatCount="indefinite" {...props} /> : null;

  return (
    <SceneSvg variant={variant} className={className} title="LSS Test Sheet App" titleColor="#1f6d99" bandColor={BLUE}>
      <defs>
        <linearGradient id={id("wall")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f6fcff" />
          <stop offset="100%" stopColor="#dcf0f9" />
        </linearGradient>
        <linearGradient id={id("sky")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a9d8f7" />
          <stop offset="100%" stopColor="#e9f6fd" />
        </linearGradient>
        <linearGradient id={id("water")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6fd1f3" />
          <stop offset="100%" stopColor="#1e86c2" />
        </linearGradient>
        <clipPath id={id("printerOut")}>
          <rect x="420" y="0" width="200" height="128" />
        </clipPath>
      </defs>

      {/* ---------- pool hall ---------- */}
      <rect x="-200" y="-40" width="1360" height="220" fill={ref("wall")} />
      {Array.from({ length: 7 }, (_, i) => (
        <g key={i}>
          <rect x={20 + i * 140} y="28" width="118" height="80" rx="4" fill={ref("sky")} stroke="#c3dbe6" strokeWidth="4" />
          <line x1={79 + i * 140} y1="28" x2={79 + i * 140} y2="108" stroke="#c3dbe6" strokeWidth="3" />
          <path d={`M${30 + i * 140} 100 l20 -30 l14 18 l10 -12 l18 24 z`} fill="#bfe0c8" opacity="0.7" />
        </g>
      ))}

      {/* backstroke flags */}
      <g>
        {animate && <animateTransform attributeName="transform" type="translate" values="0 0;0 2;0 0" dur="3s" repeatCount="indefinite" />}
        <path d="M-20 34 Q480 62 980 34" fill="none" stroke="#7a8a99" strokeWidth="1.2" />
        {Array.from({ length: 34 }, (_, i) => {
          const x = i * 30 - 10;
          const t = (x + 20) / 1000;
          const y = 34 + 4 * t * (1 - t) * 28;
          return <polygon key={i} points={`${x - 8},${y} ${x + 8},${y} ${x},${y + 14}`} fill={PENNANTS[i % 4]} stroke="#d0d6db" strokeWidth="0.5" />;
        })}
      </g>

      {/* pace clock */}
      <circle cx="640" cy="140" r="27" fill="#ffffff" stroke="#2e3238" strokeWidth="4" />
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1="640" y1="116" x2="640" y2={i % 3 ? 119 : 121} stroke="#2e3238" strokeWidth={i % 3 ? 1 : 2} transform={`rotate(${i * 30} 640 140)`} />
      ))}
      <line x1="640" y1="146" x2="640" y2="118" stroke="#e8463a" strokeWidth="2" strokeLinecap="round">
        {animate && <animateTransform attributeName="transform" type="rotate" from="0 640 140" to="360 640 140" dur="6s" repeatCount="indefinite" />}
      </line>
      <circle cx="640" cy="140" r="2.5" fill="#2e3238" />

      {/* ---------- deck ---------- */}
      <rect x="-200" y="176" width="1360" height="20" fill="#e9eef0" />
      <g stroke="#d3dde2" strokeWidth="1">
        {Array.from({ length: 50 }, (_, i) => (
          <line key={i} x1={i * 22 - 20} y1="176" x2={i * 22 - 26} y2="196" />
        ))}
      </g>

      {/* lifeguard chair */}
      <g>
        <line x1="780" y1="196" x2="792" y2="118" stroke="#f4f6f8" strokeWidth="5" />
        <line x1="840" y1="196" x2="828" y2="118" stroke="#f4f6f8" strokeWidth="5" />
        <line x1="784" y1="170" x2="836" y2="170" stroke="#f4f6f8" strokeWidth="4" />
        <line x1="788" y1="144" x2="832" y2="144" stroke="#f4f6f8" strokeWidth="4" />
        <rect x="786" y="112" width="48" height="8" rx="2" fill="#e8463a" />
        <rect x="822" y="80" width="10" height="36" rx="3" fill="#e8463a" />
        <rect x="770" y="140" width="10" height="36" rx="5" fill="#e8463a" transform="rotate(-12 775 158)" />
        <rect x="770" y="160" width="10" height="4" fill="#ffffff" transform="rotate(-12 775 158)" />
      </g>

      {/* ---------- test-day table ---------- */}
      <rect x="300" y="150" width="300" height="6" rx="2" fill="#c9d3d9" />
      <line x1="316" y1="156" x2="316" y2="190" stroke="#9aa4ab" strokeWidth="3" />
      <line x1="584" y1="156" x2="584" y2="190" stroke="#9aa4ab" strokeWidth="3" />

      {/* laptop: the CSV of results */}
      <polygon points="324,146 408,146 414,150 318,150" fill="#b9c0c7" />
      <Monitor x={326} y={92} w={80} h={54} stand={false}>
        <rect x="331" y="97" width="70" height="8" fill="#1f7a45" />
        <text x="334" y="103.5" fontSize="5.6" fontWeight="700" fill="#ffffff" style={{ fontFamily: "Arial, sans-serif" }}>
          results.csv
        </text>
        {[0, 1, 2, 3].map((r) => (
          <g key={r}>
            {[0, 1, 2].map((c) => (
              <rect key={c} x={333 + c * 22} y={109 + r * 8} width="20" height="6" fill="#ffffff" stroke="#d3dae1" strokeWidth="0.6" />
            ))}
          </g>
        ))}
        <rect x="332" y="108" width="68" height="8" fill="none" stroke="#2e8bc0" strokeWidth="1.2">
          {animate && <animateTransform attributeName="transform" type="translate" values="0 0;0 8;0 16;0 24;0 24" keyTimes="0;0.1;0.2;0.3;1" calcMode="discrete" dur={DUR} repeatCount="indefinite" />}
        </rect>
      </Monitor>

      {/* printer and the sheet it produces */}
      <g clipPath={ref("printerOut")}>
        <g transform={animate ? undefined : "translate(0 -54)"}>
          {animate && (
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0 0;0 0;0 -54;0 -54;86 -54;86 0;86 0"
              keyTimes="0;0.28;0.45;0.72;0.82;0.94;1"
              calcMode="spline"
              keySplines="0 0 1 1;0.3 0 0.2 1;0 0 1 1;0.4 0 0.2 1;0.5 0 1 1;0 0 1 1"
              dur={DUR}
              repeatCount="indefinite"
            />
          )}
          <rect x="452" y="126" width="36" height="50" rx="1.5" fill="#ffffff" stroke="#c9d3d9" />
          <rect x="452" y="126" width="36" height="8" fill="#e8463a" />
          <text x="470" y="132" textAnchor="middle" fontSize="4.6" fontWeight="900" fill="#ffffff" style={{ fontFamily: "Arial, sans-serif" }}>
            TEST SHEET
          </text>
          {[0, 1, 2, 3].map((r) => (
            <g key={r}>
              <rect x="456" y={139 + r * 8} width="18" height="2.4" rx="1" fill="#c3cbd2" />
              <rect x="479" y={137 + r * 8} width="5" height="5" rx="1" fill="none" stroke="#9aa4ab" strokeWidth="0.7" />
              <path d={`M479.8 ${139.6 + r * 8} l1.4 1.5 2.4-2.8`} fill="none" stroke="#1f9a4b" strokeWidth="1.1" strokeLinecap="round" opacity={animate ? 0 : 1}>
                {anim({ attributeName: "opacity", values: "0;0;1;1;0", keyTimes: `0;${0.48 + r * 0.05};${0.5 + r * 0.05};0.97;1` })}
              </path>
            </g>
          ))}
        </g>
      </g>
      <rect x="440" y="126" width="60" height="24" rx="4" fill="#dfe4e8" stroke="#aeb7be" />
      <rect x="448" y="126" width="44" height="3" rx="1" fill="#4b555c" />
      <circle cx="490" cy="140" r="2" fill="#7cfc9a">
        {anim({ attributeName: "opacity", values: "0.3;0.3;1;1;0.3", keyTimes: "0;0.28;0.3;0.45;0.5" })}
      </circle>

      {/* output folder */}
      <rect x="524" y="126" width="64" height="24" rx="3" fill={BLUE} />
      <rect x="524" y="126" width="64" height="4" rx="2" fill="#5fb3e0" />
      <rect x="536" y="134" width="40" height="8" rx="2" fill="#ffffff" opacity="0.85" />
      <text x="556" y="140.2" textAnchor="middle" fontSize="5.5" fontWeight="900" fill="#1f9a4b" style={{ fontFamily: "Arial, sans-serif" }}>
        100% ✓
      </text>

      {/* ---------- pool ---------- */}
      <rect x="-200" y="196" width="1360" height="4" fill="#2e6f96" />
      <rect x="-200" y="200" width="1360" height="110" fill={ref("water")} />
      {/* shimmering caustics */}
      <g stroke="#ffffff" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.35">
        {animate && <animateTransform attributeName="transform" type="translate" values="0 0;-24 0;0 0" dur="6s" repeatCount="indefinite" />}
        {Array.from({ length: 30 }, (_, i) => (
          <path key={i} d={`M${i * 36} ${206 + (i % 3) * 16} q8 -4 16 0 t16 0`} />
        ))}
      </g>
      <LaneRope y={214} />
      <LaneRope y={240} />
      <LaneRope y={266} />

      {/* swimmer doing freestyle down the lane */}
      <g transform={animate ? undefined : "translate(560 227)"}>
        {animate && <animateTransform attributeName="transform" type="translate" from="-80 227" to="1040 227" dur="16s" repeatCount="indefinite" />}
        <ellipse cx="-28" cy="5" rx="28" ry="4.5" fill="#d99a70" opacity="0.45" />
        {[0, 180].map((phase) => (
          <g key={phase} transform={animate ? undefined : `rotate(${phase} -6 1)`}>
            {animate && <animateTransform attributeName="transform" type="rotate" from={`${phase} -6 1`} to={`${phase + 360} -6 1`} dur="1.3s" repeatCount="indefinite" />}
            <line x1="-6" y1="1" x2="-6" y2="-17" stroke="#f0bf98" strokeWidth="4" strokeLinecap="round" />
          </g>
        ))}
        <rect x="-70" y="4" width="92" height="10" fill="#3aa9dc" opacity="0.6" />
        <circle cx="0" cy="0" r="6.2" fill="#f2c29a" />
        <path d="M-6.2 0 a6.2 6.2 0 0 1 12.4 0 z" fill="#e8463a" />
        <rect x="1" y="0" width="5" height="2" rx="1" fill="#1d2024" />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={-58 - i * 6} cy={2 + (i % 2) * 3} r={2 + (i % 2)} fill="#ffffff" opacity="0.8">
            {animate && <animate attributeName="opacity" values="0;0.9;0" dur="0.5s" begin={`${i * 0.15}s`} repeatCount="indefinite" />}
          </circle>
        ))}
      </g>

      {/* ring buoy bobbing by the wall */}
      <g transform={animate ? undefined : "translate(0 0)"}>
        {animate && <animateTransform attributeName="transform" type="translate" values="0 0;0 -2.5;0 0" dur="2.4s" repeatCount="indefinite" />}
        <circle cx="880" cy="204" r="12" fill="none" stroke="#e8463a" strokeWidth="7" />
        <circle cx="880" cy="204" r="12" fill="none" stroke="#ffffff" strokeWidth="7" strokeDasharray="9.4 9.4" />
      </g>
    </SceneSvg>
  );
}
