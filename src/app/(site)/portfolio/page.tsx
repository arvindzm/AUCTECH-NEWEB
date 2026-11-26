import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBanner, StatsBand } from "@/components/sections/Blocks";
import { PortfolioGallery } from "@/features/public/PortfolioGallery";
import { corePages } from "@/content/core-pages";
import { getCoreMeta, portfolioFilters, portfolioItems } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { company } from "@/lib/site";

export const metadata: Metadata = buildMetadata({ path: "/portfolio", source: getCoreMeta("portfolio") });

export default function PortfolioPage() {
  const c = corePages.portfolio;
  return (
    <>
      <PageHero {...c.hero} title={c.hero.h1} crumbs={[{ label: "Home", href: "/" }, { label: "Portfolio" }]} />
      <div className="-mt-10 relative z-10"><StatsBand stats={c.stats} /></div>
      <section className="py-16 sm:py-20">
        <div className="container-x"><PortfolioGallery items={portfolioItems} filters={portfolioFilters} /></div>
      </section>
      <CtaBanner title={company.footerCta.title} text={company.footerCta.text} primary={{ label: "Get in Touch", href: "/contact" }} />
    </>
  );
}
