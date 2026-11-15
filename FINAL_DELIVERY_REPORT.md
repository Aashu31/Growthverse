# GrowthVerse 1.0.0 — Final Delivery Report

**Date:** 15 November 2026  
**Scope:** Authentication, authorization, security hardening, frontend auth UX, automated verification, and deployment documentation for the existing GrowthVerse application.  
**Repository:** https://github.com/Aashu31/Growthverse

Only the following status labels are used in this report:

- **COMPLETED AND VERIFIED**
- **IMPLEMENTED BUT NOT VERIFIED**
- **BLOCKED BY CONFIGURATION**
- **NOT IMPLEMENTED**

---

## 1. Executive summary

The existing GrowthVerse React site and dashboard now run on a real Fastify + PostgreSQL/Prisma backend with production-oriented authentication, centralized role-based authorization, and customer ownership isolation. The former frontend-only/localStorage authentication and demo data paths were replaced with authenticated API data. The public marketing site and its visual identity were preserved.

Core security properties:

- Argon2id password hashing with configurable OWASP-baseline parameters.
- Short-lived access JWT in an HttpOnly cookie.
- Rotating, opaque refresh tokens stored only as SHA-256 hashes.
- Refresh replay detection that revokes the user's entire session family.
- HttpOnly/Secure/SameSite cookies, CSRF double-submit protection, Origin/Referer allowlisting.
- No auth tokens in `localStorage` or `sessionStorage`.
- Public registration restricted to CUSTOMER; no public admin registration.
- Backend-enforced permissions on every protected route.
- Guarded, environment-driven SUPER_ADMIN provisioning with no default password.
- Customer records are never claimed through an email fallback: an existing unlinked customer record is attached only after email verification, preventing unverified-account takeover of existing customer data.

Verification performed against real infrastructure:

| Verification | Result | Status |
| --- | --- | --- |
| Backend integration tests | 33/33 passed (2 files) | COMPLETED AND VERIFIED |
| Frontend unit/component tests | 14/14 passed (4 files) | COMPLETED AND VERIFIED |
| Live API smoke suite | 93/93 checks passed | COMPLETED AND VERIFIED |
| Headless Chrome browser E2E | 20/20 checks passed | COMPLETED AND VERIFIED |
| Production webpack build | Compiled successfully; 3 size warnings | COMPLETED AND VERIFIED |
| SUPER_ADMIN provisioning guard | Manual verification passed | COMPLETED AND VERIFIED |
| Real email delivery | SMTP credentials unavailable | BLOCKED BY CONFIGURATION |
| Production infrastructure deployment | No target host/domain/credentials | BLOCKED BY CONFIGURATION |

---

## 2. Requirement status matrix

