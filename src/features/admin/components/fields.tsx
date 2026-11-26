"use client";
/** Admin form controls rendered from FieldDef config. */
import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, FileUp, ImagePlus, Plus, Trash2, X } from "lucide-react";
import type { FieldDef } from "@/features/admin/types";
import { cn } from "@/lib/cn";

export const inputCls = "w-full rounded-lg border bg-white px-3 py-2 text-sm text-ink placeholder:text-muted/70 focus:outline-none focus:ring-4 transition";
const okCls = "border-line focus:border-brand-500 focus:ring-brand-100";
const badCls = "border-red-400 focus:border-red-500 focus:ring-red-100";

export function FieldShell({ field, error, children, count }: { field: FieldDef; error?: string; children: React.ReactNode; count?: number }) {
  const id = `f-${field.name}`;
  return (
    <div className={cn(field.wide && "sm:col-span-2")}>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-sm font-semibold text-ink">{field.label}{field.required && <span className="text-red-600" aria-hidden> *</span>}</label>
        {field.maxLength && count !== undefined && <span className={cn("text-xs tabular-nums", count > field.maxLength ? "font-semibold text-red-600" : "text-muted")}>{count}/{field.maxLength}</span>}
      </div>
      {children}
      {error ? <p id={`${id}-err`} role="alert" className="mt-1 text-xs font-medium text-red-600">{error}</p>
        : field.help ? <p className="mt-1 text-xs text-muted">{field.help}</p> : null}
    </div>
  );
}

type V = unknown;
export function FieldInput({ field, value, onChange, error, readOnly }: { field: FieldDef; value: V; onChange: (v: V) => void; error?: string; readOnly?: boolean }) {
  const id = `f-${field.name}`;
  const common = { id, name: field.name, "aria-invalid": !!error, "aria-describedby": error ? `${id}-err` : undefined, disabled: readOnly };
  const str = value == null ? "" : String(value);
  const cls = cn(inputCls, error ? badCls : okCls, readOnly && "cursor-not-allowed bg-surface text-muted");

  switch (field.type) {
    case "readonly":
      return <FieldShell field={field}><div id={id} className="min-h-10 rounded-lg bg-surface px-3 py-2 text-sm text-ink break-words">{Array.isArray(value) ? value.join(", ") || "—" : str || "—"}</div></FieldShell>;
    case "textarea":
      return <FieldShell field={field} error={error} count={str.length}><textarea {...common} rows={4} className={cn(cls, "resize-y")} value={str} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} /></FieldShell>;
    case "richtext":
      return <FieldShell field={{ ...field, help: field.help ?? "HTML is supported (headings, paragraphs, lists, links). Sanitised server-side in Phase 4." }} error={error}>
        <RichText id={id} value={str} onChange={onChange} invalid={!!error} disabled={readOnly} /></FieldShell>;
    case "select":
      return <FieldShell field={field} error={error}>
        <select {...common} className={cn(cls, "capitalize")} value={str} onChange={(e) => onChange(e.target.value)}>
          <option value="">Select…</option>{field.options?.map((o) => <option key={o} value={o}>{o.replace(/-/g, " ")}</option>)}
        </select></FieldShell>;
    case "toggle":
      return <FieldShell field={field}>
        <button type="button" id={id} role="switch" aria-checked={!!value} disabled={readOnly} onClick={() => onChange(!value)}
          className={cn("relative h-6 w-11 rounded-full transition", value ? "bg-brand-700" : "bg-slate-300")}>
          <span className={cn("absolute top-0.5 size-5 rounded-full bg-white shadow transition-all", value ? "left-[22px]" : "left-0.5")} />
        </button></FieldShell>;
    case "number":
      return <FieldShell field={field} error={error}><input {...common} type="number" className={cls} value={str} onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))} /></FieldShell>;
    case "date":
      return <FieldShell field={field} error={error}><input {...common} type="date" className={cls} value={str.slice(0, 10)} onChange={(e) => onChange(e.target.value)} /></FieldShell>;
    case "image":
      return <FieldShell field={field} error={error}><ImageInput id={id} value={str} onChange={onChange} disabled={readOnly} /></FieldShell>;
    case "file":
      return <FieldShell field={field}><div className="rounded-lg border border-dashed border-line bg-surface p-3 text-sm text-muted">{str ? str : "No file. Resume download requires the storage service (Phase 4)."}</div></FieldShell>;
    case "list":
      return <FieldShell field={field} error={error}><ListInput value={Array.isArray(value) ? (value as string[]) : []} onChange={onChange} label={field.label} disabled={readOnly} /></FieldShell>;
    case "cards":
    case "faqs":
    case "stats": {
      const keys = field.type === "cards" ? ["title", "text"] : field.type === "faqs" ? ["q", "a"] : ["value", "label"];
      const labels = field.type === "cards" ? ["Title", "Description"] : field.type === "faqs" ? ["Question", "Answer"] : ["Value", "Label"];
      return <FieldShell field={field} error={error}><PairsInput value={Array.isArray(value) ? (value as Record<string, string>[]) : []} onChange={onChange} keys={keys} labels={labels} long={field.type !== "stats"} disabled={readOnly} itemLabel={field.type === "faqs" ? "FAQ" : field.type === "stats" ? "stat" : "item"} /></FieldShell>;
    }
    case "tags":
      return <FieldShell field={field} error={error}><input {...common} className={cls} value={Array.isArray(value) ? value.join(", ") : str} onChange={(e) => onChange(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} /></FieldShell>;
    default:
      return <FieldShell field={field} error={error} count={str.length}>
        <input {...common} type={field.type === "email" ? "email" : field.type === "url" ? "url" : "text"} className={cn(cls, field.type === "slug" && "font-mono")}
          value={str} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} readOnly={readOnly} />
      </FieldShell>;
  }
}

