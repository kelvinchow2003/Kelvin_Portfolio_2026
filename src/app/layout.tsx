import type { Metadata } from "next";
import { Nunito, M_PLUS_1p } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { NAME, ROLE, SITE_URL } from "@/lib/site";
import "./globals.css";

// Nunito's heavy weights stand in for the rounded "Wii" logotype.
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["800", "900"],
});

// M PLUS 1p is the closest free match to FOT-Rodin, the Wii Menu system font.
const mplus = M_PLUS_1p({
  variable: "--font-mplus",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

const DESCRIPTION = `${NAME}: ${ROLE}. Software, automation and machine-vision work, presented as a playable Wii Menu.`;

export const metadata: Metadata = {
  metadataBase: SITE_URL ? new URL(SITE_URL) : undefined,
  title: {
    default: `${NAME} · Portfolio`,
    template: `%s · ${NAME}`,
  },
  description: DESCRIPTION,
  authors: [{ name: NAME }],
  openGraph: {
    type: "website",
    siteName: `${NAME} · Portfolio`,
    title: `${NAME} · Portfolio`,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${NAME} · Portfolio`,
    description: DESCRIPTION,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${mplus.variable} h-full antialiased`}
    >
      <body className="h-full">
        {children}
        {/* page-view stats when hosted on Vercel; nothing loads anywhere else */}
        {process.env.VERCEL && <Analytics />}
      </body>
    </html>
  );
}