| Requirement | Status | Evidence |
| --- | --- | --- |
| Audit existing repo before changes; preserve stack and visual identity | COMPLETED AND VERIFIED | Existing React/webpack/Tailwind structure retained; marketing pages and design system preserved |
| PostgreSQL + Prisma schema and migration | COMPLETED AND VERIFIED | `backend/prisma/schema.prisma`; `20261115000000_init_auth_and_business` applied to dev and test databases |
| Argon2id password hashing | COMPLETED AND VERIFIED | `backend/src/lib/password.js`; auth tests and smoke checks exercise hashing/verification |
| Registration, login, logout, refresh | COMPLETED AND VERIFIED | `/api/auth/*`; backend, smoke, and browser E2E tests |
| Short-lived access tokens and rotating refresh sessions | COMPLETED AND VERIFIED | JWT expiry + `RefreshSession` rotation; replay tests |
| HttpOnly/Secure/SameSite cookies | COMPLETED AND VERIFIED | Cookie tests; E2E asserts HttpOnly for auth cookies |
| Session records, revocation, replay detection | COMPLETED AND VERIFIED | `refresh_sessions`; logout/logout-all/password-change tests; replay test |
| Forgot/reset password | COMPLETED AND VERIFIED | Token issuance, hashing, single use, expiry, generic responses; tests |
| Email verification and resend | COMPLETED AND VERIFIED | Token flow, customer linkage after verification; tests |
| Change password | COMPLETED AND VERIFIED | Endpoint revokes other sessions; tests |
| Roles SUPER_ADMIN/ADMIN/STAFF/CUSTOMER | COMPLETED AND VERIFIED | Prisma enum and centralized permission matrix |
| Centralized backend authorization | COMPLETED AND VERIFIED | `backend/src/plugins/auth.js`, `backend/src/lib/permissions.js`; authorization tests |
| Customer ownership isolation | COMPLETED AND VERIFIED | `/api/customers/me`, `/api/orders` scoping; ownership tests |
| Protect services/pricing/features/portfolio/contacts/customers/orders/dashboard/settings | COMPLETED AND VERIFIED | Route-level permission guards; authorization tests and smoke checks |
| Public reads only where genuinely public | COMPLETED AND VERIFIED | Published/active filtering for content; public contact submission; public non-sensitive settings |
| Secure SUPER_ADMIN provisioning, no default password | COMPLETED AND VERIFIED | `backend/scripts/provision-super-admin.js`; manual negative/positive tests |
| No hardcoded credentials | COMPLETED AND VERIFIED | Environment/secret driven; repository scan and provisioning behavior |
| React AuthContext and cookie bootstrap | COMPLETED AND VERIFIED | `src/context/AuthContext.jsx`; frontend tests |
| Protected, guest, and role routes | COMPLETED AND VERIFIED | `ProtectedRoute`, `GuestRoute`, `RoleGuard`; tests |
| Login/signup/forgot/reset/verify pages | COMPLETED AND VERIFIED | `src/pages/auth/*`; browser E2E |
| Account and session management | COMPLETED AND VERIFIED | `src/pages/account/Account.jsx`; sessions API; smoke checks |
| Backend automated tests on isolated test DB | COMPLETED AND VERIFIED | `npm test` in `backend`; 33 passed |
| Frontend automated tests | COMPLETED AND VERIFIED | `npm test` at root; 14 passed |
| Production build succeeds | COMPLETED AND VERIFIED | `npm run build`; compiled successfully |
| Browser end-to-end auth flow | COMPLETED AND VERIFIED | `npm run test:e2e`; 20 checks |
| Real email delivery | BLOCKED BY CONFIGURATION | `EMAIL_PROVIDER=console` locally; no SMTP credentials |
| Production deployment | BLOCKED BY CONFIGURATION | No infrastructure, domain, TLS, or credentials provided |
| OAuth / SSO / MFA | NOT IMPLEMENTED | Out of scope; email/password + sessions implemented |
| Payment processing | NOT IMPLEMENTED | Out of scope; pricing/orders are records only |

---

## 3. Architecture

```
React 18 SPA (webpack 5, Tailwind, Context API)
        │  fetch with credentials: "include"
        │  X-CSRF-Token on state-changing requests
        ▼
Fastify 5 API
  ├── @fastify/cookie      cookie parsing and serialization
  ├── @fastify/jwt         access-token signing/verification
  ├── security plugin      CORS, Helmet, rate limit, Origin/Referer, CSRF
  ├── auth plugin          authenticate, optionalAuthenticate, authorizeRoles,
  │                        authorizePermission
  ├── error handler        consistent JSON error envelope + Prisma mapping
  └── route modules        auth, admin, services, pricing, features, portfolio,
                           contacts, customers, orders, dashboard, settings
        │
        ▼
Prisma 5 ORM
        │
        ▼
PostgreSQL
```

Key implementation choices:

