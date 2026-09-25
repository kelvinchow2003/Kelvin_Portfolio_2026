"use client";

import { SceneSvg, useScene, type SceneVariant } from "./SceneSvg";

// Dark-mode GitHub: a push goes out from the terminal, the contribution
// graph lights up in a wave, a feature branch merges back into main, and
// the project repos float underneath.

type Props = { variant: SceneVariant; className?: string };

const DUR = "6s";
const C = {
  bg: "#0d1117",
  panel: "#161b22",
  border: "#30363d",
  text: "#c9d1d9",
  muted: "#8b949e",
  purple: "#8957e5",
  blue: "#58a6ff",
};
const LEVELS = ["#1b222c", "#0e4429", "#006d32", "#26a641", "#39d353"];

// contribution calendar
const WEEKS = 26;
const PITCH = 14;
const GRID_X = 298;
const GRID_Y = 66;
function level(week: number, day: number) {
  const n = (week * 7 + day * 13 + week * day) % 11;
  const busy = n + Math.floor((week / WEEKS) * 3);
  return busy < 5 ? 0 : busy < 7 ? 1 : busy < 9 ? 2 : busy < 11 ? 3 : 4;
}

const TERMINAL = [
  { text: "$ git add .", color: C.text },
  { text: '$ git commit -m "ship it"', color: C.text },
  { text: "$ git push origin main", color: C.text },
  { text: "Writing objects: 100%", color: C.muted },
  { text: "✓ main → origin/main", color: "#3fb950" },
];

const REPOS = [
  { name: "ATS Benchmarker", lang: "TypeScript", color: "#3178c6" },
  { name: "Apera PLC Bridge", lang: "Python", color: "#3572a5" },
  { name: "LSS Test Sheets", lang: "Python", color: "#3572a5" },
  { name: "Personal Website", lang: "R3F", color: "#f1e05a" },
];

const BRANCH = "M736 112 C756 112 758 150 782 150 H850 C874 150 876 112 896 112";

