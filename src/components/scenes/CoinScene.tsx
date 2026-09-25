"use client";

import { SceneSvg, useScene, type SceneVariant } from "./SceneSvg";
import { Monitor, SmartCamera } from "./parts";

// Canadian coins ride under a smart camera. Each time one is captured, the
// two monitors show the same coin read two ways: classical vision (edge fit
// and diameter) on the left, the AI classifier (heatmap and confidence) on
// the right.

type Props = { variant: SceneVariant; className?: string };

const GOLD = "#c9962f";
const CAM_X = 480;
// one coin reaches the camera every 4s; the belt pattern of four repeats every 16s
const STEP = "4s";
const LOOP = "16s";

type Coin = { name: string; mm: string; rx: number; face: string; core?: string };

const COINS: Coin[] = [
  { name: "LOONIE", mm: "26.5", rx: 13.3, face: "#e2b33c" },
  { name: "TOONIE", mm: "28.0", rx: 14, face: "#cfd6dc", core: "#e2b33c" },
  { name: "QUARTER", mm: "23.9", rx: 12, face: "#d4d9de" },
  { name: "DIME", mm: "18.0", rx: 9, face: "#d4d9de" },
];

// belt positions at t=0 and which coin sits there; chosen so the coin under
// the camera at t = 0, 4, 8, 12s is loonie, toonie, quarter, dime
const BELT = [
  { x: 640, coin: 3 },
  { x: 480, coin: 0 },
  { x: 320, coin: 1 },
  { x: 160, coin: 2 },
  { x: 0, coin: 3 },
  { x: -160, coin: 0 },
  { x: -320, coin: 1 },
  { x: -480, coin: 2 },
];

function darker(hex: string) {
  return hex === "#e2b33c" ? "#b08624" : "#9aa4ab";
}

function BeltCoin({ cx, coin }: { cx: number; coin: Coin }) {
  return (
    <g>
      <ellipse cx={cx} cy="197" rx={coin.rx} ry={coin.rx * 0.36} fill={darker(coin.face)} />
      <ellipse cx={cx} cy="195" rx={coin.rx} ry={coin.rx * 0.36} fill={coin.face} />
      {coin.core && <ellipse cx={cx} cy="195" rx={coin.rx * 0.6} ry={coin.rx * 0.22} fill={coin.core} />}
      <ellipse cx={cx - coin.rx * 0.3} cy="194" rx={coin.rx * 0.35} ry={coin.rx * 0.1} fill="#ffffff" opacity="0.5" />
    </g>
  );
}

function FaceCoin({ cx, cy, coin }: { cx: number; cy: number; coin: Coin }) {
  const r = coin.rx * 1.9;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={coin.face} stroke={darker(coin.face)} strokeWidth="1.5" />
      {coin.core && <circle cx={cx} cy={cy} r={r * 0.6} fill={coin.core} />}
      <circle cx={cx} cy={cy} r={r * 0.82} fill="none" stroke={darker(coin.face)} strokeWidth="0.8" strokeDasharray="2 2" />
      <circle cx={cx - r * 0.3} cy={cy - r * 0.35} r={r * 0.2} fill="#ffffff" opacity="0.45" />
    </g>
  );
}

