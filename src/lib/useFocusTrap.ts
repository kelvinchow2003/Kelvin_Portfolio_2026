import { useEffect, type RefObject } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Keeps Tab / Shift+Tab cycling inside a modal. When two modals overlap for a
// moment (the splash fading out under a panel), only the one holding focus
// traps it.
export function useFocusTrap(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const root = ref.current;
      if (e.key !== "Tab" || !root) return;
      const active = document.activeElement;
      if (active && active !== document.body && !root.contains(active)) return;

      const items = [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.getClientRects().length > 0);
      if (!items.length) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const outside = !root.contains(active) || active === root;
      if (e.shiftKey && (active === first || outside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || outside)) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [ref]);
}
