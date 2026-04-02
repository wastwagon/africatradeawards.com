import { CheckInQueueState } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireManager } from "@/lib/api-auth";
import { writeAuditLog } from "@/lib/audit-log";
import { prisma } from "@/lib/prisma";

export { dynamic } from "@/lib/force-dynamic-api";

const patchSchema = z.object({
  state: z.nativeEnum(CheckInQueueState).optional(),
  attempts: z.number().int().min(0).optional(),
  lastError: z.string().max(500).optional(),
  processed: z.boolean().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: { eventId: string; queueItemId: string } }
) {
  const auth = await requireManager();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body ?? {});
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const existing = await prisma.eventCheckInQueueItem.findFirst({
    where: { id: params.queueItemId, eventId: params.eventId },
    select: { id: true },
  });
  if (!existing) return NextResponse.json({ error: "Queue item not found" }, { status: 404 });

  const updated = await prisma.eventCheckInQueueItem.update({
    where: { id: params.queueItemId },
    data: {
      state: parsed.data.state,
      attempts: parsed.data.attempts,
      lastError: parsed.data.lastError,
      processedAt: parsed.data.processed ? new Date() : undefined,
      processedById: parsed.data.processed ? auth.user.userId : undefined,
    },
  });

  await writeAuditLog({
    action: "checkin_queue.update",
    userId: auth.user.userId,
    metadata: {
      eventId: params.eventId,
      queueItemId: params.queueItemId,
      state: updated.state,
      attempts: updated.attempts,
      processedAt: updated.processedAt,
    },
  });

  return NextResponse.json({ ok: true, item: updated });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { eventId: string; queueItemId: string } }
) {
  const auth = await requireManager();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const existing = await prisma.eventCheckInQueueItem.findFirst({
    where: { id: params.queueItemId, eventId: params.eventId },
    select: { id: true },
  });
  if (!existing) return NextResponse.json({ error: "Queue item not found" }, { status: 404 });

  await prisma.eventCheckInQueueItem.delete({ where: { id: params.queueItemId } });
  await writeAuditLog({
    action: "checkin_queue.delete",
    userId: auth.user.userId,
    metadata: {
      eventId: params.eventId,
      queueItemId: params.queueItemId,
    },
  });
  return NextResponse.json({ ok: true });
}
