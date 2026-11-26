"use client";
import { notFound, useParams } from "next/navigation";
import { ResourceDetail } from "@/features/admin/components/ResourceDetail";
import { getResource } from "@/features/admin/config/resources";

export default function Page() {
  const { module, id } = useParams<{ module: string; id: string }>();
  const res = getResource(module);
  if (!res) notFound();
  return <ResourceDetail res={res} id={decodeURIComponent(id)} />;
}
