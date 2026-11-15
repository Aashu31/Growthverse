# GrowthVerse Deployment Guide

This guide describes a production deployment of the GrowthVerse React frontend and Fastify/PostgreSQL backend. It reflects the implementation in this repository and the local verification performed for the 1.0.0 delivery.

> **Deployment status:** the application has not been deployed to production infrastructure as part of this delivery because no target host, domain, TLS certificate, or credentials were provided. This guide is the complete runbook for doing so.

---

## 1. Deployment topology

The recommended topology is a **single public HTTPS origin**:

```
Internet
  │ HTTPS (443)
  ▼
Reverse proxy (Nginx / Caddy / managed load balancer)
  ├── /            → static frontend build (dist/)
  ├── /api/*       → Fastify (127.0.0.1:5000)
  └── TLS termination, gzip/brotli, security headers
                         │
                         ▼
                   PostgreSQL (private network)
```

Serving the SPA and API from the same origin keeps the authentication cookies first-party and avoids cross-site cookie restrictions. Only use separate origins when you can control DNS, TLS, CORS, and cookie domains end to end.

### Components

| Component | Requirement |
| --- | --- |
| Node.js | 22 LTS or newer for the full frontend/backend/test toolchain (backend runtime supports 20+; verified on Node 26) |
| npm | 10 or newer |
| PostgreSQL | 14 or newer (15/16 recommended) |
| Reverse proxy | Nginx, Caddy, or a managed equivalent with TLS |
| Process manager | systemd, PM2, Docker, or a platform runner |
| SMTP provider | Required for password reset and verification emails |

---

## 2. PostgreSQL setup

### 2.1 Create a dedicated database and user

Run as a PostgreSQL superuser:

```sql
CREATE ROLE growthverse_app WITH LOGIN PASSWORD '<strong-random-password>';
CREATE DATABASE growthverse_prod OWNER growthverse_app;
```

Keep the application user non-superuser. It needs ownership of the deployed database so Prisma migrations can create and alter tables.

For a separate test environment, create `growthverse_test` owned by a test-only user. The backend refuses to run tests unless the database name contains `test`.

### 2.2 Connection string

Use TLS in production when PostgreSQL is not on a private local network:

```
DATABASE_URL=postgresql://growthverse_app:<password>@db.internal:5432/growthverse_prod?sslmode=require
```

Use a URL-safe password (percent-encode special characters) or a connection string in your platform's secret store.

### 2.3 Migration and seed policy

Apply the committed migration:

```bash
cd backend
npm ci
npm run db:migrate       # prisma migrate deploy
```

`migrate deploy` applies committed migrations only. Do not run `prisma migrate dev` against production.

The demonstration seed is optional:

```bash
npm run db:seed
```

The seed inserts demonstration services, pricing, features, portfolio projects, contacts, customers, orders, and public settings. It is suitable for staging or a demo deployment. For a production site, either run it once and replace the content through the dashboard, or curate `backend/prisma/seed.js` before first run. It does **not** create user accounts or an administrator.

### 2.4 Verify the database

```bash
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM _prisma_migrations;"
curl -s https://app.example.com/api/health
```

The health response should report `"database": "connected"`.

### 2.5 Backups

- Take an automated nightly `pg_dump` and retain at least 14–30 days.
- Test restores regularly in a non-production database.
- Back up before every migration window.
- Encrypt backups at rest and restrict access; the database contains password hashes, emails, phone numbers, and business records.

Example:

```bash
pg_dump "$DATABASE_URL" --format=custom --file="growthverse-$(date +%F).dump"
pg_restore --clean --if-exists --dbname="$DATABASE_URL" growthverse-YYYY-MM-DD.dump
```

---

## 3. Environment configuration

Create `backend/.env` from `backend/.env.example` on the server, or inject the same variables through your platform's secret manager. File permissions should be `600` and the file must never be committed.

### 3.1 Required production values

