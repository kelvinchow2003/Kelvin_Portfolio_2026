"use client";

import { SceneSvg, useScene, type SceneVariant } from "./SceneSvg";

// A resume and a job posting float on either side of the benchmarker. Skill
// chips fly off both into the dashboard, the three engines (keywords,
// embeddings, recruiter AI) fill up in parallel, and the match ring sweeps
// round to the score.

type Props = { variant: SceneVariant; className?: string };

const PURPLE = "#6c4fd9";
const DUR = "6s";
const RING_R = 42;
const RING_C = 2 * Math.PI * RING_R;
const SCORE = 0.87;

const CHIPS = [
  { text: "Python", from: "M205 96", to: "C260 60 300 90 352 128", at: 0.02 },
  { text: "SQL", from: "M205 132", to: "C250 150 300 160 352 146", at: 0.1 },
  { text: "React", from: "M205 168", to: "C260 200 310 180 356 160", at: 0.18 },
  { text: "TypeScript", from: "M755 104", to: "C700 60 660 90 612 116", at: 0.06 },
  { text: "REST APIs", from: "M755 150", to: "C700 170 660 170 612 160", at: 0.14 },
];

const ENGINES = [
  { label: "Keywords", value: 0.78, y: 84, at: 0.3 },
  { label: "Embeddings", value: 0.91, y: 122, at: 0.36 },
  { label: "Recruiter AI", value: 0.84, y: 160, at: 0.42 },
];
const BAR_X = 470;
const BAR_W = 160;

function Doc({ x, y, title, children }: { x: number; y: number; title: string; children?: React.ReactNode }) {
  return (
    <g>
      <rect x={x + 4} y={y + 6} width="96" height="124" rx="6" fill="#4b3a8f" opacity="0.12" />
      <rect x={x} y={y} width="96" height="124" rx="6" fill="#ffffff" stroke="#ddd5fb" strokeWidth="1.5" />
      <text x={x + 48} y={y + 16} textAnchor="middle" fontSize="8" fontWeight="900" letterSpacing="1" fill={PURPLE} style={{ fontFamily: "Arial, sans-serif" }}>
        {title}
      </text>
      {children}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={x + 12} y={y + 58 + i * 10} width={i % 3 === 2 ? 44 : 72} height="3.5" rx="1.75" fill="#d9d4ee" />
      ))}
    </g>
  );
}

