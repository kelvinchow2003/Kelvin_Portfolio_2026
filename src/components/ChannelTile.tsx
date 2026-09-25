import ChannelIcon from "./ChannelIcon";
import ChannelScene from "./ChannelScene";
import type { Channel } from "@/lib/channels";
import { u } from "@/lib/units";

type Props = {
  channel: Channel | null;
  style: React.CSSProperties;
  interactive: boolean;
  onActivate?: (rect: DOMRect) => void;
};

const RADIUS = u(12);

export default function ChannelTile({ channel, style, interactive, onActivate }: Props) {
  if (!channel) {
    return (
      <div
        className="wii-tile absolute flex items-center justify-center"
        style={{ ...style, borderRadius: RADIUS }}
      >
        <span className="wii-watermark leading-none" style={{ fontSize: u(19) }}>
          Wii
        </span>
      </div>
    );
  }

  if (channel.scene || channel.cover) {
    return (
      <button
        type="button"
        aria-label={channel.title}
        data-channel-id={channel.id}
        tabIndex={interactive ? 0 : -1}
        aria-hidden={!interactive}
        onClick={(e) => onActivate?.(e.currentTarget.getBoundingClientRect())}
        className="wii-tile wii-tile--cover group absolute outline-none"
        style={{ ...style, borderRadius: RADIUS }}
      >
        {/* the art is clipped to the tile's corners; the selection ring sits
            outside this layer so it can glow past the edge like on the others */}
        <span className="absolute inset-0 overflow-hidden" style={{ borderRadius: "inherit" }}>
          {channel.scene ? (
            <ChannelScene kind={channel.scene} variant="tile" className="absolute inset-0 h-full w-full" />
          ) : (
            <img
              src={channel.cover}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
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
      type="button"
      aria-label={channel.title}
        data-channel-id={channel.id}
      tabIndex={interactive ? 0 : -1}
      aria-hidden={!interactive}
      onClick={(e) => onActivate?.(e.currentTarget.getBoundingClientRect())}
      className="wii-tile wii-tile--filled group absolute flex flex-col items-center justify-center outline-none"
      style={{ ...style, borderRadius: RADIUS, gap: u(4), padding: u(6) }}
    >
      <span className="block" style={{ height: "46%", aspectRatio: "1 / 1" }}>
        <ChannelIcon kind={channel.iconKind} accent={channel.accent} />
      </span>
      <span
        className="font-rodin wii-embossed block max-w-full truncate font-bold leading-none text-[#6b6c71]"
        style={{ fontSize: u(9) }}
      >
        {channel.title}
      </span>
      <span className="wii-tile-select" />
    </button>
  );
}
