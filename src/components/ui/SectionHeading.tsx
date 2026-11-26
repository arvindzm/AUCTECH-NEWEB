import { cn } from "@/lib/cn";

/** Renders an original heading, applying the gradient to the original highlighted span text when present. */
export function AccentText({ text, accent, light }: { text: string; accent?: string; light?: boolean }) {
  if (!accent || !text.includes(accent)) return <>{text}</>;
  const i = text.indexOf(accent);
  return (
    <>
      {text.slice(0, i)}
      <span className={light ? "text-[#E6007A]" : "text-gradient border-b-2 border-[#E6007A]"}>{accent}</span>
      {text.slice(i + accent.length)}
    </>
  );
}

export function Eyebrow({ children, tone = "brand", className }: { children: React.ReactNode; tone?: "brand" | "light"; className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em]",
      tone === "brand" ? "text-ink" : "text-[#E6007A]", className)}>
      <span aria-hidden className="h-2 w-5 rounded-full bg-[#E6007A]" />
      {children}
    </span>
  );
}

export function SectionHeading({ eyebrow, title, accent, desc, align = "center", as: As = "h2", tone = "dark", className }: {
  eyebrow?: string; title: string; accent?: string; desc?: string; align?: "center" | "left"; as?: "h1" | "h2" | "h3";
  tone?: "dark" | "light"; className?: string;
}) {
  return (
    <div className={cn(align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl", className)}>
      {eyebrow && <Eyebrow tone={tone === "dark" ? "brand" : "light"}>{eyebrow}</Eyebrow>}
      <As className={cn("mt-3 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-[2.75rem]", tone === "light" && "!text-white")}>
        <AccentText text={title} accent={accent} light={tone === "light"} />
      </As>
      {desc && <p className={cn("mt-4 text-base leading-relaxed sm:text-lg", tone === "dark" ? "text-muted" : "text-white/75")}>{desc}</p>}
    </div>
  );
}
