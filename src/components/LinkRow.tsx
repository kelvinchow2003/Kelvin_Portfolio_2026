import type { ChannelLink } from "@/lib/channels";
import { hasLink } from "@/lib/site";

export default function LinkRow({ links, className = "mt-6" }: { links: ChannelLink[]; className?: string }) {
  const shown = links.filter((link) => !link.optional || hasLink(link.href));
  if (!shown.length) return null;
  return (
    <div className={`${className} flex flex-wrap gap-3`}>
      {shown.map((link) =>
        hasLink(link.href) ? (
          <a
            key={link.label}
            href={link.href}
            target={link.external || link.href.startsWith("http") ? "_blank" : undefined}
            rel={link.external || link.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="wii-panel-chip rounded-full px-5 py-2.5 text-sm font-bold text-[#3a3a3f] transition-transform hover:scale-105"
          >
            {link.label}
          </a>
        ) : (
          // not provided yet (see lib/site.ts): shown, but not a dead link
          <span
            key={link.label}
            aria-disabled="true"
            className="wii-panel-chip cursor-default rounded-full px-5 py-2.5 text-sm font-bold text-[#8c8c94]"
          >
            {link.label} · coming soon
          </span>
        )
      )}
    </div>
  );
}
