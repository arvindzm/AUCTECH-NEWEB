"use client";

import React, { useRef, useState, useEffect } from "react";
import { Volume2, VolumeX, Play } from "lucide-react";
import { assetPath } from "@/lib/site";

interface HeroVideoShowreelProps {
  src?: string;
}

export function HeroVideoShowreel({
  src = "img/Showreel.mp4",
}: HeroVideoShowreelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  // Guarantee instant autoplay
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    }
  }, []);

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  const togglePlay = () => {
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
      <video
        ref={(el) => {
          if (el) {
            el.muted = true;
            el.defaultMuted = true;
          }
          videoRef.current = el;
        }}
        src={assetPath(src)}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="w-full aspect-video sm:aspect-auto sm:h-full sm:w-full object-cover"
        onCanPlay={(e) => {
          const v = e.currentTarget;
          v.muted = true;
          const p = v.play();
          if (p !== undefined) {
            p.then(() => setIsPlaying(true)).catch(() => {});
          }
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Subtle top vignette for crystal clear navbar legibility on desktop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/50 via-black/20 to-transparent hidden sm:block"
      />

      {/* Floating Audio Toggle */}
      <button
        type="button"
        onClick={toggleSound}
        aria-label={isMuted ? "Unmute showreel audio" : "Mute showreel audio"}
        className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 flex items-center gap-2 rounded-full bg-black/70 px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-bold text-white backdrop-blur-md border border-white/25 shadow-2xl transition-all hover:scale-105 hover:bg-[#E6007A] active:scale-95 z-30"
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

      {/* Paused Indicator */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <span className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#E6007A] text-white shadow-2xl">
            <Play className="h-6 w-6 sm:h-7 sm:w-7 ml-1" />
          </span>
        </div>
      )}
    </div>
  );
}
