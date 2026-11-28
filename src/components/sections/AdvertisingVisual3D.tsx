"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/cn";
import styles from "./AdvertisingVisual3D.module.css";

interface AdvertisingVisual3DProps {
  alt?: string;
  className?: string;
}

const TABLET_DEPTH_SLICES = [2, 4, 6, 8] as const;
const TABLET_EDGE_COLORS = ["#272c4d", "#212644", "#1b1f39", "#15192e"] as const;

const BAG_DEPTH_SLICES = [2, 4, 6] as const;
const BAG_EDGE_COLORS = ["#cfd5ec", "#bcc3df", "#a8b0d1"] as const;

const SWATCH_CARDS = [
  { color: "#9ba0ff", tip: "#eceeff", rotate: "-14deg", z: 2, y: "0%" },
  { color: "#686ea8", tip: "#e4e7f5", rotate: "-2deg", z: 4, y: "18%" },
  { color: "#d8f72c", tip: "#f4fbe0", rotate: "11deg", z: 6, y: "36%" },
] as const;

const TOOL_BUTTON_TONES = ["#8b8eff", "#d8f72c", "#6f74b0", "#9ba0ff", "#5c629a", "#8b8eff"] as const;

/** Renders stacked extruded 3D edge slices behind a rounded surface. */
function ExtrudedDepthSlices({
  depths,
  colors,
  radiusClass,
}: {
  depths: readonly number[];
  colors: readonly string[];
  radiusClass: string;
}) {
  return (
    <>
      {depths.map((depth, i) => (
        <div
          key={depth}
          className={cn("absolute inset-0", radiusClass)}
          style={{
            transform: `translateZ(-${depth}px)`,
            backgroundColor: colors[i] ?? colors[colors.length - 1],
          }}
        />
      ))}
    </>
  );
}

/** Shared brand motif: periwinkle pyramid base crowned by a lime-accented eye. */
function BrandEyePyramid({
  gradId,
  className,
}: {
  gradId: string;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 120 112" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9fa2ff" />
          <stop offset="100%" stopColor="#6c6ff0" />
        </linearGradient>
      </defs>
      <polygon points="44,34 76,34 108,104 12,104" fill={`url(#${gradId})`} />
      <polygon points="60,34 76,34 108,104 64,104" fill="#171b33" opacity="0.14" />
      <path d="M24 38 Q60 12 96 38 Q60 64 24 38 Z" fill="#d9f72e" />
      <path d="M38 38 Q60 22 82 38 Q60 54 38 38 Z" fill="#f7f9ff" />
      <circle cx="60" cy="38" r="9.5" fill="#15192b" />
      <circle cx="63.5" cy="34.5" r="2.6" fill="#ffffff" opacity="0.85" />
    </svg>
  );
}

/**
 * Full-section 3D animated advertising & design studio visual.
 * Spans the entire section as an atmospheric 3D stage with CSS 3D transforms,
 * IntersectionObserver viewport pausing, reduced-motion support, and pause control.
 */
