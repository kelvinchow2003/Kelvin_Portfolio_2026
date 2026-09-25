"use client";

import { useId } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

// Shared plumbing for the hand-drawn channel scenes.
//
// Every scene is authored on a 960×300 stage. The splash shows the whole
// stage; the tile crops the middle 540 units (the tile is ~16:9 on
// widescreen and ~4:3 on narrow screens, and this crop covers both) with
// the channel name pinned in a band along the bottom edge. Keep anything
// important in x 250–650, y 40–250 so it survives both crops.

export type SceneVariant = "tile" | "splash";

export function useScene() {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const id = (name: string) => `scn-${uid}-${name}`;
  const ref = (name: string) => `url(#${id(name)})`;
  const animate = !useReducedMotion();
  return { id, ref, animate };
}

type Props = {
  variant: SceneVariant;
  className?: string;
  title: string;
  titleColor: string;
  bandColor: string;
  children: React.ReactNode;
};

export function SceneSvg({ variant, className, title, titleColor, bandColor, children }: Props) {
  const tile = variant === "tile";
  // on a 4:3 tile only ~400 units of the band are visible, so long names shrink to fit
  const titleSize = Math.min(31, 390 / (title.length * 0.6));
  return (
    <svg
      viewBox={tile ? "180 0 540 300" : "0 0 960 300"}
      preserveAspectRatio={tile ? "xMidYMax slice" : "xMidYMid slice"}
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
      {tile && (
        <g>
          <rect x="180" y="256" width="540" height="44" fill="#ffffff" opacity="0.88" />
          <line x1="180" y1="256" x2="720" y2="256" stroke={bandColor} strokeWidth="2" opacity="0.5" />
          <text
            x="450"
            y="289"
            textAnchor="middle"
            fontSize={titleSize}
            fontWeight="900"
            fill={titleColor}
            style={{ fontFamily: "var(--font-nunito), Arial, sans-serif" }}
          >
            {title}
          </text>
        </g>
      )}
    </svg>
  );
}
