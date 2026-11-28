"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/cn";
import styles from "./AboutRotatingBox3D.module.css";

/**
 * 360-degree Y-axis rotating 3D showcase visual of the isolated statue figure,
 * styled to blend seamlessly inside the dark navy "Our Services" box on /about.
 */
export function AboutRotatingBox3D() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPrefersReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isPaused = !inView || isHovered || userPaused;

  return (
    <div
      ref={rootRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        styles.perspectiveStage,
        isPaused && styles.paused,
        "relative mx-auto flex w-full max-w-[215px] flex-col items-center justify-center py-3"
      )}
    >
      {/* Subtle studio ambient glow behind the rotating 3D figure */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 size-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E6007A]/20 blur-2xl"
      />

      {/* 3D Rotating Prism Box */}
      <div
        className={cn(
          styles.box3d,
          "relative aspect-[768/1240] w-[170px] sm:w-[190px] xl:w-[195px]"
        )}
      >
        {/* Front Face */}
        <div
          className={cn(
            styles.faceFront,
            "absolute inset-0 overflow-hidden rounded-2xl border border-[#E6007A]/40 bg-[#150024] shadow-[0_18px_40px_-10px_rgba(230,0,122,0.45)]"
          )}
        >
          <Image
            src="/img/about-3d-figure.jpg"
            alt="3D Cultural Statue Visualization"
            width={768}
            height={1376}
            unoptimized
            priority
            className="h-full w-full object-cover object-bottom"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/15"
          />
        </div>

        {/* Back Face */}
        <div
          className={cn(
            styles.faceBack,
            "absolute inset-0 overflow-hidden rounded-2xl border border-[#E6007A]/40 bg-[#150024] shadow-[0_18px_40px_-10px_rgba(230,0,122,0.45)]"
          )}
        >
          <Image
            src="/img/about-3d-figure.jpg"
            alt=""
            aria-hidden="true"
            width={768}
            height={1376}
            unoptimized
            className="h-full w-full object-cover object-bottom"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/15"
          />
        </div>

        {/* 3D Thickness Edges */}
        <div aria-hidden="true" className={cn(styles.edgeRight, "absolute inset-y-2 rounded-sm")} />
        <div aria-hidden="true" className={cn(styles.edgeLeft, "absolute inset-y-2 rounded-sm")} />
        <div aria-hidden="true" className={cn(styles.edgeTop, "absolute inset-x-2 rounded-sm")} />
        <div aria-hidden="true" className={cn(styles.edgeBottom, "absolute inset-x-2 rounded-sm")} />
      </div>

      {/* Studio Floor Glow Shadow */}
      <div
        aria-hidden="true"
        className={cn(
          styles.floorShadow,
          "pointer-events-none absolute bottom-1 left-1/2 h-4 w-36 rounded-full blur-md"
        )}
      />

      {/* Discreet Pause/Play Toggle */}
      {!prefersReducedMotion && (
        <button
          type="button"
          onClick={() => setUserPaused((p) => !p)}
          aria-label={userPaused ? "Play 360° 3D rotation" : "Pause 360° 3D rotation"}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/90 backdrop-blur-xs transition-colors hover:border-[#E6007A] hover:bg-[#E6007A] hover:text-white"
        >
          {userPaused ? (
            <>
              <Play aria-hidden className="size-3 fill-current" />
              <span>Play 360°</span>
            </>
          ) : (
            <>
              <Pause aria-hidden className="size-3" />
              <span>Pause 360°</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
