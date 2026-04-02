import { UserRole } from "@prisma/client";
import { defaultDashboardForRoleStr, resolvePostLoginStr } from "@/lib/role-access";

export function defaultDashboardPath(role: UserRole): string {
  return defaultDashboardForRoleStr(role);
}

/** After login: honor optional `next` when the user's role may access that path; otherwise role default. */
export function resolvePostLoginPath(role: UserRole, next: string | null | undefined): string {
  return resolvePostLoginStr(role, next);
}
