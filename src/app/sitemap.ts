import type { MetadataRoute } from "next";
import { cityPageSlugs, servicePageSlugs, blogPosts } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

/** Mirrors the original sitemap.xml URL set (plus career). Privacy policy excluded until approved. */
export default function sitemap(): MetadataRoute.Sitemap {
  const core = ["/", "/about", "/service", "/portfolio", "/blog", "/faq", "/our-team", "/contact", "/career"];
  const dynamic = Array.from(new Set([...servicePageSlugs, ...cityPageSlugs])).map((s) => `/${s}`);
  const posts = blogPosts.map((p) => `/blog/${p.slug}`);
  return [...core, ...dynamic, ...posts].map((p) => ({ url: absoluteUrl(p), changeFrequency: "weekly", priority: p === "/" ? 1 : 0.8 }));
}
