"use client";
import { createContext, useCallback, useContext, useState } from "react";
import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/cn";

type Tone = "success" | "error" | "info";
interface T { id: number; tone: Tone; title: string; text?: string }
const Ctx = createContext<(t: Omit<T, "id">) => void>(() => {});
export const useToast = () => useContext(Ctx);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<T[]>([]);
  const push = useCallback((t: Omit<T, "id">) => {
    const id = Date.now() + Math.random();
    setItems((s) => [...s, { ...t, id }]);
    setTimeout(() => setItems((s) => s.filter((x) => x.id !== id)), 5000);
  }, []);
  return (
    <Ctx.Provider value={push}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed bottom-4 right-4 z-[90] flex w-[min(92vw,380px)] flex-col gap-2">
        {items.map((t) => {
          const I = t.tone === "success" ? CheckCircle2 : t.tone === "error" ? AlertTriangle : Info;
          return (
            <div key={t.id} role={t.tone === "error" ? "alert" : "status"} className={cn("pointer-events-auto flex gap-3 rounded-xl border bg-white p-4 shadow-lg animate-fade-up",
              t.tone === "success" ? "border-emerald-200" : t.tone === "error" ? "border-red-200" : "border-brand-200")}>
              <I aria-hidden className={cn("mt-0.5 size-5 shrink-0", t.tone === "success" ? "text-emerald-600" : t.tone === "error" ? "text-red-600" : "text-brand-600")} />
              <div className="min-w-0 flex-1"><p className="text-sm font-bold text-ink">{t.title}</p>{t.text && <p className="mt-0.5 text-sm text-muted">{t.text}</p>}</div>
              <button type="button" aria-label="Dismiss" onClick={() => setItems((s) => s.filter((x) => x.id !== t.id))} className="text-muted hover:text-ink"><X className="size-4" /></button>
            </div>
          );
        })}
      </div>
    </Ctx.Provider>
  );
}
