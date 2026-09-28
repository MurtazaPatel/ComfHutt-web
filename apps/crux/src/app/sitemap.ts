import type { MetadataRoute } from "next";

import { LEGAL } from "@/config/legal";

const BASE_URL = "https://crux.comfhutt.com";

export default function sitemap(): MetadataRoute.Sitemap {
  // Static marketing routes today. Programmatic /property/[slug] pages
  // (per-project GujRERA corpus) get their own generated entries appended
  // here once that corpus is live — see WS4 Phase B.
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    // The method. Ranked above the legal pages because it is the page the
    // product's central claim depends on — "our method is published" is only
    // true if this is reachable and indexable.
    {
      url: `${BASE_URL}/methodology`,
      lastModified: new Date(LEGAL.effectiveDate),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // The legal pages. Indexable on purpose: the Disclaimer is what a developer
    // served a grade should be able to find and read, and a page nobody can find
    // is not a published correction process.
    ...["/disclaimer", "/terms", "/privacy", "/dispute"].map((path) => ({
      url: `${BASE_URL}${path}`,
      lastModified: new Date(LEGAL.effectiveDate),
      changeFrequency: "yearly" as const,
      priority: 0.4,
    })),
  ];
}
