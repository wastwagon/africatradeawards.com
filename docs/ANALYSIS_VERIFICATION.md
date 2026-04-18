# Analysis document vs current platform — verification log

This file records automated checks and code-level evidence against the “Current Website Analysis” rubric (lifecycle: public site, roles, submissions, admin, judging, results, notifications, UX). It is **not** a full manual QA sign-off.

**Run date (automated):** 2026-04-12  
**Environment:** local dev on port **3003** (`package.json` → `next dev -p 3003`); Next loads **`.env.local`** when present (gitignored).

---

## 1. Environment smoke (automated)

| Check | Result | Notes |
|-------|--------|--------|
| Postgres / Prisma | **Pass** | `npx prisma migrate status` with `DATABASE_URL` → `127.0.0.1:5433`: schema up to date (14 migrations). |
| HTTP smoke script | **Pass** | `node scripts/smoke-critical-http.mjs --base-url http://127.0.0.1:3003 --timeout-ms 120000` — all checks passed (home, contact, live, vote, public-config, health, contact honeypot). Requires dev server listening. |
| Redis | **Not verified** | App uses Redis for rate limits, etc. **`npm run test:e2e` failed** because `scripts/reset-e2e-rate-limits.mjs` could not connect (`ECONNREFUSED`). Start Redis (e.g. `docker compose -f docker-compose.dev.yml up -d redis`) before E2E. |

---

## 2. Rubric matrix (sections 5–13) — code + smoke evidence

Legend: **Pass** = implemented and smoke or API surface exists; **Partial** = env-dependent, subset of doc, or manual UI still needed; **Fail** = not found.

| Analysis area | Result | Evidence |
|----------------|--------|----------|
| **1–3** Brand / pages / positioning | **Pass** | Marketing routes under `app/` (home, about, awards-structure, awardees, gallery, publications, faq, sponsors-partners, contact, etc.). Smoke: `/` 200. |
| **Improvement §1–2** Login & submissions | **Pass** | Login: `app/login/page.tsx`, `app/api/auth/login/route.ts`. Public nominate: `app/nominate/page.tsx`, `app/api/nominations/public/route.ts`. Entrant portal: `app/portal/entrant/page.tsx`, `app/api/entries/`. |
| **§3** File uploads | **Partial** | `app/api/uploads/entry-files` — verify entrant UI exposes upload for your workflow. |
| **§4–5** Judging & admin | **Pass** | Judge: `app/portal/judge/page.tsx`, `app/api/judging/*`. Admin: `app/admin/*`, guard `app/admin/layout.tsx`. |
| **§6–7** Email & results / voting | **Partial** | Email: SMTP-driven (`/.env.example`); not exercised here. Voting: `app/vote/page.tsx`, `app/api/voting/*`; smoke `/vote` 200. |
| **5 Public website** | **Pass** | Routes listed above + blog, event, live, pricing-plan, etc. (`glob app/**/page.tsx`). |
| **6 User roles** | **Pass** (impl.) | `prisma/schema.prisma` → `UserRole`: `SUPER_ADMIN`, `PROGRAM_MANAGER`, `AUDITOR`, `JUDGE`, `ENTRANT`. No separate `NOMINATOR` enum; nominator UX is `app/portal/nominator/`. |
| **7 Submission system** | **Partial** | Entries/nominations, statuses (`EntryStatus`, `NominationStatus`), programs/seasons/categories — **manual** confirmation of every field and “save and continue” UX. |
| **8 Admin dashboard** | **Pass** (surface) | `app/admin/entries`, `nominations`, `exports`, `voting`, `users`, `programs`, etc. |
| **9 Judging** | **Partial** | APIs + judge portal present; multi-stage/recusal — confirm against real program config. |
| **10 Results** | **Partial** | `EntryStatus` includes SHORTLISTED/WINNER; public awardees/publications pages — align content with ops. |
| **11 Notifications** | **Partial** | Broadcast worker, nodemailer flows — **N/A** locally without SMTP; optional Redis for queues. |
| **12 User flow** | **Partial** | E2E `tests/e2e/nomination-lifecycle.spec.ts` covers admin + impersonation + public nomination API when Redis reset works. Full lifecycle in browser is manual. |
| **13 Design / UX** | **Partial** | Responsive/header: `components/layout/header/Header1.tsx`, `MobileMenu.tsx` — spot-check devices manually. |

---

## 3. Role routing and access (code review)

| Role | Default dashboard (`lib/role-access.ts`) | Middleware (`middleware.ts`) |
|------|------------------------------------------|--------------------------------|
| `SUPER_ADMIN` / `PROGRAM_MANAGER` / `AUDITOR` | `/admin/` | `/admin/*` requires session; non-staff redirected to role default. |
| `JUDGE` | `/portal/judge/` | `/portal/judge/*` requires `JUDGE` or higher rank. |
| `ENTRANT` | `/portal/nominator/` | `/portal/entrant`, `/portal/nominator` require `ENTRANT+`. |

**Logout:** `components/auth/LogoutButton.tsx` (header + mobile + admin sidebar).

Manual sign-in tests for each role remain recommended once test accounts exist.

---

## 4. Optional enhancements (section 14)

| Item | Result | Notes |
|------|--------|--------|
| Multi-language | **Not implemented** | No `next-intl` / i18n routing found in dependencies or source grep. |
| Multi-currency | **Not implemented** | No currency/payment libs in `package.json`. |
| Public voting | **Pass** | `app/vote/`, `app/api/voting/*` (smoke `/vote` 200). |
| Analytics dashboard | **Not verified** | No first-party analytics module identified in quick scan; may be external only. |
| AI-assisted scoring | **Not implemented** | No OpenAI / ML scoring integration found. |
| Payment integration | **Not implemented** | No Stripe/PayPal in `package.json` grep. |

---

## 5. How to re-run

```bash
# Terminal 1: DB (+ Redis if running E2E)
docker compose -f docker-compose.dev.yml up -d postgres redis

# Terminal 2: app
npm run dev

# Terminal 3: smoke (long timeout on cold compile)
node scripts/smoke-critical-http.mjs --base-url http://127.0.0.1:3003 --timeout-ms 120000

# E2E (requires Redis for rate-limit reset script)
npm run test:e2e
```

---

## 6. Follow-ups

1. Run **`npm run test:e2e`** with **Redis** available to validate Playwright coverage.  
2. Complete **manual** walkthrough of entrant/judge/staff UIs against section 7–12.  
3. Configure **SMTP** in `.env.local` to test notification paths.
