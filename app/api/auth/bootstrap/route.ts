import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { z } from "zod";
import { hashPassword, signSessionToken, getSessionCookieName } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export { dynamic } from "@/lib/force-dynamic-api";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(10),
  fullName: z.string().min(2).max(120),
  bootstrapSecret: z.string().min(8),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (!process.env.BOOTSTRAP_ADMIN_SECRET || parsed.data.bootstrapSecret !== process.env.BOOTSTRAP_ADMIN_SECRET) {
    return NextResponse.json({ error: "Invalid bootstrap secret" }, { status: 403 });
  }

  const userCount = await prisma.user.count();
  if (userCount > 0) {
    return NextResponse.json({ error: "Bootstrap already completed" }, { status: 409 });
  }

  const admin = await prisma.user.create({
    data: {
      email: parsed.data.email.toLowerCase(),
      fullName: parsed.data.fullName,
      passwordHash: await hashPassword(parsed.data.password),
      role: UserRole.SUPER_ADMIN,
    },
  });

  const token = await signSessionToken({
    userId: admin.id,
    email: admin.email,
    role: admin.role,
    fullName: admin.fullName,
  });

  const response = NextResponse.json({
    ok: true,
    user: { id: admin.id, email: admin.email, role: admin.role, fullName: admin.fullName },
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
