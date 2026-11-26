/**
 * Phase 3 frontend QA (Playwright). Usage: BASE=http://localhost:3100 node qa/run-qa.mjs
 * Checks: status codes, metadata/canonical, H1 count, console errors, horizontal overflow (3 viewports),
 * broken images, internal links, forms/validation, admin CRUD flow, and absence of unapproved content.
 */
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright"); // uses the pre-installed Playwright
import fs from "node:fs";

const BASE = process.env.BASE || "http://localhost:3100";
const ORIGINAL = JSON.parse(fs.readFileSync(new URL("./original-urls.json", import.meta.url)));
const EXTRA = ["/index.php", "/privacy-policy.php"];
const VIEWPORTS = [{ name: "mobile", width: 390, height: 844 }, { name: "tablet", width: 768, height: 1024 }, { name: "desktop", width: 1440, height: 900 }];
const ADMIN = ["/admin/login", "/admin", "/admin/media", "/admin/settings", "/admin/profile", "/admin/careers",
  ...["pages", "services", "city-pages", "faqs", "blog", "categories", "portfolio", "testimonials", "team", "jobs", "applications", "enquiries", "seo"].flatMap((m) => [`/admin/${m}`, ...(["applications", "enquiries"].includes(m) ? [] : [`/admin/${m}/new`])]),
  "/admin/services/svc-1", "/admin/services/svc-1/edit", "/admin/city-pages/city-5", "/admin/city-pages/city-5/edit", "/admin/faqs/faq-1/edit", "/admin/seo/seo-1/edit", "/admin/testimonials/tst-1", "/admin/team/team-1/edit", "/admin/portfolio/pf-1/edit", "/admin/pages/page-2/edit"];

const report = { base: BASE, startedAt: new Date().toISOString(), pages: [], links: {}, images: {}, forms: [], admin: [], content: [], summary: {} };
const fail = (arr, msg) => arr.push(msg);

const browser = await chromium.launch();

async function auditPage(ctx, path, vp, deep) {
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push(e.message));
  const failedReq = [];
  page.on("response", (r) => { if (r.status() >= 400 && r.url().startsWith(BASE) && !r.url().includes("_rsc=")) failedReq.push(`${r.status()} ${r.url().replace(BASE, "")}`); });
  const res = await page.goto(BASE + path, { waitUntil: "load" });
  // scroll to trigger lazy images
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); } window.scrollTo(0, 0); });
  await page.waitForLoadState("networkidle", { timeout: 4000 }).catch(() => {});
  const info = await page.evaluate((deep) => {
    const q = (s) => document.querySelector(s);
    const imgs = [...document.images].map((i) => ({ src: i.currentSrc || i.src, ok: i.complete && i.naturalWidth > 0, alt: i.getAttribute("alt") }));
    const over = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    const offenders = over > 1 ? [...document.querySelectorAll("body *")].filter((el) => el.getBoundingClientRect().right > document.documentElement.clientWidth + 1 && getComputedStyle(el).position !== "fixed").slice(0, 3).map((el) => el.tagName + "." + String(el.className).slice(0, 60)) : [];
    return {
      title: document.title, description: q('meta[name="description"]')?.content ?? null, canonical: q('link[rel="canonical"]')?.href ?? null,
      ogTitle: q('meta[property="og:title"]')?.content ?? null, robots: q('meta[name="robots"]')?.content ?? null,
      h1: [...document.querySelectorAll("h1")].map((h) => h.textContent.trim()), overflow: over, offenders, imgs,
      links: [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")),
      jsonld: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => { try { return JSON.parse(s.textContent)["@type"]; } catch { return "INVALID"; } }),
      text: deep ? document.body.innerText : "",
    };
  }, deep);
  await page.close();
  return { status: res?.status(), errors, failedReq, ...info };
}

