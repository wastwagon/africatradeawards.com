import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { UserRole } from "@prisma/client";
import { z } from "zod";
import { getSessionCookieName, hashPassword, isSessionCookieSecure, signSessionToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

export { dynamic } from "@/lib/force-dynamic-api";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(10),
  fullName: z.string().min(2).max(120),
});

const REGISTER_WINDOW_SECONDS = Number(process.env.LOGIN_WINDOW_SECONDS ?? 15 * 60);
const REGISTER_MAX_PER_IP = Number(process.env.REGISTER_MAX_PER_IP ?? 15);
const REGISTER_RATE_LIMIT_ENABLED = process.env.REGISTER_RATE_LIMIT_ENABLED !== "false";

function getClientIp(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() ?? "0.0.0.0";
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "0.0.0.0";
}

function hashKeyPart(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const ip = getClientIp(request.headers);
  if (REGISTER_RATE_LIMIT_ENABLED) {
    const ipLimiter = await checkRateLimit(
      `rl:auth:register:ip:${hashKeyPart(ip)}`,
      REGISTER_MAX_PER_IP,
      REGISTER_WINDOW_SECONDS
    );
    if (!ipLimiter.allowed) {
      return NextResponse.json(
        { error: "Too many registration attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": `${REGISTER_WINDOW_SECONDS}` } }
      );
    }
  }

  const email = parsed.data.email.toLowerCase();
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: {
      email,
      fullName: parsed.data.fullName.trim(),
      passwordHash: await hashPassword(parsed.data.password),
      role: UserRole.VOTER,
    },
    select: { id: true, email: true, fullName: true, role: true },
  });

  const token = await signSessionToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    fullName: user.fullName,
  });

  const response = NextResponse.json({
    ok: true,
    user: { id: user.id, email: user.email, role: user.role, fullName: user.fullName },
  });

  response.cookies.set(getSessionCookieName(), token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isSessionCookieSecure(),
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return response;
}
