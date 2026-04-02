import { NextResponse } from "next/server";
import { getPublicSiteSettings } from "@/lib/public-site-settings";

/** Public read-only site copy (dates, venue lines). Safe to cache at the edge. */
export async function GET() {
  const config = await getPublicSiteSettings();
  return NextResponse.json(config, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
