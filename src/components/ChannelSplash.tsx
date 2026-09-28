"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import ChannelScene from "./ChannelScene";
import IconBanner from "./scenes/IconBanner";
import type { Channel } from "@/lib/channels";
import { useFocusTrap } from "@/lib/useFocusTrap";

type Props = {
  channel: Channel;
  // where the tile sat on screen, so the splash can zoom out of it and back into it
  origin: DOMRect | null;
  // where to zoom back into on close; the tile may have moved (or be another
  // channel's) after browsing with the arrows
  closeTo?: () => DOMRect | null;
  onMenu: () => void;
  onStart: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  startLabel?: string;
  startDisabled?: boolean;
  // a third pill between Wii Menu and Start; with no href it shows as coming soon
  extra?: { label: string; href?: string };
};

const ZOOM_MS = 460;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

// transform that maps the full-size frame back onto the tile's rect
function tileTransform(frame: DOMRect, tile: DOMRect) {
  const scaleX = tile.width / frame.width;
  const scaleY = tile.height / frame.height;
  const dx = tile.left - frame.left;
  const dy = tile.top - frame.top;
  return `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`;
}

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function SplashArrow({ dir, onClick }: { dir: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={dir === "left" ? "Previous channel" : "Next channel"}
      onClick={onClick}
      data-sfx="page"
      className={`wii-arrow absolute top-1/2 z-10 h-[min(12vmin,64px)] w-[min(6.5vmin,36px)] -translate-y-1/2 outline-none ${
        dir === "left" ? "left-[1.5%]" : "right-[1.5%]"
      }`}
    >
      <svg viewBox="0 0 20 36" className="h-full w-full overflow-visible" style={dir === "left" ? { transform: "scaleX(-1)" } : undefined}>
        <path d="M2,1.5 Q6,18 2,34.5 L19,18 Z" fill="#9fe6fb" stroke="#2f7ea6" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M4,5 Q7,12 6,18 L14,15 Z" fill="#ffffff" opacity="0.6" />
      </svg>
    </button>
  );
}

export default function ChannelSplash({
  channel,
  origin,
  closeTo,
  onMenu,
  onStart,
  onPrev,
  onNext,
  startLabel = "Start",
  startDisabled = false,
  extra,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const leaving = useRef(false);
  useFocusTrap(rootRef);

  // the Wii zooms the channel up out of its tile
  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame || !origin || reducedMotion()) return;
    frame.animate(
      [{ transform: tileTransform(frame.getBoundingClientRect(), origin), borderRadius: "40px" }, { transform: "none" }],
      { duration: ZOOM_MS, easing: EASE }
    );
    backdropRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: ZOOM_MS * 0.6, easing: "ease-out" });
  }, [origin]);

  function backToMenu() {
    const frame = frameRef.current;
    if (leaving.current) return;
    leaving.current = true;
    const target = closeTo?.() ?? origin;
    if (!frame || !target || reducedMotion()) return onMenu();
    const zoom = frame.animate(
      [{ transform: "none" }, { transform: tileTransform(frame.getBoundingClientRect(), target) }],
      { duration: ZOOM_MS * 0.8, easing: "cubic-bezier(0.55, 0, 0.75, 0.2)", fill: "forwards" }
    );
    backdropRef.current?.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: ZOOM_MS * 0.8,
      easing: "ease-in",
      fill: "forwards",
    });
    zoom.onfinish = onMenu;
  }

  function start() {
    if (leaving.current || startDisabled) return;
    leaving.current = true;
    onStart();
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" || e.key === "Backspace") backToMenu();
      // a focused button handles its own Enter (Wii Menu must not trigger Start)
      if (e.key === "Enter" && !(e.target instanceof HTMLButtonElement)) start();
      if (e.key === "ArrowLeft" && onPrev && !leaving.current) onPrev();
      if (e.key === "ArrowRight" && onNext && !leaving.current) onNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div ref={rootRef} className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={channel.title}>
      <div ref={backdropRef} className="absolute inset-0 bg-black" />

      <div
        ref={frameRef}
        className="wii-splash absolute inset-[1.2vmin] flex origin-top-left flex-col overflow-hidden"
        style={{ "--accent": channel.accent } as React.CSSProperties}
      >
        {/* title */}
        <div className="wii-splash-top relative flex shrink-0 items-center justify-center" style={{ height: "30%" }}>
          <h2 className="wii-splash-title wii-splash-reveal px-[4%] text-center leading-none">{channel.title}</h2>
        </div>

        {/* animated banner */}
        <div className={`relative min-h-0 flex-1 ${origin ? "" : "wii-splash-swap"}`}>
          {channel.scene ? (
            <ChannelScene kind={channel.scene} variant="splash" className="absolute inset-0 h-full w-full" />
          ) : (
            <IconBanner channel={channel} className="absolute inset-0" />
          )}
          <div className="wii-splash-fade pointer-events-none absolute inset-x-0 top-0 h-[22%]" />
          {onPrev && <SplashArrow dir="left" onClick={onPrev} />}
          {onNext && <SplashArrow dir="right" onClick={onNext} />}
        </div>

        {/* Wii Menu / Start */}
        <div className="wii-splash-bottom relative flex shrink-0 items-center justify-center" style={{ height: "26%" }}>
          <div
            className={`wii-splash-reveal flex w-full items-center justify-center px-[6%] ${extra ? "wii-pill-row--three gap-[4%]" : "gap-[6%]"}`}
          >
            <button type="button" onClick={backToMenu} className="wii-pill" data-sfx="back">
              Wii Menu
            </button>
            {extra &&
              (extra.href ? (
                <a href={extra.href} target="_blank" rel="noopener noreferrer" className="wii-pill inline-flex items-center justify-center">
                  {extra.label}
                </a>
              ) : (
                <button type="button" className="wii-pill" disabled aria-label={`${extra.label}, coming soon`} title="Coming soon">
                  {extra.label}
                </button>
              ))}
            <button type="button" onClick={start} className="wii-pill" data-sfx="start" disabled={startDisabled} autoFocus={!startDisabled}>
              {startLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
