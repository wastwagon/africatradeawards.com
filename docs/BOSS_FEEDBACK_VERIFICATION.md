# Boss feedback — verification (codebase vs claims)

This document maps the stakeholder gap analysis to the **current** repository, gives **Met / Partial / Not met**, and lists **how to verify** each item. Use it as evidence for status reports.

**Related:** [DASHBOARD_QA_MATRIX.md](./DASHBOARD_QA_MATRIX.md) (admin routes and roles), [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) (architecture).

---

## Environment snapshot (this verification run)

| Item | Result |
|------|--------|
| Postgres + Redis (Compose) | `docker compose -f docker-compose.dev.yml up -d postgres redis` — services running |
| Full stack `web` image | `docker compose ... up --build` **failed** at `Dockerfile.dev` → `npm ci` (exit 1; see build log). Host-based `npm run dev` is the fallback when the image build breaks. |
| App on port 3003 | **Assumed available** (existing process; `EADDRINUSE` when starting a second dev server). |
| SMTP | **Not configured** for this run (`SMTP_*` empty in `.env.example`). Email flows need SMTP for end-to-end delivery; code paths exist in [`lib/email.ts`](../lib/email.ts). |
| Demo data | `DEMO_SEED=true npx prisma db seed` — demo users (password `Demo_Awards_2026!`) per [`prisma/seed.mjs`](../prisma/seed.mjs). |
| HTTP smoke | `node scripts/smoke-critical-http.mjs --base-url http://127.0.0.1:3003` — **6/7** checks passed; **Contact API (honeypot)** aborted at 15s timeout (retry with higher `--timeout-ms` or investigate server stall). |

---

## Section 1 — “Critical gaps” vs codebase

| # | Boss claim | Verdict | Evidence / where to test |
|---|------------|---------|---------------------------|
| 1 | No login / registration | **Partial** | **Met:** [`/login`](../app/login/page.tsx), [`POST /api/auth/login`](../app/api/auth/login/route.ts), JWT cookie session. **Not met (self-serve):** no public sign-up; users created by **Super admin** ([`/admin/users`](../app/admin/users/page.tsx), [`POST /api/users`](../app/api/users/route.ts)) or **bootstrap** when DB has zero users ([`/api/auth/bootstrap`](../app/api/auth/bootstrap/route.ts)). |
| 2 | No online submission / nomination | **Met** | Public: [`/nominate`](../app/nominate/page.tsx), [`POST /api/nominations/public`](../app/api/nominations/public/route.ts). Logged-in: [`/portal/nominator`](../app/portal/nominator/page.tsx), entries [`/portal/entrant`](../app/portal/entrant/page.tsx), [`app/api/entries`](../app/api/entries/route.ts). |
| 3 | No document upload | **Partial** | **Met:** [`POST /api/uploads/entry-files`](../app/api/uploads/entry-files/route.ts) — PDF, DOC/DOCX, PNG/JPEG. **Not met:** video uploads (not in allowlist). |
| 4 | No judging / scoring | **Met** | [`Score` / `JudgingStage`](../prisma/schema.prisma), [`/portal/judge`](../app/portal/judge/page.tsx), [`app/api/judging/*`](../app/api/judging/), admin [`/admin/leaderboard`](../app/admin/leaderboard/page.tsx). |
| 5 | No admin dashboard | **Met** | [`app/admin/*`](../app/admin/), nav [`app/admin/navigation.ts`](../app/admin/navigation.ts). |
| 6 | No automated communication | **Partial** | **Met (code):** [`lib/email.ts`](../lib/email.ts) — nomination emails, voting verification, manager alerts, broadcast BCC, onsite alerts; queue [`app/api/communications/broadcast`](../app/api/communications/broadcast/route.ts). **Requires:** configured SMTP; optional worker for queued jobs. |
| 7 | No results / ranking | **Met** | Public voting UI [`/vote`](../app/vote), APIs under [`app/api/voting/`](../app/api/voting/), admin [`/admin/voting`](../app/admin/voting/page.tsx), results route [`app/api/voting/results`](../app/api/voting/results/route.ts). “Automatic shortlist” is product-specific; statuses exist (`SHORTLISTED`, etc. in Prisma). |

**Summary for leadership:** The platform is **not** a static-only site in this repo; the main **product gaps** vs a consumer-style SaaS are **public self-registration**, **payment integration** (not present), and **video** uploads. Stakeholder copy may still describe the **legacy** public site if production deploy lags this codebase.

