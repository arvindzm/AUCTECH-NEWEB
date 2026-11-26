"use client";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Newspaper, Search } from "lucide-react";
import type { BlogPost } from "@/types/content";
import { assetPath } from "@/lib/site";
import { formatDate } from "@/features/public/BlogArticle";
import { cn } from "@/lib/cn";

const PER_PAGE = 9;

export function BlogIndex({ posts, categories, empty }: { posts: BlogPost[]; categories: string[]; empty: { title: string; text: string } }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All Posts");
  const [page, setPage] = useState(1);
  const filtered = useMemo(() => posts.filter((p) => (cat === "All Posts" || p.category === cat) && (!q.trim() || `${p.title} ${p.excerpt}`.toLowerCase().includes(q.trim().toLowerCase()))), [posts, cat, q]);
  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const view = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div>
      <div className="flex flex-col gap-4 rounded-3xl border border-line bg-white p-4 shadow-card md:flex-row md:items-center md:justify-between">
        <div role="group" aria-label="Filter by category" className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-muted">Filter:</span>
          {["All Posts", ...categories].map((c) => (
            <button key={c} type="button" aria-pressed={cat === c} onClick={() => { setCat(c); setPage(1); }}
              className={cn("rounded-full px-4 py-2 text-sm font-semibold transition", cat === c ? "bg-brand-700 text-white" : "bg-surface text-ink-soft hover:text-brand-700")}>{c}</button>
          ))}
        </div>
        <form role="search" className="relative md:w-80" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="blog-q" className="sr-only">Search articles</label>
          <Search aria-hidden className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input id="blog-q" type="search" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search articles"
            className="h-11 w-full rounded-full border border-line pl-11 pr-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100" />
        </form>
      </div>

      {view.length === 0 ? (
        <div className="mt-10 rounded-[2rem] border border-dashed border-line bg-surface px-6 py-16 text-center">
          <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-card"><Newspaper aria-hidden className="size-8" /></span>
          <h2 className="mt-6 text-2xl font-extrabold">{posts.length ? "No articles match your search" : empty.title}</h2>
          <p className="mx-auto mt-2 max-w-md text-muted">{posts.length ? "Try another keyword or category." : empty.text}</p>
          <Link href="/contact" className="mt-6 inline-flex font-semibold text-brand-700 underline">Contact us</Link>
        </div>
      ) : (
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {view.map((p) => (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}`} className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white transition hover:-translate-y-1 hover:shadow-lift">
                {p.coverImage && <div className="relative aspect-[16/10] overflow-hidden"><Image src={assetPath(p.coverImage.src)} alt={p.coverImage.alt} fill sizes="400px" className="object-cover transition-transform duration-700 group-hover:scale-105" /></div>}
                <div className="flex flex-1 flex-col p-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-600">{p.category}</span>
                  <h2 className="mt-2 text-lg font-bold group-hover:text-brand-700">{p.title}</h2>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted">{p.excerpt}</p>
                  <div className="mt-5 flex items-center justify-between text-xs text-muted"><time dateTime={p.publishedAt}>{formatDate(p.publishedAt)}</time><ArrowUpRight aria-hidden className="size-4 text-brand-700" /></div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {pages > 1 && (
        <nav aria-label="Blog pagination" className="mt-10 flex items-center justify-center gap-2">
          <button type="button" disabled={page === 1} onClick={() => setPage(page - 1)} aria-label="Previous page" className="flex size-10 items-center justify-center rounded-full border border-line disabled:opacity-40"><ChevronLeft className="size-4" /></button>
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <button key={n} type="button" aria-current={n === page ? "page" : undefined} onClick={() => setPage(n)} className={cn("size-10 rounded-full text-sm font-semibold", n === page ? "bg-brand-700 text-white" : "border border-line")}>{n}</button>
          ))}
          <button type="button" disabled={page === pages} onClick={() => setPage(page + 1)} aria-label="Next page" className="flex size-10 items-center justify-center rounded-full border border-line disabled:opacity-40"><ChevronRight className="size-4" /></button>
        </nav>
      )}
    </div>
  );
}
