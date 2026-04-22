/**
 * String role checks without importing `@prisma/client` (safe for Edge middleware).
 * Keep in sync with `UserRole` in `prisma/schema.prisma` (including `VOTER`).
 */
const ROLE_RANK: Record<string, number> = {
  AUDITOR: 5,
  VOTER: 8,
  ENTRANT: 10,
  JUDGE: 30,
  PROGRAM_MANAGER: 40,
  SUPER_ADMIN: 50,
};

function roleRank(role: string): number {
  return ROLE_RANK[role] ?? 0;
}

export function hasRoleAtLeastStr(userRole: string, minimumRole: string): boolean {
  return roleRank(userRole) >= roleRank(minimumRole);
}

export function isAuditorStr(role: string): boolean {
  return role === "AUDITOR";
}

export function defaultDashboardForRoleStr(role: string): string {
  switch (role) {
    case "SUPER_ADMIN":
    case "PROGRAM_MANAGER":
    case "AUDITOR":
      return "/admin/";
    case "JUDGE":
      return "/portal/judge/";
    case "VOTER":
      return "/portal/voter/";
    case "ENTRANT":
      return "/portal/entrant/";
    default:
      return "/portal/nominator/";
  }
}

function isSafeRelativePath(path: string): boolean {
  if (!path.startsWith("/") || path.startsWith("//")) return false;
  if (path.includes("\0")) return false;
  return true;
}

/** Same rules as `resolvePostLoginPath` in `post-login-redirect.ts` — string roles only. */
export function resolvePostLoginStr(role: string, next: string | null | undefined): string {
  if (!next || !isSafeRelativePath(next)) {
    return defaultDashboardForRoleStr(role);
  }

  if (next.startsWith("/admin")) {
    if (isAuditorStr(role) || hasRoleAtLeastStr(role, "PROGRAM_MANAGER")) {
      return next;
    }
    return defaultDashboardForRoleStr(role);
  }

  if (next.startsWith("/portal/entrant")) {
    if (hasRoleAtLeastStr(role, "ENTRANT")) {
      return next;
    }
    return defaultDashboardForRoleStr(role);
  }

  if (next.startsWith("/portal/nominator")) {
    if (hasRoleAtLeastStr(role, "ENTRANT")) {
      return next;
    }
    return defaultDashboardForRoleStr(role);
  }

  if (next.startsWith("/portal/judge")) {
    if (hasRoleAtLeastStr(role, "JUDGE")) {
      return next;
    }
    return defaultDashboardForRoleStr(role);
  }

  if (next.startsWith("/portal/voter")) {
    if (role === "VOTER") {
      return next;
    }
    return defaultDashboardForRoleStr(role);
  }

  if (next.startsWith("/vote")) {
    return next;
  }

  return defaultDashboardForRoleStr(role);
}
