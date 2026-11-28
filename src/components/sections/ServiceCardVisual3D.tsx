"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

interface VisualProps {
  index: number;
  className?: string;
}

export function ServiceCardVisual3D({ index, className }: VisualProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canHoverRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const [inView, setInView] = useState(true);

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

  const applyTilt = (rx: number, ry: number) => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (stageRef.current) {
        stageRef.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      }
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canHoverRef.current) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const ry = Number((x * 14).toFixed(2));
    const rx = Number((-y * 14).toFixed(2));
    applyTilt(rx, ry);
  };

  const handleMouseLeave = () => {
    applyTilt(0, 0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative h-44 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#18022b] via-[#240340] to-[#120021] [perspective:1000px]",
        !inView && "[&_*]:![animation-play-state:paused]",
        className
      )}
    >
      {/* Background ambient lighting grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,#e6007a_1px,transparent_1px),linear-gradient(to_bottom,#e6007a_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"
      />

      {/* Tilt Parallax Stage (CSS-driven, zero React re-renders on hover) */}
      <div
        ref={stageRef}
        className="relative flex h-full w-full items-center justify-center transition-transform duration-200 ease-out [transform-style:preserve-3d] will-change-transform"
      >
        {index === 0 && <VisualHouseWalkthrough3D />}
        {index === 1 && <VisualMarketing3D />}
        {index === 2 && <VisualCodingWebDev3D />}
        {index === 3 && <VisualHomeInterior3D />}
        {index === 4 && <VisualGraphicDesign3D />}
        {index === 5 && <VisualComputerSoftware3D />}
      </div>
    </div>
  );
}

/* =========================================================================
   SCENE 1: 3D Walkthroughs — 3D Architectural Home Structure Walkthrough
   ========================================================================= */
