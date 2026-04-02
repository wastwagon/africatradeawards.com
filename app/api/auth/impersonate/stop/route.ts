import { NextResponse } from "next/server";
import { getSessionCookieName, signSessionToken } from "@/lib/auth";
import { getRequestSessionUser } from "@/lib/api-auth";
import { defaultDashboardPath } from "@/lib/post-login-redirect";
import { prisma } from "@/lib/prisma";

export { dynamic } from "@/lib/force-dynamic-api";

export async function POST() {
  const session = await getRequestSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!session.impersonatedBy?.userId) {
    return NextResponse.json({ error: "No active impersonation session." }, { status: 400 });
  }

  const originalUser = await prisma.user.findUnique({
    where: { id: session.impersonatedBy.userId },
    select: { id: true, email: true, role: true, fullName: true },
  });
  if (!originalUser) {
    return NextResponse.json({ error: "Original account was not found." }, { status: 404 });
  }

  const token = await signSessionToken({
    userId: originalUser.id,
    email: originalUser.email,
    role: originalUser.role,
    fullName: originalUser.fullName,
  });

  await prisma.auditLog.create({
    data: {
      userId: originalUser.id,
      action: "auth.impersonation.stopped",
      metadata: {
        fromUserId: session.userId,
        fromEmail: session.email,
        fromRole: session.role,
      },
    },
  });

  const response = NextResponse.json({ ok: true, redirectTo: defaultDashboardPath(originalUser.role) });
  response.cookies.set(getSessionCookieName(), token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return response;
}