```dotenv
NODE_ENV=production
PORT=5000
HOST=127.0.0.1
BACKEND_ORIGIN=https://app.example.com

DATABASE_URL=postgresql://growthverse_app:<password>@db.internal:5432/growthverse_prod

# Exact public frontend origin(s). Comma-separated. No trailing slash.
FRONTEND_ORIGIN=https://app.example.com
CORS_ORIGIN=https://app.example.com

# Generate with:
# node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
ACCESS_TOKEN_SECRET=<at-least-32-random-characters>

ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY_MS=604800000
PASSWORD_RESET_EXPIRY_MS=1800000
EMAIL_VERIFICATION_EXPIRY_MS=86400000

COOKIE_SECURE=true
COOKIE_SAME_SITE=lax
# COOKIE_DOMAIN=.example.com   # only if cookies must be shared across subdomains

RATE_LIMIT_MAX=300
RATE_LIMIT_TIME=1 minute
LOGIN_RATE_LIMIT_MAX=10
AUTH_RATE_LIMIT_MAX=20

EMAIL_PROVIDER=smtp
EMAIL_FROM=GrowthVerse <no-reply@example.com>
SMTP_HOST=smtp.provider.example
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=<smtp-user>
SMTP_PASS=<smtp-password>

ARGON2_MEMORY_COST=19456
ARGON2_TIME_COST=2
ARGON2_PARALLELISM=1

ALLOW_SUPER_ADMIN_PROVISION=false
TRUST_PROXY=true
LOG_LEVEL=info
```

### 3.2 Production safety behavior

The backend refuses to start in production when:

- `DATABASE_URL` is missing,
- `ACCESS_TOKEN_SECRET` is missing or shorter than 32 characters,
- `COOKIE_SAME_SITE` is not `lax`, `strict`, or `none`,
- `COOKIE_SAME_SITE=none` without `COOKIE_SECURE=true`.

Additional rules:

- If `EMAIL_PROVIDER=console` in production, the server logs a warning that email is not delivered. Set `smtp` before launching.
- `COOKIE_SECURE` defaults to `true` when `NODE_ENV=production`, but set it explicitly.
- Enable `TRUST_PROXY` only when requests actually arrive through a trusted reverse proxy that overwrites `X-Forwarded-*` headers.
- Keep `ALLOW_SUPER_ADMIN_PROVISION=false` except during an intentional provisioning run.

### 3.3 Frontend environment

Development uses the webpack proxy and `/api`. For a production build with a separate API origin:

```bash
REACT_APP_API_URL=https://api.example.com/api npm run build
```

If frontend and API share an origin, leave it unset so the build uses `/api`. Same-origin is strongly preferred.

The frontend does not need any secret. Never embed credentials in build variables; everything defined through `REACT_APP_*` is public.

---

## 4. Build and run

### 4.1 Install and build

```bash
npm ci
npm run build
cd backend
npm ci
```

### 4.2 Run the API

```bash
cd backend
NODE_ENV=production npm start
```

`npm start` runs `node src/app.js`. For a production process manager:

**systemd example** (`/etc/systemd/system/growthverse-api.service`):

```ini
[Unit]
Description=GrowthVerse API
After=network.target postgresql.service

[Service]
Type=simple
User=growthverse
WorkingDirectory=/srv/growthverse/backend
EnvironmentFile=/etc/growthverse/api.env
ExecStart=/usr/bin/node src/app.js
Restart=always
RestartSec=5
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/srv/growthverse/backend

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now growthverse-api
sudo systemctl status growthverse-api
```

**PM2 alternative:**

```bash
cd backend
pm2 start src/app.js --name growthverse-api --update-env
pm2 save
```

Run one process per CPU core only if rate limits and sessions can be shared appropriately. Session state is in PostgreSQL, so multiple API instances are safe. The rate limiter is in-process, so use edge rate limiting or a shared store when scaling horizontally.

### 4.3 Serve the frontend

Copy `dist/` to the web root. Configure SPA history fallback so deep links such as `/login`, `/account`, and `/dashboard` return `index.html`.

**Nginx example:**

