"use client";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { ABtn } from "@/features/admin/components/ui";
import { inputCls } from "@/features/admin/components/fields";
import { authApi, ApiNotConnectedError } from "@/services/api/client";
import { rules } from "@/lib/validation";
import { cn } from "@/lib/cn";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "sent">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const er: typeof errors = {};
    er.email = rules.required("Email")(email) ?? rules.email(email) ?? undefined;
    if (mode === "login") er.password = rules.required("Password")(password) ?? (password.length < 8 ? "Password must be at least 8 characters." : undefined);
    Object.keys(er).forEach((k) => er[k as keyof typeof er] === undefined && delete er[k as keyof typeof er]);
    setErrors(er);
    if (Object.keys(er).length) return;
    setStatus("loading");
    try {
      if (mode === "login") await authApi.login({ email, password, remember });
      else { await authApi.requestPasswordReset(email); setStatus("sent"); return; }
    } catch (err) {
      setStatus("error");
      setMsg(err instanceof ApiNotConnectedError ? "The authentication service isn't connected yet (Phase 4). No credentials were sent." : "Sign-in failed. Check your details and try again.");
    }
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative hidden overflow-hidden hero-mesh p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div aria-hidden className="absolute inset-0 grid-lines" />
        <Logo height={72} href="/" />
        <div className="relative">
          <h2 className="text-4xl font-extrabold !text-white">Auctech Content Manager</h2>
          <p className="mt-3 max-w-md text-white/75">Manage pages, services, city pages, FAQs, portfolio, careers and enquiries for auctechitsolutions.in.</p>
        </div>
        <p className="relative text-sm text-white/50">Authorised staff only.</p>
      </div>
      <main className="flex items-center justify-center bg-white px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex justify-center rounded-2xl bg-navy p-4 lg:hidden"><Logo height={56} href="/" /></div>
          <h1 className="text-2xl font-extrabold">{mode === "login" ? "Sign in" : "Reset password"}</h1>
          <p className="mt-1 text-sm text-muted">{mode === "login" ? "Use your admin account credentials." : "We'll email you a reset link."}</p>
          <form noValidate onSubmit={submit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="l-email" className="mb-1.5 block text-sm font-semibold">Email</label>
              <div className="relative"><Mail aria-hidden className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
                <input id="l-email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? "l-email-err" : undefined}
                  className={cn(inputCls, "h-11 pl-9", errors.email ? "border-red-400 focus:ring-red-100" : "border-line focus:border-brand-500 focus:ring-brand-100")} /></div>
              {errors.email && <p id="l-email-err" role="alert" className="mt-1 text-xs font-medium text-red-600">{errors.email}</p>}
            </div>
            {mode === "login" && (
              <div>
                <div className="mb-1.5 flex items-center justify-between"><label htmlFor="l-pass" className="text-sm font-semibold">Password</label>
                  <button type="button" onClick={() => { setMode("forgot"); setStatus("idle"); }} className="text-xs font-semibold text-brand-700 hover:underline">Forgot password?</button></div>
                <div className="relative"><Lock aria-hidden className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
                  <input id="l-pass" type={show ? "text" : "password"} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} aria-invalid={!!errors.password} aria-describedby={errors.password ? "l-pass-err" : undefined}
                    className={cn(inputCls, "h-11 pl-9 pr-10", errors.password ? "border-red-400 focus:ring-red-100" : "border-line focus:border-brand-500 focus:ring-brand-100")} />
                  <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted hover:bg-surface">{show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></div>
                {errors.password && <p id="l-pass-err" role="alert" className="mt-1 text-xs font-medium text-red-600">{errors.password}</p>}
              </div>
            )}
            {mode === "login" && <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="size-4 accent-brand-700" />Keep me signed in</label>}
            {status === "error" && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{msg}</div>}
            {status === "sent" && <div role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">If an account exists for that email, a reset link will be sent.</div>}
            <ABtn type="submit" className="h-11 w-full" loading={status === "loading"}>{status === "loading" ? (mode === "login" ? "Signing in…" : "Sending…") : mode === "login" ? "Sign in" : "Send reset link"}</ABtn>
            {mode === "forgot" && <button type="button" onClick={() => { setMode("login"); setStatus("idle"); }} className="w-full text-sm font-semibold text-brand-700 hover:underline">Back to sign in</button>}
          </form>
          <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            Phase 3 UI preview: authentication is not implemented. <Link href="/admin" className="font-semibold underline">Open the admin UI preview</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
