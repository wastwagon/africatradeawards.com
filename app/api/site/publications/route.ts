import { NextResponse } from "next/server";
import { getCmsPublications } from "@/lib/cms-content";

export async function GET() {
  const publications = await getCmsPublications();
  const listing = publications.map(({ body: _omit, ...rest }) => rest);
  return NextResponse.json(
    { publications: listing },
    {
      headers: {
        // CMS-backed list: avoid CDN/browser caching stale cards after admin edits.
        "Cache-Control": "private, no-store, must-revalidate",
      },
    },
  );
}