- **One authorization source of truth:** `backend/src/lib/permissions.js`. The frontend has a UX-only mirror in `src/utils/permissions.js`.
- **Cookie-based auth only:** no bearer tokens are persisted by the browser client.
- **Refresh token format:** `<sessionId>.<randomSecret>`; only `SHA-256(token)` is stored.
- **Atomic rotation:** an `updateMany` claim on `revokedAt` prevents concurrent refresh races; a failed claim triggers replay handling.
- **Generic auth responses:** login and forgot-password do not disclose account existence; unknown emails run a dummy Argon2 verification.
- **Email abstraction:** `console`, `smtp`, and `none` providers. Tokens are never logged. Development-only preview URLs are returned only when email delivery is unconfigured and `NODE_ENV` is not production.
- **Deferred customer linkage:** new signups receive their own `Customer` row. If a staff-created, unlinked `Customer` already exists for the normalized email, it is attached only after verification. Customer ownership uses `userId` only, never an email fallback.

---

## 4. Data model and migration

### Auth models

| Model / table | Purpose | Notable fields |
| --- | --- | --- |
| `User` / `users` | Accounts and roles | `email` unique, `passwordHash`, `role`, `status`, `emailVerified`, `emailVerifiedAt`, `lastLoginAt` |
| `RefreshSession` / `refresh_sessions` | Rotating sessions | `tokenHash` unique, `expiresAt`, `revokedAt`, `replacedByTokenHash`, `userAgent`, `ipAddress` |
| `PasswordResetToken` / `password_reset_tokens` | Reset flow | `tokenHash` unique, `expiresAt`, `usedAt` |
| `EmailVerificationToken` / `email_verification_tokens` | Verification flow | `tokenHash` unique, `expiresAt`, `usedAt` |

### Business models

| Model / table | Purpose |
| --- | --- |
| `Service` / `services` | Service catalogue with publication state |
| `PricingPlan` / `pricing_plans` | Pricing by category, audience, billing cycle |
| `Feature` / `features` | Feature catalogue |
| `Contact` / `contacts` | Website enquiries and status workflow |
| `ProjectInquiry` / `project_inquiries` | Orders/project inquiries with customer/service relations and order fields |
| `Customer` / `customers` | Customer records; optional unique `userId` link |
| `PortfolioProject` / `portfolio_projects` | Portfolio content |
| `SiteSetting` / `site_settings` | Public and sensitive settings key/value store |

### Migration

- Baseline migration: `backend/prisma/migrations/20261115000000_init_auth_and_business/migration.sql`
- Applied to the development database and the isolated test database.
- Test preparation script: `backend/scripts/prepare-test-db.js`
  - Requires `TEST_DATABASE_URL`.
  - Refuses any database name that does not contain `test`.
  - Creates the database if absent, then runs `prisma migrate deploy`.
- `ProjectInquiry` remains the orders storage model to avoid removing existing business APIs; it was extended rather than replaced.

---

## 5. Authentication API

Base path: `/api/auth`

| Method | Endpoint | Access / guard | Behavior |
| --- | --- | --- | --- |
| POST | `/register` | Public, rate-limited | Creates CUSTOMER only; rejects requested non-CUSTOMER roles; sends verification email; no auto-attach of existing customer records |
| POST | `/login` | Public, stricter rate limit | Verifies Argon2id hash; rejects inactive/suspended accounts; creates refresh session; sets auth + CSRF cookies |
| GET | `/me` | Authenticated | Returns public user and role; the SPA derives permissions from the role and uses `/api/customers/me` for the linked customer record |
| PATCH | `/me` | Authenticated | Updates own name/phone/avatar; syncs linked customer name/phone |
| POST | `/refresh` | Refresh cookie | Rotates refresh token atomically; replay revokes all user sessions |
| POST | `/logout` | Refresh cookie | Revokes current session, clears cookies; works with expired access token |
| POST | `/logout-all` | Authenticated | Revokes every session for the user |
| POST | `/change-password` | Authenticated, rate-limited | Verifies current password, enforces policy, revokes other sessions |
| POST | `/forgot-password` | Public, rate-limited | Generic response; hashed, expiring, single-use token |
| POST | `/reset-password` | Public, rate-limited | Consumes token, updates hash, revokes all sessions |
| POST | `/verify-email` | Public, rate-limited | Consumes token, marks verified, links existing unlinked customer record |
| POST | `/resend-verification` | Public, rate-limited | Generic response; rotates outstanding verification tokens |
| GET | `/csrf` | Public | Ensures a CSRF cookie exists |
| GET | `/sessions` | Authenticated | Lists active refresh sessions |
| DELETE | `/sessions/:id` | Authenticated, ownership-checked | Revokes one of the current user's sessions |

