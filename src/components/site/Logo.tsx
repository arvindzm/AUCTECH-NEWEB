import Image from "next/image";
import Link from "next/link";
import { company } from "@/lib/site";
import { cn } from "@/lib/cn";

/** Uses the white logo only (approved-logo slot). Always placed on a dark surface. */
export function Logo({
  className,
  height = 36,
  href = "/",
  priority,
  badge = true,
}: {
  className?: string;
  height?: number;
  href?: string | null;
  priority?: boolean;
  badge?: boolean;
}) {
  const width = Math.round((company.logo.width / company.logo.height) * height);
  const img = (
    <Image
      src="/brand/auctech-logo.png"
      alt="Auctech IT Solutions"
      width={width}
      height={height}
      priority={priority}
      unoptimized
      className="shrink-0 object-contain"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        display: "block",
      }}
    />
  );
  const inner = badge ? (
    <span className="inline-flex items-center rounded-xl bg-white px-3 py-1.5 shadow-sm transition-transform hover:scale-[1.02]">
      {img}
    </span>
  ) : (
    img
  );

  if (href === null) return <span className={cn("inline-flex items-center", className)}>{inner}</span>;
  return <Link href={href} aria-label="Auctech IT Solutions — Home" className={cn("inline-flex shrink-0 items-center", className)}>{inner}</Link>;
}
