import type { Metadata } from "next";
import { Check } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { CardGrid, CtaBanner, StatsBand } from "@/components/sections/Blocks";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { JsonLd } from "@/components/site/JsonLd";
import { corePages } from "@/content/core-pages";
import { getCoreMeta, services } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { company } from "@/lib/site";

export const metadata: Metadata = buildMetadata({ path: "/about", source: getCoreMeta("about") });
const c = corePages.about;

export default function AboutPage() {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "AboutPage", mainEntityOfPage: { "@type": "WebPage", "@id": "https://auctechitsolutions.in/about" },
        name: "About Auctech IT Solutions - Digital Marketing Agency in Lucknow",
        description: "Learn about Auctech IT Solutions, the leading digital marketing, SEO, and 3D walkthrough company based in Lucknow.",
        publisher: { "@type": "Organization", name: "Auctech IT Solutions" } }} />
      <PageHero {...c.hero} title={c.hero.h1} crumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]} />
      <section className="py-20 sm:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <Eyebrow>{c.who.label}</Eyebrow>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">{c.who.h2}</h2>
            <div className="mt-5 space-y-4 text-[17px] leading-relaxed">{c.who.paras.map((p) => <p key={p}>{p}</p>)}</div>
            <ul className="mt-7 flex flex-wrap gap-3">
              {c.who.bullets.map((b) => <li key={b} className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-800"><Check aria-hidden className="size-4" />{b}</li>)}
            </ul>
          </div>
          <aside className="relative overflow-hidden rounded-[2rem] bg-navy p-8 text-white">
            <div aria-hidden className="absolute inset-0 grid-lines" />
            <div className="relative">
              <p className="text-sm font-bold uppercase tracking-widest text-brand-200">Our Services</p>
              <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {services.map((s) => <li key={s.key}><a href={s.href} className="block rounded-xl bg-white/[0.06] px-3 py-2.5 text-sm font-semibold text-white/90 transition hover:bg-white/15">{s.navLabel}</a></li>)}
              </ul>
              <ButtonLink href={`tel:${company.phonePrimary.tel}`} variant="gradient" className="mt-6 w-full">Call {company.phonePrimary.display}</ButtonLink>
            </div>
          </aside>
        </div>
      </section>
      <StatsBand stats={c.stats} tone="dark" />
      <CardGrid block={{ ...c.capabilities, image: null }} />
      <CtaBanner title={company.footerCta.title} text={company.footerCta.text} primary={{ label: "Get a Free Quote", href: "/contact" }} />
    </>
  );
}
