"use client";

import { useEffect, useState } from "react";
import ChannelTile from "./ChannelTile";
import ChannelPanel from "./ChannelPanel";
import ChannelSplash from "./ChannelSplash";
import DiscIntro from "./DiscIntro";
import { channels, TOTAL_PAGES, type Channel } from "@/lib/channels";
import { sx, sy, u } from "@/lib/units";
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

// channels that open onto a splash, in menu order, for the splash's ◀ ▶ arrows
const SPLASH_ORDER = channels
  .filter((c) => c.action.type === "panel" || c.action.type === "external")
  .sort((a, b) => a.page - b.page || a.row - b.row || a.col - b.col);

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

const tileRect = (id: string) =>
  document.querySelector<HTMLElement>(`[data-channel-id="${id}"]`)?.getBoundingClientRect() ?? null;

function PageArrow({ dir, onClick }: { dir: "left" | "right"; onClick: () => void }) {
  const left = dir === "right" ? 472 : 515 - 472 - ARROW_W;
  return (
    <button
      type="button"
      aria-label={dir === "right" ? "Next page" : "Previous page"}
      onClick={onClick}
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

export default function WiiGrid() {
  const [page, setPage] = useState(1);
  const [openChannel, setOpenChannel] = useState<Channel | null>(null);
  const [splash, setSplash] = useState<{ channel: Channel; origin: DOMRect | null } | null>(null);
  const [discPlaying, setDiscPlaying] = useState(false);

  function goTo(next: number) {
    if (next < 1 || next > TOTAL_PAGES) return;
    setPage(next);
  }

  function handleActivate(channel: Channel, origin?: DOMRect) {
    if (!channel.fixed && channel.page !== page) {
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

  // commands from the bottom bar's Wii / Mail / SD buttons
  useEffect(
    () =>
      onMenu((cmd) => {
        setSplash(null);
        setDiscPlaying(false);
        if (cmd.type === "home") {
          setOpenChannel(null);
          setPage(1);
          return;
        }
        const channel = channels.find((c) => c.id === cmd.id);
        if (channel?.content) setOpenChannel(channel);
      }),
    []
  );

  function browse(step: 1 | -1) {
    if (!splash) return;
    const i = SPLASH_ORDER.findIndex((c) => c.id === splash.channel.id);
    const next = SPLASH_ORDER[(i + step + SPLASH_ORDER.length) % SPLASH_ORDER.length];
    // slide the grid behind the splash so closing zooms into the right tile
    if (!next.fixed) setPage(next.page);
    setSplash({ channel: next, origin: null });
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (openChannel || splash || discPlaying) return;
      if (e.key === "ArrowRight") goTo(page + 1);
      if (e.key === "ArrowLeft") goTo(page - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const pages = Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1);
  const discChannel = channels.find((c) => c.fixed)!;

  return (
    <div className="absolute inset-x-0 top-0 overflow-hidden" style={{ height: sy(281) }}>
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
            const channel =
              channels.find((c) => c.page === p && c.row === row && c.col === col) ?? null;
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

      {page > 1 && <PageArrow dir="left" onClick={() => goTo(page - 1)} />}
      {page < TOTAL_PAGES && <PageArrow dir="right" onClick={() => goTo(page + 1)} />}

      {splash &&
        (() => {
          const start = startFor(splash.channel);
          return (
            <ChannelSplash
              key={splash.channel.id}
              channel={splash.channel}
              origin={splash.origin}
              closeTo={() => tileRect(splash.channel.id)}
              // only clear the splash that finished closing, never one opened since
              onMenu={() => setSplash((cur) => (cur?.channel === splash.channel ? null : cur))}
              onPrev={() => browse(-1)}
              onNext={() => browse(1)}
              startLabel={start.label}
              startDisabled={start.kind === "none"}
              onStart={() => {
                if (start.kind === "link") {
                  window.open(start.href, "_blank", "noopener,noreferrer");
                  setSplash(null);
                  return;
                }
                // the panel mounts on top and fades in, then the splash underneath goes away
                setOpenChannel(splash.channel);
                setTimeout(() => setSplash(null), 300);
              }}
            />
          );
        })()}
      {openChannel && <ChannelPanel channel={openChannel} onClose={() => setOpenChannel(null)} />}
      {discPlaying && <DiscIntro onClose={() => setDiscPlaying(false)} />}
    </div>
  );
}
