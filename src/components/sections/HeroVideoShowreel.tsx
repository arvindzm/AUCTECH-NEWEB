"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Volume2, VolumeX, Play } from "lucide-react";
import { assetPath, company } from "@/lib/site";

interface HeroVideoShowreelProps {
  src?: string;
}

type IntroPhase = "intro" | "done";

export function HeroVideoShowreel({
  src = "img/Showreel.mp4",
}: HeroVideoShowreelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<IntroPhase>("intro");
  const phaseRef = useRef<IntroPhase>("intro");
  phaseRef.current = phase;

  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  // Welcome intro completes reveal + fade within 2s (2000ms), then starts the hero video.
  useEffect(() => {
    const finishIntroTimer = window.setTimeout(() => {
      setPhase("done");
    }, 2000);

    return () => {
      window.clearTimeout(finishIntroTimer);
    };
  }, []);

  // Start playing the existing hero video only after the intro overlay has disappeared.
  useEffect(() => {
    if (phase !== "done") return;
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [phase]);

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  const togglePlay = () => {
    if (phaseRef.current !== "done") return;
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <div
      onClick={togglePlay}
      className="group relative w-full pt-16 sm:pt-0 sm:h-screen sm:min-h-[580px] lg:min-h-[700px] overflow-hidden bg-black cursor-pointer select-none"
    >
      <style>{`
        /* Headline Highlight + Display on Interaction wipe (inspired by headline-interactions.webflow.io) */
        @keyframes wf-text-reveal {
          0% {
            clip-path: inset(0 100% 0 0);
          }
          36%,
          100% {
            clip-path: inset(0 0% 0 0);
          }
        }
        @keyframes wf-highlight-sweep {
          0% {
            transform-origin: left center;
            transform: scaleX(0);
          }
          36% {
            transform-origin: left center;
            transform: scaleX(1);
          }
          37% {
            transform-origin: right center;
            transform: scaleX(1);
          }
          100% {
            transform-origin: right center;
            transform: scaleX(0);
          }
        }
        @keyframes wf-rule-grow {
          0% {
            transform-origin: left center;
            transform: scaleX(0);
          }
          100% {
            transform-origin: left center;
            transform: scaleX(1);
          }
        }
        @keyframes wf-overlay-exit {
          0%,
          62% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        .wf-overlay-exit {
          animation: wf-overlay-exit 2s ease-out both;
        }
        .wf-rule {
          animation: wf-rule-grow 0.34s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .wf-reveal-sub {
          animation: wf-text-reveal 0.58s cubic-bezier(0.65, 0, 0.35, 1) 0.06s both;
        }
        .wf-hl-sub {
          animation: wf-highlight-sweep 0.58s cubic-bezier(0.65, 0, 0.35, 1) 0.06s both;
        }
        .wf-reveal-1 {
          animation: wf-text-reveal 0.66s cubic-bezier(0.65, 0, 0.35, 1) 0.16s both;
        }
        .wf-hl-1 {
          animation: wf-highlight-sweep 0.66s cubic-bezier(0.65, 0, 0.35, 1) 0.16s both;
        }
        .wf-reveal-2 {
          animation: wf-text-reveal 0.68s cubic-bezier(0.65, 0, 0.35, 1) 0.28s both;
        }
        .wf-hl-2 {
          animation: wf-highlight-sweep 0.68s cubic-bezier(0.65, 0, 0.35, 1) 0.28s both;
        }
        .wf-reveal-logo {
          animation: wf-text-reveal 0.66s cubic-bezier(0.65, 0, 0.35, 1) 0.22s both;
        }
        .wf-hl-logo {
          animation: wf-highlight-sweep 0.66s cubic-bezier(0.65, 0, 0.35, 1) 0.22s both;
        }
        @media (prefers-reduced-motion: reduce) {
          .wf-overlay-exit,
          .wf-rule,
          .wf-reveal-sub,
          .wf-reveal-1,
          .wf-reveal-2,
          .wf-reveal-logo {
            animation: none !important;
            clip-path: none !important;
            transform: none !important;
          }
          .wf-hl-sub,
          .wf-hl-1,
          .wf-hl-2,
          .wf-hl-logo {
            display: none !important;
          }
        }
      `}</style>

      <div className="relative h-full w-full">
        {/* Welcome Intro Overlay strictly over Hero video (Navbar z-50 stays above z-20) */}
        {phase !== "done" && (
          <div
            aria-live="polite"
            onAnimationEnd={(e) => {
              if (e.animationName === "wf-overlay-exit") {
                setPhase("done");
              }
            }}
            className="wf-overlay-exit pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-hidden px-5 backdrop-blur-sm sm:px-8"
            style={{
              background:
                "radial-gradient(65% 75% at 50% 42%, rgba(230, 0, 122, 0.18) 0%, transparent 64%), linear-gradient(145deg, rgba(18, 0, 32, 0.95) 0%, rgba(29, 1, 52, 0.93) 48%, rgba(40, 1, 70, 0.95) 100%)",
            }}
          >
            {/* Subtle Auctech brand grid */}
            <div aria-hidden="true" className="grid-lines pointer-events-none absolute inset-0 opacity-55" />

            <div className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between gap-4 sm:gap-10">
              {/* Left: Subhead + Headline Highlight Reveal */}
              <div className="flex min-w-0 flex-col items-start text-left">
                {/* Subhead row: left magenta rule + highlight-wipe subhead */}
                <div className="flex items-center gap-2 sm:gap-3.5">
                  <span aria-hidden="true" className="wf-rule h-[2px] w-5 shrink-0 bg-[#E6007A] sm:w-14" />
                  <div className="relative inline-block overflow-hidden">
                    <p className="wf-reveal-sub text-[10px] font-bold tracking-[0.18em] text-[#E6007A] uppercase sm:text-sm sm:tracking-[0.2em]">
                      Hello, Welcome to
                    </p>
                    <span
                      aria-hidden="true"
                      className="wf-hl-sub pointer-events-none absolute inset-0 z-10 bg-[#E6007A]"
                    />
                  </div>
                </div>

                {/* Headline lines: staggered white & magenta highlight blocks wiping off to reveal text */}
                <div className="mt-1.5 flex flex-col items-start gap-0.5 sm:mt-3 sm:gap-1.5">
                  <div className="relative inline-block overflow-hidden pr-1">
                    <span className="wf-reveal-1 block text-xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                      Auctech
                    </span>
                    <span
                      aria-hidden="true"
                      className="wf-hl-1 pointer-events-none absolute inset-0 z-10 bg-white"
                    />
                  </div>

                  <div className="relative inline-block overflow-hidden pr-1">
                    <span className="wf-reveal-2 block text-xl font-extrabold leading-tight tracking-tight text-[#E6007A] sm:text-5xl lg:text-6xl">
                      IT Solutions
                    </span>
                    <span
                      aria-hidden="true"
                      className="wf-hl-2 pointer-events-none absolute inset-0 z-10 bg-[#E6007A]"
                    />
                  </div>
                </div>
              </div>

              {/* Right Center: Official Auctech Logo with matching highlight wipe */}
              <div className="relative shrink-0 self-center">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-4 rounded-full bg-[#E6007A]/25 blur-2xl"
                />
                <div className="relative overflow-hidden rounded-xl sm:rounded-3xl">
                  <div className="wf-reveal-logo rounded-xl bg-white px-2.5 py-1.5 shadow-[0_18px_48px_-12px_rgba(230,0,122,0.5)] sm:rounded-3xl sm:px-7 sm:py-5">
                    <Image
                      src="/brand/auctech-logo.png"
                      alt="Auctech IT Solutions"
                      width={company.logo.width}
                      height={company.logo.height}
                      priority
                      unoptimized
                      className="h-7 w-auto object-contain sm:h-14 lg:h-20"
                    />
                  </div>
                  <span
                    aria-hidden="true"
                    className="wf-hl-logo pointer-events-none absolute inset-0 z-10 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Existing Hero Background Video (paused at frame 0 during intro, plays once intro disappears) */}
        <video
          ref={(el) => {
            if (el) {
              el.muted = true;
              el.defaultMuted = true;
            }
            videoRef.current = el;
          }}
          src={assetPath(src)}
          loop
          muted
          playsInline
          preload="auto"
          className="w-full aspect-video sm:aspect-auto sm:h-full sm:w-full object-cover"
          onCanPlay={(e) => {
            if (phaseRef.current !== "done") return;
            const v = e.currentTarget;
            v.muted = true;
            const p = v.play();
            if (p !== undefined) {
              p.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
            }
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      </div>

      {/* Subtle top vignette for crystal clear navbar legibility on desktop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b from-black/50 via-black/20 to-transparent hidden sm:block"
      />

      {/* Floating Audio Toggle */}
      <button
        type="button"
        onClick={toggleSound}
        aria-label={isMuted ? "Unmute showreel audio" : "Mute showreel audio"}
        className={`absolute bottom-3 right-3 sm:bottom-6 sm:right-6 flex items-center gap-2 rounded-full bg-black/70 px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-bold text-white backdrop-blur-md border border-white/25 shadow-2xl transition-all hover:scale-105 hover:bg-[#E6007A] active:scale-95 z-30 ${
          phase === "done" ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {isMuted ? (
          <>
            <VolumeX className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="text-[11px] sm:text-xs">Unmute</span>
          </>
        ) : (
          <>
            <Volume2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400" />
            <span className="text-[11px] sm:text-xs">Mute</span>
          </>
        )}
      </button>

      {/* Paused Indicator (shown only after intro completes if playback was blocked or paused) */}
      {phase === "done" && !isPlaying && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <span className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#E6007A] text-white shadow-2xl">
            <Play className="h-6 w-6 sm:h-7 sm:w-7 ml-1" />
          </span>
        </div>
      )}
    </div>
  );
}
