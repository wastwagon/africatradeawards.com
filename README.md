# Africa Trade Awards 2026

Official digital platform for the Africa Trade Awards 2026, covering the public website plus entrant, judging, voting, event operations, and admin workflows.

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: SCSS/SASS, Bootstrap
- **Backend/Data**: Prisma ORM + PostgreSQL
- **Caching/Queues**: Redis + worker process
- **Authentication**: JWT session auth with role-based access

## 📋 Prerequisites

- **Node.js 20.x** (recommended; matches Docker/CI)
- **npm**
- **Docker Desktop** (recommended for Postgres + Redis — see [CONTRIBUTING.md](./CONTRIBUTING.md))

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/wastwagon/africatradeawards.git
cd africatradeawards
```

2. Install dependencies:
```bash
npm install
```

3. Environment: copy **`.env.example`** → **`.env`** for host-based dev, or **`.env.docker.example`** → **`.env`** when using Docker Compose (see [CONTRIBUTING.md](./CONTRIBUTING.md)).

4. Compile SCSS to CSS (or use `npm run sass:build` once):
```bash
npm run sass:build
```

## 🏃 Development

**Recommended (Docker — app + Postgres + Redis + worker):**

```bash
docker compose -f docker-compose.dev.yml up --build
```

Open [http://localhost:3003](http://localhost:3003).

**Alternative — Next.js on the host:** start `postgres` + `redis` with the same compose file, then:

```bash
npx prisma migrate dev
npm run dev
```

Same URL: [http://localhost:3003](http://localhost:3003).

Full setup, Git workflow, and production DB safety notes: **[CONTRIBUTING.md](./CONTRIBUTING.md)**.

## ✅ End-to-End Tests (Playwright)

Critical flows now have Playwright coverage under `tests/e2e/`:

- nomination lifecycle (submit -> review -> convert)
- super-admin impersonation flow

Set admin credentials for E2E login (defaults shown):

```bash
export E2E_BASE_URL=http://127.0.0.1:3003
export E2E_ADMIN_EMAIL=admin@local.test
export E2E_ADMIN_PASSWORD=ChangeMe_Local_12345
```

Run tests:

```bash
npm run test:e2e
```

If browsers are not installed yet:

```bash
npx playwright install
```

CI is configured in `.github/workflows/e2e.yml` and runs this suite on pull requests and on pushes to `main`.
Fast feedback checks are configured in `.github/workflows/quick-checks.yml` (lint + typecheck).

## 🏗️ Building for Production

Build the application:

```bash
npm run build
```

Output depends on build mode: production uses the Next.js server bundle (see `Dockerfile`); static export is optional and not the default for this platform.

## 📦 Runtime Modes

This project supports two modes:

- **Fullstack server mode** (`STATIC_EXPORT=false`): required for API routes, admin, voting, judging, and event operations.
- **Static export mode** (`STATIC_EXPORT=true`): for limited brochure-style deployment only.

## 🌐 Deployment

### Coolify (Recommended Fullstack Deployment)

Use the fullstack deployment path documented in [COOLIFY_FULLSTACK_SETUP.md](./COOLIFY_FULLSTACK_SETUP.md).

**Quick Start:**
1. Configure environment variables from `.env.coolify.example`
2. Deploy with `docker-compose.coolify.yml`
3. Migrations: the **`app`** container runs `npx prisma migrate deploy` before `npm run start` (applies pending migrations without resetting data). You can also run `npm run prisma:migrate:deploy` manually when needed.

### Manual Deployment

1. Provision PostgreSQL and Redis
2. Configure required environment variables
3. Run `npm run build && npm run start`

### Legacy: Render

The `render.yaml` file is kept for reference but is no longer the primary deployment method.

## Architecture overview

Feature inventory, roles, data model summary, and documentation map: **[docs/PROJECT_OVERVIEW.md](./docs/PROJECT_OVERVIEW.md)**.

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
├── components/             # React components
│   ├── layout/            # Layout components (Header, Footer, etc.)
│   ├── sections/          # Page sections
│   └── elements/          # Reusable UI elements
├── public/                # Static assets
│   ├── assets/           # CSS, images, icons
│   └── img/              # Images
└── render.yaml           # Render deployment blueprint
```

## 🎨 Styling

- SCSS files are located in `public/assets/scss/`
- Compiled CSS is output to `public/assets/css/main.css`
- Run `npm run sass` to watch and compile SCSS changes

## 📝 Notes

- The current repository is a fullstack platform (not frontend-only).
- API routes, role-based access, and operational workflows are active.
- SCSS is compiled as part of build scripts before deployment.

## 📄 License

Private repository - All rights reserved.

## 🤝 Contributing

This is a private project. For access, contact the repository owner.

**Team onboarding** (Docker, Prisma, Git, Coolify, safe migrations): see **[CONTRIBUTING.md](./CONTRIBUTING.md)**.
