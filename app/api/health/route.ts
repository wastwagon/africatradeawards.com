import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export { dynamic } from "@/lib/force-dynamic-api";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      ok: true,
      service: "africa-trade-awards",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        database: "disconnected",
      },
      { status: 500 },
    );
  }
}
