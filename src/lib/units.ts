// The layout is authored against the Wii Menu's native 515×388 reference frame
// (a 4:3 capture). Horizontal/vertical measurements scale independently so the
// grid stretches anamorphically on widescreen like the real console, while
// round things (buttons, text, the clock) use `u` so they never distort.
export const REF_W = 515;
export const REF_H = 388;

export const sx = (n: number) => `calc(var(--sx) * ${n})`;
export const sy = (n: number) => `calc(var(--sy) * ${n})`;
export const u = (n: number) => `calc(var(--u) * ${n})`;
