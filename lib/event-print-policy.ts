import { UserRole } from "@prisma/client";

export const MAX_REPRINTS_PER_DAY = 3;
export const MIN_REPRINT_INTERVAL_MS = 60 * 1000;
export const MIN_OVERRIDE_REASON_LENGTH = 12;

export function canBypassReprintPolicy(role: UserRole): boolean {
  return role === UserRole.SUPER_ADMIN;
}

export function canOverrideReprintPolicy(role: UserRole): boolean {
  return role === UserRole.PROGRAM_MANAGER || role === UserRole.SUPER_ADMIN;
}

export function requiresPolicyOverride(recentCount: number, lastPrintedAt: Date | null): boolean {
  if (recentCount >= MAX_REPRINTS_PER_DAY) return true;
  if (!lastPrintedAt) return false;
  return Date.now() - lastPrintedAt.getTime() < MIN_REPRINT_INTERVAL_MS;
}

export function normalizeOverrideReason(input: string | undefined): string | null {
  const reason = input?.trim();
  if (!reason) return null;
  return reason;
}