function VisualHouseWalkthrough3D() {
  return (
    <div className="relative flex h-full w-full items-center justify-center [transform-style:preserve-3d]">
      <div className="absolute size-36 rounded-full bg-[#e6007a]/22 blur-2xl" />

      {/* 3D Foundation Landscape Grid */}
      <div
        className="absolute h-36 w-52 rounded-2xl border border-[#e6007a]/40 bg-[#1e0136]/60 shadow-[0_0_25px_rgba(230,0,122,0.3)]"
        style={{
          transform: "rotateX(60deg) rotateZ(-30deg) translateZ(-20px)",
          backgroundImage:
            "linear-gradient(to right, rgba(230,0,122,0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(230,0,122,0.25) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />

      {/* 3D Architectural Home Model Cutaway Container */}
      <div
        className="relative flex items-center justify-center [transform-style:preserve-3d]"
        style={{ transform: "translateZ(12px)" }}
      >
        <div className="relative flex items-center justify-center animate-[float-subtle_4.5s_ease-in-out_infinite] will-change-transform">
          <div className="relative h-32 w-48 overflow-hidden rounded-xl border border-white/20 bg-[#12001f]/90 shadow-[0_12px_30px_rgba(0,0,0,0.75),0_0_20px_rgba(230,0,122,0.35)]">
            <Image
              src="/brand/home-structure-3d.webp"
              alt="3D Architectural Home Walkthrough Model"
              fill
              sizes="220px"
              priority
              unoptimized
              className="object-contain p-1"
            />

            {/* Sweeping 3D Laser Scan Beam */}
            <div className="pointer-events-none absolute inset-x-0 top-1/2 h-1 bg-gradient-to-r from-transparent via-[#00ffff] to-transparent shadow-[0_0_10px_#00ffff] animate-[scan-laser_3.5s_ease-in-out_infinite] will-change-transform" />

            {/* Holographic Walkthrough Waypoint Pins */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1">
              <span className="size-2 rounded-full bg-[#00ffff] animate-pulse" />
              <span className="rounded border border-cyan-400/30 bg-black/80 px-1 py-0.5 font-mono text-[7px] font-bold text-cyan-300">
                GARAGE
              </span>
            </div>

            <div className="absolute bottom-6 left-18 flex items-center gap-1">
              <span className="size-2 rounded-full bg-[#e6007a] animate-pulse" />
              <span className="rounded border border-[#e6007a]/30 bg-black/80 px-1 py-0.5 font-mono text-[7px] font-bold text-[#ff47ad]">
                LIVING
              </span>
            </div>

            <div className="absolute top-3 right-4 flex items-center gap-1">
              <span className="size-2 rounded-full bg-[#ffe071] animate-pulse" />
              <span className="rounded border border-amber-300/30 bg-black/80 px-1 py-0.5 font-mono text-[7px] font-bold text-[#ffe071]">
                SUITE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Orbiting 3D Walkthrough Camera Badge */}
      <div
        className="absolute -top-1 right-2 [transform-style:preserve-3d]"
        style={{ transform: "translateZ(42px)" }}
      >
        <div className="flex items-center gap-1.5 rounded-full border border-white/30 bg-[#280146]/95 px-2.5 py-0.5 shadow-[0_0_15px_#e6007a] animate-[float-subtle_3.5s_ease-in-out_infinite] will-change-transform">
          <span className="size-2 rounded-full bg-[#ff0055] animate-pulse" />
          <span className="font-mono text-[9px] font-bold text-white">3D VILLA TOUR</span>
        </div>
      </div>

      <span className="absolute bottom-2 left-2 font-mono text-[9px] font-bold tracking-wider text-[#e6007a]/90 uppercase">
        8K · 3D WALKTHROUGH
      </span>
      <span className="absolute bottom-2 right-2 font-mono text-[9px] font-bold text-white/70">
        VILLA_01
      </span>
    </div>
  );
}

/* =========================================================================
   SCENE 2: Digital Marketing — Holographic 3D Metrics & Growth Trajectory
   ========================================================================= */
function VisualMarketing3D() {
  return (
    <div className="relative flex size-36 items-center justify-center [transform-style:preserve-3d]">
      <div className="absolute size-24 rounded-full bg-[#e6007a]/20 blur-xl" />

      {/* Isometric Metric Bars (scaleY only — zero layout reflow jitter) */}
      <div className="relative flex items-end gap-3 [transform:rotateX(55deg)_rotateZ(-25deg)] [transform-style:preserve-3d]">
        <div style={{ transform: "translateZ(10px)" }}>
          <div className="relative h-[58px] w-5 origin-bottom rounded-t-md bg-gradient-to-t from-[#280146] via-[#9c1563] to-[#e6007a] shadow-[0_0_12px_rgba(230,0,122,0.5)] animate-[bar-pulse-1_4s_ease-in-out_infinite] will-change-transform" />
        </div>
        <div style={{ transform: "translateZ(24px)" }}>
          <div className="relative h-[82px] w-5 origin-bottom rounded-t-md bg-gradient-to-t from-[#280146] via-[#b80058] to-[#e6007a] shadow-[0_0_16px_rgba(230,0,122,0.7)] animate-[bar-pulse-2_4s_ease-in-out_infinite] will-change-transform" />
        </div>
        <div style={{ transform: "translateZ(38px)" }}>
          <div className="relative h-[106px] w-5 origin-bottom rounded-t-md bg-gradient-to-t from-[#9c1563] via-[#e6007a] to-white shadow-[0_0_20px_rgba(230,0,122,0.9)] animate-[bar-pulse-3_4s_ease-in-out_infinite] will-change-transform" />
        </div>
      </div>

      {/* 3D Radar Circles (transform unified inside keyframes) */}
      <div className="absolute size-28 rounded-full border border-dashed border-[#e6007a]/40 animate-[radar-spin-tilted_14s_linear_infinite] will-change-transform" />
      <div className="absolute size-20 rounded-full border border-[#e6007a]/30 animate-[radar-spin-tilted-rev_10s_linear_infinite] will-change-transform" />

      {/* Growth Metric Badge */}
      <div
        className="absolute -top-1 right-3 [transform-style:preserve-3d]"
        style={{ transform: "translateZ(46px)" }}
      >
        <div className="flex items-center gap-1 rounded-full border border-white/20 bg-[#e6007a] px-2.5 py-0.5 text-[10px] font-extrabold text-white shadow-[0_4px_12px_rgba(230,0,122,0.6)] animate-[float-subtle_3.5s_ease-in-out_infinite] will-change-transform">
          <span>+340%</span>
          <svg className="size-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M7 17l9.2-9.2M17 17V8H8" />
          </svg>
        </div>
      </div>

      <span className="absolute bottom-2 left-2 font-mono text-[9px] tracking-wider text-[#e6007a]/70 uppercase">
        SEO · LEAD_ROI
      </span>
    </div>
  );
}

/* =========================================================================
   SCENE 3: Web Development — Live Animated Code Editor & Terminal
   ========================================================================= */
function VisualCodingWebDev3D() {
  return (
    <div className="relative flex size-40 items-center justify-center [transform-style:preserve-3d]">
      <div className="absolute size-28 rounded-full bg-[#e6007a]/20 blur-xl" />

      {/* Outer tilted frame + inner float wrapper (no transform conflict) */}
      <div
        className="relative [transform-style:preserve-3d]"
        style={{ transform: "rotateX(20deg) rotateY(-12deg) translateZ(10px)" }}
      >
        <div className="relative h-28 w-36 rounded-xl border border-white/20 bg-[#160026]/95 p-2 shadow-[0_12px_30px_rgba(0,0,0,0.75),0_0_20px_rgba(230,0,122,0.3)] animate-[float-subtle_5s_ease-in-out_infinite] will-change-transform">
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
            <div className="flex gap-1">
              <span className="size-2 rounded-full bg-red-400" />
              <span className="size-2 rounded-full bg-amber-400" />
              <span className="size-2 rounded-full bg-emerald-400" />
            </div>
            <span className="font-mono text-[8px] text-white/50">App.tsx — Next.js</span>
          </div>

          <div className="mt-2 space-y-1.5 font-mono text-[9px] leading-tight">
            <div className="flex items-center gap-1 text-[#e6007a]">
              <span className="text-[8px] text-white/40">1</span>
              <span className="text-white/80">const</span>
              <span className="text-[#ffe071]">site</span>
              <span className="text-white">=</span>
              <span className="text-cyan-300">&quot;Auctech&quot;</span>;
            </div>
            <div className="flex items-center gap-1 text-emerald-400">
              <span className="text-[8px] text-white/40">2</span>
              <span className="text-white/80">return</span>
              <span className="text-[#e6007a]">&lt;FastWeb</span>
              <span className="text-cyan-300">fps=60</span>
              <span className="text-[#e6007a]">/&gt;</span>
            </div>
            <div className="flex items-center gap-1 text-white/90">
              <span className="text-[8px] text-white/40">3</span>
              <span className="text-white/60">deploy();</span>
              <span className="inline-block h-3 w-1 bg-[#e6007a] animate-[blink-cursor_1s_infinite]" />
            </div>
          </div>

          <div className="absolute right-2 bottom-1.5 left-2 flex items-center justify-between rounded bg-black/60 px-1.5 py-0.5 font-mono text-[8px] text-emerald-400">
            <span>$ build:ready</span>
            <span className="text-[#e6007a]">100% SEO</span>
          </div>
        </div>
      </div>

      {/* Floating 3D Code Bracket Badges */}
      <div className="absolute -top-1 -right-1 flex items-center justify-center rounded-lg border border-[#e6007a] bg-gradient-to-tr from-[#e6007a] to-[#ff47ad] px-2 py-0.5 text-[10px] font-black text-white shadow-[0_0_15px_#e6007a] animate-[float-code_3.5s_ease-in-out_infinite] will-change-transform">
        &lt;/&gt; REACT 19
      </div>

      <div
        className="absolute -bottom-1 -left-1 rounded-md border border-white/20 bg-[#280146] px-1.5 py-0.5 font-mono text-[8px] font-bold text-white/80 shadow-md"
        style={{ transform: "translateZ(35px)" }}
      >
        TS 5.9
      </div>

      <span className="absolute bottom-2 left-2 font-mono text-[9px] tracking-wider text-[#e6007a]/70 uppercase">
        FULL_STACK · CODE
      </span>
    </div>
  );
}

/* =========================================================================
   SCENE 4: 3D Interior/Exterior — Isometric Home Living Room Interior
   ========================================================================= */
function VisualHomeInterior3D() {
  return (
    <div className="relative flex size-40 items-center justify-center [transform-style:preserve-3d]">
      <div className="absolute size-28 rounded-full bg-[#e6007a]/22 blur-xl" />

      {/* Isometric Room Enclosure */}
      <div className="relative flex items-center justify-center animate-[float-interior_5s_ease-in-out_infinite] [transform-style:preserve-3d] will-change-transform">
        <div
          className="relative h-24 w-28 rounded-sm border border-[#e6007a]/50 bg-gradient-to-br from-[#2a0342] to-[#160025] shadow-2xl [transform-style:preserve-3d]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "14px 14px",
          }}
        >
          <div className="absolute bottom-3 left-3 h-12 w-16 rounded border border-white/20 bg-gradient-to-tr from-[#e6007a]/30 to-[#9c1563]/20" />

          <div
            className="absolute bottom-5 left-4 h-7 w-14 rounded-md border border-white/40 bg-gradient-to-r from-[#e6007a] via-[#b80058] to-[#6d0034] shadow-[0_5px_15px_rgba(230,0,122,0.5)]"
            style={{ transform: "translateZ(10px)" }}
          >
            <div className="absolute -top-2 left-0 h-3 w-14 rounded-t border-t border-white/60 bg-[#e6007a]" />
            <div className="absolute top-0.5 left-1 size-3 rounded-xs bg-white/40" />
            <div className="absolute top-0.5 right-1 size-3 rounded-xs bg-[#ffe071]/50" />
          </div>

          <div
            className="absolute bottom-3 left-10 h-4 w-7 rounded-xs border border-white/60 bg-white/35"
            style={{ transform: "translateZ(16px)" }}
          />

          <div
            className="absolute top-2 right-2 flex flex-col items-center"
            style={{ transform: "translateZ(18px)" }}
          >
            <div className="size-4 rounded-full border border-white bg-gradient-to-tr from-[#ffe071] to-white shadow-[0_0_15px_#ffe071]" />
            <div className="h-10 w-0.5 bg-white/60" />
          </div>

          <div
            className="absolute top-1 left-3 h-5 w-8 rounded-xs border border-white/40 bg-gradient-to-r from-[#e6007a] to-[#280146] shadow-sm"
            style={{ transform: "translateZ(12px)" }}
          />
        </div>
      </div>

      {/* Floating 3D Interior Design Indicator */}
      <div
        className="absolute -top-1 left-2 [transform-style:preserve-3d]"
        style={{ transform: "translateZ(40px)" }}
      >
        <div className="flex items-center gap-1 rounded-md border border-[#e6007a] bg-[#1a012e]/95 px-2 py-0.5 font-mono text-[9px] font-bold text-white shadow-[0_0_12px_#e6007a] animate-[float-subtle_4s_ease-in-out_infinite] will-change-transform">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          LIVING ROOM 3D
        </div>
      </div>

      <span className="absolute bottom-2 left-2 font-mono text-[9px] tracking-wider text-[#e6007a]/80 uppercase">
        LUXURY · INTERIOR
      </span>
      <span className="absolute bottom-2 right-2 font-mono text-[9px] font-bold text-white/60">
        LIGHTING CAD
      </span>
    </div>
  );
}