export function AdvertisingVisual3D({
  alt = "Best Advertising Agency in Lucknow",
  className,
}: AdvertisingVisual3DProps) {
  const uid = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [userPaused, setUserPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [tilt, setTilt] = useState<{ rx: number; ry: number; active: boolean }>({
    rx: 0,
    ry: 0,
    active: false,
  });
  const canHoverRef = useRef(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

    const syncPreferences = () => {
      setPrefersReducedMotion(motionQuery.matches);
      canHoverRef.current = pointerQuery.matches && !motionQuery.matches;
    };

    syncPreferences();
    motionQuery.addEventListener("change", syncPreferences);
    pointerQuery.addEventListener("change", syncPreferences);

    return () => {
      motionQuery.removeEventListener("change", syncPreferences);
      pointerQuery.removeEventListener("change", syncPreferences);
    };
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canHoverRef.current || userPaused) return;
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rx: Number((-y * 7).toFixed(2)),
      ry: Number((x * 9).toFixed(2)),
      active: true,
    });
  };

  const handleMouseLeave = () => {
    if (tilt.active) {
      setTilt({ rx: 0, ry: 0, active: false });
    }
  };

  const isAnimationPaused = !inView || userPaused;

  return (
    <div
      ref={rootRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        styles.root,
        styles.backdrop,
        isAnimationPaused && styles.paused,
        "absolute inset-0 select-none overflow-hidden",
        className
      )}
    >
      {/* Full-section ambient studio grid, lights & readability scrim */}
      <div
        aria-hidden="true"
        className={cn(styles.studioGrid, "pointer-events-none absolute inset-0")}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[8%] right-[14%] h-[42%] w-[42%] rounded-full bg-[#d9f72e]/12 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[4%] bottom-[12%] h-[48%] w-[48%] rounded-full bg-[#8b8eff]/18 blur-3xl"
      />
      {/* Left contrast vignette on desktop so section copy reads crisply */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#39025F]/30 to-[#280146]/65 lg:bg-gradient-to-r lg:from-[#260142]/75 lg:via-[#39025F]/35 lg:to-transparent"
      />

      {/* Semantic 3D object stage positioned cleanly inside the full-section canvas */}
      <div
        role="img"
        aria-label={alt}
        className="pointer-events-none relative mx-auto flex h-full w-full max-w-[1240px] items-start justify-center px-4 pt-8 sm:px-6 sm:pt-10 lg:items-center lg:justify-end lg:px-8 lg:pt-0"
      >
        <div className="relative aspect-[1146/1080] w-full max-w-[275px] sm:max-w-[350px] lg:w-[46%] lg:max-w-[500px]">
          {/* Grounded studio floor shadow */}
          <div
            aria-hidden="true"
            className={cn(
              styles.floorShadow,
              "pointer-events-none absolute bottom-[4%] left-1/2 h-[12%] w-[82%] rounded-full blur-lg"
            )}
          />

          {/* Interactive pointer parallax container */}
          <div
            aria-hidden="true"
            className={cn(styles.tiltShell, "relative h-full w-full")}
            style={{
              transform: tilt.active
                ? `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`
                : "rotateX(0deg) rotateY(0deg)",
            }}
          >
            {/* Continuous 3D orbital stage */}
            <div className={cn(styles.stageOrbit, "relative h-full w-full")}>
              {/* OBJECT 1 (Back-Left): Sculpted Lime-Yellow 3D Monolith + Eye Crest */}
              <div
                className={cn(
                  styles.monolithFloat,
                  "absolute top-[4%] left-[4%] h-[58%] w-[44%]"
                )}
              >
                <div
                  className="absolute bottom-[2%] left-[8%] h-[16%] w-[86%] rounded-full bg-[#090b15]/60 blur-md"
                  style={{ transform: "translateZ(-16px)" }}
                />
                <svg
                  viewBox="0 0 200 245"
                  className="relative h-full w-full drop-shadow-[0_14px_24px_rgba(8,10,22,0.55)]"
                >
                  <defs>
                    <linearGradient id={`${uid}-limeFront`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#e6ff47" />
                      <stop offset="55%" stopColor="#d4f423" />
                      <stop offset="100%" stopColor="#adc910" />
                    </linearGradient>
                    <linearGradient id={`${uid}-limeSide`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#c2e018" />
                      <stop offset="100%" stopColor="#8da50a" />
                    </linearGradient>
                  </defs>

                  <polygon points="22,208 98,190 176,208 158,236 44,236" fill="#232844" />
                  <polygon points="22,208 44,236 104,236 98,214" fill="#31375c" />
                  <polygon points="104,236 158,236 176,208 98,214" fill="#171b30" />

                  <polygon points="48,96 98,52 146,84 138,162 56,162" fill={`url(#${uid}-limeFront)`} />
                  <polygon points="38,118 56,162 110,214 58,214" fill="#b9d612" />
                  <polygon points="56,162 138,162 150,210 110,214" fill={`url(#${uid}-limeFront)`} />
                  <polygon points="138,162 162,130 156,196 150,210" fill={`url(#${uid}-limeSide)`} />
                  <polygon points="98,52 146,84 162,130 138,162" fill="#c7e819" opacity="0.88" />

                  <rect x="26" y="136" width="14" height="14" rx="2" fill="#d9f72e" />
                  <rect x="160" y="96" width="12" height="12" rx="2" fill="#c5e617" />
                  <rect x="172" y="108" width="9" height="9" rx="1.5" fill="#9eb80e" />
                </svg>

                <div
                  className={cn(
                    styles.monolithEyeFloat,
                    "absolute -top-[3%] left-[22%] h-[28%] w-[58%]"
                  )}
                >
                  <svg
                    viewBox="0 0 120 84"
                    className="h-full w-full drop-shadow-[0_10px_14px_rgba(12,16,32,0.5)]"
                  >
                    <polygon points="60,2 78,34 42,34" fill="#dcf932" />
                    <polygon points="60,2 78,34 60,34" fill="#b8d514" />
                    <path d="M12 46 Q60 12 108 46 Q60 80 12 46 Z" fill="#f7f9ff" />
                    <path d="M12 46 Q60 76 108 46 Q60 66 12 46 Z" fill="#cfd6ee" />
                    <circle cx="60" cy="46" r="17" fill="#8b8eff" />
                    <circle cx="60" cy="46" r="10.5" fill="#14182a" />
                    <circle cx="65" cy="41" r="3.5" fill="#ffffff" opacity="0.9" />
                  </svg>
                </div>
              </div>

              {/* OBJECT 2 (Back-Right): 3D White Brand Shopping Bag */}
              <div
                className={cn(
                  styles.bagFloat,
                  "absolute top-[11%] right-[5%] h-[42%] w-[33%]"
                )}
              >
                <svg
                  viewBox="0 0 100 36"
                  className="mx-auto -mb-[8%] h-[22%] w-[52%] overflow-visible"
                >
                  <path
                    d="M22 34 C22 8, 78 8, 78 34"
                    fill="none"
                    stroke="#121626"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M22 34 C22 10, 78 10, 78 34"
                    fill="none"
                    stroke="#3b4266"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>

                <div className="relative h-[82%] w-full [transform-style:preserve-3d]">
                  <ExtrudedDepthSlices
                    depths={BAG_DEPTH_SLICES}
                    colors={BAG_EDGE_COLORS}
                    radiusClass="rounded-[10px]"
                  />
                  <div
                    className="relative flex h-full w-full items-center justify-center rounded-[10px] p-[12%]"
                    style={{
                      background: "linear-gradient(145deg, #ffffff 0%, #eaedf9 65%, #d5dbf0 100%)",
                      boxShadow:
                        "0 18px 28px rgba(8,10,22,0.52), inset 0 1.5px 2px rgba(255,255,255,0.9), inset -8px 0 14px rgba(139,142,255,0.14)",
                    }}
                  >
                    <div className="absolute inset-x-0 top-[10%] h-px bg-[#cdd4ea]" />
                    <BrandEyePyramid gradId={`${uid}-bagPyr`} className="mt-[8%] h-[72%] w-[78%]" />
                  </div>
                </div>
              </div>

              {/* OBJECT 3 (Bottom-Left): Fanned 3D Color Swatch Deck */}
              <div
                className={cn(
                  styles.swatchFloat,
                  "absolute bottom-[10%] left-[4%] h-[22%] w-[28%]"
                )}
              >
                {SWATCH_CARDS.map((card, i) => (
                  <div
                    key={i}
                    className="absolute inset-x-0 h-[44%] origin-right rounded-[6px] border border-white/20"
                    style={{
                      top: card.y,
                      transform: `translateZ(${card.z}px) rotateZ(${card.rotate})`,
                      background: `linear-gradient(90deg, ${card.color} 0%, ${card.color} 72%, ${card.tip} 72%, ${card.tip} 100%)`,
                      boxShadow: "0 8px 14px rgba(7,9,18,0.48)",
                    }}
                  />
                ))}
              </div>

              {/* OBJECT 4 (Center-Front Hero): Angled 3D Pen Display Tablet */}
              <div
                className={cn(
                  styles.tabletFloat,
                  "absolute right-[10%] bottom-[13%] h-[47%] w-[64%]"
                )}
              >
                <div
                  className="absolute bottom-[4%] -left-[9%] h-[78%] w-[26%] origin-right rounded-l-[10px]"
                  style={{
                    transform: "translateZ(-18px) rotateY(32deg)",
                    background: "linear-gradient(160deg, #3b426b 0%, #232847 100%)",
                    boxShadow: "0 16px 26px rgba(6,8,18,0.65)",
                  }}
                />
                <div
                  className="absolute inset-0 rounded-[16px] bg-[#060813]/70 blur-lg"
                  style={{ transform: "translate3d(8px, 14px, -18px)" }}
                />
                <ExtrudedDepthSlices
                  depths={TABLET_DEPTH_SLICES}
                  colors={TABLET_EDGE_COLORS}
                  radiusClass="rounded-[16px]"
                />

                <div
                  className="relative flex h-full w-full flex-col justify-center overflow-hidden rounded-[16px] p-[4.5%] [transform-style:preserve-3d]"
                  style={{
                    background: "linear-gradient(145deg, #373d66 0%, #262b4a 55%, #1c203a 100%)",
                    boxShadow:
                      "inset 0 1.5px 2px rgba(255,255,255,0.28), inset 0 -2px 4px rgba(8,10,20,0.6)",
                  }}
                >
                  <div
                    className="relative grid h-full w-full grid-cols-12 gap-[3%] overflow-hidden rounded-[10px] bg-[#f7f8ff] p-[4%]"
                    style={{
                      boxShadow: "inset 0 2px 6px rgba(18,22,44,0.28)",
                      transform: "translateZ(4px)",
                    }}
                  >
                    <div
                      className={cn(
                        styles.screenSheen,
                        "pointer-events-none absolute inset-y-0 -left-1/3 z-20 w-2/3"
                      )}
                    />

                    <div className="col-span-2 flex flex-col justify-between rounded-[6px] bg-[#e9ecf8] p-[16%]">
                      {TOOL_BUTTON_TONES.map((tone, idx) => (
                        <span
                          key={idx}
                          className="block aspect-square w-full rounded-[3px]"
                          style={{ backgroundColor: tone, opacity: 0.9 }}
                        />
                      ))}
                    </div>

                    <div className="col-span-7 flex items-center justify-center rounded-[6px] border border-[#dfe4f4] bg-white p-[6%]">
                      <BrandEyePyramid gradId={`${uid}-tabPyr`} className="h-[88%] w-[88%]" />
                    </div>

                    <div className="col-span-3 flex flex-col justify-between rounded-[6px] bg-[#eceff9] p-[14%]">
                      <div className="mx-auto flex aspect-square w-[74%] items-center justify-center rounded-full bg-[#191e34]">
                        <span className="block size-[58%] rounded-full bg-[#d9f72e]" />
                      </div>
                      <div className="flex flex-1 flex-col justify-evenly pt-[12%]">
                        <div className="h-[14%] max-h-[7px] min-h-[3px] w-full rounded-full bg-[#8b8eff]" />
                        <div className="h-[14%] max-h-[7px] min-h-[3px] w-4/5 rounded-full bg-[#b9c0e0]" />
                        <div className="h-[14%] max-h-[7px] min-h-[3px] w-full rounded-full bg-[#d9f72e]" />
                        <div className="h-[14%] max-h-[7px] min-h-[3px] w-3/4 rounded-full bg-[#b9c0e0]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={cn(
                    styles.stylusShadowFloat,
                    "pointer-events-none absolute top-[18%] right-[6%] h-[68%] w-[7%] rounded-full bg-[#14182b] blur-[4px]"
                  )}
                />

                <div
                  className={cn(
                    styles.stylusFloat,
                    "pointer-events-none absolute -top-[10%] right-[2%] flex h-[86%] w-[7.5%] flex-col items-center"
                  )}
                >
                  <div className="h-[11%] w-full rounded-t-full bg-[#363d66]" />
                  <div
                    className="relative flex-1 w-full"
                    style={{
                      background: "linear-gradient(90deg, #ffffff 0%, #e7ebf8 65%, #bfc7e3 100%)",
                      boxShadow: "0 8px 16px rgba(10,12,24,0.4)",
                    }}
                  >
                    <div className="mx-auto mt-[42%] h-[22%] w-[45%] rounded-full bg-[#242945]" />
                  </div>
                  <div className="h-[8%] w-[108%] rounded-[2px] bg-[#242945]" />
                  <div
                    className="h-[16%] w-full"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                      background: "linear-gradient(90deg, #4b5280 0%, #1d2138 100%)",
                    }}
                  />
                </div>
              </div>

              {/* OBJECT 6 (Foreground Right): Faceted 3D Indigo Eye Prism */}
              <div
                className={cn(
                  styles.prismFloat,
                  "absolute right-[13%] bottom-[6%] h-[15%] w-[14%]"
                )}
              >
                <svg
                  viewBox="0 0 80 76"
                  className="h-full w-full drop-shadow-[0_10px_14px_rgba(6,8,18,0.65)]"
                >
                  <polygon points="40,4 6,66 44,72" fill="#5e64cc" />
                  <polygon points="40,4 44,72 74,58" fill="#282d52" />
                  <circle cx="38" cy="40" r="8" fill="#f7f9ff" />
                  <circle cx="38" cy="40" r="4.2" fill="#15192b" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Discreet accessible animation pause/play control (WCAG 2.2.2) */}
      {!prefersReducedMotion && (
        <button
          type="button"
          onClick={() => setUserPaused((p) => !p)}
          aria-label={userPaused ? "Play 3D advertising animation" : "Pause 3D advertising animation"}
          className="absolute right-4 bottom-4 z-20 flex size-9 items-center justify-center rounded-full border border-white/20 bg-[#24013d]/75 text-white/90 backdrop-blur-md transition-colors hover:bg-[#24013d]/95 hover:text-white"
        >
          {userPaused ? (
            <Play aria-hidden className="size-4 fill-current" />
          ) : (
            <Pause aria-hidden className="size-4" />
          )}
        </button>
      )}
    </div>
  );
}
