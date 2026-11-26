import { Briefcase, CalendarDays, Clock, MapPin } from "lucide-react";
import type { JobPosting } from "@/types/content";
import { formatDate } from "@/features/public/BlogArticle";

/** Job detail body. Shared by /career/[slug] and the admin job editor preview. */
export function JobDetail({ job }: { job: JobPosting }) {
  const meta = [
    { icon: MapPin, v: job.location },
    { icon: Briefcase, v: job.employmentType },
    { icon: Clock, v: job.experience },
    { icon: CalendarDays, v: job.postedAt && formatDate(job.postedAt) ? `Posted ${formatDate(job.postedAt)}` : "" },
  ].filter((m) => m.v);
  return (
    <div>
      {job.department && <p className="text-sm font-bold uppercase tracking-wider text-brand-600">{job.department}</p>}
      <h2 className="mt-2 text-3xl font-extrabold">{job.title || "Untitled position"}</h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {meta.map(({ icon: I, v }) => <li key={v} className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-sm font-semibold text-ink-soft"><I aria-hidden className="size-4 text-brand-600" />{v}</li>)}
      </ul>
      {job.summary && <p className="mt-6 text-lg leading-relaxed">{job.summary}</p>}
      {job.responsibilities.length > 0 && <><h3 className="mt-8 text-xl font-bold">Responsibilities</h3><ul className="mt-3 list-disc space-y-2 pl-5">{job.responsibilities.map((r) => <li key={r}>{r}</li>)}</ul></>}
      {job.requirements.length > 0 && <><h3 className="mt-8 text-xl font-bold">Requirements</h3><ul className="mt-3 list-disc space-y-2 pl-5">{job.requirements.map((r) => <li key={r}>{r}</li>)}</ul></>}
    </div>
  );
}
