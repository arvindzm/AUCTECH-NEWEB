# Route inventory & implementation status

"Original" = present in the original sitemap.xml or the original header/footer navigation. In total: **52 original URLs** (51 sitemap entries + `career.php`).

| # | URL | Type | Template / route file | Source content | Status |
|---|---|---|---|---|---|
| 1 | `/` | Core | `src/app/(site)/page.tsx` | src/content (core-pages.ts / home.ts / faq-library.json …) | ✅ Built |
| 2 | `/about.php` | Core | `src/app/(site)/about.php/page.tsx` | src/content (core-pages.ts / home.ts / faq-library.json …) | ✅ Built |
| 3 | `/service.php` | Core | `src/app/(site)/service.php/page.tsx` | src/content (core-pages.ts / home.ts / faq-library.json …) | ✅ Built |
| 4 | `/portfolio.php` | Core | `src/app/(site)/portfolio.php/page.tsx` | src/content (core-pages.ts / home.ts / faq-library.json …) | ✅ Built |
| 5 | `/blog.php` | Core | `src/app/(site)/blog.php/page.tsx` | src/content (core-pages.ts / home.ts / faq-library.json …) | ✅ Built |
| 6 | `/faq.php` | Core | `src/app/(site)/faq.php/page.tsx` | src/content (core-pages.ts / home.ts / faq-library.json …) | ✅ Built |
| 7 | `/our-team.php` | Core | `src/app/(site)/our-team.php/page.tsx` | src/content (core-pages.ts / home.ts / faq-library.json …) | ✅ Built |
| 8 | `/contact.php` | Core | `src/app/(site)/contact.php/page.tsx` | src/content (core-pages.ts / home.ts / faq-library.json …) | ✅ Built |
| 9 | `/best-digital-marketing-agency-in-lucknow.php` | Service | `src/app/(site)/[slug]` → ServicePageTemplate | src/content/pages/best-digital-marketing-agency-in-lucknow.json | ✅ Built |
| 10 | `/best-web-development-company-in-lucknow.php` | Service | `src/app/(site)/[slug]` → ServicePageTemplate | src/content/pages/best-web-development-company-in-lucknow.json | ✅ Built |
| 11 | `/3d-walkthrough-in-lucknow.php` | Service + City | `src/app/(site)/[slug]` → ServicePageTemplate | src/content/pages/3d-walkthrough-in-lucknow.json | ✅ Built |
| 12 | `/3d-walkthrough-in-kanpur.php` | City (3D walkthrough) | `src/app/(site)/[slug]` → ServicePageTemplate | src/content/pages/3d-walkthrough-in-kanpur.json | ✅ Built |
| 13 | `/3d-walkthrough-in-meerut.php` | City (3D walkthrough) | `src/app/(site)/[slug]` → ServicePageTemplate | src/content/pages/3d-walkthrough-in-meerut.json | ✅ Built |
| 14 | `/3d-walkthrough-in-varanasi.php` | City (3D walkthrough) | `src/app/(site)/[slug]` → ServicePageTemplate | src/content/pages/3d-walkthrough-in-varanasi.json | ✅ Built |
| 15 | `/3d-walkthrough-in-prayagraj.php` | City (3D walkthrough) | `src/app/(site)/[slug]` → ServicePageTemplate | src/content/pages/3d-walkthrough-in-prayagraj.json | ✅ Built |
| 16 | `/3d-walkthrough-in-agra.php` | City (3D walkthrough) | `src/app/(site)/[slug]` → ServicePageTemplate | src/content/pages/3d-walkthrough-in-agra.json | ✅ Built |
| 17 | `/3d-walkthrough-in-bareilly.php` | City (3D walkthrough) | `src/app/(site)/[slug]` → ServicePageTemplate | src/content/pages/3d-walkthrough-in-bareilly.json | ✅ Built |
| 18 | `/3d-walkthrough-in-ghaziabad.php` | City (3D walkthrough) | `src/app/(site)/[slug]` → ServicePageTemplate | src/content/pages/3d-walkthrough-in-ghaziabad.json | ✅ Built |
| 19 | `/3d-walkthrough-in-gorakhpur.php` | City (3D walkthrough) | `src/app/(site)/[slug]` → ServicePageTemplate | src/content/pages/3d-walkthrough-in-gorakhpur.json | ✅ Built |
| 20 | `/3d-walkthrough-in-jhansi.php` | City (3D walkthrough) | `src/app/(site)/[slug]` → ServicePageTemplate | src/content/pages/3d-walkthrough-in-jhansi.json | ✅ Built |
| 21 | `/3d-walkthrough-in-aligarh.php` | City (3D walkthrough) | `src/app/(site)/[slug]` → ServicePageTemplate | src/content/pages/3d-walkthrough-in-aligarh.json | ✅ Built |
| 22 | `/3d-walkthrough-in-ayodhya.php` | City (3D walkthrough) | `src/app/(site)/[slug]` → ServicePageTemplate | src/content/pages/3d-walkthrough-in-ayodhya.json | ✅ Built |
| 23 | `/3d-walkthrough-in-saharanpur.php` | City (3D walkthrough) | `src/app/(site)/[slug]` → ServicePageTemplate | src/content/pages/3d-walkthrough-in-saharanpur.json | ✅ Built |
| 24 | `/3d-walkthrough-in-azamgarh.php` | City (3D walkthrough) | `src/app/(site)/[slug]` → ServicePageTemplate | src/content/pages/3d-walkthrough-in-azamgarh.json | ✅ Built |
| 25 | `/3d-walkthrough-in-basti.php` | City (3D walkthrough) | `src/app/(site)/[slug]` → ServicePageTemplate | src/content/pages/3d-walkthrough-in-basti.json | ✅ Built |
| 26 | `/3d-walkthrough-in-chitrakoot.php` | City (3D walkthrough) | `src/app/(site)/[slug]` → ServicePageTemplate | src/content/pages/3d-walkthrough-in-chitrakoot.json | ✅ Built |
| 27 | `/3d-walkthrough-in-devi-patan.php` | City (3D walkthrough) | `src/app/(site)/[slug]` → ServicePageTemplate | src/content/pages/3d-walkthrough-in-devi-patan.json | ✅ Built |
| 28 | `/3d-walkthrough-in-mirzapur.php` | City (3D walkthrough) | `src/app/(site)/[slug]` → ServicePageTemplate | src/content/pages/3d-walkthrough-in-mirzapur.json | ✅ Built |
| 29 | `/3d-walkthrough-in-patna.php` | City (3D walkthrough) | `src/app/(site)/[slug]` → ServicePageTemplate | src/content/pages/3d-walkthrough-in-patna.json | ✅ Built |
| 30 | `/3d-walkthrough-in-muzaffarpur.php` | City (3D walkthrough) | `src/app/(site)/[slug]` → ServicePageTemplate | src/content/pages/3d-walkthrough-in-muzaffarpur.json | ✅ Built |
| 31 | `/3d-walkthrough-in-gaya.php` | City (3D walkthrough) | `src/app/(site)/[slug]` → ServicePageTemplate | src/content/pages/3d-walkthrough-in-gaya.json | ✅ Built |
| 32 | `/3d-walkthrough-in-bhagalpur.php` | City (3D walkthrough) | `src/app/(site)/[slug]` → ServicePageTemplate | src/content/pages/3d-walkthrough-in-bhagalpur.json | ✅ Built |
| 33 | `/3d-walkthrough-in-darbhanga.php` | City (3D walkthrough) | `src/app/(site)/[slug]` → ServicePageTemplate | src/content/pages/3d-walkthrough-in-darbhanga.json | ✅ Built |
| 34 | `/3d-walkthrough-in-rajgir.php` | City (3D walkthrough) | `src/app/(site)/[slug]` → ServicePageTemplate | src/content/pages/3d-walkthrough-in-rajgir.json | ✅ Built |
| 35 | `/3d-walkthrough-in-bihar-sharif.php` | City (3D walkthrough) | `src/app/(site)/[slug]` → ServicePageTemplate | src/content/pages/3d-walkthrough-in-bihar-sharif.json | ✅ Built |
| 36 | `/3d-walkthrough-in-arrah.php` | City (3D walkthrough) | `src/app/(site)/[slug]` → ServicePageTemplate | src/content/pages/3d-walkthrough-in-arrah.json | ✅ Built |
| 37 | `/3d-walkthrough-in-purnia.php` | City (3D walkthrough) | `src/app/(site)/[slug]` → ServicePageTemplate | src/content/pages/3d-walkthrough-in-purnia.json | ✅ Built |
| 38 | `/3d-walkthrough-in-begusarai.php` | City (3D walkthrough) | `src/app/(site)/[slug]` → ServicePageTemplate | src/content/pages/3d-walkthrough-in-begusarai.json | ✅ Built |
| 39 | `/3d-walkthrough-in-motihari.php` | City (3D walkthrough) | `src/app/(site)/[slug]` → ServicePageTemplate | src/content/pages/3d-walkthrough-in-motihari.json | ✅ Built |
| 40 | `/3d-walkthrough-in-mumbai.php` | City (3D walkthrough) | `src/app/(site)/[slug]` → ServicePageTemplate | src/content/pages/3d-walkthrough-in-mumbai.json | ✅ Built |
| 41 | `/3d-walkthrough-in-pune.php` | City (3D walkthrough) | `src/app/(site)/[slug]` → ServicePageTemplate | src/content/pages/3d-walkthrough-in-pune.json | ✅ Built |
| 42 | `/3d-walkthrough-in-noida.php` | City (3D walkthrough) | `src/app/(site)/[slug]` → ServicePageTemplate | src/content/pages/3d-walkthrough-in-noida.json | ✅ Built |
| 43 | `/3d-walkthrough-in-ranchi.php` | City (3D walkthrough) | `src/app/(site)/[slug]` → ServicePageTemplate | src/content/pages/3d-walkthrough-in-ranchi.json | ✅ Built |
| 44 | `/3d-architectural-walkthrough-in-lucknow.php` | Service | `src/app/(site)/[slug]` → ServicePageTemplate | src/content/pages/3d-architectural-walkthrough-in-lucknow.json | ✅ Built |
| 45 | `/best-3d-interior-exterior-designer-in-lucknow.php` | Service | `src/app/(site)/[slug]` → ServicePageTemplate | src/content/pages/best-3d-interior-exterior-designer-in-lucknow.json | ✅ Built |
| 46 | `/best-graphic-designing-company-in-lucknow.php` | Service | `src/app/(site)/[slug]` → ServicePageTemplate | src/content/pages/best-graphic-designing-company-in-lucknow.json | ✅ Built |
| 47 | `/best-motion-graphics-service-in-lucknow.php` | Service | `src/app/(site)/[slug]` → ServicePageTemplate | src/content/pages/best-motion-graphics-service-in-lucknow.json | ✅ Built |
| 48 | `/best-event-management-company-in-lucknow.php` | Service | `src/app/(site)/[slug]` → ServicePageTemplate | src/content/pages/best-event-management-company-in-lucknow.json | ✅ Built |
| 49 | `/branding-services-in-lucknow.php` | Service | `src/app/(site)/[slug]` → ServicePageTemplate | src/content/pages/branding-services-in-lucknow.json | ✅ Built |
| 50 | `/best-software-development-company-in-lucknow.php` | Service | `src/app/(site)/[slug]` → ServicePageTemplate | src/content/pages/best-software-development-company-in-lucknow.json | ✅ Built |
| 51 | `/best-video-editing-in-lucknow.php` | Service | `src/app/(site)/[slug]` → ServicePageTemplate | src/content/pages/best-video-editing-in-lucknow.json | ✅ Built |
| 52 | `/career.php` | Core | `src/app/(site)/career.php/page.tsx` | src/content (core-pages.ts / home.ts / faq-library.json …) | ✅ Built |

