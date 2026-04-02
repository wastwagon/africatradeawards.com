import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireManagerOrAuditor, requireRole } from "@/lib/api-auth";

export { dynamic } from "@/lib/force-dynamic-api";

const createProgramSchema = z.object({
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
  name: z.string().min(2).max(150),
  description: z.string().max(4000).optional(),
});

export async function GET() {
  const auth = await requireManagerOrAuditor();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const programs = await prisma.program.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ ok: true, programs });
}

export async function POST(request: Request) {
  const auth = await requireRole(UserRole.PROGRAM_MANAGER);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const body = await request.json().catch(() => null);
  const parsed = createProgramSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const program = await prisma.program.create({
    data: {
      slug: parsed.data.slug,
      name: parsed.data.name,
      description: parsed.data.description,
    },
  });

  return NextResponse.json({ ok: true, program }, { status: 201 });
}
