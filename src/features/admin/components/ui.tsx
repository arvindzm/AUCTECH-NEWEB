"use client";
/** Admin UI kit — intentionally separate from public-site components. */
import { useEffect, useRef } from "react";
import Link from "next/link";
import { AlertTriangle, Inbox, Loader2, PlugZap, X } from "lucide-react";
import { cn } from "@/lib/cn";

type BtnVariant = "primary" | "secondary" | "ghost" | "danger";
const btn: Record<BtnVariant, string> = {
  primary: "bg-brand-700 text-white hover:bg-brand-800 shadow-sm",
  secondary: "border border-line bg-white text-ink hover:bg-surface",
  ghost: "text-ink-soft hover:bg-surface",
  danger: "bg-red-600 text-white hover:bg-red-700",
};
export function ABtn({ variant = "primary", loading, className, children, ...rest }: { variant?: BtnVariant; loading?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn("inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50", btn[variant], className)}
      disabled={loading || rest.disabled} aria-busy={loading || undefined} {...rest}>
      {loading && <Loader2 aria-hidden className="size-4 animate-spin" />}{children}
    </button>
  );
}
export function ALink({ href, variant = "primary", className, children }: { href: string; variant?: BtnVariant; className?: string; children: React.ReactNode }) {
  return <Link href={href} className={cn("inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 text-sm font-semibold transition", btn[variant], className)}>{children}</Link>;
}

export function Card({ className, children, title, actions }: { className?: string; children: React.ReactNode; title?: string; actions?: React.ReactNode }) {
  return (
    <section className={cn("rounded-2xl border border-line bg-white", className)}>
      {(title || actions) && <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-4"><h2 className="text-base font-bold">{title}</h2>{actions}</header>}
      <div className="p-5">{children}</div>
    </section>
  );
}

const STATUS_TONE: Record<string, string> = {
  published: "bg-emerald-50 text-emerald-700 ring-emerald-200", open: "bg-emerald-50 text-emerald-700 ring-emerald-200", hired: "bg-emerald-50 text-emerald-700 ring-emerald-200", closed: "bg-slate-100 text-slate-700 ring-slate-200",
  draft: "bg-amber-50 text-amber-800 ring-amber-200", archived: "bg-slate-100 text-slate-600 ring-slate-200", "pending-approval": "bg-violet-50 text-violet-700 ring-violet-200",
  new: "bg-brand-50 text-brand-700 ring-brand-200", received: "bg-brand-50 text-brand-700 ring-brand-200", contacted: "bg-sky-50 text-sky-700 ring-sky-200", "in-progress": "bg-amber-50 text-amber-800 ring-amber-200",
  shortlisted: "bg-sky-50 text-sky-700 ring-sky-200", interview: "bg-amber-50 text-amber-800 ring-amber-200", rejected: "bg-red-50 text-red-700 ring-red-200", spam: "bg-red-50 text-red-700 ring-red-200",
};
export function StatusBadge({ value }: { value: string }) {
  if (!value) return <span className="text-muted">—</span>;
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ring-inset", STATUS_TONE[value] ?? "bg-surface text-ink-soft ring-line")}>{value.replace(/-/g, " ")}</span>;
}
export function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex rounded-md bg-surface px-2 py-0.5 text-xs font-semibold text-ink-soft ring-1 ring-inset ring-line">{children}</span>;
}

export function EmptyState({ title, text, action, icon: Icon = Inbox }: { title: string; text?: string; action?: React.ReactNode; icon?: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-surface text-brand-600"><Icon className="size-7" /></span>
      <h3 className="mt-4 text-lg font-bold">{title}</h3>
      {text && <p className="mt-1 max-w-md text-sm text-muted">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
export function ErrorState({ title, text, onRetry }: { title: string; text?: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-red-50 text-red-600"><AlertTriangle className="size-7" /></span>
      <h3 className="mt-4 text-lg font-bold">{title}</h3>{text && <p className="mt-1 max-w-md text-sm text-muted">{text}</p>}
      {onRetry && <ABtn variant="secondary" className="mt-5" onClick={onRetry}>Try again</ABtn>}
    </div>
  );
}
export function ApiNotice({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-sm text-amber-900">
      <PlugZap aria-hidden className="mt-0.5 size-4 shrink-0" />
      <p>{children ?? <>Backend not connected (Phase 3). Changes are kept in this browser tab only and are lost on reload.</>}</p>
    </div>
  );
}
export function Skeleton({ className }: { className?: string }) { return <div className={cn("animate-pulse rounded-md bg-surface", className)} />; }
export function TableSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3 p-5" aria-label="Loading" role="status">
      {Array.from({ length: rows }).map((_, i) => <div key={i} className="flex gap-4">{Array.from({ length: cols }).map((__, j) => <Skeleton key={j} className="h-5 flex-1" />)}</div>)}
    </div>
  );
}

export function Modal({ open, onClose, title, children, footer, size = "md" }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; footer?: React.ReactNode; size?: "md" | "lg" | "xl" }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.querySelector<HTMLElement>("[data-autofocus],button,input,select,textarea")?.focus();
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k);
    return () => { window.removeEventListener("keydown", k); prev?.focus?.(); };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/50 p-0 backdrop-blur-[2px] sm:items-center sm:p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="modal-title" className={cn("flex max-h-[92dvh] w-full flex-col rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl", size === "md" ? "sm:max-w-md" : size === "lg" ? "sm:max-w-2xl" : "sm:max-w-5xl")}>
        <header className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
          <h2 id="modal-title" className="text-lg font-bold">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="flex size-9 items-center justify-center rounded-lg hover:bg-surface"><X className="size-4" /></button>
        </header>
        <div className="overflow-y-auto p-5">{children}</div>
        {footer && <footer className="flex flex-wrap justify-end gap-2 border-t border-line px-5 py-4">{footer}</footer>}
      </div>
    </div>
  );
}

export function ConfirmDialog({ open, title, text, confirmLabel = "Delete", onConfirm, onCancel, loading, tone = "danger" }:
  { open: boolean; title: string; text: React.ReactNode; confirmLabel?: string; onConfirm: () => void; onCancel: () => void; loading?: boolean; tone?: "danger" | "primary" }) {
  return (
    <Modal open={open} onClose={onCancel} title={title}
      footer={<><ABtn variant="secondary" onClick={onCancel} data-autofocus>Cancel</ABtn><ABtn variant={tone === "danger" ? "danger" : "primary"} loading={loading} onClick={onConfirm}>{confirmLabel}</ABtn></>}>
      <div className="text-sm leading-relaxed text-ink-soft">{text}</div>
    </Modal>
  );
}

export function PageHeader({ title, description, actions, crumbs }: { title: string; description?: string; actions?: React.ReactNode; crumbs?: { label: string; href?: string }[] }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {crumbs && (
          <nav aria-label="Breadcrumb" className="mb-1.5 text-xs text-muted">
            {crumbs.map((c, i) => <span key={i}>{i > 0 && " / "}{c.href ? <Link className="hover:text-brand-700" href={c.href}>{c.label}</Link> : c.label}</span>)}
          </nav>
        )}
        <h1 className="truncate text-2xl font-extrabold">{title}</h1>
        {description && <p className="mt-1 max-w-3xl text-sm text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
