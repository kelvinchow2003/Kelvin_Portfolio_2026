"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ChannelTile from "./ChannelTile";
import ChannelPanel from "./ChannelPanel";
import ChannelSplash from "./ChannelSplash";
import DiscIntro from "./DiscIntro";
import { channels, TOTAL_PAGES, type Channel } from "@/lib/channels";
import { isPortraitLayout, sx, sy, u } from "@/lib/units";
import { onMenu } from "@/lib/menu";
import { hasLink } from "@/lib/site";

const COLS = 4;
const ROWS = 3;

// Measured from the Wii Menu in the 515×388 reference frame.
const TILE_W = 101;
const TILE_H = 76;
const PITCH_X = 108;
const PITCH_Y = 82;
const GRID_LEFT = 46;
const GRID_TOP = 32;
const PAGE_W = COLS * PITCH_X;
const ARROW_W = 20;
const ARROW_H = 36;
const ARROW_CY = GRID_TOP + PITCH_Y + TILE_H / 2;

// section names for the phone layout, which shows every page stacked
const PAGE_TITLES: Record<number, string> = { 1: "Wii Menu", 2: "Work History", 3: "Projects" };

const inMenuOrder = (a: Channel, b: Channel) => a.page - b.page || a.row - b.row || a.col - b.col;

// channels that open onto a splash, in menu order, for the splash's ◀ ▶ arrows
const SPLASH_ORDER = channels
  .filter((c) => c.action.type === "panel" || c.action.type === "external")
  .sort(inMenuOrder);

// what Start does on a channel's splash, and what it says
function startFor(channel: Channel) {
  const { action } = channel;
  if (action.type === "external") {
    if (hasLink(action.href)) return { label: "Start", kind: "link" as const, href: action.href };
    if (channel.content) return { label: "Start", kind: "panel" as const };
    return { label: "Coming Soon", kind: "none" as const };
  }
  return { label: "Start", kind: "panel" as const };
}

// the on-screen tile for a channel (the desktop grid and the phone layout
// both render one, but only one of them is ever visible)
const tileEl = (id: string) =>
  [...document.querySelectorAll<HTMLElement>(`[data-channel-id="${id}"]`)].find(
    (el) => el.getClientRects().length > 0 && el.tabIndex >= 0
  ) ?? null;

const tileRect = (id: string) => tileEl(id)?.getBoundingClientRect() ?? null;

const channelFromUrl = () => {
  const id = new URLSearchParams(window.location.search).get("channel");
  return channels.find((c) => c.id === id && c.content) ?? null;
};