/* ---------- 1. Public routes × viewports ---------- */
const meta = JSON.parse(fs.readFileSync(new URL("../src/content/core-meta.json", import.meta.url)));
for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, reducedMotion: "reduce" });
  for (const path of [...ORIGINAL, ...EXTRA]) {
    const r = await auditPage(ctx, path, vp, vp.name === "desktop");
    const issues = [];
    if (r.status !== 200) issues.push(`status ${r.status}`);
    if (r.errors.length) issues.push(`console: ${r.errors.slice(0, 2).join(" | ")}`);
    if (r.failedReq.length) issues.push(`failed requests: ${r.failedReq.slice(0, 3).join(", ")}`);
    if (r.overflow > 1) issues.push(`horizontal overflow ${r.overflow}px (${r.offenders.join(", ")})`);
    const broken = r.imgs.filter((i) => !i.ok);
    if (broken.length) issues.push(`broken images: ${broken.slice(0, 3).map((b) => b.src).join(", ")}`);
    const noAlt = r.imgs.filter((i) => i.alt === null);
    if (noAlt.length) issues.push(`images without alt attribute: ${noAlt.length}`);
    if (vp.name === "desktop") {
      if (r.h1.length !== 1) issues.push(`H1 count ${r.h1.length}`);
      if (!r.title) issues.push("missing title");
      if (path !== "/privacy-policy.php" && !r.description) issues.push("missing description");
      const expectedCanon = path === "/index.php" ? "https://auctechitsolutions.in/" : `https://auctechitsolutions.in${path === "/" ? "/" : path}`;
      if (r.canonical !== expectedCanon) issues.push(`canonical ${r.canonical} ≠ ${expectedCanon}`);
      if (!r.ogTitle) issues.push("missing og:title");
      // original metadata preserved?
      const slug = path.slice(1);
      let src = null;
      if (path === "/" || path === "/index.php") src = meta.home; else if (meta[slug]) src = meta[slug];
      else if (fs.existsSync(new URL(`../src/content/pages/${slug.replace(/\.php$/, "")}.json`, import.meta.url))) src = JSON.parse(fs.readFileSync(new URL(`../src/content/pages/${slug.replace(/\.php$/, "")}.json`, import.meta.url))).meta;
      if (src && src.title !== r.title) issues.push(`title differs from original ("${r.title}" vs "${src.title}")`);
      if (src && src.description && src.description !== r.description) issues.push("description differs from original");
      r.links.forEach((l) => { if (l && l.startsWith("/") && !l.startsWith("//")) report.links[l.split("#")[0]] ??= path; });
      r.imgs.forEach((i) => { report.images[i.src] = true; });
      // unapproved / fake content checks
      for (const banned of ["Naveen", "Adil Zia Khan", "Sonu Pathak", "Verified Google Review", "Lorem", "lorem ipsum", "John Doe Inc"]) if (r.text.includes(banned)) issues.push(`unapproved content found: "${banned}"`);
    }
    report.pages.push({ path, viewport: vp.name, status: r.status, title: vp.name === "desktop" ? r.title : undefined, h1: vp.name === "desktop" ? r.h1[0] : undefined, jsonld: vp.name === "desktop" ? r.jsonld : undefined, robots: r.robots, issues });
  }
  await ctx.close();
}

/* ---------- 2. Internal links ---------- */
for (const href of Object.keys(report.links)) {
  if (href === "/sitemap.xml" || href.startsWith("/admin")) { /* checked separately */ }
  const r = await fetch(BASE + href, { redirect: "manual" });
  report.links[href] = { from: report.links[href], status: r.status };
}
for (const extra of ["/sitemap.xml", "/robots.txt", "/does-not-exist.php", "/blog/how-to-choose-right-software-development-partner"]) {
  const r = await fetch(BASE + extra); report.links[extra] = { from: "(direct)", status: r.status };
}

/* ---------- 3. Forms ---------- */
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
async function formTest(name, fn) { const page = await ctx.newPage(); try { await fn(page); report.forms.push({ name, result: "pass" }); } catch (e) { report.forms.push({ name, result: "FAIL", error: e.message.split("\n")[0] }); } await page.close(); }
const expectVisible = async (page, text) => { await page.getByText(text, { exact: false }).first().waitFor({ state: "visible", timeout: 5000 }); };

