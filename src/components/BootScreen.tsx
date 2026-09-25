"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BOOT_COOKIE } from "@/lib/menu";
import { NAME, ROLE } from "@/lib/site";

// The screen before the Wii Menu, like the console's "press A" start-up
// screen, so visitors learn whose Wii this is before anything else. The page
// only renders it when this session cookie is missing, so it shows once per
// browser session with no flash for anyone who has already seen it.

export default function BootScreen() {
  const [state, setState] = useState<"show" | "leaving" | "gone">("show");
  const buttonRef = useRef<HTMLButtonElement>(null);

  const dismiss = useCallback(() => {
    // no expiry: a session cookie, cleared when the browser closes
    document.cookie = `${BOOT_COOKIE}=1; path=/; SameSite=Lax`;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setState("leaving");
    setTimeout(() => setState("gone"), reduced ? 0 : 350);
  }, []);

  useEffect(() => {
    buttonRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (state !== "show") return;
    function onKey(e: KeyboardEvent) {
      // A on the Wii Remote; Enter / Space are handled by the focused button
      if (e.key === "a" || e.key === "A") dismiss();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state, dismiss]);

  if (state === "gone") return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="boot-name"
      aria-describedby="boot-role"
      onClick={dismiss}
      className={`wii-boot fixed inset-0 z-[60] flex flex-col items-center justify-center px-6 text-center ${
        state === "leaving" ? "wii-boot--leaving" : ""
      }`}
    >
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#6b6b72]">Welcome to the portfolio of</p>
      <p id="boot-name" className="wii-boot-name mt-4">
        {NAME}
      </p>
      <p id="boot-role" className="mt-5 max-w-xl text-base font-bold text-[#4a4a50] sm:text-lg">
        {ROLE}
      </p>
      <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[#5a5a60]">
        This whole site is a working Wii Menu. Every channel is a piece of my work: jobs, projects, skills, and a way to
        reach me.
      </p>

      <button
        ref={buttonRef}
        type="button"
        data-sfx="start"
        onClick={(e) => {
          e.stopPropagation();
          dismiss();
        }}
        className="wii-pill mt-10"
        style={{ flex: "none", width: "min(64vw, 15rem)", height: "3.4rem", fontSize: "1.15rem" }}
      >
        Continue
      </button>
      <p className="wii-boot-prompt mt-4 text-sm font-bold text-[#5a5a60]" aria-hidden="true">
        Press <span className="font-wii text-[#3aa6cf]">Ⓐ</span> or click anywhere
      </p>

      <p className="absolute inset-x-4 bottom-4 text-xs text-[#6b6b72]">
        A fan-made tribute to the Wii Menu. Not affiliated with or endorsed by Nintendo.
      </p>
    </div>
  );
}
