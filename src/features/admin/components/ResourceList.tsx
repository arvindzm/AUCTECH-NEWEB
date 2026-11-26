"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Eye, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { useAdminStore } from "@/features/admin/store/AdminStore";
import { useToast } from "@/features/admin/components/Toast";
import { ABtn, ALink, ApiNotice, Badge, ConfirmDialog, EmptyState, PageHeader, StatusBadge, TableSkeleton } from "@/features/admin/components/ui";
import type { ColumnDef, Rec, ResourceConfig } from "@/features/admin/types";
import { cn } from "@/lib/cn";

const PAGE_SIZES = [10, 25, 50];
const fmtDate = (v: unknown) => { if (!v) return "—"; const d = new Date(String(v)); return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); };

function Cell({ col, row }: { col: ColumnDef; row: Rec }) {
  const v = row[col.key];
  switch (col.render) {
    case "status": return <StatusBadge value={String(v ?? "")} />;
    case "badge": return v ? <Badge>{String(v)}</Badge> : <span className="text-muted">—</span>;
    case "date": return <span className="whitespace-nowrap text-muted">{fmtDate(v)}</span>;
    case "mono": return <span className="font-mono text-xs text-ink-soft">{String(v ?? "—")}</span>;
    case "count": return <span className="tabular-nums">{Array.isArray(v) ? v.length : 0}</span>;
    case "image": return (
      <span className="relative block size-10 overflow-hidden rounded-md bg-surface">
        {v ? <Image src={String(v)} alt="" fill sizes="40px" className="object-cover" unoptimized={String(v).startsWith("blob:")} /> : null}
      </span>);
    default: {
      const s = Array.isArray(v) ? v.join(", ") : v == null || v === "" ? "—" : String(v);
      return <span className="line-clamp-2 max-w-md">{s}</span>;
    }
  }
}

