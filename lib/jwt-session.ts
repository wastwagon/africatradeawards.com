import { SignJWT, jwtVerify } from "jose";

const SESSION_COOKIE_NAME = "ata_session";

/** `role` matches Prisma `UserRole` string values; kept as string to keep this module Edge-safe (no `@prisma/client`). */
export type SessionUser = {
  userId: string;
  email: string;
  role: string;
  fullName?: string;
  impersonatedBy?: {
    userId: string;
    email: string;
    role: string;
  };
};

type SessionPayload = SessionUser & {
  iat?: number;
  exp?: number;
};

function getJwtSecret(): Uint8Array {
  const secret = process.env.AUTH_JWT_SECRET;
  if (!secret) {
    throw new Error("AUTH_JWT_SECRET is not configured");
  }
  return new TextEncoder().encode(secret);
}

export async function signSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

export async function verifySessionToken(token: string): Promise<SessionPayload> {
  const { payload } = await jwtVerify(token, getJwtSecret());
  return payload as SessionPayload;
}

export function getSessionCookieName(): string {
  return SESSION_COOKIE_NAME;
}

/**
 * Whether the session cookie should use the Secure attribute.
 * When PUBLIC_BASE_URL is http:// (CI E2E, local HTTP), Secure must be false or browsers will not
 * persist cookies on 127.0.0.1 / localhost — breaking flows that set a new cookie (e.g. impersonation).
 * Override with SESSION_COOKIE_SECURE=true|false if needed behind a reverse proxy.
 */
export function isSessionCookieSecure(): boolean {
  if (process.env.SESSION_COOKIE_SECURE === "true") return true;
  if (process.env.SESSION_COOKIE_SECURE === "false") return false;
  const base = (process.env.PUBLIC_BASE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "").trim().toLowerCase();
  if (base.startsWith("https://")) return true;
  if (base.startsWith("http://")) return false;
  return process.env.NODE_ENV === "production";
}
