"use client";
import { useEffect, useState } from "react";

/** Live open/closed indicator based on the hours listed on contact.php (Asia/Kolkata). */
export function OpenStatus() {
  const [s, setS] = useState<null | boolean>(null);
  useEffect(() => {
    const calc = () => {
      const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
      const d = now.getDay(), m = now.getHours() * 60 + now.getMinutes();
      setS(d >= 1 && d <= 5 ? m >= 600 && m < 1140 : d === 6 ? m >= 600 && m < 1020 : false);
    };
    calc(); const t = setInterval(calc, 60000); return () => clearInterval(t);
  }, []);
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1.5 text-xs font-bold" aria-live="polite">
      <span aria-hidden className={`size-2 rounded-full ${s === null ? "bg-slate-300" : s ? "bg-emerald-500" : "bg-red-500"}`} />
      {s === null ? "Checking status..." : s ? "Open now" : "Currently closed"}
    </span>
  );
}
