import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export { dynamic } from "@/lib/force-dynamic-api";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug")?.trim().toLowerCase();
  if (slug) {
    const event = await prisma.event.findFirst({
      where: { slug, isPublished: true },
      include: { _count: { select: { registrations: true, checkIns: true } } },
    });
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });
    return NextResponse.json({ ok: true, event });
  }

  const events = await prisma.event.findMany({
    where: { isPublished: true },
    orderBy: [{ startsAt: "asc" }],
    include: { _count: { select: { registrations: true, checkIns: true } } },
  });
  return NextResponse.json({ ok: true, events });
}