function RichText({ id, value, onChange, invalid, disabled }: { id: string; value: string; onChange: (v: string) => void; invalid?: boolean; disabled?: boolean }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const wrap = (before: string, after = before) => {
    const t = ref.current; if (!t) return;
    const { selectionStart: s, selectionEnd: e } = t;
    onChange(value.slice(0, s) + before + value.slice(s, e) + after + value.slice(e));
    requestAnimationFrame(() => { t.focus(); t.setSelectionRange(s + before.length, e + before.length); });
  };
  const tools: [string, string, string][] = [["H2", "<h2>", "</h2>"], ["H3", "<h3>", "</h3>"], ["P", "<p>", "</p>"], ["B", "<strong>", "</strong>"], ["I", "<em>", "</em>"], ["List", "<ul>\n  <li>", "</li>\n</ul>"], ["Link", '<a href="">', "</a>"]];
  return (
    <div className={cn("overflow-hidden rounded-lg border", invalid ? "border-red-400" : "border-line")}>
      <div role="toolbar" aria-label="Formatting" className="flex flex-wrap gap-1 border-b border-line bg-surface p-1.5">
        {tools.map(([l, b, a]) => <button key={l} type="button" disabled={disabled} onClick={() => wrap(b, a)} className="rounded-md px-2.5 py-1 text-xs font-bold text-ink-soft hover:bg-white">{l}</button>)}
      </div>
      <textarea ref={ref} id={id} rows={10} disabled={disabled} value={value} onChange={(e) => onChange(e.target.value)} className="block w-full resize-y px-3 py-2 font-mono text-sm focus:outline-none" />
    </div>
  );
}

const IMG_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/svg+xml"];
export const IMG_MAX_MB = 5;
function ImageInput({ id, value, onChange, disabled }: { id: string; value: string; onChange: (v: string) => void; disabled?: boolean }) {
  const [err, setErr] = useState<string | null>(null);
  const pick = (f?: File) => {
    if (!f) return;
    if (!IMG_TYPES.includes(f.type)) return setErr("Use a JPG, PNG, WebP, AVIF or SVG image.");
    if (f.size > IMG_MAX_MB * 1024 * 1024) return setErr(`Image must be ${IMG_MAX_MB} MB or smaller.`);
    setErr(null); onChange(URL.createObjectURL(f)); // local preview only — not uploaded
  };
  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-surface">
          {value ? <Image src={value} alt="" fill sizes="80px" className="object-cover" unoptimized={value.startsWith("blob:")} /> : <ImagePlus aria-hidden className="size-6 text-muted" />}
        </div>
        <div className="flex flex-wrap gap-2">
          <label className={cn("inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-line bg-white px-3 text-sm font-semibold hover:bg-surface", disabled && "pointer-events-none opacity-50")}>
            <FileUp aria-hidden className="size-4" />{value ? "Replace" : "Choose image"}
            <input id={id} type="file" accept={IMG_TYPES.join(",")} className="sr-only" disabled={disabled} onChange={(e) => pick(e.target.files?.[0])} />
          </label>
          {value && !disabled && <button type="button" onClick={() => onChange("")} className="inline-flex h-9 items-center gap-1 rounded-lg px-3 text-sm font-semibold text-red-600 hover:bg-red-50"><X className="size-4" />Remove</button>}
        </div>
      </div>
      {value && <p className="mt-1.5 truncate font-mono text-xs text-muted">{value.startsWith("blob:") ? "Local preview (not uploaded)" : value}</p>}
      {err && <p role="alert" className="mt-1 text-xs font-medium text-red-600">{err}</p>}
    </div>
  );
}

