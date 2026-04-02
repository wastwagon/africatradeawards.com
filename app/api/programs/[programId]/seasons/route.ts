import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireManagerOrAuditor, requireRole } from "@/lib/api-auth";

export { dynamic } from "@/lib/force-dynamic-api";

const seasonSchema = z.object({
  year: z.number().int().min(2000).max(2100),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});

type Params = { params: { programId: string } };

export async function GET(_: Request, { params }: Params) {
  const auth = await requireManagerOrAuditor();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const seasons = await prisma.season.findMany({
    where: { programId: params.programId },
    orderBy: [{ year: "desc" }],
  });

  return NextResponse.json({ ok: true, seasons });
}

export async function POST(request: Request, { params }: Params) {
  const auth = await requireRole(UserRole.PROGRAM_MANAGER);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const body = await request.json().catch(() => null);
  const parsed = seasonSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const startDate = new Date(parsed.data.startDate);
  const endDate = new Date(parsed.data.endDate);
  if (startDate >= endDate) {
    return NextResponse.json({ error: "startDate must be before endDate" }, { status: 400 });
  }

  const season = await prisma.season.create({
    data: {
      programId: params.programId,
      year: parsed.data.year,
      startDate,
      endDate,
    },
  });

  return NextResponse.json({ ok: true, season }, { status: 201 });
}