await formTest("Contact: required-field validation", async (p) => {
  await p.goto(BASE + "/contact.php"); await p.getByRole("button", { name: /Send Message/ }).click();
  await expectVisible(p, "Your name is required."); await expectVisible(p, "Phone is required.");
});
await formTest("Contact: invalid email + phone format", async (p) => {
  await p.goto(BASE + "/contact.php"); await p.fill("#c-name", "Test User"); await p.fill("#c-phone", "123"); await p.fill("#c-email", "bad@");
  await p.getByRole("button", { name: /Send Message/ }).click(); await expectVisible(p, "Enter a valid phone number"); await expectVisible(p, "Enter a valid email address.");
});
await formTest("Contact: service chips toggle (aria-pressed)", async (p) => {
  await p.goto(BASE + "/contact.php"); const chip = p.getByRole("button", { name: "SEO", exact: true }); await chip.click();
  if ((await chip.getAttribute("aria-pressed")) !== "true") throw new Error("chip not pressed");
});
await formTest("Contact: valid submit → loading → honest not-connected error", async (p) => {
  await p.goto(BASE + "/contact.php"); await p.fill("#c-name", "Test User"); await p.fill("#c-phone", "+91 98765 43210");
  await p.getByRole("button", { name: /Send Message/ }).click(); await expectVisible(p, "Sending…"); await expectVisible(p, "Online submissions aren't available yet");
});
await formTest("Quote modal: open, validate, Escape closes", async (p) => {
  await p.goto(BASE + "/"); await p.getByRole("button", { name: /Get Your Custom Quote/ }).first().click();
  await p.getByRole("dialog").waitFor(); await p.getByRole("dialog").getByRole("button", { name: /Get Your Custom Quote/ }).click();
  await expectVisible(p, "Your name is required."); await expectVisible(p, "Service is required.");
  await p.keyboard.press("Escape"); await p.getByRole("dialog").waitFor({ state: "detached" });
});
await formTest("Careers: required validation incl. resume", async (p) => {
  await p.goto(BASE + "/career.php"); await p.getByRole("button", { name: /Submit Application/ }).click();
  await expectVisible(p, "Full name is required."); await expectVisible(p, "Please attach your resume.");
});
await formTest("Careers: rejects wrong file type", async (p) => {
  await p.goto(BASE + "/career.php"); await p.setInputFiles("#a-resume", { name: "resume.exe", mimeType: "application/x-msdownload", buffer: Buffer.from("MZ") });
  await expectVisible(p, "Unsupported file type");
});
await formTest("Careers: rejects oversize file", async (p) => {
  await p.goto(BASE + "/career.php"); await p.setInputFiles("#a-resume", { name: "big.pdf", mimeType: "application/pdf", buffer: Buffer.alloc(6 * 1024 * 1024) });
  await expectVisible(p, "File is too large");
});
await formTest("Careers: accepts PDF, valid submit → honest error", async (p) => {
  await p.goto(BASE + "/career.php"); await p.setInputFiles("#a-resume", { name: "cv.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4") });
  await expectVisible(p, "ready to upload");
  await p.fill("#a-name", "Test Applicant"); await p.fill("#a-email", "applicant@example.com"); await p.fill("#a-phone", "9876543210"); await p.fill("#a-years", "2");
  await p.getByRole("button", { name: /Submit Application/ }).click(); await expectVisible(p, "Online submissions aren't available yet");
});
await formTest("FAQ: search filters list + empty state", async (p) => {
  await p.goto(BASE + "/faq.php"); await p.fill("#faq-search", "zzzzqqq"); await expectVisible(p, "No matching questions");
  await p.fill("#faq-search", "cost"); await expectVisible(p, "found");
});
await formTest("Portfolio: filter + lightbox keyboard", async (p) => {
  await p.goto(BASE + "/portfolio.php"); await p.getByRole("button", { name: /Floor Plan/ }).click(); await expectVisible(p, "of 36 projects");
  await p.getByRole("button", { name: /Open image/ }).first().click(); await p.getByRole("dialog").waitFor(); await p.keyboard.press("ArrowRight"); await p.keyboard.press("Escape");
  await p.getByRole("dialog").waitFor({ state: "detached" });
});
await formTest("Blog: empty state shown (no fake posts)", async (p) => { await p.goto(BASE + "/blog.php"); await expectVisible(p, "Coming Soon!"); });
await formTest("Header: mobile menu opens and services expand", async (p) => {
  await p.setViewportSize({ width: 390, height: 844 }); await p.goto(BASE + "/"); await p.getByRole("button", { name: "Open menu" }).click();
  await p.getByRole("button", { name: "Toggle services" }).click(); await p.locator("#mobile-nav").getByRole("link", { name: "Branding" }).click(); await p.waitForURL(/branding-services/);
});

