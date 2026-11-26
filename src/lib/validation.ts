/** Small client-side validation helpers (no dependency). */
export type Rule = (v: string) => string | null;

export const rules = {
  required: (label: string): Rule => (v) => (v.trim() ? null : `${label} is required.`),
  email: (v: string) => (!v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? null : "Enter a valid email address."),
  phone: (v: string) => {
    if (!v.trim()) return null;
    const digits = v.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 13 ? null : "Enter a valid phone number (10 digits, optional +91).";
  },
  url: (v: string) => { if (!v.trim()) return null; try { const u = new URL(v.trim()); return /^https?:$/.test(u.protocol) ? null : "Use an http(s) link."; } catch { return "Enter a full link, starting with https://"; } },
  minLength: (n: number, label: string): Rule => (v) => (!v.trim() || v.trim().length >= n ? null : `${label} must be at least ${n} characters.`),
  maxLength: (n: number, label: string): Rule => (v) => (v.length <= n ? null : `${label} must be ${n} characters or fewer.`),
  slug: (v: string) => (!v || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v) ? null : "Use lowercase letters, numbers and hyphens only."),
};

export function validate<T extends Record<string, string>>(values: T, schema: Partial<Record<keyof T, Rule[]>>) {
  const errors: Partial<Record<keyof T, string>> = {};
  for (const key in schema) {
    for (const r of schema[key] ?? []) {
      const msg = r(values[key] ?? "");
      if (msg) { errors[key] = msg; break; }
    }
  }
  return errors;
}

/* Resume upload constraints. Accepted types follow the original form (.pdf,.doc,.docx).
   The size limit is a proposed value pending approval (see PENDING_DECISIONS.md). */
export const RESUME_ACCEPT = ".pdf,.doc,.docx";
export const RESUME_MIME = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
export const RESUME_MAX_MB = 5;
export function validateResume(file: File | null): string | null {
  if (!file) return "Please attach your resume.";
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (!["pdf", "doc", "docx"].includes(ext ?? "") || (file.type && !RESUME_MIME.includes(file.type)))
    return "Unsupported file type. Upload a PDF, DOC or DOCX file.";
  if (file.size === 0) return "This file is empty. Please choose another file.";
  if (file.size > RESUME_MAX_MB * 1024 * 1024) return `File is too large. The maximum size is ${RESUME_MAX_MB} MB.`;
  return null;
}