function Reorder({ i, n, move, remove, disabled }: { i: number; n: number; move: (a: number, b: number) => void; remove: () => void; disabled?: boolean }) {
  return (
    <div className="flex shrink-0 gap-0.5">
      <button type="button" aria-label="Move up" disabled={disabled || i === 0} onClick={() => move(i, i - 1)} className="flex size-8 items-center justify-center rounded-md hover:bg-surface disabled:opacity-30"><ArrowUp className="size-3.5" /></button>
      <button type="button" aria-label="Move down" disabled={disabled || i === n - 1} onClick={() => move(i, i + 1)} className="flex size-8 items-center justify-center rounded-md hover:bg-surface disabled:opacity-30"><ArrowDown className="size-3.5" /></button>
      <button type="button" aria-label="Remove" disabled={disabled} onClick={remove} className="flex size-8 items-center justify-center rounded-md text-red-600 hover:bg-red-50 disabled:opacity-30"><Trash2 className="size-3.5" /></button>
    </div>
  );
}
const moveArr = <T,>(a: T[], from: number, to: number) => { const c = [...a]; const [x] = c.splice(from, 1); c.splice(to, 0, x); return c; };

function ListInput({ value, onChange, label, disabled }: { value: string[]; onChange: (v: string[]) => void; label: string; disabled?: boolean }) {
  return (
    <div className="space-y-2">
      {value.map((v, i) => (
        <div key={i} className="flex items-start gap-2">
          <textarea aria-label={`${label} ${i + 1}`} rows={2} disabled={disabled} className={cn(inputCls, okCls, "resize-y")} value={v} onChange={(e) => onChange(value.map((x, j) => (j === i ? e.target.value : x)))} />
          <Reorder i={i} n={value.length} disabled={disabled} move={(a, b) => onChange(moveArr(value, a, b))} remove={() => onChange(value.filter((_, j) => j !== i))} />
        </div>
      ))}
      {!disabled && <button type="button" onClick={() => onChange([...value, ""])} className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-line px-3 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50"><Plus className="size-4" />Add</button>}
    </div>
  );
}

function PairsInput({ value, onChange, keys, labels, long, itemLabel, disabled }: { value: Record<string, string>[]; onChange: (v: Record<string, string>[]) => void; keys: string[]; labels: string[]; long: boolean; itemLabel: string; disabled?: boolean }) {
  const set = (i: number, k: string, v: string) => onChange(value.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
  return (
    <div className="space-y-3">
      {value.length === 0 && <p className="rounded-lg bg-surface px-3 py-3 text-sm text-muted">No {itemLabel}s yet.</p>}
      {value.map((row, i) => (
        <div key={i} className="rounded-xl border border-line p-3">
          <div className="mb-2 flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-wide text-muted">{itemLabel} {i + 1}</span>
            <Reorder i={i} n={value.length} disabled={disabled} move={(a, b) => onChange(moveArr(value, a, b))} remove={() => onChange(value.filter((_, j) => j !== i))} /></div>
          <div className={cn("grid gap-2", !long && "sm:grid-cols-2")}>
            <input aria-label={`${labels[0]} ${i + 1}`} disabled={disabled} className={cn(inputCls, okCls)} placeholder={labels[0]} value={row[keys[0]] ?? ""} onChange={(e) => set(i, keys[0], e.target.value)} />
            {long ? <textarea aria-label={`${labels[1]} ${i + 1}`} disabled={disabled} rows={3} className={cn(inputCls, okCls, "resize-y")} placeholder={labels[1]} value={row[keys[1]] ?? ""} onChange={(e) => set(i, keys[1], e.target.value)} />
              : <input aria-label={`${labels[1]} ${i + 1}`} disabled={disabled} className={cn(inputCls, okCls)} placeholder={labels[1]} value={row[keys[1]] ?? ""} onChange={(e) => set(i, keys[1], e.target.value)} />}
          </div>
        </div>
      ))}
      {!disabled && <button type="button" onClick={() => onChange([...value, Object.fromEntries(keys.map((k) => [k, ""]))])} className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-line px-3 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50"><Plus className="size-4" />Add {itemLabel}</button>}
    </div>
  );
}
