import { createHash } from "node:crypto";

function requiredSecret(name: "VOTE_IP_SALT" | "VOTE_CODE_SALT" | "VOTE_FP_SALT"): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

export function hashIp(ip: string): string {
  const salt = requiredSecret("VOTE_IP_SALT");
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export function getClientIp(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() ?? "0.0.0.0";
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "0.0.0.0";
}

export function hashVoteCode(code: string): string {
  const salt = requiredSecret("VOTE_CODE_SALT");
  return createHash("sha256").update(`${salt}:${code}`).digest("hex");
}

export function generateVoteCode() {
  return `${Math.floor(100000 + Math.random() * 900000)}`;
}

export function hashFingerprint(raw: string): string {
  const salt = requiredSecret("VOTE_FP_SALT");
  return createHash("sha256").update(`${salt}:${raw}`).digest("hex");
}
