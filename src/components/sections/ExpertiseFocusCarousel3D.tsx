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
  Pause,
  Play,
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

interface ItemMeta {
  href: string;
  tag: string;
  image: string;
  cover?: boolean;
  icon: React.ElementType;
  badgeColor: string;
}

// Topic-matched service metadata and images
const ITEM_META: Record<string, ItemMeta> = {
  "3D Walkthroughs": {
    href: "/3d-architectural-walkthrough-in-lucknow",
    tag: "SPATIAL 3D",
    image: "img/services-img/3D-Architectural-Walkthroughs.webp",
    cover: true,
    icon: Box,
    badgeColor: "from-fuchsia-600 to-pink-500",
  },
  "Digital Marketing": {
    href: "/best-digital-marketing-agency-in-lucknow",
    tag: "ROI & SEO",
    image: "img/services-img/digital-marketing.webp",
    cover: false,
    icon: TrendingUp,
    badgeColor: "from-blue-600 to-indigo-600",
  },
  "Web Development": {
    href: "/best-web-development-company-in-lucknow",
    tag: "FULL-STACK",
    image: "img/services-img/website-software.webp",
    cover: false,
    icon: Code2,
    badgeColor: "from-emerald-600 to-teal-600",
  },
  "Software Solutions": {
    href: "/best-software-development-company-in-lucknow",
    tag: "ENTERPRISE",
    image: "img/services-img/software_development.webp",
    cover: false,
    icon: Cpu,
    badgeColor: "from-purple-600 to-violet-700",
  },
  "Graphic Design": {
    href: "/best-graphic-designing-company-in-lucknow",
    tag: "CREATIVE UI",
    image: "img/services-img/graphics-designer.webp",
    cover: false,
    icon: Palette,
    badgeColor: "from-rose-500 to-amber-500",
  },
  "Video Editing": {
    href: "/best-video-editing-in-lucknow",
    tag: "4K CINEMATIC",
    image: "img/services-img/video-editing.webp",
    cover: false,
    icon: Video,
    badgeColor: "from-pink-600 to-red-600",
  },
};

function getMeta(title: string): ItemMeta {
  return (
    ITEM_META[title] || {
      href: "/service",
      tag: "EXPERTISE",
      image: "img/services-img/digital-marketing.webp",
      cover: false,
      icon: Box,
      badgeColor: "from-[#E6007A] to-purple-600",
    }
  );
}