### Administrator API

Base path: `/api/admin`, all routes SUPER_ADMIN only.

| Method | Endpoint | Behavior |
| --- | --- | --- |
| GET | `/users` | Paginated list with search, role, and status filters |
| GET | `/users/:id` | User detail |
| PATCH | `/users/:id` | Change name, role, or status; guards last active SUPER_ADMIN; revokes sessions on role/status change |
| GET | `/roles` | Role list with permissions |

---

## 6. Authorization rules

### Permission matrix

| Permission | SUPER_ADMIN | ADMIN | STAFF | CUSTOMER |
| --- | :---: | :---: | :---: | :---: |
| `dashboard.view` | yes | yes | yes | no |
| `content.view` | yes | yes | yes | no |
| `content.manage` | yes | yes | no | no |
| `contacts.view` | yes | yes | yes | no |
| `contacts.manage` | yes | yes | yes | no |
| `customers.view` | yes | yes | yes | no |
| `customers.manage` | yes | yes | no | no |
| `orders.view` | yes | yes | yes | no |
| `orders.manage` | yes | yes | yes | no |
| `settings.view` | yes | yes | no | no |
| `settings.manage` | yes | no | no | no |
| `users.manage` | yes | no | no | no |
| `account.self` | yes | yes | yes | yes |
| `orders.self` | yes | yes | yes | yes |

### Enforcement details

- Every protected backend route uses `fastify.authenticate` and, where applicable, `authorizePermission` or `authorizeRoles`.
- Public content endpoints filter to published/active records. Staff with `content.view` can see unpublished records where the module supports it.
- `GET /api/customers/me` resolves through `Customer.userId`; there is no email fallback.
- CUSTOMER order listing and detail are scoped to the linked customer. Direct access to another customer's order returns not found/forbidden. Order creation, updates, and deletion require `orders.manage` (staff).
- Contacts submission is public; reading and management require staff permissions.
- Settings public read exposes only a non-sensitive allowlist. Writes require `settings.manage`, which only SUPER_ADMIN holds.
- Dashboard metrics are served only by `/api/dashboard` to authenticated staff with `dashboard.view`.
- Frontend guards are UX only. Direct API calls still enforce the backend matrix, as covered by authorization tests.

---

## 7. Frontend authentication and account UX

### Auth state

`src/context/AuthContext.jsx`:

- Bootstraps the session from `GET /api/auth/me`; no token is read from Web Storage.
- Exposes login, register, logout, logout-all, profile update, password change, forgot/reset, verification, resend, and session operations.
- Listens for `growthverse:auth-expired` and clears local auth state when refresh fails.
- Exposes role and permission helpers for navigation and guard decisions.

### API client

`src/api/client.js`:

- Uses `credentials: "include"`.
- Reads `gv_csrf` and sends `X-CSRF-Token` on state-changing requests.
- On `401`, performs one shared refresh attempt (single-flight promise) and retries the original request once.
- Emits `growthverse:auth-expired` if refresh fails.
- Base URL defaults to `/api`; production can override with `REACT_APP_API_URL`.

### Routes

| Route group | Guard | Pages |
| --- | --- | --- |
| Public website | None | Home, About, Services, Service Details, Features, Technologies, Pricing, Portfolio, Project Details, Sarthi, Contact |
| Guest-only auth | `GuestRoute` | Login, Signup, Forgot Password |
| Token pages | Public | Reset Password, Verify Email |
| Account | `ProtectedRoute` | `/account` with profile, password, sessions, customer record, own orders, verification resend |
| Dashboard | `ProtectedRoute` for STAFF/ADMIN/SUPER_ADMIN | Overview, Services, Pricing, Features, Portfolio, Orders, Customers, Contacts, Company Profile, Settings |
| User administration | `RoleGuard` SUPER_ADMIN | Users & Roles |
| Forbidden | Public | `/forbidden` |

