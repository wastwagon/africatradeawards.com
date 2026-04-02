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

## 2) Deploy using compose

In Coolify, select Docker Compose deployment and use:

- Compose file: `docker-compose.coolify.yml`

Expose the `app` service and map your domain to it.

## 3) Notes

- `STATIC_EXPORT=false` is set in compose so Next.js runs server mode.
- Existing static deployment files are untouched; this is an additional fullstack path.
- Prisma schema is included in `prisma/schema.prisma`.
- Run migrations during deployment:
  - `npm run prisma:migrate:deploy`

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
