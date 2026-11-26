/**
 * Admin module definitions. Seeds come ONLY from migrated original content (src/content).
 * Modules whose data originates from users (enquiries, applications) or has no published content (blog, jobs)
 * start empty — no demo records are created.
 */
import {
  LayoutDashboard, Briefcase, FileText, FolderTree, HelpCircle, Image as ImageIcon, Inbox, LayoutTemplate, MapPinned,
  MessageSquareQuote, Newspaper, SearchCheck, Sparkles, UserRoundCheck, Users,
} from "lucide-react";
import type { FieldDef, Rec, ResourceConfig } from "@/features/admin/types";
import coreMeta from "@/content/core-meta.json";
import { servicePageRegistry } from "@/content/pages";
import {
  allTestimonials, cities, faqCategories, faqItems, portfolioFilters, portfolioItems, services, teamMembers,
} from "@/lib/content";
import { corePages } from "@/content/core-pages";

const PUB = ["published", "draft", "archived"];
const seoFields: FieldDef[] = [
  { name: "metaTitle", label: "Meta title", type: "text", section: "SEO", maxLength: 70, help: "Recommended 50–60 characters." },
  { name: "metaDescription", label: "Meta description", type: "textarea", section: "SEO", maxLength: 170, help: "Recommended 120–160 characters." },
  { name: "keywords", label: "Keywords", type: "text", section: "SEO", help: "Comma-separated." },
  { name: "canonical", label: "Canonical URL", type: "url", section: "SEO" },
];
const fromMeta = (m: Record<string, string> | undefined) => ({
  metaTitle: m?.title ?? "", metaDescription: m?.description ?? "", keywords: m?.keywords ?? "", canonical: m?.canonical ?? "",
});

/* ---------- Pages (core pages) ---------- */
const CORE: [string, string, keyof typeof coreMeta | null][] = [
  ["Home", "/", "home"], ["About Us", "/about", "about"], ["Services", "/service", "service"],
  ["Portfolio", "/portfolio", "portfolio"], ["Blog", "/blog", "blog"], ["FAQ", "/faq", "faq"],
  ["Our Team", "/our-team", "our-team"], ["Contact", "/contact", "contact"], ["Careers", "/career", "career"],
  ["Privacy Policy", "/privacy-policy", null],
];
const heroFor: Record<string, { h1: string; sub: string } | undefined> = {
  "/about": corePages.about.hero, "/service": corePages.services.hero, "/portfolio": corePages.portfolio.hero,
  "/blog": corePages.blog.hero, "/faq": corePages.faq.hero, "/our-team": corePages.team.hero,
  "/contact": corePages.contact.hero, "/career": corePages.careers.hero,
};

const pages: ResourceConfig = {
  key: "pages", label: "Pages", singular: "Page", group: "Website", icon: LayoutTemplate, source: "migrated",
  description: "Core website pages, their hero copy and publication status.",
  titleKey: "title", searchKeys: ["title", "path"], canCreate: true, canDelete: true,
  columns: [{ key: "title", label: "Page" }, { key: "path", label: "URL", render: "mono" }, { key: "template", label: "Template", render: "badge" }, { key: "status", label: "Status", render: "status" }, { key: "updatedAt", label: "Updated", render: "date" }],
  filters: [{ key: "status", label: "Status", options: [...PUB, "pending-approval"] }],
  statusOptions: [...PUB, "pending-approval"],
  fields: [
    { name: "title", label: "Page title", type: "text", required: true, section: "General" },
    { name: "path", label: "URL path", type: "slug", required: true, section: "General", help: "URL slugs must be preserved.", readOnlyOnEdit: true },
    { name: "template", label: "Template", type: "select", options: ["Home", "Standard", "Listing", "Contact", "Legal"], section: "General" },
    { name: "status", label: "Status", type: "select", options: [...PUB, "pending-approval"], required: true, section: "General" },
    { name: "h1", label: "Hero heading (H1)", type: "text", section: "Hero", wide: true },
    { name: "heroSub", label: "Hero subtitle", type: "textarea", section: "Hero", wide: true },
    { name: "body", label: "Body content", type: "richtext", section: "Content", wide: true },
    ...seoFields,
  ],
  seed: () => CORE.map(([title, path, key], i) => ({
    id: `page-${i + 1}`, title, path, status: key ? "published" : "pending-approval",
    template: path === "/" ? "Home" : path === "/contact" ? "Contact" : path === "/privacy-policy" ? "Legal" : ["/blog", "/portfolio", "/service", "/faq"].includes(path) ? "Listing" : "Standard",
    h1: path === "/" ? "Premium 3D Architectural Walkthroughs & Digital Marketing - Company in Lucknow" : heroFor[path]?.h1 ?? (path === "/privacy-policy" ? "Privacy Policy" : ""),
    heroSub: heroFor[path]?.sub ?? "", body: "",
    ...fromMeta(key ? (coreMeta as Record<string, Record<string, string>>)[key] : undefined),
  })),
};

