import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock, UserRound } from "lucide-react";
import type { BlogPost } from "@/types/content";
import { assetPath } from "@/lib/site";

export const formatDate = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
};

/**
 * Blog article layout. Shared by the public /blog/[slug] route and the admin editor preview.
 * `bodyHtml` must be sanitised server-side before it reaches this component (Phase 4 responsibility).
 */
export function BlogArticle({ post, preview }: { post: BlogPost; preview?: boolean }) {
  return (
    <article>
      <header className="relative overflow-hidden hero-mesh pb-16 pt-36 text-white sm:pt-44">
        <div aria-hidden className="absolute inset-0 grid-lines" />
        <div className="container-x relative max-w-4xl">
          {!preview && <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white"><ArrowLeft aria-hidden className="size-4" />All articles</Link>}
          {post.category && <p className="mt-6 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider">{post.category}</p>}
          <h1 className="mt-4 text-3xl font-extrabold leading-tight !text-white sm:text-5xl">{post.title || "Untitled article"}</h1>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
            {post.author && <li className="flex items-center gap-2"><UserRound aria-hidden className="size-4" />{post.author}</li>}
            {post.publishedAt && formatDate(post.publishedAt) && <li className="flex items-center gap-2"><CalendarDays aria-hidden className="size-4" /><time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time></li>}
            {post.readingMinutes ? <li className="flex items-center gap-2"><Clock aria-hidden className="size-4" />{post.readingMinutes} min read</li> : null}
          </ul>
        </div>
      </header>
      <div className="container-x max-w-4xl py-14">
        {post.coverImage?.src && (
          <div className="-mt-28 mb-10 overflow-hidden rounded-3xl border-4 border-white shadow-lift">
            <Image src={assetPath(post.coverImage.src)} alt={post.coverImage.alt} width={1600} height={900} sizes="(min-width:1024px) 900px, 100vw" className="h-auto w-full" unoptimized={post.coverImage.src.startsWith("blob:")} />
          </div>
        )}
        {post.excerpt && <p className="text-xl leading-relaxed text-ink">{post.excerpt}</p>}
        <div className="prose-auc mt-8 text-[17px]" dangerouslySetInnerHTML={{ __html: post.bodyHtml }} />
      </div>
    </article>
  );
}
