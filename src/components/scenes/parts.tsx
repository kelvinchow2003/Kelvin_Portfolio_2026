"use client";

import { useId } from "react";

// Reusable pieces for the channel scenes: a two-link robot arm driven by
// inverse kinematics, a smart camera, and a monitor.

export type Pt = readonly [number, number];

const LINK = 112;

// Elbow-up IK for a planar two-link arm. Angles are degrees, clockwise from
// straight up; the wrist angle keeps the tool pointing straight down.
export function ik([bx, by]: Pt, [x, y]: Pt, l1 = LINK, l2 = LINK) {
  const dx = x - bx;
  const dy = y - by;
  const d = Math.min(Math.hypot(dx, dy), l1 + l2 - 0.01);
  const phi = Math.atan2(dx, -dy);
  const a = Math.acos((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d));
  const bend = Math.PI - Math.acos((l1 * l1 + l2 * l2 - d * d) / (2 * l1 * l2));
  // keep the elbow above the base→target line on whichever side the target is,
  // so moving across the base swings the arm up and over rather than under
  const side = dx < 0 ? -1 : 1;
  const t1 = phi - side * a;
  const t2 = side * bend;
  const deg = (r: number) => +((r * 180) / Math.PI).toFixed(2);
  return [deg(t1), deg(t2), -(deg(t1) + deg(t2))] as const;
}

// A UR joint seen end-on: brushed housing, dark seal ring, light-blue cap.
export function UrJoint({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#e3e7ea" stroke="#9aa4ac" strokeWidth="1.2" />
      <path d={`M${cx - r * 0.92} ${cy + r * 0.3} A${r} ${r} 0 0 0 ${cx + r * 0.92} ${cy + r * 0.3}`} fill="none" stroke="#b9c1c7" strokeWidth={r * 0.14} />
      <circle cx={cx} cy={cy} r={r * 0.8} fill="#2b2f35" />
      <circle cx={cx} cy={cy} r={r * 0.72} fill="#7fb6e3" />
      <circle cx={cx} cy={cy} r={r * 0.6} fill="#9cc9ef" />
      <circle cx={cx} cy={cy} r={r * 0.24} fill="#b7d9f5" stroke="#7fb6e3" strokeWidth="0.8" />
      <path d={`M${cx - r * 0.5} ${cy - r * 0.2} A${r * 0.55} ${r * 0.55} 0 0 1 ${cx + r * 0.1} ${cy - r * 0.54}`} fill="none" stroke="#ffffff" strokeWidth={r * 0.1} strokeLinecap="round" opacity="0.8" />
    </g>
  );
}

function YaskawaJoint({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#1f64b0" stroke="#15487f" strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r={r * 0.55} fill="#d9dee3" stroke="#9aa4ac" strokeWidth="1" />
      <circle cx={cx} cy={cy} r={r * 0.2} fill="#6b747c" />
    </g>
  );
}

type ArmProps = {
  /** shoulder joint, in stage coordinates */
  base: Pt;
  /** wrist positions to move through, one per keyTime */
  targets: readonly Pt[];
  keyTimes: string;
  keySplines: string;
  dur: string;
  animate: boolean;
  /** which target to hold when motion is reduced */
  restIndex?: number;
  look?: "ur" | "yaskawa";
  /** face left instead of right */
  mirror?: boolean;
  /** the tool, drawn in the wrist's frame: origin at the wrist, pointing down */
  children?: React.ReactNode;
};

