import { cities, services } from "@/lib/content";

export interface NavItem { label: string; href: string; children?: NavItem[] }

/** Mirrors the original header menu order. */
export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  {
    label: "Services",
    href: "/service",
    children: services.map((s) => ({ label: s.navLabel, href: s.href })),
  },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Blogs", href: "/blog" },
  { label: "Careers", href: "/career" },
  { label: "Contact", href: "/contact" },
];

export const footerQuickLinks: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Our Services", href: "/service" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Our Team", href: "/our-team" },
  { label: "Blog", href: "/blog" },
  { label: "Careers", href: "/career" },
  { label: "Contact Us", href: "/contact" },
  { label: "FAQ", href: "/faq" },
];

export const footerServiceLinks: NavItem[] = services.map((s) => ({ label: s.navLabel, href: s.href }));
export const footerCityLinks: NavItem[] = cities.map((c) => ({ label: `3D Walkthrough Service in ${c.name}`, href: c.href }));
