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
import { cn } from "@/lib/cn";
import styles from "./ExpertiseFocusCarousel3D.module.css";

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

/** Shared lighter royal-violet card interior with 3D layered depth, orbit ring, and topic image. */
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
    <div className={cn(styles.cardSurface, "relative flex h-full flex-col rounded-3xl")}>
      {/* Clipped ambient glow, rotating 3D orbital halo & diagonal sheen */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl"
      >
        <div
          className={cn(styles.cardGlow, "absolute -top-10 -right-10 size-52 rounded-full")}
        />
        <div
          className={cn(
            styles.orbitRing3d,
            "absolute -right-10 -bottom-10 size-36 rounded-full border border-dashed border-[#7c3aed]/30"
          )}
        />
        <div
          className={cn(styles.cardSheen, "absolute inset-y-0 left-0 z-10 w-2/3")}
        />
      </div>

      {/* Image stage with elevated 3D badges */}
      <div
        className={`relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-t-3xl [transform-style:preserve-3d] ${
          meta.cover ? "bg-[#210537]" : "bg-gradient-to-br from-[#ffffff] to-[#f4ecff]"
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

        {/* Soft bottom blend into light lavender card body */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-[#eadcff]/65 to-transparent"
        />

        {/* Elevated 3D Floating Category Tag */}
        <div
          className="absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded-full border border-white/25 bg-[#280146]/85 px-2.5 py-1 backdrop-blur-md"
          style={{ transform: "translateZ(18px)" }}
        >
          <span
            className={`flex h-4.5 w-4.5 items-center justify-center rounded-full bg-gradient-to-br ${meta.badgeColor} text-white shadow-xs`}
          >
            <Icon className="h-2.5 w-2.5" />
          </span>
          <span className="text-[10px] font-extrabold tracking-wider text-white uppercase">
            {meta.tag}
          </span>
        </div>

        {/* Elevated 3D Metric Pill */}
        <div
          className="absolute top-2.5 right-2.5 rounded-full bg-[#E6007A] px-2.5 py-0.5 text-[11px] font-black text-white shadow-md"
          style={{ transform: "translateZ(18px)" }}
        >
          {item.value}% Success
        </div>
      </div>

      {/* Card Body Content */}
      <div
        className="relative z-10 flex flex-1 flex-col p-4 sm:p-5"
        style={{ transform: "translateZ(10px)" }}
      >
        <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-[#1a012e]">
          {item.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 flex-1 text-xs sm:text-[0.85rem] font-normal leading-relaxed text-[#443555]">
          {item.text}
        </p>

        {/* Animated Metric Progress Bar */}
        <div className="mt-3.5 border-t border-[#280146]/10 pt-3">
          <div className="flex justify-between text-[11px] font-bold text-[#443555]">
            <span>{item.metric}</span>
            <span className="font-black text-[#1a012e]">{item.value}%</span>
          </div>
          <div
            className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[#280146]/12"
            role="presentation"
          >
            <div
              className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-[#E6007A] to-purple-600 transition-all duration-700"
              style={{ width: `${item.value}%` }}
            >
              <span
                aria-hidden="true"
                className={cn(styles.progressShimmer, "absolute inset-y-0 left-0 w-1/2")}
              />
            </div>
          </div>
        </div>

        {/* Action CTA Button */}
        <div className="mt-4 flex items-center justify-between pt-1">
          <Link
            href={meta.href}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-black shadow-sm transition-all ${
              isInteractive
                ? "bg-[#E6007A] text-white shadow-[#E6007A]/30 hover:bg-[#c40068] hover:shadow-md active:scale-95"
                : "pointer-events-none bg-[#280146]/10 text-[#280146]/45"
            }`}
            tabIndex={isInteractive ? 0 : -1}
          >
            <span>Explore Service</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>

          <span className="text-[11px] font-bold text-[#624d7a]">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}

