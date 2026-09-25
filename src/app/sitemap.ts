import type { MetadataRoute } from "next";
import { channels } from "@/lib/channels";
import { SITE_URL } from "@/lib/site";

// the home page plus a shareable link for every channel with content
export default function sitemap(): MetadataRoute.Sitemap {
  if (!SITE_URL) return [];
  const base = SITE_URL.replace(/\/$/, "");
  return [
    { url: `${base}/`, priority: 1 },
    ...channels.filter((c) => c.content).map((c) => ({ url: `${base}/?channel=${c.id}`, priority: 0.6 })),
  ];
}
