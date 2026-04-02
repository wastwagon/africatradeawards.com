import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/api-auth";

export { dynamic } from "@/lib/force-dynamic-api";

export async function GET() {
  const auth = await requireRole(UserRole.ENTRANT);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const programs = await prisma.program.findMany({
    where: { isActive: true },
    orderBy: [{ createdAt: "desc" }],
    include: {
      seasons: {
        where: { isArchived: false },
        orderBy: { year: "desc" },
      },
      categories: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return NextResponse.json({ ok: true, programs });
}