```nginx
server {
    listen 443 ssl http2;
    server_name app.example.com;

    ssl_certificate     /etc/letsencrypt/live/app.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.example.com/privkey.pem;

    root /srv/growthverse/dist;
    index index.html;

    # Hashed assets can be cached indefinitely.
    location /assets/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
        try_files $uri =404;
    }

    location = /index.html {
        add_header Cache-Control "no-cache";
    }

    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 30s;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }

    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

    # Adjust to the assets and APIs your deployment actually uses.
    # add_header Content-Security-Policy "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'" always;
}
```

Redirect HTTP to HTTPS, enable HSTS only after confirming HTTPS works everywhere, and keep TLS certificates renewed automatically.

### 4.4 Verify the deployment

```bash
curl -fsS https://app.example.com/api/health
curl -fsSI https://app.example.com/ | head -20
```

Then, in a private browser window:

1. Register a new account and verify the email.
2. Sign in and confirm `gv_at`, `gv_rt`, and `gv_csrf` have `HttpOnly` (the first two) and `Secure` flags.
3. Refresh the page and confirm the session persists.
4. Visit `/dashboard` as a CUSTOMER and confirm a redirect or forbidden page.
5. Sign out and confirm protected pages redirect to `/login`.
6. Request a password reset and complete it from a real inbox.
7. Sign in as SUPER_ADMIN and verify `/api/dashboard` and `/dashboard/users` work.

---

## 5. First administrator provisioning

There is no default password and no public administrator registration.

Run once on the server, with the application environment loaded:

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
Remove-Item Env:SUPER_ADMIN_PASSWORD
```

Behavior:

- Refuses to run unless `ALLOW_SUPER_ADMIN_PROVISION=true`.
- Requires a valid email, a name of at least two characters, and a password meeting the policy.
- Refuses to create another SUPER_ADMIN when one already exists unless `SUPER_ADMIN_FORCE=true` is set.
- Promotes an existing account with the same email instead of creating a duplicate.
- Revokes all existing sessions for that account.
- Never prints the password.

After provisioning:

1. Set `ALLOW_SUPER_ADMIN_PROVISION=false` again.
2. Remove `SUPER_ADMIN_PASSWORD` and related variables from the environment and shell history.
3. Sign in and change the password through the account page.
4. Create additional staff accounts by promoting registered users from **Dashboard → Users & Roles**.

`SUPER_ADMIN_FORCE=true` is a recovery mechanism. Use it only when locked out, then rotate the password and disable the flag immediately.

---

## 6. Email delivery

Password reset and email verification require a real provider.

```dotenv
EMAIL_PROVIDER=smtp
EMAIL_FROM=GrowthVerse <no-reply@example.com>
SMTP_HOST=smtp.provider.example
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=<smtp-user>
SMTP_PASS=<smtp-password>
```

Notes:

- Port 587 typically uses STARTTLS (`SMTP_SECURE=false`); port 465 typically uses implicit TLS (`SMTP_SECURE=true`).
- Use provider-issued credentials, preferably scoped to sending only.
- Configure SPF, DKIM, and DMARC for the sending domain.
- `EMAIL_FROM` should use a domain you control.
- Links are built from `FRONTEND_ORIGIN`, so it must be the public HTTPS origin.
- Delivery failures are returned as non-fatal results and logged without message bodies or tokens.
- The `console` provider never logs tokens or links. Development-only preview URLs are returned in API responses only when `NODE_ENV` is not `production` and SMTP is not configured.
- To test: register a new address, request a reset, and confirm delivery and link behavior in a real inbox. Also confirm that tokens expire and cannot be reused.

If email is intentionally disabled, set `EMAIL_PROVIDER=none`. Users then cannot self-verify or reset passwords and must be supported manually.

---

## 7. Cookies, CORS, and reverse proxy rules

### Same-origin (recommended)

- `FRONTEND_ORIGIN=https://app.example.com`
- Cookies are host-only; leave `COOKIE_DOMAIN` empty.
- `COOKIE_SECURE=true`, `COOKIE_SAME_SITE=lax`.
- Proxy `/api` to Fastify.
- Set `TRUST_PROXY=true` only behind the proxy.

### Separate API origin

Only when necessary:

