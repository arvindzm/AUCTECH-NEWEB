"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { mainNav } from "@/lib/navigation";
import { company } from "@/lib/site";
import { cn } from "@/lib/cn";
import { useQuoteModal } from "@/components/site/QuoteModal";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [svcOpen, setSvcOpen] = useState(false);
  const [mobileSvc, setMobileSvc] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { openQuote } = useQuoteModal();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => { setOpen(false); setSvcOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); setSvcOpen(false); } };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  const isActive = (href: string) => pathname === href;
  const svc = mainNav.find((n) => n.children)!;
  const svcActive = svc.children!.some((c) => c.href === pathname) || pathname === svc.href;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "pt-0 px-0" : "px-3 pt-3 sm:px-5"
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-brand-700"
      >
        Skip to content
      </a>
      <div
        className={cn(
          "mx-auto flex items-center justify-between gap-3 transition-all duration-300",
          scrolled
            ? "h-16 w-full max-w-full rounded-none border-x-0 border-t-0 border-b border-[#e7e0ee] bg-white/95 px-4 shadow-sm backdrop-blur-xl sm:px-8"
            : "h-[68px] max-w-[1320px] rounded-full border border-white/60 bg-white/85 pl-4 pr-2 shadow-card backdrop-blur-md sm:pl-6"
        )}
      >
        <Logo height={38} priority badge={false} />
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) =>
              item.children ? (
                <li
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => {
                    if (closeTimer.current) clearTimeout(closeTimer.current);
                    setSvcOpen(true);
                  }}
                  onMouseLeave={() => {
                    closeTimer.current = setTimeout(() => setSvcOpen(false), 150);
                  }}
                >
                  <div
                    className={cn(
                      "flex items-center rounded-full transition-colors",
                      svcActive
                        ? "bg-[#E6007A] text-white font-bold"
                        : "text-[#150024] hover:bg-black/5 hover:text-[#E6007A]"
                    )}
                  >
                    <Link href={item.href} className="py-2 pl-4 pr-1 text-sm font-semibold">
                      {item.label}
                    </Link>
                    <button
                      type="button"
                      aria-expanded={svcOpen}
                      aria-controls="svc-menu"
                      aria-label="Show services menu"
                      onClick={() => setSvcOpen((v) => !v)}
                      className="py-2 pl-1 pr-3"
                    >
                      <ChevronDown className={cn("size-4 transition-transform", svcOpen && "rotate-180")} />
                    </button>
                  </div>
                  <div
                    id="svc-menu"
                    className={cn(
                      "absolute left-1/2 top-full w-[560px] -translate-x-1/2 pt-3 transition-all duration-200",
                      svcOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
                    )}
                  >
                    <ul className="grid grid-cols-2 gap-1 rounded-3xl border border-line bg-white p-3 shadow-lift">
                      {item.children.map((c) => (
                        <li key={c.href}>
                          <Link
                            href={c.href}
                            className={cn(
                              "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-colors",
                              pathname === c.href
                                ? "bg-[#FDF2F8] text-[#E6007A] font-bold"
                                : "text-ink hover:bg-surface hover:text-[#E6007A]"
                            )}
                          >
                            <span aria-hidden className="size-1.5 rounded-full bg-[#E6007A]" />
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "block rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                      isActive(item.href)
                        ? "bg-[#E6007A] text-white font-bold"
                        : "text-[#150024] hover:bg-black/5 hover:text-[#E6007A]"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <a
            href={`tel:${company.phonePrimary.tel}`}
            aria-label={`Call ${company.phonePrimary.display}`}
            className="hidden size-11 items-center justify-center rounded-full border border-line text-[#E6007A] transition hover:bg-[#FDF2F8] sm:flex xl:hidden"
          >
            <Phone className="size-4" />
          </a>
          <a
            href={`tel:${company.phonePrimary.tel}`}
            className="hidden items-center gap-2 px-2 text-sm font-semibold text-[#150024] hover:text-[#E6007A] xl:flex"
          >
            <Phone className="size-4 text-[#E6007A]" />
            {company.phonePrimary.display}
          </a>
          <button
            type="button"
            onClick={openQuote}
            className="hidden h-12 items-center rounded-full bg-cta-gradient px-5 text-sm font-bold text-white transition hover:shadow-lift sm:inline-flex"
          >
            Get Free Consultation
          </button>
          <button
            type="button"
            className="flex size-12 items-center justify-center rounded-full bg-[#E6007A] text-white lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-nav"
        className={cn(
          "fixed inset-x-3 overflow-y-auto rounded-3xl border border-line bg-white/95 p-4 shadow-2xl backdrop-blur-xl transition-all duration-300 lg:hidden sm:inset-x-5",
          scrolled ? "top-[72px] bottom-3" : "top-[88px] bottom-3",
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
        )}
      >
        <nav aria-label="Mobile">
          <ul className="space-y-1">
            {mainNav.map((item) => (
              <li key={item.href}>
                {item.children ? (
                  <>
                    <div className="flex items-center justify-between rounded-2xl text-ink">
                      <Link href={item.href} className="flex-1 px-4 py-3 text-base font-semibold">
                        {item.label}
                      </Link>
                      <button
                        type="button"
                        className="p-3"
                        aria-expanded={mobileSvc}
                        aria-label="Toggle services"
                        onClick={() => setMobileSvc((v) => !v)}
                      >
                        <ChevronDown className={cn("size-5 transition-transform", mobileSvc && "rotate-180")} />
                      </button>
                    </div>
                    {mobileSvc && (
                      <ul className="mb-2 grid grid-cols-1 gap-1 rounded-2xl bg-surface p-2 sm:grid-cols-2">
                        {item.children.map((c) => (
                          <li key={c.href}>
                            <Link
                              href={c.href}
                              className={cn(
                                "block rounded-xl px-3 py-2.5 text-sm",
                                pathname === c.href
                                  ? "bg-[#E6007A] text-white font-bold"
                                  : "text-ink hover:bg-white"
                              )}
                            >
                              {c.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "block rounded-2xl px-4 py-3 text-base font-semibold",
                      isActive(item.href) ? "bg-[#E6007A] text-white font-bold" : "text-ink hover:bg-surface"
                    )}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-4 grid gap-2 border-t border-line pt-4">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              openQuote();
            }}
            className="h-12 rounded-full bg-cta-gradient font-bold text-white"
          >
            Get Free Consultation
          </button>
          <a
            href={`tel:${company.phonePrimary.tel}`}
            className="flex h-12 items-center justify-center gap-2 rounded-full border border-line font-semibold text-ink"
          >
            <Phone className="size-4 text-[#E6007A]" />
            {company.phonePrimary.display}
          </a>
        </div>
      </div>
    </header>
  );
}
