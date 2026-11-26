/**
 * API service interface (Phase 3).
 *
 * Every method signature documents the Phase 4 endpoint it will map to. In Phase 3 the active adapter
 * is chosen by NEXT_PUBLIC_API_MODE:
 *   - "not-connected" (default): methods reject with ApiNotConnectedError. Nothing is sent.
 *   - "ui-preview": methods resolve locally after a short delay so success states can be reviewed.
 *     Nothing is sent or stored, and the response is NOT a database record.
 */
import type {
  AuthLoginRequest, AuthSession, EnquiryRequest, EnquiryResponse, JobApplicationRequest, JobApplicationResponse,
  ListQuery, Paginated, ID,
} from "./types";

export class ApiNotConnectedError extends Error {
  code = "API_NOT_CONNECTED";
  constructor(operation: string) {
    super(`The backend for "${operation}" is not connected yet. This is expected in the Phase 3 frontend build.`);
  }
}

export interface PublicApi {
  /** POST /api/enquiries */
  submitEnquiry(body: EnquiryRequest): Promise<EnquiryResponse>;
  /** POST /api/careers/applications (multipart/form-data) */
  submitApplication(body: JobApplicationRequest): Promise<JobApplicationResponse>;
}

export interface AuthApi {
  /** POST /api/admin/auth/login */
  login(body: AuthLoginRequest): Promise<AuthSession>;
  /** POST /api/admin/auth/logout */
  logout(): Promise<void>;
  /** GET /api/admin/auth/session */
  session(): Promise<AuthSession | null>;
  /** POST /api/admin/auth/forgot-password */
  requestPasswordReset(email: string): Promise<void>;
}

/** Generic CMS resource contract: /api/admin/{resource} */
export interface ResourceApi<T, TInput = Partial<T>> {
  /** GET /api/admin/{resource}?page&pageSize&search&status&sort */
  list(query?: ListQuery): Promise<Paginated<T>>;
  /** GET /api/admin/{resource}/{id} */
  get(id: ID): Promise<T>;
  /** POST /api/admin/{resource} */
  create(input: TInput): Promise<T>;
  /** PATCH /api/admin/{resource}/{id} */
  update(id: ID, input: TInput): Promise<T>;
  /** DELETE /api/admin/{resource}/{id} */
  remove(id: ID): Promise<void>;
}

export interface MediaApi {
  /** POST /api/admin/media (multipart) */
  upload(file: File, meta?: { alt?: string; folder?: string }): Promise<{ id: ID; url: string }>;
  /** DELETE /api/admin/media/{id} */
  remove(id: ID): Promise<void>;
}

export type ApiMode = "not-connected" | "ui-preview";
export const apiMode: ApiMode = process.env.NEXT_PUBLIC_API_MODE === "ui-preview" ? "ui-preview" : "not-connected";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function adapter<T>(operation: string, previewResult: () => T): Promise<T> {
  await wait(900);
  if (apiMode === "ui-preview") return previewResult();
  throw new ApiNotConnectedError(operation);
}

const previewReceipt = () => ({ id: "ui-preview", receivedAt: new Date().toISOString() });

export const publicApi: PublicApi = {
  submitEnquiry: () => adapter("submit enquiry", previewReceipt),
  submitApplication: () => adapter("submit job application", previewReceipt),
};

export const authApi: AuthApi = {
  login: () => adapter<AuthSession>("admin login", () => { throw new ApiNotConnectedError("admin login"); }),
  logout: () => adapter("admin logout", () => undefined),
  session: () => Promise.resolve(null),
  requestPasswordReset: () => adapter("password reset", () => undefined),
};

export function resourceApi<T>(resource: string): ResourceApi<T> {
  const nc = (op: string) => () => adapter<never>(`${resource}.${op}`, () => { throw new ApiNotConnectedError(`${resource}.${op}`); });
  return { list: nc("list"), get: nc("get"), create: nc("create"), update: nc("update"), remove: nc("remove") };
}

export const mediaApi: MediaApi = {
  upload: () => adapter<never>("media upload", () => { throw new ApiNotConnectedError("media upload"); }),
  remove: () => adapter<never>("media delete", () => { throw new ApiNotConnectedError("media delete"); }),
};
