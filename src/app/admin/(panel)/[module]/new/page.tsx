"use client";
import { notFound, useParams } from "next/navigation";
import { ResourceForm } from "@/features/admin/components/ResourceForm";
import { getResource } from "@/features/admin/config/resources";

export default function Page() {
  const { module } = useParams<{ module: string }>();
  const res = getResource(module);
  if (!res || res.canCreate === false) notFound();
  return <ResourceForm res={res} />;
}
