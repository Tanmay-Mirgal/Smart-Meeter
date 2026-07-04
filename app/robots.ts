import type { MetadataRoute } from "next";
import { getPublicAppUrl } from "@/lib/public-app-url";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getPublicAppUrl();

  return {
    rules: [
      {
        // Allow all bots to crawl the public landing pages
        userAgent: "*",
        allow: [
          "/",
          "/sign-in",
          "/sign-up",
        ],
        disallow: [
          // Keep authenticated/private pages out of index
          "/dashboard",
          "/meetings",
          "/meeting/",
          "/tasks",
          "/minutes-of-meetings",
          "/integrations",
          "/billing",
          "/insights",
          "/onboarding",
          // Next.js internal paths
          "/_next/",
          "/api/",
        ],
      },
      {
        // Block AI scrapers & aggressive bots
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "CCBot",
          "anthropic-ai",
          "Claude-Web",
        ],
        disallow: "/",
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
