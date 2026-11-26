import type { LucideIcon } from "lucide-react";

export type Rec = { id: string; createdAt?: string; updatedAt?: string; [k: string]: unknown };

export type FieldType =
  | "text" | "textarea" | "richtext" | "select" | "tags" | "toggle" | "number" | "date"
  | "image" | "file" | "url" | "email" | "slug" | "list" | "cards" | "faqs" | "stats" | "readonly";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  help?: string;
  placeholder?: string;
  maxLength?: number;
  section?: string; // groups fields under a heading
  wide?: boolean; // spans both columns
  readOnlyOnEdit?: boolean;
  accept?: string;
}

export type ColumnRender = "text" | "status" | "image" | "date" | "mono" | "badge" | "count";
export interface ColumnDef { key: string; label: string; render?: ColumnRender; className?: string }
export interface FilterDef { key: string; label: string; options: string[] }

export interface ResourceConfig {
  key: string;
  label: string;
  singular: string;
  description: string;
  icon: LucideIcon;
  group: "Content" | "Website" | "Recruitment" | "Leads" | "System";
  fields: FieldDef[];
  columns: ColumnDef[];
  filters?: FilterDef[];
  searchKeys: string[];
  titleKey: string;
  seed?: () => Rec[];
  /** where records come from in Phase 3 */
  source: "migrated" | "api-only";
  canCreate?: boolean;
  canDelete?: boolean;
  canEdit?: boolean;
  preview?: "blog" | "job";
  statusOptions?: string[];
  note?: string;
}
