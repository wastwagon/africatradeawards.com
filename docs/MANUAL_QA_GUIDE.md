# Manual QA guide — commands, accounts, voting

Use this for browser-based checks (admin dashboards, portals, public voting). Full route matrix: [DASHBOARD_QA_MATRIX.md](./DASHBOARD_QA_MATRIX.md). Local setup details: [CONTRIBUTING.md](../CONTRIBUTING.md).

## Prerequisites

1. **Node 20.x** and **npm**; **Docker** for Postgres + Redis (or run the full stack in Docker).
2. **Clone and install:** `git clone …` then `npm install` in the repo root.
3. **Environment:** copy [`.env.example`](../.env.example) to **`.env`** (never commit `.env`). For Compose substitution when using Docker-only env files, see [`.env.docker.example`](../.env.docker.example).
4. **Connection strings:** default published ports from [CONTRIBUTING.md](../CONTRIBUTING.md) are Postgres **5433** and Redis **6380**. Ensure `DATABASE_URL` and `REDIS_URL` in `.env` use `127.0.0.1` and those ports when Next runs **on the host** (not the internal `postgres:5432` hostname, which only resolves inside Docker).

## Start the project

This repo uses **`docker-compose.dev.yml`** — do not assume `docker compose up` without `-f` unless your team adds a default file.

**Option A — Full stack in Docker (recommended):**

```bash
cp .env.docker.example .env   # optional: port overrides
docker compose -f docker-compose.dev.yml up --build
```

App: **http://localhost:3003** (or `WEB_PUBLISH_PORT` in `.env`).

**Option B — Next on the host, DB in Docker:**

```bash
docker compose -f docker-compose.dev.yml up -d postgres redis
cp .env.example .env
npm install
npm run sass:build
npx prisma migrate dev
npm run dev
```

Open **http://localhost:3003**. The `dev` script in [package.json](../package.json) binds port **3003**.

## Database and demo users

You need a **`.env`** file at the repo root with **`DATABASE_URL`** set (copy from [`.env.example`](../.env.example) before seeding). Prisma reads this for migrations and for `prisma db seed`.

After Postgres is up:

1. Apply migrations: `npx prisma migrate deploy` (or `npx prisma migrate dev` for local iteration only).
2. **Demo users (recommended for manual QA):** the seed only runs when `DEMO_SEED=true`:

   ```bash
   DEMO_SEED=true npx prisma db seed
   ```

   **PowerShell:**

   ```powershell
   $env:DEMO_SEED = "true"
   npx prisma db seed
   ```

   npm script shortcut: `npm run prisma:seed:demo` (cross-platform; uses [scripts/seed-demo.mjs](../scripts/seed-demo.mjs) so it works in Windows `cmd` / PowerShell, not only Unix shells).

There is **no public self-serve registration** for most roles; see [BOSS_FEEDBACK_VERIFICATION.md](./BOSS_FEEDBACK_VERIFICATION.md).

## How to get accounts (three paths)

### A — Demo seed (usual for QA)

Password for all demo users: **`Demo_Awards_2026!`**

| Role | Email |
|------|--------|
| SUPER_ADMIN | `super.demo@local.test`, `super.demo2@local.test` |
| PROGRAM_MANAGER | `manager.demo@local.test`, `manager.demo2@local.test` |
| AUDITOR | `auditor.demo@local.test`, `auditor.demo2@local.test` |
| JUDGE | `judge.demo@local.test`, `judge.demo2@local.test` |
| ENTRANT | `entrant.demo@local.test`, `entrant.demo2@local.test` |

Source: [prisma/seed.mjs](../prisma/seed.mjs). Log in at **`/login`**.

### B — Bootstrap first admin (empty database only)

Works only when the **user table has zero rows**. `POST /api/auth/bootstrap` with JSON body:

- `email`, `password` (minimum **10** characters), `fullName`
- `bootstrapSecret` must match **`BOOTSTRAP_ADMIN_SECRET`** in `.env`

Example (replace host and values):

```bash
curl -X POST http://127.0.0.1:3003/api/auth/bootstrap \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@example.com\",\"password\":\"your_password_here\",\"fullName\":\"Platform Admin\",\"bootstrapSecret\":\"dev-bootstrap-secret\"}"
```

Use the same secret as in `.env.example` only on local machines. See [COOLIFY_FULLSTACK_SETUP.md](../COOLIFY_FULLSTACK_SETUP.md) for production-style usage.

### C — Super admin creates users

Log in as a **Super admin** and open **`/admin/users`** to create judges, program managers, entrants, etc. API: [`POST /api/users`](../app/api/users/route.ts).

## Manual voting

1. Open **`/vote`** in the browser.
2. For **local testing**, [.env.example](../.env.example) sets:
   - `VOTING_REQUIRE_EMAIL_VERIFICATION=false`
   - `VOTING_REQUIRE_CHALLENGE=false`
   
   Adjust these in **`.env`**, restart the app, and retest if you need stricter behavior.
3. Voting-related salts (`VOTE_IP_SALT`, `VOTE_CODE_SALT`, `VOTE_TOKEN_SECRET`, `VOTE_FP_SALT`) must be set (placeholders are fine for dev); see `.env.example`.
4. **Admin verification (ops-style):** after votes exist, you can spot-check **`/admin/voting`**, **`/admin/voting-fraud`**, and **`/admin/voting-quarantine`** (role-gated like other admin routes).

## Where to click by role

- **Admin nav and role visibility:** [app/admin/navigation.ts](../app/admin/navigation.ts).
- **Portals:** `/portal/entrant`, `/portal/nominator`, `/portal/judge`.
- **Ordered walkthrough (Phases 1–5):** use your team’s Cursor plan *Ordered test walkthrough*; Phase 5 lists URLs step-by-step.
