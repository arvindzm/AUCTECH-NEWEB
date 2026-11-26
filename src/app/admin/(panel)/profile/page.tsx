"use client";
import { useState } from "react";
import { KeyRound } from "lucide-react";
import { SingletonForm } from "@/features/admin/components/SingletonForm";
import { ABtn, Card } from "@/features/admin/components/ui";
import { inputCls } from "@/features/admin/components/fields";
import { useToast } from "@/features/admin/components/Toast";
import { cn } from "@/lib/cn";

function PasswordCard() {
  const toast = useToast();
  const [v, setV] = useState({ current: "", next: "", confirm: "" });
  const [err, setErr] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const f = (k: keyof typeof v, label: string, ac: string) => (
    <div>
      <label htmlFor={`pw-${k}`} className="mb-1.5 block text-sm font-semibold">{label}</label>
      <input id={`pw-${k}`} type="password" autoComplete={ac} value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value })} aria-invalid={!!err[k]}
        className={cn(inputCls, err[k] ? "border-red-400" : "border-line focus:border-brand-500 focus:ring-brand-100")} />
      {err[k] && <p role="alert" className="mt-1 text-xs font-medium text-red-600">{err[k]}</p>}
    </div>
  );
  return (
    <Card title="Change password">
      <div className="grid gap-4 sm:grid-cols-3">{f("current", "Current password", "current-password")}{f("next", "New password", "new-password")}{f("confirm", "Confirm new password", "new-password")}</div>
      <p className="mt-3 text-xs text-muted">At least 8 characters, including a letter and a number.</p>
      <ABtn type="button" className="mt-4" loading={busy} onClick={async () => {
        const e: Record<string, string> = {};
        if (!v.current) e.current = "Enter your current password.";
        if (v.next.length < 8 || !/[a-z]/i.test(v.next) || !/\d/.test(v.next)) e.next = "Use at least 8 characters with a letter and a number.";
        if (v.next !== v.confirm) e.confirm = "Passwords don't match.";
        setErr(e); if (Object.keys(e).length) return;
        setBusy(true); await new Promise((r) => setTimeout(r, 600)); setBusy(false);
        toast({ tone: "error", title: "Password not changed", text: "The authentication service isn't connected yet (Phase 4)." });
      }}><KeyRound className="size-4" />Update password</ABtn>
    </Card>
  );
}

export default function ProfileAdmin() {
  return (
    <SingletonForm storeKey="profile" title="Profile & Account" description="Your admin account details. Accounts and roles are provided by the authentication service (Phase 4)."
      fields={[
        { name: "avatar", label: "Profile photo", type: "image", section: "Profile" },
        { name: "name", label: "Full name", type: "text", required: true, section: "Profile" },
        { name: "email", label: "Email", type: "email", required: true, section: "Profile" },
        { name: "phone", label: "Phone", type: "text", section: "Profile" },
        { name: "role", label: "Role", type: "readonly", section: "Profile" },
        { name: "notifyEnquiries", label: "Email me about new enquiries", type: "toggle", section: "Notifications" },
        { name: "notifyApplications", label: "Email me about new job applications", type: "toggle", section: "Notifications" },
      ]}
      initial={() => ({ avatar: "", name: "", email: "", phone: "", role: "Assigned by the server after sign-in", notifyEnquiries: true, notifyApplications: true })}
      extra={<PasswordCard />} />
  );
}
