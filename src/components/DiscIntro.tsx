"use client";

import { useEffect } from "react";

export default function DiscIntro({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 1800);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className="wii-panel-backdrop fixed inset-0 z-50 flex flex-col items-center justify-center gap-6"
      onClick={onClose}
      role="button"
      tabIndex={0}
      aria-label="Dismiss"
    >
      <div className="wii-disc-spin h-24 w-24 rounded-full sm:h-32 sm:w-32">
        <div className="h-full w-full rounded-full bg-[conic-gradient(from_0deg,#3b82c4,#8fd3ee,#3b82c4)]" />
      </div>
      <p className="font-rodin text-lg font-bold text-[#4a4a50] sm:text-xl">Loading Portfolio Disc…</p>
    </div>
  );
}