- `FRONTEND_ORIGIN=https://app.example.com` (exact, comma-separate additional origins).
- API served at `https://api.example.com`.
- Set `COOKIE_DOMAIN=.example.com` so cookies are shared.
- `COOKIE_SAME_SITE=none` and `COOKIE_SECURE=true` (browsers require both for cross-site cookies).
- Build the frontend with `REACT_APP_API_URL=https://api.example.com/api`.
- Ensure the reverse proxy forwards `Origin` unchanged and supports CORS preflight.
- Be aware that third-party cookie blocking can still affect some browsers. Same-origin avoids this class of failure.

### CSRF behavior

State-changing requests carrying auth cookies must include `X-CSRF-Token` matching the `gv_csrf` cookie. The browser client does this automatically. If you build another client:

1. Call `GET /api/auth/csrf` or any endpoint that sets the cookie.
2. Read the `gv_csrf` cookie.
3. Send it as `X-CSRF-Token`.

Requests with a disallowed `Origin` or `Referer` are rejected with `403 INVALID_ORIGIN`. Requests with auth cookies but missing or mismatched CSRF tokens are rejected with `403 CSRF_FAILED`.

### Proxy headers

The API uses client IPs for rate limiting and records session IP/user agent metadata. Ensure the proxy sets:

```
Host
X-Real-IP
X-Forwarded-For
X-Forwarded-Proto
```

and that untrusted clients cannot spoof them. `TRUST_PROXY=true` without a sanitizing proxy lets clients forge their IP.

---

## 8. Security checklist

Before going live:

- [ ] `NODE_ENV=production` and `ACCESS_TOKEN_SECRET` is unique, random, at least 32 characters, stored in a secret manager.
- [ ] `COOKIE_SECURE=true` and HTTPS is enforced; HTTP redirects to HTTPS.
- [ ] `COOKIE_SAME_SITE=lax` for same-origin, or `none` + `Secure` for cross-site.
- [ ] `FRONTEND_ORIGIN` and `CORS_ORIGIN` contain exact production origins only.
- [ ] Default PostgreSQL credentials are not used; the app role is not a superuser.
- [ ] Database is not publicly reachable; connections use TLS where appropriate.
- [ ] `ALLOW_SUPER_ADMIN_PROVISION=false` after provisioning.
- [ ] `SUPER_ADMIN_*` variables and the provisioning password are removed from the server environment.
- [ ] SMTP is configured and tested; `EMAIL_PROVIDER` is not `console`.
- [ ] SPF, DKIM, and DMARC are configured for the sending domain.
- [ ] No `.env` file, secret, or credential is committed to git.
- [ ] Demonstration seed content is reviewed or replaced.
- [ ] `npm test` passes in CI against an isolated test database.
- [ ] `npm run build` succeeds and `dist/` is deployed.
- [ ] Health checks, logs, error alerts, and uptime monitoring are active.
- [ ] Database backups are scheduled and a restore has been tested.
- [ ] Rate limits are appropriate for traffic; edge rate limiting is enabled if horizontally scaled.
- [ ] Security headers are present at the proxy; CSP is configured for actual asset/API origins.
- [ ] A privacy policy and terms page are published if required by your jurisdiction.
- [ ] Admin accounts use unique passwords and are reviewed regularly.
- [ ] Logout, logout-all, password change, reset, verification, and refresh rotation are manually verified in production.

Operational practices:

- Rotate `ACCESS_TOKEN_SECRET` during a maintenance window; all sessions are invalidated.
- Revoke sessions after any suspected compromise (logout-all or role/status change).
- Review `users` and `refresh_sessions` for unexpected accounts or active sessions.
- Keep Node.js, npm dependencies, PostgreSQL, and the reverse proxy patched.
- Never log cookies, authorization headers, passwords, or reset/verification tokens. The backend redacts these by default.

---

## 9. Monitoring and operations

### Health

- `GET /api/health` returns process status and database connectivity.
- Alert when the endpoint fails or reports `"database": "disconnected"`.
- Use a separate internal check for PostgreSQL and disk space.

### Logs

- Fastify logs at `LOG_LEVEL=info` in production.
- Sensitive headers and body fields are redacted.
- Ship logs to a central system with retention and access control.
- Alert on repeated `401`, `403 CSRF_FAILED`, `429`, and `500` responses.

