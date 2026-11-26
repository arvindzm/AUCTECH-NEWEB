"use client";
import { notFound, useParams } from "next/navigation";
import { ResourceForm } from "@/features/admin/components/ResourceForm";
import { getResource } from "@/features/admin/config/resources";

export default function Page() {
  const { module, id } = useParams<{ module: string; id: string }>();
  const res = getResource(module);
  if (!res || res.canEdit === false || res.canCreate === false) notFound();
  return <ResourceForm key={id} res={res} id={decodeURIComponent(id)} />;
}
