"use client";

import { SceneSvg, useScene, type SceneVariant } from "./SceneSvg";
import { NAME } from "@/lib/site";

// "Now Playing": the portfolio as the game in the drive. A white game case
// floats beside its disc, which slides half out and spins; the back-of-box
// blurbs sit either side on the splash.

type Props = { variant: SceneVariant; className?: string };

const BLUE = "#3b82c4";
const INK = "#3a3a3f";
const DISC = { cx: 548, cy: 138, r: 92 };
const [FIRST, ...REST] = NAME.toUpperCase().split(" ");
const LAST = REST.join(" ");

const BLURBS = [
  { label: "GENRE", value: "Software · Automation" },
  { label: "PLAYERS", value: "1 · your hiring team" },
  { label: "SAVE DATA", value: "resume.pdf" },
];

const FEATURES = ["Machine vision", "Robot integration", "Full-stack web", "IT automation"];

export default function DiscScene({ variant, className }: Props) {
  const { id, ref, animate } = useScene();
  const float = (dur: string, dy = 4) =>
    animate ? <animateTransform attributeName="transform" type="translate" values={`0 0;0 -${dy};0 0`} dur={dur} repeatCount="indefinite" /> : null;

  return (
    <SceneSvg variant={variant} className={className} title="Disc Channel" titleColor="#2a5f93" bandColor={BLUE}>
      <defs>
        <radialGradient id={id("bg")} cx="50%" cy="45%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#eef6fc" />
          <stop offset="100%" stopColor="#d6e9f7" />
        </radialGradient>
        <linearGradient id={id("rim")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f4f7fa" />
          <stop offset="30%" stopColor="#c9d3dc" />
          <stop offset="50%" stopColor="#bfe6f5" />
          <stop offset="62%" stopColor="#e8c9f0" />
          <stop offset="75%" stopColor="#f6efc4" />
          <stop offset="100%" stopColor="#aeb9c3" />
        </linearGradient>
        <linearGradient id={id("label")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#eef1f4" />
        </linearGradient>
        <linearGradient id={id("cover")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8fd3ee" />
          <stop offset="55%" stopColor="#4aa3dc" />
          <stop offset="100%" stopColor="#2a6fb0" />
        </linearGradient>
        <linearGradient id={id("case")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#dfe3e8" />
          <stop offset="8%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f1f3f6" />
        </linearGradient>
        <radialGradient id={id("glint")} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <clipPath id={id("coverClip")}>
          <rect x="298" y="62" width="140" height="164" rx="3" />
        </clipPath>
      </defs>

      {/* ---------- backdrop: soft Wii-white with ripples ---------- */}
      <rect x="-200" y="-40" width="1360" height="360" fill={ref("bg")} />
      <g fill="none" stroke="#b9dcf2" strokeWidth="1.2">
        {[120, 170, 225, 285, 350].map((r, i) => (
          <circle key={r} cx={DISC.cx} cy={DISC.cy} r={r} opacity={0.55 - i * 0.09}>
            {animate && <animate attributeName="r" values={`${r};${r + 14};${r}`} dur="6s" begin={`${i * 0.4}s`} repeatCount="indefinite" />}
          </circle>
        ))}
      </g>
      <ellipse cx="470" cy="248" rx="230" ry="12" fill="#9fb8cc" opacity="0.35" />

      {/* ---------- the disc, half out of its case, spinning ---------- */}
      <g>
        {animate && (
          <animateTransform
            attributeName="transform"
            type="translate"
            values="-26 0;0 0;0 0;-26 0"
            keyTimes="0;0.15;0.85;1"
            dur="12s"
            repeatCount="indefinite"
          />
        )}
        <circle cx={DISC.cx} cy={DISC.cy + 4} r={DISC.r} fill="#7f97ab" opacity="0.25" />
        <g>
          {animate && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from={`0 ${DISC.cx} ${DISC.cy}`}
              to={`360 ${DISC.cx} ${DISC.cy}`}
              dur="5s"
              repeatCount="indefinite"
            />
          )}
          <circle cx={DISC.cx} cy={DISC.cy} r={DISC.r} fill={ref("rim")} stroke="#aab4be" strokeWidth="1.2" />
          <circle cx={DISC.cx} cy={DISC.cy} r={DISC.r - 6} fill={ref("label")} />
          {/* printed label: a blue swoosh and the title, so the spin reads */}
          <path
            d={`M${DISC.cx - 78} ${DISC.cy + 20} Q${DISC.cx} ${DISC.cy + 70} ${DISC.cx + 78} ${DISC.cy + 18} L${DISC.cx + 72} ${DISC.cy + 38} Q${DISC.cx} ${DISC.cy + 84} ${DISC.cx - 70} ${DISC.cy + 40} Z`}
            fill={BLUE}
            opacity="0.9"
          />
          <text
            x={DISC.cx}
            y={DISC.cy - 40}
            textAnchor="middle"
            fontSize="15"
            fontWeight="900"
            fill={INK}
            style={{ fontFamily: "var(--font-nunito), Arial, sans-serif" }}
          >
            {NAME.toUpperCase()}
          </text>
          <text
            x={DISC.cx}
            y={DISC.cy - 26}
            textAnchor="middle"
            fontSize="7.5"
            fontWeight="800"
            letterSpacing="2"
            fill="#6b6b72"
            style={{ fontFamily: "Arial, sans-serif" }}
          >
            PORTFOLIO EDITION
          </text>
          <circle cx={DISC.cx} cy={DISC.cy} r="26" fill="#e7ecf0" stroke="#c3ccd4" strokeWidth="1" />
          <circle cx={DISC.cx} cy={DISC.cy} r="18" fill="none" stroke="#d2d9df" strokeWidth="2" />
          <circle cx={DISC.cx} cy={DISC.cy} r="10" fill="#cfe3f0" stroke="#9fb2c0" strokeWidth="1" />
        </g>
        {/* a glint that stays put while the disc turns under it */}
        <ellipse
          cx={DISC.cx + 40}
          cy={DISC.cy - 48}
          rx="34"
          ry="12"
          fill={ref("glint")}
          transform={`rotate(-35 ${DISC.cx + 40} ${DISC.cy - 48})`}
          opacity="0.8"
        />
      </g>

      {/* ---------- the game case ---------- */}
      <g>
        {float("4s")}
        <rect x="284" y="34" width="168" height="206" rx="9" fill="#9fb0bf" opacity="0.35" transform="translate(4 5)" />
        <rect x="284" y="34" width="168" height="206" rx="9" fill={ref("case")} stroke="#c3cad2" strokeWidth="1.2" />
        {/* top banner strip */}
        <rect x="298" y="42" width="140" height="16" rx="3" fill="#ffffff" stroke="#d5dae0" />
        <text
          x="368"
          y="53.5"
          textAnchor="middle"
          fontSize="8"
          fontWeight="900"
          letterSpacing="3"
          fill="#8c8c94"
          style={{ fontFamily: "var(--font-nunito), Arial, sans-serif" }}
        >
          PORTFOLIO
        </text>
        {/* cover art */}
        <g clipPath={ref("coverClip")}>
          <rect x="298" y="62" width="140" height="164" fill={ref("cover")} />
          <circle cx="410" cy="88" r="46" fill="#ffffff" opacity="0.18" />
          <path d="M298 196 Q340 176 380 190 T438 184 V226 H298 Z" fill="#ffffff" opacity="0.22" />
          {/* little icons for the kinds of work inside */}
          <g stroke="#ffffff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.95">
            <path d="M318 150 l-8 8 8 8 M338 150 l8 8 -8 8" />
            <circle cx="368" cy="158" r="9" />
            <circle cx="368" cy="158" r="3.5" fill="#ffffff" />
            <path d="M398 168 v-12 l10 -8 10 8 M408 148 v-6" />
          </g>
        </g>
        <text
          x="368"
          y="94"
          textAnchor="middle"
          fontSize="22"
          fontWeight="900"
          fill="#ffffff"
          stroke="#1f5a8f"
          strokeWidth="4"
          paintOrder="stroke"
          style={{ fontFamily: "var(--font-nunito), Arial, sans-serif" }}
        >
          {FIRST}
        </text>
        <text
          x="368"
          y="118"
          textAnchor="middle"
          fontSize="22"
          fontWeight="900"
          fill="#ffffff"
          stroke="#1f5a8f"
          strokeWidth="4"
          paintOrder="stroke"
          style={{ fontFamily: "var(--font-nunito), Arial, sans-serif" }}
        >
          {LAST}
        </text>
        <text
          x="368"
          y="134"
          textAnchor="middle"
          fontSize="7.5"
          fontWeight="800"
          letterSpacing="1.5"
          fill="#eaf6ff"
          style={{ fontFamily: "Arial, sans-serif" }}
        >
          PORTFOLIO EDITION
        </text>
        {/* rating box */}
        <rect x="304" y="198" width="22" height="24" rx="2" fill="#ffffff" stroke={INK} strokeWidth="1.2" />
        <text x="315" y="214" textAnchor="middle" fontSize="12" fontWeight="900" fill={INK} style={{ fontFamily: "Arial, sans-serif" }}>
          E
        </text>
        <text x="332" y="208" fontSize="6" fontWeight="800" fill="#ffffff" style={{ fontFamily: "Arial, sans-serif" }}>
          EVERYONE
        </text>
        <text x="332" y="217" fontSize="5.5" fontWeight="700" fill="#dbeefa" style={{ fontFamily: "Arial, sans-serif" }}>
          especially employers
        </text>
      </g>

      {/* ---------- sparkles ---------- */}
      {[
        { x: 270, y: 60, s: 1 },
        { x: 668, y: 58, s: 0.8 },
        { x: 650, y: 214, s: 0.6 },
        { x: 462, y: 30, s: 0.55 },
      ].map((p, i) => (
        <path
          key={i}
          d="M0 -10 L2.5 -2.5 L10 0 L2.5 2.5 L0 10 L-2.5 2.5 L-10 0 L-2.5 -2.5 Z"
          fill="#ffffff"
          stroke="#8fd3ee"
          strokeWidth="1"
          transform={`translate(${p.x} ${p.y}) scale(${p.s})`}
          opacity="0.9"
        >
          {animate && <animate attributeName="opacity" values="0.1;1;0.1" dur={`${2.2 + i * 0.5}s`} repeatCount="indefinite" />}
        </path>
      ))}

      {/* ---------- splash-only side blurbs, back-of-box style ---------- */}
      {variant === "splash" && (
        <g style={{ fontFamily: "Arial, sans-serif" }}>
          <g>
            {float("5s", 3)}
            <circle cx="62" cy="70" r="5" fill="#e05a4e">
              {animate && <animate attributeName="opacity" values="1;0.3;1" dur="1.4s" repeatCount="indefinite" />}
            </circle>
            <text x="74" y="74" fontSize="11" fontWeight="900" letterSpacing="2" fill="#e05a4e">
              NOW PLAYING
            </text>
            {FEATURES.map((f, i) => (
              <g key={f}>
                <rect x="56" y={92 + i * 30} width="170" height="22" rx="11" fill="#ffffff" stroke="#b9dcf2" strokeWidth="1.5" />
                <text x="141" y={107 + i * 30} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={INK}>
                  {f}
                </text>
              </g>
            ))}
          </g>
          <g>
            {float("5.6s", 3)}
            {BLURBS.map((b, i) => (
              <g key={b.label}>
                <text x="740" y={82 + i * 50} fontSize="8" fontWeight="900" letterSpacing="2" fill="#6b8aa3">
                  {b.label}
                </text>
                <text x="740" y={100 + i * 50} fontSize="13" fontWeight="800" fill={INK}>
                  {b.value}
                </text>
                <line x1="740" y1={110 + i * 50} x2="900" y2={110 + i * 50} stroke="#cfe3f0" strokeWidth="1.5" />
              </g>
            ))}
          </g>
        </g>
      )}
    </SceneSvg>
  );
}
