"use client";

import ChannelIcon from "./ChannelIcon";
import LinkRow from "./LinkRow";
import { channels, type Channel } from "@/lib/channels";
import { sendMenu } from "@/lib/menu";
import { EDUCATION, EMAIL, LINKS, LOOKING_FOR, NAME, ROLE } from "@/lib/site";

// The Disc Channel's content: the whole portfolio on one screen, for anyone
// who'd rather not browse channel by channel. Everything is pulled from
// lib/channels.ts and lib/site.ts, so it stays in sync with the menu.

const EXPERIENCE = ["shelley", "tpa", "greenspiegel", "bothwell"];
const FEATURED = ["ats", "lifesaving", "ironcad"];

const byId = (id: string) => channels.find((c) => c.id === id) as Channel;

function Heading({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-8 text-xs font-bold uppercase tracking-wide text-[#6b6b72]">{children}</h3>;
}

function ChannelRow({ channel }: { channel: Channel }) {
  return (
    <li>
      <button
        type="button"
        onClick={() => sendMenu({ type: "open", id: channel.id })}
        className="wii-panel-chip flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-transform hover:scale-[1.01]"
      >
        <span className="h-10 w-10 shrink-0" aria-hidden="true">
          <ChannelIcon kind={channel.iconKind} accent={channel.accent} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-bold text-[#3a3a3f]">{channel.title}</span>
          <span className="block text-sm text-[#5a5a60]">{channel.content?.eyebrow}</span>
        </span>
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-[#8c8c94]" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
          <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </li>
  );
}

export default function QuickTour() {
  const languages = byId("skills").content?.forecast?.[0]?.items ?? [];

  return (
    <div>
      <div className="wii-note mt-6 rounded-2xl p-5">
        <p className="font-wii text-2xl font-black text-[#3a3a3f]">{NAME}</p>
        <p className="mt-1 text-[15px] text-[#4a4a50]">{ROLE}</p>
        {LOOKING_FOR && <p className="mt-2 text-[15px] font-bold text-[#8a6a22]">{LOOKING_FOR}</p>}
      </div>

      <Heading>Experience</Heading>
      <ul className="mt-3 space-y-2">
        {EXPERIENCE.map((id) => (
          <ChannelRow key={id} channel={byId(id)} />
        ))}
      </ul>

      <Heading>Featured projects</Heading>
      <ul className="mt-3 space-y-2">
        {FEATURED.map((id) => (
          <ChannelRow key={id} channel={byId(id)} />
        ))}
      </ul>
      <button type="button" onClick={() => sendMenu({ type: "page", page: 3 })} className="wii-pill-sm mt-3">
        See all projects
      </button>

      <Heading>Education</Heading>
      <p className="mt-2 text-[15px] leading-relaxed text-[#4a4a50]">
        {EDUCATION.degree}, {EDUCATION.school} · {EDUCATION.honours}
        {EDUCATION.graduation && ` · ${EDUCATION.graduation}`}
      </p>

      <Heading>Languages</Heading>
      <p className="mt-2 text-[15px] leading-relaxed text-[#4a4a50]">{languages.join(" · ")}</p>

      <LinkRow
        className="mt-8"
        links={[
          { label: "Download Resume (PDF)", href: LINKS.resume },
          { label: "Email me", href: `mailto:${EMAIL}` },
          { label: "LinkedIn", href: LINKS.linkedin, external: true },
          { label: "GitHub", href: LINKS.github, external: true },
        ]}
      />

      <p className="mt-8 text-xs leading-relaxed text-[#6b6b72]">
        This site is a fan-made tribute to the Wii Menu. It is not affiliated with or endorsed by Nintendo.
      </p>
    </div>
  );
}
