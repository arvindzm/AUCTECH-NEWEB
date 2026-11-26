import { FormAlert } from "@/components/forms/FormAlert";
import { company } from "@/lib/site";
import type { SubmitState } from "@/hooks/useSubmit";

/** Honest error state: in Phase 3 the backend is not connected, so direct contact options are offered. */
export function SubmitError({ state }: { state: SubmitState }) {
  if (state.status !== "error") return null;
  return (
    <FormAlert tone="error" title={state.notConnected ? "Online submissions aren't available yet" : "We couldn't send your message"}>
      {state.notConnected
        ? <>Your details were <strong>not sent</strong>. Please reach us directly at{" "}
            <a className="font-semibold underline" href={`tel:${company.phonePrimary.tel}`}>{company.phonePrimary.display}</a> or{" "}
            <a className="font-semibold underline" href={`mailto:${company.email}`}>{company.email}</a>.</>
        : <>{state.error} Please try again, or call <a className="font-semibold underline" href={`tel:${company.phonePrimary.tel}`}>{company.phonePrimary.display}</a>.</>}
    </FormAlert>
  );
}
