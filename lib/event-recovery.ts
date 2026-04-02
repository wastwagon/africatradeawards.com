import { createHash } from "crypto";

export function generateEventRecoveryCode(): string {
  return `${Math.floor(100000 + Math.random() * 900000)}`;
}

export function hashEventRecoveryCode(code: string): string {
  const salt = process.env.EVENT_RECOVERY_CODE_SALT ?? process.env.VOTE_CODE_SALT;
  if (!salt) {
    throw new Error("EVENT_RECOVERY_CODE_SALT or VOTE_CODE_SALT is required");
  }
  return createHash("sha256").update(`${salt}:${code}`).digest("hex");
}
