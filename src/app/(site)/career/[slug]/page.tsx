import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/PageHero";
import { ApplicationForm } from "@/components/forms/ApplicationForm";
import { JobDetail } from "@/features/public/JobDetail";
import { jobPostings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

/** Job detail route (new UI; no jobs are currently published, so all slugs 404). URL pattern pending approval. */
export function generateStaticParams() { return jobPostings.map((j) => ({ slug: j.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const job = jobPostings.find((j) => j.slug === slug);
  return job ? buildMetadata({ path: `/career/${slug}`, title: `${job.title} | Careers | Auctech IT Solutions`, description: job.summary }) : { robots: { index: false } };
}

export default async function JobPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = jobPostings.find((j) => j.slug === slug);
  if (!job) notFound();
  return (
    <>
      <PageHero title={job.title} sub={job.summary} crumbs={[{ label: "Home", href: "/" }, { label: "Careers", href: "/career" }, { label: job.title }]} />
      <section className="py-16"><div className="container-x grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <JobDetail job={job} />
        <div className="rounded-[2rem] border border-line bg-white p-6 shadow-card lg:sticky lg:top-28 lg:self-start"><h2 className="text-2xl font-extrabold">Apply now</h2><div className="mt-6"><ApplicationForm jobId={job.slug} jobTitle={job.title} /></div></div>
      </div></section>
    </>
  );
}