/* ---------- Services & City pages ---------- */
const pageContentFields: FieldDef[] = [
  { name: "h1", label: "Hero heading (H1)", type: "text", required: true, section: "Hero", wide: true },
  { name: "eyebrow", label: "Hero eyebrow", type: "text", section: "Hero" },
  { name: "heroSub", label: "Hero subtitle", type: "textarea", section: "Hero", wide: true },
  { name: "introHeading", label: "Intro heading (H2)", type: "text", section: "Introduction", wide: true },
  { name: "introParas", label: "Intro paragraphs", type: "list", section: "Introduction", wide: true },
  { name: "introImage", label: "Intro image", type: "image", section: "Introduction" },
  { name: "stats", label: "Stats", type: "stats", section: "Stats", wide: true, help: "Shown exactly as entered. Only use verified figures." },
  { name: "offerings", label: "Service cards", type: "cards", section: "Services offered", wide: true },
  { name: "process", label: "Process steps", type: "cards", section: "Process", wide: true },
  { name: "faqs", label: "Page FAQs", type: "faqs", section: "FAQs", wide: true },
];
function pageSeed(slug: string) {
  const p = servicePageRegistry[slug];
  return {
    h1: p.hero.h1, eyebrow: p.hero.eyebrow, heroSub: p.hero.sub, introHeading: p.intro.h2, introParas: p.intro.paras,
    introImage: p.intro.image?.src ? `/${p.intro.image.src}` : "", stats: p.stats, offerings: p.services.items, process: p.process.items,
    faqs: p.faq.items, ...fromMeta(p.meta as unknown as Record<string, string>),
  };
}

const servicesRes: ResourceConfig = {
  key: "services", label: "Services", singular: "Service", group: "Content", icon: Sparkles, source: "migrated",
  description: "The 11 original service pages: listing card, page sections, FAQs and SEO.",
  titleKey: "name", searchKeys: ["name", "slug"], canCreate: true, canDelete: true,
  columns: [{ key: "cardImage", label: "", render: "image" }, { key: "name", label: "Service" }, { key: "slug", label: "URL", render: "mono" }, { key: "faqs", label: "FAQs", render: "count" }, { key: "status", label: "Status", render: "status" }],
  filters: [{ key: "status", label: "Status", options: PUB }], statusOptions: PUB,
  fields: [
    { name: "name", label: "Service name", type: "text", required: true, section: "Listing" },
    { name: "navLabel", label: "Menu label", type: "text", required: true, section: "Listing" },
    { name: "slug", label: "URL slug", type: "slug", required: true, section: "Listing", readOnlyOnEdit: true, help: "URL slug — do not change after publishing." },
    { name: "status", label: "Status", type: "select", options: PUB, required: true, section: "Listing" },
    { name: "summary", label: "Card summary", type: "textarea", required: true, section: "Listing", wide: true, maxLength: 220 },
    { name: "cardImage", label: "Card image", type: "image", section: "Listing" },
    ...pageContentFields, ...seoFields,
  ],
  seed: () => services.map((s, i) => ({ id: `svc-${i + 1}`, name: s.name, navLabel: s.navLabel, slug: s.href.slice(1), status: "published", summary: s.summary, cardImage: `/${s.image.src}`, ...pageSeed(s.href.slice(1)) })),
};

