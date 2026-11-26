# AucTech IT Solutions — Website Redesign · Phase 3 (Frontend only)

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Lucide icons.
The project contains the complete public website UI and the Admin Panel (CMS) UI.
**There is no backend.** No API, database, authentication, email or file storage is implemented. See `docs/API_SERVICE_INTERFACE.md`.

## Run
```bash
npm install
npm run build && npm start      # http://localhost:3000
npm run dev                     # development
```
Optional: copy `.env.example` to `.env.local`.
- `NEXT_PUBLIC_API_MODE=ui-preview` resolves form and admin calls locally, so success states can be reviewed. Nothing is sent.
- The default, `not-connected`, shows honest "not connected" errors.

## QA
```bash
npm run build && npm start -- -p 3100
BASE=http://localhost:3100 node qa/run-qa.mjs     # writes qa/qa-report.json
```

## Structure
```
src/
  app/(site)/            public routes — original .php URLs as literal segments; [slug] = 11 services + 33 cities
  app/admin/             admin panel (login + (panel) shell; [module] routes are config-driven)
  components/site|sections|forms|ui   public-site components (header, footer, sections, form fields, buttons)
  features/public/       page-level public features (home, service template, gallery, FAQ library, blog, jobs)
  features/admin/        admin-only UI kit, config (resources.ts), temporary session store
  content/               migrated ORIGINAL content (JSON/TS) — kept separate from presentation
  services/api/          API contract types + adapter (no real calls)
  lib/                   site config, SEO helpers, validation, content access layer
  hooks/ types/ styles/
tools/                   content migration scripts (original HTML snapshots → src/content)
docs/                    route inventory, API interface, pending decisions, test & responsive reports
qa/                      Playwright QA script + latest report
```

## Content rules applied
- All copy, FAQs, images, metadata, canonicals and JSON-LD come from the original pages, copied verbatim. Nothing was invented.
- No demo records, fake statistics, fake blog posts or fake testimonials.
- Original testimonials are held as *pending approval* and are not rendered.
- City pages keep the shared original H1 ("3D Architectural Walkthrough") and each page's own metadata and canonical.
- Logo: only the white logo slot is used (`public/brand/auctech-logo-white.png`). See `docs/PENDING_DECISIONS.md` #2.