### Dashboard data

- `DataContext` now fetches real API data for staff areas and performs CRUD through the protected backend.
- Demo/localStorage business data was removed from dashboard data flow.
- `ResourceManager` provides real CRUD for services, pricing, features, portfolio, contacts, customers, and orders.
- Users and roles use a dedicated SUPER_ADMIN page.
- Navigation is role-aware but not authoritative; unauthorized API calls remain blocked server-side.

---

## 8. Security controls and decisions

| Control | Implementation |
| --- | --- |
| Password hashing | Argon2id; memory/time/parallelism configurable; password policy enforced server-side |
| Access token | JWT, default 15-minute expiry, `gv_at` HttpOnly cookie, path `/api` |
| Refresh token | 256-bit opaque random secret, `gv_rt` HttpOnly cookie, path `/api/auth`; only SHA-256 hash stored |
| Rotation | New session per refresh; old session atomically revoked; `replacedByTokenHash` recorded |
| Replay detection | Reuse of a revoked/rotated token revokes all sessions for the user and clears cookies |
| Logout | Current session revoked; logout-all revokes every session |
| Password change | Current password required; other sessions revoked; policy enforced |
| Reset tokens | Random, hashed, single-use, expiring; prior unused tokens invalidated on reissue |
| Verification tokens | Random, hashed, single-use, expiring; prior unused tokens invalidated on resend |
| Cookies | HttpOnly for auth tokens; SameSite configurable; Secure in production; optional domain |
| CSRF | Double-submit cookie + `X-CSRF-Token`; required for state-changing requests carrying auth cookies |
| Origin checks | Origin/Referer allowlist on state-changing requests |
| CORS | Exact-origin allowlist; credentials enabled; restricted methods/headers |
| Headers | Helmet defaults; CSP disabled at the API layer and documented for the proxy |
| Rate limiting | Global per-IP plus stricter login/auth windows |
| Enumeration resistance | Generic login and forgot-password responses; dummy Argon2 verification |
| Account status | Inactive/suspended accounts cannot log in; refresh revokes sessions |
| Admin safety | SUPER_ADMIN-only user management; last active SUPER_ADMIN protected; self-deactivation blocked |
| Provisioning | Environment flag required; policy-checked password; no default; no API; never prints password |
| Logging | Authorization headers, cookies, passwords, and tokens redacted |
| Ownership | Customer link via verified `userId` for pre-existing records; no email fallback; orders scoped by customer |
| Frontend storage | No auth tokens in `localStorage`/`sessionStorage`; E2E asserts this |

---

## 9. Environment variables

Full reference and production examples are in [DEPLOYMENT.md](DEPLOYMENT.md). The template is `backend/.env.example`.

### Application and database

| Variable | Required | Notes |
| --- | --- | --- |
| `NODE_ENV` | Yes | `development`, `test`, `production` |
| `PORT`, `HOST` | No | Default `5000`, `0.0.0.0`; bind to loopback behind a proxy |
| `BACKEND_ORIGIN` | No | Public backend origin used for links |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `TEST_DATABASE_URL` | Tests | Must contain `test` in the database name |
| `FRONTEND_ORIGIN`, `CORS_ORIGIN` | Yes | Exact comma-separated origin allowlist |
| `TRUST_PROXY` | Production behind proxy | Enable only with a trusted proxy |
| `LOG_LEVEL` | No | `info` in production |

### Auth and cookies

| Variable | Notes |
| --- | --- |
| `ACCESS_TOKEN_SECRET` | Required in production, minimum 32 characters |
| `ACCESS_TOKEN_EXPIRY` | Default `15m` |
| `REFRESH_TOKEN_EXPIRY_MS` | Default 7 days |
| `PASSWORD_RESET_EXPIRY_MS` | Default 30 minutes |
| `EMAIL_VERIFICATION_EXPIRY_MS` | Default 24 hours |
| `COOKIE_DOMAIN` | Optional; empty for host-only cookies |
| `COOKIE_SECURE` | Must be `true` in production |
| `COOKIE_SAME_SITE` | `lax` default; `none` requires `Secure` |