export function ResourceList({ res }: { res: ResourceConfig }) {
  const store = useAdminStore();
  const toast = useToast();
  const [ready, setReady] = useState(false);
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [sel, setSel] = useState<string[]>([]);
  const [confirm, setConfirm] = useState<string[] | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { const t = setTimeout(() => setReady(true), 250); return () => clearTimeout(t); }, []); // brief loading state
  const all = store.list(res.key);
  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return all.filter((r) => (!term || res.searchKeys.some((k) => String(r[k] ?? "").toLowerCase().includes(term)))
      && Object.entries(filters).every(([k, v]) => !v || String(r[k] ?? "") === v));
  }, [all, q, filters, res.searchKeys]);
  const pages = Math.max(1, Math.ceil(rows.length / size));
  const cur = Math.min(page, pages);
  const view = rows.slice((cur - 1) * size, cur * size);
  const active = q || Object.values(filters).some(Boolean);
  const allSel = view.length > 0 && view.every((r) => sel.includes(r.id));
  const titleOf = (r: Rec) => String(r[res.titleKey] || r.id);

  async function doDelete() {
    if (!confirm) return;
    setBusy(true);
    await store.remove(res.key, confirm);
    setBusy(false); setSel((s) => s.filter((id) => !confirm.includes(id)));
    toast({ tone: "success", title: `${confirm.length} ${confirm.length === 1 ? res.singular.toLowerCase() : res.label.toLowerCase()} deleted`, text: "Session only — not persisted until the API is connected." });
    setConfirm(null);
  }

  return (
    <div>
      <PageHeader title={res.label} description={res.description} crumbs={[{ label: "Admin", href: "/admin" }, { label: res.label }]}
        actions={res.canCreate !== false ? <ALink href={`/admin/${res.key}/new`}><Plus className="size-4" />Add {res.singular}</ALink> : undefined} />
      <div className="mb-4 space-y-3">
        <ApiNotice>{res.source === "migrated"
          ? <>Records below are <strong>migrated from the original website content</strong>. Backend not connected: edits are kept in this browser tab only.</>
          : <>This module is populated by the backend (Phase 4). No records exist yet; nothing shown here is sample data.</>}</ApiNotice>
        {res.note && <p className="rounded-xl border border-line bg-surface p-3 text-sm text-ink-soft">{res.note}</p>}
      </div>

      <section className="rounded-2xl border border-line bg-white">
        <div className="flex flex-col gap-3 border-b border-line p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-xs">
            <label htmlFor="res-search" className="sr-only">Search {res.label}</label>
            <Search aria-hidden className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <input id="res-search" type="search" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder={`Search ${res.label.toLowerCase()}…`}
              className="h-10 w-full rounded-lg border border-line pl-9 pr-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {res.filters?.map((f) => (
              <select key={f.key} aria-label={`Filter by ${f.label}`} value={filters[f.key] ?? ""} onChange={(e) => { setFilters({ ...filters, [f.key]: e.target.value }); setPage(1); }}
                className="h-10 rounded-lg border border-line bg-white px-3 text-sm capitalize focus:border-brand-500 focus:outline-none">
                <option value="">All {f.label.toLowerCase()}</option>
                {f.options.map((o) => <option key={o} value={o}>{o.replace(/-/g, " ")}</option>)}
              </select>
            ))}
            {active && <ABtn variant="ghost" onClick={() => { setQ(""); setFilters({}); }}><X className="size-4" />Clear</ABtn>}
          </div>
        </div>

        {sel.length > 0 && res.canDelete !== false && (
          <div className="flex items-center justify-between gap-3 border-b border-line bg-brand-50 px-4 py-2.5 text-sm">
            <span className="font-semibold text-brand-800">{sel.length} selected</span>
            <div className="flex gap-2"><ABtn variant="ghost" onClick={() => setSel([])}>Clear selection</ABtn><ABtn variant="danger" onClick={() => setConfirm(sel)}><Trash2 className="size-4" />Delete selected</ABtn></div>
          </div>
        )}

        {!ready ? <TableSkeleton cols={Math.min(res.columns.length, 5)} /> : all.length === 0 ? (
          <EmptyState title={`No ${res.label.toLowerCase()} yet`}
            text={res.source === "api-only" ? (res.canCreate === false ? "Submissions will appear here once the backend is connected in Phase 4." : `Create the first ${res.singular.toLowerCase()} — it will be kept for this session only until the API is connected.`) : undefined}
            action={res.canCreate !== false ? <ALink href={`/admin/${res.key}/new`}><Plus className="size-4" />Add {res.singular}</ALink> : undefined} />
        ) : rows.length === 0 ? (
          <EmptyState icon={Search} title="No matching records" text="Try a different search or clear the filters." action={<ABtn variant="secondary" onClick={() => { setQ(""); setFilters({}); }}>Clear filters</ABtn>} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
                  <tr>
                    {res.canDelete !== false && <th scope="col" className="w-10 px-4 py-3"><input type="checkbox" aria-label="Select all on this page" checked={allSel} onChange={() => setSel(allSel ? sel.filter((id) => !view.some((r) => r.id === id)) : Array.from(new Set([...sel, ...view.map((r) => r.id)])))} className="size-4 accent-brand-700" /></th>}
                    {res.columns.map((c) => <th scope="col" key={c.key} className="px-4 py-3 font-semibold">{c.label || <span className="sr-only">Image</span>}</th>)}
                    <th scope="col" className="px-4 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {view.map((r) => (
                    <tr key={r.id} className={cn("transition-colors hover:bg-surface/60", sel.includes(r.id) && "bg-brand-50/50")}>
                      {res.canDelete !== false && <td className="px-4 py-3"><input type="checkbox" aria-label={`Select ${titleOf(r)}`} checked={sel.includes(r.id)} onChange={() => setSel(sel.includes(r.id) ? sel.filter((x) => x !== r.id) : [...sel, r.id])} className="size-4 accent-brand-700" /></td>}
                      {res.columns.map((c, i) => (
                        <td key={c.key} className="px-4 py-3 align-middle text-ink">
                          {i === (res.columns[0].render === "image" ? 1 : 0) ? <Link href={`/admin/${res.key}/${r.id}`} className="font-semibold hover:text-brand-700"><Cell col={c} row={r} /></Link> : <Cell col={c} row={r} />}
                        </td>
                      ))}
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <Link href={`/admin/${res.key}/${r.id}`} aria-label={`View ${titleOf(r)}`} className="flex size-8 items-center justify-center rounded-md text-ink-soft hover:bg-surface hover:text-brand-700"><Eye className="size-4" /></Link>
                          {res.canEdit !== false && <Link href={`/admin/${res.key}/${r.id}/edit`} aria-label={`Edit ${titleOf(r)}`} className="flex size-8 items-center justify-center rounded-md text-ink-soft hover:bg-surface hover:text-brand-700"><Pencil className="size-4" /></Link>}
                          {res.canDelete !== false && <button type="button" onClick={() => setConfirm([r.id])} aria-label={`Delete ${titleOf(r)}`} className="flex size-8 items-center justify-center rounded-md text-ink-soft hover:bg-red-50 hover:text-red-600"><Trash2 className="size-4" /></button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col items-center justify-between gap-3 border-t border-line px-4 py-3 text-sm text-muted sm:flex-row">
              <div className="flex items-center gap-2">
                <span>Showing {(cur - 1) * size + 1}–{Math.min(cur * size, rows.length)} of {rows.length}</span>
                <select aria-label="Rows per page" value={size} onChange={(e) => { setSize(Number(e.target.value)); setPage(1); }} className="h-8 rounded-md border border-line px-2 text-sm">
                  {PAGE_SIZES.map((n) => <option key={n} value={n}>{n} / page</option>)}
                </select>
              </div>
              <div className="flex items-center gap-1">
                <button type="button" aria-label="Previous page" disabled={cur === 1} onClick={() => setPage(cur - 1)} className="flex size-8 items-center justify-center rounded-md border border-line disabled:opacity-40"><ChevronLeft className="size-4" /></button>
                <span className="px-2 tabular-nums">Page {cur} of {pages}</span>
                <button type="button" aria-label="Next page" disabled={cur === pages} onClick={() => setPage(cur + 1)} className="flex size-8 items-center justify-center rounded-md border border-line disabled:opacity-40"><ChevronRight className="size-4" /></button>
              </div>
            </div>
          </>
        )}
      </section>

      <ConfirmDialog open={!!confirm} loading={busy} onCancel={() => setConfirm(null)} onConfirm={doDelete}
        title={confirm && confirm.length > 1 ? `Delete ${confirm.length} records?` : `Delete ${res.singular.toLowerCase()}?`}
        text={<>This will remove {confirm && confirm.length > 1 ? "the selected records" : <strong>{titleOf(all.find((r) => r.id === confirm?.[0]) ?? { id: "" })}</strong>} from this session. This can&apos;t be undone.</>} />
    </div>
  );
}
