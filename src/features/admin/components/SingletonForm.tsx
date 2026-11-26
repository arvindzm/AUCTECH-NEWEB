"use client";
import { useState } from "react";
import { RotateCcw, Save } from "lucide-react";
import { FieldInput } from "@/features/admin/components/fields";
import { useAdminStore } from "@/features/admin/store/AdminStore";
import { useToast } from "@/features/admin/components/Toast";
import { ABtn, ApiNotice, ConfirmDialog, PageHeader } from "@/features/admin/components/ui";
import type { FieldDef } from "@/features/admin/types";
import { rules } from "@/lib/validation";

/** Settings-style form for single-record modules (Website Settings, Careers page, Profile). */
export function SingletonForm({ storeKey, title, description, fields, initial, extra }: {
  storeKey: string; title: string; description: string; fields: FieldDef[]; initial: () => Record<string, unknown>; extra?: React.ReactNode;
}) {
  const store = useAdminStore();
  const toast = useToast();
  const [saved, save] = store.singleton(storeKey, initial);
  const [v, setV] = useState<Record<string, unknown>>(saved);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [reset, setReset] = useState(false);
  const dirty = JSON.stringify(v) !== JSON.stringify(saved);
  const sections = Array.from(new Set(fields.map((f) => f.section ?? "General")));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const er: Record<string, string> = {};
    for (const f of fields) {
      const val = v[f.name]; const s = typeof val === "string" ? val : Array.isArray(val) ? (val.length ? "x" : "") : val == null ? "" : String(val);
      if (f.required && !s.trim()) er[f.name] = `${f.label} is required.`;
      else if (typeof val === "string" && val) {
        const m = f.type === "email" ? rules.email(val) : f.type === "url" ? rules.url(val) : f.maxLength && val.length > f.maxLength ? `Max ${f.maxLength} characters.` : null;
        if (m) er[f.name] = m;
      }
    }
    setErrors(er);
    if (Object.keys(er).length) { toast({ tone: "error", title: "Please fix the highlighted fields" }); return; }
    setSaving(true); await save(v); setSaving(false);
    toast({ tone: "success", title: "Changes saved", text: "Session only — the backend is not connected yet." });
  }

  return (
    <form noValidate onSubmit={submit}>
      <PageHeader title={title} description={description} crumbs={[{ label: "Admin", href: "/admin" }, { label: title }]}
        actions={<><ABtn type="button" variant="secondary" disabled={!dirty} onClick={() => setReset(true)}><RotateCcw className="size-4" />Discard</ABtn><ABtn type="submit" loading={saving} disabled={!dirty}><Save className="size-4" />{saving ? "Saving…" : "Save changes"}</ABtn></>} />
      <div className="mb-5"><ApiNotice /></div>
      <div className="space-y-5">
        {sections.map((s) => (
          <fieldset key={s} className="rounded-2xl border border-line bg-white">
            <legend className="sr-only">{s}</legend>
            <h2 aria-hidden className="border-b border-line px-5 py-3.5 text-base font-bold">{s}</h2>
            <div className="grid gap-5 p-5 sm:grid-cols-2">
              {fields.filter((f) => (f.section ?? "General") === s).map((f) => <FieldInput key={f.name} field={f} value={v[f.name]} error={errors[f.name]} onChange={(x) => { setV({ ...v, [f.name]: x }); setErrors(({ [f.name]: _, ...r }) => r); }} />)}
            </div>
          </fieldset>
        ))}
        {extra}
      </div>
      <ConfirmDialog open={reset} tone="primary" title="Discard changes?" text="Revert all unsaved edits on this page?" confirmLabel="Discard" onCancel={() => setReset(false)} onConfirm={() => { setV(saved); setErrors({}); setReset(false); }} />
    </form>
  );
}
