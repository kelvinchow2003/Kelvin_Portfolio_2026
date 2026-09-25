"use client";

import { useEffect } from "react";
import { play, unlockAudio, type Sfx } from "@/lib/sound";

// Plays menu sounds for the whole page from one set of delegated listeners,
// so components only need a data-sfx attribute to pick a sound on click
// (buttons and links default to "select").
const POINTABLE =
  ".wii-tile.group, .wii-pill, .wii-pill-sm, .wii-round-btn, .wii-arrow, .wii-panel-chip, .wii-panel-back, .wii-dot, .wii-sd";

export default function SoundFx() {
  useEffect(() => {
    let hovered: Element | null = null;
    let keyboard = false;

    const onKeyDown = () => {
      keyboard = true;
      unlockAudio();
    };
    const onPointerDown = () => {
      keyboard = false;
      unlockAudio();
    };

    function onPointerOver(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      const el = (e.target as Element).closest(POINTABLE);
      if (el && el !== hovered && !(el as HTMLButtonElement).disabled) play("hover");
      hovered = el;
    }

    // stepping between tiles with the keyboard ticks like pointing at them
    function onFocusIn(e: FocusEvent) {
      if (keyboard && (e.target as Element).matches?.(".wii-tile.group")) play("hover");
    }

    function onClick(e: MouseEvent) {
      const el = (e.target as Element).closest<HTMLElement>("button, a[href]");
      if (!el || (el as HTMLButtonElement).disabled) return;
      play((el.dataset.sfx as Sfx | undefined) ?? "select");
    }

    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("pointerover", onPointerOver);
    document.addEventListener("focusin", onFocusIn);
    // capture, so it still sounds when a handler unmounts the button it was on
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  return null;
}
