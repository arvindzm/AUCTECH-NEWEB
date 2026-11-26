import Image from "next/image";
import Link from "next/link";
import { company } from "@/lib/site";
import { cn } from "@/lib/cn";

/** Uses the white logo only (approved-logo slot). Always placed on a dark surface. */
export function Logo({ className, height = 52, href = "/", priority }: { className?: string; height?: number; href?: string | null; priority?: boolean }) {
  const width = Math.round((company.logo.width / company.logo.height) * height);
  const img = (
    <Image src={company.logo.white} alt="Auctech IT Solutions" width={width} height={height} priority={priority}
      className="h-full w-auto object-contain" style={{ height }} />
  );
  if (href === null) return <span className={cn("inline-flex", className)}>{img}</span>;
  return <Link href={href} aria-label="Auctech IT Solutions — Home" className={cn("inline-flex shrink-0", className)}>{img}</Link>;
}
