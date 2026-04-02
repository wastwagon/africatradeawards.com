import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { z } from "zod";
import { getSessionCookieName, signSessionToken, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

export { dynamic } from "@/lib/force-dynamic-api";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const LOGIN_WINDOW_SECONDS = Number(process.env.LOGIN_WINDOW_SECONDS ?? 15 * 60);
const LOGIN_MAX_PER_IP = Number(process.env.LOGIN_MAX_PER_IP ?? 30);
const LOGIN_MAX_PER_ACCOUNT_AND_IP = Number(process.env.LOGIN_MAX_PER_ACCOUNT_AND_IP ?? 8);
const LOGIN_RATE_LIMIT_ENABLED = process.env.LOGIN_RATE_LIMIT_ENABLED !== "false";

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
  const email = parsed.data.email.toLowerCase();
  const ip = getClientIp(request.headers);

  if (LOGIN_RATE_LIMIT_ENABLED) {
    const ipLimiter = await checkRateLimit(
      `rl:auth:login:ip:${hashKeyPart(ip)}`,
      LOGIN_MAX_PER_IP,
      LOGIN_WINDOW_SECONDS
    );
    const accountLimiter = await checkRateLimit(
      `rl:auth:login:account:${hashKeyPart(`${email}:${ip}`)}`,
      LOGIN_MAX_PER_ACCOUNT_AND_IP,
      LOGIN_WINDOW_SECONDS
    );
    if (!ipLimiter.allowed || !accountLimiter.allowed) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": `${LOGIN_WINDOW_SECONDS}` } }
      );
    }
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const valid = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

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
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return response;
}
