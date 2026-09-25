# Kelvin Chow · Wii Menu Portfolio

My portfolio, built as a working recreation of the Nintendo Wii Menu. Every channel is a piece of my work: jobs,
projects, skills, a résumé, and a Message Board that emails me.

Built with Next.js 16 (App Router), React 19, Tailwind CSS 4 and hand-drawn animated SVG scenes.

## Features

- **The Wii Menu, faithfully**: the 4×3 channel grid with pages that slide, the curved bottom bar with a live clock,
  and a zoom from each tile into its channel's splash screen.
- **Animated channel banners** for every job and project (`src/components/scenes`).
- **Quick Tour (Disc Channel)**: the whole portfolio on one screen for visitors in a hurry.
- **Message Board**: a contact form that sends email through Resend, and opens the visitor's mail app when email
  isn't set up.
- **Shareable channel links**: `/?channel=ats` opens a channel directly, previews correctly when shared, and the
  browser's Back button closes it.
- **Phone layout**: on tall screens the menu becomes a two-column scrolling list.
- **Keyboard, touch and screen reader friendly**: arrow keys move between channels like a D-pad, you can swipe
  between pages, dialogs trap and restore focus, and every animation respects `prefers-reduced-motion`.
- **Menu sounds**: original sounds synthesized with Web Audio (no Nintendo audio), with a mute toggle in the bottom bar.

## Editing content

| What | Where |
| --- | --- |
| Name, role, links, résumé, repos, education | `src/lib/site.ts` |
| Channels: titles, text, tech stacks, positions | `src/lib/channels.ts` |
| Channel icons | `src/components/ChannelIcon.tsx` |
| Animated banners | `src/components/scenes/*` |

Any link left as `""` in `site.ts` shows as "coming soon" instead of a dead link. Source-code links are hidden
until they're set. To add a screenshot to a channel, drop the image in `public/` and set `image` on that channel.

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploying

Deploy to [Vercel](https://vercel.com) (or any Node host) and set the variables from `.env.example`:

- `NEXT_PUBLIC_SITE_URL`: the deployed address (for link previews and the sitemap)
- `RESEND_API_KEY`, `CONTACT_TO_EMAIL` and optionally `CONTACT_FROM_EMAIL`: Message Board email

Page-view analytics switch on automatically when the site is hosted on Vercel (enable Analytics in the project
dashboard).

## Disclaimer

A fan-made tribute to the Wii Menu. Not affiliated with or endorsed by Nintendo. "Wii" is a trademark of
Nintendo. All artwork and sounds on this site are original.
