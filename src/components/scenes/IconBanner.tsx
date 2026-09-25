import ChannelIcon from "../ChannelIcon";
import type { Channel } from "@/lib/channels";

// Default splash banner for channels without a hand-drawn scene: a Mii
// Channel-style crowd of the channel's icon drifting past in three depth
// rows, with a big glossy badge of the icon bobbing in front.

const ROWS = [
  { size: 7, top: 8, dur: 38, dir: "left", depth: "far" },
  { size: 10, top: 30, dur: 30, dir: "right", depth: "mid" },
  { size: 14, top: 58, dur: 24, dir: "left", depth: "near" },
] as const;

// enough tokens that one strip is wider than a 21:9 screen even in the far row
const PER_STRIP = 24;

export default function IconBanner({ channel, className }: { channel: Channel; className?: string }) {
  return (
    <div
      className={`icon-banner ${className ?? ""}`}
      style={{ "--accent": channel.accent } as React.CSSProperties}
      aria-hidden="true"
    >
      {ROWS.map((row, r) => (
        <div
          key={r}
          className={`icon-banner-row icon-banner-row--${row.depth}`}
          style={{ top: `${row.top}%`, height: `${row.size * 1.6}vmin` }}
        >
          {/* two identical strips side by side so the marquee loops seamlessly */}
          <div
            className="icon-banner-track"
            style={{
              animationDuration: `${row.dur}s`,
              animationDirection: row.dir === "left" ? "normal" : "reverse",
            }}
          >
            {[0, 1].map((strip) =>
              Array.from({ length: PER_STRIP }, (_, i) => (
                <span
                  key={`${strip}-${i}`}
                  className="icon-banner-token"
                  style={{
                    width: `${row.size}vmin`,
                    height: `${row.size}vmin`,
                    marginInline: `${row.size * 0.3}vmin`,
                    // a little jitter so the crowd doesn't read as a grid
                    transform: `translateY(${((i * 37 + r * 11) % 7) - 3}px) rotate(${((i * 53 + r * 17) % 13) - 6}deg)`,
                  }}
                >
                  <ChannelIcon kind={channel.iconKind} accent={channel.accent} />
                </span>
              ))
            )}
          </div>
        </div>
      ))}

      <div className="icon-banner-hero">
        <ChannelIcon kind={channel.iconKind} accent={channel.accent} />
      </div>
    </div>
  );
}
