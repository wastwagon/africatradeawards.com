import { EntryStatus, UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/api-auth";

export { dynamic } from "@/lib/force-dynamic-api";

const schema = z.object({
  status: z.nativeEnum(EntryStatus),
});

type Params = { params: { entryId: string } };

export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireRole(UserRole.PROGRAM_MANAGER);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  if (parsed.data.status === EntryStatus.DRAFT) {
    return NextResponse.json({ error: "Managers cannot move entries back to DRAFT from this endpoint" }, { status: 400 });
  }

  const entry = await prisma.entry.update({
    where: { id: params.entryId },
    data: { status: parsed.data.status },
  });

  return NextResponse.json({ ok: true, entry });
}
