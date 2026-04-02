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
