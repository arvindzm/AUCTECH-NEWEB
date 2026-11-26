import { PageHero } from "@/components/sections/PageHero";
import { CardGrid, CtaBanner, IntroSplit, LinkTiles, PowerSplit, ProcessSteps, StatsBand } from "@/components/sections/Blocks";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/site/JsonLd";
import { cities, services } from "@/lib/content";
import type { ServiceLikePage } from "@/types/content";

/**
 * Shared template for the 11 service pages and 33 city pages.
 * All copy comes from the migrated original page; sections without source content are not rendered.
 */
export function ServicePageTemplate({ page, kind }: { page: ServiceLikePage; kind: "service" | "city" }) {
  const self = `/${page.slug}`;
  return (
    <>
      {page.jsonLd.map((d, i) => <JsonLd key={i} data={d} />)}
      <PageHero
        eyebrow={page.hero.eyebrow}
        title={page.hero.h1}
        accent={page.hero.accent}
        sub={page.hero.sub}
        crumbs={[{ label: "Home", href: "/" }, ...(kind === "service" ? [{ label: "Services", href: "/service" }] : []), { label: page.hero.breadcrumb || page.hero.h1 }]}
      />
      <IntroSplit {...page.intro} />
      <StatsBand stats={page.stats} tone="dark" />
      {page.why && <CardGrid block={page.why} cols={page.why.items.length === 4 ? 4 : 3} />}
      {page.power && <PowerSplit block={page.power} />}
      <CardGrid block={page.services} variant={page.power ? "light" : "tinted"} />
      <ProcessSteps block={page.process} />
      <CtaBanner title={page.cta.h2} text={page.cta.text} primary={page.cta.primary} />
      {page.faq.items.length > 0 && (
        <section className="pb-20" aria-labelledby="faq-h">
          <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <div id="faq-h"><SectionHeading align="left" eyebrow="FAQ" title={page.faq.h2} accent={page.faq.accent} desc={page.faq.desc} /></div>
            </div>
            <FaqAccordion items={page.faq.items} />
          </div>
        </section>
      )}
      {kind === "city" ? (
        <LinkTiles title="3D Walkthrough Services in Other Cities" links={cities.filter((c) => c.href !== self).map((c) => ({ label: c.name, href: c.href }))} />
      ) : (
        <LinkTiles title="Explore Our Other Services" links={services.filter((s) => s.href !== self).map((s) => ({ label: s.navLabel, href: s.href }))} />
      )}
    </>
  );
}
