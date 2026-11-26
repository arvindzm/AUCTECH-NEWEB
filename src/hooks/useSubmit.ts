"use client";
import { useState } from "react";
import { ApiNotConnectedError } from "@/services/api/client";

export type SubmitState = { status: "idle" | "loading" | "success" | "error"; error?: string; notConnected?: boolean };

/** Wraps an async submit call with loading / success / error state. */
export function useSubmit() {
  const [state, setState] = useState<SubmitState>({ status: "idle" });
  async function run(fn: () => Promise<unknown>) {
    setState({ status: "loading" });
    try { await fn(); setState({ status: "success" }); return true; }
    catch (e) {
      setState({ status: "error", notConnected: e instanceof ApiNotConnectedError, error: e instanceof Error ? e.message : "Something went wrong." });
      return false;
    }
  }
  return { state, run, reset: () => setState({ status: "idle" }) };
}
