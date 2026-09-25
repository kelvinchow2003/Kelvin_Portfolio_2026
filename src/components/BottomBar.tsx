"use client";

import { useEffect, useId, useRef, useState } from "react";
import { u } from "@/lib/units";
import { isMailRead, onMailRead, sendMenu } from "@/lib/menu";

// All geometry is in the Wii Menu's 515×388 reference frame (see lib/units).
// The bar's cyan edge sits 281 units down; YO leaves room above it for the
// line's glow so nothing gets clipped at the top of the SVG.
const YO = 2;
const BAR_H = 388 - 281 + YO;
const DIP = 42; // how far the centre of the bar dips below the shoulders
const BTN = 63; // outer diameter of the Wii / Mail buttons
const BTN_CX = 61; // button centre, measured in from each screen edge
const BTN_CY = YO + 45;

/* ---------- seven-segment clock ---------- */

const SEG_W = 18;
const SEG_H = 27;
const SEG_T = 3.2;
const SEG_GAP = 0.7;

const DIGIT_SEGMENTS: Record<string, string> = {
  "0": "abcdef",
  "1": "bc",
  "2": "abdeg",
  "3": "abcdg",
  "4": "bcfg",
  "5": "acdfg",
  "6": "acdefg",
  "7": "abc",
  "8": "abcdefg",
  "9": "abcdfg",
};

function hSeg(y: number, x0: number, x1: number) {
  const h = SEG_T / 2;
  return `${x0},${y} ${x0 + h},${y - h} ${x1 - h},${y - h} ${x1},${y} ${x1 - h},${y + h} ${x0 + h},${y + h}`;
}

function vSeg(x: number, y0: number, y1: number) {
  const h = SEG_T / 2;
  return `${x},${y0} ${x + h},${y0 + h} ${x + h},${y1 - h} ${x},${y1} ${x - h},${y1 - h} ${x - h},${y0 + h}`;
}

const H = SEG_T / 2;
const MID = SEG_H / 2;
const SEGMENTS: Record<string, string> = {
  a: hSeg(H, H + SEG_GAP, SEG_W - H - SEG_GAP),
  b: vSeg(SEG_W - H, H + SEG_GAP, MID - SEG_GAP),
  c: vSeg(SEG_W - H, MID + SEG_GAP, SEG_H - H - SEG_GAP),
  d: hSeg(SEG_H - H, H + SEG_GAP, SEG_W - H - SEG_GAP),
  e: vSeg(H, MID + SEG_GAP, SEG_H - H - SEG_GAP),
  f: vSeg(H, H + SEG_GAP, MID - SEG_GAP),
  g: hSeg(MID, H + SEG_GAP, SEG_W - H - SEG_GAP),
};

function SegDigit({ digit, left }: { digit: string | null; left: number }) {
  const segs = digit ? DIGIT_SEGMENTS[digit] : "";
  // the Wii clock draws its "1" as a single bar left of centre, not on the right edge
  const shift = digit === "1" ? -(SEG_W - H - 6.5) : 0;
  return (
    <svg
      viewBox={`0 0 ${SEG_W} ${SEG_H}`}
      className="wii-seg absolute top-0 overflow-visible"
      style={{ left: `calc(50% + ${u(left)})`, width: u(SEG_W), height: u(SEG_H) }}
      aria-hidden="true"
    >
      <g transform={`translate(${shift} 0)`}>
        {segs.split("").map((s) => (
          <polygon key={s} points={SEGMENTS[s]} fill="#a3a3a3" stroke="#8d8d8d" strokeWidth="0.45" />
        ))}
      </g>
    </svg>
  );
}

