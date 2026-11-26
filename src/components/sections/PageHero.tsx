import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { AccentText, Eyebrow } from "@/components/ui/SectionHeading";

export interface Crumb { label: string; href?: string }

export function PageHero({ eyebrow, title, accent, sub, crumbs, children }: {
  eyebrow?: string; title: string; accent?: string; sub?: string; crumbs: Crumb[]; children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden hero-mesh pb-16 pt-36 text-white sm:pb-20 sm:pt-44">
      <div aria-hidden className="absolute inset-0 grid-lines" />
      <div aria-hidden className="absolute -right-24 top-24 hidden h-72 w-[38rem] rotate-[-28deg] rounded-[3rem] border border-white/15 lg:block" />
      <div className="container-x relative">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/70">
            {crumbs.map((c, i) => (
              <li key={i} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight aria-hidden className="size-3.5" />}
                {c.href ? <Link className="hover:text-white" href={c.href}>{c.label}</Link> : <span aria-current="page" className="font-semibold text-white">{c.label}</span>}
              </li>
            ))}
          </ol>
        </nav>
        <div className="mt-6 max-w-3xl">
          {eyebrow && <Eyebrow tone="light">{eyebrow}</Eyebrow>}
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.08] !text-white sm:text-5xl lg:text-6xl">
            <AccentText text={title} accent={accent} light />
          </h1>
          {sub && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">{sub}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}