### Explicit gaps (boss doc vs implementation)

| Topic | Status |
|-------|--------|
| Public self-registration | **Not met** |
| Payment (optional in boss doc) | **Not met** |
| Video file upload | **Not met** |
| All public pages exactly as boss named | **Partial** — routes exist under Next.js App Router; names may differ (e.g. “Categories” → `/awards-structure`); confirm with product. |

---

## Sections 4–5 — Public website checklist

Manual: open each URL (expect 200), confirm primary CTA or content, resize to mobile.

| Boss item | Route(s) |
|-----------|----------|
| Homepage, sponsors | `/` |
| About | `/about` |
| Categories / criteria | `/awards-structure` (confirm with product) |
| Application / nomination | `/nominate`, `/portal/entrant` (auth) |
| Judges (profiles) | `/speakers`, `/speakers-single` — confirm IA |
| Gallery, past winners | `/gallery`, `/awardees`, `/publications` |
| Sponsors / partners | `/sponsors-partners` |
| Contact | `/contact` → admin [`/admin/contact-inquiries`](../app/admin/contact-inquiries/page.tsx) |

---

## Section 6 — Roles

Implemented: `SUPER_ADMIN`, `PROGRAM_MANAGER`, `AUDITOR`, `JUDGE`, `ENTRANT` in [`prisma/schema.prisma`](../prisma/schema.prisma); gates in [`middleware.ts`](../middleware.ts). Boss doc’s “Admin / Entrant / Judge” maps to these; add **Program manager** and **Auditor** in stakeholder docs.

**Demo logins (after `DEMO_SEED=true prisma db seed`):** e.g. `super.demo@local.test`, `manager.demo@local.test`, `judge.demo@local.test`, `entrant.demo@local.test` — password `Demo_Awards_2026!`.

---

## Sections 7–12 — Lifecycle verification

| Step | Verify |
|------|--------|
| Registration | Admin creates user **or** bootstrap; document gap if self-serve sign-up is required. |
| Submission + save draft | Entrant portal: create draft entry, reload, submit. |
| Multiple categories | Create entries in different categories (same entrant). |
| Status tracking | Portal status + [`/api/entries/[entryId]/status`](../app/api/entries/[entryId]/status/route.ts). |
| Payment | **Not implemented** — N/A until product decision. |
| Admin review | `/admin/nominations`, `/admin/entries`. |
| Judging | Assign judges (admin entries); score as judge; leaderboard. |
| Results / publish | Voting + admin results; public awardees/publications content. |
| Notifications | With SMTP: nomination submit, voting code; `/admin/advanced` broadcast. |

---

## Section 13 — Design / UX

Subjective; quick checks: responsive breakpoints on `/`, `/nominate`, `/login`, `/admin/`, `/portal/entrant`.

---

## Playwright regression (automated)

Run when `http://127.0.0.1:3003` is up and DB is migrated + demo-seeded:

```powershell
$env:E2E_BASE_URL='http://127.0.0.1:3003'
$env:E2E_ADMIN_EMAIL='super.demo@local.test'
$env:E2E_ADMIN_PASSWORD='Demo_Awards_2026!'
npm run test:e2e
```

Default README credentials (`admin@local.test`) apply only if that user exists; **demo seed uses `super.demo@local.test`**.

### Playwright run log (2026-04-16, this workspace)

| Command | Result |
|---------|--------|
| `npm run test:e2e` (default `E2E_ADMIN_EMAIL`) | **5 failed** — Chromium not installed (`npx playwright install` required). |
| `npx playwright install chromium` | **Succeeded** (exit 0) after full browser download. |
| `npx playwright test --workers=1` with `E2E_ADMIN_EMAIL=super.demo@local.test`, `E2E_ADMIN_PASSWORD=Demo_Awards_2026!`, `E2E_BASE_URL=http://127.0.0.1:3003` | **5 failed** — **30s timeouts** on `page.goto("/")`, `page.goto("/live")`, and `page.request.post` to API routes (login, users, nominations). Likely causes: Next dev server on `:3003` busy or not matching the DB used for seeding; confirm one healthy app instance before re-running. |

**Tip:** After `DEMO_SEED=true prisma db seed`, use **super.demo@local.test** / **Demo_Awards_2026!** (not only `admin@local.test` from README unless that user was created).

**Tip:** Run Playwright only after `npx playwright install chromium` completes; avoid overlapping `install` with `test` (Windows may report `spawn EBUSY` on the browser binary).

