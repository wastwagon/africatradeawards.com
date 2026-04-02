import { NextResponse } from "next/server";
import { getCmsPublications } from "@/lib/cms-content";

export async function GET() {
  const publications = await getCmsPublications();
  return NextResponse.json(
    { publications },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    },
  );
}
