"use client";

import { SceneSvg, useScene, type SceneVariant } from "./SceneSvg";

// An immigration law office desk running on automation: an intake form lifts
// off the inbox and flies into the laptop (the client portal), the laptop
// builds the PDF, and it slides out, gets an APPROVED stamp, and files itself
// on the outbox stack. One document per 4s cycle.

type Props = { variant: SceneVariant; className?: string };

const DUR = "4s";
const BROWN = "#6b5b3e";
const DESK_Y = 212; // where flat papers sit on the desk surface

// a sheet lying flat on the desk, seen at a slight angle
const FLAT_SHEET = "-15,-6 23,-6 17,6 -21,6";

function FlatSheet({ x, y, tilt = 0, fill = "#ffffff" }: { x: number; y: number; tilt?: number; fill?: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${tilt})`}>
      <polygon points={FLAT_SHEET} fill={fill} stroke="#cbbfae" strokeWidth="0.8" />
      <line x1="-10" y1="-2.5" x2="12" y2="-2.5" stroke="#c9d3dc" strokeWidth="1" />
      <line x1="-12" y1="0.5" x2="10" y2="0.5" stroke="#c9d3dc" strokeWidth="1" />
      <line x1="-14" y1="3.5" x2="4" y2="3.5" stroke="#c9d3dc" strokeWidth="1" />
    </g>
  );
}

function Book({ x, y, w, h, color }: { x: number; y: number; w: number; h: number; color: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="1" fill={color} />
      <rect x={x + 1.5} y={y + 5} width={w - 3} height="2" fill="#e8c77a" opacity="0.8" />
      <rect x={x + 1.5} y={y + h - 8} width={w - 3} height="2" fill="#e8c77a" opacity="0.8" />
    </g>
  );
}

const SHELVES = [
  { y: 88, books: ["#7b2d2d", "#2f4a6b", "#7b2d2d", "#3e5f3a", "#a57a3c", "#2f4a6b", "#5b3a5e"] },
  { y: 138, books: ["#3e5f3a", "#a57a3c", "#7b2d2d", "#2f4a6b", "#2f4a6b", "#7b2d2d"] },
  { y: 188, books: ["#a57a3c", "#5b3a5e", "#3e5f3a", "#7b2d2d", "#2f4a6b", "#a57a3c", "#3e5f3a"] },
];

export default function GreenSpiegelScene({ variant, className }: Props) {
  const { id, ref, animate } = useScene();

  const anim = (props: React.SVGProps<SVGAnimateElement>) =>
    animate ? <animate dur={DUR} repeatCount="indefinite" {...props} /> : null;

  return (
    <SceneSvg variant={variant} className={className} title="Green and Spiegel LLP" titleColor="#5a4a2e" bandColor={BROWN}>
      <defs>
        <linearGradient id={id("wall")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fdf8ef" />
          <stop offset="100%" stopColor="#f0e4cf" />
        </linearGradient>
        <linearGradient id={id("sky")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a9d8f7" />
          <stop offset="100%" stopColor="#e6f4fc" />
        </linearGradient>
        <linearGradient id={id("deskTop")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c99a64" />
          <stop offset="100%" stopColor="#b3844f" />
        </linearGradient>
        <linearGradient id={id("deskFront")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8e6238" />
          <stop offset="100%" stopColor="#6f4a29" />
        </linearGradient>
        <linearGradient id={id("screen")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#eef2f5" />
        </linearGradient>
        <radialGradient id={id("lampGlow")} cx="50%" cy="0%" r="100%">
          <stop offset="0%" stopColor="#fff3c4" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#fff3c4" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id("brass")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f3d98b" />
          <stop offset="100%" stopColor="#b08a36" />
        </linearGradient>
        <clipPath id={id("windowClip")}>
          <rect x="72" y="42" width="166" height="116" />
        </clipPath>
      </defs>

      {/* ---------- room ---------- */}
      <rect x="-200" y="-40" width="1360" height="260" fill={ref("wall")} />
      <rect x="-200" y="160" width="1360" height="60" fill="#eadbc1" />
      <rect x="-200" y="158" width="1360" height="4" fill="#d9c6a4" />
      <g stroke="#dccaa9" strokeWidth="1.2">
        {Array.from({ length: 24 }, (_, i) => (
          <line key={i} x1={i * 44 - 20} y1="166" x2={i * 44 - 20} y2="212" />
        ))}
      </g>

      {/* window onto downtown */}
      <g clipPath={ref("windowClip")}>
        <rect x="72" y="42" width="166" height="116" fill={ref("sky")} />
        <g fill="#bcd2e3">
          <rect x="80" y="100" width="22" height="58" />
          <rect x="106" y="84" width="18" height="74" />
          <rect x="180" y="96" width="26" height="62" />
          <rect x="210" y="110" width="22" height="48" />
          <polygon points="148,158 150.5,74 153.5,74 156,158" />
          <rect x="151" y="52" width="1.6" height="24" />
          <ellipse cx="152" cy="80" rx="8" ry="3.5" />
        </g>
        {animate && (
          <g opacity="0.9">
            <animateTransform attributeName="transform" type="translate" from="-80 0" to="260 0" dur="40s" repeatCount="indefinite" />
            <ellipse cx="0" cy="62" rx="22" ry="7" fill="#ffffff" />
            <ellipse cx="12" cy="57" rx="12" ry="8" fill="#ffffff" />
          </g>
        )}
      </g>
      <rect x="66" y="36" width="178" height="128" rx="3" fill="none" stroke="#8a6d47" strokeWidth="8" />
      <line x1="155" y1="40" x2="155" y2="160" stroke="#8a6d47" strokeWidth="4" />
      <line x1="70" y1="100" x2="240" y2="100" stroke="#8a6d47" strokeWidth="4" />
      <rect x="60" y="162" width="190" height="6" rx="2" fill="#7a5d3a" />

      {/* diplomas */}
      <rect x="292" y="58" width="52" height="40" rx="2" fill="#6f4f2c" />
      <rect x="297" y="63" width="42" height="30" fill="#fbf7ee" />
      <circle cx="330" cy="86" r="4" fill="#c0392b" />
      <line x1="302" y1="71" x2="334" y2="71" stroke="#b8a888" strokeWidth="1.5" />
      <line x1="305" y1="77" x2="330" y2="77" stroke="#b8a888" strokeWidth="1" />
      <rect x="356" y="66" width="40" height="32" rx="2" fill="#6f4f2c" />
      <rect x="360" y="70" width="32" height="24" fill="#fbf7ee" />
      <circle cx="385" cy="88" r="3.4" fill="#c0392b" />
      <line x1="364" y1="77" x2="388" y2="77" stroke="#b8a888" strokeWidth="1.3" />

      {/* wall clock */}
      <circle cx="630" cy="72" r="24" fill="#ffffff" stroke={BROWN} strokeWidth="4" />
      {[0, 90, 180, 270].map((a) => (
        <line key={a} x1="630" y1="52" x2="630" y2="56" stroke="#6b5b3e" strokeWidth="2" transform={`rotate(${a} 630 72)`} />
      ))}
      <line x1="630" y1="72" x2="630" y2="60" stroke="#3b3b3b" strokeWidth="2.6" strokeLinecap="round">
        {animate && <animateTransform attributeName="transform" type="rotate" from="0 630 72" to="360 630 72" dur="96s" repeatCount="indefinite" />}
      </line>
      <line x1="630" y1="72" x2="630" y2="54" stroke="#3b3b3b" strokeWidth="1.6" strokeLinecap="round">
        {animate && <animateTransform attributeName="transform" type="rotate" from="0 630 72" to="360 630 72" dur="8s" repeatCount="indefinite" />}
      </line>
      <circle cx="630" cy="72" r="2.2" fill="#c0392b" />

      {/* bookshelf of case law */}
      <rect x="742" y="36" width="172" height="176" rx="3" fill="#7a5533" />
      <rect x="750" y="44" width="156" height="164" fill="#5e3f23" />
      {SHELVES.map((shelf) => {
        let x = 754;
        return (
          <g key={shelf.y}>
            {shelf.books.map((color, i) => {
              const w = 12 + ((i * 7) % 8);
              const h = 34 + ((i * 11) % 10);
              const book = <Book key={i} x={x} y={shelf.y - h} w={w} h={h} color={color} />;
              x += w + 2;
              return book;
            })}
            <rect x="750" y={shelf.y} width="156" height="6" fill="#8a6440" />
          </g>
        );
      })}

      {/* ---------- desk ---------- */}
      <polygon points="150,200 900,200 930,226 120,226" fill={ref("deskTop")} />
      <rect x="120" y="226" width="810" height="80" fill={ref("deskFront")} />
      <rect x="120" y="226" width="810" height="3" fill="#a87a48" />
      <g stroke="#5f3f22" strokeWidth="1.5" fill="none">
        <rect x="160" y="236" width="150" height="26" rx="2" />
        <rect x="740" y="236" width="150" height="26" rx="2" />
      </g>
      <rect x="226" y="246" width="20" height="4" rx="2" fill="#e8c77a" />
      <rect x="806" y="246" width="20" height="4" rx="2" fill="#e8c77a" />

      {/* banker's lamp */}
      <polygon points="186,122 262,122 300,212 150,212" fill={ref("lampGlow")} opacity="0.55" />
      <rect x="219" y="204" width="10" height="8" rx="2" fill={ref("brass")} />
      <rect x="222" y="130" width="4" height="76" fill={ref("brass")} />
      <path d="M190 132 Q224 106 258 132 Z" fill="#2f6b4a" stroke="#1f4a33" strokeWidth="1.2" />
      <rect x="188" y="130" width="72" height="4" rx="2" fill={ref("brass")} />

      {/* inbox: a messy stack of intake forms */}
      <polygon points="262,212 336,212 344,202 270,202" fill="#8a8f96" opacity="0.5" />
      <FlatSheet x={300} y={208} tilt={-3} />
      <FlatSheet x={302} y={205} tilt={4} fill="#fffaf0" />
      <FlatSheet x={298} y={202} tilt={-6} />
      <FlatSheet x={303} y={199} tilt={2} fill="#fffaf0" />

      {/* one form lifts off and flies into the portal */}
      <g opacity="0">
        {animate && (
          <animateMotion path="M300 196 C300 150 360 108 460 150" keyTimes="0;0.35;1" keyPoints="0;1;1" calcMode="spline" keySplines="0.4 0 0.3 1;0 0 1 1" dur={DUR} repeatCount="indefinite" />
        )}
        {anim({ attributeName: "opacity", values: "0;1;1;0;0", keyTimes: "0;0.04;0.28;0.36;1" })}
        <rect x="-10" y="-13" width="20" height="26" rx="2" fill="#ffffff" stroke="#cbbfae" />
        <rect x="-6" y="-8" width="12" height="2" fill="#6b5b3e" opacity="0.6" />
        <line x1="-6" y1="-2" x2="6" y2="-2" stroke="#c9d3dc" />
        <line x1="-6" y1="2" x2="6" y2="2" stroke="#c9d3dc" />
        <line x1="-6" y1="6" x2="3" y2="6" stroke="#c9d3dc" />
      </g>

      {/* passport */}
      <g transform="translate(362 214)">
        <polygon points="-12,-5 12,-5 9,5 -15,5" fill="#1f2f5a" />
        <circle cx="-1.5" cy="0" r="2.6" fill="none" stroke="#d8b35a" strokeWidth="1" />
      </g>

      {/* ---------- laptop / client portal ---------- */}
      <polygon points="392,206 528,206 540,216 380,216" fill="#b9c0c7" />
      <polygon points="440,209 480,209 482,212 438,212" fill="#9aa3ab" />
      <rect x="400" y="120" width="120" height="86" rx="5" fill="#2e3238" />
      <rect x="405" y="125" width="110" height="76" rx="2" fill={ref("screen")} />
      <rect x="405" y="125" width="110" height="12" rx="2" fill={BROWN} />
      <text x="411" y="134" fontSize="7" fontWeight="700" fill="#ffffff" style={{ fontFamily: "Arial, sans-serif" }}>
        Client Intake
      </text>
      {[144, 154, 164].map((y) => (
        <g key={y}>
          <rect x="411" y={y} width="20" height="3" rx="1" fill="#b8c0c8" />
          <rect x="435" y={y - 1} width="72" height="5" rx="1.5" fill="#ffffff" stroke="#d3dae1" strokeWidth="0.8" />
        </g>
      ))}
      <rect x="411" y="178" width="74" height="6" rx="3" fill="#e3e8ec" />
      <rect x="411" y="178" width={animate ? 0 : 74} height="6" rx="3" fill="#4f9d69">
        {anim({ attributeName: "width", values: "0;0;74;74;0", keyTimes: "0;0.32;0.56;0.97;1" })}
      </rect>
      <text x="411" y="195" fontSize="6.5" fontWeight="700" fill="#6b7580" style={{ fontFamily: "Arial, sans-serif" }}>
        Generating PDF…
      </text>
      <g opacity={animate ? 0 : 1}>
        {anim({ attributeName: "opacity", values: "0;0;1;1;0", keyTimes: "0;0.55;0.58;0.9;0.95" })}
        <rect x="492" y="174" width="17" height="21" rx="2" fill="#ffffff" stroke="#c0392b" strokeWidth="1.2" />
        <rect x="490" y="184" width="21" height="8" rx="1.5" fill="#c0392b" />
        <text x="500.5" y="190.5" textAnchor="middle" fontSize="6" fontWeight="900" fill="#ffffff" style={{ fontFamily: "Arial, sans-serif" }}>
          PDF
        </text>
      </g>

      {/* outbox: the finished, approved stack */}
      <polygon points="662,216 736,216 744,206 670,206" fill="#8a8f96" opacity="0.4" />
      {[213, 210, 207, 204].map((y, i) => (
        <g key={y}>
          <FlatSheet x={700} y={y} tilt={i % 2 ? 1 : -1} />
          <ellipse cx={704} cy={y} rx="8" ry="2.6" fill="none" stroke="#2f8f4e" strokeWidth="1.2" opacity="0.8" />
        </g>
      ))}

      {/* the generated PDF slides out, gets stamped, and is filed */}
      <g transform={animate ? undefined : "translate(610 212)"}>
        {animate && (
          <animateTransform
            attributeName="transform"
            type="translate"
            values="540 212;540 212;610 212;610 212;700 201;700 201"
            keyTimes="0;0.55;0.68;0.84;0.96;1"
            calcMode="spline"
            keySplines="0 0 1 1;0.3 0 0.2 1;0 0 1 1;0.4 0 0.2 1;0 0 1 1"
            dur={DUR}
            repeatCount="indefinite"
          />
        )}
        <g opacity={animate ? 0 : 1}>
          {anim({ attributeName: "opacity", values: "0;0;1;1;0", keyTimes: "0;0.55;0.6;0.95;1" })}
          <FlatSheet x={0} y={0} />
          <polygon points="12,-6 23,-6 21.6,-3 10.6,-3" fill="#c0392b" />
          <g opacity={animate ? 0 : 1}>
            {anim({ attributeName: "opacity", values: "0;0;1;1", keyTimes: "0;0.745;0.75;1" })}
            <ellipse cx="4" cy="0" rx="10" ry="3.4" fill="#4f9d69" opacity="0.25" stroke="#2f8f4e" strokeWidth="1.4" />
            <text x="4" y="1.6" textAnchor="middle" fontSize="4.2" fontWeight="900" fill="#2f8f4e" transform="skewX(-20)" style={{ fontFamily: "Arial, sans-serif" }}>
              APPROVED
            </text>
          </g>
        </g>
      </g>

      {/* stamp */}
      <g transform={animate ? undefined : "translate(0 -40)"}>
        {animate && (
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 -40;0 -40;0 0;0 0;0 -40;0 -40"
            keyTimes="0;0.7;0.75;0.78;0.88;1"
            calcMode="spline"
            keySplines="0 0 1 1;0.6 0 1 1;0 0 1 1;0.3 0 0.2 1;0 0 1 1"
            dur={DUR}
            repeatCount="indefinite"
          />
        )}
        <circle cx="614" cy="168" r="8" fill="#7b2d2d" />
        <rect x="610" y="174" width="8" height="18" fill="#5e3f23" />
        <rect x="598" y="192" width="32" height="10" rx="2" fill={ref("brass")} />
        <rect x="600" y="202" width="28" height="4" rx="1" fill="#2f8f4e" />
      </g>
      {/* ink pop on impact */}
      <g opacity="0">
        {anim({ attributeName: "opacity", values: "0;0;1;0;0", keyTimes: "0;0.75;0.76;0.84;1" })}
        {[-24, -12, 12, 24].map((dx) => (
          <line key={dx} x1={614 + dx * 0.9} y1={DESK_Y - 8} x2={614 + dx * 1.4} y2={DESK_Y - 16} stroke="#2f8f4e" strokeWidth="2" strokeLinecap="round" />
        ))}
      </g>

      {/* coffee */}
      <rect x="764" y="194" width="18" height="18" rx="3" fill="#ffffff" stroke="#d6cbb8" />
      <path d="M782 198 q7 0 7 5 q0 5 -7 5" fill="none" stroke="#d6cbb8" strokeWidth="2" />
      <rect x="766" y="198" width="14" height="3" fill={BROWN} opacity="0.6" />
      {[768, 776].map((x, i) => (
        <path key={x} d={`M${x} 190 q-4 -6 0 -12 q4 -6 0 -12`} fill="none" stroke="#c9bba2" strokeWidth="1.6" strokeLinecap="round" opacity="0.6">
          {animate && <animate attributeName="opacity" values="0;0.7;0" dur="2.4s" begin={`${i * 1.2}s`} repeatCount="indefinite" />}
        </path>
      ))}

      {/* small Canadian flag */}
      <rect x="808" y="208" width="14" height="4" rx="1.5" fill="#6f4f2c" />
      <rect x="814" y="164" width="2" height="46" fill="#8d969e" />
      <g transform="translate(816 166)">
        <g>
          {animate && <animateTransform attributeName="transform" type="skewY" values="0;-4;0;4;0" dur="3s" repeatCount="indefinite" />}
          <rect x="0" y="0" width="30" height="16" fill="#ffffff" />
          <rect x="0" y="0" width="7.5" height="16" fill="#d52b1e" />
          <rect x="22.5" y="0" width="7.5" height="16" fill="#d52b1e" />
          <path d="M15 3 l1.2 2.4 1.8-0.8 -0.6 3.4 2-1.4 0.4 1.6 1.6-0.4 -1.2 2.6 0.8 0.6 -3.4 0.6 0.2 2h-1.2l0.2-2 -3.4-0.6 0.8-0.6 -1.2-2.6 1.6 0.4 0.4-1.6 2 1.4 -0.6-3.4 1.8 0.8z" fill="#d52b1e" />
        </g>
      </g>

      {/* scales of justice */}
      <g>
        <rect x="864" y="206" width="30" height="6" rx="2" fill={ref("brass")} />
        <rect x="877.5" y="160" width="3" height="48" fill={ref("brass")} />
        <circle cx="879" cy="158" r="3" fill={ref("brass")} />
        <g>
          {animate && <animateTransform attributeName="transform" type="rotate" values="-4 879 164;4 879 164;-4 879 164" dur="5s" repeatCount="indefinite" />}
          <rect x="857" y="163" width="44" height="2.4" rx="1" fill={ref("brass")} />
          <path d="M859 165 l-6 16 h12 z M899 165 l-6 16 h12 z" fill="none" stroke="#b08a36" strokeWidth="0.8" />
          <path d="M852 181 q7 5 14 0 z M892 181 q7 5 14 0 z" fill={ref("brass")} />
        </g>
      </g>
    </SceneSvg>
  );
}
