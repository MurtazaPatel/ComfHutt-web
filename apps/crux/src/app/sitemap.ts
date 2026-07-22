import type { MetadataRoute } from "next";

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
  ];
}