### Rate limits, hashing, email, provisioning

| Variable | Notes |
| --- | --- |
| `RATE_LIMIT_MAX`, `RATE_LIMIT_TIME` | Global limit; default 300/minute |
| `LOGIN_RATE_LIMIT_MAX` | Default 10 per 15 minutes |
| `AUTH_RATE_LIMIT_MAX` | Default 20 per 15 minutes |
| `ARGON2_MEMORY_COST`, `ARGON2_TIME_COST`, `ARGON2_PARALLELISM` | Defaults 19456, 2, 1 |
| `EMAIL_PROVIDER` | `console`, `smtp`, `none` |
| `EMAIL_FROM` | Sender identity |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` | Required for SMTP |
| `ALLOW_SUPER_ADMIN_PROVISION` | Must be `true` for the provisioning script only |
| `SUPER_ADMIN_EMAIL`, `SUPER_ADMIN_NAME`, `SUPER_ADMIN_PASSWORD` | One-time provisioning inputs |
| `SUPER_ADMIN_FORCE` | Recovery-only override |

Local development currently uses `EMAIL_PROVIDER=console`, `COOKIE_SECURE=false`, `ALLOW_SUPER_ADMIN_PROVISION=false`, and a development database at `localhost:5432`.

---

## 10. Email status

| Item | Status | Detail |
| --- | --- | --- |
| Email abstraction | COMPLETED AND VERIFIED | `backend/src/services/email.js` supports `console`, `smtp`, `none` |
| Password reset email content and links | COMPLETED AND VERIFIED | HTML/text templates; links built from `FRONTEND_ORIGIN`; tokens HTML-escaped |
| Verification email content and links | COMPLETED AND VERIFIED | HTML/text templates; links built from `FRONTEND_ORIGIN` |
| Token non-disclosure in logs | COMPLETED AND VERIFIED | Console provider logs metadata only; audit confirms no tokens/links |
| Development preview links | COMPLETED AND VERIFIED | `devResetUrl` / `devVerificationUrl` only when non-production and SMTP is not configured |
| Production SMTP delivery | BLOCKED BY CONFIGURATION | No SMTP host/user/password available in this environment |
| Real inbox delivery test | BLOCKED BY CONFIGURATION | Requires SMTP credentials and a controlled recipient |

To complete this item: set `EMAIL_PROVIDER=smtp` with valid `SMTP_*` values and a verified `EMAIL_FROM`, then test registration verification and password reset end to end. Application code and templates are complete.

---

## 11. Test evidence

### 11.1 Backend integration tests

Command:

```bash
cd backend
npm test
```

Observed:

```
Test Files  2 passed (2)
     Tests  33 passed (33)
```

Coverage includes:

- Registration restrictions and validation.
- Login success/failure, inactive accounts, cookie issuance.
- Access token authentication and `/me`.
- Refresh rotation, replay detection, and session-wide revocation.
- Logout and logout-all.
- Password change and session invalidation.
- Forgot/reset password token lifecycle.
- Email verification and resend, including deferred customer linkage.
- Customer-record takeover prevention.
- Role and permission enforcement across business modules.
- Customer ownership isolation for records and orders.
- Admin user management restrictions and last-SUPER_ADMIN protection.
- CSRF and origin enforcement where exercised by the suite.

Tests run against a real PostgreSQL test database created and migrated by `backend/scripts/prepare-test-db.js`. The script refuses databases whose name does not contain `test`.

### 11.2 Frontend tests

Command:

```bash
npm test
```

Observed:

```
Test Files  4 passed (4)
     Tests  14 passed (14)