/* =========================================================================
   SCENE 5: Graphic Design — 3D Vector Bezier Pen & Layered Lens Discs
   ========================================================================= */
function VisualGraphicDesign3D() {
  return (
    <div className="relative flex size-36 items-center justify-center [transform-style:preserve-3d]">
      <div className="absolute size-24 rounded-full bg-[#e6007a]/20 blur-xl" />

      {/* Layered Color Palette Lenses in 3D Depth */}
      <div className="absolute size-16 rounded-full border border-white/30 bg-[#280146]/80 shadow-lg animate-[float-layer-1_4.5s_ease-in-out_infinite] will-change-transform" />
      <div className="absolute size-16 rounded-full border border-[#e6007a] bg-[#e6007a]/45 shadow-[0_0_15px_rgba(230,0,122,0.4)] animate-[float-layer-2_4s_ease-in-out_infinite] will-change-transform" />

      {/* 3D Floating Vector Pen */}
      <div className="relative flex size-12 items-center justify-center rounded-2xl border-2 border-white/60 bg-gradient-to-tr from-[#9c1563] via-[#e6007a] to-white shadow-[0_8px_25px_rgba(230,0,122,0.8)] animate-[float-pen_3.5s_ease-in-out_infinite] will-change-transform">
        <svg
          className="size-6 text-white drop-shadow"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m12 19 7-7 3 3-7 7-3-3z" />
          <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
          <path d="m2 2 7.586 7.586" />
          <circle cx="11" cy="11" r="2" />
        </svg>
      </div>

      {/* Bezier Tangent Handles */}
      <div
        className="absolute h-0.5 w-24 bg-gradient-to-r from-[#e6007a] via-white to-[#e6007a] opacity-75"
        style={{ transform: "translateZ(24px) rotateZ(35deg)" }}
      >
        <span className="absolute -top-1 -left-1.5 size-2.5 rounded-full border border-white bg-[#e6007a]" />
        <span className="absolute -top-1 -right-1.5 size-2.5 rounded-full border border-white bg-[#e6007a]" />
      </div>

      <span className="absolute bottom-2 left-2 font-mono text-[9px] tracking-wider text-[#e6007a]/70 uppercase">
        BRANDING · VECTOR
      </span>
    </div>
  );
}

