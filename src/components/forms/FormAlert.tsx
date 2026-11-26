import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/cn";

export function FormAlert({ tone, title, children, className }: { tone: "error" | "success" | "info"; title: string; children?: React.ReactNode; className?: string }) {
  const Icon = tone === "success" ? CheckCircle2 : tone === "error" ? AlertTriangle : Info;
  return (
    <div role={tone === "error" ? "alert" : "status"} className={cn("flex gap-3 rounded-2xl border p-4 text-sm",
      tone === "success" && "border-emerald-200 bg-emerald-50 text-emerald-900",
      tone === "error" && "border-red-200 bg-red-50 text-red-900",
      tone === "info" && "border-brand-200 bg-brand-50 text-brand-900", className)}>
      <Icon aria-hidden className="mt-0.5 size-5 shrink-0" />
      <div><p className="font-bold">{title}</p>{children && <div className="mt-1 leading-relaxed">{children}</div>}</div>
    </div>
  );
}