export function RobotArm({ base, targets, keyTimes, keySplines, dur, animate, restIndex = 0, look = "ur", mirror = false, children }: ArmProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const gid = `arm-${uid}`;
  const [bx, by] = base;
  // solve in the arm's own (possibly mirrored) frame
  const local = targets.map(([x, y]) => [mirror ? 2 * bx - x : x, y] as const);
  const poses = local.map((t) => ik(base, t));
  const col = (i: 0 | 1 | 2) => poses.map((p) => p[i]);

  const joint = (i: 0 | 1 | 2, pivot: Pt) => {
    const rest = col(i)[restIndex];
    return {
      transform: animate ? undefined : `rotate(${rest} ${pivot[0]} ${pivot[1]})`,
      anim: animate ? (
        <animateTransform
          attributeName="transform"
          type="rotate"
          values={col(i).map((d) => `${d} ${pivot[0]} ${pivot[1]}`).join(";")}
          keyTimes={keyTimes}
          calcMode="spline"
          keySplines={keySplines}
          dur={dur}
          repeatCount="indefinite"
        />
      ) : null,
    };
  };

  const elbow: Pt = [bx, by - LINK];
  const wrist: Pt = [bx, by - 2 * LINK];
  const sh = joint(0, base);
  const el = joint(1, elbow);
  const wr = joint(2, wrist);
  const ur = look === "ur";
  const Joint = ur ? UrJoint : YaskawaJoint;
  const linkFill = `url(#${gid}-link)`;

  return (
    <g transform={mirror ? `translate(${2 * bx} 0) scale(-1 1)` : undefined}>
      <defs>
        <linearGradient id={`${gid}-link`} x1="0" y1="0" x2="1" y2="0">
          {ur ? (
            <>
              <stop offset="0%" stopColor="#aab3ba" />
              <stop offset="30%" stopColor="#f4f6f8" />
              <stop offset="65%" stopColor="#cfd6dc" />
              <stop offset="100%" stopColor="#8e98a0" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#174f8c" />
              <stop offset="35%" stopColor="#3f86d4" />
              <stop offset="100%" stopColor="#15487f" />
            </>
          )}
        </linearGradient>
      </defs>

      {/* base */}
      {ur ? (
        <>
          <rect x={bx - 17} y={by + 2} width="34" height="26" rx="4" fill={linkFill} />
          <rect x={bx - 17} y={by + 12} width="34" height="2" fill="#2b2f35" />
          <rect x={bx - 17} y={by + 14} width="34" height="6" fill="#8ec3ea" />
          <rect x={bx - 22} y={by + 26} width="44" height="5" rx="1.5" fill="#3a4148" />
        </>
      ) : (
        <>
          <rect x={bx - 26} y={by + 2} width="52" height="28" rx="5" fill={linkFill} />
          <rect x={bx - 30} y={by + 24} width="60" height="6" rx="2" fill="#2e3238" />
        </>
      )}

      <g transform={sh.transform}>
        {sh.anim}
        {ur ? (
          <>
            <rect x={bx - 10} y={by - LINK} width="20" height={LINK} rx="10" fill={linkFill} />
            <rect x={bx - 11} y={by - LINK + 16} width="22" height="3" rx="1" fill="#b9c1c7" />
            <rect x={bx - 11} y={by - 20} width="22" height="3" rx="1" fill="#b9c1c7" />
          </>
        ) : (
          <rect x={bx - 13} y={by - LINK} width="26" height={LINK} rx="6" fill={linkFill} />
        )}
        <g transform={el.transform}>
          {el.anim}
          {ur ? (
            <>
              <rect x={bx - 7.5} y={wrist[1]} width="15" height={LINK} rx="7.5" fill={linkFill} />
              <rect x={bx - 8.5} y={elbow[1] - 18} width="17" height="3" rx="1" fill="#b9c1c7" />
            </>
          ) : (
            <>
              <rect x={bx - 11} y={wrist[1] + 30} width="22" height={LINK - 30} rx="5" fill={linkFill} />
              <rect x={bx - 7} y={wrist[1]} width="14" height="40" rx="4" fill={linkFill} />
            </>
          )}
          <g transform={wr.transform}>
            {wr.anim}
            <g transform={`translate(${wrist[0]} ${wrist[1]})`}>
              {ur ? (
                <>
                  {/* wrist 2: cylinder across the view, cap to the side */}
                  <rect x="-6" y="0" width="12" height="8" fill={linkFill} />
                  <rect x="-12" y="7" width="24" height="15" rx="5" fill={linkFill} />
                  <rect x="9" y="7" width="2" height="15" fill="#2b2f35" />
                  <rect x="11" y="7.5" width="5" height="14" rx="2.5" fill="#8ec3ea" />
                  {/* wrist 3: pointing down, blue ring, tool flange */}
                  <rect x="-8.5" y="21" width="17" height="9" rx="2" fill={linkFill} />
                  <rect x="-8.5" y="26" width="17" height="1.5" fill="#2b2f35" />
                  <rect x="-8.5" y="27.5" width="17" height="3" fill="#8ec3ea" />
                  <rect x="-11" y="30" width="22" height="3" rx="1" fill="#4a5359" />
                </>
              ) : (
                <>
                  <rect x="-6" y="0" width="12" height="16" fill={linkFill} />
                  <Joint cx={0} cy={16} r={8} />
                  <rect x="-10" y="22" width="20" height="8" rx="2" fill={linkFill} />
                  <rect x="-13" y="30" width="26" height="3" rx="1" fill="#4a5359" />
                </>
              )}
              <g transform="translate(0 33)">{children}</g>
            </g>
          </g>
          <Joint cx={wrist[0]} cy={wrist[1]} r={10} />
        </g>
        <Joint cx={elbow[0]} cy={elbow[1]} r={ur ? 15 : 17} />
      </g>
      <Joint cx={bx} cy={by} r={ur ? 19 : 21} />
    </g>
  );
}

