# Coolify Fullstack Setup

This setup runs:
- `app`: Next.js frontend + backend in one container
- `postgres`: database
- `redis`: cache/queue/session store
- `worker`: Redis queue consumer for broadcast jobs

## 1) Prepare environment

Use these variables in Coolify:

- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `DATABASE_URL`
- `REDIS_URL`
- `AUTH_JWT_SECRET`
- `BOOTSTRAP_ADMIN_SECRET`
- `VOTE_IP_SALT`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `VOTING_REQUIRE_EMAIL_VERIFICATION`
- `VOTE_CODE_SALT`
- `VOTE_TOKEN_SECRET`
- `VOTE_FP_SALT`
- `VOTING_REQUIRE_CHALLENGE`
- `PUBLIC_BASE_URL`

Reference: `.env.coolify.example`.

**Postgres “unhealthy” or deploy fails on `depends_on: service_healthy`:**

1. **Set `POSTGRES_PASSWORD` in Coolify** (required). The compose file defaults **`POSTGRES_USER`** / **`POSTGRES_DB`** if omitted (`africa_trade_user` / `africa_trade_awards`); the password has no default. **`DATABASE_URL`** in Coolify should use the **same** user, password, and database name (URL-encode special characters in the password).

2. **Stale data directory:** If an earlier deploy created the Postgres volume with wrong/empty env, Postgres may refuse to start. In Coolify, remove the project’s **postgres** volume (or delete persistent storage for this stack) and redeploy — **this wipes that environment’s DB**; only do this when safe.

3. **Inspect Postgres logs** in Coolify (select the `postgres` service / container), not only the `app` logs.

## 2) Deploy using compose

In Coolify, create an application with **Build Pack: Docker Compose**, then set:

| Field | Value |
|--------|--------|
| **Base directory** | `/` (repository root) |
| **Docker Compose Location** | `docker-compose.coolify.yml` |

Do **not** use the default `docker-compose.yml` for full stack: that file only runs the Next.js `web` container and does **not** include Postgres or Redis.

Map your domain / proxy to the **`app`** service (port **3003** inside the container). Coolify usually lets you choose which compose service receives public HTTP traffic.

## 3) Notes

- `STATIC_EXPORT=false` is set in compose so Next.js runs server mode.
- Existing static deployment files are untouched; this is an additional fullstack path.
- Prisma schema is included in `prisma/schema.prisma`.
- Migrations on deploy: the **`app`** service command runs `npx prisma migrate deploy` before starting Next.js (see `docker-compose.coolify.yml`). That applies **pending** migration files to Postgres and does **not** wipe the database by default. You can also run `npm run prisma:migrate:deploy` manually in a one-off container if needed.

## 4) Local test

```bash
docker compose -f docker-compose.coolify.yml --env-file .env.coolify.example up -d --build
```

## 5) Bootstrap admin user

After first deploy, create your first admin:

```bash
curl -X POST http://YOUR_DOMAIN/api/auth/bootstrap \
  -H "Content-Type: application/json" \
  -d '{
    "email":"admin@example.com",
    "password":"replace_with_strong_password",
    "fullName":"Platform Admin",
    "bootstrapSecret":"replace_with_bootstrap_secret"
  }'
```
