"use client";
import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import type { FaqCategory, FaqLibraryItem } from "@/types/content";
import { cn } from "@/lib/cn";

export function FaqLibrary({ items, categories }: { items: FaqLibraryItem[]; categories: FaqCategory[] }) {
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return items.filter((i) => (cat === "all" || i.category === cat) && (!term || `${i.q} ${i.a}`.toLowerCase().includes(term)));
  }, [items, cat, q]);
  const count = (id: string) => (id === "all" ? items.length : items.filter((i) => i.category === id).length);

  return (
    <div>
      <div className="relative mx-auto max-w-2xl">
        <label htmlFor="faq-search" className="sr-only">Search FAQs</label>
        <Search aria-hidden className="absolute left-5 top-1/2 size-5 -translate-y-1/2 text-muted" />
        <input id="faq-search" type="search" value={q} onChange={(e) => { setQ(e.target.value); }} placeholder="Search questions, e.g. “3D walkthrough cost”"
          className="h-14 w-full rounded-full border border-line bg-white pl-13 pr-12 text-[15px] shadow-card focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100" />
        {q && <button type="button" onClick={() => setQ("")} aria-label="Clear search" className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full hover:bg-surface"><X className="size-4" /></button>}
      </div>
      <div role="group" aria-label="Filter by topic" className="mt-6 flex flex-wrap justify-center gap-2">
        {categories.map((c) => (
          <button key={c.id} type="button" aria-pressed={cat === c.id} onClick={() => { setCat(c.id); }}
            className={cn("rounded-full border px-4 py-2 text-sm font-semibold transition",
              cat === c.id ? "border-transparent bg-brand-700 text-white" : "border-line bg-white text-ink-soft hover:border-brand-300 hover:text-brand-700")}>
            {c.label} <span className="opacity-70">({count(c.id)})</span>
          </button>
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-muted" aria-live="polite">{filtered.length} {filtered.length === 1 ? "question" : "questions"} found</p>
      <div className="mx-auto mt-6 max-w-3xl">
        {filtered.length ? (
          <FaqAccordion key={`${cat}-${q}`} items={filtered} defaultOpen={null} />
        ) : (
          <div className="rounded-3xl border border-dashed border-line bg-surface p-10 text-center">
            <p className="text-lg font-bold text-ink">No matching questions</p>
            <p className="mt-1 text-muted">Try a different keyword or topic.</p>
            <button type="button" onClick={() => { setQ(""); setCat("all"); }} className="mt-4 font-semibold text-brand-700 underline">Reset filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