/* ---------- 4. Admin ---------- */
for (const path of ADMIN) {
  const page = await ctx.newPage(); const errs = [];
  page.on("pageerror", (e) => errs.push(e.message)); page.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  const r = await page.goto(BASE + path, { waitUntil: "load" }); await page.waitForTimeout(400);
  const h1 = await page.locator("h1").first().textContent().catch(() => null);
  const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  report.admin.push({ path, status: r?.status(), h1, issues: [...(errs.length ? [`console: ${errs[0]}`] : []), ...(over > 1 ? [`overflow ${over}px`] : []), ...(r?.status() !== 200 ? ["non-200"] : []), ...(/not found/i.test(h1 ?? "") ? ["shows not-found"] : [])] });
  await page.close();
}
async function adminFlow(name, fn) { const page = await ctx.newPage(); try { await fn(page); report.admin.push({ path: name, flow: true, issues: [] }); } catch (e) { report.admin.push({ path: name, flow: true, issues: [e.message.split("\n")[0]] }); } await page.close(); }
await adminFlow("FLOW login validation + not-connected error", async (p) => {
  await p.goto(BASE + "/admin/login"); await p.getByRole("button", { name: "Sign in" }).click(); await expectVisible(p, "Email is required.");
  await p.fill("#l-email", "admin@example.com"); await p.fill("#l-pass", "password123"); await p.getByRole("button", { name: "Sign in" }).click();
  await expectVisible(p, "authentication service isn't connected");
});
await adminFlow("FLOW create job → detail → delete (session)", async (p) => {
  await p.goto(BASE + "/admin/jobs"); await expectVisible(p, "No jobs yet");
  await p.getByRole("link", { name: /Add Job/ }).first().click(); await p.getByRole("button", { name: /Create job/ }).click(); await expectVisible(p, "Job title is required.");
  await p.fill("#f-title", "QA Role"); await p.fill("#f-slug", "qa-role"); await p.fill("#f-location", "Lucknow"); await p.selectOption("#f-employmentType", "Full-time"); await p.fill("#f-summary", "Temporary QA record");
  await p.selectOption("#f-status", "draft"); await p.getByRole("button", { name: "Preview" }).click(); await p.getByRole("dialog").getByText("QA Role").first().waitFor(); await p.keyboard.press("Escape");
  await p.getByRole("button", { name: /Create job/ }).click(); await expectVisible(p, "Job created"); await p.waitForURL(/\/admin\/jobs\/jobs-/);
  await p.getByRole("button", { name: "Delete" }).click(); await p.getByRole("dialog").getByRole("button", { name: "Delete" }).click(); await p.waitForURL(/\/admin\/jobs$/); await expectVisible(p, "No jobs yet");
});
await adminFlow("FLOW list search/filter/empty + bulk select", async (p) => {
  await p.goto(BASE + "/admin/faqs"); await p.fill("#res-search", "zzzxxq"); await expectVisible(p, "No matching records");
  await p.getByRole("button", { name: /Clear filters/ }).click(); await p.getByLabel("Select all on this page").check(); await expectVisible(p, "10 selected");
});
await adminFlow("FLOW edit SEO → slug locked, maxLength validation", async (p) => {
  await p.goto(BASE + "/admin/seo/seo-1/edit"); if (!(await p.locator("#f-path").isDisabled())) throw new Error("path should be locked");
  await p.fill("#f-metaTitle", "x".repeat(80)); await p.getByRole("button", { name: /Save changes/ }).click(); await expectVisible(p, "70 characters or fewer");
});
await adminFlow("FLOW media upload rejects non-image", async (p) => {
  await p.goto(BASE + "/admin/media"); await p.locator('input[type=file]').first().setInputFiles({ name: "x.txt", mimeType: "text/plain", buffer: Buffer.from("x") }); await expectVisible(p, "unsupported type");
});

await browser.close();

/* ---------- Summary ---------- */
const pageIssues = report.pages.filter((p) => p.issues.length);
const badLinks = Object.entries(report.links).filter(([h, v]) => !(v.status === 200 || (h === "/does-not-exist.php" && v.status === 404) || (h.startsWith("/blog/") && v.status === 404)));
report.summary = {
  originalUrls: ORIGINAL.length, publicRoutesChecked: ORIGINAL.length + EXTRA.length, viewportChecks: report.pages.length, pagesWithIssues: pageIssues.length,
  internalLinksChecked: Object.keys(report.links).length, badLinks: badLinks.length, uniqueImages: Object.keys(report.images).length,
  formsPassed: report.forms.filter((f) => f.result === "pass").length, formsTotal: report.forms.length,
  adminChecked: report.admin.length, adminWithIssues: report.admin.filter((a) => a.issues.length).length,
};
report.finishedAt = new Date().toISOString();
fs.writeFileSync(new URL("./qa-report.json", import.meta.url), JSON.stringify(report, null, 1));
console.log(JSON.stringify(report.summary, null, 1));
pageIssues.slice(0, 40).forEach((p) => console.log("PAGE", p.viewport, p.path, p.issues.join(" ; ")));
badLinks.forEach(([h, v]) => console.log("LINK", h, v.status, "from", v.from));
report.forms.filter((f) => f.result !== "pass").forEach((f) => console.log("FORM", f.name, f.error));
report.admin.filter((a) => a.issues.length).forEach((a) => console.log("ADMIN", a.path, a.issues.join(" ; ")));
