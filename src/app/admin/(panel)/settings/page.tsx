"use client";
import { SingletonForm } from "@/features/admin/components/SingletonForm";
import { company } from "@/lib/site";

export default function SettingsAdmin() {
  return (
    <SingletonForm storeKey="settings" title="Website Settings" description="Company details, contact information, social links and branding used across the website."
      fields={[
        { name: "siteName", label: "Site name", type: "text", required: true, section: "General" },
        { name: "legalName", label: "Legal name", type: "text", section: "General" },
        { name: "tagline", label: "Footer tagline", type: "textarea", section: "General", wide: true },
        { name: "phonePrimary", label: "Primary phone", type: "text", required: true, section: "Contact" },
        { name: "phoneSecondary", label: "Secondary phone / WhatsApp", type: "text", section: "Contact", help: "Original site uses two different numbers — see pending decisions." },
        { name: "email", label: "Email", type: "email", required: true, section: "Contact" },
        { name: "officeDisplay", label: "Office (display)", type: "text", section: "Contact" },
        { name: "address", label: "Full address", type: "textarea", section: "Contact", wide: true },
        { name: "hoursWeekday", label: "Hours: Monday – Friday", type: "text", section: "Working hours" },
        { name: "hoursSaturday", label: "Hours: Saturday", type: "text", section: "Working hours" },
        { name: "hoursSunday", label: "Hours: Sunday", type: "text", section: "Working hours" },
        ...company.social.map((s) => ({ name: `social_${s.key}`, label: s.label, type: "url" as const, section: "Social links" })),
        { name: "logoWhite", label: "White logo", type: "image" as const, section: "Branding", help: "Approved white logo — used on dark header/footer." },
        { name: "favicon", label: "Favicon", type: "image" as const, section: "Branding" },
        { name: "maintenance", label: "Show maintenance banner", type: "toggle" as const, section: "Advanced" },
        { name: "analyticsId", label: "Analytics measurement ID", type: "text" as const, section: "Advanced", placeholder: "G-XXXXXXX" },
      ]}
      initial={() => ({
        siteName: company.name, legalName: company.legalName, tagline: company.tagline, phonePrimary: company.phonePrimary.display, phoneSecondary: company.phoneSecondary.display,
        email: company.email, officeDisplay: company.officeDisplay, address: `${company.address.streetAddress}, ${company.address.addressLocality}, ${company.address.addressRegion} ${company.address.postalCode}`,
        hoursWeekday: company.hours[0].time, hoursSaturday: company.hours[1].time, hoursSunday: company.hours[2].time,
        ...Object.fromEntries(company.social.map((s) => [`social_${s.key}`, s.href])), logoWhite: company.logo.white, favicon: "/icon.png", maintenance: false, analyticsId: "",
      })} />
  );
}
