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

- Node.js 18.x or higher
- npm or yarn

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

3. Compile SCSS to CSS:
```bash
npm run sass
```

## 🏃 Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

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

The static files will be generated in the `out` directory.

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
3. Run database migrations on deploy (`npm run prisma:migrate:deploy`)

### Manual Deployment

1. Provision PostgreSQL and Redis
2. Configure required environment variables
3. Run `npm run build && npm run start`

### Legacy: Render

The `render.yaml` file is kept for reference but is no longer the primary deployment method.

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

This is a private project. For access or contributions, please contact the repository owner.
