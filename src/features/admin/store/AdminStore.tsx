"use client";
/**
 * TEMPORARY UI ADAPTER (Phase 3).
 * Holds admin records in React state for the current browser tab only. Records are seeded from migrated
 * original content; user-originated modules start empty. Nothing is persisted or sent anywhere.
 * Phase 4 replaces this provider with calls to `resourceApi()` (src/services/api/client.ts).
 */
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { getResource } from "@/features/admin/config/resources";
import type { Rec } from "@/features/admin/types";

interface Store {
  list: (key: string) => Rec[];
  get: (key: string, id: string) => Rec | undefined;
  create: (key: string, data: Omit<Rec, "id">) => Promise<Rec>;
  update: (key: string, id: string, data: Partial<Rec>) => Promise<Rec>;
  remove: (key: string, ids: string[]) => Promise<void>;
  singleton: <T extends Record<string, unknown>>(key: string, initial: () => T) => [T, (v: T) => Promise<void>];
}
const Ctx = createContext<Store | null>(null);
const delay = (ms = 450) => new Promise((r) => setTimeout(r, ms));
const now = () => new Date().toISOString();

export function AdminStoreProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<Record<string, Rec[]>>({});
  const [singles, setSingles] = useState<Record<string, Record<string, unknown>>>({});
  const dataRef = useRef(data); dataRef.current = data;

  const ensure = useCallback((key: string): Rec[] => {
    if (dataRef.current[key]) return dataRef.current[key];
    const seeded = (getResource(key)?.seed?.() ?? []).map((r) => ({ createdAt: undefined, updatedAt: undefined, ...r }));
    dataRef.current = { ...dataRef.current, [key]: seeded };
    queueMicrotask(() => setData((d) => (d[key] ? d : { ...d, [key]: seeded })));
    return seeded;
  }, []);

  const store = useMemo<Store>(() => ({
    list: (key) => data[key] ?? ensure(key),
    get: (key, id) => (data[key] ?? ensure(key)).find((r) => r.id === id),
    create: async (key, input) => {
      await delay();
      const rec: Rec = { ...input, id: `${key}-${Date.now().toString(36)}`, createdAt: now(), updatedAt: now() };
      setData((d) => ({ ...d, [key]: [rec, ...(d[key] ?? ensure(key))] }));
      return rec;
    },
    update: async (key, id, input) => {
      await delay();
      let out: Rec | undefined;
      setData((d) => ({ ...d, [key]: (d[key] ?? ensure(key)).map((r) => (r.id === id ? (out = { ...r, ...input, updatedAt: now() }) : r)) }));
      return out ?? ({ id } as Rec);
    },
    remove: async (key, ids) => {
      await delay();
      setData((d) => ({ ...d, [key]: (d[key] ?? ensure(key)).filter((r) => !ids.includes(r.id)) }));
    },
    singleton: (key, initial) => {
      const v = (singles[key] ?? initial()) as never;
      return [v, async (nv) => { await delay(); setSingles((s) => ({ ...s, [key]: nv })); }];
    },
  }), [data, singles, ensure]);

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useAdminStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useAdminStore must be used inside AdminStoreProvider");
  return s;
}
