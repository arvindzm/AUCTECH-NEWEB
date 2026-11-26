import type { Metadata } from "next";
import { HomePage } from "@/features/public/HomePage";
import { buildMetadata } from "@/lib/seo";
import { getCoreMeta } from "@/lib/content";

export const metadata: Metadata = buildMetadata({ path: "/", source: getCoreMeta("home") });
export default function Page() { return <HomePage />; }
