import { UserRole } from "@prisma/client";
import { hasRoleAtLeastStr, isAuditorStr } from "@/lib/role-access";

export function isAuditorRole(role: UserRole): boolean {
  return isAuditorStr(role);
}

/**
 * Rank is for `hasRoleAtLeast` only. AUDITOR is below ENTRANT so auditors are not treated as entrants/judges
 * via `requireRole(ENTRANT)` / `requireRole(JUDGE)`. Manager and auditor UI access uses `requireManagerOrAuditor`.
 */
export function hasRoleAtLeast(userRole: UserRole, minimumRole: UserRole): boolean {
  return hasRoleAtLeastStr(userRole, minimumRole);
}
