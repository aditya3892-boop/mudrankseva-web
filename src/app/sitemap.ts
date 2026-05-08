import type { MetadataRoute } from "next";
import { getEnglishCities } from "@/lib/cities";
import { getAllPosts } from "@/lib/blog";
import { SERVICE_CITY_PAGES } from "@/lib/service-cities";

const BASE = "https://mudrankseva.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const cityEntries: MetadataRoute.Sitemap = getEnglishCities().map((c) => ({
    url: `${BASE}/cities/${c.canonicalSlug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const serviceCityEntries: MetadataRoute.Sitemap = SERVICE_CITY_PAGES.map((p) => ({
    url: `${BASE}/services/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
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
    ...serviceCityEntries,
    { url: `${BASE}/about`,          lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/contact`,        lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/privacy-policy`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/terms`,          lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/refund-policy`,  lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/disclaimer`,     lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    ...cityEntries,
    ...blogEntries,
  ];
}
