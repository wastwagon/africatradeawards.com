import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole, requireSuperAdmin } from "@/lib/api-auth";
import { hashPassword } from "@/lib/auth";

export { dynamic } from "@/lib/force-dynamic-api";

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(10),
  fullName: z.string().min(2).max(120),
  role: z.nativeEnum(UserRole),
});

export async function POST(request: Request) {
  const auth = await requireSuperAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const body = await request.json().catch(() => null);
  const parsed = createUserSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const exists = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (exists) return NextResponse.json({ error: "Email already registered" }, { status: 409 });

  const user = await prisma.user.create({
    data: {
      email: parsed.data.email.toLowerCase(),
      fullName: parsed.data.fullName,
      passwordHash: await hashPassword(parsed.data.password),
      role: parsed.data.role,
    },
    select: { id: true, email: true, fullName: true, role: true, createdAt: true },
  });

  return NextResponse.json({ ok: true, user }, { status: 201 });
}

export async function GET(request: Request) {
  const auth = await requireRole(UserRole.PROGRAM_MANAGER);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });
  const isSuperAdmin = auth.user.role === UserRole.SUPER_ADMIN;

  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role");
  const roleFilter = role && Object.values(UserRole).includes(role as UserRole) ? (role as UserRole) : null;

  if (!isSuperAdmin) {
    if (!roleFilter) {
      return NextResponse.json({ error: "Role filter is required for this endpoint." }, { status: 400 });
    }
    if (
      roleFilter !== UserRole.JUDGE &&
      roleFilter !== UserRole.ENTRANT &&
      roleFilter !== UserRole.VOTER
    ) {
      return NextResponse.json({ error: "Only judge, entrant, and voter lookups are allowed." }, { status: 403 });
    }
  }

  const users = await prisma.user.findMany({
    where: roleFilter ? { role: roleFilter } : undefined,
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      createdAt: true,
    },
    orderBy: [{ createdAt: "desc" }],
  });

  return NextResponse.json({ ok: true, users });
}

const updateUserSchema = z.object({
  userId: z.string().min(1),
  fullName: z.string().min(2).max(120).optional(),
  role: z.nativeEnum(UserRole).optional(),
  resetPassword: z.string().min(10).optional(),
});

export async function PATCH(request: Request) {
  const auth = await requireSuperAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const body = await request.json().catch(() => null);
  const parsed = updateUserSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const { userId, fullName, role, resetPassword } = parsed.data;

  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true, fullName: true },
  });
  if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (userId === auth.user.userId && role && role !== UserRole.SUPER_ADMIN) {
    return NextResponse.json({ error: "You cannot remove your own super admin role." }, { status: 400 });
  }

  const updateData: {
    fullName?: string;
    role?: UserRole;
    passwordHash?: string;
  } = {};
  if (typeof fullName === "string" && fullName.trim()) updateData.fullName = fullName.trim();
  if (role) updateData.role = role;
  if (typeof resetPassword === "string" && resetPassword.trim()) {
    updateData.passwordHash = await hashPassword(resetPassword.trim());
  }
  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: "No changes were provided." }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: { id: true, email: true, fullName: true, role: true, createdAt: true },
  });

  await prisma.auditLog.create({
    data: {
      userId: auth.user.userId,
      action: "admin.user.updated",
      metadata: {
        targetUserId: user.id,
        targetEmail: user.email,
        changedFullName: Boolean(updateData.fullName),
        changedRole: Boolean(updateData.role),
        resetPassword: Boolean(updateData.passwordHash),
      },
    },
  });

  return NextResponse.json({ ok: true, user });
}
