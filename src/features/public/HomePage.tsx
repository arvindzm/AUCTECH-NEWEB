import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, Layers, Lightbulb, Quote, Star, Target } from "lucide-react";
import { home } from "@/content/home";
import { ButtonLink } from "@/components/ui/Button";
import { AccentText, Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { HeroVideoShowreel } from "@/components/sections/HeroVideoShowreel";
import { ServiceCardVisual3D } from "@/components/sections/ServiceCardVisual3D";
import { ExpertiseFocusCarousel3D } from "@/components/sections/ExpertiseFocusCarousel3D";
import { AdvertisingVisual3D } from "@/components/sections/AdvertisingVisual3D";
import { WalkthroughBackdrop3D } from "@/components/sections/WalkthroughBackdrop3D";
import { ShowcaseStatsScroll } from "@/components/sections/ShowcaseStatsScroll";
import { allTestimonials, cities, portfolioItems } from "@/lib/content";
import { assetPath, contentApprovals } from "@/lib/site";

export function HomePage() {
  const featured = portfolioItems.filter((p) => p.category === "3d-walkthrough").slice(0, 8);
  const testimonials = contentApprovals.testimonials ? allTestimonials.filter((t) => t.status === "approved") : [];
  return (
    <>
      {/* HERO: FULL-SCREEN CINEMATIC SHOWREEL (Navbar Floats Over It) */}
      <section className="relative w-full overflow-hidden bg-black p-0 m-0">
        <h1 className="sr-only">
          {home.hero.h1} — {home.hero.sub}
        </h1>
        <HeroVideoShowreel src={home.showcase.video?.src || "img/Showreel.mp4"} />
      </section>

      {/* SHOWCASE -> STATS SCROLL TRANSITION */}
      <ShowcaseStatsScroll showcase={home.showcase} stats={home.stats} />

      {/* ABOUT */}
      <section className="relative mt-16 overflow-hidden bg-[#39025F] py-20 text-white sm:mt-20 sm:py-24">
        <WalkthroughBackdrop3D />
        <div className="container-x relative z-10 grid items-center gap-14 lg:grid-cols-2">
          <Reveal className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="relative aspect-[648/776] w-full overflow-hidden rounded-[2rem] shadow-card bg-[#0f0f14] border border-white/15">
              <video
                src={assetPath(home.about.video?.src || "img/Statue_360_Smooth.mp4")}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="absolute left-0 w-full max-w-none object-cover"
                style={{
                  top: "-70px",
                  height: "calc(100% + 100px)",
                }}
              />
            </div>
            <div className="absolute -bottom-6 right-6 rounded-2xl border border-[#E6007A]/40 bg-[#280146] px-6 py-5 text-white shadow-lift z-10">
              <p className="text-4xl font-extrabold text-[#E6007A]">{home.about.exp.value}</p><p className="text-sm text-white/85">{home.about.exp.label}</p>
            </div>
          </Reveal>
          <Reveal>
            <Eyebrow tone="light">{home.about.label}</Eyebrow>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight !text-white sm:text-4xl"><AccentText text={home.about.h2} accent={home.about.accent} light /></h2>
            <div className="mt-5 space-y-4 text-[17px] leading-relaxed text-white/80">{home.about.paras.map((p) => <p key={p}>{p}</p>)}</div>
            <ul className="mt-6 grid gap-3 sm:grid-cols-3">
              {home.about.points.map((p) => <li key={p} className="flex items-start gap-2 text-sm font-semibold text-white"><Check aria-hidden className="mt-0.5 size-4 shrink-0 text-[#E6007A]" />{p}</li>)}
            </ul>
            <ButtonLink href={home.about.cta.href} variant="gradient" className="mt-8" arrow>{home.about.cta.label}</ButtonLink>
          </Reveal>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-surface py-20 sm:py-24">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading align="left" eyebrow={home.services.label} title={home.services.h2} accent={home.services.accent} desc={home.services.desc} />
            <ButtonLink href={home.services.more.href} variant="outline" arrow>{home.services.more.label}</ButtonLink>
          </div>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {home.services.items.map((s, i) => (
              <Reveal as="li" key={s.title} delay={(i % 3) * 80}>
                <Link href={s.href} className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white p-6 transition-all duration-300 hover:border-brand-300 hover:shadow-lift">
                  <div className="relative mb-5">
                    <ServiceCardVisual3D index={i} />
                    <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/50 px-2.5 py-0.5 font-mono text-xs font-bold text-white backdrop-blur-md">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold transition-colors group-hover:text-brand-700">{s.title}</h3>
                  <p className="mt-2.5 flex-1 text-[15px] leading-relaxed text-muted">{s.text}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-700">{s.cta}
                    <span className="flex size-8 items-center justify-center rounded-full bg-brand-50 transition-colors group-hover:bg-brand-gradient group-hover:text-white"><ArrowUpRight aria-hidden className="size-4" /></span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* WHY */}
      <section className="relative overflow-hidden bg-[#39025F] py-12 text-white sm:py-16 lg:py-20">
        <AdvertisingVisual3D alt={home.why.image.alt} />
        <div className="container-x pointer-events-none relative z-10 grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <Reveal className="pointer-events-auto order-2 lg:order-1">
            <Eyebrow tone="light">{home.why.label}</Eyebrow>
            <h2 className="mt-2.5 text-3xl font-extrabold !text-white sm:text-4xl"><AccentText text={home.why.h2} accent={home.why.accent} light /></h2>
            <p className="mt-4 text-[17px] leading-relaxed text-white/80">{home.why.text}</p>
            <ul className="mt-6 space-y-3">
              {home.why.items.map((it, i) => <FeatureRow key={it.title} index={i} {...it} />)}
            </ul>
          </Reveal>
          <div aria-hidden="true" className="order-1 h-[225px] sm:h-[285px] lg:order-2 lg:h-full lg:min-h-[400px]" />
        </div>
      </section>

      {/* EXPERTISE */}
      <section className="bg-surface pt-20 pb-10 sm:pt-24 sm:pb-12 overflow-hidden">
        <div className="container-x">
          <SectionHeading eyebrow={home.expertise.label} title={home.expertise.h2} accent={home.expertise.accent} desc={home.expertise.desc} />
          <ExpertiseFocusCarousel3D items={home.expertise.items} />
        </div>
      </section>

      {/* PORTFOLIO */}
      <section className="pt-6 pb-20 sm:pt-8 sm:pb-24">
        <div className="container-x">
          <SectionHeading eyebrow={home.portfolio.label} title={home.portfolio.h2} accent={home.portfolio.accent} desc={home.portfolio.desc} />
          <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {featured.map((p, i) => (
              <Reveal as="li" key={p.id} delay={(i % 4) * 60} className={i === 0 || i === 5 ? "col-span-2 row-span-2" : ""}>
                <Link href="/portfolio" className="group relative block h-full overflow-hidden rounded-2xl bg-surface">
                  <Image src={assetPath(p.src)} alt={p.alt} width={1920} height={1080} sizes="(min-width:1024px) 50vw, 100vw" className="aspect-[16/10] h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <span className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <span className="absolute bottom-3 left-3 translate-y-2 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-brand-700 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">3D Walkthrough</span>
                </Link>
              </Reveal>
            ))}
          </ul>
          <div className="mt-10 text-center"><ButtonLink href={home.portfolio.cta.href} variant="gradient" arrow>{home.portfolio.cta.label}</ButtonLink></div>
        </div>
      </section>

      {/* WHAT WE OFFER */}
      <section className="relative overflow-hidden bg-navy py-20 text-white sm:py-24">
        <div aria-hidden className="absolute inset-0 grid-lines" />
        <div className="container-x relative">
          <SectionHeading tone="light" eyebrow={home.offer.label} title={home.offer.h2} accent={home.offer.accent} />
          <ul className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {home.offer.items.map((it, i) => (
              <li key={it.title} className="bg-navy">
                <Link href={it.href} className="group flex h-full flex-col p-8 transition hover:bg-white/[0.04]">
                  <span className="text-5xl font-extrabold text-white/10 transition group-hover:text-white/25">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-4 text-xl font-bold !text-white">{it.title}</h3>
                  <p className="mt-2 flex-1 text-white/65">{it.text}</p>
                  <ArrowUpRight aria-hidden className="mt-5 size-5 text-[#E6007A] transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* TESTIMONIALS — rendered only once approved (contentApprovals.testimonials) */}
      {testimonials.length > 0 && (
        <section className="py-20 sm:py-24">
          <div className="container-x">
            <SectionHeading eyebrow={home.testimonials.label} title={home.testimonials.h2} accent={home.testimonials.accent} />
            <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t, i) => (
                <li key={i} className="rounded-3xl border border-line bg-white p-7 shadow-card">
                  <Quote aria-hidden className="size-7 text-[#E6007A]" />
                  <div className="mt-2 flex gap-0.5 text-amber-400" aria-label="5 star rating">{Array.from({ length: 5 }).map((_, j) => <Star key={j} aria-hidden className="size-4 fill-current" />)}</div>
                  <blockquote className="mt-3 leading-relaxed">“{t.quote}”</blockquote>
                  <p className="mt-5 font-bold text-ink">{t.author}</p><p className="text-sm text-muted">{t.role}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* CITIES */}
      <section className="py-20">
        <div className="container-x">
          <SectionHeading title="Top Cities We Serve" accent="Cities" />
          <ul className="mt-10 flex flex-wrap justify-center gap-2">
            {cities.map((c) => (
              <li key={c.slug}><Link href={c.href} className="inline-flex rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink-soft transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700">{c.name}</Link></li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

const WHY_ICONS = [Target, Layers, Lightbulb] as const;

function FeatureRow({ title, text, index }: { title: string; text: string; index: number }) {
  const Icon = WHY_ICONS[index % WHY_ICONS.length];
  return (
    <Reveal
      as="li"
      delay={index * 80}
      className="group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-white/15 bg-[#280146]/70 p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-[#d9f72e]/45 hover:bg-[#2f0252]/85"
    >
      <span
        aria-hidden
        className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#d9f72e] transition-colors duration-300 group-hover:bg-[#E6007A] group-hover:text-white"
      >
        <Icon className="size-5" />
      </span>
      <div>
        <h3 className="text-lg font-bold !text-white">{title}</h3>
        <p className="mt-1 text-[15px] leading-relaxed text-white/75">{text}</p>
      </div>
    </Reveal>
  );
}
