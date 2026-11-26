import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, Quote, Star } from "lucide-react";
import { home } from "@/content/home";
import { ButtonLink } from "@/components/ui/Button";
import { AccentText, Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { FeatureCard, StatsBand } from "@/components/sections/Blocks";
import { allTestimonials, cities, portfolioItems } from "@/lib/content";
import { assetPath, contentApprovals } from "@/lib/site";

export function HomePage() {
  const featured = portfolioItems.filter((p) => p.category === "3d-walkthrough").slice(0, 8);
  const testimonials = contentApprovals.testimonials ? allTestimonials.filter((t) => t.status === "approved") : [];
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden hero-mesh pb-24 pt-36 text-white sm:pt-44 lg:pb-32">
        <div aria-hidden className="absolute inset-0 grid-lines" />
        <div aria-hidden className="absolute -bottom-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-[#E2E800]/15 blur-3xl" />
        <div className="container-x relative grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-semibold backdrop-blur">
              <span className="size-2 rounded-full bg-[#E2E800]" aria-hidden />{home.showcase.label}
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.06] !text-white sm:text-5xl xl:text-[4rem]">
              <AccentText text={home.hero.h1} accent={home.hero.accent} light />
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">{home.hero.sub}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href={home.hero.primary.href} variant="gradient" size="lg" arrow>{home.hero.primary.label}</ButtonLink>
              <ButtonLink href={home.hero.secondary.href} variant="light" size="lg">{home.hero.secondary.label}</ButtonLink>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div aria-hidden className="absolute -inset-6 rounded-[2.5rem] border border-white/15" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/20 shadow-2xl">
              <Image src={assetPath(home.showcase.image.src)} alt={home.showcase.image.alt} width={640} height={640} priority sizes="(min-width:1024px) 520px, 90vw" className="h-auto w-full" />
            </div>
            <div className="absolute -bottom-6 left-3 rounded-2xl bg-white px-5 py-4 text-ink shadow-lift sm:-left-8">
              <p className="text-2xl font-extrabold text-gradient">{home.showcase.badge}</p>
              <p className="text-xs font-semibold text-muted">3D Walkthrough Company</p>
            </div>
          </div>
        </div>
      </section>

      {/* SHOWCASE */}
      <section className="py-20 sm:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:items-end">
          <Reveal>
            <Eyebrow>{home.showcase.label}</Eyebrow>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl"><AccentText text={home.showcase.h2} accent={home.showcase.accent} /></h2>
          </Reveal>
          <Reveal><p className="text-lg leading-relaxed">{home.showcase.text}</p></Reveal>
        </div>
        <div className="container-x mt-10">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {home.showcase.bullets.map((b, i) => (
              <Reveal as="li" key={b} delay={i * 70} className="flex items-center gap-3 rounded-2xl border border-line bg-white p-5 font-semibold text-ink shadow-card">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#E2E800] text-[#141414]"><Check aria-hidden className="size-4" /></span>{b}
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <StatsBand stats={home.stats} tone="dark" />

      {/* ABOUT */}
      <section className="py-20 sm:py-28">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <Reveal className="relative">
            <div className="overflow-hidden rounded-[2rem] shadow-card">
              <Image src={assetPath(home.about.image.src)} alt={home.about.image.alt} width={817} height={768} sizes="(min-width:1024px) 560px, 100vw" className="h-auto w-full" />
            </div>
            <div className="absolute -bottom-6 right-6 rounded-2xl border border-[#E2E800]/30 bg-[#141414] px-6 py-5 text-white shadow-lift">
              <p className="text-4xl font-extrabold text-[#E2E800]">{home.about.exp.value}</p><p className="text-sm text-white/85">{home.about.exp.label}</p>
            </div>
          </Reveal>
          <Reveal>
            <Eyebrow>{home.about.label}</Eyebrow>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl"><AccentText text={home.about.h2} accent={home.about.accent} /></h2>
            <div className="mt-5 space-y-4 text-[17px] leading-relaxed">{home.about.paras.map((p) => <p key={p}>{p}</p>)}</div>
            <ul className="mt-6 grid gap-3 sm:grid-cols-3">
              {home.about.points.map((p) => <li key={p} className="flex items-start gap-2 text-sm font-semibold text-ink"><Check aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-600" />{p}</li>)}
            </ul>
            <ButtonLink href={home.about.cta.href} className="mt-8" arrow>{home.about.cta.label}</ButtonLink>
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
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {home.services.items.map((s, i) => (
              <Reveal as="li" key={s.title} delay={(i % 3) * 80}>
                <Link href={s.href} className="group flex h-full flex-col rounded-3xl border border-line bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift">
                  <span className="text-sm font-bold text-brand-600">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-3 text-xl font-bold group-hover:text-brand-700">{s.title}</h3>
                  <p className="mt-2.5 flex-1 leading-relaxed text-muted">{s.text}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-700">{s.cta}
                    <span className="flex size-8 items-center justify-center rounded-full bg-brand-50 transition group-hover:bg-brand-gradient group-hover:text-white"><ArrowUpRight aria-hidden className="size-4" /></span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* WHY */}
      <section className="py-20 sm:py-28">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <Reveal className="order-2 lg:order-1">
            <Eyebrow>{home.why.label}</Eyebrow>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl"><AccentText text={home.why.h2} accent={home.why.accent} /></h2>
            <p className="mt-5 text-[17px] leading-relaxed">{home.why.text}</p>
            <ul className="mt-8 space-y-4">
              {home.why.items.map((it, i) => <FeatureRow key={it.title} index={i} {...it} />)}
            </ul>
          </Reveal>
          <Reveal className="order-1 overflow-hidden rounded-[2rem] shadow-card lg:order-2">
            <Image src={assetPath(home.why.image.src)} alt={home.why.image.alt} width={900} height={900} sizes="(min-width:1024px) 560px, 100vw" className="h-auto w-full object-cover" />
          </Reveal>
        </div>
      </section>

      {/* EXPERTISE */}
      <section className="bg-surface py-20 sm:py-24">
        <div className="container-x">
          <SectionHeading eyebrow={home.expertise.label} title={home.expertise.h2} accent={home.expertise.accent} desc={home.expertise.desc} />
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {home.expertise.items.map((it, i) => (
              <Reveal as="li" key={it.title} delay={(i % 3) * 80} className="rounded-3xl border border-line bg-white p-7 shadow-card">
                <div className="flex items-start justify-between gap-4"><h3 className="text-xl font-bold">{it.title}</h3><span className="text-2xl font-extrabold text-gradient">{it.value}%</span></div>
                <p className="mt-2 text-muted">{it.text}</p>
                <div className="mt-5 flex justify-between text-xs font-semibold text-muted"><span>{it.metric}</span><span>{it.value}%</span></div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100" role="presentation"><div className="h-full rounded-full bg-[#E2E800]" style={{ width: `${it.value}%` }} /></div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section className="py-20 sm:py-24">
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
                  <ArrowUpRight aria-hidden className="mt-5 size-5 text-[#E2E800] transition group-hover:translate-x-1 group-hover:-translate-y-1" />
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
                  <Quote aria-hidden className="size-7 text-[#E2E800]" />
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

function FeatureRow({ title, text, index }: { title: string; text: string; index: number }) {
  return <FeatureCard card={{ title, text }} index={index + 6} />;
}
