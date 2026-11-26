import Image from "next/image";
import {
  Award, BadgeCheck, Box, Clapperboard, Compass, Gem, Layers, Lightbulb, Rocket, ShieldCheck, Sparkles, Target,
  Users, Wand2, Zap, CheckCircle2, ArrowRight,
} from "lucide-react";
import { AccentText, Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { assetPath } from "@/lib/site";
import type { Card, ImageRef, LinkRef, SectionBlock, Stat } from "@/types/content";
import { cn } from "@/lib/cn";

/** Decorative icons are assigned by position only; they carry no content meaning. */
const ICONS = [Sparkles, ShieldCheck, Wand2, Gem, Rocket, Users, Target, Layers, Lightbulb, Zap, Compass, Award, Box, Clapperboard, BadgeCheck];

export function IntroSplit({ label, h2, accent, paras, image, cta }: { label?: string; h2: string; accent?: string; paras: string[]; image: ImageRef | null; cta?: LinkRef | null }) {
  return (
    <section className="py-20 sm:py-24">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {image && (
          <Reveal className="relative">
            <div aria-hidden className="absolute -inset-3 -z-10 rounded-[2rem] bg-brand-gradient opacity-15 blur-xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-line bg-surface shadow-card">
              <Image src={assetPath(image.src)} alt={image.alt} width={1200} height={900} sizes="(min-width:1024px) 600px, 100vw" className="h-auto w-full object-cover" />
            </div>
          </Reveal>
        )}
        <Reveal>
          {label && <Eyebrow>{label}</Eyebrow>}
          <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl"><AccentText text={h2} accent={accent} /></h2>
          <div className="mt-5 space-y-4 text-[17px] leading-relaxed text-ink-soft">
            {paras.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          {cta && <ButtonLink href={cta.href.startsWith("/") || cta.href.startsWith("http") ? cta.href : `/${cta.href}`} className="mt-7" arrow>{cta.label}</ButtonLink>}
        </Reveal>
      </div>
    </section>
  );
}

export function StatsBand({ stats, tone = "light" }: { stats: Stat[]; tone?: "light" | "dark" }) {
  if (!stats.length) return null;
  return (
    <section aria-label="Key figures" className="container-x">
      <dl className={cn("grid grid-cols-2 overflow-hidden rounded-[2rem]", stats.length === 3 ? "sm:grid-cols-3" : "lg:grid-cols-4",
        tone === "dark" ? "bg-brand-gradient text-white" : "border border-line bg-white shadow-card")}>
        {stats.map((s, i) => (
          <div key={i} className={cn("flex flex-col items-center justify-center px-4 py-8 text-center",
            stats.length === 3
              ? cn(i > 0 && "sm:border-l", i === 2 && "col-span-2 border-t sm:col-span-1 sm:border-t-0", i === 1 && "border-l")
              : cn(i % 2 === 1 && "border-l", i >= 2 && "border-t lg:border-t-0", i > 0 && "lg:border-l"),
            tone === "dark" ? "border-white/15" : "border-line")}>
            <dt className={cn("order-2 mt-1 text-sm font-medium", tone === "dark" ? "text-white/80" : "text-muted")}>{s.label}</dt>
            <dd className={cn("order-1 text-3xl font-extrabold sm:text-4xl", tone === "dark" ? "text-[#E2E800]" : "text-gradient")}>{s.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function CardGrid({ block, variant = "light", cols = 3 }: { block: SectionBlock; variant?: "light" | "tinted"; cols?: 2 | 3 | 4 }) {
  if (!block.items.length) return null;
  return (
    <section className={cn("py-20 sm:py-24", variant === "tinted" && "bg-surface")}>
      <div className="container-x">
        <SectionHeading eyebrow={block.label} title={block.h2} accent={block.accent} desc={block.desc} />
        <ul className={cn("mt-12 grid gap-5 sm:grid-cols-2", cols === 3 && "lg:grid-cols-3", cols === 4 && "lg:grid-cols-4")}>
          {block.items.map((c, i) => <FeatureCard key={i} card={c} index={i} />)}
        </ul>
      </div>
    </section>
  );
}

export function FeatureCard({ card, index }: { card: Card; index: number }) {
  const Icon = ICONS[index % ICONS.length];
  return (
    <Reveal as="li" delay={(index % 3) * 80}
      className="group relative h-full overflow-hidden rounded-3xl border border-line bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift">
      <div aria-hidden className="absolute -right-10 -top-10 size-32 rounded-full bg-brand-gradient opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20" />
      <span aria-hidden className="flex size-13 items-center justify-center rounded-2xl bg-brand-50 p-3.5 text-brand-700 transition-colors duration-300 group-hover:bg-brand-gradient group-hover:text-white">
        <Icon className="size-6" />
      </span>
      <h3 className="mt-5 text-xl font-bold">{card.title}</h3>
      {card.text && <p className="mt-2.5 leading-relaxed text-muted">{card.text}</p>}
    </Reveal>
  );
}

export function PowerSplit({ block }: { block: SectionBlock }) {
  if (!block.items.length) return null;
  return (
    <section className="relative overflow-hidden bg-navy py-20 text-white sm:py-24">
      <div aria-hidden className="absolute inset-0 grid-lines" />
      <div className={cn("container-x relative grid items-center gap-12", block.image && "lg:grid-cols-2")}>
        <div>
          {block.label && <Eyebrow tone="light">{block.label}</Eyebrow>}
          <h2 className="mt-3 text-3xl font-extrabold leading-tight !text-white sm:text-4xl"><AccentText text={block.h2} accent={block.accent} light /></h2>
          <ul className={cn("mt-8 gap-4", block.image ? "grid" : "grid md:grid-cols-2 lg:grid-cols-4")}>
            {block.items.map((c, i) => (
              <Reveal as="li" key={i} delay={i * 80} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-white/25 hover:bg-white/[0.07]">
                <CheckCircle2 aria-hidden className="mt-0.5 size-6 shrink-0 text-[#E2E800]" />
                <div><h3 className="text-lg font-bold !text-white">{c.title}</h3>{c.text && <p className="mt-1 text-white/70">{c.text}</p>}</div>
              </Reveal>
            ))}
          </ul>
        </div>
        {block.image && (
          <Reveal className="overflow-hidden rounded-[2rem] border border-white/10">
            <Image src={assetPath(block.image.src)} alt={block.image.alt} width={1200} height={900} sizes="(min-width:1024px) 600px, 100vw" className="h-auto w-full object-cover" />
          </Reveal>
        )}
      </div>
    </section>
  );
}

export function ProcessSteps({ block }: { block: SectionBlock }) {
  if (!block.items.length) return null;
  return (
    <section className="bg-surface py-20 sm:py-24">
      <div className="container-x">
        <SectionHeading eyebrow={block.label} title={block.h2} accent={block.accent} desc={block.desc} />
        <ol className={cn("relative mt-14 grid gap-5 md:grid-cols-2", block.items.length >= 5 ? "lg:grid-cols-5" : "lg:grid-cols-4")}>
          <span aria-hidden className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-[#E2E800] to-transparent lg:block" />
          {block.items.map((s, i) => (
            <Reveal as="li" key={i} delay={i * 90} className="relative rounded-3xl border border-line bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-lift">
              <span className="relative flex size-14 items-center justify-center rounded-2xl border border-[#E2E800]/30 bg-[#141414] text-lg font-extrabold text-[#E2E800] shadow-lift">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
              {s.text && <p className="mt-2 text-[15px] leading-relaxed text-muted">{s.text}</p>}
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function CtaBanner({ title, text, primary }: { title: string; text?: string; primary?: LinkRef | null }) {
  const href = primary?.href ? (primary.href.startsWith("/") ? primary.href : `/${primary.href}`) : "/contact";
  return (
    <section className="py-16 sm:py-20">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-[2rem] bg-brand-gradient px-6 py-14 text-center text-white sm:px-12">
          <div aria-hidden className="absolute inset-0 grid-lines" />
          <div aria-hidden className="absolute -left-16 -top-16 size-64 rounded-full bg-[#E2E800]/20 blur-3xl" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-extrabold !text-white sm:text-4xl">{title}</h2>
            {text && <p className="mt-4 text-lg text-white/85">{text}</p>}
            <ButtonLink href={href} variant="light" size="lg" className="mt-8" arrow>{primary?.label || "Get a Free Quote"}</ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LinkTiles({ title, links, desc }: { title: string; desc?: string; links: { label: string; href: string }[] }) {
  return (
    <section className="pb-20">
      <div className="container-x">
        <h2 className="text-2xl font-extrabold">{title}</h2>
        {desc && <p className="mt-2 text-muted">{desc}</p>}
        <ul className="mt-6 flex flex-wrap gap-2">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="group inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink-soft transition hover:border-brand-300 hover:text-brand-700">
                {l.label}<ArrowRight aria-hidden className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
