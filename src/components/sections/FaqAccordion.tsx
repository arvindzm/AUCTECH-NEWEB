"use client";
import { useId, useState } from "react";
import { Plus } from "lucide-react";
import type { FaqItem } from "@/types/content";
import { cn } from "@/lib/cn";

export function FaqAccordion({ items, defaultOpen = 0, headingLevel = "h3" }: { items: FaqItem[]; defaultOpen?: number | null; headingLevel?: "h3" | "h4" }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const base = useId();
  const H = headingLevel;
  return (
    <div className="space-y-3">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className={cn("overflow-hidden rounded-2xl border bg-white transition-colors", isOpen ? "border-brand-200 shadow-card" : "border-line")}>
            <H className="text-base">
              <button type="button" id={`${base}-q${i}`} aria-expanded={isOpen} aria-controls={`${base}-a${i}`} onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-bold text-ink transition hover:text-brand-700 sm:px-6">
                <span>{it.q}</span>
                <span aria-hidden className={cn("flex size-8 shrink-0 items-center justify-center rounded-full transition", isOpen ? "rotate-45 bg-brand-gradient text-white" : "bg-surface text-brand-700")}>
                  <Plus className="size-4" />
                </span>
              </button>
            </H>
            <div id={`${base}-a${i}`} role="region" aria-labelledby={`${base}-q${i}`} hidden={!isOpen}
              className="px-5 pb-5 leading-relaxed text-muted sm:px-6">{it.a}</div>
          </div>
        );
      })}
    </div>
  );
}
