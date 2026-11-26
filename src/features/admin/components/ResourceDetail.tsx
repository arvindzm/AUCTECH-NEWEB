"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { FieldInput } from "@/features/admin/components/fields";
import { useAdminStore } from "@/features/admin/store/AdminStore";
import { useToast } from "@/features/admin/components/Toast";
import { ABtn, ALink, ApiNotice, Card, ConfirmDialog, EmptyState, PageHeader, StatusBadge } from "@/features/admin/components/ui";
import type { ResourceConfig } from "@/features/admin/types";

/** Read-only detail screen. Inbox-type modules (enquiries/applications) allow a quick status update here. */
export function ResourceDetail({ res, id }: { res: ResourceConfig; id: string }) {
  const store = useAdminStore();
  const toast = useToast();
  const router = useRouter();
  const rec = store.get(res.key, id);
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState(String(rec?.status ?? ""));
  const [savingStatus, setSavingStatus] = useState(false);
  if (!rec) return <EmptyState title={`${res.singular} not found`} text="This record isn't available in the current session." action={<ALink variant="secondary" href={`/admin/${res.key}`}>Back to {res.label}</ALink>} />;

  const title = String(rec[res.titleKey] || res.singular);
  const publicUrl = typeof rec.slug === "string" && rec.slug ? (res.key === "blog" ? `/blog/${rec.slug}` : res.key === "jobs" ? `/career/${rec.slug}` : `/${String(rec.slug).replace(/^\//, "")}`) : typeof rec.path === "string" ? rec.path : null;
  const sections = Array.from(new Set(res.fields.map((f) => f.section ?? "Details")));
  const inbox = res.canCreate === false;

  return (
    <div>
      <PageHeader title={title} crumbs={[{ label: "Admin", href: "/admin" }, { label: res.label, href: `/admin/${res.key}` }, { label: "Details" }]}
        actions={<>
          {publicUrl && ["published", "open"].includes(String(rec.status)) && <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-2 rounded-lg border border-line bg-white px-4 text-sm font-semibold hover:bg-surface"><ExternalLink className="size-4" />View on site</a>}
          {res.canDelete !== false && <ABtn variant="secondary" onClick={() => setConfirm(true)} className="text-red-600"><Trash2 className="size-4" />Delete</ABtn>}
          {res.canEdit !== false && !inbox && <ALink href={`/admin/${res.key}/${id}/edit`}><Pencil className="size-4" />Edit</ALink>}
        </>} />
      <div className="mb-5"><ApiNotice /></div>
      <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          {sections.filter((s) => !(inbox && ["Review", "Follow-up"].includes(s))).map((s) => (
            <Card key={s} title={s}>
              <div className="grid gap-5 sm:grid-cols-2">
                {res.fields.filter((f) => (f.section ?? "Details") === s).map((f) => <FieldInput key={f.name} field={f} value={rec[f.name]} onChange={() => {}} readOnly />)}
              </div>
            </Card>
          ))}
        </div>
        <aside className="space-y-5">
          <Card title="Summary">
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-3"><dt className="text-muted">Status</dt><dd><StatusBadge value={String(rec.status ?? "")} /></dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted">Source</dt><dd className="text-right">{res.source === "migrated" && !rec.createdAt ? "Original website" : "Created this session"}</dd></div>
              {publicUrl && <div className="flex justify-between gap-3"><dt className="text-muted">URL</dt><dd className="break-all text-right font-mono text-xs">{publicUrl}</dd></div>}
            </dl>
          </Card>
          {inbox && (
            <Card title="Update status">
              <label htmlFor="quick-status" className="mb-1.5 block text-sm font-semibold">Status</label>
              <select id="quick-status" value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 w-full rounded-lg border border-line px-3 text-sm capitalize">
                {res.statusOptions?.map((o) => <option key={o} value={o}>{o.replace(/-/g, " ")}</option>)}
              </select>
              <ABtn className="mt-3 w-full" loading={savingStatus} disabled={status === rec.status} onClick={async () => {
                setSavingStatus(true); await store.update(res.key, id, { status }); setSavingStatus(false);
                toast({ tone: "success", title: "Status updated", text: "Session only — not persisted." });
              }}>Save status</ABtn>
            </Card>
          )}
        </aside>
      </div>
      <ConfirmDialog open={confirm} loading={busy} title={`Delete ${res.singular.toLowerCase()}?`} text={<>This will remove <strong>{title}</strong> from this session.</>}
        onCancel={() => setConfirm(false)} onConfirm={async () => { setBusy(true); await store.remove(res.key, [id]); toast({ tone: "success", title: `${res.singular} deleted` }); router.push(`/admin/${res.key}`); }} />
    </div>
  );
}
