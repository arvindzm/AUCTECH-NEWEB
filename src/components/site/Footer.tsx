import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { SocialIcon } from "@/components/site/SocialIcon";
import { footerCityLinks, footerQuickLinks, footerServiceLinks } from "@/lib/navigation";
import { company } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-navy text-white/70">
      <div aria-hidden className="pointer-events-none absolute inset-0 grid-lines opacity-60" />
      <div className="container-x relative">
        {/* CTA band */}
        <div className="relative -mb-px flex flex-col items-start justify-between gap-6 overflow-hidden rounded-b-[2rem] bg-brand-gradient px-6 py-10 sm:px-10 lg:flex-row lg:items-center">
          <div aria-hidden className="absolute -right-20 -top-24 size-72 rounded-full bg-white/10 blur-2xl" />
          <div className="relative max-w-2xl">
            <h2 className="text-2xl font-extrabold !text-white sm:text-3xl">{company.footerCta.title}</h2>
            <p className="mt-2 text-white/80">{company.footerCta.text}</p>
          </div>
          <a href={`tel:${company.phonePrimary.tel}`} className="relative inline-flex h-14 items-center gap-3 rounded-full bg-[#E2E800] px-6 font-bold text-[#141414] transition hover:-translate-y-0.5 hover:shadow-lift">
            <Phone aria-hidden className="size-5 text-[#141414]" />{company.phonePrimary.display}
          </a>
        </div>

        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo height={56} />
            <p className="mt-5 max-w-sm leading-relaxed">{company.tagline}</p>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Social media">
              {company.social.map((s) => (
                <li key={s.key}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                    className="flex size-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition hover:border-transparent hover:bg-[#E2E800] hover:text-[#141414]">
                    <SocialIcon name={s.key} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <FooterCol title="Quick Links" className="lg:col-span-2" links={footerQuickLinks} />
          <FooterCol title="Our Services" className="lg:col-span-3" links={footerServiceLinks} />
          <div className="lg:col-span-3">
            <h3 className="text-sm font-bold uppercase tracking-widest !text-white">Contact Info</h3>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex gap-3"><MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-[#E2E800]" />{company.officeDisplay}</li>
              <li><a className="flex gap-3 hover:text-white" href={`tel:${company.phonePrimary.tel}`}><Phone aria-hidden className="mt-0.5 size-4 shrink-0 text-[#E2E800]" />{company.phonePrimary.display}</a></li>
              <li><a className="flex gap-3 break-all hover:text-white" href={`mailto:${company.email}`}><Mail aria-hidden className="mt-0.5 size-4 shrink-0 text-[#E2E800]" />{company.email}</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 py-10">
          <h3 className="text-sm font-bold uppercase tracking-widest !text-white">Top Cities We Serve</h3>
          <ul className="mt-5 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
            {footerCityLinks.map((c) => <li key={c.href}><Link className="transition hover:text-white" href={c.href}>{c.label}</Link></li>)}
          </ul>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {company.legalName} All Rights Reserved.</p>
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <li><a className="hover:text-white" href="/sitemap.xml">Sitemap</a></li>
            <li><Link className="hover:text-white" href="/privacy-policy">Privacy Policy</Link></li>
            <li><Link className="hover:text-white" href="/contact">Contact</Link></li>
            <li><Link className="hover:text-white" href="/faq">FAQ</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links, className }: { title: string; links: { label: string; href: string }[]; className?: string }) {
  return (
    <div className={className}>
      <h3 className="text-sm font-bold uppercase tracking-widest !text-white">{title}</h3>
      <ul className="mt-5 space-y-2.5 text-sm">
        {links.map((l) => <li key={l.href}><Link className="transition hover:text-white" href={l.href}>{l.label}</Link></li>)}
      </ul>
    </div>
  );
}