const cityRes: ResourceConfig = {
  key: "city-pages", label: "City Pages", singular: "City Page", group: "Content", icon: MapPinned, source: "migrated",
  description: "The 33 original 3D-walkthrough city pages. The shared H1 is preserved unless a content decision changes it.",
  titleKey: "city", searchKeys: ["city", "slug"], canCreate: true, canDelete: true,
  note: "The 150-word minimum applies to NEW city pages only; existing original pages are exempt.",
  columns: [{ key: "city", label: "City" }, { key: "slug", label: "URL", render: "mono" }, { key: "h1", label: "H1" }, { key: "faqs", label: "FAQs", render: "count" }, { key: "status", label: "Status", render: "status" }],
  filters: [{ key: "status", label: "Status", options: PUB }], statusOptions: PUB,
  fields: [
    { name: "city", label: "City name", type: "text", required: true, section: "General" },
    { name: "slug", label: "URL slug", type: "slug", required: true, section: "General", readOnlyOnEdit: true, help: "Format: 3d-walkthrough-in-{city}" },
    { name: "status", label: "Status", type: "select", options: PUB, required: true, section: "General" },
    ...pageContentFields, ...seoFields,
  ],
  seed: () => cities.map((c, i) => ({ id: `city-${i + 1}`, city: c.name, slug: c.href.slice(1), status: "published", ...pageSeed(c.href.slice(1)) })),
};

/* ---------- FAQs ---------- */
const faqCatLabels = faqCategories.filter((c) => c.id !== "all").map((c) => c.label);
const faqRes: ResourceConfig = {
  key: "faqs", label: "FAQs", singular: "FAQ", group: "Content", icon: HelpCircle, source: "migrated",
  description: "FAQ library (/faq). Page-specific FAQs are managed inside each Service / City page.",
  titleKey: "question", searchKeys: ["question", "answer"], canCreate: true, canDelete: true,
  columns: [{ key: "question", label: "Question" }, { key: "category", label: "Category", render: "badge" }, { key: "order", label: "Order" }, { key: "status", label: "Status", render: "status" }],
  filters: [{ key: "category", label: "Category", options: faqCatLabels }, { key: "status", label: "Status", options: PUB }], statusOptions: PUB,
  fields: [
    { name: "question", label: "Question", type: "text", required: true, wide: true, maxLength: 250 },
    { name: "answer", label: "Answer", type: "textarea", required: true, wide: true, maxLength: 2000 },
    { name: "category", label: "Category", type: "select", options: faqCatLabels, required: true },
    { name: "order", label: "Display order", type: "number" },
    { name: "status", label: "Status", type: "select", options: PUB, required: true },
  ],
  seed: () => faqItems.map((f, i) => ({ id: `faq-${i + 1}`, question: f.q, answer: f.a, category: faqCategories.find((c) => c.id === f.category)?.label ?? f.category, order: i + 1, status: "published" })),
};

/* ---------- Blog ---------- */
const blogRes: ResourceConfig = {
  key: "blog", label: "Blog Posts", singular: "Blog Post", group: "Content", icon: Newspaper, source: "api-only", preview: "blog",
  description: "Articles for /blog and /blog/{slug}. No articles are published on the original site.",
  titleKey: "title", searchKeys: ["title", "slug", "category"], canCreate: true, canDelete: true,
  columns: [{ key: "coverImage", label: "", render: "image" }, { key: "title", label: "Title" }, { key: "category", label: "Category", render: "badge" }, { key: "publishedAt", label: "Publish date", render: "date" }, { key: "status", label: "Status", render: "status" }],
  filters: [{ key: "status", label: "Status", options: PUB }], statusOptions: PUB,
  fields: [
    { name: "title", label: "Title", type: "text", required: true, wide: true, maxLength: 120, section: "Article" },
    { name: "slug", label: "Slug", type: "slug", required: true, section: "Article", help: "Public URL: /blog/{slug}" },
    { name: "category", label: "Category", type: "text", section: "Article", help: "Must match a Blog category." },
    { name: "excerpt", label: "Excerpt", type: "textarea", required: true, wide: true, maxLength: 300, section: "Article" },
    { name: "coverImage", label: "Cover image", type: "image", section: "Article" },
    { name: "coverAlt", label: "Cover image alt text", type: "text", section: "Article" },
    { name: "body", label: "Body", type: "richtext", required: true, wide: true, section: "Article" },
    { name: "author", label: "Author", type: "text", section: "Publishing" },
    { name: "publishedAt", label: "Publish date", type: "date", section: "Publishing" },
    { name: "status", label: "Status", type: "select", options: PUB, required: true, section: "Publishing" },
    ...seoFields.slice(0, 2),
  ],
};

