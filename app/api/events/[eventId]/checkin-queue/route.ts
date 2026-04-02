import { CheckInAttemptSource, CheckInQueueState } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireManager, requireManagerOrAuditor } from "@/lib/api-auth";
import { writeAuditLog } from "@/lib/audit-log";
import { prisma } from "@/lib/prisma";

export { dynamic } from "@/lib/force-dynamic-api";

const createSchema = z.object({
  qrPayload: z.string().min(8),
  location: z.string().max(120).optional(),
  deviceLabel: z.string().max(120).optional(),
  source: z.nativeEnum(CheckInAttemptSource).optional(),
  queuedAt: z.string().datetime().optional(),
  lastError: z.string().max(500).optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: { eventId: string } }
) {
  const auth = await requireManagerOrAuditor();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const items = await prisma.eventCheckInQueueItem.findMany({
    where: {
      eventId: params.eventId,
      state: { in: [CheckInQueueState.PENDING, CheckInQueueState.CONFLICT] },
    },
    orderBy: [{ queuedAt: "asc" }],
    take: 500,
  });

  await writeAuditLog({
    action: "checkin_queue.list",
    userId: auth.user.userId,
    metadata: {
      eventId: params.eventId,
      count: items.length,
    },
  });

  return NextResponse.json({ ok: true, items });
}

export async function POST(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  const auth = await requireManager();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body ?? {});
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const existing = await prisma.eventCheckInQueueItem.findFirst({
    where: {
      eventId: params.eventId,
      state: { in: [CheckInQueueState.PENDING, CheckInQueueState.CONFLICT] },
      qrPayload: parsed.data.qrPayload,
      location: parsed.data.location?.trim() || null,
      deviceLabel: parsed.data.deviceLabel?.trim() || null,
    },
    orderBy: [{ createdAt: "desc" }],
    select: { id: true },
  });

  if (existing) {
    const updated = await prisma.eventCheckInQueueItem.update({
      where: { id: existing.id },
      data: {
        lastError: parsed.data.lastError?.trim() || undefined,
        queuedAt: parsed.data.queuedAt ? new Date(parsed.data.queuedAt) : undefined,
      },
    });
    await writeAuditLog({
      action: "checkin_queue.dedupe_update",
      userId: auth.user.userId,
      metadata: {
        eventId: params.eventId,
        queueItemId: updated.id,
      },
    });
    return NextResponse.json({ ok: true, item: updated, deduped: true });
  }

  const item = await prisma.eventCheckInQueueItem.create({
    data: {
      eventId: params.eventId,
      createdById: auth.user.userId,
      qrPayload: parsed.data.qrPayload,
      location: parsed.data.location?.trim() || undefined,
      deviceLabel: parsed.data.deviceLabel?.trim() || undefined,
      source: parsed.data.source ?? CheckInAttemptSource.OFFLINE_SYNC,
      queuedAt: parsed.data.queuedAt ? new Date(parsed.data.queuedAt) : undefined,
      lastError: parsed.data.lastError?.trim() || undefined,
    },
  });

  await writeAuditLog({
    action: "checkin_queue.create",
    userId: auth.user.userId,
    metadata: {
      eventId: params.eventId,
      queueItemId: item.id,
      source: item.source,
    },
  });

  return NextResponse.json({ ok: true, item, deduped: false }, { status: 201 });
}
