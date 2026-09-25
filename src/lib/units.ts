// The layout is authored against the Wii Menu's native 515×388 reference frame
// (a 4:3 capture). Horizontal/vertical measurements scale independently so the
// grid stretches anamorphically on widescreen like the real console, while
// round things (buttons, text, the clock) use `u` so they never distort.
export const REF_W = 515;
export const REF_H = 388;

export const sx = (n: number) => `calc(var(--sx) * ${n})`;
export const sy = (n: number) => `calc(var(--sy) * ${n})`;
export const u = (n: number) => `calc(var(--u) * ${n})`;

// Tall screens (phones, portrait tablets) get a scrolling two-column menu
// instead of the stretched 4:3 grid. Keep in sync with the same query in globals.css.
export const PORTRAIT_QUERY = "(max-aspect-ratio: 4/5)";
export const isPortraitLayout = () => window.matchMedia(PORTRAIT_QUERY).matches;
