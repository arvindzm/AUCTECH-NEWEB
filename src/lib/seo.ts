import type { Metadata } from "next";
import type { PageMetaSource } from "@/types/content";
import { SITE_URL, absoluteUrl, company } from "@/lib/site";

interface BuildMetaInput {
  path: string; // route path, e.g. "/about"
  source?: PageMetaSource;
  title?: string;
  description?: string;
  noindex?: boolean;
}

/**
 * Builds page metadata. Original titles/descriptions/keywords/OG values are preserved verbatim.
 * Canonical = original canonical when present, otherwise the page's own original URL.
 */
export function buildMetadata({ path, source, title, description, noindex }: BuildMetaInput): Metadata {
  const t = title ?? source?.title ?? company.name;
  const d = description ?? source?.description ?? "";
  const canonical = source?.canonical || absoluteUrl(path);
  const ogImage = source?.["og:image"] || undefined;
  return {
    metadataBase: new URL(SITE_URL),
    title: { absolute: t },
    description: d || undefined,
    keywords: source?.keywords ? source.keywords.split(",").map((k) => k.trim()).filter(Boolean) : undefined,
    alternates: { canonical },
    openGraph: {
      type: "website",
      siteName: company.name,
      title: source?.["og:title"] || t,
      description: source?.["og:description"] || d || undefined,
      url: source?.["og:url"] || canonical,
      images: ogImage ? [{ url: ogImage }] : undefined,
      locale: "en_IN",
    },
    twitter: { card: "summary_large_image", title: t, description: d || undefined },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}

/** Site-wide LocalBusiness structured data — copied from the original site's JSON-LD. */
export const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Auctech IT Solutions",
  telephone: "+91-9565443351",
  email: "info@auctechitsolutions.in",
  url: "https://auctechitsolutions.in",
  image: "https://auctechitsolutions.in/img/auctech_logo.webp",
  priceRange: "₹₹",
  address: { "@type": "PostalAddress", ...company.address },
  openingHours: "Mo-Sa 10:00-19:00",
  sameAs: [
    "https://www.facebook.com/share/tWzWLJTaxxM8RUyU",
    "https://twitter.com/auctech_it",
    "https://www.linkedin.com/company/auctech-it-solution",
    "https://www.instagram.com/auctechitsolutions_pvtltd",
  ],
};
