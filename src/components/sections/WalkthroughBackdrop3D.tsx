"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/cn";
import styles from "./WalkthroughBackdrop3D.module.css";

/**
 * Animated #39025F architectural 3D studio backdrop for the About / 3D Walkthrough section.
 * Uses compositor-only CSS transforms, IntersectionObserver viewport pausing,
 * reduced-motion respect, and a discreet pause/play toggle.
 */
export function WalkthroughBackdrop3D() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [userPaused, setUserPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPrefersReducedMotion(motionQuery.matches);
    sync();
    motionQuery.addEventListener("change", sync);
    return () => motionQuery.removeEventListener("change", sync);
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

  const isPaused = !inView || userPaused;

  return (
    <div
      ref={rootRef}
      className={cn(
        styles.root,
        isPaused && styles.paused,
        "pointer-events-none absolute inset-0 overflow-hidden"
      )}
    >
      {/* 3D Perspective Architectural Floor Grid */}
      <div
        aria-hidden="true"
        className={cn(styles.perspectiveGrid, "absolute -inset-x-[15%] bottom-[-18%] h-[78%]")}
      />

      {/* Ambient Floating Glow Orbs */}
      <div
        aria-hidden="true"
        className={cn(
          styles.orbMagenta,
          "absolute -top-[12%] -left-[8%] h-[52%] w-[44%] rounded-full bg-[#E6007A]/20 blur-3xl"
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          styles.orbViolet,
          "absolute right-[-6%] bottom-[-14%] h-[56%] w-[46%] rounded-full bg-[#8b8eff]/18 blur-3xl"
        )}
      />

      {/* Subtle Floating 3D Architectural Wireframe Planes (Right Background Accent) */}
      <div
        aria-hidden="true"
        className={cn(
          styles.wireframePlane,
          "absolute top-[12%] right-[6%] hidden h-64 w-64 rounded-3xl border border-white/12 bg-white/[0.025] shadow-[0_0_40px_rgba(230,0,122,0.14)] lg:block"
        )}
      >
        <div
          className="absolute inset-5 rounded-2xl border border-[#E6007A]/25"
          style={{ transform: "translateZ(22px)" }}
        />
        <div
          className="absolute inset-11 rounded-xl border border-white/15"
          style={{ transform: "translateZ(42px)" }}
        />
      </div>

      {/* Subtle Rotating 3D Orbital Halo */}
      <div
        aria-hidden="true"
        className={cn(
          styles.orbitRing,
          "absolute -bottom-24 left-[18%] hidden size-[360px] rounded-full border border-dashed border-white/12 sm:block"
        )}
      />

      {/* Soft Diagonal Specular Light Sweep */}
      <div
        aria-hidden="true"
        className={cn(styles.lightSweep, "absolute inset-y-0 left-0 w-1/2")}
      />

      {/* Discreet Pause/Play Control (WCAG 2.2.2) */}
      {!prefersReducedMotion && (
        <button
          type="button"
          onClick={() => setUserPaused((p) => !p)}
          aria-label={userPaused ? "Play background animation" : "Pause background animation"}
          className="pointer-events-auto absolute right-4 bottom-4 z-20 flex size-8 items-center justify-center rounded-full border border-white/20 bg-[#24013d]/75 text-white/90 backdrop-blur-md transition-colors hover:bg-[#24013d]/95 hover:text-white"
        >
          {userPaused ? (
            <Play aria-hidden className="size-3.5 fill-current" />
          ) : (
            <Pause aria-hidden className="size-3.5" />
          )}
        </button>
      )}
    </div>
  );
}
