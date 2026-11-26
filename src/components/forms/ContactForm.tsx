"use client";
import { useState } from "react";
import { Check, Send } from "lucide-react";
import { TextField, TextAreaField } from "@/components/forms/Field";
import { FormAlert } from "@/components/forms/FormAlert";
import { SubmitError } from "@/components/forms/SubmitError";
import { Button } from "@/components/ui/Button";
import { useSubmit } from "@/hooks/useSubmit";
import { publicApi } from "@/services/api/client";
import { rules, validate } from "@/lib/validation";
import { company } from "@/lib/site";
import { cn } from "@/lib/cn";

/** Service chips — verbatim from the original contact.php form. */
const NEEDS = ["Digital Marketing", "SEO", "Web Development", "3D Walkthrough", "3D Interior Design", "Graphic Design", "Motion Graphics", "Branding", "Event Organising", "Video Editing", "Other"];
type V = { name: string; phone: string; email: string; company: string; message: string };

export function ContactForm() {
  const [v, setV] = useState<V>({ name: "", phone: "", email: "", company: "", message: "" });
  const [needs, setNeeds] = useState<string[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof V, string>>>({});
  const { state, run, reset } = useSubmit();
  const set = (k: keyof V) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { setV({ ...v, [k]: e.target.value }); if (errors[k]) setErrors({ ...errors, [k]: undefined }); };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(v, {
      name: [rules.required("Your name"), rules.minLength(2, "Name")],
      phone: [rules.required("Phone"), rules.phone],
      email: [rules.email],
      message: [rules.maxLength(2000, "Message")],
    });
    setErrors(errs);
    if (Object.keys(errs).length) { document.getElementById(`c-${Object.keys(errs)[0]}`)?.focus(); return; }
    await run(() => publicApi.submitEnquiry({ source: "contact-page", name: v.name, phone: v.phone, email: v.email || undefined, company: v.company || undefined, services: needs, message: v.message || undefined, pageUrl: "/contact" }));
  }

  if (state.status === "success") {
    return (
      <div className="py-10 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><Check className="size-8" /></div>
        <h3 className="mt-5 text-2xl font-extrabold">Message Sent!</h3>
        <p className="mt-2 text-muted">Our team will call you within 24 hours. Or reach us directly:{" "}
          <a className="font-semibold text-brand-700" href={`tel:${company.phoneSecondary.tel}`}>{company.phoneSecondary.display}</a></p>
        <Button variant="outline" className="mt-6" onClick={() => { reset(); setV({ name: "", phone: "", email: "", company: "", message: "" }); setNeeds([]); }}>Send another message</Button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={submit} className="grid gap-5">
      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-ink">What do you need? <span className="font-normal text-muted">(Select multiple)</span></legend>
        <div className="flex flex-wrap gap-2">
          {NEEDS.map((n) => {
            const on = needs.includes(n);
            return (
              <button key={n} type="button" aria-pressed={on} onClick={() => setNeeds(on ? needs.filter((x) => x !== n) : [...needs, n])}
                className={cn("inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-semibold transition",
                  on ? "border-[#141414] bg-[#141414] text-[#E2E800]" : "border-line bg-white text-ink-soft hover:border-[#141414] hover:text-[#141414]")}>
                {on && <Check aria-hidden className="size-3.5" />}{n}
              </button>
            );
          })}
        </div>
      </fieldset>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField id="c-name" label="Your Name" required placeholder="Full name" value={v.name} onChange={set("name")} error={errors.name} autoComplete="name" />
        <TextField id="c-phone" label="Phone" required type="tel" placeholder="+91-XXXXXXXXXX" value={v.phone} onChange={set("phone")} error={errors.phone} autoComplete="tel" inputMode="tel" />
        <TextField id="c-email" label="Email" type="email" placeholder="you@email.com" value={v.email} onChange={set("email")} error={errors.email} autoComplete="email" />
        <TextField id="c-company" label="Company" value={v.company} onChange={set("company")} autoComplete="organization" />
      </div>
      <TextAreaField id="c-message" label="Message / Requirement" placeholder="Tell us about your project, budget, timeline..." value={v.message} onChange={set("message")} error={errors.message} />
      <SubmitError state={state} />
      {Object.keys(errors).length > 0 && <FormAlert tone="error" title="Please check the highlighted fields." />}
      <Button type="submit" variant="gradient" size="lg" loading={state.status === "loading"} className="w-full sm:w-auto sm:justify-self-start">
        {state.status === "loading" ? "Sending…" : <>Send Message <Send aria-hidden className="size-4" /></>}
      </Button>
    </form>
  );
}
