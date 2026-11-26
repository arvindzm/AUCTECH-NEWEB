import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { services } from "@/lib/content";

export default function NotFound() {
  return (
    <section className="hero-mesh relative overflow-hidden pb-24 pt-40 text-white">
      <div aria-hidden className="absolute inset-0 grid-lines" />
      <div className="container-x relative max-w-3xl text-center">
        <p className="text-7xl font-extrabold text-white/20 sm:text-9xl">404</p>
        <h1 className="mt-2 text-3xl font-extrabold !text-white sm:text-5xl">Page not found</h1>
        <p className="mt-4 text-lg text-white/75">The page you&apos;re looking for doesn&apos;t exist or hasn&apos;t been published yet.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3"><ButtonLink href="/" variant="light" arrow>Back to Home</ButtonLink><ButtonLink href="/contact" variant="gradient">Contact Us</ButtonLink></div>
        <ul className="mt-10 flex flex-wrap justify-center gap-2">
          {services.map((s) => <li key={s.key}><Link href={s.href} className="inline-flex rounded-full border border-white/20 px-4 py-2 text-sm text-white/80 hover:bg-white/10">{s.navLabel}</Link></li>)}
        </ul>
      </div>
    </section>
  );
}
