/**
 * API contract types for Phase 4 integration.
 * These describe EXPECTED request/response shapes only. Nothing in Phase 3 calls a server.
 */

export type ID = string;
export type ISODate = string;
export type PublishStatus = "draft" | "published" | "archived" | "pending-approval";

export interface ApiError { code: string; message: string; fieldErrors?: Record<string, string> }
export interface Paginated<T> { items: T[]; page: number; pageSize: number; total: number }
export interface ListQuery { page?: number; pageSize?: number; search?: string; status?: string; sort?: string; [filter: string]: string | number | undefined }

/* ---------- Public submissions ---------- */
export interface EnquiryRequest {
  source: "contact-page" | "quote-modal";
  name: string;
  phone: string;
  email?: string;
  company?: string;
  city?: string;
  services: string[];
  message?: string;
  pageUrl?: string;
}
export interface EnquiryResponse { id: ID; receivedAt: ISODate }

export interface JobApplicationRequest {
  jobId?: ID; // undefined = general application
  fullName: string;
  email: string;
  phone: string;
  portfolioUrl?: string;
  address?: string;
  experienceLevel?: "Fresher" | "Experienced";
  yearsOfExperience: string;
  /** multipart field; the server performs storage + malware scanning (Phase 4) */
  resume: File;
}
export interface JobApplicationResponse { id: ID; receivedAt: ISODate }

/* ---------- Admin entities ---------- */
export interface AuthLoginRequest { email: string; password: string; remember?: boolean }
export interface AuthSession { user: AdminUser; expiresAt: ISODate }
export interface AdminUser { id: ID; name: string; email: string; role: "super-admin" | "editor" | "hr" | "viewer"; avatarUrl?: string }

export interface SeoFields { metaTitle?: string; metaDescription?: string; keywords?: string; canonicalUrl?: string; ogTitle?: string; ogDescription?: string; ogImage?: string; noindex?: boolean }

export interface CmsRecord { id: ID; createdAt: ISODate; updatedAt: ISODate; status?: PublishStatus }

export type EnquiryStatus = "new" | "contacted" | "in-progress" | "closed" | "spam";
export type ApplicationStatus = "received" | "shortlisted" | "interview" | "rejected" | "hired";
