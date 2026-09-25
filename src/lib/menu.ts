// The bottom bar and the channel grid are siblings, so the bar's buttons talk
// to the grid through a window event rather than shared React state.

export type MenuCommand =
  | { type: "home" } // Wii button: close everything, back to page 1
  | { type: "open"; id: string }; // open a channel's content directly

const MENU_EVENT = "wii:menu";

export function sendMenu(cmd: MenuCommand) {
  window.dispatchEvent(new CustomEvent<MenuCommand>(MENU_EVENT, { detail: cmd }));
}

export function onMenu(handler: (cmd: MenuCommand) => void) {
  const listener = (e: Event) => handler((e as CustomEvent<MenuCommand>).detail);
  window.addEventListener(MENU_EVENT, listener);
  return () => window.removeEventListener(MENU_EVENT, listener);
}

// the Mail button's "1 new message" is the welcome note; once read it clears
const MAIL_KEY = "wii:welcome-read";
const MAIL_EVENT = "wii:mail-read";

export function isMailRead() {
  try {
    return localStorage.getItem(MAIL_KEY) === "1";
  } catch {
    return false;
  }
}

export function markMailRead() {
  try {
    localStorage.setItem(MAIL_KEY, "1");
  } catch {
    // storage blocked: the badge just clears for this visit
  }
  window.dispatchEvent(new Event(MAIL_EVENT));
}

export function onMailRead(handler: () => void) {
  window.addEventListener(MAIL_EVENT, handler);
  return () => window.removeEventListener(MAIL_EVENT, handler);
}
