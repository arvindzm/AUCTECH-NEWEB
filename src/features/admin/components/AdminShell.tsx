"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ExternalLink, ImageIcon, LogOut, Menu, Settings, UserRound, X } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { adminNav } from "@/features/admin/config/resources";
import { ConfirmDialog } from "@/features/admin/components/ui";
import { cn } from "@/lib/cn";

const systemNav = [
  { href: "/admin/media", label: "Media Library", icon: ImageIcon },
  { href: "/admin/settings", label: "Website Settings", icon: Settings },
  { href: "/admin/profile", label: "Profile & Account", icon: UserRound },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [logout, setLogout] = useState(false);
  useEffect(() => setOpen(false), [path]);
  const groups = [...adminNav, { group: "System", items: systemNav }];
  const isActive = (href: string) => (href === "/admin" ? path === "/admin" : path === href || path.startsWith(href + "/"));

  const nav = (
    <nav aria-label="Admin" className="flex-1 overflow-y-auto px-3 py-4">
      {groups.map((g) => (
        <div key={g.group} className="mb-5">
          <p className="px-3 pb-1.5 text-[11px] font-bold uppercase tracking-widest text-white/40">{g.group}</p>
          <ul className="space-y-0.5">
            {g.items.map((it) => {
              const I = it.icon;
              return (
                <li key={it.href}>
                  <Link href={it.href} aria-current={isActive(it.href) ? "page" : undefined}
                    className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition",
                      isActive(it.href) ? "bg-[#E2E800] text-[#141414]" : "text-white/75 hover:bg-white/10 hover:text-white")}>
                    <I aria-hidden className="size-4 shrink-0" />{it.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="min-h-dvh bg-surface">
      <a href="#admin-main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2">Skip to content</a>
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-navy lg:flex">
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5"><Logo height={40} href="/admin" /><span className="rounded bg-white/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white/70">CMS</span></div>
        {nav}
      </aside>
      {/* Mobile drawer */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", open ? "visible" : "invisible")}>
        <div className={cn("absolute inset-0 bg-ink/50 transition-opacity", open ? "opacity-100" : "opacity-0")} onClick={() => setOpen(false)} />
        <aside className={cn("absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-navy transition-transform", open ? "translate-x-0" : "-translate-x-full")}>
          <div className="flex h-16 items-center justify-between border-b border-white/10 px-5"><Logo height={40} href="/admin" />
            <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="flex size-9 items-center justify-center rounded-lg text-white hover:bg-white/10"><X className="size-5" /></button></div>
          {nav}
        </aside>
      </div>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <button type="button" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)} className="flex size-10 items-center justify-center rounded-lg border border-line lg:hidden"><Menu className="size-5" /></button>
          <span className="hidden rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 sm:inline">UI preview · backend not connected</span>
          <div className="ml-auto flex items-center gap-1">
            <a href="/" target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-ink-soft hover:bg-surface"><ExternalLink className="size-4" /><span className="hidden sm:inline">View website</span></a>
            <Link href="/admin/profile" aria-label="Profile" className="flex size-10 items-center justify-center rounded-full border border-[#E2E800]/30 bg-[#141414] text-[#E2E800] transition hover:bg-[#E2E800] hover:text-[#141414]"><UserRound className="size-4" /></Link>
            <button type="button" onClick={() => setLogout(true)} aria-label="Sign out" className="flex size-10 items-center justify-center rounded-lg text-ink-soft hover:bg-surface"><LogOut className="size-4" /></button>
          </div>
        </header>
        <main id="admin-main" className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
      <ConfirmDialog open={logout} tone="primary" title="Sign out?" confirmLabel="Sign out" text="You'll return to the sign-in screen. Unsaved session changes will be lost."
        onCancel={() => setLogout(false)} onConfirm={() => router.push("/admin/login")} />
    </div>
  );
}
