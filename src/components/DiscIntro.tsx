"use client";

import { useEffect, useRef } from "react";

// A short "disc is spinning up" beat before the Quick Tour opens. Clicking,
// tapping or pressing Enter/Space skips straight to it.
export default function DiscIntro({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  // the parent passes a fresh callback each render; don't restart the timer for it
  const done = useRef(onDone);
  useEffect(() => {
    done.current = onDone;
  });

  useEffect(() => {
    ref.current?.focus();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => done.current(), reduced ? 0 : 1300);
    return () => clearTimeout(t);
  }, []);

  return (
    <button
      ref={ref}
      type="button"
      onClick={onDone}
      aria-label="Loading Portfolio Disc. Press to skip."
      className="wii-panel-backdrop fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 outline-none"
    >
      <span className="wii-disc-spin block h-24 w-24 rounded-full sm:h-32 sm:w-32" aria-hidden="true">
        <span className="block h-full w-full rounded-full bg-[conic-gradient(from_0deg,#3b82c4,#8fd3ee,#3b82c4)]" />
      </span>
      <span className="font-rodin text-lg font-bold text-[#4a4a50] sm:text-xl">Loading Portfolio Disc…</span>
    </button>
  );
}