## Additional routes

| URL | Purpose | Status |
|---|---|---|
| `/index.php` | Original homepage alias; same content, canonical → `/` | ✅ Built (no redirect configured) |
| `/privacy-policy.php` | Linked from the original footer; returns 404 on the original site | ✅ UI built — content **pending approval**, `noindex` |
| `/blog/{slug}` | Blog article template (original URL pattern) | ✅ UI built — no published posts, so it returns 404 |
| `/career/{slug}` | Job detail + application | ✅ UI built — no open jobs, so it returns 404; URL pattern pending approval |
| `/sitemap.xml`, `/robots.txt` | Generated: 52 original URLs; `/admin` disallowed | ✅ |
| any unknown URL | Branded 404 page | ✅ |

## Admin panel routes (`/admin/*`, `noindex`)

| Module | Routes | Data in Phase 3 |
|---|---|---|
| Login | `/admin/login` (incl. forgot-password view) | Auth not connected → honest error |
| Dashboard | `/admin` | Counts derived from migrated content; no lead/traffic metrics |
| Pages | `/admin/pages`, `/admin/pages/[id]`, `/admin/pages/new`, `/admin/pages/[id]/edit` | 10 core pages (migrated) |
| Services | `/admin/services`, `/admin/services/[id]`, `/admin/services/new`, `/admin/services/[id]/edit` | 11 services (migrated) |
| City Pages | `/admin/city-pages`, `/admin/city-pages/[id]`, `/admin/city-pages/new`, `/admin/city-pages/[id]/edit` | 33 cities (migrated) |
| FAQ Management | `/admin/faqs`, `/admin/faqs/[id]`, `/admin/faqs/new`, `/admin/faqs/[id]/edit` | 175 library FAQs (migrated); page FAQs are edited inside Services/City pages |
| Blog Management | `/admin/blog`, `/admin/blog/[id]`, `/admin/blog/new`, `/admin/blog/[id]/edit` | Empty (no published posts) |
| Categories | `/admin/categories`, `/admin/categories/[id]`, `/admin/categories/new`, `/admin/categories/[id]/edit` | FAQ + portfolio taxonomies (migrated) |
| Portfolio / Gallery | `/admin/portfolio`, `/admin/portfolio/[id]`, `/admin/portfolio/new`, `/admin/portfolio/[id]/edit` | 135 images (migrated) |
| Testimonials | `/admin/testimonials`, `/admin/testimonials/[id]`, `/admin/testimonials/new`, `/admin/testimonials/[id]/edit` | 8 original, all *pending approval* |
| Team | `/admin/team`, `/admin/team/[id]`, `/admin/team/new`, `/admin/team/[id]/edit` | 11 members (migrated) |
| Job Management | `/admin/jobs`, `/admin/jobs/[id]`, `/admin/jobs/new`, `/admin/jobs/[id]/edit` | Empty (no openings) |
| Job Applications | `/admin/applications`, `/admin/applications/[id]` | Empty — arrives from API (no Add screen) |
| Enquiry Management | `/admin/enquiries`, `/admin/enquiries/[id]` | Empty — arrives from API (no Add screen) |
| SEO Metadata | `/admin/seo`, `/admin/seo/[id]`, `/admin/seo/new`, `/admin/seo/[id]/edit` | 52 URL entries (migrated original meta) |
| Careers Management | `/admin/careers` | Careers page copy (migrated) |
| Media Library | `/admin/media` | all original image files in `public/img` |
| Website Settings | `/admin/settings` | Company config (migrated) |
| Profile & Account | `/admin/profile` | Blank until auth is connected |
