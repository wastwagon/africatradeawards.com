import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/api-auth";

export { dynamic } from "@/lib/force-dynamic-api";

const patchSchema = z.object({
  year: z.number().int().min(2000).max(2100).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

type Params = { params: { programId: string; seasonId: string } };

export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireRole(UserRole.PROGRAM_MANAGER);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  if (
    parsed.data.year === undefined &&
    parsed.data.startDate === undefined &&
    parsed.data.endDate === undefined
  ) {
    return NextResponse.json({ error: "No changes provided." }, { status: 400 });
  }

  const existing = await prisma.season.findFirst({
    where: { id: params.seasonId, programId: params.programId },
  });
  if (!existing) return NextResponse.json({ error: "Season not found" }, { status: 404 });

  const year = parsed.data.year ?? existing.year;
  const startDate = parsed.data.startDate ? new Date(parsed.data.startDate) : existing.startDate;
  const endDate = parsed.data.endDate ? new Date(parsed.data.endDate) : existing.endDate;

  if (startDate >= endDate) {
    return NextResponse.json({ error: "startDate must be before endDate" }, { status: 400 });
  }

  if (year !== existing.year) {
    const conflict = await prisma.season.findFirst({
      where: { programId: params.programId, year, NOT: { id: existing.id } },
    });
    if (conflict) {
      return NextResponse.json(
        { error: "Another season already uses this year for this program." },
        { status: 409 },
      );
    }
  }

  const season = await prisma.season.update({
    where: { id: existing.id },
    data: { year, startDate, endDate },
  });

  return NextResponse.json({ ok: true, season });
}
