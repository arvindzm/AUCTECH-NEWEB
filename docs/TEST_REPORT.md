# Phase 3 build, test & responsive validation report

Run date: 2026-11-26 · Environment: Linux container, Node 22, Next.js 16.4.6 production build (`next build` + `next start`), headless Chromium (Playwright).
Raw results: `qa/qa-report.json` · Script: `qa/run-qa.mjs`.

## 1. Build
| Check | Result |
|---|---|
| `tsc --noEmit` (strict) | ✅ 0 errors |
| `next build` | ✅ Compiled; 65 static pages generated, plus the dynamic admin record routes |

## 2. Route checks (executed)
| Check | Scope | Result |
|---|---|---|
| HTTP 200 | 52 original URLs + `/index.php` + `/privacy-policy.php`, at 3 viewports (162 page loads) | ✅ 162/162 |
| Console errors / failed same-origin requests | Same 162 loads | ✅ 0 (first run found 1 issue, fixed — see §6) |
| Horizontal overflow (`scrollWidth > clientWidth`) | 390 px, 768 px, 1440 px | ✅ 0 pages |
| Broken images (`naturalWidth = 0` after scrolling through each page) | All pages, all viewports | ✅ 0 |
| `<img>` without an alt attribute | All pages | ✅ 0 (decorative team placeholders use `alt=""` on purpose) |
| Exactly one H1 | 54 pages (desktop) | ✅ |
| City H1 unchanged | 33 city pages | ✅ All "3D Architectural Walkthrough" (original shared H1) |
| Title = original title | All pages with original metadata | ✅ Exact match |
| Description = original description | Same | ✅ Exact match |
| Canonical | All pages | ✅ Self-referencing original URL; `/index.php` → `/` |
| `og:title` present | All pages | ✅ |
| Structured data | 43 service/city pages: LocalBusiness + Service + FAQPage (from the original). FAQ: FAQPage. About: AboutPage. Others: LocalBusiness | ✅ All JSON-LD parses |
| Privacy policy | `/privacy-policy.php` | ✅ `noindex, follow` (content pending) |
| Internal links | 57 unique internal hrefs found across all pages | ✅ All 200 |
| 404 handling | `/does-not-exist.php`, unpublished `/blog/{slug}` | ✅ 404 with branded page |
| `sitemap.xml`, `robots.txt` | — | ✅ 200 |
| Unapproved content absent | Testimonial names, "Verified Google Review", lorem ipsum | ✅ Not present on any public page |

## 3. Forms & interactions (13/13 passed)
- **Contact**
  - Required fields: errors shown.
  - Invalid phone and email: errors shown.
  - Service chips: toggle state and `aria-pressed` correct.
  - Valid submit: loading state, then the honest "not available yet" error, which offers phone and email.
- **Quote modal:** opens, validates required fields, and closes on Escape.
- **Careers**
  - Required fields, including the resume, are validated.
  - A `.exe` file is rejected (wrong type).
  - A 6 MB PDF is rejected (over the size limit).
  - A valid PDF is accepted; on submit the honest not-connected error appears.
- **FAQ:** search filters results, and a no-results empty state appears.
- **Portfolio:** category filter works, and the lightbox supports Arrow keys and Escape.
- **Blog:** the original "Coming Soon!" empty state is shown.
- **Mobile navigation:** the drawer opens, Services expands, and its links navigate.

## 4. Admin panel (45/45 passed)
- **Screen loads:** 40 admin screens load with no console errors and no page overflow. This covers every module's list, every Add screen, and sample detail/edit screens for Services, City Pages, FAQs, SEO, Testimonials, Team, Portfolio and Pages. Dashboard, Media, Settings, Profile, Careers and Login are included.
- **Login flow:** validation errors appear, then the honest "authentication service isn't connected" message.
- **Job flow:**
  - The list shows its empty state.
  - Submitting blank shows required-field errors.
  - Preview opens in a modal.
  - Create shows a success toast and goes to the detail page.
  - Delete asks for confirmation and returns to the empty state.
- **List tools:** search shows the empty state, filters clear, and select-all bulk selection works.
- **SEO edit:** the URL is locked, and an over-length title is rejected.
- **Media upload:** a non-image file is rejected.

## 5. Responsive validation
| Viewport | What was verified |
|---|---|
| Mobile 390×844 | All 54 public routes: no overflow, no broken images, no console errors. Hamburger drawer works. Floating WhatsApp and Quote buttons shown. Visual spot checks: home, contact, admin services list (the table scrolls inside its card). |
| Tablet 768×1024 | All 54 public routes: no overflow, no broken images, no console errors. |
| Desktop 1440×900 | All 54 public routes plus all admin screens. Visual spot checks: home, web-development service page, dashboard, City Pages list, City Page editor. |

Automated checks cover layout integrity (overflow, images, errors) at all three sizes. Visual review was spot-checked on the pages listed, not every page at every size.

## 6. Issues found and fixed during testing
1. `img/web_development.webp` was missing from the asset download. Re-fetched from the original site.
2. `img/software-development-power.jpg` returns 404 on the **original** server, so it is broken there too. The section now renders text-only (PENDING_DECISIONS #20).
3. The JS scroll-reveal could leave content invisible. Replaced with a CSS scroll-driven animation, which never hides content.
4. On mobile, the homepage hero badge touched the viewport edge. Repositioned.

## 7. Not tested / limitations (stated honestly)
- **Success states** for public forms in `ui-preview` mode were built but not exercised in the automated run, which used the default `not-connected` mode.
- **Browsers:** Firefox, Safari and real devices were not tested; only Chromium was.
- **Not formally audited:** Lighthouse/performance scores and a WCAG audit with assistive technology. Focus states, labels, `aria-*` and keyboard paths were implemented and partly exercised (modals, lightbox, menus).
- **Hosting:** production hosting, `.php` URL serving on the real host, redirects and CDN behaviour were **not** verified. Results above apply to `next start` locally only.
- Comparison against Phase 1/2 documents was not possible, because they were not supplied (PENDING_DECISIONS #1).
