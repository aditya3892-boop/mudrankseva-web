import type { MetadataRoute } from "next";

const BASE = "https://mudrankseva.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: BASE,                    lastModified: now, changeFrequency: "monthly", priority: 1.0 },
    { url: `${BASE}/calculator`,    lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/rent-agreement`,lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/sales-deed`,    lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/gift-deed`,     lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/poa`,           lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
  ];
}
