import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBanner } from "@/components/sections/Blocks";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { corePages } from "@/content/core-pages";
import { getCoreMeta, teamMembers } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { assetPath, company } from "@/lib/site";

export const metadata: Metadata = buildMetadata({ path: "/our-team", source: getCoreMeta("our-team") });

export default function TeamPage() {
  const c = corePages.team;
  return (
    <>
      <PageHero {...c.hero} title={c.hero.h1} crumbs={[{ label: "Home", href: "/" }, { label: "Our Team" }]} />
      <section className="py-20 sm:py-24">
        <div className="container-x">
          <SectionHeading title={c.h2} accent={c.accent} desc={c.sub} />
          <ul className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {teamMembers.map((m) => (
              <Reveal as="li" key={m.name} className="group overflow-hidden rounded-3xl border border-line bg-white transition hover:-translate-y-1 hover:shadow-lift">
                <div className="relative aspect-square overflow-hidden bg-surface">
                  {/* Original site uses one shared placeholder portrait for every member */}
                  {m.image && <Image src={assetPath(m.image)} alt="" width={400} height={400} sizes="(min-width:1024px) 280px, 45vw" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />}
                </div>
                <div className="p-4 text-center sm:p-5">
                  <h3 className="text-base font-bold sm:text-lg">{m.name}</h3>
                  {m.role && <p className="mt-0.5 text-sm text-brand-700">{m.role}</p>}
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
      <CtaBanner title={company.footerCta.title} text={company.footerCta.text} primary={{ label: "Get a Free Quote", href: "/contact" }} />
    </>
  );
}
