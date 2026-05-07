import type { MetadataRoute } from "next";
import { getEnglishCities } from "@/lib/cities";
import { getAllPosts } from "@/lib/blog";

const BASE = "https://mudrankseva.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const cityEntries: MetadataRoute.Sitemap = getEnglishCities().map((c) => ({
    url: `${BASE}/cities/${c.canonicalSlug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const blogEntries: MetadataRoute.Sitemap = getAllPosts().map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    { url: BASE,                    lastModified: now, changeFrequency: "monthly", priority: 1.0 },
    { url: `${BASE}/calculator`,    lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/rent-agreement`,lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/sales-deed`,    lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/gift-deed`,     lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/poa`,           lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    ...cityEntries,
    ...blogEntries,
  ];
}
