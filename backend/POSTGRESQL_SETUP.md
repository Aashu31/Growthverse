# PostgreSQL Setup for GrowthVerse

The backend requires PostgreSQL 14 or newer. The canonical setup, environment reference, and production guidance are in:

- [../README.md](../README.md) — local quick start
- [../DEPLOYMENT.md](../DEPLOYMENT.md) — production database, backups, and migration runbook

## Local options

### Option A: local PostgreSQL installation

1. Install PostgreSQL from https://www.postgresql.org/download/
2. Start the service.
3. Create the databases:

```bash
createdb -U postgres growthverse_dev
createdb -U postgres growthverse_test
```

### Option B: Docker

```bash
docker run --name growthverse-postgres \
  -e POSTGRES_PASSWORD="<choose-a-strong-password>" \
  -e POSTGRES_DB=growthverse_dev \
  -p 5432:5432 -d postgres:16
```

Create `growthverse_test` as well. Never commit real database passwords.

## Configuration

Set `DATABASE_URL` and `TEST_DATABASE_URL` in `backend/.env`, based on `backend/.env.example`:

```dotenv
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/growthverse_dev
TEST_DATABASE_URL=postgresql://<user>:<password>@localhost:5432/growthverse_test
```

The test runner refuses to use a database whose name does not contain `test`. It creates the test database when possible and applies migrations. It never migrates or modifies the development/production database.

URL-encode special characters in passwords, or use a connection string from your secret store.

## Migrations and seed data

From `backend/`:

```bash
npm run db:migrate    # apply committed migrations (prisma migrate deploy)
npm run db:seed       # optional demonstration content
npm run db:reset      # destructive: reset and re-apply migrations
```

Do not use `prisma migrate dev` against a shared or production database. The committed baseline is:

`prisma/migrations/20261115000000_init_auth_and_business/`

## Verification

```bash
psql "$DATABASE_URL" -c "SELECT 1;"
curl http://localhost:5000/api/health
```

Expected health response:

```json
{
  "success": true,
  "status": "ok",
  "environment": "development",
  "database": "connected"
}
```

## Port and host

If PostgreSQL uses a non-default port, update both database URLs. If the API must bind differently, set `HOST` and `PORT` in `backend/.env`. Behind a reverse proxy, bind the API to loopback and enable `TRUST_PROXY` only when the proxy sanitizes forwarded headers.

## Backups and production

Production deployment requires a dedicated non-superuser application role, restricted network access, encrypted backups, and tested restores. See [../DEPLOYMENT.md](../DEPLOYMENT.md) for commands and the security checklist.
