# GrowthVerse

**Build Digital. Grow Business.**

GrowthVerse is a full-stack digital agency website and business operations dashboard. The public site presents services, pricing, features, portfolio, technologies, and contact options. The authenticated area provides customer accounts and a staff dashboard for managing content, enquiries, customers, orders, users, and settings.

The application is no longer frontend-only. It runs on a React 18 frontend and a Fastify + PostgreSQL + Prisma backend with cookie-based authentication, centralized role-based authorization, and automated tests.

**Version:** 1.0.0  
**License:** MIT  
**Repository:** https://github.com/Aashu31/Growthverse

---

## Table of contents

- [Status](#status)
- [Architecture](#architecture)
- [Repository layout](#repository-layout)
- [Quick start](#quick-start)
- [Environment configuration](#environment-configuration)
- [Roles and permissions](#roles-and-permissions)
- [Authentication and security model](#authentication-and-security-model)
- [API reference](#api-reference)
- [Frontend routes](#frontend-routes)
- [Testing](#testing)
- [Production build](#production-build)
- [Deployment](#deployment)
- [Known limitations](#known-limitations)
- [Documentation](#documentation)

---

## Status

| Area | Status |
| --- | --- |
| Backend authentication, sessions, password reset, email verification | COMPLETED AND VERIFIED |
| Centralized RBAC and business API protection | COMPLETED AND VERIFIED |
| React auth UX, route guards, account and session management | COMPLETED AND VERIFIED |
| Automated backend, frontend, smoke, and browser E2E tests | COMPLETED AND VERIFIED |
| Production webpack build | COMPLETED AND VERIFIED |
| Real email delivery (SMTP) | BLOCKED BY CONFIGURATION |
| Production infrastructure deployment | BLOCKED BY CONFIGURATION |

The authoritative, evidence-backed delivery report is [FINAL_DELIVERY_REPORT.md](FINAL_DELIVERY_REPORT.md). Deployment instructions are in [DEPLOYMENT.md](DEPLOYMENT.md).

---

## Architecture

```
Browser
  |  HttpOnly cookies (gv_at, gv_rt), CSRF cookie (gv_csrf)
  v
React 18 SPA (webpack dev server :3000, production static files)
  |  /api (same-origin in dev via proxy; configurable in production)
  v
Fastify 5 API (:5000)
  |  security plugin: CORS allowlist, Helmet, rate limiting,
  |                   Origin/Referer checks, CSRF double-submit
  |  auth plugin: JWT verification, role/permission guards
  v
Prisma 5 ORM
  v
PostgreSQL
```

- **Frontend:** React 18, React Router 6, Context API, Tailwind CSS, Framer Motion, Recharts, webpack 5, Babel.
- **Backend:** Node.js, Fastify 5, Prisma 5, PostgreSQL, Argon2id, `@fastify/jwt`, Zod validation, Nodemailer.
- **Auth transport:** short-lived access JWT in an HttpOnly cookie, rotating opaque refresh token in an HttpOnly cookie, CSRF double-submit token. No tokens are stored in `localStorage` or `sessionStorage`.
- **Authorization:** one centralized permission matrix on the backend. The frontend mirrors it only to hide or show navigation and routes; every API enforces access independently.

### Authentication flow

1. `POST /api/auth/login` verifies the Argon2id password hash, creates a `RefreshSession` row, sets `gv_at`, `gv_rt`, and `gv_csrf` cookies.
2. The SPA calls authenticated APIs with `credentials: "include"`. For state-changing requests it sends `X-CSRF-Token` from the readable `gv_csrf` cookie.
3. On `401`, the API client calls `POST /api/auth/refresh` once. The server rotates the refresh token atomically, revokes the previous session, and issues a new access token.
4. Reuse of an already-rotated refresh token is treated as replay: every session for that user is revoked and cookies are cleared.
5. Logout revokes the current refresh session. Logout-all revokes every session for the user. Password changes revoke all other sessions.

### Data model

Auth models: `User`, `RefreshSession`, `PasswordResetToken`, `EmailVerificationToken`.

Business models: `Service`, `PricingPlan`, `Feature`, `Contact`, `ProjectInquiry` (orders), `Customer`, `PortfolioProject`, `SiteSetting`.

`Customer.userId` is the only ownership link between an account and a customer record. New signups receive their own customer row; an existing staff-created customer record with the same email is attached only after email verification. Ownership never falls back to matching by email, which prevents unverified signups from claiming existing customer data.

The baseline migration is `backend/prisma/migrations/20261115000000_init_auth_and_business`.

---

## Repository layout

```
.
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.js
│   ├── scripts/
│   │   ├── prepare-test-db.js
│   │   ├── provision-super-admin.js
│   │   └── smoke-auth.js
│   ├── src/
│   │   ├── app.js
│   │   ├── config/env.js
│   │   ├── lib/                 # password, tokens, http helpers, permissions
│   │   ├── plugins/             # auth, security, error handling
│   │   ├── routes/
│   │   │   ├── auth/
│   │   │   ├── admin/users.js
│   │   │   └── modules/         # services, pricing, features, portfolio,
│   │   │                        # contacts, customers, orders, dashboard, settings
│   │   └── services/            # auth.service, email
│   └── tests/                   # Vitest API/integration tests
├── src/
│   ├── api/                     # fetch client, auth API, resource API
│   ├── components/auth/         # ProtectedRoute, GuestRoute, RoleGuard
│   ├── context/                 # AuthContext, DataContext
│   ├── pages/
│   │   ├── auth/                # login, signup, forgot, reset, verify
│   │   ├── account/             # profile, password, sessions, orders
│   │   └── dashboard/           # staff management pages
│   ├── utils/permissions.js     # frontend mirror of backend permissions
│   └── App.jsx
├── scripts/browser-e2e.mjs      # headless Chrome end-to-end checks
├── DEPLOYMENT.md
└── FINAL_DELIVERY_REPORT.md
```

---

## Quick start

### Prerequisites

- Node.js 22 or newer (developed and verified on Node 26; the backend runtime requires Node 20+)
- npm 10 or newer
- PostgreSQL 14 or newer, running locally or reachable over the network

### 1. Install dependencies

```bash
npm install
cd backend
npm install
cd ..
```

### 2. Create the databases

```bash
createdb -U postgres growthverse_dev
createdb -U postgres growthverse_test
```

Using Docker instead:

```bash
docker run --name growthverse-postgres \
  -e POSTGRES_PASSWORD="<choose-a-strong-password>" \
  -e POSTGRES_DB=growthverse_dev \
  -p 5432:5432 -d postgres:16
```

Create `growthverse_test` as well. The backend test runner creates the test database automatically if the configured PostgreSQL user has `CREATEDB`, but it never touches the development database.

### 3. Configure the backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your real `DATABASE_URL`, `TEST_DATABASE_URL`, and a random `ACCESS_TOKEN_SECRET`. Generate a secret with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

See [Environment configuration](#environment-configuration) for every variable.

### 4. Apply migrations and seed demonstration data

```bash
cd backend
npm run db:migrate
npm run db:seed
```

### 5. Provision the first SUPER_ADMIN

There is no default administrator password and no public admin registration. Provision the first administrator explicitly:

```bash
cd backend
ALLOW_SUPER_ADMIN_PROVISION=true \
SUPER_ADMIN_EMAIL=admin@example.com \
SUPER_ADMIN_NAME="GrowthVerse Admin" \
SUPER_ADMIN_PASSWORD="<strong-unique-password>" \
npm run admin:provision
```

On Windows PowerShell:

```powershell
$env:ALLOW_SUPER_ADMIN_PROVISION="true"
$env:SUPER_ADMIN_EMAIL="admin@example.com"
$env:SUPER_ADMIN_NAME="GrowthVerse Admin"
$env:SUPER_ADMIN_PASSWORD="<strong-unique-password>"
npm run admin:provision
```

The script refuses to run without the explicit flag, refuses to create a second SUPER_ADMIN without `SUPER_ADMIN_FORCE=true`, and never prints the password. Remove `SUPER_ADMIN_PASSWORD` from the environment after provisioning.

### 6. Run the backend

```bash
cd backend
npm run dev
```

- API: http://localhost:5000
- Health: http://localhost:5000/api/health

The health response reports database connectivity:

```json
{
  "success": true,
  "status": "ok",
  "environment": "development",
  "database": "connected"
}
```

### 7. Run the frontend

In a second terminal, from the repository root:

```bash
npm start
```

Open http://localhost:3000. The webpack dev server proxies `/api` to `http://localhost:5000`, so cookies remain same-origin during development.

---

## Environment configuration

All backend variables live in `backend/.env`. A documented template is in `backend/.env.example`.

| Variable | Purpose | Notes |
| --- | --- | --- |
| `NODE_ENV` | Runtime mode | `development`, `test`, or `production` |
| `PORT`, `HOST` | API bind address | Default `5000` / `0.0.0.0` |
| `BACKEND_ORIGIN` | Public backend origin | Used when constructing links |
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `TEST_DATABASE_URL` | Isolated test database | Name must contain `test` |
| `FRONTEND_ORIGIN` / `CORS_ORIGIN` | Comma-separated origin allowlist | Exact origins; credentials require it |
| `ACCESS_TOKEN_SECRET` | JWT signing secret | Required in production, minimum 32 chars |
| `ACCESS_TOKEN_EXPIRY` | Access token lifetime | Default `15m` |
| `REFRESH_TOKEN_EXPIRY_MS` | Refresh session lifetime | Default 7 days |
| `PASSWORD_RESET_EXPIRY_MS` | Reset token lifetime | Default 30 minutes |
| `EMAIL_VERIFICATION_EXPIRY_MS` | Verification token lifetime | Default 24 hours |
| `COOKIE_DOMAIN` | Optional cookie domain | Leave empty for host-only cookies |
| `COOKIE_SECURE` | Secure cookie flag | Must be `true` in production |
| `COOKIE_SAME_SITE` | `lax`, `strict`, or `none` | `none` requires `COOKIE_SECURE=true` |
| `RATE_LIMIT_MAX`, `RATE_LIMIT_TIME` | Global rate limit | Default 300 per minute |
| `LOGIN_RATE_LIMIT_MAX` | Login attempts per 15 minutes | Default 10 |
| `AUTH_RATE_LIMIT_MAX` | Other auth endpoints per 15 minutes | Default 20 |
| `EMAIL_PROVIDER` | `console`, `smtp`, or `none` | `console` does not deliver email |
| `EMAIL_FROM` | Sender address | Required for SMTP |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` | SMTP transport | Required when `EMAIL_PROVIDER=smtp` |
| `ARGON2_MEMORY_COST`, `ARGON2_TIME_COST`, `ARGON2_PARALLELISM` | Argon2id parameters | OWASP baseline defaults |
| `ALLOW_SUPER_ADMIN_PROVISION` | Guards the provisioning script | Keep `false` outside provisioning |
| `SUPER_ADMIN_EMAIL`, `SUPER_ADMIN_NAME`, `SUPER_ADMIN_PASSWORD`, `SUPER_ADMIN_FORCE` | Provisioning inputs | Script-only; never used by an API |
| `TRUST_PROXY` | Trust reverse proxy headers | Enable only behind a trusted proxy |
| `LOG_LEVEL` | Fastify log level | `info` in production |

Production startup fails fast if `DATABASE_URL`, `ACCESS_TOKEN_SECRET`, or cookie settings are unsafe.

Frontend configuration:

- Development uses `/api` with the webpack proxy. No frontend env var is required.
- Production can set `REACT_APP_API_URL` at build time if the API is served from a different origin. Prefer same-origin reverse proxying so cookies remain first-party.

---

## Roles and permissions

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

Role rules:

- Public registration always creates `CUSTOMER`. Requesting any other role is rejected.
- Only `SUPER_ADMIN` can list users, change roles, or change account status.
- The last active `SUPER_ADMIN` cannot be demoted or deactivated.
- Role or status changes revoke the target user's sessions immediately.
- Customers can read only their own customer record and their own orders.
- Public content reads expose published/active records only. Enquiries, customers, orders, dashboard metrics, user records, and settings writes require authentication and the appropriate permission.

The authoritative matrix is `backend/src/lib/permissions.js`. `src/utils/permissions.js` mirrors it for UI only.

---

## Authentication and security model

- **Password hashing:** Argon2id with configurable memory, time, and parallelism. Password policy requires length and character variety; maximum length is enforced to prevent hashing abuse.
- **Access tokens:** signed JWTs, 15-minute default lifetime, HttpOnly cookie `gv_at` scoped to `/api`.
- **Refresh tokens:** opaque 256-bit random values in the form `<sessionId>.<secret>`. Only a SHA-256 hash is stored in `refresh_sessions`. Cookie `gv_rt` is scoped to `/api/auth`.
- **Refresh rotation:** each refresh creates a new session and atomically revokes the previous one. Concurrent reuse revokes the entire session family.
- **Revocation:** logout, logout-all, password change, admin role/status changes, and account suspension all invalidate refresh sessions.
- **Cookies:** `HttpOnly`, `SameSite=Lax` by default, `Secure` in production, optional domain. Access and refresh cookies are path-scoped.
- **CSRF:** double-submit cookie. State-changing requests with auth cookies must send `X-CSRF-Token` matching the `gv_csrf` cookie. Origin/Referer allowlisting is enforced as well.
- **Rate limiting:** global limit plus stricter login and auth-endpoint windows. Responses are rate-limited per IP.
- **Enumeration resistance:** login failures and forgot-password responses do not reveal whether an account exists. A dummy Argon2 verification runs for unknown emails.
- **Reset and verification tokens:** random values, stored as hashes, single-use, expiring. Requesting a new token marks prior unused tokens used.
- **Admin provisioning:** environment-driven, script-only, explicit opt-in, no default password, and no API surface.
- **Logging hygiene:** cookies, authorization headers, passwords, and tokens are redacted from Fastify logs.
- **Headers and CORS:** Helmet security headers, exact-origin CORS with credentials, restricted methods and headers.
- **Email link exposure:** in non-production without a configured email provider, reset and verification responses include `devResetUrl` / `devVerificationUrl`. Production never returns these, and the console email provider never logs tokens.

---

## API reference

All responses use `{ success, message?, data?, errors? }`. Protected endpoints authenticate from the `gv_at` HttpOnly cookie. Non-browser API clients may alternatively send the access token as `Authorization: Bearer <token>`; the SPA never stores tokens in Web Storage. State-changing authenticated requests require `X-CSRF-Token` when auth cookies are present.

### Authentication — `/api/auth`

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| POST | `/register` | Public | Create a CUSTOMER account; sends verification email |
| POST | `/login` | Public | Verify credentials and create a session |
| GET | `/me` | Authenticated | Current user and role; the SPA derives permissions from the role and fetches the linked customer record separately |
| PATCH | `/me` | Authenticated | Update own name, phone, avatar |
| POST | `/refresh` | Refresh cookie | Rotate refresh token and issue a new access token |
| POST | `/logout` | Public (refresh cookie) | Revoke current session and clear cookies |
| POST | `/logout-all` | Authenticated | Revoke every session for the user |
| POST | `/change-password` | Authenticated | Change password; revoke other sessions |
| POST | `/forgot-password` | Public, rate-limited | Request a reset link (generic response) |
| POST | `/reset-password` | Public, rate-limited | Consume reset token and set a new password |
| POST | `/verify-email` | Public, rate-limited | Consume verification token; link customer record |
| POST | `/resend-verification` | Public, rate-limited | Re-send verification email (generic response) |
| GET | `/csrf` | Public | Ensure a CSRF cookie exists |
| GET | `/sessions` | Authenticated | List active refresh sessions |
| DELETE | `/sessions/:id` | Authenticated | Revoke one of the current user's sessions |

### Administration — `/api/admin`

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/users` | SUPER_ADMIN | Paginated, filterable user list |
| GET | `/users/:id` | SUPER_ADMIN | User detail |
| PATCH | `/users/:id` | SUPER_ADMIN | Change name, role, or status |
| GET | `/roles` | SUPER_ADMIN | Role list with permissions |

### Business modules

| Module | Public reads | Protected operations |
| --- | --- | --- |
| `/api/services` | `GET /`, `GET /:slug` (published only) | Create/update/delete: `content.manage` |
| `/api/pricing` | `GET /`, `GET /website-development`, `GET /maintenance`, `GET /:id` (active only) | Create/update/status/delete: `content.manage` |
| `/api/features` | `GET /`, `GET /:id` (active only) | Create/update/delete: `content.manage` |
| `/api/portfolio` | `GET /`, `GET /:slug` (published only) | Create/update/delete: `content.manage` |
| `/api/contacts` | `POST /` (website enquiry) | List/detail: `contacts.view`; update/status/delete: `contacts.manage` |
| `/api/customers` | None | `GET /me` for own linked record; list/detail: `customers.view`; create/update/delete: `customers.manage` |
| `/api/orders` | None | Authenticated; CUSTOMER can read only their own orders; staff access by `orders.view` / `orders.manage`; creation, edits, and deletion require `orders.manage` |
| `/api/dashboard` | None | `dashboard.view` |
| `/api/settings` | `GET /` returns non-sensitive public settings | `PUT /` requires `settings.manage` (SUPER_ADMIN) |

`/api/health` is public and reports process status plus database connectivity.

---

## Frontend routes

| Route | Access | Description |
| --- | --- | --- |
| `/`, `/about`, `/services`, `/services/:slug`, `/features`, `/technologies`, `/pricing`, `/portfolio`, `/portfolio/:slug`, `/sarthi`, `/contact` | Public | Marketing website |
| `/login`, `/signup`, `/forgot-password` | Guest only | Redirects authenticated users |
| `/reset-password`, `/verify-email` | Public token pages | Reachable while signed in |
| `/account` | Any authenticated user | Profile, password, sessions, customer record and orders |
| `/dashboard` | STAFF, ADMIN, SUPER_ADMIN | Dashboard overview |
| `/dashboard/services`, `pricing`, `features`, `portfolio` | STAFF+ read; ADMIN+ write | Content management |
| `/dashboard/orders`, `contacts` | STAFF+ | Enquiry and order operations |
| `/dashboard/customers` | STAFF+ read; ADMIN+ write | Customer records |
| `/dashboard/profile` | STAFF+ | Company profile via settings API |
| `/dashboard/settings` | ADMIN+ | Account and security settings |
| `/dashboard/users` | SUPER_ADMIN | User and role management |
| `/forbidden` | Public | Rendered for insufficient permissions |

Unauthenticated visits to protected routes redirect to `/login` with a return path. Guest-only routes redirect authenticated users to their appropriate landing area.

---

## Testing

All commands are real automated tests. No mocks substitute for database-backed authorization checks on the backend.

### Backend

```bash
cd backend
npm test
```

- Creates or reuses `TEST_DATABASE_URL` after verifying the database name contains `test`.
- Applies migrations to the isolated test database.
- Runs Vitest integration tests against a real Fastify app and real PostgreSQL.
- Covers registration, login, cookies, CSRF, refresh rotation and replay, logout, logout-all, password reset, email verification, role restrictions, ownership isolation, and customer-record takeover defense.
- **Last verified result:** 33 tests passed in 2 files.

### Frontend

```bash
npm test
```

- Vitest + React Testing Library + jsdom.
- Covers the API client (credentials, CSRF, single-flight refresh, auth-expiry event), AuthContext, route guards, and login behavior.
- **Last verified result:** 14 tests passed in 4 files.

### Live API smoke suite

With the backend running and seeded:

```bash
cd backend
npm run smoke:auth
```

- Exercises the real HTTP surface end to end, including cookies, CSRF, RBAC, replay detection, reset and verification flows, and business endpoint protection.
- **Last verified result:** 93 checks passed.

### Browser end-to-end

With both servers running:

```bash
npm run test:e2e
```

- Drives headless Chrome over the DevTools protocol.
- Covers signup, email verification, login, cookie flags, absence of tokens in Web Storage, protected-route redirects, role-based dashboard redirects, and logout.
- Set `CHROME_PATH` if Chrome is not in the default location.
- **Last verified result:** 20 checks passed.

Test notes:

- The frontend test scripts pass `--no-experimental-webstorage` to Node because Node 26 exposes a global Web Storage implementation that otherwise shadows jsdom. A small jsdom storage polyfill in `src/test/setup.js` keeps tests deterministic.
- Smoke and E2E runs may raise `LOGIN_RATE_LIMIT_MAX` and `AUTH_RATE_LIMIT_MAX` for the local run. Production defaults remain strict.

---

## Production build

```bash
npm run build
```

The output is written to `dist/` with hashed asset filenames and a generated `index.html`.

**Last verified result:** compiled successfully with three webpack performance warnings (bundle size). No build errors.

Serve `dist/` behind a reverse proxy that:

- serves SPA history fallback to `index.html`,
- proxies `/api` to Fastify,
- preserves the original `Host`, `X-Forwarded-Proto`, and client IP headers,
- terminates TLS.

See [DEPLOYMENT.md](DEPLOYMENT.md) for a complete production checklist.

---

## Deployment

The short version:

1. Provision PostgreSQL and create a dedicated database and user.
2. Set production environment variables, including a strong `ACCESS_TOKEN_SECRET`, `COOKIE_SECURE=true`, exact `FRONTEND_ORIGIN`, and SMTP credentials.
3. Run `npm run db:migrate` and `npm run db:seed` (or seed selectively).
4. Provision the first SUPER_ADMIN with the guarded script, then remove its password from the environment.
5. Build the frontend with `npm run build`.
6. Run the API with `NODE_ENV=production npm start` under a process manager.
7. Put both behind one HTTPS origin (or configure CORS and cookie domain carefully).
8. Verify `/api/health`, login, refresh, logout, password reset, and email verification.

Full instructions, reverse proxy examples, security checklist, monitoring, backup, and troubleshooting are in [DEPLOYMENT.md](DEPLOYMENT.md).

---

## Known limitations

- **Email delivery is not configured locally.** `EMAIL_PROVIDER=console` does not send messages. Real password reset and verification emails require SMTP credentials. This is a configuration gap, not missing application code.
- **No production deployment has been performed.** No target infrastructure, domains, or credentials were provided. Deployment steps are documented and locally verified.
- **No payment processing.** Pricing and orders are operational records; no payment gateway is integrated.
- **Orders use the `ProjectInquiry` model.** The table and API are functional and protected, but the internal model name reflects the original schema.
- **No OAuth, SSO, or MFA.** Email/password authentication with session management is implemented.
- **Rate limiting is in-process.** Multi-instance deployments should use a shared rate-limit store (for example Redis) or enforce limits at the edge.
- **No background job queue.** Emails are sent inline during the request. For high volume, move delivery to a queue.
- **Demonstration seed data is included.** Replace or remove it before exposing a production site.

---

## Documentation

- [DEPLOYMENT.md](DEPLOYMENT.md) — production setup, environment, reverse proxy, security checklist, operations.
- [FINAL_DELIVERY_REPORT.md](FINAL_DELIVERY_REPORT.md) — authoritative implementation and verification report with status labels.
- [backend/POSTGRESQL_SETUP.md](backend/POSTGRESQL_SETUP.md) — local PostgreSQL notes.
- [backend/.env.example](backend/.env.example) — complete environment template.

---

## License

MIT License. See [LICENSE](LICENSE).

Copyright © 2026 GrowthVerse.
