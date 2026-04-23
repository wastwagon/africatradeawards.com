# Contributing & local setup

This repo is the full-stack **Africa Trade Awards** platform (Next.js, Prisma, PostgreSQL, Redis). Follow this guide so your environment matches production and **database changes ship safely** (additive migrations, no accidental resets).

## Prerequisites

- **Git** and **GitHub** access (invite from the repo owner).
- **Docker Desktop** (or compatible engine) for Postgres + Redis (and optionally the whole app).
- **Node.js 20.x** and **npm** (see `Dockerfile` / CI; Node 18 may work but 20 is the team standard).

## Clone

```bash
git clone <your-org>/AfricaTradeAwards.git
cd AfricaTradeAwards
npm install
```

Never commit secrets. Use root `.env` locally (gitignored). Start from **`.env.example`** or **`.env.docker.example`**.

---

## Option A — Recommended: full stack in Docker (one command)

Runs **Postgres**, **Redis**, **Next.js dev server**, and the **worker** with bind mounts (edit code on the host; hot reload in the container).

```bash
# Optional: compose variable overrides (ports, secrets)
cp .env.docker.example .env

docker compose -f docker-compose.dev.yml up --build
```

- **App:** [http://localhost:3003](http://localhost:3003) (override with `WEB_PUBLISH_PORT` in `.env`).
- **Postgres (from your host):** `localhost:5433` by default (`POSTGRES_PUBLISH_PORT`).
- **Redis:** `localhost:6380` by default (`REDIS_PUBLISH_PORT`).

The web container entrypoint runs:

1. `npx prisma generate`
2. **`npx prisma migrate deploy`** — applies existing migrations to your local DB (same family of command as production; does **not** reset data).
3. `npm run sass:build` then `next dev` + sass watch.

**CMS data after migrations:** `migrate deploy` does **not** run `prisma db seed`. If a migration adds CMS columns or you need default/backfill content (for example long-form publication HTML), run **`npm run prisma:seed`** against the same database. To replace stored publication `body` values with the canonical HTML from the repo for every slug in `CMS_PUBLICATION_SEED` (overwrites that field even when non-empty), use **`npm run prisma:seed:sync-canonical`**.

**New migration from schema changes (on the host, with DB reachable):**

```bash
npx prisma migrate dev --name describe_your_change
```

Commit the new files under `prisma/migrations/`. Use **`migrate dev`** only against **local** databases, never production.

**Optional demo data:**

```bash
npx prisma db seed
```

**Inspect data:** `npx prisma studio` (set `DATABASE_URL` to match how you connect—see below).

### Docker troubleshooting

- **Compose file name:** This project uses **`docker-compose.dev.yml`**, not a generic `docker compose up` without `-f` (unless you add a default symlink yourself).
- **Stale Next cache:** `npm run compose:dev:clean` or `rm -rf .next && docker compose -f docker-compose.dev.yml restart web`
- **Docs in compose file:** See comments at the top of `docker-compose.dev.yml`.

---

## Option B — Next.js on the host, Postgres + Redis in Docker

Useful if you prefer running `npm run dev` directly on your machine.

1. Start only dependencies:

   ```bash
   docker compose -f docker-compose.dev.yml up -d postgres redis
   ```

2. Copy **`.env.example`** → `.env` and adjust if your published ports differ.

3. Install and run:

   ```bash
   npm install
   npm run sass:build
   npx prisma migrate dev
   npm run prisma:seed
   npm run dev
   ```

4. Open [http://localhost:3003](http://localhost:3003).

**Prisma Studio from the host:** ensure `DATABASE_URL` in `.env` uses `127.0.0.1` and the **published** Postgres port (default **5433**), not `postgres:5432` (that hostname only resolves inside Docker).

---

## Git workflow & deployments

- Work on a **feature branch**; open a **pull request** to `main` (or the branch your team uses for release).
- **Include Prisma migration files** in the same PR as `schema.prisma` changes.
- **Do not** run `prisma migrate dev` or `prisma db push` against production.
- **Do not** commit `.env` files with real production secrets.

### Production / Coolify (summary)

- Compose file in Coolify must be **`docker-compose.coolify.yml`** (not root **`docker-compose.yml`**, which is web-only). In the Coolify UI, set **Docker Compose Location** to `docker-compose.coolify.yml`. See **`COOLIFY_FULLSTACK_SETUP.md`**.
- The **`app`** service starts with: `npx prisma migrate deploy && npm run start` — this **applies pending migrations** to the production database. It **adds** schema changes; it does **not** wipe the database by itself. (Coolify fullstack uses default Next output via [`Dockerfile.fullstack`](Dockerfile.fullstack), not `output: "standalone"`.)
- **CMS seed:** that startup path does **not** run `db seed`. Run **`npm run prisma:seed`** as a one-off or scheduled job when you need idempotent CMS defaults or empty-field backfills. Use **`npm run prisma:seed:sync-canonical`** only when you intentionally want to overwrite canonical publication HTML from the repo.
- **Destructive migrations** (drops, destructive alters, data-deleting scripts) can still cause data loss—review migrations in PRs and coordinate backups when needed.

Environment variables for production are documented in **`.env.coolify.example`**.

---

## Quality checks before you push

```bash
npm run lint
npm run typecheck
```

Playwright E2E (see `README.md` for env vars):

```bash
npm run test:e2e
```

HTTP smoke (optional):

```bash
npm run smoke:http -- --base-url http://127.0.0.1:3003
```

---

## Where to get help

- **Architecture / features / doc map:** `docs/PROJECT_OVERVIEW.md`.
- **Manual QA (commands, demo accounts, voting flags, role URLs):** `docs/MANUAL_QA_GUIDE.md`.
- **Docker / local:** comments in `docker-compose.dev.yml`, this file, `.env.docker.example`.
- **Coolify / VPS:** `COOLIFY_FULLSTACK_SETUP.md` and Coolify build logs.
- **Schema / migrations:** `prisma/schema.prisma` and `prisma/migrations/`.
