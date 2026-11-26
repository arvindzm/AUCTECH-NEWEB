import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { BlogIndex } from "@/features/public/BlogIndex";
import { corePages } from "@/content/core-pages";
import { blogCategories, blogPosts, getCoreMeta } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({ path: "/blog", source: getCoreMeta("blog") });

export default function BlogPage() {
  const c = corePages.blog;
  return (
    <>
      <PageHero {...c.hero} title={c.hero.h1} crumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]} />
      <section className="py-16 sm:py-20"><div className="container-x"><BlogIndex posts={blogPosts} categories={blogCategories} empty={c.empty} /></div></section>
    </>
  );
}
