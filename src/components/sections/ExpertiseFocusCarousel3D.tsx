"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Box,
  TrendingUp,
  Code2,
  Cpu,
  Palette,
  Video,
} from "lucide-react";
import { assetPath } from "@/lib/site";

export interface ExpertiseItem {
  title: string;
  text: string;
  metric: string;
  value: number;
}

interface ExpertiseFocusCarousel3DProps {
  items: ExpertiseItem[];
}

// Authentic high-definition service metadata with razor-sharp images
const ITEM_META: Record<
  string,
  {
    href: string;
    tag: string;
    image: string;
    icon: React.ElementType;
    badgeColor: string;
  }
> = {
  "3D Walkthroughs": {
    href: "/3d-architectural-walkthrough-in-lucknow",
    tag: "SPATIAL 3D",
    image: "brand/service-3d-hd.webp",
    icon: Box,
    badgeColor: "from-fuchsia-600 to-pink-500",
  },
  "Digital Marketing": {
    href: "/best-digital-marketing-agency-in-lucknow",
    tag: "ROI & SEO",
    image: "brand/service-dm-hd.webp",
    icon: TrendingUp,
    badgeColor: "from-blue-600 to-indigo-600",
  },
  "Web Development": {
    href: "/best-web-development-company-in-lucknow",
    tag: "FULL-STACK",
    image: "brand/service-web-hd.webp",
    icon: Code2,
    badgeColor: "from-emerald-600 to-teal-600",
  },
  "Software Solutions": {
    href: "/best-software-development-company-in-lucknow",
    tag: "ENTERPRISE",
    image: "brand/service-soft-hd.webp",
    icon: Cpu,
    badgeColor: "from-purple-600 to-violet-700",
  },
  "Graphic Design": {
    href: "/best-graphic-designing-company-in-lucknow",
    tag: "CREATIVE UI",
    image: "brand/service-design-hd.webp",
    icon: Palette,
    badgeColor: "from-rose-500 to-amber-500",
  },
  "Video Editing": {
    href: "/best-video-editing-in-lucknow",
    tag: "4K CINEMATIC",
    image: "brand/service-video-hd.webp",
    icon: Video,
    badgeColor: "from-pink-600 to-red-600",
  },
};

