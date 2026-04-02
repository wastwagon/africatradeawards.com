import { EventType } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireManager } from "@/lib/api-auth";

export { dynamic } from "@/lib/force-dynamic-api";

const createEventSchema = z.object({
  slug: z.string().min(2).max(80),
  name: z.string().min(2).max(200),
  description: z.string().max(5000).optional(),
  type: z.nativeEnum(EventType).default(EventType.IN_PERSON),
  venueName: z.string().min(2).max(200),
  venueAddress: z.string().max(300).optional(),
  startsAt: z.string(),
  endsAt: z.string(),
  capacity: z.number().int().positive().optional(),
  isPublished: z.boolean().optional(),
});

export async function GET() {
  const auth = await requireManager();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const events = await prisma.event.findMany({
    orderBy: [{ startsAt: "asc" }],
    include: {
      _count: { select: { registrations: true, checkIns: true } },
    },
  });
  return NextResponse.json({ ok: true, events });
}

export async function POST(request: Request) {
  const auth = await requireManager();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const body = await request.json().catch(() => null);
  const parsed = createEventSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const startsAt = new Date(parsed.data.startsAt);
  const endsAt = new Date(parsed.data.endsAt);
  if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime()) || endsAt <= startsAt) {
    return NextResponse.json({ error: "Invalid event dates" }, { status: 400 });
  }

  try {
    const event = await prisma.event.create({
      data: {
        slug: parsed.data.slug.trim().toLowerCase(),
        name: parsed.data.name.trim(),
        description: parsed.data.description?.trim() || undefined,
        type: parsed.data.type,
        venueName: parsed.data.venueName.trim(),
        venueAddress: parsed.data.venueAddress?.trim() || undefined,
        startsAt,
        endsAt,
        capacity: parsed.data.capacity,
        isPublished: parsed.data.isPublished ?? true,
      },
    });
    return NextResponse.json({ ok: true, event }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Could not create event (slug may already exist)" }, { status: 400 });
  }
}