/** Interactive 3D hover-tilt card shell for tablet/desktop slides (zero React re-renders). */
function TiltCard3D({
  children,
  even,
}: {
  children: React.ReactNode;
  even: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const canHoverRef = useRef(false);

  useEffect(() => {
    const pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      canHoverRef.current = pointerQuery.matches && !motionQuery.matches;
    };
    sync();
    pointerQuery.addEventListener("change", sync);
    motionQuery.addEventListener("change", sync);
    return () => {
      pointerQuery.removeEventListener("change", sync);
      motionQuery.removeEventListener("change", sync);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const applyTilt = (rx: number, ry: number) => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (cardRef.current) {
        cardRef.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      }
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canHoverRef.current) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    applyTilt(Number((-y * 8).toFixed(2)), Number((x * 10).toFixed(2)));
  };

  return (
    <div
      className={cn(styles.perspectiveWrap, "h-full")}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => applyTilt(0, 0)}
    >
      <div
        ref={cardRef}
        className="h-full transition-transform duration-200 ease-out [transform-style:preserve-3d] will-change-transform"
      >
        <div className={cn(even ? styles.card3dEven : styles.card3dOdd, "h-full")}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function ExpertiseFocusCarousel3D({ items }: ExpertiseFocusCarousel3DProps) {
  const total = items.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const [trackIndex, setTrackIndex] = useState(0);
  const [noTransition, setNoTransition] = useState(false);
  const trackIndexRef = useRef(0);
  trackIndexRef.current = trackIndex;

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

  const shouldAutoSlide = inView && !isHovered && !userPaused && !prefersReducedMotion;

  useEffect(() => {
    if (!shouldAutoSlide) return;
    const timer = setInterval(() => {
      handleNext();
    }, 3400);
    return () => clearInterval(timer);
  }, [shouldAutoSlide, handleNext]);

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

  const horizontalSlides = [...items, ...items.slice(0, 3)];
  const currentDotIndex = trackIndex % total;
  const animationsPaused = !inView || userPaused;

  return (
    <div
      ref={containerRef}
      className={cn(
        "expertise-carousel-root relative mt-6 sm:mt-10 w-full select-none outline-none",
        animationsPaused && styles.paused
      )}
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
              className={`group absolute top-1/2 left-1/2 flex w-[265px] cursor-pointer flex-col overflow-hidden rounded-3xl border bg-[#eadcff] text-left transition-all duration-500 ease-out ${
                Math.abs(diff) >= 2 ? "hidden" : ""
              } ${
                isActive
                  ? "border-[#E6007A] shadow-[0_20px_50px_-12px_rgba(230,0,122,0.28),0_10px_25px_-8px_rgba(40,1,70,0.16)] ring-2 ring-[#E6007A]/30"
                  : "border-[#d8c6f7] shadow-md hover:border-[#b794f4]"
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
          TABLET & DESKTOP VIEW (>= 640px): 3D Animated Horizontal Auto-Slider
         ===================================================================== */}
      <div className="relative hidden sm:block">
        <div className="overflow-hidden py-6 -mx-3">
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
                  <TiltCard3D even={realIndex % 2 === 0}>
                    <div className="group flex h-full flex-col rounded-3xl border border-[#d6c2f7] bg-[#eadcff] text-left shadow-[0_14px_34px_-12px_rgba(40,1,70,0.16)] [transform-style:preserve-3d] transition-colors duration-300 hover:border-[#E6007A]/70 hover:shadow-[0_22px_48px_-12px_rgba(230,0,122,0.28)]">
                      <ExpertiseCardInner
                        item={it}
                        index={realIndex}
                        total={total}
                        isInteractive={!isClone}
                        priority={idx < 3}
                      />
                    </div>
                  </TiltCard3D>
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
            className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-[#d6c2f7] bg-white/95 text-[#280146] shadow-xl backdrop-blur-md transition-all duration-200 hover:scale-110 hover:border-[#E6007A] hover:bg-[#E6007A] hover:text-white active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#E6007A]/40 lg:h-12 lg:w-12"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next service card"
            className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-[#d6c2f7] bg-white/95 text-[#280146] shadow-xl backdrop-blur-md transition-all duration-200 hover:scale-110 hover:border-[#E6007A] hover:bg-[#E6007A] hover:text-white active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#E6007A]/40 lg:h-12 lg:w-12"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>
      </div>

      {/* BOTTOM CONTROLS */}
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