function Clock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // defer the first tick so the server render (no time) hydrates cleanly
    const first = setTimeout(() => setNow(new Date()), 0);
    const id = setInterval(() => setNow(new Date()), 500);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  const hours12 = now ? now.getHours() % 12 || 12 : null;
  const minutes = now ? now.getMinutes() : null;
  const hh = hours12 === null ? null : String(hours12).padStart(2, " ");
  const mm = minutes === null ? null : String(minutes).padStart(2, "0");
  const showColon = now ? now.getSeconds() % 2 === 0 : false;
  const ampm = now ? (now.getHours() < 12 ? "AM" : "PM") : "";
  const weekday = now ? now.toLocaleDateString("en-US", { weekday: "short" }) : "";
  const date = now ? `${weekday} ${now.getMonth() + 1}/${now.getDate()}` : "";

  const d = (s: string | null, i: number) => (s && s[i] !== " " ? s[i] : null);

  return (
    <>
      <div
        role="timer"
        aria-label={now ? now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : "Clock"}
        className="absolute inset-x-0"
        style={{ top: u(YO + 3), height: u(SEG_H) }}
      >
        <SegDigit digit={d(hh, 0)} left={-50.5} />
        <SegDigit digit={d(hh, 1)} left={-26.5} />
        {showColon && (
          <svg
            viewBox="0 0 4 27"
            className="wii-seg absolute top-0"
            style={{ left: `calc(50% + ${u(-1)})`, width: u(4), height: u(SEG_H) }}
            aria-hidden="true"
          >
            <rect x="0.4" y="7.5" width="3.2" height="3.2" fill="#a3a3a3" stroke="#8d8d8d" strokeWidth="0.45" />
            <rect x="0.4" y="17" width="3.2" height="3.2" fill="#a3a3a3" stroke="#8d8d8d" strokeWidth="0.45" />
          </svg>
        )}
        <SegDigit digit={d(mm, 0)} left={10.5} />
        <SegDigit digit={d(mm, 1)} left={34.5} />
        <span
          className="font-rodin wii-embossed absolute font-bold leading-none text-[#9b9b9b]"
          style={{ left: `calc(50% + ${u(65.5)})`, bottom: 0, fontSize: u(11) }}
        >
          {ampm}
        </span>
      </div>

      <div
        className="font-rodin wii-embossed absolute inset-x-0 text-center font-bold leading-none whitespace-nowrap text-[#65666b]"
        style={{ top: u(YO + 44), fontSize: u(25), letterSpacing: u(0.2) }}
      >
        {date}
      </div>
    </>
  );
}

/* ---------- buttons & icons ---------- */

function WiiButton() {
  return (
    <button
      type="button"
      aria-label="Wii Menu"
      onClick={() => sendMenu({ type: "home" })}
      className="wii-round-btn absolute flex items-center justify-center rounded-full"
      style={{ left: u(BTN_CX - BTN / 2), top: u(BTN_CY - BTN / 2), width: u(BTN), height: u(BTN) }}
    >
      <span
        className="wii-embossed font-wii leading-none text-[#a4a4a4]"
        style={{ fontSize: u(18.5), fontWeight: 900, letterSpacing: u(-0.4), marginTop: u(-1) }}
      >
        Wii
      </span>
    </button>
  );
}

function MailButton() {
  // first-time visitors have the welcome note waiting
  const [unread, setUnread] = useState(1);

  useEffect(() => {
    // read after mount so the server render (no storage) hydrates cleanly
    const sync = () => setUnread(isMailRead() ? 0 : 1);
    const first = setTimeout(sync, 0);
    const off = onMailRead(() => setUnread(0));
    return () => {
      clearTimeout(first);
      off();
    };
  }, []);

  return (
    <button
      type="button"
      aria-label={unread ? `Wii Message Board, ${unread} new message` : "Wii Message Board"}
      onClick={() => sendMenu({ type: "open", id: "contact" })}
      className="wii-round-btn absolute flex flex-col items-center rounded-full"
      style={{
        right: u(BTN_CX - BTN / 2),
        top: u(BTN_CY - BTN / 2),
        width: u(BTN),
        height: u(BTN),
        paddingTop: u(13),
      }}
    >
      <svg viewBox="0 0 36 24" style={{ width: u(34), height: u(23) }} aria-hidden="true">
        <rect x="0.5" y="0.5" width="35" height="23" rx="1.5" fill="#9c9c9c" />
        <path d="M2.5 4.5 L18 13.5 L33.5 4.5" fill="none" stroke="#f2f2f2" strokeWidth="2.2" strokeLinejoin="round" />
      </svg>
      <span
        className="font-rodin wii-embossed leading-none text-[#8e8e8e]"
        style={{ fontSize: u(15), fontWeight: 500, marginTop: u(3), visibility: unread ? "visible" : "hidden" }}
      >
        {unread || 0}
      </span>
    </button>
  );
}

