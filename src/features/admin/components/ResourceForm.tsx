"use client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Eye, Save } from "lucide-react";
import { FieldInput } from "@/features/admin/components/fields";
import { useAdminStore } from "@/features/admin/store/AdminStore";
import { useToast } from "@/features/admin/components/Toast";
import { ABtn, ApiNotice, ConfirmDialog, EmptyState, Modal, PageHeader } from "@/features/admin/components/ui";
import { BlogArticle } from "@/features/public/BlogArticle";
import { JobDetail } from "@/features/public/JobDetail";
import type { FieldDef, Rec, ResourceConfig } from "@/features/admin/types";
import { rules } from "@/lib/validation";

function validateField(f: FieldDef, v: unknown): string | null {
  const s = v == null ? "" : Array.isArray(v) ? (v.length ? "x" : "") : String(v);
  if (f.required && !s.trim() && f.type !== "toggle") return `${f.label} is required.`;
  if (typeof v === "string" && v) {
    if (f.maxLength && v.length > f.maxLength) return `${f.label} must be ${f.maxLength} characters or fewer.`;
    if (f.type === "email") return rules.email(v);
    if (f.type === "url" && !v.startsWith("/")) return rules.url(v);
    if (f.type === "slug") {
      const val = v.replace(/^\//, "");
      if (val && !/^[a-z0-9]+(?:[-/][a-z0-9]+)*$/.test(val)) return "Use lowercase letters, numbers, and hyphens.";
    }
  }
  return null;
}

export function ResourceForm({ res, id }: { res: ResourceConfig; id?: string }) {
  const store = useAdminStore();
  const toast = useToast();
  const router = useRouter();
  const existing = id ? store.get(res.key, id) : undefined;
  const blank = useMemo(() => Object.fromEntries(res.fields.map((f) => [f.name, f.type === "toggle" ? false : ["list", "cards", "faqs", "stats", "tags"].includes(f.type) ? [] : f.name === "status" ? (res.statusOptions?.[0] === "published" ? "draft" : res.statusOptions?.[0] ?? "") : ""])), [res]);
  const [values, setValues] = useState<Record<string, unknown>>(() => existing ? { ...blank, ...existing } : blank);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [leave, setLeave] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  if (id && !existing) {
    return <EmptyState title={`${res.singular} not found`} text="This record doesn't exist in the current session. Records created during a session are lost on reload until the API is connected." action={<ABtn variant="secondary" onClick={() => router.push(`/admin/${res.key}`)}>Back to {res.label}</ABtn>} />;
  }

  const set = (name: string, v: unknown) => { setValues((s) => ({ ...s, [name]: v })); setDirty(true); if (errors[name]) setErrors((e) => { const c = { ...e }; delete c[name]; return c; }); };
  const sections = Array.from(new Set(res.fields.map((f) => f.section ?? "Details")));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    res.fields.forEach((f) => { if (f.type === "readonly") return; const m = validateField(f, values[f.name]); if (m) errs[f.name] = m; });
    setErrors(errs);
    if (Object.keys(errs).length) {
      toast({ tone: "error", title: "Please fix the highlighted fields", text: `${Object.keys(errs).length} field(s) need attention.` });
      document.getElementById(`f-${Object.keys(errs)[0]}`)?.focus();
      return;
    }
    setSaving(true);
    const rec = existing ? await store.update(res.key, existing.id, values) : await store.create(res.key, values as Omit<Rec, "id">);
    setSaving(false); setDirty(false);
    toast({ tone: "success", title: existing ? `${res.singular} updated` : `${res.singular} created`, text: "Saved for this session only — the backend is not connected yet." });
    router.push(`/admin/${res.key}/${rec.id}`);
  }

  const title = existing ? `Edit ${String(existing[res.titleKey] || res.singular)}` : `Add ${res.singular}`;
  const cancel = () => (dirty ? setLeave(true) : router.push(existing ? `/admin/${res.key}/${existing.id}` : `/admin/${res.key}`));

  return (
    <form noValidate onSubmit={submit}>
      <PageHeader title={title} crumbs={[{ label: "Admin", href: "/admin" }, { label: res.label, href: `/admin/${res.key}` }, { label: existing ? "Edit" : "New" }]}
        actions={<>
          {res.preview && <ABtn type="button" variant="secondary" onClick={() => setPreview(true)}><Eye className="size-4" />Preview</ABtn>}
          <ABtn type="button" variant="secondary" onClick={cancel}>Cancel</ABtn>
          <ABtn type="submit" loading={saving}><Save className="size-4" />{saving ? "Saving…" : "Save"}</ABtn>
        </>} />
      <div className="mb-5"><ApiNotice /></div>
      {Object.keys(errors).length > 0 && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-800">Please fix {Object.keys(errors).length} field(s) before saving.</div>}
      <div className="space-y-5">
        {sections.map((s) => (
          <fieldset key={s} className="rounded-2xl border border-line bg-white">
            <legend className="sr-only">{s}</legend>
            <h2 aria-hidden className="border-b border-line px-5 py-3.5 text-base font-bold">{s}</h2>
            <div className="grid gap-5 p-5 sm:grid-cols-2">
              {res.fields.filter((f) => (f.section ?? "Details") === s).map((f) => (
                <FieldInput key={f.name} field={f} value={values[f.name]} error={errors[f.name]} onChange={(v) => set(f.name, v)} readOnly={!!existing && f.readOnlyOnEdit} />
              ))}
            </div>
          </fieldset>
        ))}
      </div>
      <div className="sticky bottom-0 z-10 -mx-4 mt-6 flex justify-end gap-2 border-t border-line bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        {dirty && <span className="mr-auto self-center text-sm text-amber-700">Unsaved changes</span>}
        <ABtn type="button" variant="secondary" onClick={cancel}>Cancel</ABtn>
        <ABtn type="submit" loading={saving}><Save className="size-4" />{saving ? "Saving…" : existing ? "Save changes" : `Create ${res.singular.toLowerCase()}`}</ABtn>
      </div>

      <ConfirmDialog open={leave} tone="primary" title="Discard unsaved changes?" text="You have unsaved changes. If you leave now they will be lost." confirmLabel="Discard changes"
        onCancel={() => setLeave(false)} onConfirm={() => { setDirty(false); router.push(existing ? `/admin/${res.key}/${existing.id}` : `/admin/${res.key}`); }} />
      <Modal open={preview} onClose={() => setPreview(false)} title="Preview" size="xl">
        <div className="overflow-hidden rounded-xl border border-line">
          {res.preview === "blog" && <BlogArticle preview post={{ slug: String(values.slug ?? ""), title: String(values.title ?? ""), excerpt: String(values.excerpt ?? ""), category: String(values.category ?? ""), bodyHtml: String(values.body ?? ""), author: String(values.author ?? "") || undefined, publishedAt: String(values.publishedAt ?? ""), coverImage: values.coverImage ? { src: String(values.coverImage), alt: String(values.coverAlt ?? "") } : undefined }} />}
          {res.preview === "job" && <div className="p-6"><JobDetail job={{ slug: String(values.slug ?? ""), title: String(values.title ?? ""), department: String(values.department ?? "") || undefined, location: String(values.location ?? ""), employmentType: (values.employmentType || "Full-time") as "Full-time", experience: String(values.experience ?? "") || undefined, summary: String(values.summary ?? ""), responsibilities: (values.responsibilities as string[] ?? []).filter(Boolean), requirements: (values.requirements as string[] ?? []).filter(Boolean), postedAt: String(values.postedAt ?? "") }} /></div>}
        </div>
      </Modal>
    </form>
  );
}
