import { createHash } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";

type VoteTokenPayload = {
  entryId: string;
  voterEmail: string;
  ipHash: string;
  kind: "vote_link" | "challenge";
};

function secret() {
  const value = process.env.VOTE_TOKEN_SECRET || process.env.AUTH_JWT_SECRET;
  if (!value) throw new Error("VOTE_TOKEN_SECRET or AUTH_JWT_SECRET is required");
  return new TextEncoder().encode(value);
}

export async function signVotingToken(payload: VoteTokenPayload, expiresIn: string) {
  return new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime(expiresIn).sign(secret());
}

export async function verifyVotingToken(token: string) {
  const { payload } = await jwtVerify(token, secret());
  return payload as VoteTokenPayload & { iat?: number; exp?: number };
}

export function hashVoteToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