/* ---------- Categories ---------- */
const catRes: ResourceConfig = {
  key: "categories", label: "Categories", singular: "Category", group: "Content", icon: FolderTree, source: "migrated",
  description: "Taxonomies used by the FAQ library, portfolio filters and blog. (Module approval pending — see report.)",
  titleKey: "name", searchKeys: ["name", "slug"], canCreate: true, canDelete: true,
  columns: [{ key: "name", label: "Name" }, { key: "slug", label: "Slug", render: "mono" }, { key: "type", label: "Used by", render: "badge" }],
  filters: [{ key: "type", label: "Type", options: ["FAQ", "Portfolio", "Blog"] }],
  fields: [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "slug", label: "Slug", type: "slug", required: true },
    { name: "type", label: "Used by", type: "select", options: ["FAQ", "Portfolio", "Blog"], required: true },
    { name: "description", label: "Description", type: "textarea", wide: true },
  ],
  seed: () => [
    ...faqCategories.filter((c) => c.id !== "all").map((c, i) => ({ id: `cat-faq-${i}`, name: c.label, slug: c.id, type: "FAQ", description: "" })),
    ...portfolioFilters.filter((c) => c.id !== "all").map((c, i) => ({ id: `cat-pf-${i}`, name: c.label, slug: c.id, type: "Portfolio", description: "" })),
  ],
};

/* ---------- Portfolio ---------- */
const pfLabels = portfolioFilters.filter((f) => f.id !== "all").map((f) => f.label);
const portfolioRes: ResourceConfig = {
  key: "portfolio", label: "Portfolio", singular: "Portfolio Item", group: "Content", icon: ImageIcon, source: "migrated",
  description: "Gallery images for /portfolio. Only metadata present in source content is shown.",
  titleKey: "alt", searchKeys: ["alt", "category"], canCreate: true, canDelete: true,
  columns: [{ key: "image", label: "", render: "image" }, { key: "alt", label: "Alt text" }, { key: "category", label: "Category", render: "badge" }, { key: "order", label: "Order" }, { key: "status", label: "Status", render: "status" }],
  filters: [{ key: "category", label: "Category", options: pfLabels }, { key: "status", label: "Status", options: PUB }], statusOptions: PUB,
  fields: [
    { name: "image", label: "Image", type: "image", required: true, wide: true },
    { name: "alt", label: "Alt text", type: "text", required: true, maxLength: 150 },
    { name: "category", label: "Category", type: "select", options: pfLabels, required: true },
    { name: "title", label: "Project title", type: "text", help: "Leave empty unless approved project details exist." },
    { name: "client", label: "Client", type: "text", help: "Only with client approval." },
    { name: "featured", label: "Show on homepage", type: "toggle" },
    { name: "order", label: "Display order", type: "number" },
    { name: "status", label: "Status", type: "select", options: PUB, required: true },
  ],
  seed: () => portfolioItems.map((p, i) => ({ id: p.id, image: `/${p.src}`, alt: p.alt, category: portfolioFilters.find((f) => f.id === p.category)?.label ?? p.category, title: "", client: "", featured: p.category === "3d-walkthrough" && i < 8, order: i + 1, status: "published" })),
};