```

Coverage includes:

- API client credentials, CSRF header, single-flight refresh, retry, and auth-expiry event.
- AuthContext bootstrap, login/logout state, and role helpers.
- Protected/guest/role route behavior.
- Login form behavior and error handling.

### 11.3 Live API smoke suite

Command:

```bash
cd backend
npm run smoke:auth
```

Observed:

```
93/93 checks passed
```

The suite runs against the live Fastify server and development database. It covers registration, verification, login, cookie and CSRF behavior, refresh rotation and replay, logout/logout-all, password reset, role restrictions, protected business APIs, customer isolation, and admin routes.

### 11.4 Browser end-to-end

Command (both servers running):

```bash
npm run test:e2e
```

Observed:

```
20/20 checks passed
```

The suite drives headless Chrome over CDP and verifies:

- Signup and email verification through the development link.
- Login and authenticated navigation.
- HttpOnly auth cookies.
- No auth tokens in `localStorage` or `sessionStorage`.
- Protected-route redirects for unauthenticated users.
- Role-based redirection away from the staff dashboard for customer sessions.
- Logout and post-logout protection.

Chrome path defaults to the standard Windows installation; override with `CHROME_PATH`.

### 11.5 Provisioning verification

Manually verified:

- Script refuses to run without `ALLOW_SUPER_ADMIN_PROVISION=true`.
- Script refuses weak or missing credentials.
- Script refuses a second SUPER_ADMIN without `SUPER_ADMIN_FORCE=true`.
- Script creates/promotes the account and revokes existing sessions.
- Script never prints the password.

---

## 12. Build verification

Command:

```bash
npm run build
```

Observed: webpack production build compiled successfully. Three performance warnings were emitted about asset/bundle size (approximately 558 KiB). There were no build errors.

Output: `dist/` with `index.html` and content-hashed JS/assets.

---

## 13. Deployment documentation

| Document | Status | Contents |
| --- | --- | --- |
| `README.md` | COMPLETED AND VERIFIED | Architecture, setup, roles, APIs, routes, testing, build, limitations |
| `DEPLOYMENT.md` | COMPLETED AND VERIFIED | PostgreSQL, env vars, migrations, provisioning, SMTP, Nginx/systemd examples, cookie/CORS rules, security checklist, monitoring, troubleshooting |
| `backend/.env.example` | COMPLETED AND VERIFIED | Complete environment template with safety notes |
| `backend/POSTGRESQL_SETUP.md` | COMPLETED AND VERIFIED | Local PostgreSQL setup notes |
| External production deployment | BLOCKED BY CONFIGURATION | No target infrastructure, domain, TLS, or credentials provided |

---

## 14. Limitations and blocked items

### BLOCKED BY CONFIGURATION

1. **Real email delivery.** Local configuration uses the non-delivering console provider. SMTP host, user, password, and a verified sender domain are required. Reset and verification token flows are complete and tested through development preview links.
2. **Production deployment.** No production host, domain, TLS certificate, database, or secret store was provided. The deployment runbook is complete, but no external environment was provisioned by this work.

### NOT IMPLEMENTED (out of scope)

1. OAuth, SSO, social login, and MFA.
2. Payment processing. Pricing and orders are records; no gateway is integrated.
3. Background job queue for email. Delivery is inline; suitable for moderate volume.
4. Shared/distributed rate-limit store. The limiter is in-process; horizontally scaled deployments should add edge limiting or Redis.
5. Automated privacy-policy/terms content. The routes render the existing not-found placeholder.

### Operational notes

- `ProjectInquiry` is the orders table. This name is retained for compatibility with existing business APIs.
- Demonstration seed data is included and should be reviewed or replaced for a real production launch.
- Order updates do not accept `customerId` or `serviceId`; those relations are create-only in the current API contract.
- The frontend permission mirror affects navigation only. It is not a security boundary.
- `REACT_APP_API_URL` is a public build-time value, not a secret.

---

## 15. Run commands

### Local development

```bash
# Install
npm install
cd backend && npm install && cd ..

# Database (once)
createdb -U postgres growthverse_dev
createdb -U postgres growthverse_test

# Configure
cd backend
cp .env.example .env
# edit DATABASE_URL, TEST_DATABASE_URL, ACCESS_TOKEN_SECRET

