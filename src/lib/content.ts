/**
 * Content access layer. Phase 3 reads migrated static content from src/content.
 * In Phase 4 these functions are the seam where API-backed content will be plugged in.
 */
import { servicePageRegistry } from "@/content/pages";
import coreMeta from "@/content/core-meta.json";
import faqLibrary from "@/content/faq-library.json";
import portfolio from "@/content/portfolio.json";
import team from "@/content/team.json";
import testimonials from "@/content/testimonials.json";
import type {
  City, FaqCategory, FaqLibraryItem, PageMetaSource, PortfolioFilter, PortfolioItem,
  ServiceLikePage, ServiceSummary, TeamMember, Testimonial, BlogPost, JobPosting,
} from "@/types/content";

/** City order follows the original sitemap / footer. */
const CITY_SLUGS = [
  "lucknow", "kanpur", "meerut", "varanasi", "prayagraj", "agra", "bareilly", "ghaziabad", "gorakhpur", "jhansi",
  "aligarh", "ayodhya", "saharanpur", "azamgarh", "basti", "chitrakoot", "devi-patan", "mirzapur", "patna",
  "muzaffarpur", "gaya", "bhagalpur", "darbhanga", "rajgir", "bihar-sharif", "arrah", "purnia", "begusarai",
  "motihari", "mumbai", "pune", "noida", "ranchi",
] as const;

const titleCase = (s: string) => s.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");

export const cities: City[] = CITY_SLUGS.map((slug) => ({
  slug,
  name: titleCase(slug),
  href: `/3d-walkthrough-in-${slug}`,
}));

/**
 * The 11 original services. Names/summaries/images are verbatim from service.php.
 * Mapping of the "Architectural Planning" card to 3d-architectural-walkthrough-in-lucknow.php is a
 * migration decision (the original card links were not distinct) — see PENDING_DECISIONS.md.
 */
export const services: ServiceSummary[] = [
  { key: "digital-marketing", name: "Digital Marketing", navLabel: "Digital Marketing", href: "/best-digital-marketing-agency-in-lucknow",
    summary: "Unleash the power of the digital world with our targeted campaigns, SEO optimization, and data-driven lead generation strategies.",
    image: { src: "img/services-img/digital-marketing.webp", alt: "Digital Marketing Company in Lucknow" } },
  { key: "web-development", name: "Website Designing", navLabel: "Web Development", href: "/best-web-development-company-in-lucknow",
    summary: "We specialize in crafting exceptional, blazing-fast websites that not only wow your audience but drive tangible business results.",
    image: { src: "img/services-img/website-software.webp", alt: "Website Designing Company in Lucknow" } },
  { key: "3d-walkthrough", name: "3D Walkthroughs", navLabel: "3D Walkthrough", href: "/3d-walkthrough-in-lucknow",
    summary: "Showcase your architectural marvels with breathtaking 8K visuals that allow potential clients to virtually explore spaces.",
    image: { src: "img/services-img/3D-Architectural-Walkthroughs.webp", alt: "3D Walkthroughs Company in Lucknow" } },
  { key: "architectural-walkthrough", name: "Architectural Planning", navLabel: "Architectural Walkthrough", href: "/3d-architectural-walkthrough-in-lucknow",
    summary: "Our expert team collaborates with you to translate your architectural vision into functional and aesthetically pleasing reality.",
    image: { src: "img/services-img/Architectural-Planning.webp", alt: "Architectural Planning Company in Lucknow" } },
  { key: "interior-exterior", name: "3D Interior & Exterior", navLabel: "Interior & Exterior", href: "/best-3d-interior-exterior-designer-in-lucknow",
    summary: "Seamlessly translate your design vision from concept to reality. We bring your 3D interior and exterior dreams to life.",
    image: { src: "img/services-img/3D-Interior-&-Exterior-Design.webp", alt: "3D Interior & Exterior Company in Lucknow" } },
  { key: "graphic-design", name: "Graphic Design", navLabel: "Graphic Design", href: "/best-graphic-designing-company-in-lucknow",
    summary: "Craft a captivating brand identity. From logos to complete branding, we create visuals that resonate with your target audience.",
    image: { src: "img/services-img/graphics-designer.webp", alt: "Graphic Design Company in Lucknow" } },
  { key: "motion-graphics", name: "Motion Graphics", navLabel: "Motion Graphics", href: "/best-motion-graphics-service-in-lucknow",
    summary: "Breathe life into your brand story. We create engaging animated content for explainer videos, social media marketing, and more.",
    image: { src: "img/services-img/motion_graphics.webp", alt: "Motion Graphics Company in Lucknow" } },
  { key: "branding", name: "Branding Strategies", navLabel: "Branding", href: "/branding-services-in-lucknow",
    summary: "Build a strong, memorable identity. We help develop brand strategies, guidelines, and corporate identity materials.",
    image: { src: "img/services-img/branding.webp", alt: "Branding Strategies Company in Lucknow" } },
  { key: "video-editing", name: "Video Editing", navLabel: "Video Editing", href: "/best-video-editing-in-lucknow",
    summary: "Elevate your brand message. We transform your raw footage into polished, cinematic, and highly engaging videos.",
    image: { src: "img/services-img/video-editing.webp", alt: "Video Editing Company in Lucknow" } },
  { key: "software-development", name: "Software Development", navLabel: "Software Dev", href: "/best-software-development-company-in-lucknow",
    summary: "Build a robust digital foundation. We craft custom, secure, and scalable business applications tailored to your exact needs.",
    image: { src: "img/services-img/software_development.webp", alt: "Software Development Company in Lucknow" } },
  { key: "event-management", name: "Event Organising", navLabel: "Event Management", href: "/best-event-management-company-in-lucknow",
    summary: "Leave a lasting impression with our meticulous event organization services. We handle planning, logistics, and flawless execution.",
    image: { src: "img/services-img/Event-Organising.webp", alt: "Event Organising Company in Lucknow" } },
];

export const servicePageSlugs = services.map((s) => s.href.slice(1));
export const cityPageSlugs = cities.map((c) => c.href.slice(1));

export function getServiceLikePage(slug: string): ServiceLikePage | undefined {
  return servicePageRegistry[slug];
}
export function isCitySlug(slug: string) { return cityPageSlugs.includes(slug); }
export function cityForSlug(slug: string) { return cities.find((c) => c.href.slice(1) === slug); }
export function serviceForSlug(slug: string) { return services.find((s) => s.href.slice(1) === slug); }

export function getCoreMeta(key: keyof typeof coreMeta): PageMetaSource { return coreMeta[key] as PageMetaSource; }

export const faqCategories: FaqCategory[] = faqLibrary.categories;
export const faqItems: FaqLibraryItem[] = faqLibrary.items;

export const portfolioFilters: PortfolioFilter[] = portfolio.filters;
export const portfolioItems: PortfolioItem[] = portfolio.items.map((p, i) => ({ ...p, id: `pf-${i + 1}` }));

export const teamMembers: TeamMember[] = team;
export const allTestimonials: Testimonial[] = testimonials as Testimonial[];

/** No articles are published on the original site (blog.php renders "Coming Soon"). */
export const blogPosts: BlogPost[] = [];
export const blogCategories: string[] = [];
/** career.php shows "No Open Positions Currently". */
export const jobPostings: JobPosting[] = [];