function SDCard() {
  return (
    <button
      type="button"
      aria-label="SD Card Menu: resume"
      onClick={() => sendMenu({ type: "open", id: "resume" })}
      className="absolute outline-none transition-transform hover:scale-110 focus-visible:scale-110"
      style={{ left: u(117), top: u(YO + 43), width: u(26), height: u(35) }}
    >
      <svg viewBox="0 0 26 35" className="h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id="sd-face" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#ececec" />
          </linearGradient>
        </defs>
        <path
          d="M3,1 H19 L25,7 V32 A2,2 0 0 1 23,34 H3 A2,2 0 0 1 1,32 V3 A2,2 0 0 1 3,1 Z"
          fill="#8f8f91"
        />
        <path d="M4,3.5 H18.5 L22.5,7.5 V25 H4 Z" fill="url(#sd-face)" />
        <rect x="4" y="27" width="18.5" height="4.5" fill="#bdbdbf" />
        <text
          x="13"
          y="17.5"
          textAnchor="middle"
          fontSize="7"
          fontStyle="italic"
          fontWeight="800"
          fill="#9a9a9c"
          fontFamily="var(--font-mplus), sans-serif"
        >
          SD
        </text>
      </svg>
    </button>
  );
}

/* ---------- bar ---------- */

function barPath(w: number) {
  const y = YO;
  const b = YO + DIP;
  return `M0,${y} H70 C110,${y} 140,${b} 182,${b} H${w - 182} C${w - 140},${b} ${w - 110},${y} ${w - 70},${y} H${w}`;
}

export default function BottomBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 515, h: BAR_H });
  const id = useId().replace(/:/g, "");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const unit = Math.min(el.clientWidth / 515, window.innerHeight / 388);
      setDims({ w: el.clientWidth / unit, h: el.clientHeight / unit });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const edge = barPath(dims.w);
  const body = `${edge} V${dims.h} H0 Z`;

  return (
    <div
      ref={ref}
      className="absolute inset-x-0 bottom-0"
      style={{ height: `max(calc(var(--sy) * ${BAR_H}), ${u(BAR_H)})` }}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${dims.w} ${dims.h}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`${id}-body`} x1="0" y1={YO} x2="0" y2={dims.h} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#c3c4c9" />
            <stop offset="30%" stopColor="#d5d6db" />
            <stop offset="65%" stopColor="#d2d2da" />
            <stop offset="100%" stopColor="#cfcfd7" />
          </linearGradient>
          <clipPath id={`${id}-clip`}>
            <path d={body} />
          </clipPath>
          <filter id={`${id}-blur`} x="-5%" y="-50%" width="110%" height="200%">
            <feGaussianBlur stdDeviation="3.5" />
          </filter>
        </defs>

        <path d={body} fill={`url(#${id}-body)`} />
        {/* soft shadow tucked under the lip, following the curve */}
        <g clipPath={`url(#${id}-clip)`}>
          <path
            d={edge}
            transform="translate(0 4)"
            fill="none"
            stroke="#a4a5ad"
            strokeWidth="10"
            opacity="0.7"
            filter={`url(#${id}-blur)`}
          />
        </g>
        {/* white highlight above, then the cyan rim */}
        <path d={edge} transform="translate(0 -1.3)" fill="none" stroke="#ffffff" strokeWidth="1.4" opacity="0.9" />
        <path d={edge} fill="none" stroke="#3cb8e0" strokeWidth="2" />
      </svg>

      {/* raised pill trays that house the Wii and Mail buttons */}
      <div
        className="wii-capsule absolute rounded-full"
        style={{ left: u(-40), top: u(YO + 10), width: u(143), height: u(78) }}
      />
      <div
        className="wii-capsule absolute rounded-full"
        style={{ right: u(-40), top: u(YO + 10), width: u(143), height: u(78) }}
      />

      <WiiButton />
      <SDCard />
      <Clock />
      <MailButton />
    </div>
  );
}
