"use client";
import Link from "next/link";
import { ArrowUpRight, Inbox, PlugZap, UserRoundCheck } from "lucide-react";
import { adminNav, resources } from "@/features/admin/config/resources";
import { useAdminStore } from "@/features/admin/store/AdminStore";
import { ApiNotice, Card, EmptyState, PageHeader } from "@/features/admin/components/ui";

/** Dashboard. Counts are computed from migrated content; lead metrics require the API and are not faked. */
export default function Dashboard() {
  const store = useAdminStore();
  const count = (k: string) => store.list(k).length;
  const contentTiles = ["pages", "services", "city-pages", "faqs", "portfolio", "team", "seo", "blog"].map((k) => resources.find((r) => r.key === k)!);
  const pending = store.list("testimonials").filter((t) => t.status === "pending-approval").length + store.list("pages").filter((p) => p.status === "pending-approval").length;
  return (
    <div>
      <PageHeader title="Dashboard" description="Overview of website content managed by this CMS." />
      <div className="mb-6"><ApiNotice>Content counts below reflect the migrated original-site content. Lead and traffic metrics require the backend and analytics (Phase 4) and are intentionally not shown.</ApiNotice></div>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {contentTiles.map((r) => { const I = r.icon; return (
          <li key={r.key}>
            <Link href={`/admin/${r.key}`} className="group flex items-center gap-4 rounded-2xl border border-line bg-white p-5 transition hover:border-brand-200 hover:shadow-card">
              <span className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700 group-hover:bg-brand-gradient group-hover:text-white"><I className="size-5" /></span>
              <div className="min-w-0 flex-1"><p className="text-2xl font-extrabold tabular-nums text-ink">{count(r.key)}</p><p className="text-sm text-muted">{r.label}</p></div>
              <ArrowUpRight aria-hidden className="size-4 text-muted group-hover:text-brand-700" />
            </Link>
          </li>); })}
      </ul>
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <Card title="Recent enquiries" className="lg:col-span-2" actions={<Link href="/admin/enquiries" className="text-sm font-semibold text-brand-700">View all</Link>}>
          {count("enquiries") === 0 ? <EmptyState icon={Inbox} title="No enquiries to show" text="Contact and quote-form submissions will appear here once the backend is connected." /> :
            <ul className="divide-y divide-line">{store.list("enquiries").slice(0, 5).map((e) => <li key={e.id} className="py-3 text-sm"><Link href={`/admin/enquiries/${e.id}`} className="font-semibold hover:text-brand-700">{String(e.name)}</Link></li>)}</ul>}
        </Card>
        <Card title="Needs attention">
          <ul className="space-y-3 text-sm">
            <li className="flex items-center justify-between gap-3"><span>Items pending approval</span><Link href="/admin/testimonials" className="font-bold text-brand-700">{pending}</Link></li>
            <li className="flex items-center justify-between gap-3"><span>Open job applications</span><Link href="/admin/applications" className="font-bold text-brand-700">{count("applications")}</Link></li>
            <li className="flex items-center justify-between gap-3"><span>Published blog posts</span><Link href="/admin/blog" className="font-bold text-brand-700">{store.list("blog").filter((b) => b.status === "published").length}</Link></li>
          </ul>
          <div className="mt-5 flex items-start gap-2 rounded-lg bg-surface p-3 text-xs text-muted"><PlugZap aria-hidden className="mt-0.5 size-4 shrink-0" />Applications and enquiries are stored by the backend in Phase 4.</div>
        </Card>
      </div>
      <Card title="All modules" className="mt-6">
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {[...adminNav.slice(1).flatMap((g) => g.items), { href: "/admin/media", label: "Media Library", icon: UserRoundCheck }].map((i) => (
            <li key={i.href}><Link href={i.href} className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-surface">{i.label}<ArrowUpRight aria-hidden className="size-4 text-muted" /></Link></li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
