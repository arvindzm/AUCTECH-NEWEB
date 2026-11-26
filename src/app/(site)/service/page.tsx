import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBanner } from "@/components/sections/Blocks";
import { Reveal } from "@/components/ui/Reveal";
import { corePages } from "@/content/core-pages";
import { getCoreMeta, services } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { assetPath, company } from "@/lib/site";

export const metadata: Metadata = buildMetadata({ path: "/service", source: getCoreMeta("service") });

export default function ServicesPage() {
  const h = corePages.services.hero;
  return (
    <>
      <PageHero {...h} title={h.h1} crumbs={[{ label: "Home", href: "/" }, { label: "Services" }]} />
      <section className="py-20 sm:py-24">
        <div className="container-x">
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <Reveal as="li" key={s.key}>
                <Link href={s.href} className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift">
                  <div className="relative aspect-[16/10] overflow-hidden bg-surface">
                    <Image src={assetPath(s.image.src)} alt={s.image.alt} fill sizes="(min-width:1024px) 400px, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <h2 className="text-xl font-bold group-hover:text-brand-700">{s.name}</h2>
                    <p className="mt-2.5 flex-1 leading-relaxed text-muted">{s.summary}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-700">Discover More
                      <span className="flex size-8 items-center justify-center rounded-full bg-brand-50 transition group-hover:bg-brand-gradient group-hover:text-white"><ArrowUpRight aria-hidden className="size-4" /></span></span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
      <CtaBanner title={company.footerCta.title} text={company.footerCta.text} primary={{ label: "Get a Free Quote", href: "/contact" }} />
    </>
  );
}