/* ---------- Testimonials ---------- */
const testRes: ResourceConfig = {
  key: "testimonials", label: "Testimonials", singular: "Testimonial", group: "Content", icon: MessageSquareQuote, source: "migrated",
  description: "Testimonials from the original homepage. Hidden on the new site until approved.",
  titleKey: "author", searchKeys: ["author", "role", "quote"], canCreate: true, canDelete: true,
  columns: [{ key: "author", label: "Author" }, { key: "role", label: "Role / source" }, { key: "quote", label: "Quote" }, { key: "status", label: "Status", render: "status" }],
  filters: [{ key: "status", label: "Status", options: ["pending-approval", "published", "archived"] }], statusOptions: ["pending-approval", "published", "archived"],
  fields: [
    { name: "quote", label: "Quote", type: "textarea", required: true, wide: true, maxLength: 600 },
    { name: "author", label: "Author name", type: "text", required: true },
    { name: "role", label: "Role / company / source", type: "text" },
    { name: "status", label: "Status", type: "select", options: ["pending-approval", "published", "archived"], required: true, help: "Publish only with written approval from the client." },
  ],
  seed: () => allTestimonials.map((t, i) => ({ id: `tst-${i + 1}`, quote: t.quote, author: t.author, role: t.role, status: t.status })),
};

/* ---------- Team ---------- */
const teamRes: ResourceConfig = {
  key: "team", label: "Team", singular: "Team Member", group: "Content", icon: Users, source: "migrated",
  description: "Members shown on /our-team.",
  titleKey: "name", searchKeys: ["name", "role"], canCreate: true, canDelete: true,
  columns: [{ key: "photo", label: "", render: "image" }, { key: "name", label: "Name" }, { key: "role", label: "Role" }, { key: "order", label: "Order" }, { key: "status", label: "Status", render: "status" }],
  filters: [{ key: "status", label: "Status", options: PUB }], statusOptions: PUB,
  fields: [
    { name: "name", label: "Full name", type: "text", required: true },
    { name: "role", label: "Role", type: "text" },
    { name: "photo", label: "Photo", type: "image" },
    { name: "order", label: "Display order", type: "number" },
    { name: "status", label: "Status", type: "select", options: PUB, required: true },
  ],
  seed: () => teamMembers.map((m, i) => ({ id: `team-${i + 1}`, name: m.name, role: m.role, photo: m.image ? `/${m.image}` : "", order: i + 1, status: "published" })),
};

/* ---------- Jobs ---------- */
const jobRes: ResourceConfig = {
  key: "jobs", label: "Jobs", singular: "Job", group: "Recruitment", icon: Briefcase, source: "api-only", preview: "job",
  description: "Open positions listed on /career. There are no open positions on the original site.",
  titleKey: "title", searchKeys: ["title", "department", "location"], canCreate: true, canDelete: true,
  columns: [{ key: "title", label: "Title" }, { key: "department", label: "Department" }, { key: "location", label: "Location" }, { key: "employmentType", label: "Type", render: "badge" }, { key: "status", label: "Status", render: "status" }],
  filters: [{ key: "status", label: "Status", options: ["open", "draft", "closed"] }, { key: "employmentType", label: "Type", options: ["Full-time", "Part-time", "Internship", "Contract"] }],
  statusOptions: ["open", "draft", "closed"],
  fields: [
    { name: "title", label: "Job title", type: "text", required: true, section: "Role" },
    { name: "slug", label: "Slug", type: "slug", required: true, section: "Role", help: "Public URL: /career/{slug} (pattern pending approval)" },
    { name: "department", label: "Department", type: "text", section: "Role" },
    { name: "location", label: "Location", type: "text", required: true, section: "Role" },
    { name: "employmentType", label: "Employment type", type: "select", options: ["Full-time", "Part-time", "Internship", "Contract"], required: true, section: "Role" },
    { name: "experience", label: "Experience", type: "text", section: "Role", placeholder: "e.g. 1–3 years" },
    { name: "summary", label: "Summary", type: "textarea", required: true, wide: true, section: "Description" },
    { name: "responsibilities", label: "Responsibilities", type: "list", wide: true, section: "Description" },
    { name: "requirements", label: "Requirements", type: "list", wide: true, section: "Description" },
    { name: "postedAt", label: "Posting date", type: "date", section: "Publishing" },
    { name: "closesAt", label: "Closing date", type: "date", section: "Publishing" },
    { name: "status", label: "Status", type: "select", options: ["open", "draft", "closed"], required: true, section: "Publishing" },
  ],
};

