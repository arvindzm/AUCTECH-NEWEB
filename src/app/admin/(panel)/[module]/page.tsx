"use client";
import { notFound, useParams } from "next/navigation";
import { ResourceList } from "@/features/admin/components/ResourceList";
import { getResource } from "@/features/admin/config/resources";

export default function Page() {
  const { module } = useParams<{ module: string }>();
  const res = getResource(module);
  if (!res) notFound();
  return <ResourceList key={res.key} res={res} />;
}
