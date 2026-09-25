"use client";

import { SceneSvg, useScene, type SceneVariant } from "./SceneSvg";

// The ocean site, out on the ocean: golden-hour sky, rolling swells, a
// lighthouse sweeping its beam, a sailboat bobbing, and the site itself
// floating over the water, its low-poly wave mesh rippling inside the window.

type Props = { variant: SceneVariant; className?: string };

const BLUE = "#2f8fd1";

// a long sine swell; translating it one wavelength loops seamlessly
function swell(y: number, amp: number, len: number) {
  let d = `M-400 ${y}`;
  for (let x = -400; x < 1400; x += len) {
    d += ` q${len / 4} ${-amp} ${len / 2} 0 t${len / 2} 0`;
  }
  return `${d} V330 H-400 Z`;
}

// low-poly mesh rows inside the browser window, two states to morph between
const MESH_X0 = 360;
const MESH_STEP = 24;
const MESH_COLS = 11;
function meshRow(y: number, phase: number, amp: number) {
  return Array.from({ length: MESH_COLS }, (_, i) => {
    const x = MESH_X0 + i * MESH_STEP;
    return `${x},${(y + Math.sin(i * 0.9 + phase) * amp).toFixed(1)}`;
  }).join(" ");
}
const MESH_ROWS = [118, 132, 148, 166];

