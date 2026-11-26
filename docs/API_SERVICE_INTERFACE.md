# API service interface (Phase 3 → Phase 4 hand-off)

Phase 3 makes **no network calls**. All backend interaction goes through `src/services/api/client.ts`. Its request and response types are in `src/services/api/types.ts`.

## Adapter modes (`NEXT_PUBLIC_API_MODE`)
| Mode | Behaviour |
|---|---|
| `not-connected` (default) | Every method rejects with `ApiNotConnectedError` after a short delay. The UI then shows an honest error: nothing was sent, and the visitor is offered phone and email instead. |
| `ui-preview` | Methods resolve locally, so success states can be reviewed. **Nothing is sent or stored.** Use only for design review, never in production. |

## Public endpoints (planned)
| Method | Planned endpoint | Request | Response |
|---|---|---|---|
| `publicApi.submitEnquiry` | `POST /api/enquiries` | `EnquiryRequest` (source, name, phone, email?, company?, city?, services[], message?, pageUrl?) | `EnquiryResponse { id, receivedAt }` |
| `publicApi.submitApplication` | `POST /api/careers/applications` (multipart) | `JobApplicationRequest` (jobId?, fullName, email, phone, portfolioUrl?, address?, experienceLevel?, yearsOfExperience, resume: File) | `JobApplicationResponse { id, receivedAt }` |

## Admin endpoints (planned)
| Method | Planned endpoint |
|---|---|
| `authApi.login(body)` | `POST /api/admin/auth/login` → `AuthSession` |
| `authApi.logout()` | `POST /api/admin/auth/logout` |
| `authApi.session()` | `GET /api/admin/auth/session` |
| `authApi.requestPasswordReset(email)` | `POST /api/admin/auth/forgot-password` |
| `resourceApi<T>(resource).list(query)` | `GET /api/admin/{resource}?page&pageSize&search&status&sort&…filters` → `Paginated<T>` |
| `.get(id)` | `GET /api/admin/{resource}/{id}` |
| `.create(input)` | `POST /api/admin/{resource}` |
| `.update(id, input)` | `PATCH /api/admin/{resource}/{id}` |
| `.remove(id)` | `DELETE /api/admin/{resource}/{id}` |
| `mediaApi.upload(file, meta)` | `POST /api/admin/media` (multipart) → `{ id, url }` |
| `mediaApi.remove(id)` | `DELETE /api/admin/media/{id}` |

The `{resource}` keys match the admin module keys: `pages`, `services`, `city-pages`, `faqs`, `blog`, `categories`, `portfolio`, `testimonials`, `team`, `jobs`, `applications`, `enquiries`, `seo`. Singletons: `settings`, `careers-page`, `profile`.

Each module's field list (`src/features/admin/config/resources.ts`) is the field contract for its resource.

## Temporary UI adapter (to be removed in Phase 4)
`src/features/admin/store/AdminStore.tsx` keeps admin records in React state, in the current tab only:
- Content modules are seeded from the migrated original content in `src/content/*`.
- User-originated modules (enquiries, applications) and unpublished ones (blog, jobs) start **empty**.
- No demo records are created.

Phase 4 swaps the provider's methods for `resourceApi()` calls. The screens do not change.

## Server responsibilities deferred to Phase 4
Authentication and JWT/session handling, authorisation and roles, persistence, email delivery, resume storage, malware scanning, HTML sanitisation of rich text (`bodyHtml`), rate limiting and spam protection for public forms, image processing and storage, and audit logs.
