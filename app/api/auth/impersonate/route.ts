import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionCookieName, signSessionToken } from "@/lib/auth";
import { requireSuperAdmin } from "@/lib/api-auth";
import { defaultDashboardPath } from "@/lib/post-login-redirect";
import { prisma } from "@/lib/prisma";

export { dynamic } from "@/lib/force-dynamic-api";

const schema = z.object({
  userId: z.string().min(1),
});

export async function POST(request: Request) {
  const auth = await requireSuperAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: parsed.data.userId },
    select: { id: true, email: true, role: true, fullName: true },
  });
  if (!targetUser) {
    return NextResponse.json({ error: "Target user not found" }, { status: 404 });
  }
  if (targetUser.id === auth.user.userId) {
    return NextResponse.json({ error: "You are already logged in as this user." }, { status: 400 });
  }

  const token = await signSessionToken({
    userId: targetUser.id,
    email: targetUser.email,
    role: targetUser.role,
    fullName: targetUser.fullName,
    impersonatedBy: {
      userId: auth.user.userId,
      email: auth.user.email,
      role: auth.user.role,
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: auth.user.userId,
      action: "auth.impersonation.started",
      metadata: {
        targetUserId: targetUser.id,
        targetEmail: targetUser.email,
        targetRole: targetUser.role,
      },
    },
  });

  const response = NextResponse.json({
    ok: true,
    redirectTo: defaultDashboardPath(targetUser.role),
    target: { id: targetUser.id, email: targetUser.email, fullName: targetUser.fullName, role: targetUser.role },
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
