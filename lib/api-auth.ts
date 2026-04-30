import { cookies } from "next/headers";
import { UserRole } from "@prisma/client";
import { getSessionCookieName, verifySessionToken, type SessionUser } from "@/lib/jwt-session";
import { hasRoleAtLeast, isAuditorRole } from "@/lib/rbac";

export { isAuditorRole };

export type RequestSessionUser = Omit<SessionUser, "role"> & { role: UserRole };

export async function getRequestSessionUser(): Promise<RequestSessionUser | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;

  if (!token) {
    return null;
  }

  try {
    const payload = await verifySessionToken(token);
    return { ...payload, role: payload.role as UserRole };
  } catch {
    return null;
  }
}

export async function requireRole(minRole: UserRole) {
  const user = await getRequestSessionUser();
  if (!user) {
    return { ok: false as const, status: 401, message: "Unauthorized" };
  }

  if (!hasRoleAtLeast(user.role, minRole)) {
    return { ok: false as const, status: 403, message: "Forbidden" };
  }

  return { ok: true as const, user };
}

/** Program managers, super admins, and read-only auditors (exports & analytics). */
export async function requireManagerOrAuditor() {
  const user = await getRequestSessionUser();
  if (!user) {
    return { ok: false as const, status: 401, message: "Unauthorized" };
  }
  if (user.role === UserRole.AUDITOR) {
    return { ok: true as const, user };
  }
  if (hasRoleAtLeast(user.role, UserRole.PROGRAM_MANAGER)) {
    return { ok: true as const, user };
  }
  return { ok: false as const, status: 403, message: "Forbidden" };
}

export async function requireSuperAdmin() {
  const user = await getRequestSessionUser();
  if (!user) {
    return { ok: false as const, status: 401, message: "Unauthorized" };
  }
  if (user.role !== UserRole.SUPER_ADMIN) {
    return { ok: false as const, status: 403, message: "Forbidden" };
  }
  return { ok: true as const, user };
}

export async function requireManager() {
  const user = await getRequestSessionUser();
  if (!user) {
    return { ok: false as const, status: 401, message: "Unauthorized" };
  }
  if (!hasRoleAtLeast(user.role, UserRole.PROGRAM_MANAGER)) {
    return { ok: false as const, status: 403, message: "Forbidden" };
  }
  return { ok: true as const, user };
}

/** Public voter dashboard — role must be exactly `VOTER` (do not use `requireRole` rank checks). */
export async function requireVoter() {
  const user = await getRequestSessionUser();
  if (!user) {
    return { ok: false as const, status: 401, message: "Unauthorized" };
  }
  if (user.role !== UserRole.VOTER) {
    return { ok: false as const, status: 403, message: "Forbidden" };
  }
  return { ok: true as const, user };
}
