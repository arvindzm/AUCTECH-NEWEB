import type { Metadata } from "next";
import { FileClock } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { buildMetadata } from "@/lib/seo";
import { company, contentApprovals } from "@/lib/site";

/**
 * Privacy Policy UI. The original URL currently returns 404 and no approved policy text exists,
 * so the page is noindexed and shows a pending notice until content is approved (see PENDING_DECISIONS.md).
 */
export const metadata: Metadata = buildMetadata({
  path: "/privacy-policy",
  title: "Privacy Policy | Auctech IT Solutions",
  description: "Privacy Policy of Auctech IT Solutions.",
  noindex: !contentApprovals.privacyPolicy,
});

export default function PrivacyPage() {
  return (
    <>
      <PageHero title="Privacy Policy" accent="Policy" crumbs={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />
      <section className="py-20">
        <div className="container-x max-w-3xl">
          <div className="rounded-[2rem] border border-dashed border-line bg-surface p-10 text-center">
            <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-card"><FileClock aria-hidden className="size-8" /></span>
            <h2 className="mt-5 text-2xl font-extrabold">Our privacy policy is being finalised</h2>
            <p className="mx-auto mt-2 max-w-lg text-muted">
              For any questions about how we handle your information, please contact us at{" "}
              <a className="font-semibold text-brand-700 underline" href={`mailto:${company.email}`}>{company.email}</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
