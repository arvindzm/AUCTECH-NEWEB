"use client";
import { useRef, useState } from "react";
import { Check, FileText, UploadCloud, X } from "lucide-react";
import { TextField, TextAreaField, SelectField } from "@/components/forms/Field";
import { FormAlert } from "@/components/forms/FormAlert";
import { SubmitError } from "@/components/forms/SubmitError";
import { Button } from "@/components/ui/Button";
import { useSubmit } from "@/hooks/useSubmit";
import { publicApi } from "@/services/api/client";
import { RESUME_ACCEPT, RESUME_MAX_MB, rules, validate, validateResume } from "@/lib/validation";
import { cn } from "@/lib/cn";

type V = { fullName: string; email: string; phone: string; portfolioUrl: string; address: string; experienceLevel: string; yearsOfExperience: string };
const empty: V = { fullName: "", email: "", phone: "", portfolioUrl: "", address: "", experienceLevel: "", yearsOfExperience: "" };

const fmtSize = (b: number) => (b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

/** Job application form — fields follow the original career.php form. UI only: no file is stored or scanned. */
export function ApplicationForm({ jobId, jobTitle }: { jobId?: string; jobTitle?: string }) {
  const [v, setV] = useState<V>(empty);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof V, string>>>({});
  const input = useRef<HTMLInputElement>(null);
  const { state, run, reset } = useSubmit();
  const set = (k: keyof V) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { setV({ ...v, [k]: e.target.value }); if (errors[k]) setErrors({ ...errors, [k]: undefined }); };

  function pick(f: File | null | undefined) {
    if (!f) return;
    const err = validateResume(f);
    setFileError(err);
    setFile(err ? null : f);
    if (err && input.current) input.current.value = "";
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(v, {
      fullName: [rules.required("Full name"), rules.minLength(2, "Full name")],
      email: [rules.required("Email address"), rules.email],
      phone: [rules.required("Contact number"), rules.phone],
      portfolioUrl: [rules.url],
      yearsOfExperience: [rules.required("Years of experience"), rules.maxLength(20, "Years of experience")],
    });
    const fe = validateResume(file);
    setErrors(errs); setFileError(fe);
    if (Object.keys(errs).length || fe) return;
    await run(() => publicApi.submitApplication({
      jobId, fullName: v.fullName, email: v.email, phone: v.phone, portfolioUrl: v.portfolioUrl || undefined, address: v.address || undefined,
      experienceLevel: (v.experienceLevel || undefined) as "Fresher" | "Experienced" | undefined, yearsOfExperience: v.yearsOfExperience, resume: file!,
    }));
  }

  if (state.status === "success") {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><Check className="size-8" /></div>
        <h3 className="mt-5 text-2xl font-extrabold">Application received</h3>
        <p className="mt-2 text-muted">Thank you{v.fullName ? `, ${v.fullName.split(" ")[0]}` : ""}. Our team will review your profile and get in touch if there&apos;s a match.</p>
        <Button variant="outline" className="mt-6" onClick={() => { reset(); setV(empty); setFile(null); }}>Submit another application</Button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={submit} className="grid gap-5">
      {jobTitle && <FormAlert tone="info" title={`Applying for: ${jobTitle}`} />}
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField id="a-name" label="Full Name" required placeholder="John Doe" value={v.fullName} onChange={set("fullName")} error={errors.fullName} autoComplete="name" />
        <TextField id="a-email" label="Email Address" required type="email" placeholder="john@example.com" value={v.email} onChange={set("email")} error={errors.email} autoComplete="email" />
        <TextField id="a-phone" label="Contact Number" required type="tel" placeholder="+91-XXXXX-XXXXX" value={v.phone} onChange={set("phone")} error={errors.phone} autoComplete="tel" />
        <TextField id="a-portfolio" label="Portfolio URL" type="url" placeholder="https://dribbble.com/... / GitHub" value={v.portfolioUrl} onChange={set("portfolioUrl")} error={errors.portfolioUrl} />
        <SelectField id="a-exp" label="Experience Level" placeholder="Select" options={["Fresher", "Experienced"]} value={v.experienceLevel} onChange={set("experienceLevel")} />
        <TextField id="a-years" label="Years of Experience" required placeholder="e.g. 2.5 Years" value={v.yearsOfExperience} onChange={set("yearsOfExperience")} error={errors.yearsOfExperience} />
      </div>
      <TextAreaField id="a-address" label="Address" placeholder="Your current address" rows={2} className="[&_textarea]:min-h-20" value={v.address} onChange={set("address")} />

      <div>
        <p id="resume-label" className="mb-1.5 text-sm font-semibold text-ink">Resume / CV <span className="text-red-600" aria-hidden>*</span></p>
        {file ? (
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <FileText aria-hidden className="size-8 shrink-0 text-emerald-700" />
            <div className="min-w-0 flex-1"><p className="truncate font-semibold text-ink">{file.name}</p><p className="text-xs text-muted">{fmtSize(file.size)} · ready to upload</p></div>
            <button type="button" onClick={() => { setFile(null); if (input.current) input.current.value = ""; }} aria-label="Remove file" className="flex size-9 items-center justify-center rounded-full hover:bg-white"><X className="size-4" /></button>
          </div>
        ) : (
          <label htmlFor="a-resume"
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files?.[0]); }}
            className={cn("flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-8 text-center transition",
              fileError ? "border-red-300 bg-red-50/50" : drag ? "border-brand-500 bg-brand-50" : "border-line bg-surface hover:border-brand-300")}>
            <UploadCloud aria-hidden className="size-8 text-brand-600" />
            <span className="font-semibold text-ink">Click or drag file to upload</span>
            <span className="text-xs text-muted">PDF, DOC or DOCX · max {RESUME_MAX_MB} MB</span>
          </label>
        )}
        <input ref={input} id="a-resume" type="file" accept={RESUME_ACCEPT} className="sr-only" aria-labelledby="resume-label"
          aria-invalid={!!fileError} aria-describedby={fileError ? "a-resume-error" : undefined} onChange={(e) => pick(e.target.files?.[0])} />
        {fileError && <p id="a-resume-error" role="alert" className="mt-1.5 text-sm font-medium text-red-600">{fileError}</p>}
      </div>

      <SubmitError state={state} />
      <Button type="submit" variant="gradient" size="lg" loading={state.status === "loading"} className="w-full">
        {state.status === "loading" ? "Submitting…" : "Submit Application"}
      </Button>
    </form>
  );
}
