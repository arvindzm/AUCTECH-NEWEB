import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArticle } from "@/features/public/BlogArticle";
import { JsonLd } from "@/components/site/JsonLd";
import { blogPosts } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

/** Article URLs follow the original pattern /blog/{slug}. No articles are published yet, so every slug 404s. */
export function generateStaticParams() { return blogPosts.map((p) => ({ slug: p.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: "Article not found", robots: { index: false } };
  return buildMetadata({ path: `/blog/${slug}`, title: post.seo?.title || post.title, description: post.seo?.description || post.excerpt });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "BlogPosting", headline: post.title, datePublished: post.publishedAt, mainEntityOfPage: absoluteUrl(`/blog/${slug}`) }} />
      <BlogArticle post={post} />
    </>
  );
}
