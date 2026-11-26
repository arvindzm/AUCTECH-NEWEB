import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "gradient" | "outline" | "ghost" | "light" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-60 whitespace-nowrap";
const variants: Record<Variant, string> = {
  primary: "bg-[#141414] text-white hover:bg-[#E2E800] hover:text-[#141414] hover:border-[#E2E800] border border-[#141414] shadow-card",
  gradient: "bg-cta-gradient text-[#141414] font-bold hover:shadow-lift hover:-translate-y-0.5",
  outline: "border border-[#141414] text-[#141414] bg-white hover:bg-[#E2E800] hover:text-[#141414] hover:border-[#E2E800]",
  ghost: "text-[#141414] hover:bg-surface hover:text-[#141414]",
  light: "bg-white text-[#141414] hover:bg-[#E2E800] hover:text-[#141414] shadow-card",
  danger: "bg-red-600 text-white hover:bg-red-700",
};
const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-[15px]",
  lg: "h-13 px-7 text-base py-3.5",
};

interface Common { variant?: Variant; size?: Size; arrow?: boolean; className?: string; children: React.ReactNode }

export function ButtonLink({ href, variant = "primary", size = "md", arrow, className, children, external, ...rest }:
  Common & { href: string; external?: boolean } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const cls = cn(base, variants[variant], sizes[size], className);
  const inner = (
    <>
      {children}
      {arrow && <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}
    </>
  );
  if (external || /^(https?:|tel:|mailto:)/.test(href))
    return <a href={href} className={cls} {...rest} {...(/^https?:/.test(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{inner}</a>;
  return <Link href={href} className={cls} {...rest}>{inner}</Link>;
}

export function Button({ variant = "primary", size = "md", arrow, className, children, loading, ...rest }:
  Common & { loading?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} disabled={loading || rest.disabled} aria-busy={loading || undefined} {...rest}>
      {loading && <span aria-hidden className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />}
      {children}
      {arrow && !loading && <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}
    </button>
  );
}