/* =========================================================================
   SCENE 6: Software Solutions — 3D Computer Workstation & Cloud Core
   ========================================================================= */
function VisualComputerSoftware3D() {
  return (
    <div className="relative flex size-40 items-center justify-center [transform-style:preserve-3d]">
      <div className="absolute size-28 rounded-full bg-[#e6007a]/22 blur-xl" />

      {/* 3D Desktop PC Monitor & Workstation */}
      <div className="relative flex flex-col items-center animate-[float-computer_5s_ease-in-out_infinite] [transform-style:preserve-3d] will-change-transform">
        <div className="relative h-22 w-32 rounded-lg border-2 border-white/30 bg-[#160026] p-1.5 shadow-[0_12px_25px_rgba(0,0,0,0.75),0_0_20px_rgba(230,0,122,0.4)] [transform-style:preserve-3d]">
          <div className="relative size-full overflow-hidden rounded border border-white/10 bg-gradient-to-br from-[#230138] to-[#12001e] p-1.5">
            <div className="flex items-center justify-between border-b border-white/10 pb-1">
              <span className="font-mono text-[7px] font-bold text-[#e6007a]">ERP_SYSTEM v4.2</span>
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div className="mt-1.5 flex h-6 items-end justify-between gap-1">
              <div className="h-3 w-3 rounded-xs bg-[#e6007a]" />
              <div className="h-5 w-3 rounded-xs bg-gradient-to-t from-[#e6007a] to-white" />
              <div className="h-4 w-3 rounded-xs bg-emerald-400" />
              <div className="h-6 w-3 rounded-xs bg-gradient-to-t from-[#9c1563] to-[#e6007a]" />
              <div className="h-5 w-3 rounded-xs bg-cyan-400" />
            </div>

            <div className="mt-1 flex items-center justify-between font-mono text-[7px] text-white/70">
              <span>CPU: 99.8%</span>
              <span className="text-[#ffe071]">CRM: SYNC</span>
            </div>
          </div>
        </div>

        <div className="h-3 w-3 border-x border-white/40 bg-white/20" />
        <div className="h-1 w-10 rounded-full border border-white/40 bg-gradient-to-r from-white/30 via-white to-white/30 shadow-md" />
      </div>

      {/* Mini 3D Server Tower */}
      <div
        className="absolute right-0 bottom-4 [transform-style:preserve-3d]"
        style={{ transform: "translateZ(30px)" }}
      >
        <div className="flex h-14 w-6 flex-col justify-between rounded border border-white/30 bg-[#280146] p-1 shadow-lg animate-[float-subtle_4s_ease-in-out_infinite] will-change-transform">
          <div className="space-y-1">
            <div className="h-1 w-full rounded-xs bg-[#e6007a]" />
            <div className="h-1 w-full rounded-xs bg-white/30" />
          </div>
          <div className="flex justify-center gap-0.5">
            <span className="size-1 rounded-full bg-emerald-400 animate-pulse" />
            <span className="size-1 rounded-full bg-[#e6007a]" />
          </div>
        </div>
      </div>

      {/* Orbiting Cloud Algorithm Node Badge */}
      <div className="absolute -top-1 left-2 flex items-center gap-1 rounded-lg border border-[#e6007a] bg-[#1a012e] px-2 py-0.5 text-[9px] font-bold text-white shadow-[0_0_15px_#e6007a] animate-[float-code_3.8s_ease-in-out_infinite] will-change-transform">
        <span className="size-1.5 rounded-full bg-[#e6007a]" />
        CLOUD_CRM
      </div>

      <span className="absolute bottom-2 left-2 font-mono text-[9px] tracking-wider text-[#e6007a]/80 uppercase">
        SOFTWARE · DESKTOP
      </span>
    </div>
  );
}