# Migrate and seed
npm run db:migrate
npm run db:seed

# Provision the first administrator
ALLOW_SUPER_ADMIN_PROVISION=true \
SUPER_ADMIN_EMAIL=admin@example.com \
SUPER_ADMIN_NAME="GrowthVerse Admin" \
SUPER_ADMIN_PASSWORD="<strong-password>" \
npm run admin:provision

# Terminal 1: API
npm run dev

# Terminal 2: frontend (repository root)
npm start
```

### Verification

```bash
# Backend integration tests (isolated test DB)
cd backend && npm test

# Frontend tests (repository root)
npm test

# Live smoke suite (backend running)
cd backend && npm run smoke:auth

# Browser E2E (both servers running)
npm run test:e2e

# Production build
npm run build
```

### Useful backend scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` / `npm start` | Start Fastify |
| `npm test` | Prepare test DB and run Vitest |
| `npm run smoke:auth` | Live API smoke suite |
| `npm run db:migrate` | Apply committed migrations |
| `npm run db:seed` | Seed demonstration data |
| `npm run db:reset` | Reset database (destructive) |
| `npm run admin:provision` | Guarded SUPER_ADMIN provisioning |

---

## 16. Primary files

### Backend

- `backend/src/app.js` — application assembly, health endpoint, logging redaction
- `backend/src/config/env.js` — validated configuration and production safeguards
- `backend/src/lib/password.js` — Argon2id hashing and password policy
- `backend/src/lib/tokens.js` — random tokens, hashing, timing-safe comparison
- `backend/src/lib/permissions.js` — authoritative RBAC matrix
- `backend/src/plugins/auth.js` — authentication and authorization decorators
- `backend/src/plugins/security.js` — CORS, Helmet, rate limiting, Origin checks, CSRF
- `backend/src/services/auth.service.js` — cookies, JWT issuance, refresh sessions, replay
- `backend/src/services/email.js` — email providers and templates
- `backend/src/routes/auth/index.js` — auth endpoints and token lifecycles
- `backend/src/routes/admin/users.js` — SUPER_ADMIN user management
- `backend/src/routes/modules/*` — protected business APIs
- `backend/prisma/schema.prisma` — auth and business schema
- `backend/prisma/migrations/20261115000000_init_auth_and_business/migration.sql`
- `backend/tests/auth.test.js`, `backend/tests/authorization.test.js`
- `backend/scripts/provision-super-admin.js`, `backend/scripts/smoke-auth.js`
- `backend/scripts/prepare-test-db.js`

### Frontend

- `src/api/client.js`, `src/api/auth.api.js`, `src/api/resources.api.js`
- `src/context/AuthContext.jsx`, `src/context/DataContext.jsx`
- `src/components/auth/ProtectedRoute.jsx` (includes `GuestRoute`), `RoleGuard.jsx`, `index.js`
- `src/hooks/useAuth.js`
- `src/utils/permissions.js`
- `src/pages/auth/*`, `src/pages/account/Account.jsx`, `src/pages/dashboard/*`
- `src/App.jsx`, `src/layouts/AuthLayout.jsx`, `src/layouts/DashboardLayout.jsx`
- `src/components/navigation/Navbar.jsx`
- `src/test/setup.js`, `vitest.config.mjs`

### Tooling and documentation

- `scripts/browser-e2e.mjs`
- `README.md`, `DEPLOYMENT.md`, `FINAL_DELIVERY_REPORT.md`
- `webpack.config.js` (dev proxy and API URL define)
- `package.json`, `backend/package.json`, `backend/.env.example`

---

## 17. Conclusion

All required authentication, authorization, and security functionality is implemented and verified locally against real HTTP, a real PostgreSQL database, and a real browser. The only outstanding items are environmental: SMTP credentials for real email delivery and target infrastructure for production deployment. Both are documented as **BLOCKED BY CONFIGURATION** with complete runbooks in [DEPLOYMENT.md](DEPLOYMENT.md).
