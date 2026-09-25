import type { Metadata } from "next";
import { Nunito, M_PLUS_1p } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Kelvin Chow — Wii Menu Portfolio",
  description: "A 1:1 recreation of the Wii Menu, reskinned as Kelvin Chow's portfolio.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${mplus.variable} h-full antialiased`}
    >
      <body className="h-full">{children}</body>
    </html>
  );
}
