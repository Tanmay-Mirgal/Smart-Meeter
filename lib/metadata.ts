import type { Metadata } from "next";
import { getPublicAppUrl } from "@/lib/public-app-url";

export const SITE_NAME = "Smart Meet";
export const SITE_DESCRIPTION =
  "Smart Meet — AI-powered meeting intelligence. Real-time transcription, instant AI summaries, action items, and team collaboration in one workspace. Free to start.";
export const SITE_KEYWORDS = [
  "smart meet",
  "AI meeting assistant",
  "meeting transcription",
  "real-time transcription",
  "AI meeting summaries",
  "meeting notes",
  "action items",
  "team collaboration",
  "meeting workspace",
  "meeting intelligence",
  "automated minutes",
  "online meeting tool",
];

function buildTitle(title: string) {
  return `${title} | ${SITE_NAME}`;
}

interface CreateMetadataOptions {
  title: string;
  description: string;
  /** Path relative to root, e.g. "/dashboard". Used for canonical URL. */
  path?: string;
  keywords?: string[];
  /** Whether search engines should index this page. Defaults to true. */
  index?: boolean;
  /** OG image path (relative). Defaults to /og-image.png */
  ogImage?: string;
}

export function createMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  index = true,
  ogImage = "/og-image.png",
}: CreateMetadataOptions): Metadata {
  const siteUrl = getPublicAppUrl();
  const canonicalUrl = `${siteUrl}${path}`;
  const fullOgImage = `${siteUrl}${ogImage}`;
  const allKeywords = [...SITE_KEYWORDS, ...keywords];

  return {
    title: buildTitle(title),
    description,
    keywords: allKeywords,
    authors: [{ name: SITE_NAME, url: siteUrl }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: canonicalUrl,
    },
    robots: index
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        }
      : {
          index: false,
          follow: false,
          googleBot: { index: false, follow: false },
        },
    openGraph: {
      title: buildTitle(title),
      description,
      siteName: SITE_NAME,
      type: "website",
      url: canonicalUrl,
      locale: "en_US",
      images: [
        {
          url: fullOgImage,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} — ${title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: buildTitle(title),
      description,
      images: [fullOgImage],
      creator: "@smartmeet",
      site: "@smartmeet",
    },
  };
}

// Legacy compat — keeps old call signature working
export function createMeetingMetadata(title: string, description: string): Metadata {
  return createMetadata({ title, description, index: false });
}

// ── JSON-LD structured data helpers ──────────────────────────────────────────

export function websiteJsonLd() {
  const siteUrl = getPublicAppUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: siteUrl,
    description: SITE_DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/meetings?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationJsonLd() {
  const siteUrl = getPublicAppUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description: SITE_DESCRIPTION,
    foundingDate: "2024",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      availableLanguage: ["English"],
    },
    sameAs: [],
  };
}

export function softwareAppJsonLd() {
  const siteUrl = getPublicAppUrl();
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: siteUrl,
    description: SITE_DESCRIPTION,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Real-time meeting transcription",
      "AI-generated meeting summaries",
      "Action item tracking",
      "Meeting minutes generation",
      "Team collaboration workspace",
      "Multi-language support",
    ],
  };
}

export function breadcrumbJsonLd(
  items: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
