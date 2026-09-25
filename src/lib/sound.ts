// Menu sound effects, synthesised on the fly with Web Audio. They're original
// blips in the spirit of the Wii Menu, not Nintendo's recordings.

export type Sfx = "hover" | "select" | "start" | "back" | "page";

const MUTE_KEY = "wii:muted";
const MUTE_EVENT = "wii:mute";

let ctx: AudioContext | null = null;
let muted: boolean | null = null;

export function isMuted() {
  if (muted === null) {
    try {
      muted = localStorage.getItem(MUTE_KEY) === "1";
    } catch {
      muted = false;
    }
  }
  return muted;
}

export function setMuted(next: boolean) {
  muted = next;
  try {
    localStorage.setItem(MUTE_KEY, next ? "1" : "0");
  } catch {
    // storage blocked: the setting just lasts for this visit
  }
  window.dispatchEvent(new Event(MUTE_EVENT));
}

export function onMuteChange(handler: () => void) {
  window.addEventListener(MUTE_EVENT, handler);
  return () => window.removeEventListener(MUTE_EVENT, handler);
}

// browsers only allow audio to start from a click, tap or key press
export function unlockAudio() {
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
}

type Tone = { freq: number; to?: number; dur: number; type: OscillatorType; gain: number; delay?: number };

function tone(c: AudioContext, { freq, to, dur, type, gain, delay = 0 }: Tone) {
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const env = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  env.gain.setValueAtTime(0.0001, t0);
  env.gain.exponentialRampToValueAtTime(gain, t0 + 0.008);
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(env).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

const SOUNDS: Record<Sfx, (c: AudioContext) => void> = {
  hover: (c) => tone(c, { freq: 1900, dur: 0.035, type: "sine", gain: 0.03 }),
  select: (c) => {
    tone(c, { freq: 880, dur: 0.09, type: "triangle", gain: 0.07 });
    tone(c, { freq: 1320, dur: 0.12, type: "triangle", gain: 0.05, delay: 0.05 });
  },
  start: (c) =>
    [660, 880, 1320].forEach((freq, i) => tone(c, { freq, dur: 0.14, type: "triangle", gain: 0.06, delay: i * 0.06 })),
  back: (c) => tone(c, { freq: 720, to: 420, dur: 0.12, type: "triangle", gain: 0.06 }),
  page: (c) => tone(c, { freq: 520, to: 940, dur: 0.1, type: "sine", gain: 0.05 }),
};

export function play(sfx: Sfx) {
  if (!ctx || ctx.state !== "running" || isMuted()) return;
  SOUNDS[sfx](ctx);
}