export function ExpertiseFocusCarousel3D({ items }: ExpertiseFocusCarousel3DProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Touch gesture state
  const touchStartX = useRef<number | null>(null);
  const touchCurrentX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const total = items.length;

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Autoplay pausing on user hover/interaction
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, handleNext]);

  // Touch Swipe Handlers for mobile & tablet
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
    touchCurrentX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchCurrentX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchCurrentX.current !== null) {
      const deltaX = touchCurrentX.current - touchStartX.current;
      if (deltaX > 35) {
        handlePrev();
      } else if (deltaX < -35) {
        handleNext();
      }
    }
    touchStartX.current = null;
    touchCurrentX.current = null;
    setTimeout(() => setIsPaused(false), 4000);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      handlePrev();
    } else if (e.key === "ArrowRight") {
      handleNext();
    }
  };

  // Compute styling for card based on cyclic signed distance
  const getCardStyle = (index: number) => {
    let diff = index - activeIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    let scale = 0.65;
    let blurPx = 8;
    let opacity = 0;
    let zIndex = 1;
    let pointerEvents: "auto" | "none" = "none";

    if (diff === 0) {
      // CENTER ACTIVE CARD: 100% Sharp, razor-clear, visually dominant, top z-index
      scale = 1.0;
      blurPx = 0;
      opacity = 1;
      zIndex = 50;
      pointerEvents = "auto";
    } else if (Math.abs(diff) === 1) {
      // IMMEDIATE NEIGHBORS: Slightly smaller, softly blurred
      scale = 0.86;
      blurPx = 3.5;
      opacity = 0.55;
      zIndex = 20;
      pointerEvents = "auto";
    } else if (Math.abs(diff) === 2) {
      // OUTER CARDS: Distant depth cues
      scale = 0.74;
      blurPx = 7;
      opacity = 0.25;
      zIndex = 10;
      pointerEvents = "auto";
    }

    return {
      diff,
      style: {
        transform: `translate(-50%, -50%) translateX(calc(${diff} * var(--carousel-step, 310px))) scale(${scale})`,
        filter: blurPx > 0 ? `blur(${blurPx}px)` : "none",
        opacity,
        zIndex,
        pointerEvents,
        willChange: Math.abs(diff) <= 1 ? "transform, filter, opacity" : "auto",
      },
    };
  };

  return (
    <div
      ref={containerRef}
      className="carousel-focus-root relative mt-6 sm:mt-10 w-full select-none outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="Expertise 3D Focus Carousel"
    >
      <style>{`
        .carousel-focus-root {
          --carousel-step: 180px;
        }
        @media (min-width: 640px) {
          .carousel-focus-root {
            --carousel-step: 255px;
          }
        }
        @media (min-width: 1024px) {
          .carousel-focus-root {
            --carousel-step: 325px;
          }
        }
      `}</style>

      {/* CAROUSEL STAGE (Clean Stacking Context for Crisp Cards) */}
      <div
        className="relative mx-auto flex h-[460px] sm:h-[490px] w-full max-w-6xl items-center justify-center overflow-hidden py-3"
      >
        {items.map((it, i) => {
          const { diff, style } = getCardStyle(i);
          const meta = ITEM_META[it.title] || {
            href: "/service",
            tag: "EXPERTISE",
            image: "img/feature.jpeg",
            icon: Box,
            badgeColor: "from-[#E6007A] to-purple-600",
          };
          const Icon = meta.icon;
          const isActive = i === activeIndex;

          return (
            <div
              key={it.title}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${total}: ${it.title}`}
              aria-hidden={!isActive}
              onClick={() => {
                if (!isActive) setActiveIndex(i);
              }}
              style={style}
              className={`absolute top-1/2 left-1/2 w-[260px] sm:w-[310px] lg:w-[345px] transition-all duration-500 ease-out cursor-pointer rounded-3xl border overflow-hidden bg-white text-left ${
                Math.abs(diff) >= 2 ? "hidden sm:block" : ""
              } ${
                isActive
                  ? "border-[#E6007A] shadow-[0_20px_50px_-12px_rgba(230,0,122,0.3),0_10px_25px_-8px_rgba(21,0,36,0.15)] ring-2 ring-[#E6007A]/30"
                  : "border-slate-200/80 shadow-md hover:border-slate-300"
              }`}
            >
              {/* CARD IMAGE PREVIEW (Crystal Clear Unfiltered 16:9 Banner) */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-slate-900">
                <Image
                  src={assetPath(meta.image)}
                  alt={it.title}
                  width={600}
                  height={375}
                  priority={i === 0}
                  unoptimized={true}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                />

                {/* Floating Category Tag */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded-full bg-black/65 px-2.5 py-1 backdrop-blur-md border border-white/20">
                  <span
                    className={`flex h-4.5 w-4.5 items-center justify-center rounded-full bg-gradient-to-br ${meta.badgeColor} text-white shadow-xs`}
                  >
                    <Icon className="h-2.5 w-2.5" />
                  </span>
                  <span className="text-[10px] font-extrabold tracking-wider text-white uppercase">
                    {meta.tag}
                  </span>
                </div>

                {/* Floating Metric Pill */}
                <div className="absolute top-2.5 right-2.5 rounded-full bg-[#E6007A] px-2.5 py-0.5 font-black text-white shadow-md text-[11px]">
                  {it.value}% Success
                </div>
              </div>

              {/* CARD BODY CONTENT: Crisp, High-Contrast Typography */}
              <div className="p-4 sm:p-5 bg-white">
                <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-[#150024]">
                  {it.title}
                </h3>
                <p className="mt-1.5 text-xs sm:text-[0.85rem] leading-relaxed text-slate-600 line-clamp-2 font-normal">
                  {it.text}
                </p>

                {/* METRIC PROGRESS BAR */}
                <div className="mt-3.5 border-t border-slate-100 pt-3">
                  <div className="flex justify-between text-[11px] font-bold text-slate-600">
                    <span>{it.metric}</span>
                    <span className="text-[#150024] font-black">{it.value}%</span>
                  </div>
                  <div
                    className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100"
                    role="presentation"
                  >
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#E6007A] to-purple-600 transition-all duration-700"
                      style={{ width: `${it.value}%` }}
                    />
                  </div>
                </div>

                {/* ACTION CTA BUTTON */}
                <div className="mt-4 flex items-center justify-between pt-1">
                  <Link
                    href={meta.href}
                    className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-black shadow-sm transition-all ${
                      isActive
                        ? "bg-[#E6007A] text-white shadow-[#E6007A]/25 hover:bg-[#c40068] hover:shadow-md active:scale-95"
                        : "bg-slate-100 text-slate-400 pointer-events-none"
                    }`}
                    tabIndex={isActive ? 0 : -1}
                  >
                    <span>Explore Service</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                  <span className="text-[11px] font-bold text-slate-400">
                    {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DESKTOP/TABLET CIRCULAR SIDE ARROWS */}
      <div className="pointer-events-none absolute inset-y-0 left-2 right-2 hidden sm:flex items-center justify-between lg:-left-6 lg:-right-6">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous service card"
          className="pointer-events-auto flex h-11 w-11 lg:h-12 lg:w-12 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-[#150024] shadow-xl backdrop-blur-md transition-all duration-200 hover:scale-110 hover:border-[#E6007A] hover:bg-[#E6007A] hover:text-white active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#E6007A]/40"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next service card"
          className="pointer-events-auto flex h-11 w-11 lg:h-12 lg:w-12 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-[#150024] shadow-xl backdrop-blur-md transition-all duration-200 hover:scale-110 hover:border-[#E6007A] hover:bg-[#E6007A] hover:text-white active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#E6007A]/40"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      </div>

      {/* BOTTOM CONTROLS (PAGINATION DOTS + MOBILE QUICK BUTTONS) */}
      <div className="mt-3 flex flex-col items-center justify-center gap-2.5">
        <div className="flex items-center gap-3">
          {/* Mobile prev button */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous service"
            className="flex sm:hidden h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm active:scale-90"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Pagination indicators */}
          <div className="flex items-center gap-1.5">
            {items.map((it, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={it.title}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Go to slide ${i + 1}: ${it.title}`}
                  className={`transition-all duration-300 focus:outline-none ${
                    isActive
                      ? "h-2 w-7 rounded-full bg-[#E6007A] shadow-md shadow-[#E6007A]/30"
                      : "h-2 w-2 rounded-full bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              );
            })}
          </div>

          {/* Mobile next button */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next service"
            className="flex sm:hidden h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm active:scale-90"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <p className="text-xs font-semibold text-slate-500">
          Showing <span className="font-bold text-[#150024]">{items[activeIndex]?.title}</span> ({activeIndex + 1} of {total})
        </p>
      </div>
    </div>
  );
}
