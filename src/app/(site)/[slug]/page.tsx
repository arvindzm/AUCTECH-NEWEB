import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ServicePageTemplate } from "@/features/public/ServicePageTemplate";
import { cityPageSlugs, getServiceLikePage, servicePageSlugs } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

/** Original .php URLs for the 10 dedicated service pages + 33 city pages (3D walkthrough Lucknow is both). */
const SLUGS = Array.from(new Set([...servicePageSlugs, ...cityPageSlugs]));

export const dynamicParams = false;
export function generateStaticParams() { return SLUGS.map((slug) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getServiceLikePage(slug);
  if (!page) return {};
  return buildMetadata({ path: `/${slug}`, source: page.meta });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getServiceLikePage(slug);
  if (!page) notFound();
  const kind = cityPageSlugs.includes(slug) && slug !== "3d-walkthrough-in-lucknow" ? "city" : "service";
  return <ServicePageTemplate page={page} kind={kind} />;
}
