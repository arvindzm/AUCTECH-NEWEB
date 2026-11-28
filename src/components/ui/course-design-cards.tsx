"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, MoreVertical, Plus } from "lucide-react";
import { cn } from "@/lib/cn";

export type CourseCardColor = "green" | "orange" | "red" | "blue";

export interface CourseDesignCardData {
  id: string | number;
  colorClass: CourseCardColor;
  date: string;
  title: string;
  description: string;
  progressLabel?: string;
  progressPercent: string;
  progressValue: string;
  imgSrc1?: string;
  imgAlt1?: string;
  imgSrc2?: string;
  imgAlt2?: string;
  initials1?: string;
  initials2?: string;
  countdownText: string;
  href?: string;
}

const COLOR_THEMES: Record<
  CourseCardColor,
  {
    glow: string;
    bar: string;
    pillText: string;
    pillBg: string;
    ringHover: string;
    avatarBg1: string;
    avatarBg2: string;
  }
> = {
  green: {
    glow: "radial-gradient(ellipse at right top, rgba(16, 118, 103, 0.92) 0%, #151419 48%, #151419 100%)",
    bar: "bg-[#01c3a8]",
    pillText: "text-[#01c3a8]",
    pillBg: "bg-[#01c3a8]/15 group-hover:bg-[#01c3a8] group-hover:text-[#151419]",
    ringHover: "hover:border-[#01c3a8]/60",
    avatarBg1: "bg-[#01c3a8] text-[#151419]",
    avatarBg2: "bg-[#107667] text-white",
  },
  orange: {
    glow: "radial-gradient(ellipse at right top, rgba(255, 183, 65, 0.72) 0%, #151419 48%, #151419 100%)",
    bar: "bg-[#ffb741]",
    pillText: "text-[#ffb741]",
    pillBg: "bg-[#ffb741]/15 group-hover:bg-[#ffb741] group-hover:text-[#151419]",
    ringHover: "hover:border-[#ffb741]/60",
    avatarBg1: "bg-[#ffb741] text-[#151419]",
    avatarBg2: "bg-[#a36a14] text-white",
  },
  red: {
    glow: "radial-gradient(ellipse at right top, rgba(166, 61, 42, 0.9) 0%, #151419 48%, #151419 100%)",
    bar: "bg-[#d4563f]",
    pillText: "text-[#f27c66]",
    pillBg: "bg-[#a63d2a]/25 group-hover:bg-[#d4563f] group-hover:text-white",
    ringHover: "hover:border-[#d4563f]/65",
    avatarBg1: "bg-[#d4563f] text-white",
    avatarBg2: "bg-[#7e2b1d] text-white",
  },
  blue: {
    glow: "radial-gradient(ellipse at right top, rgba(0, 69, 143, 0.95) 0%, #151419 48%, #151419 100%)",
    bar: "bg-[#1890ff]",
    pillText: "text-[#4da6ff]",
    pillBg: "bg-[#1890ff]/18 group-hover:bg-[#1890ff] group-hover:text-white",
    ringHover: "hover:border-[#1890ff]/60",
    avatarBg1: "bg-[#1890ff] text-white",
    avatarBg2: "bg-[#00458f] text-white",
  },
};

export default function CourseDesignCard({ data }: { data: CourseDesignCardData }) {
  const theme = COLOR_THEMES[data.colorClass] ?? COLOR_THEMES.green;
  const href = data.href || "/service";

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col justify-between overflow-hidden rounded-[2rem] border border-white/10 p-6 text-white shadow-[0_14px_34px_-12px_rgba(21,20,25,0.55)] transition-all duration-300 hover:-translate-y-1.5",
        theme.ringHover
      )}
      style={{ background: theme.glow }}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between text-xs font-medium text-white/70">
        <span>{data.date}</span>
        <span
          aria-hidden="true"
          className="flex size-7 items-center justify-center rounded-full text-white/60 transition-colors group-hover:bg-white/10 group-hover:text-white"
        >
          <MoreVertical className="size-4" />
        </span>
      </div>

      {/* Card Body */}
      <div className="mt-6 flex-1">
        <h3 className="text-xl font-bold tracking-tight !text-white capitalize">
          {data.title}
        </h3>
        <p className="mt-2.5 text-sm leading-relaxed text-white/75">
          {data.description}
        </p>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-white/85">{data.progressLabel || "Delivery & Quality"}</span>
            <span className="tabular-nums text-white">{data.progressPercent}</span>
          </div>
          <div
            className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/12"
            role="presentation"
          >
            <div
              className={cn("h-full rounded-full transition-all duration-700", theme.bar)}
              style={{ width: data.progressValue }}
            />
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
        <div className="flex items-center">
          {data.imgSrc1 ? (
            <img
              src={data.imgSrc1}
              alt={data.imgAlt1 || "Team specialist"}
              className="size-8 rounded-full border-2 border-[#151419] object-cover"
            />
          ) : (
            <span
              className={cn(
                "flex size-8 items-center justify-center rounded-full border-2 border-[#151419] text-[10px] font-extrabold",
                theme.avatarBg1
              )}
              title={data.imgAlt1 || "Specialist"}
            >
              {data.initials1 || "AT"}
            </span>
          )}
          {data.imgSrc2 ? (
            <img
              src={data.imgSrc2}
              alt={data.imgAlt2 || "Project lead"}
              className="-ml-2.5 size-8 rounded-full border-2 border-[#151419] object-cover"
            />
          ) : (
            <span
              className={cn(
                "-ml-2.5 flex size-8 items-center justify-center rounded-full border-2 border-[#151419] text-[10px] font-extrabold",
                theme.avatarBg2
              )}
              title={data.imgAlt2 || "Lead"}
            >
              {data.initials2 || "3D"}
            </span>
          )}
          <span
            aria-hidden="true"
            className="-ml-2.5 flex size-8 items-center justify-center rounded-full border-2 border-[#151419] bg-white/12 text-white/85"
          >
            <Plus className="size-3.5" />
          </span>
        </div>

        <Link
          href={href}
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all",
            theme.pillBg,
            theme.pillText
          )}
        >
          <span>{data.countdownText}</span>
          <ArrowUpRight aria-hidden className="size-3.5" />
        </Link>
      </div>
    </article>
  );
}