/** Tool-flange smart camera: gunmetal body, yellow cover, ring light round the lens. Origin = mount, top centre. */
export function SmartCamera({ flash }: { flash?: React.ReactNode }) {
  return (
    <g>
      {/* M12 connectors and cable out the back */}
      <rect x="-15" y="-5" width="5" height="6" rx="1" fill="#6b747c" />
      <rect x="-8" y="-5" width="5" height="6" rx="1" fill="#6b747c" />
      <rect x="-17" y="0" width="34" height="26" rx="3.5" fill="#33383e" />
      <rect x="-17" y="0" width="34" height="26" rx="3.5" fill="none" stroke="#1d2024" strokeWidth="0.8" />
      <rect x="-17" y="0" width="34" height="10" rx="3.5" fill="#ffd100" />
      <rect x="-17" y="6" width="34" height="4" fill="#ffd100" />
      <rect x="-17" y="10" width="34" height="1.2" fill="#1d2024" opacity="0.5" />
      <rect x="-9" y="3" width="14" height="3" rx="1" fill="#1d2024" opacity="0.8" />
      <rect x="-14" y="14" width="10" height="1.4" rx="0.7" fill="#5b636a" />
      <rect x="-14" y="17" width="10" height="1.4" rx="0.7" fill="#5b636a" />
      <circle cx="11" cy="15" r="1.5" fill="#7cfc9a" />
      <circle cx="11" cy="20" r="1.5" fill="#ffb238" />
      {/* lens barrel with LED ring */}
      <rect x="-10" y="26" width="20" height="5" rx="1.5" fill="#1d2024" />
      {[-7.5, -4.5, -1.5, 1.5, 4.5, 7.5].map((x) => (
        <circle key={x} cx={x} cy="30.2" r="0.9" fill="#ffffff" opacity="0.75" />
      ))}
      <ellipse cx="0" cy="31.5" rx="4.5" ry="1.8" fill="#6fd0ff" />
      {flash}
    </g>
  );
}

/** Two-finger gripper. Origin = flange, pointing down. */
export function Gripper() {
  return (
    <g>
      <rect x="-12" y="0" width="24" height="10" rx="2" fill="#3a4148" />
      <rect x="-11" y="10" width="5" height="14" rx="1" fill="#6b747c" />
      <rect x="6" y="10" width="5" height="14" rx="1" fill="#6b747c" />
    </g>
  );
}

type MonitorProps = {
  x: number;
  y: number;
  w: number;
  h: number;
  screen?: string;
  stand?: boolean;
  children?: React.ReactNode;
};

/** A flat-panel monitor; children draw in stage coordinates inside the screen. */
export function Monitor({ x, y, w, h, screen = "#f7f9fb", stand = true, children }: MonitorProps) {
  return (
    <g>
      {stand && (
        <>
          <rect x={x + w / 2 - 10} y={y + h} width="20" height="12" fill="#4b555c" />
          <rect x={x + w / 2 - 22} y={y + h + 10} width="44" height="4" rx="2" fill="#4b555c" />
        </>
      )}
      <rect x={x} y={y} width={w} height={h} rx="5" fill="#2e3238" />
      <rect x={x + 5} y={y + 5} width={w - 10} height={h - 10} rx="2" fill={screen} />
      {children}
    </g>
  );
}
