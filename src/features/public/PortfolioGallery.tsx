"use client";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import type { PortfolioFilter, PortfolioItem } from "@/types/content";
import { assetPath } from "@/lib/site";
import { cn } from "@/lib/cn";

const PAGE = 12;

/** Gallery of original portfolio images. Only categories with items are offered; no titles/clients are invented. */
export function PortfolioGallery({ items, filters }: { items: PortfolioItem[]; filters: PortfolioFilter[] }) {
  const usable = filters.filter((f) => f.id === "all" || items.some((i) => i.category === f.id));
  const [cat, setCat] = useState("all");
  const [shown, setShown] = useState(PAGE);
  const [lb, setLb] = useState<number | null>(null);
  const list = useMemo(() => (cat === "all" ? items : items.filter((i) => i.category === cat)), [cat, items]);
  const labelOf = (id: string) => filters.find((f) => f.id === id)?.label ?? id;
  const count = (id: string) => (id === "all" ? items.length : items.filter((i) => i.category === id).length);

  const close = useCallback(() => setLb(null), []);
  const step = useCallback((d: number) => setLb((i) => (i === null ? i : (i + d + list.length) % list.length)), [list.length]);
  useEffect(() => {
    if (lb === null) return;
    document.body.style.overflow = "hidden";
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") close(); if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); };
    window.addEventListener("keydown", k);
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [lb, close, step]);

  return (
    <>
      <div role="group" aria-label="Filter portfolio" className="flex flex-wrap justify-center gap-2">
        {usable.map((f) => (
          <button key={f.id} type="button" aria-pressed={cat === f.id} onClick={() => { setCat(f.id); setShown(PAGE); }}
            className={cn("inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition",
              cat === f.id ? "border-transparent bg-brand-gradient text-white shadow-lift" : "border-line bg-white text-ink-soft hover:border-brand-300 hover:text-brand-700")}>
            {f.label}<span className={cn("rounded-full px-2 py-0.5 text-xs", cat === f.id ? "bg-white/20" : "bg-surface")}>{count(f.id)}</span>
          </button>
        ))}
      </div>
      <p className="mt-4 text-center text-sm text-muted" aria-live="polite">Showing {Math.min(shown, list.length)} of {list.length} projects</p>
      <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.slice(0, shown).map((it, i) => (
          <li key={it.id}>
            <button type="button" onClick={() => setLb(i)} aria-label={`Open image: ${it.alt}`}
              className="group relative block w-full overflow-hidden rounded-2xl bg-surface text-left">
              <Image src={assetPath(it.src)} alt={it.alt} width={1920} height={1080} sizes="(min-width:1024px) 400px, (min-width:640px) 50vw, 100vw"
                className={cn("w-full object-cover transition-transform duration-700 group-hover:scale-105", it.category === "floor-plan" ? "aspect-[4/3] bg-white object-contain" : "aspect-[16/10]")} />
              <span className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-navy/75 via-navy/0 p-4 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-brand-700">{labelOf(it.category)}</span>
                <span className="flex size-9 items-center justify-center rounded-full bg-white/90 text-brand-700"><Expand aria-hidden className="size-4" /></span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      {shown < list.length && (
        <div className="mt-10 text-center">
          <button type="button" onClick={() => setShown((s) => s + PAGE)} className="h-12 rounded-full border border-brand-200 bg-white px-7 font-semibold text-brand-700 transition hover:bg-brand-50">Load More</button>
        </div>
      )}

      {lb !== null && list[lb] && (
        <div role="dialog" aria-modal="true" aria-label="Image viewer" className="fixed inset-0 z-[80] flex items-center justify-center bg-navy/95 p-4" onClick={close}>
          <button type="button" autoFocus onClick={close} aria-label="Close viewer" className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"><X /></button>
          <button type="button" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous image" className="absolute left-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6"><ChevronLeft /></button>
          <figure className="max-h-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
            <Image src={assetPath(list[lb].src)} alt={list[lb].alt} width={1920} height={1080} sizes="90vw" className="max-h-[80vh] w-auto rounded-xl object-contain" />
            <figcaption className="mt-3 text-center text-sm text-white/70">{labelOf(list[lb].category)} · {lb + 1} / {list.length}</figcaption>
          </figure>
          <button type="button" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next image" className="absolute right-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6"><ChevronRight /></button>
        </div>
      )}
    </>
  );
}
