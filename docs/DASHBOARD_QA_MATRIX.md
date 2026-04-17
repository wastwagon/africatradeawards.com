# Dashboard QA matrix

Use this when running **manual or scripted checks** on logged-in surfaces. For stack and architecture, see [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) and [CONTRIBUTING.md](../CONTRIBUTING.md).

**Source of truth:** admin labels and grouping come from [`app/admin/navigation.ts`](../app/admin/navigation.ts). Route guards come from [`middleware.ts`](../middleware.ts) and [`app/admin/layout.tsx`](../app/admin/layout.tsx).

## Role shorthand

| Prisma `UserRole` | Admin nav “audience” (navigation filter) |
|-------------------|-------------------------------------------|
| `AUDITOR` | `auditor` |
| `PROGRAM_MANAGER` | `manager` |
| `SUPER_ADMIN` | `super_admin` (treated like manager for nav, plus extra items) |

`SUPER_ADMIN` sees the same sidebar filter as `PROGRAM_MANAGER` **plus** nav items whose `audiences` include only `super_admin` (e.g. Staff users).

## Minimum role to open (middleware / layout)

| Path prefix | Must be logged in | Minimum role to proceed |
|-------------|-------------------|-------------------------|
| `/admin` | Yes | `AUDITOR` **or** `PROGRAM_MANAGER` (rank) or higher — see [`middleware.ts`](../middleware.ts) |
| `/portal/entrant` | Yes | `ENTRANT` or higher (rank) |
| `/portal/nominator` | Yes | `ENTRANT` or higher (rank) |
| `/portal/judge` | Yes | `JUDGE` or higher (rank) |
| `/vote` | No | Public (voting flows may still require verification tokens) |

## Admin pages (`/admin/*`)

Sidebar visibility follows `getAdminNavItems(role)` in [`app/admin/navigation.ts`](../app/admin/navigation.ts). “In sidebar” below means the item has `sidebar: true` for at least one role in that audience group.

| Path | Label (nav) | In sidebar for | Notes |
|------|-------------|----------------|-------|
| `/admin/` | Dashboard | Auditor, Manager, Super admin | KPIs / home |
| `/admin/site-content` | Site content | Manager, Super admin | |
| `/admin/contact-inquiries` | Contact inquiries | Manager, Super admin | |
| `/admin/programs` | Programs and categories | Manager, Super admin | |
| `/admin/entries` | Entries and judge assignment | Manager, Super admin | |
| `/admin/nominations` | Nominations review | Manager, Super admin | |
| `/admin/events` | Event operations | Manager, Super admin | |
| `/admin/events/checkin` | Check-in scanner desk | Manager, Super admin | |
| `/admin/events/badge` | Badge studio | Manager, Super admin | |
| `/admin/events/onsite` | Onsite analytics | Manager, Super admin | |
| `/admin/leaderboard` | Judging leaderboard | Auditor, Manager, Super admin | |
| `/admin/voting` | Public voting results | Auditor, Manager, Super admin | |
| `/admin/voting-fraud` | Voting fraud analytics | Auditor, Manager, Super admin | |
| `/admin/voting-quarantine` | Vote quarantine queue | Auditor, Manager, Super admin | |
| `/admin/certificates` | Winner certificates | Manager, Super admin | |
| `/admin/advanced` | Advanced workflow tools | Manager, Super admin | |
| `/admin/exports` | Data exports | Auditor, Manager, Super admin | |
| `/admin/users` | Staff users | Super admin only | |

## Admin dashboard / palette only (not in left sidebar)

These appear as **command palette** and/or **dashboard cards** for the audiences noted in `navigation.ts`; auditors may see cards where `dashboardCard: true` and `audiences` includes `auditor`.

| Path | Label | Typical use |
|------|-------|-------------|
| `/portal/entrant` | Entrant portal | Open entrant workspace from admin |
| `/portal/nominator` | Nominator portal | Open nominator workspace from admin |
| `/portal/judge` | Judge portal | Open judge workspace from admin |
| `/vote` | Public voting page | Smoke public voting UI |

## Portals (primary user dashboards)

| Path | Primary persona | APIs / data (high level) |
|------|-----------------|-------------------------|
| `/portal/entrant` | Entrant | Entries lifecycle; `app/api/entries/**`, portal metadata |
| `/portal/nominator` | Entrant (nominator) | Portal nominations; `app/api/nominations/**`, `/api/portal/metadata` |
| `/portal/judge` | Judge | Judging; `app/api/judging/**` |

## Paste your test checklist below

When you have named tests (e.g. “Programs CRUD”, “Quarantine approve”), add rows here or in your tracker. Suggested columns: **Test name**, **URL**, **Role**, **Expected**, **Status**.

```
(Test name) | (URL) | (Role) | (Expected) | (Pass/Fail/Skip)
```

## Automated coverage today

- Playwright: `npm run test:e2e` — see [`tests/e2e/`](../tests/e2e/) (e.g. nomination lifecycle uses APIs + admin session).
- HTTP smoke / ops scripts: see `package.json` scripts `smoke:http`, `ops:verify`.
