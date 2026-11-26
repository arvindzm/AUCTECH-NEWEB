import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Award, Cpu, HeartHandshake, MapPin, Rocket, SearchX } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { ApplicationForm } from "@/components/forms/ApplicationForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { corePages } from "@/content/core-pages";
import { getCoreMeta, jobPostings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({ path: "/career", source: getCoreMeta("career") });
const PERK_ICONS = [Rocket, Cpu, HeartHandshake, Award];

export default function CareersPage() {
  const c = corePages.careers;
  return (
    <>
      <PageHero {...c.hero} title={c.hero.h1} crumbs={[{ label: "Home", href: "/" }, { label: "Careers" }]} />
      <section className="py-20">
        <div className="container-x">
          <SectionHeading eyebrow={c.openings.label} title={c.openings.h2} desc={c.openings.desc} />
          <div className="mx-auto mt-12 max-w-4xl">
            {jobPostings.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-line bg-surface p-10 text-center">
                <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-card"><SearchX aria-hidden className="size-8" /></span>
                <h3 className="mt-5 text-2xl font-extrabold">{c.empty.title}</h3>
                <p className="mx-auto mt-2 max-w-lg text-muted">{c.empty.text}</p>
                <a href="#apply" className="mt-6 inline-flex h-11 items-center rounded-full bg-brand-700 px-6 font-semibold text-white hover:bg-brand-800">Drop your resume</a>
              </div>
            ) : (
              <ul className="space-y-4">
                {jobPostings.map((j) => (
                  <li key={j.slug}>
                    <Link href={`/career/${j.slug}`} className="group flex flex-col gap-3 rounded-3xl border border-line bg-white p-6 transition hover:border-brand-200 hover:shadow-lift sm:flex-row sm:items-center sm:justify-between">
                      <div><h3 className="text-xl font-bold group-hover:text-brand-700">{j.title}</h3>
                        <p className="mt-1 flex items-center gap-2 text-sm text-muted"><MapPin aria-hidden className="size-4" />{j.location} · {j.employmentType}</p></div>
                      <span className="inline-flex items-center gap-2 font-semibold text-brand-700">View role <ArrowUpRight aria-hidden className="size-4" /></span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
      <section className="bg-surface py-20">
        <div className="container-x">
          <SectionHeading title={c.perksTitle} />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {c.perks.map((p, i) => { const I = PERK_ICONS[i]; return (
              <li key={p.title} className="rounded-3xl border border-line bg-white p-7 text-center shadow-card">
                <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-brand-gradient text-white"><I aria-hidden className="size-6" /></span>
                <h3 className="mt-4 text-lg font-bold">{p.title}</h3><p className="mt-1 text-muted">{p.text}</p>
              </li>); })}
          </ul>
        </div>
      </section>
      <section id="apply" className="scroll-mt-28 py-20">
        <div className="container-x max-w-3xl">
          <div className="rounded-[2rem] border border-line bg-white p-6 shadow-card sm:p-10">
            <h2 className="text-3xl font-extrabold">Apply For This Position</h2>
            <p className="mt-2 text-muted">General application — share your details and resume.</p>
            <div className="mt-8"><ApplicationForm /></div>
          </div>
        </div>
      </section>
    </>
  );
}
