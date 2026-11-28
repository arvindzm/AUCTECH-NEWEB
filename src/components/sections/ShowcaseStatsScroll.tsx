"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check } from "lucide-react";
import { AccentText, Eyebrow } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";
import type { Stat } from "@/types/content";

interface ShowcaseData {
  label: string;
  h2: string;
  accent: string;
  text: string;
  bullets: readonly string[];
}

interface ShowcaseStatsScrollProps {
  showcase: ShowcaseData;
  stats: readonly Stat[];
}

function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Displays the Showcase section and StatsBand in a stable stacked layout (no fade effect),
 * driving the 0 -> target number counters strictly from the user's scroll position.
 */
export function ShowcaseStatsScroll({ showcase, stats }: ShowcaseStatsScrollProps) {
  const statsWrapRef = useRef<HTMLDivElement>(null);
  const statValueRefs = useRef<(HTMLElement | null)[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);

  const targets = useMemo(
    () =>
      stats.map((s) => {
        const parsed = Number.parseInt(s.value.replace(/[^0-9]/g, ""), 10);
        return Number.isNaN(parsed) ? 0 : parsed;
      }),
    [stats]
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      for (let i = 0; i < targets.length; i++) {
        const node = statValueRefs.current[i];
        if (node) node.textContent = String(targets[i]);
      }
      return;
    }

    let rafId: number | null = null;

    const applyProgress = () => {
      rafId = null;
      const statsEl = statsWrapRef.current;
      if (!statsEl) return;

      const rect = statsEl.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // Count up from 0 -> final as StatsBand moves into upper-middle viewport
      const startY = vh * 0.95;
      const endY = vh * 0.45;
      const raw = clamp01((startY - rect.top) / Math.max(1, startY - endY));
      const ratio = raw >= 1 ? 1 : easeOutCubic(raw);

      for (let i = 0; i < targets.length; i++) {
        const node = statValueRefs.current[i];
        if (!node) continue;
        const target = targets[i];
        const nextVal = raw >= 1 ? target : Math.round(target * ratio);
        const formatted = String(nextVal);
        if (node.textContent !== formatted) {
          node.textContent = formatted;
        }
      }
    };

    const scheduleUpdate = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(applyProgress);
    };

    applyProgress();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [reducedMotion, targets]);

  return (
    <>
      <section className="pt-20 pb-8 sm:pt-24 sm:pb-10">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:items-end">
          <div>
            <Eyebrow>{showcase.label}</Eyebrow>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
              <AccentText text={showcase.h2} accent={showcase.accent} />
            </h2>
          </div>
          <p className="text-lg leading-relaxed">{showcase.text}</p>
        </div>
        <div className="container-x mt-10">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {showcase.bullets.map((b) => (
              <li
                key={b}
                className="flex items-center gap-3 rounded-2xl border border-line bg-white p-5 font-semibold text-ink shadow-card"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#E6007A] text-white">
                  <Check aria-hidden className="size-4" />
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div ref={statsWrapRef} aria-label="Key figures" className="container-x">
        <dl className="grid grid-cols-2 overflow-hidden rounded-[2rem] bg-brand-gradient text-white lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={cn(
                "flex flex-col items-center justify-center border-white/15 px-4 py-8 text-center",
                i % 2 === 1 && "border-l",
                i >= 2 && "border-t lg:border-t-0",
                i > 0 && "lg:border-l"
              )}
            >
              <dt className="order-2 mt-1 text-sm font-medium text-white/80">{s.label}</dt>
              <dd
                ref={(el) => {
                  statValueRefs.current[i] = el;
                }}
                className="order-1 text-3xl font-extrabold tabular-nums text-[#E6007A] sm:text-4xl"
              >
                {reducedMotion ? s.value : "0"}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </>
  );
}
