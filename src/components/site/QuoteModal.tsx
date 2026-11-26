"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { TextField, SelectField } from "@/components/forms/Field";
import { FormAlert } from "@/components/forms/FormAlert";
import { SubmitError } from "@/components/forms/SubmitError";
import { Button } from "@/components/ui/Button";
import { useSubmit } from "@/hooks/useSubmit";
import { publicApi } from "@/services/api/client";
import { rules, validate } from "@/lib/validation";

/** Service options — verbatim from the original quote form. */
export const QUOTE_SERVICES = [
  "Digital Marketing", "SEO / Search Engine Optimization", "Website & App Development", "Graphic Design & Branding",
  "3D Architectural Walkthrough", "3D Interior & Exterior Design", "Video Editing & Motion Graphics", "Other Requirement",
];

const Ctx = createContext<{ openQuote: () => void }>({ openQuote: () => {} });
export const useQuoteModal = () => useContext(Ctx);

type V = { name: string; phone: string; email: string; city: string; service: string };
const empty: V = { name: "", phone: "", email: "", city: "", service: "" };

export function QuoteModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const openQuote = useCallback(() => setOpen(true), []);
  return (
    <Ctx.Provider value={{ openQuote }}>
      {children}
      {open && <QuoteDialog onClose={() => setOpen(false)} />}
    </Ctx.Provider>
  );
}

function QuoteDialog({ onClose }: { onClose: () => void }) {
  const [v, setV] = useState<V>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof V, string>>>({});
  const { state, run } = useSubmit();
  const panel = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<Element | null>(null);

  useEffect(() => {
    lastFocus.current = document.activeElement;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("input,select,button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>("button,input,select,a[href]");
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; (lastFocus.current as HTMLElement | null)?.focus?.(); };
  }, [onClose]);

  const set = (k: keyof V) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => { setV({ ...v, [k]: e.target.value }); if (errors[k]) setErrors({ ...errors, [k]: undefined }); };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(v, {
      name: [rules.required("Your name"), rules.minLength(2, "Name")],
      phone: [rules.required("Phone number"), rules.phone],
      email: [rules.required("Email address"), rules.email],
      service: [rules.required("Service")],
    });
    setErrors(errs);
    if (Object.keys(errs).length) return;
    await run(() => publicApi.submitEnquiry({ source: "quote-modal", name: v.name, phone: v.phone, email: v.email, city: v.city || undefined, services: [v.service], pageUrl: location.pathname }));
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-navy/60 p-0 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={panel} role="dialog" aria-modal="true" aria-labelledby="quote-title"
        className="relative max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl animate-fade-up sm:rounded-3xl sm:p-8">
        <button type="button" onClick={onClose} aria-label="Close" className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-surface text-ink hover:bg-brand-50"><X className="size-5" /></button>
        {state.status === "success" ? (
          <div className="py-6 text-center">
            <h2 id="quote-title" className="text-2xl font-extrabold">Thank You!</h2>
            <p className="mt-2 text-muted">We&apos;ll contact you within 24 hours.</p>
            <Button className="mt-6" onClick={onClose}>Close</Button>
          </div>
        ) : (
          <>
            <h2 id="quote-title" className="pr-10 text-2xl font-extrabold">Get Your Custom Quote</h2>
            <p className="mt-1 text-sm text-muted">Fields marked * are required.</p>
            <form noValidate onSubmit={submit} className="mt-6 grid gap-4">
              <TextField id="q-name" label="Your Name" required value={v.name} onChange={set("name")} error={errors.name} autoComplete="name" />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField id="q-phone" label="Phone Number" required type="tel" value={v.phone} onChange={set("phone")} error={errors.phone} autoComplete="tel" inputMode="tel" />
                <TextField id="q-email" label="Email Address" required type="email" value={v.email} onChange={set("email")} error={errors.email} autoComplete="email" />
              </div>
              <TextField id="q-city" label="City" value={v.city} onChange={set("city")} autoComplete="address-level2" />
              <SelectField id="q-service" label="Service Interested In" required placeholder="Select a service" options={QUOTE_SERVICES} value={v.service} onChange={set("service")} error={errors.service} />
              <SubmitError state={state} />
              <Button type="submit" variant="gradient" size="lg" loading={state.status === "loading"} className="w-full">
                {state.status === "loading" ? "Sending…" : "Get Your Custom Quote"}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export function QuoteSuccessNote() { return <FormAlert tone="success" title="Thank You!">We&apos;ll contact you within 24 hours.</FormAlert>; }