export default function AtsScene({ variant, className }: Props) {
  const { id, ref, animate } = useScene();
  const anim = (props: React.SVGProps<SVGAnimateElement>) =>
    animate ? <animate dur={DUR} repeatCount="indefinite" {...props} /> : null;
  const bob = (dur: string) =>
    animate ? <animateTransform attributeName="transform" type="translate" values="0 0;0 -5;0 0" dur={dur} repeatCount="indefinite" /> : null;

  return (
    <SceneSvg variant={variant} className={className} title="ATS Benchmarker" titleColor="#4f35b8" bandColor={PURPLE}>
      <defs>
        <linearGradient id={id("bg")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbf9ff" />
          <stop offset="100%" stopColor="#e6defd" />
        </linearGradient>
        <pattern id={id("dots")} width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" fill="#cfc4f6" />
        </pattern>
        <linearGradient id={id("ring")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9b7bff" />
          <stop offset="100%" stopColor="#5a3cc9" />
        </linearGradient>
        <linearGradient id={id("bar")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8f6cff" />
          <stop offset="100%" stopColor="#5a3cc9" />
        </linearGradient>
        <linearGradient id={id("spark")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8f6cff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#8f6cff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect x="-200" y="-40" width="1360" height="360" fill={ref("bg")} />
      <rect x="-200" y="-40" width="1360" height="360" fill={ref("dots")} />
      <ellipse cx="480" cy="250" rx="300" ry="14" fill="#6c4fd9" opacity="0.08" />

      {/* resume */}
      <g>
        {bob("4s")}
        <Doc x={110} y={64} title="RESUME">
          <circle cx="136" cy="100" r="12" fill="#e6defd" />
          <circle cx="136" cy="96" r="5" fill="#9b87e8" />
          <path d="M127 108 q9 -8 18 0" fill="#9b87e8" />
          <rect x="154" y="92" width="40" height="4" rx="2" fill="#6c4fd9" opacity="0.7" />
          <rect x="154" y="101" width="30" height="3" rx="1.5" fill="#d9d4ee" />
        </Doc>
      </g>

      {/* job posting */}
      <g>
        {bob("4.6s")}
        <Doc x={754} y={70} title="JOB POSTING">
          <rect x="776" y="94" width="20" height="14" rx="2.5" fill="#9b87e8" />
          <rect x="782" y="90" width="8" height="5" rx="1.5" fill="none" stroke="#9b87e8" strokeWidth="1.6" />
          <rect x="802" y="94" width="40" height="4" rx="2" fill="#6c4fd9" opacity="0.7" />
          <rect x="802" y="103" width="28" height="3" rx="1.5" fill="#d9d4ee" />
        </Doc>
      </g>

      {/* ---------- dashboard ---------- */}
      <rect x="304" y="42" width="360" height="200" rx="10" fill="#4b3a8f" opacity="0.14" />
      <rect x="298" y="34" width="360" height="200" rx="10" fill="#ffffff" stroke="#ddd5fb" strokeWidth="1.5" />
      <path d="M298 54 V44 a10 10 0 0 1 10 -10 H648 a10 10 0 0 1 10 10 V54 Z" fill="#f1edff" />
      {["#ff6159", "#ffbd2e", "#28c940"].map((c, i) => (
        <circle key={c} cx={312 + i * 11} cy="44" r="3.4" fill={c} />
      ))}
      <rect x="360" y="38" width="236" height="12" rx="6" fill="#ffffff" stroke="#e2dbfb" />
      {/* lock: every user's history is private (row-level security) */}
      <rect x="367" y="43" width="7" height="5" rx="1" fill="#1f9a4b" />
      <path d="M368.5 43 v-1.6 a2 2 0 0 1 4 0 V43" fill="none" stroke="#1f9a4b" strokeWidth="1.1" />
      <text x="380" y="47.5" fontSize="6.5" fill="#8a80b5" style={{ fontFamily: "Arial, sans-serif" }}>
        benchmark · your history is private
      </text>

      {/* match ring */}
      <circle cx="382" cy="138" r={RING_R} fill="none" stroke="#efeaff" strokeWidth="11" />
      <circle
        cx="382"
        cy="138"
        r={RING_R}
        fill="none"
        stroke={ref("ring")}
        strokeWidth="11"
        strokeLinecap="round"
        strokeDasharray={RING_C}
        strokeDashoffset={animate ? RING_C : RING_C * (1 - SCORE)}
        transform="rotate(-90 382 138)"
      >
        {anim({
          attributeName: "stroke-dashoffset",
          values: `${RING_C};${RING_C};${RING_C * (1 - SCORE)};${RING_C * (1 - SCORE)};${RING_C}`,
          keyTimes: "0;0.35;0.72;0.94;1",
          calcMode: "spline",
          keySplines: "0 0 1 1;0.3 0 0.2 1;0 0 1 1;0.4 0 1 1",
        })}
      </circle>
      <g opacity={animate ? 0 : 1}>
        {anim({ attributeName: "opacity", values: "0;0;1;1;0", keyTimes: "0;0.7;0.76;0.94;1" })}
        <text x="382" y="143" textAnchor="middle" fontSize="24" fontWeight="900" fill="#3c2896" style={{ fontFamily: "var(--font-nunito), Arial, sans-serif" }}>
          87%
        </text>
        <text x="382" y="156" textAnchor="middle" fontSize="7" fontWeight="700" fill="#8a80b5" style={{ fontFamily: "Arial, sans-serif" }}>
          match
        </text>
      </g>

      {/* three engines, run in parallel */}
      {ENGINES.map((e) => (
        <g key={e.label}>
          <text x={BAR_X} y={e.y - 5} fontSize="8" fontWeight="800" fill="#3c2896" style={{ fontFamily: "Arial, sans-serif" }}>
            {e.label}
          </text>
          <text x={BAR_X + BAR_W} y={e.y - 5} textAnchor="end" fontSize="8" fontWeight="800" fill="#8a80b5" style={{ fontFamily: "Arial, sans-serif" }}>
            {Math.round(e.value * 100)}
          </text>
          <rect x={BAR_X} y={e.y} width={BAR_W} height="8" rx="4" fill="#efeaff" />
          <rect x={BAR_X} y={e.y} width={animate ? 0 : BAR_W * e.value} height="8" rx="4" fill={ref("bar")}>
            {anim({
              attributeName: "width",
              values: `0;0;${BAR_W * e.value};${BAR_W * e.value};0`,
              keyTimes: `0;${e.at};${e.at + 0.22};0.94;1`,
              calcMode: "spline",
              keySplines: "0 0 1 1;0.3 0 0.2 1;0 0 1 1;0.4 0 1 1",
            })}
          </rect>
        </g>
      ))}

      {/* history: the resume improving over time */}
      <path d="M470 222 L500 214 L530 216 L560 206 L590 200 L630 190 L630 224 L470 224 Z" fill={ref("spark")} />
      <path
        d="M470 222 L500 214 L530 216 L560 206 L590 200 L630 190"
        fill="none"
        stroke={PURPLE}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="170"
        strokeDashoffset={animate ? 170 : 0}
      >
        {anim({ attributeName: "stroke-dashoffset", values: "170;170;0;0;170", keyTimes: "0;0.55;0.8;0.94;1" })}
      </path>
      <circle cx="630" cy="190" r="3" fill={PURPLE} opacity={animate ? 0 : 1}>
        {anim({ attributeName: "opacity", values: "0;0;1;1;0", keyTimes: "0;0.79;0.8;0.94;1" })}
      </circle>

      {/* skill chips flying from both documents into the dashboard */}
      {animate &&
        CHIPS.map((c) => {
          const w = c.text.length * 5.2 + 12;
          return (
            <g key={c.text} opacity="0">
              <animateMotion path={`${c.from} ${c.to}`} keyTimes={`0;${c.at};${c.at + 0.2};1`} keyPoints="0;0;1;1" calcMode="linear" dur={DUR} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes={`0;${c.at};${c.at + 0.03};${c.at + 0.16};${c.at + 0.2};1`} dur={DUR} repeatCount="indefinite" />
              <rect x={-w / 2} y="-7" width={w} height="14" rx="7" fill={PURPLE} />
              <text x="0" y="3" textAnchor="middle" fontSize="8" fontWeight="800" fill="#ffffff" style={{ fontFamily: "Arial, sans-serif" }}>
                {c.text}
              </text>
            </g>
          );
        })}
    </SceneSvg>
  );
}
