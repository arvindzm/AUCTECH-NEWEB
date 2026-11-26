"use client";
import { ALink, EmptyState } from "@/features/admin/components/ui";
import { SearchX } from "lucide-react";
export default function AdminNotFound() {
  return <EmptyState icon={SearchX} title="Admin page not found" text="This module or record does not exist." action={<ALink href="/admin">Back to dashboard</ALink>} />;
}
