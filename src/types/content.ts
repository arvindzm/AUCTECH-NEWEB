/** Content types for migrated original-site content (src/content). Presentation-agnostic. */

export interface PageMetaSource {
  title: string;
  description?: string;
  keywords?: string;
  "og:title"?: string;
  "og:description"?: string;
  "og:url"?: string;
  "og:image"?: string;
  canonical?: string;
}

export interface ImageRef { src: string; alt: string }
export interface LinkRef { label: string; href: string }
export interface Stat { value: string; label: string }
export interface Card { title: string; text: string }
export interface FaqItem { q: string; a: string }

export interface SectionBlock {
  label: string;
  h2: string;
  accent: string;
  desc?: string;
  items: Card[];
  image?: ImageRef | null;
}

/** Shape shared by the 11 service pages and the 33 city pages (identical original templates). */
export interface ServiceLikePage {
  slug: string; // e.g. "3d-walkthrough-in-kanpur"
  meta: PageMetaSource;
  jsonLd: Record<string, unknown>[];
  hero: { eyebrow: string; h1: string; accent: string; sub: string; breadcrumb: string };
  intro: { label: string; h2: string; accent: string; paras: string[]; image: ImageRef | null; cta: LinkRef | null };
  stats: Stat[];
  why?: SectionBlock;
  power?: SectionBlock;
  services: SectionBlock;
  process: SectionBlock;
  cta: { h2: string; text: string; primary: LinkRef | null };
  faq: { h2: string; accent: string; desc: string; items: FaqItem[] };
}

export type PageKind = "core" | "service" | "city" | "blog" | "legal";

export interface ServiceSummary {
  key: string;
  name: string;
  navLabel: string;
  href: string;
  /** card text taken verbatim from the original service.php listing */
  summary: string;
  image: ImageRef;
}

export interface City {
  slug: string; // "kanpur"
  name: string; // "Kanpur"
  href: string; // "/3d-walkthrough-in-kanpur"
}

export interface PortfolioItem { id: string; category: string; src: string; alt: string }
export interface PortfolioFilter { id: string; label: string }

export interface FaqLibraryItem extends FaqItem { category: string }
export interface FaqCategory { id: string; label: string }

export interface TeamMember { name: string; role: string; image: string | null }

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  /** Publication requires explicit approval; see PENDING_DECISIONS.md */
  status: "pending-approval" | "approved";
}

/** Blog — no published articles exist on the original site (blog.php shows "Coming Soon"). */
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverImage?: ImageRef;
  bodyHtml: string;
  author?: string;
  publishedAt: string; // ISO
  readingMinutes?: number;
  seo?: { title?: string; description?: string };
}

export interface JobPosting {
  slug: string;
  title: string;
  department?: string;
  location: string;
  employmentType: "Full-time" | "Part-time" | "Internship" | "Contract";
  experience?: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  postedAt: string;
}
