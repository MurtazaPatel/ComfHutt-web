import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /score/[id] pages are ad-hoc anonymous lookups (UUID URLs, thin
        // content) — not an SEO asset. The evergreen, indexable equivalent
        // is the programmatic /property/[slug] corpus (see sitemap.ts).
        disallow: ["/dashboard", "/onboarding", "/signin", "/signup", "/api/", "/score/"],
      },
    ],
    sitemap: "https://crux.comfhutt.com/sitemap.xml",
  };
}