/** Shared card interior used by both mobile 3D focus mode and tablet/desktop horizontal slider. */
function ExpertiseCardInner({
  item,
  index,
  total,
  isInteractive,
  priority,
}: {
  item: ExpertiseItem;
  index: number;
  total: number;
  isInteractive: boolean;
  priority?: boolean;
}) {
  const meta = getMeta(item.title);
  const Icon = meta.icon;

  return (
    <>
      <div
        className={`relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden ${
          meta.cover ? "bg-slate-900" : "bg-gradient-to-br from-[#FAF7FD] to-[#EFE8FA]"
        }`}
      >
        <Image
          src={assetPath(meta.image)}
          alt={item.title}
          width={600}
          height={375}
          priority={priority}
          unoptimized={true}
          className={`h-full w-full transition-transform duration-700 ease-out group-hover:scale-105 ${
            meta.cover ? "object-cover" : "object-contain p-2.5"
          }`}
        />

        {/* Floating Category Tag */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/70 px-2.5 py-1 backdrop-blur-md">
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
        <div className="absolute top-2.5 right-2.5 rounded-full bg-[#E6007A] px-2.5 py-0.5 text-[11px] font-black text-white shadow-md">
          {item.value}% Success
        </div>
      </div>

      {/* Card Body Content */}
      <div className="flex flex-1 flex-col bg-white p-4 sm:p-5">
        <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-[#150024]">
          {item.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 flex-1 text-xs sm:text-[0.85rem] font-normal leading-relaxed text-slate-600">
          {item.text}
        </p>

        {/* Metric Progress Bar */}
        <div className="mt-3.5 border-t border-slate-100 pt-3">
          <div className="flex justify-between text-[11px] font-bold text-slate-600">
            <span>{item.metric}</span>
            <span className="font-black text-[#150024]">{item.value}%</span>
          </div>
          <div
            className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100"
            role="presentation"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#E6007A] to-purple-600 transition-all duration-700"
              style={{ width: `${item.value}%` }}
            />
          </div>
        </div>

        {/* Action CTA Button */}
        <div className="mt-4 flex items-center justify-between pt-1">
          <Link
            href={meta.href}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-black shadow-sm transition-all ${
              isInteractive
                ? "bg-[#E6007A] text-white shadow-[#E6007A]/25 hover:bg-[#c40068] hover:shadow-md active:scale-95"
                : "pointer-events-none bg-slate-100 text-slate-400"
            }`}
            tabIndex={isInteractive ? 0 : -1}
          >
            <span>Explore Service</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          <span className="text-[11px] font-bold text-slate-400">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
      </div>
    </>
  );
}

export function ExpertiseFocusCarousel3D({ items }: ExpertiseFocusCarousel3DProps) {
  const total = items.length;

  // Mobile 3D focus state
  const [activeIndex, setActiveIndex] = useState(0);

  // Desktop/tablet seamless horizontal track state (0..total)
  const [trackIndex, setTrackIndex] = useState(0);
  const [noTransition, setNoTransition] = useState(false);
  const trackIndexRef = useRef(0);
  trackIndexRef.current = trackIndex;

  // Shared autoplay / visibility / reduced-motion controls
  const [isHovered, setIsHovered] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchCurrentX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPrefersReducedMotion(motionQuery.matches);
    sync();
    motionQuery.addEventListener("change", sync);
    return () => motionQuery.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
    setNoTransition(false);
    setTrackIndex((prev) => (prev >= total ? 1 : prev + 1));
  }, [total]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
    const current = trackIndexRef.current;
    if (current <= 0) {
      setNoTransition(true);
      setTrackIndex(total);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setNoTransition(false);
          setTrackIndex(total - 1);
        });
      });
      return;
    }
    setNoTransition(false);
    setTrackIndex(current - 1);
  }, [total]);

  const handleSelectDot = (i: number) => {
    setNoTransition(false);
    setActiveIndex(i);
    setTrackIndex(i);
  };

  // Smoothly wrap horizontal track from cloned tail back to index 0 after transition completes
  const handleTrackTransitionEnd = () => {
    if (trackIndex >= total) {
      setNoTransition(true);
      setTrackIndex(0);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setNoTransition(false);
        });
      });
    }
  };

  // Auto-slide when visible, not hovered, not paused, and motion is allowed
  const shouldAutoSlide = inView && !isHovered && !userPaused && !prefersReducedMotion;

  useEffect(() => {
    if (!shouldAutoSlide) return;
    const timer = setInterval(() => {
      handleNext();
    }, 3400);
    return () => clearInterval(timer);
  }, [shouldAutoSlide, handleNext]);

  // Mobile Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsHovered(true);
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
    setTimeout(() => setIsHovered(false), 3000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      handlePrev();
    } else if (e.key === "ArrowRight") {
      handleNext();
    }
  };

  // Mobile 3D focus depth style
  const getMobileCardStyle = (index: number) => {
    let diff = index - activeIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    let scale = 0.65;
    let blurPx = 8;
    let opacity = 0;
    let zIndex = 1;
    let pointerEvents: "auto" | "none" = "none";

    if (diff === 0) {
      scale = 1.0;
      blurPx = 0;
      opacity = 1;
      zIndex = 50;
      pointerEvents = "auto";
    } else if (Math.abs(diff) === 1) {
      scale = 0.86;
      blurPx = 3.5;
      opacity = 0.55;
      zIndex = 20;
      pointerEvents = "auto";
    } else if (Math.abs(diff) === 2) {
      scale = 0.74;
      blurPx = 7;
      opacity = 0.25;
      zIndex = 10;
      pointerEvents = "auto";
    }

    return {
      diff,
      style: {
        transform: `translate(-50%, -50%) translateX(calc(${diff} * 180px)) scale(${scale})`,
        filter: blurPx > 0 ? `blur(${blurPx}px)` : "none",
        opacity,
        zIndex,
        pointerEvents,
        willChange: Math.abs(diff) <= 1 ? "transform, filter, opacity" : "auto",
      },
    };
  };

  // Extended list for seamless desktop/tablet horizontal auto-slide
  const horizontalSlides = [...items, ...items.slice(0, 3)];
  const currentDotIndex = trackIndex % total;

  return (
    <div
      ref={containerRef}
      className="expertise-carousel-root relative mt-6 sm:mt-10 w-full select-none outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="Expertise Services Carousel"
    >
      <style>{`
        .expertise-track {
          --slide-step: 50%;
          transform: translate3d(calc(-1 * var(--track-index, 0) * var(--slide-step)), 0, 0);
        }
        @media (min-width: 1024px) {
          .expertise-track {
            --slide-step: 33.333333%;
          }
        }
      `}</style>

      {/* =====================================================================
          MOBILE VIEW (< 640px): Existing 3D Focus Carousel Preserved
         ===================================================================== */}
      <div className="relative mx-auto flex h-[460px] w-full items-center justify-center overflow-hidden py-3 sm:hidden">
        {items.map((it, i) => {
          const { diff, style } = getMobileCardStyle(i);
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
              className={`group absolute top-1/2 left-1/2 flex w-[265px] cursor-pointer flex-col overflow-hidden rounded-3xl border bg-white text-left transition-all duration-500 ease-out ${
                Math.abs(diff) >= 2 ? "hidden" : ""
              } ${
                isActive
                  ? "border-[#E6007A] shadow-[0_20px_50px_-12px_rgba(230,0,122,0.3),0_10px_25px_-8px_rgba(21,0,36,0.15)] ring-2 ring-[#E6007A]/30"
                  : "border-slate-200/80 shadow-md hover:border-slate-300"
              }`}
            >
              <ExpertiseCardInner
                item={it}
                index={i}
                total={total}
                isInteractive={isActive}
                priority={i === 0}
              />
            </div>
          );
        })}
      </div>

      {/* =====================================================================
          TABLET & DESKTOP VIEW (>= 640px): Horizontal Auto-Sliding Cards
         ===================================================================== */}
      <div className="relative hidden sm:block">
        <div className="overflow-hidden py-4 -mx-3">
          <div
            onTransitionEnd={handleTrackTransitionEnd}
            style={{ "--track-index": trackIndex } as React.CSSProperties}
            className={`expertise-track flex w-full ${
              noTransition ? "transition-none" : "transition-transform duration-700 ease-in-out"
            }`}
          >
            {horizontalSlides.map((it, idx) => {
              const realIndex = idx % total;
              const isClone = idx >= total;
              return (
                <div
                  key={`${it.title}-${idx}`}
                  aria-hidden={isClone || undefined}
                  className="w-1/2 shrink-0 px-3 lg:w-1/3"
                >
                  <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white text-left shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-[#E6007A]/60 hover:shadow-lift">
                    <ExpertiseCardInner
                      item={it}
                      index={realIndex}
                      total={total}
                      isInteractive={!isClone}
                      priority={idx < 3}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop/Tablet Circular Side Arrows */}
        <div className="pointer-events-none absolute inset-y-0 left-1 right-1 flex items-center justify-between lg:-left-5 lg:-right-5">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous service card"
            className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-[#150024] shadow-xl backdrop-blur-md transition-all duration-200 hover:scale-110 hover:border-[#E6007A] hover:bg-[#E6007A] hover:text-white active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#E6007A]/40 lg:h-12 lg:w-12"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next service card"
            className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-[#150024] shadow-xl backdrop-blur-md transition-all duration-200 hover:scale-110 hover:border-[#E6007A] hover:bg-[#E6007A] hover:text-white active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#E6007A]/40 lg:h-12 lg:w-12"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>
      </div>

      {/* BOTTOM CONTROLS (PAGINATION DOTS + MOBILE QUICK BUTTONS + PAUSE TOGGLE) */}
      <div className="mt-3 flex flex-col items-center justify-center gap-2.5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous service"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm active:scale-90 sm:hidden"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-1.5">
            {items.map((it, i) => {
              const isDotActive = i === currentDotIndex;
              return (
                <button
                  key={it.title}
                  type="button"
                  onClick={() => handleSelectDot(i)}
                  aria-label={`Go to slide ${i + 1}: ${it.title}`}
                  className={`transition-all duration-300 focus:outline-none ${
                    isDotActive
                      ? "h-2 w-7 rounded-full bg-[#E6007A] shadow-md shadow-[#E6007A]/30"
                      : "h-2 w-2 rounded-full bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next service"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm active:scale-90 sm:hidden"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {!prefersReducedMotion && (
            <button
              type="button"
              onClick={() => setUserPaused((p) => !p)}
              aria-label={userPaused ? "Play auto slide" : "Pause auto slide"}
              className="hidden h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-xs transition-colors hover:border-[#E6007A] hover:text-[#E6007A] sm:flex"
            >
              {userPaused ? (
                <Play aria-hidden className="h-3 w-3 fill-current" />
              ) : (
                <Pause aria-hidden className="h-3 w-3" />
              )}
            </button>
          )}
        </div>

        <p className="text-xs font-semibold text-slate-500">
          Showing{" "}
          <span className="font-bold text-[#150024]">
            {items[currentDotIndex]?.title}
          </span>{" "}
          ({currentDotIndex + 1} of {total})
        </p>
      </div>
    </div>
  );
}
