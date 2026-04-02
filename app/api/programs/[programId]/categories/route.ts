import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireManagerOrAuditor, requireRole } from "@/lib/api-auth";

export { dynamic } from "@/lib/force-dynamic-api";

const categorySchema = z.object({
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
  name: z.string().min(2).max(150),
  description: z.string().max(4000).optional(),
});

type Params = { params: { programId: string } };

export async function GET(_: Request, { params }: Params) {
  const auth = await requireManagerOrAuditor();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const categories = await prisma.category.findMany({
    where: { programId: params.programId },
    orderBy: [{ createdAt: "desc" }],
  });

  return NextResponse.json({ ok: true, categories });
}

export async function POST(request: Request, { params }: Params) {
  const auth = await requireRole(UserRole.PROGRAM_MANAGER);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const body = await request.json().catch(() => null);
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const category = await prisma.category.create({
    data: {
      programId: params.programId,
      slug: parsed.data.slug,
      name: parsed.data.name,
      description: parsed.data.description,
    },
  });

  return NextResponse.json({ ok: true, category }, { status: 201 });
}