export default function GithubScene({ variant, className }: Props) {
  const { id, ref, animate } = useScene();
  const anim = (props: React.SVGProps<SVGAnimateElement>) =>
    animate ? <animate dur={DUR} repeatCount="indefinite" {...props} /> : null;
  const pop = (at: number) => ({
    opacity: animate ? 0 : 1,
    child: anim({ attributeName: "opacity", values: "0;0;1;1;0", keyTimes: `0;${at};${at + 0.02};0.95;1` }),
  });

  return (
    <SceneSvg variant={variant} className={className} title="GitHub Channel" titleColor="#24292f" bandColor="#24292f">
      <defs>
        <radialGradient id={id("glow")} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#1f6feb" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#1f6feb" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id("glowGreen")} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#39d353" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#39d353" stopOpacity="0" />
        </radialGradient>
        <clipPath id={id("term")}>
          <rect x="44" y="72" width="222" height="120" />
        </clipPath>
      </defs>

      <rect x="-200" y="-40" width="1360" height="360" fill={C.bg} />
      <ellipse cx="480" cy="120" rx="420" ry="170" fill={ref("glow")} />
      <ellipse cx="480" cy="112" rx="230" ry="70" fill={ref("glowGreen")} />
      {/* starfield */}
      <g fill="#ffffff">
        {Array.from({ length: 60 }, (_, i) => (
          <circle key={i} cx={(i * 157) % 960} cy={(i * 83) % 250} r={i % 5 === 0 ? 1.3 : 0.7} opacity={0.15 + (i % 4) * 0.12}>
            {animate && i % 3 === 0 && <animate attributeName="opacity" values="0.1;0.7;0.1" dur={`${2 + (i % 5)}s`} repeatCount="indefinite" />}
          </circle>
        ))}
      </g>

      {/* ---------- terminal ---------- */}
      <rect x="36" y="46" width="238" height="154" rx="8" fill={C.panel} stroke={C.border} />
      {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
        <circle key={c} cx={50 + i * 11} cy="58" r="3.4" fill={c} />
      ))}
      <text x="155" y="61" textAnchor="middle" fontSize="7" fontWeight="700" fill={C.muted} style={{ fontFamily: "'Courier New', monospace" }}>
        ~/portfolio
      </text>
      <line x1="36" y1="66" x2="274" y2="66" stroke={C.border} />
      <g clipPath={ref("term")} fontSize="8" fontWeight="700" style={{ fontFamily: "'Courier New', monospace" }}>
        {TERMINAL.map((line, i) => {
          const y = 86 + i * 20;
          const start = 0.04 + i * 0.1;
          return (
            <g key={i}>
              <text x="48" y={y} fill={line.color}>
                {line.text}
              </text>
              <rect x={animate ? 46 : 270} y={y - 9} width="224" height="13" fill={C.panel}>
                {anim({ attributeName: "x", values: "46;46;270;270;46", keyTimes: `0;${start};${start + 0.08};0.95;1` })}
              </rect>
            </g>
          );
        })}
      </g>

      {/* ---------- contribution graph ---------- */}
      <text x={GRID_X} y={GRID_Y - 10} fontSize="8" fontWeight="700" fill={C.text} style={{ fontFamily: "Arial, sans-serif" }}>
        contributions
      </text>
      <g>
        {Array.from({ length: WEEKS }, (_, w) =>
          Array.from({ length: 7 }, (_, d) => {
            const x = GRID_X + w * PITCH;
            const y = GRID_Y + d * PITCH;
            const t = 0.3 + w * 0.018;
            return (
              <g key={`${w}-${d}`}>
                <rect x={x} y={y} width="11" height="11" rx="2" fill={LEVELS[level(w, d)]} />
                {animate && (
                  <rect x={x} y={y} width="11" height="11" rx="2" fill="#56f07a" opacity="0">
                    <animate attributeName="opacity" values="0;0;0.9;0;0" keyTimes={`0;${t};${t + 0.03};${t + 0.12};1`} dur={DUR} repeatCount="indefinite" />
                  </rect>
                )}
              </g>
            );
          })
        )}
      </g>
      <g fontSize="6.5" fill={C.muted} style={{ fontFamily: "Arial, sans-serif" }}>
        <text x={GRID_X + WEEKS * PITCH - 86} y={GRID_Y + 7 * PITCH + 10}>
          Less
        </text>
        {LEVELS.map((c, i) => (
          <rect key={c} x={GRID_X + WEEKS * PITCH - 70 + i * 10} y={GRID_Y + 7 * PITCH + 3} width="8" height="8" rx="1.5" fill={c} />
        ))}
        <text x={GRID_X + WEEKS * PITCH - 18} y={GRID_Y + 7 * PITCH + 10}>
          More
        </text>
      </g>

      {/* ---------- repos ---------- */}
      {REPOS.map((r, i) => {
        const x = GRID_X + i * 92;
        return (
          <g key={r.name}>
            {animate && <animateTransform attributeName="transform" type="translate" values="0 0;0 -3;0 0" dur={`${3 + i * 0.4}s`} repeatCount="indefinite" />}
            <rect x={x} y="184" width="86" height="40" rx="6" fill={C.panel} stroke={C.border} />
            <path d={`M${x + 8} ${193} h7 v9 l-3.5 -2 -3.5 2 z`} fill="none" stroke={C.muted} strokeWidth="1" />
            <text x={x + 19} y="200" fontSize="6.2" fontWeight="800" fill={C.blue} style={{ fontFamily: "Arial, sans-serif" }}>
              {r.name}
            </text>
            <circle cx={x + 11} cy="213" r="3" fill={r.color} />
            <text x={x + 18} y="215.5" fontSize="6.5" fill={C.muted} style={{ fontFamily: "Arial, sans-serif" }}>
              {r.lang}
            </text>
          </g>
        );
      })}

      {/* ---------- branch and merge ---------- */}
      <text x="700" y="80" fontSize="8" fontWeight="700" fill={C.text} style={{ fontFamily: "Arial, sans-serif" }}>
        main
      </text>
      <line x1="696" y1="112" x2="930" y2="112" stroke={C.muted} strokeWidth="2.5" />
      <path d={BRANCH} fill="none" stroke={C.purple} strokeWidth="2.5" strokeDasharray="220" strokeDashoffset={animate ? 220 : 0}>
        {anim({ attributeName: "stroke-dashoffset", values: "220;220;0;0;220", keyTimes: "0;0.2;0.6;0.95;1" })}
      </path>
      {[706, 736].map((x) => (
        <circle key={x} cx={x} cy="112" r="5" fill={C.bg} stroke={C.muted} strokeWidth="2.5" />
      ))}
      {[
        { x: 800, at: 0.34 },
        { x: 834, at: 0.46 },
      ].map((n) => {
        const p = pop(n.at);
        return (
          <circle key={n.x} cx={n.x} cy="150" r="5" fill={C.bg} stroke={C.purple} strokeWidth="2.5" opacity={p.opacity}>
            {p.child}
          </circle>
        );
      })}
      {(() => {
        const merged = pop(0.6);
        return (
          <g opacity={merged.opacity}>
            {merged.child}
            <circle cx="896" cy="112" r="7" fill={C.purple} />
            <circle cx="896" cy="112" r="12" fill="none" stroke={C.purple} strokeWidth="1.5" opacity="0.6">
              {animate && <animate attributeName="r" values="7;16;7" dur="1.6s" repeatCount="indefinite" />}
            </circle>
            <rect x="778" y="176" width="96" height="18" rx="9" fill={C.purple} />
            <path d="M791 181 v8 M791 181 a3 3 0 0 0 6 3 v5" fill="none" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" />
            <text x="834" y="188" textAnchor="middle" fontSize="8" fontWeight="800" fill="#ffffff" style={{ fontFamily: "Arial, sans-serif" }}>
              Merged
            </text>
          </g>
        );
      })()}
      <text x="770" y="168" fontSize="6.5" fill={C.muted} style={{ fontFamily: "'Courier New', monospace" }}>
        feature/new-scene
      </text>
    </SceneSvg>
  );
}
