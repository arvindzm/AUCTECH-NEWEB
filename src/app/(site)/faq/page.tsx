import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBanner } from "@/components/sections/Blocks";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/site/JsonLd";
import { FaqLibrary } from "@/features/public/FaqLibrary";
import { corePages } from "@/content/core-pages";
import { faqCategories, faqItems, getCoreMeta } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { company } from "@/lib/site";

export const metadata: Metadata = buildMetadata({ path: "/faq", source: getCoreMeta("faq") });

export default function FaqPage() {
  const c = corePages.faq;
  return (
    <>
      {/* FAQPage structured data is supported by the visible original Q&A content */}
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage",
        mainEntity: faqItems.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }} />
      <PageHero {...c.hero} title={c.hero.h1} crumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]} />
      <section className="py-20">
        <div className="container-x">
          <SectionHeading title={c.h2} className="mb-10" />
          <FaqLibrary items={faqItems} categories={faqCategories} />
        </div>
      </section>
      <CtaBanner title={company.footerCta.title} text={company.footerCta.text} primary={{ label: "Contact Us", href: "/contact" }} />
    </>
  );
}
