import { cn } from "@/lib/cn";

const control =
  "w-full rounded-2xl border bg-white px-4 py-3 text-[15px] text-ink placeholder:text-muted/70 transition focus:outline-none focus:ring-4";
const ok = "border-line focus:border-brand-500 focus:ring-brand-100";
const bad = "border-red-400 focus:border-red-500 focus:ring-red-100";

interface BaseProps { id: string; label: string; required?: boolean; error?: string; hint?: string; className?: string }

function Wrap({ id, label, required, error, hint, className, children }: BaseProps & { children: React.ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">
        {label} {required ? <span className="text-red-600" aria-hidden>*</span> : <span className="font-normal text-muted">(optional)</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm font-medium text-red-600">{error}</p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export function TextField({ id, label, required, error, hint, className, ...rest }: BaseProps & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Wrap {...{ id, label, required, error, hint, className }}>
      <input id={id} name={id} aria-required={required} aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(control, error ? bad : ok)} {...rest} />
    </Wrap>
  );
}

export function TextAreaField({ id, label, required, error, hint, className, ...rest }: BaseProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Wrap {...{ id, label, required, error, hint, className }}>
      <textarea id={id} name={id} aria-required={required} aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(control, "min-h-32 resize-y", error ? bad : ok)} {...rest} />
    </Wrap>
  );
}

export function SelectField({ id, label, required, error, hint, className, options, placeholder, ...rest }:
  BaseProps & { options: string[]; placeholder?: string } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <Wrap {...{ id, label, required, error, hint, className }}>
      <select id={id} name={id} aria-required={required} aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(control, "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 fill=%22none%22 stroke=%22%235f6782%22 stroke-width=%222%22><path d=%22m4 6 4 4 4-4%22/></svg>')] bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-10", error ? bad : ok)} {...rest}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </Wrap>
  );
}