### Metrics to watch

- Request rate, latency, and error rate per endpoint.
- Login failures and rate-limit hits.
- Refresh replay detections (`REFRESH_TOKEN_REUSE`).
- Database connections, slow queries, and storage growth.
- Email delivery failures.
- Process restarts and memory usage.

### Incident response

1. If sessions are compromised, rotate `ACCESS_TOKEN_SECRET` and revoke refresh sessions for affected users.
2. If an administrator account is compromised, demote or suspend it and provision a replacement SUPER_ADMIN via the guarded script.
3. Rotate database and SMTP credentials if exposure is suspected.
4. Preserve logs, identify affected accounts, and notify users as required.
5. Re-test login, refresh, reset, verification, and RBAC after recovery.

---

## 10. Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| `/api/health` reports `database: disconnected` | Wrong `DATABASE_URL`, database down, network/TLS issue | Check credentials, host, port, `sslmode`, and PostgreSQL status |
| API exits at startup with configuration errors | Missing/invalid production env | Read the error list; set `DATABASE_URL`, `ACCESS_TOKEN_SECRET`, cookie settings |
| Browser never receives auth cookies | API on another origin with `SameSite=Lax`, missing `Secure`, or blocked third-party cookies | Use same-origin, or `SameSite=None` + `Secure` + `COOKIE_DOMAIN` |
| `403 INVALID_ORIGIN` | Origin/Referer not in allowlist, or proxy strips/rewrites it | Add the exact origin to `FRONTEND_ORIGIN`; forward `Origin` unchanged |
| `403 CSRF_FAILED` | Missing `X-CSRF-Token` or stale cookie | Reload to refresh `gv_csrf`; ensure the client sends the header |
| `401` loop after login | Cookies blocked, wrong API base, clock skew | Check cookie flags, `REACT_APP_API_URL`, and server time |
| `429 Too Many Requests` | Rate limit reached | Wait, raise limits only if justified, or add edge protection |
| Password reset email never arrives | `EMAIL_PROVIDER=console/none`, bad SMTP credentials, spam filtering | Configure SMTP, check provider logs, SPF/DKIM/DMARC |
| Reset/verification link points to localhost | `FRONTEND_ORIGIN` is still the development value | Set it to the public HTTPS origin and restart |
| Deep links return 404 | SPA history fallback missing | Add `try_files $uri $uri/ /index.html` |
| Migrations fail | Database user lacks ownership/DDL rights | Grant ownership of the database to the app role |
| Admin script refuses to run | Provisioning flag not set, weak password, or an admin already exists | Set `ALLOW_SUPER_ADMIN_PROVISION=true`; use `SUPER_ADMIN_FORCE=true` only for recovery |
| CORS preflight fails | Methods/headers or origin mismatch | Keep the provided methods/headers; fix the allowlist |
| Sessions drop after deploy | `ACCESS_TOKEN_SECRET` changed or instance uses an ephemeral secret | Set a stable secret in the environment |

---

## 11. Deployment checklist

1. Provision PostgreSQL, database, and non-superuser role.
2. Store production secrets in the platform secret manager.
3. Install backend dependencies with `npm ci`.
4. Run `npm run db:migrate`.
5. Optionally seed demonstration content.
6. Provision the first SUPER_ADMIN and immediately disable provisioning.
7. Configure SMTP and send a test reset email.
8. Build the frontend with the correct `REACT_APP_API_URL` (or same-origin default).
9. Deploy `dist/` and configure SPA fallback plus `/api` proxying.
10. Enable HTTPS, HSTS, security headers, and HTTP→HTTPS redirects.
11. Start the API under a process manager with `NODE_ENV=production`.
12. Verify health, registration, verification, login, refresh, logout, reset, RBAC, and account pages.
13. Enable monitoring, alerting, and backups.
14. Record the deployed version and secret rotation schedule.

For the implementation status and verified test results, see [FINAL_DELIVERY_REPORT.md](FINAL_DELIVERY_REPORT.md). For local setup, see [README.md](README.md).
