"use client";

import { useEffect, useId, useRef } from "react";
import Image from "next/image";
import ChannelIcon from "./ChannelIcon";
import MessageBoard from "./MessageBoard";
import QuickTour from "./QuickTour";
import LinkRow from "./LinkRow";
import type { Channel } from "@/lib/channels";
import { markMailRead } from "@/lib/menu";
import { useFocusTrap } from "@/lib/useFocusTrap";

type Props = {
  channel: Channel;
  onClose: () => void;
};

function BackButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      onClick={onClose}
      data-sfx="back"
      className="wii-panel-back absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-[#5a5a5f] outline-none sm:left-8 sm:top-8"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
        <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Wii Menu
    </button>
  );
}

function StackChips({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tech used">
      {items.map((item) => (
        <li key={item} className="wii-stack-chip rounded-full px-3 py-1 text-xs font-bold text-[#3f6f86]">
          {item}
        </li>
      ))}
    </ul>
  );
}

// the "1 new message" the Mail button promises
function WelcomeNote() {
  return (
    <div className="wii-note mt-6 rounded-2xl p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-[#8a6a22]">From Kelvin · pinned</p>
      <p className="mt-1.5 text-[15px] leading-relaxed text-[#4a4a50]">
        Thanks for stopping by my Wii! Poke around the channels, and if something catches your eye, leave me a
        message below. It comes straight to my inbox.
      </p>
    </div>
  );
}

export default function ChannelPanel({ channel, onClose }: Props) {
  const content = channel.content;
  const dialogRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useFocusTrap(dialogRef);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // move focus into the dialog so keyboard and screen reader users land on it
  useEffect(() => {
    cardRef.current?.focus({ preventScroll: true });
  }, [channel.id]);

  useEffect(() => {
    if (content?.messageBoard) markMailRead();
  }, [content]);

  if (!content) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="wii-panel-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 pt-16 sm:p-10 sm:pt-20"
      // clicking the backdrop around the card also goes back
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <BackButton onClose={onClose} />

      <div
        ref={cardRef}
        tabIndex={-1}
        className="wii-panel max-h-full w-full max-w-2xl overflow-y-auto rounded-[28px] p-6 outline-none sm:p-10"
      >
        <div className="flex items-start gap-4 sm:gap-6">
          <div className="wii-panel-icon flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl p-2.5 sm:h-16 sm:w-16">
            <ChannelIcon kind={channel.iconKind} accent={channel.accent} />
          </div>
          <div>
            {content.eyebrow && (
              <p className="text-xs font-bold uppercase tracking-wide text-[#6b6b72]">{content.eyebrow}</p>
            )}
            <h2 id={titleId} className="font-rodin mt-1 text-2xl font-bold text-[#3a3a3f] sm:text-3xl">
              {channel.title}
            </h2>
          </div>
        </div>

        <p className="mt-6 text-[15px] leading-relaxed text-[#4a4a50] sm:text-base">{content.summary}</p>

        {content.image && (
          <Image
            src={content.image.src}
            alt={content.image.alt}
            width={1280}
            height={720}
            sizes="(max-width: 700px) 100vw, 640px"
            className="wii-panel-chip mt-6 h-auto w-full rounded-2xl"
          />
        )}

        {content.stack && <StackChips items={content.stack} />}

        {content.bullets && (
          <ul className="mt-5 space-y-3">
            {content.bullets.map((b, i) => (
              <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-[#4a4a50]">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#5fcbe8]" aria-hidden="true" />
                {b}
              </li>
            ))}
          </ul>
        )}

        {content.forecast && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {content.forecast.map((group) => (
              <div key={group.label} className="wii-panel-chip rounded-2xl p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-[#6b6b72]">{group.label}</p>
                <p className="mt-2 text-sm leading-relaxed text-[#3a3a3f]">{group.items.join(" · ")}</p>
              </div>
            ))}
          </div>
        )}

        {content.style === "tour" && <QuickTour />}

        {content.messageBoard && <WelcomeNote />}

        {content.links && <LinkRow links={content.links} />}

        {content.messageBoard && <MessageBoard />}
      </div>
    </div>
  );
}
