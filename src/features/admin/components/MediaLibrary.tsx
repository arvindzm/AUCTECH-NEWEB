"use client";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Check, Copy, Grid2x2, List, Search, Trash2, UploadCloud } from "lucide-react";
import { ABtn, ApiNotice, ConfirmDialog, EmptyState, Modal, PageHeader } from "@/features/admin/components/ui";
import { useToast } from "@/features/admin/components/Toast";
import { inputCls, IMG_MAX_MB } from "@/features/admin/components/fields";
import { mediaApi, ApiNotConnectedError } from "@/services/api/client";
import { cn } from "@/lib/cn";

export interface MediaAsset { id: string; url: string; name: string; folder: string; size: number }
const fmt = (b: number) => (b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.round(b / 1024)} KB`);
const OK = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/svg+xml", "image/gif"];
const PAGE = 48;

export function MediaLibrary({ initial }: { initial: MediaAsset[] }) {
  const toast = useToast();
  const [items, setItems] = useState(initial);
  const [q, setQ] = useState("");
  const [folder, setFolder] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [shown, setShown] = useState(PAGE);
  const [sel, setSel] = useState<MediaAsset | null>(null);
  const [del, setDel] = useState<MediaAsset | null>(null);
  const [uploading, setUploading] = useState(false);
  const [rejects, setRejects] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const folders = useMemo(() => Array.from(new Set(items.map((i) => i.folder))), [items]);
  const list = items.filter((i) => (!folder || i.folder === folder) && (!q || i.name.toLowerCase().includes(q.toLowerCase())));

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    const bad: string[] = []; const good: File[] = [];
    Array.from(files).forEach((f) => { if (!OK.includes(f.type)) bad.push(`${f.name}: unsupported type`); else if (f.size > IMG_MAX_MB * 1048576) bad.push(`${f.name}: larger than ${IMG_MAX_MB} MB`); else good.push(f); });
    setRejects(bad);
    if (!good.length) return;
    setUploading(true);
    try { await mediaApi.upload(good[0]); }
    catch (e) { toast({ tone: "error", title: `${good.length} file(s) not uploaded`, text: e instanceof ApiNotConnectedError ? "Media storage isn't connected yet (Phase 4)." : "Upload failed." }); }
    finally { setUploading(false); }
  }

  return (
    <div>
      <PageHeader title="Media Library" description="Images available to the website. Existing files are the original site assets." crumbs={[{ label: "Admin", href: "/admin" }, { label: "Media Library" }]}
        actions={<label className={cn("inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-brand-700 px-4 text-sm font-semibold text-white hover:bg-brand-800", uploading && "pointer-events-none opacity-60")}>
          <UploadCloud className="size-4" />{uploading ? "Uploading…" : "Upload"}<input type="file" multiple accept={OK.join(",")} className="sr-only" onChange={(e) => { upload(e.target.files); e.target.value = ""; }} /></label>} />
      <div className="mb-4"><ApiNotice>Upload, delete and alt-text changes require media storage (Phase 4). Deleting here only hides the file in this session.</ApiNotice></div>
      <label onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); upload(e.dataTransfer.files); }}
        className="mb-5 flex cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-line bg-white px-4 py-6 text-center text-sm text-muted hover:border-brand-300">
        <UploadCloud aria-hidden className="size-6 text-brand-600" /><span className="font-semibold text-ink">Drop images here or click to browse</span>JPG, PNG, WebP, AVIF, SVG or GIF · max {IMG_MAX_MB} MB each
        <input type="file" multiple accept={OK.join(",")} className="sr-only" onChange={(e) => { upload(e.target.files); e.target.value = ""; }} />
      </label>
      {rejects.length > 0 && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800"><p className="font-semibold">Some files were rejected:</p><ul className="mt-1 list-disc pl-5">{rejects.map((r) => <li key={r}>{r}</li>)}</ul></div>}

      <section className="rounded-2xl border border-line bg-white">
        <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-xs"><Search aria-hidden className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <input aria-label="Search media" type="search" value={q} onChange={(e) => { setQ(e.target.value); setShown(PAGE); }} placeholder="Search file name…" className={cn(inputCls, "border-line pl-9")} /></div>
          <select aria-label="Folder" value={folder} onChange={(e) => { setFolder(e.target.value); setShown(PAGE); }} className="h-10 rounded-lg border border-line px-3 text-sm">
            <option value="">All folders ({items.length})</option>{folders.map((f) => <option key={f} value={f}>{f} ({items.filter((i) => i.folder === f).length})</option>)}
          </select>
          <div className="ml-auto flex rounded-lg border border-line p-0.5" role="group" aria-label="View">
            <button type="button" aria-pressed={view === "grid"} aria-label="Grid view" onClick={() => setView("grid")} className={cn("flex size-8 items-center justify-center rounded-md", view === "grid" && "bg-surface")}><Grid2x2 className="size-4" /></button>
            <button type="button" aria-pressed={view === "list"} aria-label="List view" onClick={() => setView("list")} className={cn("flex size-8 items-center justify-center rounded-md", view === "list" && "bg-surface")}><List className="size-4" /></button>
          </div>
        </div>
        {list.length === 0 ? <EmptyState icon={Search} title="No files found" text="Try another search or folder." /> : view === "grid" ? (
          <ul className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
            {list.slice(0, shown).map((a) => (
              <li key={a.id}><button type="button" onClick={() => setSel(a)} className="group block w-full overflow-hidden rounded-xl border border-line text-left hover:border-brand-300 focus-visible:border-brand-500">
                <span className="relative block aspect-square bg-surface"><Image src={a.url} alt="" fill sizes="200px" className="object-cover" /></span>
                <span className="block truncate px-2 py-1.5 text-xs font-medium">{a.name}</span></button></li>
            ))}
          </ul>
        ) : (
          <ul className="divide-y divide-line">
            {list.slice(0, shown).map((a) => (
              <li key={a.id}><button type="button" onClick={() => setSel(a)} className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-surface">
                <span className="relative size-10 shrink-0 overflow-hidden rounded-md bg-surface"><Image src={a.url} alt="" fill sizes="40px" className="object-cover" /></span>
                <span className="min-w-0 flex-1 truncate font-medium">{a.name}</span><span className="hidden text-muted sm:block">{a.folder}</span><span className="w-20 text-right tabular-nums text-muted">{fmt(a.size)}</span></button></li>
            ))}
          </ul>
        )}
        {shown < list.length && <div className="border-t border-line p-4 text-center"><ABtn variant="secondary" onClick={() => setShown(shown + PAGE)}>Load more ({list.length - shown} remaining)</ABtn></div>}
      </section>

      <Modal open={!!sel} onClose={() => setSel(null)} title={sel?.name ?? ""} size="lg"
        footer={sel && <><ABtn variant="secondary" className="text-red-600" onClick={() => { setDel(sel); setSel(null); }}><Trash2 className="size-4" />Delete</ABtn>
          <ABtn onClick={async () => { await navigator.clipboard?.writeText(sel.url).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1500); }}>{copied ? <Check className="size-4" /> : <Copy className="size-4" />}{copied ? "Copied" : "Copy URL"}</ABtn></>}>
        {sel && <div className="space-y-4">
          <div className="relative aspect-video overflow-hidden rounded-xl bg-surface"><Image src={sel.url} alt="" fill sizes="700px" className="object-contain" /></div>
          <dl className="grid grid-cols-2 gap-3 text-sm"><div><dt className="text-muted">Folder</dt><dd className="font-medium">{sel.folder}</dd></div><div><dt className="text-muted">Size</dt><dd className="font-medium">{fmt(sel.size)}</dd></div>
            <div className="col-span-2"><dt className="text-muted">URL</dt><dd className="break-all font-mono text-xs">{sel.url}</dd></div></dl>
        </div>}
      </Modal>
      <ConfirmDialog open={!!del} title="Delete file?" text={<>Remove <strong>{del?.name}</strong>? Pages using this image would show a broken image. (Session only.)</>}
        onCancel={() => setDel(null)} onConfirm={() => { setItems(items.filter((i) => i.id !== del!.id)); toast({ tone: "success", title: "File removed from this session" }); setDel(null); }} />
    </div>
  );
}
