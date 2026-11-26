/**
 * Company information — copied from the original website (header, footer, contact page, JSON-LD).
 * Known inconsistencies in the source are listed in docs/PENDING_DECISIONS.md and are NOT silently resolved.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://auctechitsolutions.in").replace(/\/$/, "");

export const company = {
  name: "Auctech IT Solutions",
  legalName: "Auctech IT Solutions Pvt. Ltd.",
  tagline:
    "We don't just do digital marketing — we build brands that dominate. Young, fast-growing, and always ahead of the curve.",
  // Footer / header / contact page number
  phonePrimary: { display: "+91-9026343351", tel: "+919026343351" },
  // Number used by JSON-LD, the contact success message and the WhatsApp float on the original site
  phoneSecondary: { display: "+91-9565443351", tel: "+919565443351" },
  whatsapp: "https://wa.me/919565443351?text=Hello+Auctech+IT+Solutions!",
  email: "info@auctechitsolutions.in",
  officeDisplay: "Lucknow, Uttar Pradesh, India",
  address: {
    streetAddress: "2nd Floor Sana Palace 2, Opp. Sahara Mall, Hazratganj",
    addressLocality: "Lucknow",
    addressRegion: "Uttar Pradesh",
    postalCode: "226001",
    addressCountry: "IN",
  },
  // As displayed on contact.php
  hours: [
    { days: "Monday – Friday", time: "10:00 AM – 7:00 PM" },
    { days: "Saturday", time: "10:00 AM – 5:00 PM" },
    { days: "Sunday", time: "Closed" },
  ],
  social: [
    { key: "facebook", label: "Facebook", href: "https://www.facebook.com/share/tWzWLJTaxxM8RUyU" },
    { key: "instagram", label: "Instagram", href: "https://www.instagram.com/auctechitsolutions_pvtltd" },
    { key: "twitter", label: "X (Twitter)", href: "https://twitter.com/auctech_it" },
    { key: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/company/auctech-it-solution" },
    { key: "youtube", label: "YouTube", href: "https://www.youtube.com/@AuctechItsolutions" },
    { key: "whatsapp", label: "WhatsApp", href: "https://wa.me/919026343351" },
  ],
  logo: {
    // Official uploaded logo (894x252 trimmed artwork from 1024x1024 master)
    white: "/brand/auctech-logo-white.png",
    width: 894,
    height: 252,
  },
  footerCta: {
    title: "Ready to Amplify Your Vision?",
    text: "Contact Auctech IT Solutions today! Let's embark on a collaborative journey to transform your vision into a thriving reality.",
  },
} as const;

export const contentApprovals = {
  /** Original homepage testimonials exist but "Testimonials, only when approved" — hidden until approved. */
  testimonials: false,
  /** privacy-policy.php returns 404 on the original site; UI is built but content publication is pending. */
  privacyPolicy: false,
};

export function absoluteUrl(path: string) {
  if (path === "/" || path === "") return `${SITE_URL}/`;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Original assets are referenced as "img/..."; normalise to an absolute public path. */
export function assetPath(src: string) {
  if (/^https?:/.test(src)) return src;
  return "/" + src.replace(/^\.?\//, "").replace(/&amp;/g, "&");
}