/* ---------- Applications (incoming) ---------- */
const appStatuses = ["received", "shortlisted", "interview", "rejected", "hired"];
const appRes: ResourceConfig = {
  key: "applications", label: "Job Applications", singular: "Application", group: "Recruitment", icon: UserRoundCheck, source: "api-only",
  description: "Applications submitted from /career. Records arrive from the backend (Phase 4).",
  titleKey: "fullName", searchKeys: ["fullName", "email", "phone", "job"], canCreate: false, canDelete: true,
  columns: [{ key: "fullName", label: "Applicant" }, { key: "job", label: "Position" }, { key: "experienceLevel", label: "Level", render: "badge" }, { key: "createdAt", label: "Received", render: "date" }, { key: "status", label: "Status", render: "status" }],
  filters: [{ key: "status", label: "Status", options: appStatuses }, { key: "experienceLevel", label: "Level", options: ["Fresher", "Experienced"] }],
  statusOptions: appStatuses,
  fields: [
    { name: "fullName", label: "Full name", type: "readonly" }, { name: "email", label: "Email", type: "readonly" },
    { name: "phone", label: "Contact number", type: "readonly" }, { name: "job", label: "Position", type: "readonly" },
    { name: "portfolioUrl", label: "Portfolio URL", type: "readonly" }, { name: "address", label: "Address", type: "readonly" },
    { name: "experienceLevel", label: "Experience level", type: "readonly" }, { name: "yearsOfExperience", label: "Years of experience", type: "readonly" },
    { name: "resume", label: "Resume", type: "file" },
    { name: "status", label: "Status", type: "select", options: appStatuses, required: true, section: "Review" },
    { name: "notes", label: "Internal notes", type: "textarea", wide: true, section: "Review" },
  ],
};

/* ---------- Enquiries (incoming) ---------- */
const enqStatuses = ["new", "contacted", "in-progress", "closed", "spam"];
const enqRes: ResourceConfig = {
  key: "enquiries", label: "Enquiries", singular: "Enquiry", group: "Leads", icon: Inbox, source: "api-only",
  description: "Contact-page and quote-modal submissions. Records arrive from the backend (Phase 4).",
  titleKey: "name", searchKeys: ["name", "phone", "email", "company"], canCreate: false, canDelete: true,
  columns: [{ key: "name", label: "Name" }, { key: "phone", label: "Phone", render: "mono" }, { key: "services", label: "Services" }, { key: "source", label: "Source", render: "badge" }, { key: "createdAt", label: "Received", render: "date" }, { key: "status", label: "Status", render: "status" }],
  filters: [{ key: "status", label: "Status", options: enqStatuses }, { key: "source", label: "Source", options: ["contact-page", "quote-modal"] }],
  statusOptions: enqStatuses,
  fields: [
    { name: "name", label: "Name", type: "readonly" }, { name: "phone", label: "Phone", type: "readonly" },
    { name: "email", label: "Email", type: "readonly" }, { name: "company", label: "Company", type: "readonly" },
    { name: "city", label: "City", type: "readonly" }, { name: "services", label: "Services", type: "readonly" },
    { name: "message", label: "Message", type: "readonly", wide: true }, { name: "source", label: "Source", type: "readonly" },
    { name: "status", label: "Status", type: "select", options: enqStatuses, required: true, section: "Follow-up" },
    { name: "assignee", label: "Assigned to", type: "text", section: "Follow-up" },
    { name: "notes", label: "Internal notes", type: "textarea", wide: true, section: "Follow-up" },
  ],
};

