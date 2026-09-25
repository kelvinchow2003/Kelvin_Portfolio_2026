import Image from "next/image";
import ChannelIcon from "./ChannelIcon";
import ChannelScene from "./ChannelScene";
import type { Channel } from "@/lib/channels";
import { u } from "@/lib/units";

type Props = {
  channel: Channel | null;
  style: React.CSSProperties;
  interactive: boolean;
  onActivate?: (rect: DOMRect) => void;
  // "grid" tiles are positioned absolutely on the Wii Menu; "flow" tiles sit
  // in the phone layout's normal document flow and use fixed text sizes
  layout?: "grid" | "flow";
};

export default function ChannelTile({ channel, style, interactive, onActivate, layout = "grid" }: Props) {
  const flow = layout === "flow";
  const position = flow ? "relative" : "absolute";
  const radius = flow ? "14px" : u(12);

  if (!channel) {
    return (
      <div
        className={`wii-tile ${position} flex items-center justify-center`}
        style={{ ...style, borderRadius: radius }}
        aria-hidden="true"
      >
        <span className="wii-watermark leading-none" style={{ fontSize: flow ? "26px" : u(19) }}>
          Wii
        </span>
      </div>
    );
  }

  const common = {
    type: "button" as const,
    "aria-label": channel.title,
    "data-channel-id": channel.id,
    tabIndex: interactive ? 0 : -1,
    "aria-hidden": !interactive,
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => onActivate?.(e.currentTarget.getBoundingClientRect()),
  };

  if (channel.scene || channel.cover) {
    return (
      <button
        {...common}
        className={`wii-tile wii-tile--cover group ${position} outline-none`}
        style={{ ...style, borderRadius: radius }}
      >
        {/* the art is clipped to the tile's corners; the selection ring sits
            outside this layer so it can glow past the edge like on the others */}
        <span className="absolute inset-0 overflow-hidden" style={{ borderRadius: "inherit" }}>
          {channel.scene ? (
            <ChannelScene kind={channel.scene} variant="tile" className="absolute inset-0 h-full w-full" />
          ) : (
            <Image
              src={channel.cover!}
              alt=""
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover"
              draggable={false}
            />
          )}
          <span className="wii-tile-sheen" />
        </span>
        <span className="wii-tile-select" />
      </button>
    );
  }

  return (
    <button
      {...common}
      className={`wii-tile wii-tile--filled group ${position} flex flex-col items-center justify-center outline-none`}
      style={{ ...style, borderRadius: radius, gap: flow ? "8px" : u(4), padding: flow ? "10px" : u(6) }}
    >
      <span className="block" style={{ height: "46%", aspectRatio: "1 / 1" }}>
        <ChannelIcon kind={channel.iconKind} accent={channel.accent} />
      </span>
      <span
        className="font-rodin wii-embossed block max-w-full truncate font-bold leading-none text-[#5f6065]"
        // never smaller than 10px, even on a squat landscape phone
        style={{ fontSize: flow ? "13px" : `max(10px, ${u(9)})` }}
      >
        {channel.title}
      </span>
      <span className="wii-tile-select" />
    </button>
  );
}
