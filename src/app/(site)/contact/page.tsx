import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { OpenStatus } from "@/components/site/OpenStatus";
import { SocialIcon } from "@/components/site/SocialIcon";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { corePages } from "@/content/core-pages";
import { getCoreMeta } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { company } from "@/lib/site";

export const metadata: Metadata = buildMetadata({ path: "/contact", source: getCoreMeta("contact") });

export default function ContactPage() {
  const c = corePages.contact;
  const cards = [
    { icon: MapPin, title: "Our Office", body: <p>{company.officeDisplay}</p> },
    { icon: Phone, title: "Call / WhatsApp", body: <a className="font-semibold text-brand-700 hover:underline" href={`tel:${company.phonePrimary.tel}`}>{company.phonePrimary.display}</a> },
    { icon: Mail, title: "Email Us", body: <><a className="break-all font-semibold text-brand-700 hover:underline" href={`mailto:${company.email}`}>{company.email}</a><p className="mt-1 text-sm text-muted">We reply within 24 hours</p></> },
  ];
  return (
    <>
      <PageHero {...c.hero} title={c.hero.h1} crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      <section className="relative z-10 -mt-10">
        <ul className="container-x grid gap-4 md:grid-cols-3">
          {cards.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex gap-4 rounded-3xl border border-line bg-white p-6 shadow-card">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-gradient text-white"><Icon aria-hidden className="size-5" /></span>
              <div className="min-w-0"><h2 className="text-base font-bold">{title}</h2><div className="mt-1">{body}</div></div>
            </li>
          ))}
        </ul>
      </section>
      <section className="py-16 sm:py-20">
        <div className="container-x grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-[2rem] border border-line bg-white p-6 shadow-card sm:p-10">
            <Eyebrow>{c.formLabel}</Eyebrow>
            <h2 className="mt-3 text-3xl font-extrabold">{c.formTitle}</h2>
            <p className="mt-2 text-muted">{c.formSub}</p>
            <div className="mt-8"><ContactForm /></div>
          </div>
          <aside className="space-y-6">
            <div className="rounded-[2rem] bg-navy p-7 text-white">
              <div className="flex items-center justify-between gap-3"><h2 className="flex items-center gap-2 text-lg font-bold !text-white"><Clock aria-hidden className="size-5 text-brand-300" />Working Hours</h2><OpenStatus /></div>
              <dl className="mt-5 divide-y divide-white/10">
                {company.hours.map((h) => <div key={h.days} className="flex justify-between gap-4 py-3 text-sm"><dt className="text-white/70">{h.days}</dt><dd className="font-semibold">{h.time}</dd></div>)}
              </dl>
            </div>
            <div className="rounded-[2rem] border border-line bg-white p-7 shadow-card">
              <h2 className="text-lg font-bold">Follow Us</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {company.social.map((s) => (
                  <li key={s.key}><a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="flex size-11 items-center justify-center rounded-full bg-surface text-brand-700 transition hover:bg-brand-gradient hover:text-white"><SocialIcon name={s.key} /></a></li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