export default function PersonalSiteScene({ variant, className }: Props) {
  const { id, ref, animate } = useScene();

  const drift = (len: number, dur: string, reverse = false) =>
    animate ? (
      <animateTransform attributeName="transform" type="translate" from={reverse ? `${-len} 0` : "0 0"} to={reverse ? "0 0" : `${-len} 0`} dur={dur} repeatCount="indefinite" />
    ) : null;

  return (
    <SceneSvg variant={variant} className={className} title="Personal Website" titleColor="#1f6fa8" bandColor={BLUE}>
      <defs>
        <linearGradient id={id("sky")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8fd0f5" />
          <stop offset="60%" stopColor="#d9effa" />
          <stop offset="100%" stopColor="#ffe6c4" />
        </linearGradient>
        <radialGradient id={id("sun")} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fffbe8" />
          <stop offset="30%" stopColor="#ffe29a" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ffd27a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id("far")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7cc7ee" />
          <stop offset="100%" stopColor="#4aa6dc" />
        </linearGradient>
        <linearGradient id={id("mid")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3e9fd8" />
          <stop offset="100%" stopColor="#237fc0" />
        </linearGradient>
        <linearGradient id={id("near")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1f78b8" />
          <stop offset="100%" stopColor="#145a91" />
        </linearGradient>
        <linearGradient id={id("beam")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff6c8" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#fff6c8" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={id("glass")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.92" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.78" />
        </linearGradient>
        <linearGradient id={id("screen")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d2a4a" />
          <stop offset="100%" stopColor="#1a5a8f" />
        </linearGradient>
        <clipPath id={id("screenClip")}>
          <rect x="350" y="64" width="262" height="116" rx="4" />
        </clipPath>
      </defs>

      {/* ---------- sky ---------- */}
      <rect x="-200" y="-40" width="1360" height="240" fill={ref("sky")} />
      <circle cx="760" cy="150" r="70" fill={ref("sun")} />
      <circle cx="760" cy="150" r="22" fill="#fff4d0" />
      {[
        { y: 40, s: 1, begin: "-20s" },
        { y: 78, s: 0.7, begin: "-60s" },
      ].map((c, i) =>
        animate ? (
          <g key={i} opacity="0.95">
            <animateTransform attributeName="transform" type="translate" from="-200 0" to="1160 0" dur="110s" begin={c.begin} repeatCount="indefinite" />
            <g transform={`translate(0 ${c.y}) scale(${c.s})`}>
              <ellipse cx="0" cy="0" rx="36" ry="12" fill="#ffffff" />
              <ellipse cx="20" cy="-8" rx="20" ry="14" fill="#ffffff" />
              <ellipse cx="-18" cy="-4" rx="16" ry="10" fill="#ffffff" />
            </g>
          </g>
        ) : null
      )}
      {/* gulls */}
      {[
        { x: 210, y: 60, d: "1.1s" },
        { x: 250, y: 44, d: "0.9s" },
        { x: 700, y: 70, d: "1.3s" },
      ].map((g, i) => (
        <path key={i} d={`M${g.x - 8} ${g.y} q4 -5 8 0 q4 -5 8 0`} fill="none" stroke="#3a4a5a" strokeWidth="1.6" strokeLinecap="round">
          {animate && (
            <animate
              attributeName="d"
              values={`M${g.x - 8} ${g.y} q4 -5 8 0 q4 -5 8 0;M${g.x - 8} ${g.y - 2} q4 4 8 2 q4 -2 8 -2;M${g.x - 8} ${g.y} q4 -5 8 0 q4 -5 8 0`}
              dur={g.d}
              repeatCount="indefinite"
            />
          )}
        </path>
      ))}

      {/* ---------- lighthouse on its rock ---------- */}
      <path d="M40 200 q20 -26 60 -30 q40 2 64 30 z" fill="#6b7a86" />
      <path d="M70 176 q20 -8 50 -2" stroke="#8a98a3" strokeWidth="3" fill="none" />
      <polygon points="92,176 118,176 113,96 97,96" fill="#ffffff" />
      {[110, 136, 160].map((y) => (
        <polygon key={y} points={`${95 - (y - 96) * 0.03},${y} ${115 + (y - 96) * 0.03},${y} ${115 + (y + 10 - 96) * 0.03},${y + 10} ${95 - (y + 10 - 96) * 0.03},${y + 10}`} fill="#e8463a" />
      ))}
      <rect x="94" y="84" width="22" height="12" rx="2" fill="#fff4c8" stroke="#2e3238" strokeWidth="2" />
      <path d="M92 84 l13 -10 l13 10 z" fill="#2e3238" />
      <g>
        {animate && <animateTransform attributeName="transform" type="rotate" values="-25 105 90;25 105 90;-25 105 90" dur="6s" repeatCount="indefinite" />}
        <polygon points="105,90 330,60 330,120" fill={ref("beam")} opacity="0.7" />
      </g>

      {/* ---------- sea ---------- */}
      <g>
        {drift(80, "7s")}
        <path d={swell(186, 4, 80)} fill={ref("far")} />
      </g>
      {/* sun glitter */}
      <g fill="#fff4d0">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={730 + ((i * 17) % 50)} y={192 + i * 6} width={24 - i * 2} height="2" rx="1" opacity="0.8">
            {animate && <animate attributeName="opacity" values="0.1;0.9;0.1" dur={`${1 + i * 0.3}s`} repeatCount="indefinite" />}
          </rect>
        ))}
      </g>

      {/* sailboat */}
      <g>
        {animate && <animateTransform attributeName="transform" type="rotate" values="-4 250 204;4 250 204;-4 250 204" dur="3.2s" repeatCount="indefinite" />}
        <path d="M222 200 h56 l-8 12 h-40 z" fill="#ffffff" stroke="#c9d3db" />
        <rect x="222" y="206" width="56" height="3" fill="#e8463a" />
        <rect x="249" y="136" width="2.5" height="64" fill="#6b5a44" />
        <path d="M252 140 q26 30 22 56 h-22 z" fill="#ffffff" stroke="#dde5ea" />
        <path d="M248 148 q-18 22 -20 48 h20 z" fill="#ffe29a" />
      </g>

      <g>
        {drift(120, "9s", true)}
        <path d={swell(212, 6, 120)} fill={ref("mid")} />
      </g>
      <g>
        {drift(160, "11s")}
        <path d={swell(236, 8, 160)} fill={ref("near")} />
        <path d={swell(236, 8, 160).replace(/ V330 H-400 Z$/, "")} fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.35" />
      </g>

      {/* ---------- the site, floating above the water ---------- */}
      <g>
        {animate && <animateTransform attributeName="transform" type="translate" values="0 0;0 -6;0 0" dur="4.5s" repeatCount="indefinite" />}
        <ellipse cx="481" cy="230" rx="120" ry="6" fill="#0d3a60" opacity="0.25" />
        <rect x="342" y="40" width="278" height="148" rx="10" fill={ref("glass")} stroke="#ffffff" strokeWidth="1.5" />
        {["#ff6159", "#ffbd2e", "#28c940"].map((c, i) => (
          <circle key={c} cx={356 + i * 11} cy="52" r="3.4" fill={c} />
        ))}
        <rect x="396" y="46" width="170" height="12" rx="6" fill="#ffffff" stroke="#dce6ee" />
        <text x="481" y="54.8" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="#6b8398" style={{ fontFamily: "Arial, sans-serif" }}>
          ocean portfolio · three.js
        </text>

        <g clipPath={ref("screenClip")}>
          <rect x="350" y="64" width="262" height="116" fill={ref("screen")} />
          <circle cx="560" cy="96" r="14" fill="#ffe29a" opacity="0.9" />
          <circle cx="560" cy="96" r="26" fill="#ffe29a" opacity="0.18" />
          <text x="364" y="88" fontSize="13" fontWeight="900" fill="#ffffff" style={{ fontFamily: "var(--font-nunito), Arial, sans-serif" }}>
            Kelvin Chow
          </text>
          <text x="364" y="100" fontSize="6.8" fontWeight="700" fill="#9fd4f5" style={{ fontFamily: "Arial, sans-serif" }}>
            dive in ↓
          </text>
          {/* rippling low-poly wave mesh */}
          <g fill="none" stroke="#6fd0ff" strokeWidth="1" strokeLinejoin="round">
            {MESH_ROWS.map((y, r) => {
              const a = meshRow(y, r * 0.8, 3 + r);
              const b = meshRow(y, r * 0.8 + Math.PI, 3 + r);
              return (
                <polyline key={y} points={a} opacity={0.5 + r * 0.15}>
                  {animate && <animate attributeName="points" values={`${a};${b};${a}`} dur="3s" repeatCount="indefinite" />}
                </polyline>
              );
            })}
            {Array.from({ length: MESH_COLS }, (_, i) => {
              const x = MESH_X0 + i * MESH_STEP;
              return <line key={i} x1={x} y1={MESH_ROWS[0]} x2={x - 10 + i * 2} y2={MESH_ROWS[3]} opacity="0.35" />;
            })}
          </g>
          <rect x="350" y="150" width="262" height="30" fill="#0d2a4a" opacity="0.25" />
        </g>
      </g>
    </SceneSvg>
  );
}