/* ---------- SEO metadata ---------- */
const seoRes: ResourceConfig = {
  key: "seo", label: "SEO Metadata", singular: "SEO Entry", group: "Website", icon: SearchCheck, source: "migrated",
  description: "Per-URL titles, descriptions, canonicals and Open Graph data for all original URLs.",
  titleKey: "path", searchKeys: ["path", "metaTitle"], canCreate: true, canDelete: false,
  columns: [{ key: "path", label: "URL", render: "mono" }, { key: "metaTitle", label: "Title" }, { key: "titleLength", label: "Title len." }, { key: "descLength", label: "Desc. len." }, { key: "indexing", label: "Indexing", render: "badge" }],
  filters: [{ key: "pageType", label: "Type", options: ["Core", "Service", "City"] }, { key: "indexing", label: "Indexing", options: ["index", "noindex"] }],
  fields: [
    { name: "path", label: "URL path", type: "slug", required: true, readOnlyOnEdit: true, section: "Target" },
    { name: "pageType", label: "Page type", type: "select", options: ["Core", "Service", "City", "Blog", "Legal"], section: "Target" },
    { name: "metaTitle", label: "Meta title", type: "text", required: true, maxLength: 70, section: "Search", wide: true },
    { name: "metaDescription", label: "Meta description", type: "textarea", maxLength: 170, section: "Search", wide: true },
    { name: "keywords", label: "Keywords", type: "textarea", section: "Search", wide: true },
    { name: "canonical", label: "Canonical URL", type: "url", section: "Search", wide: true },
    { name: "indexing", label: "Indexing", type: "select", options: ["index", "noindex"], section: "Search" },
    { name: "ogTitle", label: "OG title", type: "text", section: "Open Graph", wide: true },
    { name: "ogDescription", label: "OG description", type: "textarea", section: "Open Graph", wide: true },
    { name: "ogImage", label: "OG image URL", type: "url", section: "Open Graph", wide: true },
  ],
  seed: () => {
    const rows: Rec[] = [];
    const push = (path: string, type: string, m: Record<string, string> | undefined) => rows.push({
      id: `seo-${rows.length + 1}`, path, pageType: type, metaTitle: m?.title ?? "", metaDescription: m?.description ?? "", keywords: m?.keywords ?? "",
      canonical: m?.canonical || `https://auctechitsolutions.in${path}`, ogTitle: m?.["og:title"] ?? "", ogDescription: m?.["og:description"] ?? "", ogImage: m?.["og:image"] ?? "",
      indexing: "index", titleLength: (m?.title ?? "").length, descLength: (m?.description ?? "").length,
    });
    CORE.forEach(([, path, key]) => key && push(path, "Core", (coreMeta as Record<string, Record<string, string>>)[key]));
    const seen = new Set<string>();
    [...services.map((s) => [s.href, "Service"]), ...cities.map((c) => [c.href, "City"])].forEach(([href, type]) => {
      if (seen.has(href)) return; seen.add(href);
      push(href, type, servicePageRegistry[href.slice(1)].meta as unknown as Record<string, string>);
    });
    return rows;
  },
};

export const resources: ResourceConfig[] = [pages, servicesRes, cityRes, faqRes, blogRes, catRes, portfolioRes, testRes, teamRes, jobRes, appRes, enqRes, seoRes];
export const getResource = (key: string) => resources.find((r) => r.key === key);

/** Sidebar navigation (custom screens + config-driven resources). */
export const adminNav = [
  { group: "Overview", items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }] },
  { group: "Website", items: [pages, seoRes].map((r) => ({ href: `/admin/${r.key}`, label: r.label, icon: r.icon })) },
  { group: "Content", items: [servicesRes, cityRes, faqRes, blogRes, catRes, portfolioRes, testRes, teamRes].map((r) => ({ href: `/admin/${r.key}`, label: r.label, icon: r.icon })) },
  { group: "Recruitment", items: [{ href: "/admin/careers", label: "Careers Page", icon: FileText }, ...[jobRes, appRes].map((r) => ({ href: `/admin/${r.key}`, label: r.label, icon: r.icon }))] },
  { group: "Leads", items: [{ href: `/admin/${enqRes.key}`, label: enqRes.label, icon: enqRes.icon }] },
];