export default function CoinScene({ variant, className }: Props) {
  const { id, ref, animate } = useScene();

  // show only the coin currently under inspection
  const current = (k: number) =>
    animate ? (
      <animate
        attributeName="opacity"
        values={COINS.map((_, i) => (i === k ? 1 : 0)).join(";")}
        keyTimes="0;0.25;0.5;0.75"
        calcMode="discrete"
        dur={LOOP}
        repeatCount="indefinite"
      />
    ) : null;

  return (
    <SceneSvg variant={variant} className={className} title="Coin Trainer" titleColor="#8a6414" bandColor={GOLD}>
      <defs>
        <linearGradient id={id("wall")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbf8f1" />
          <stop offset="100%" stopColor="#ece3cf" />
        </linearGradient>
        <linearGradient id={id("fov")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff2b8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fff2b8" stopOpacity="0.1" />
        </linearGradient>
        <radialGradient id={id("heat")} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff4d3d" stopOpacity="0.85" />
          <stop offset="45%" stopColor="#ffb238" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#3aa0e0" stopOpacity="0" />
        </radialGradient>
        <clipPath id={id("belt")}>
          <rect x="150" y="0" width="660" height="300" />
        </clipPath>
        <pattern id={id("grid")} width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0H0V24" fill="none" stroke="#e3d8bf" strokeWidth="1" />
        </pattern>
      </defs>

      <rect x="-200" y="-40" width="1360" height="360" fill={ref("wall")} />
      <rect x="-200" y="-40" width="1360" height="250" fill={ref("grid")} opacity="0.7" />
      <rect x="-200" y="228" width="1360" height="80" fill="#d8ccb2" />

      {/* ---------- classical vs AI monitors ---------- */}
      <Monitor x={196} y={52} w={176} h={112} screen="#10181f">
        <text x="206" y="68" fontSize="8" fontWeight="900" letterSpacing="1" fill="#6fd0ff" style={{ fontFamily: "Arial, sans-serif" }}>
          CLASSICAL
        </text>
        {COINS.map((coin, k) => (
          <g key={coin.name} opacity={k === 0 ? 1 : 0}>
            {current(k)}
            <FaceCoin cx={250} cy={112} coin={coin} />
            <circle cx="250" cy="112" r={coin.rx * 1.9 + 3} fill="none" stroke="#6fd0ff" strokeWidth="1.6" strokeDasharray="4 2" />
            <path d="M250 72v10M250 142v10M210 112h10M280 112h10" stroke="#6fd0ff" strokeWidth="1.2" />
            <text x="300" y="104" fontSize="7" fontWeight="700" fill="#8aa0b0" style={{ fontFamily: "Arial, sans-serif" }}>
              EDGE FIT
            </text>
            <text x="300" y="118" fontSize="11" fontWeight="900" fill="#ffffff" style={{ fontFamily: "'Courier New', monospace" }}>
              Ø{coin.mm}
            </text>
            <text x="300" y="130" fontSize="7" fontWeight="700" fill="#8aa0b0" style={{ fontFamily: "Arial, sans-serif" }}>
              mm
            </text>
          </g>
        ))}
      </Monitor>

      <Monitor x={588} y={52} w={176} h={112} screen="#10181f">
        <text x="598" y="68" fontSize="8" fontWeight="900" letterSpacing="1" fill="#ffb238" style={{ fontFamily: "Arial, sans-serif" }}>
          AI CLASSIFIER
        </text>
        {COINS.map((coin, k) => (
          <g key={coin.name} opacity={k === 0 ? 1 : 0}>
            {current(k)}
            <FaceCoin cx={642} cy={112} coin={coin} />
            <circle cx="642" cy="112" r={coin.rx * 2.4} fill={ref("heat")}>
              {animate && <animate attributeName="opacity" values="0.5;1;0.5" dur="1.6s" repeatCount="indefinite" />}
            </circle>
            <rect x="684" y="98" width="70" height="16" rx="3" fill={GOLD} />
            <text x="719" y="109.5" textAnchor="middle" fontSize="8.5" fontWeight="900" fill="#ffffff" style={{ fontFamily: "Arial, sans-serif" }}>
              {coin.name}
            </text>
            <text x="684" y="128" fontSize="6.5" fontWeight="700" fill="#8aa0b0" style={{ fontFamily: "Arial, sans-serif" }}>
              CONFIDENCE
            </text>
            <rect x="684" y="132" width="70" height="5" rx="2.5" fill="#2a343c" />
            <rect x="684" y="132" width="64" height="5" rx="2.5" fill="#ffb238" />
          </g>
        ))}
      </Monitor>

      {/* ---------- camera over the belt ---------- */}
      <rect x={CAM_X - 3} y="-40" width="6" height="104" fill="#8d969e" />
      <rect x={CAM_X - 16} y="60" width="32" height="6" rx="2" fill="#6b747c" />
      <g transform={`translate(${CAM_X} 66)`}>
        <SmartCamera />
        <circle cx="0" cy="31" r="10" fill="none" stroke="#fff2b8" strokeWidth="2.5" opacity="0.5">
          {animate && <animate attributeName="opacity" values="1;0.35;0.35" keyTimes="0;0.1;1" dur={STEP} repeatCount="indefinite" />}
        </circle>
      </g>
      <polygon points={`${CAM_X - 6},99 ${CAM_X + 6},99 ${CAM_X + 26},192 ${CAM_X - 26},192`} fill={ref("fov")} opacity="0.25">
        {animate && <animate attributeName="opacity" values="0.9;0.2;0.2" keyTimes="0;0.12;1" dur={STEP} repeatCount="indefinite" />}
      </polygon>

      {/* ---------- belt ---------- */}
      <rect x="150" y="200" width="660" height="10" rx="5" fill="#3f464c" />
      <rect x="146" y="210" width="668" height="6" rx="2" fill="#c3ccd2" stroke="#98a2a9" />
      {[180, 480, 780].map((x) => (
        <rect key={x} x={x - 4} y="216" width="8" height="14" fill="#8a949b" />
      ))}
      <g clipPath={ref("belt")}>
        <g>
          {animate && <animateTransform attributeName="transform" type="translate" from="0 0" to="640 0" dur={LOOP} repeatCount="indefinite" />}
          {BELT.map((b) => (
            <BeltCoin key={b.x} cx={b.x} coin={COINS[b.coin]} />
          ))}
        </g>
      </g>

    </SceneSvg>
  );
}
