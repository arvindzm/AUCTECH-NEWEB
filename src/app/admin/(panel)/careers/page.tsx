"use client";
import { SingletonForm } from "@/features/admin/components/SingletonForm";
import { corePages } from "@/content/core-pages";

const c = corePages.careers;
export default function CareersAdmin() {
  return (
    <SingletonForm storeKey="careers-page" title="Careers Page" description="Copy for /career: hero, openings intro, empty state and ‘Why work with us’ perks. Job postings are managed under Jobs."
      fields={[
        { name: "h1", label: "Hero heading (H1)", type: "text", required: true, section: "Hero", wide: true },
        { name: "heroSub", label: "Hero subtitle", type: "textarea", section: "Hero", wide: true },
        { name: "openingsTitle", label: "Openings heading", type: "text", required: true, section: "Openings" },
        { name: "openingsLabel", label: "Openings eyebrow", type: "text", section: "Openings" },
        { name: "openingsDesc", label: "Openings intro", type: "textarea", section: "Openings", wide: true },
        { name: "emptyTitle", label: "No-openings title", type: "text", section: "Empty state" },
        { name: "emptyText", label: "No-openings message", type: "textarea", section: "Empty state", wide: true },
        { name: "perks", label: "Perks", type: "cards", section: "Why work with us", wide: true },
        { name: "acceptGeneral", label: "Accept general applications (no specific job)", type: "toggle", section: "Applications" },
        { name: "notifyEmail", label: "Notification email", type: "email", section: "Applications", help: "Where new applications are sent (Phase 4)." },
      ]}
      initial={() => ({ h1: c.hero.h1, heroSub: c.hero.sub, openingsTitle: c.openings.h2, openingsLabel: c.openings.label, openingsDesc: c.openings.desc, emptyTitle: c.empty.title, emptyText: c.empty.text, perks: c.perks, acceptGeneral: true, notifyEmail: "" })} />
  );
}
