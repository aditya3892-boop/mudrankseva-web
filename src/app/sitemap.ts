import type { MetadataRoute } from "next";

const BASE = "https://mudrankseva.in";
const TODAY = new Date("2026-05-07");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE,
      lastModified: TODAY,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${BASE}/calculator`,
      lastModified: TODAY,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE}/rent-agreement`,
      lastModified: TODAY,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE}/sales-deed`,
      lastModified: TODAY,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];
}
