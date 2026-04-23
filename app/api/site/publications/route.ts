import { NextResponse } from "next/server";
import { getCmsPublications } from "@/lib/cms-content";

export async function GET() {
  const publications = await getCmsPublications();
  const listing = publications.map(({ body: _omit, ...rest }) => rest);
  return NextResponse.json(
    { publications: listing },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    },
  );
}
