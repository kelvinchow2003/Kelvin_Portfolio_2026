import type { Metadata } from "next";
import { cookies } from "next/headers";
import WiiGrid from "@/components/WiiGrid";
import BottomBar from "@/components/BottomBar";
import BootScreen from "@/components/BootScreen";
import SoundFx from "@/components/SoundFx";
import { channels } from "@/lib/channels";
import { BOOT_COOKIE } from "@/lib/menu";
import { EDUCATION, EMAIL, LINKS, NAME, ROLE, SITE_URL, hasLink } from "@/lib/site";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

// a shared ?channel= link previews as that channel, not just the home page
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { channel: id } = await searchParams;
  const channel = channels.find((c) => c.id === id && c.content);
  if (!channel?.content) return {};
  const title = { absolute: `${channel.title} · ${NAME}` };
  const description = channel.content.summary;
  return {
    title,
    description,
    alternates: { canonical: `/?channel=${channel.id}` },
    openGraph: { title, description, url: `/?channel=${channel.id}` },
    twitter: { title, description },
  };
}

// structured data so search engines know who the site is about
const PERSON = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: NAME,
  description: ROLE,
  email: `mailto:${EMAIL}`,
  url: SITE_URL || undefined,
  jobTitle: "Application Engineer",
  worksFor: { "@type": "Organization", name: "Shelley Automation" },
  alumniOf: { "@type": "CollegeOrUniversity", name: EDUCATION.school },
  sameAs: [LINKS.github, LINKS.linkedin, LINKS.personalSite].filter(hasLink),
};

export default async function Home({ searchParams }: Props) {
  // the intro screen shows once per browser session, and never in front of a shared channel link
  const [params, cookieStore] = await Promise.all([searchParams, cookies()]);
  const showIntro = !params.channel && !cookieStore.has(BOOT_COOKIE);

  return (
    <div className="wii-screen relative h-dvh w-screen overflow-hidden select-none">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON) }} />
      <h1 className="sr-only">
        {NAME}: {ROLE}
      </h1>
      <main>
        <WiiGrid />
      </main>
      <footer>
        <BottomBar />
      </footer>
      {showIntro && <BootScreen />}
      <SoundFx />
    </div>
  );
}