function PageArrow({ dir, onClick }: { dir: "left" | "right"; onClick: () => void }) {
  const left = dir === "right" ? 472 : 515 - 472 - ARROW_W;
  return (
    <button
      type="button"
      aria-label={dir === "right" ? "Next page" : "Previous page"}
      onClick={onClick}
      data-sfx="page"
      className="wii-arrow absolute z-20 outline-none"
      style={{
        left: sx(left),
        top: `calc(${sy(ARROW_CY)} - ${u(ARROW_H / 2)})`,
        width: u(ARROW_W),
        height: u(ARROW_H),
      }}
    >
      <svg
        viewBox="0 0 20 36"
        className="h-full w-full overflow-visible"
        style={dir === "left" ? { transform: "scaleX(-1)" } : undefined}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`arrow-${dir}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8fe3fb" />
            <stop offset="45%" stopColor="#b9f5ff" />
            <stop offset="100%" stopColor="#8adbf6" />
          </linearGradient>
        </defs>
        <path
          d="M2,1.5 Q6,18 2,34.5 L19,18 Z"
          fill={`url(#arrow-${dir})`}
          stroke="#2f7ea6"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

function PageDots({ page, onPick }: { page: number; onPick: (p: number) => void }) {
  return (
    <div
      className="absolute left-1/2 z-20 flex -translate-x-1/2 items-center"
      style={{ top: sy(13), gap: u(7) }}
      role="group"
      aria-label="Menu pages"
    >
      {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          type="button"
          aria-label={`Page ${p}${PAGE_TITLES[p] ? `: ${PAGE_TITLES[p]}` : ""}`}
          aria-current={p === page ? "page" : undefined}
          onClick={() => onPick(p)}
          data-sfx="page"
          className={`wii-dot rounded-full ${p === page ? "wii-dot--on" : ""}`}
          style={{ width: u(6), height: u(6) }}
        />
      ))}
    </div>
  );
}

type Dir = "ArrowLeft" | "ArrowRight" | "ArrowUp" | "ArrowDown";

// the channels you can point at on a page (the Disc Channel is on all of them)
const pointable = (p: number) => channels.filter((c) => c.fixed || c.page === p);

// D-pad style: the nearest channel in that direction on the same page, or
// (left/right off the edge) the nearest one on the neighbouring page
function neighbour(from: Channel, dir: Dir, page: number): { channel: Channel; page: number } | null {
  const horizontal = dir === "ArrowLeft" || dir === "ArrowRight";
  let best: Channel | null = null;
  let bestScore = Infinity;
  for (const c of pointable(page)) {
    if (c.id === from.id) continue;
    const dr = c.row - from.row;
    const dc = c.col - from.col;
    const ahead =
      dir === "ArrowRight" ? dc > 0 && dr === 0 : dir === "ArrowLeft" ? dc < 0 && dr === 0 : dir === "ArrowDown" ? dr > 0 : dr < 0;
    if (!ahead) continue;
    const score = horizontal ? Math.abs(dc) : Math.abs(dr) * 10 + Math.abs(dc);
    if (score < bestScore) {
      best = c;
      bestScore = score;
    }
  }
  if (best) return { channel: best, page };
  if (!horizontal) return null;

  const next = page + (dir === "ArrowRight" ? 1 : -1);
  if (next < 1 || next > TOTAL_PAGES) return null;
  const candidates = channels
    .filter((c) => c.page === next && !c.fixed)
    .sort((a, b) => Math.abs(a.row - from.row) - Math.abs(b.row - from.row) || (dir === "ArrowRight" ? a.col - b.col : b.col - a.col));
  return candidates[0] ? { channel: candidates[0], page: next } : null;
}

export default function WiiGrid() {
  const [page, setPage] = useState(1);
  const [openChannel, setOpenChannel] = useState<Channel | null>(null);
  const [splash, setSplash] = useState<{ channel: Channel; origin: DOMRect | null } | null>(null);
  const [discPlaying, setDiscPlaying] = useState(false);
  const swipe = useRef<{ x: number; y: number } | null>(null);

  const goTo = useCallback((next: number) => {
    if (next < 1 || next > TOTAL_PAGES) return;
    setPage(next);
    // on the phone layout "pages" are sections of one long scroll
    if (isPortraitLayout()) {
      document.getElementById(`menu-page-${next}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // hand focus back to the tile a channel was opened from
  const refocus = (id: string) => requestAnimationFrame(() => tileEl(id)?.focus({ preventScroll: true }));

  /* ---------- channel panel + URL (?channel=id) ---------- */

  const openPanel = useCallback((channel: Channel) => {
    setOpenChannel(channel);
    // a shareable URL per channel; Back closes the panel again
    window.history.pushState({ wiiChannel: channel.id }, "", `?channel=${channel.id}`);
  }, []);

  const clearUrl = () => window.history.replaceState(null, "", window.location.pathname);

  function closePanel() {
    const closing = openChannel;
    if (window.history.state?.wiiChannel) {
      window.history.back(); // popstate below does the closing
    } else {
      setOpenChannel(null);
      clearUrl();
    }
    if (closing) refocus(closing.id);
  }

  // deep links on load, and Back / Forward afterwards
  useEffect(() => {
    const sync = () => {
      setSplash(null);
      setDiscPlaying(false);
      setOpenChannel(channelFromUrl());
    };
    const first = setTimeout(() => {
      const linked = channelFromUrl();
      if (linked) setOpenChannel(linked);
    }, 0);
    window.addEventListener("popstate", sync);
    return () => {
      clearTimeout(first);
      window.removeEventListener("popstate", sync);
    };
  }, []);

  /* ---------- activating tiles ---------- */

  function handleActivate(channel: Channel, origin?: DOMRect, allPagesVisible = false) {
    if (!allPagesVisible && !channel.fixed && channel.page !== page) {
      goTo(channel.page);
      return;
    }
    switch (channel.action.type) {
      // content and link channels open onto their splash screen first
      case "panel":
      case "external":
        setSplash({ channel, origin: origin ?? null });
        break;
      case "page":
        goTo(channel.action.target);
        break;
      case "disc":
        setDiscPlaying(true);
        break;
      case "none":
        break;
    }
  }

  // commands from the bottom bar's buttons and from inside panels
  useEffect(
    () =>
      onMenu((cmd) => {
        setSplash(null);
        setDiscPlaying(false);
        if (cmd.type === "open") {
          const channel = channels.find((c) => c.id === cmd.id);
          if (channel?.content) openPanel(channel);
          return;
        }
        setOpenChannel(null);
        clearUrl();
        goTo(cmd.type === "home" ? 1 : cmd.page);
      }),
    [goTo, openPanel]
  );

  function browse(step: 1 | -1) {
    if (!splash) return;
    const i = SPLASH_ORDER.findIndex((c) => c.id === splash.channel.id);
    const next = SPLASH_ORDER[(i + step + SPLASH_ORDER.length) % SPLASH_ORDER.length];
    // slide the grid behind the splash so closing zooms into the right tile
    if (!next.fixed) setPage(next.page);
    setSplash({ channel: next, origin: null });
  }

  /* ---------- keyboard: page with ◀ ▶, or steer between tiles like a D-pad ---------- */

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (openChannel || splash || discPlaying || isPortraitLayout()) return;
      // the intro screen is still up
      if (document.querySelector(".wii-boot")?.getClientRects().length) return;
      const dir = e.key as Dir;
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(dir)) return;

      const focusedId = (document.activeElement as HTMLElement | null)?.closest("[data-channel-id]")?.getAttribute("data-channel-id");
      const from = channels.find((c) => c.id === focusedId);
      if (!from) {
        if (dir === "ArrowRight") goTo(page + 1);
        else if (dir === "ArrowLeft") goTo(page - 1);
        else {
          // nothing pointed at yet: up/down picks up the first channel
          e.preventDefault();
          tileEl(pointable(page).sort(inMenuOrder)[0].id)?.focus({ preventScroll: true });
        }
        return;
      }

      e.preventDefault();
      const to = neighbour(from, dir, page);
      if (!to) return;
      if (to.page !== page) setPage(to.page);
      requestAnimationFrame(() => tileEl(to.channel.id)?.focus({ preventScroll: true }));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  /* ---------- touch: swipe between pages ---------- */

  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    swipe.current = { x: t.clientX, y: t.clientY };
  }

  function onTouchEnd(e: React.TouchEvent) {
    const start = swipe.current;
    swipe.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    goTo(page + (dx < 0 ? 1 : -1));
  }

  const pages = Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1);
  const discChannel = channels.find((c) => c.fixed)!;

  return (
    <>
      {/* ---------- the Wii Menu grid (landscape and square screens) ---------- */}
      <div
        className="wii-desktop-grid absolute inset-x-0 top-0 overflow-hidden"
        style={{ height: sy(281) }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* every page sits side by side, so neighbouring columns peek in at the edges */}
        <div
          className="absolute left-0 top-0 h-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          style={{ transform: `translateX(${sx(-(page - 1) * PAGE_W)})` }}
        >
          {pages.map((p) =>
            Array.from({ length: COLS * ROWS }, (_, i) => {
              const row = Math.floor(i / COLS);
              const col = i % COLS;
              // the fixed Disc Channel is rendered separately below, pinned to
              // the screen — every page's own (0,0) slot stays empty for it
              if (row === 0 && col === 0) return null;
              const channel = channels.find((c) => c.page === p && c.row === row && c.col === col) ?? null;
              return (
                <ChannelTile
                  key={`${p}-${i}`}
                  channel={channel}
                  interactive={p === page}
                  onActivate={channel ? (rect) => handleActivate(channel, rect) : undefined}
                  style={{
                    left: sx(GRID_LEFT + (p - 1) * PAGE_W + col * PITCH_X),
                    top: sy(GRID_TOP + row * PITCH_Y),
                    width: sx(TILE_W),
                    height: sy(TILE_H),
                  }}
                />
              );
            })
          )}
        </div>

        {/* fixed top-left slot — never slides, never moves, just like the real console */}
        <ChannelTile
          channel={discChannel}
          interactive
          onActivate={(rect) => handleActivate(discChannel, rect)}
          style={{
            left: sx(GRID_LEFT),
            top: sy(GRID_TOP),
            width: sx(TILE_W),
            height: sy(TILE_H),
          }}
        />

        <PageDots page={page} onPick={goTo} />
        {page > 1 && <PageArrow dir="left" onClick={() => goTo(page - 1)} />}
        {page < TOTAL_PAGES && <PageArrow dir="right" onClick={() => goTo(page + 1)} />}
      </div>

      {/* ---------- phone / portrait layout: every page stacked in one scroll ---------- */}
      <div className="wii-portrait-menu absolute inset-x-0 top-0 overflow-y-auto overscroll-contain">
        <div className="mx-auto max-w-3xl px-4 pb-8 pt-5">
          {pages.map((p) => (
            <section key={p} id={`menu-page-${p}`} aria-labelledby={`menu-page-${p}-title`} className="scroll-mt-4 pb-4">
              <h2 id={`menu-page-${p}-title`} className="wii-section-title font-rodin mb-3 mt-2 px-1 font-bold">
                {PAGE_TITLES[p] ?? `Page ${p}`}
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {channels
                  .filter((c) => c.page === p)
                  .sort(inMenuOrder)
                  .map((channel) => (
                    <ChannelTile
                      key={channel.id}
                      layout="flow"
                      channel={channel}
                      interactive
                      onActivate={(rect) => handleActivate(channel, rect, true)}
                      style={{ aspectRatio: "4 / 3" }}
                    />
                  ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* ---------- overlays ---------- */}
      {splash &&
        (() => {
          const start = startFor(splash.channel);
          return (
            <ChannelSplash
              key={`splash-${splash.channel.id}`}
              channel={splash.channel}
              origin={splash.origin}
              closeTo={() => tileRect(splash.channel.id)}
              // only clear the splash that finished closing, never one opened since
              onMenu={() => {
                setSplash((cur) => (cur?.channel === splash.channel ? null : cur));
                refocus(splash.channel.id);
              }}
              onPrev={() => browse(-1)}
              onNext={() => browse(1)}
              startLabel={start.label}
              startDisabled={start.kind === "none"}
              onStart={() => {
                if (start.kind === "link") {
                  window.open(start.href, "_blank", "noopener,noreferrer");
                  setSplash(null);
                  refocus(splash.channel.id);
                  return;
                }
                // the panel mounts on top and fades in, then the splash underneath goes away
                openPanel(splash.channel);
                setTimeout(() => setSplash(null), 300);
              }}
            />
          );
        })()}
      {openChannel && <ChannelPanel key={`panel-${openChannel.id}`} channel={openChannel} onClose={closePanel} />}
      {discPlaying && (
        <DiscIntro
          onDone={() => {
            setDiscPlaying(false);
            openPanel(discChannel);
          }}
        />
      )}
    </>
  );
}
