import { NextResponse } from "next/server";
import { getCmsAboutSnippets } from "@/lib/cms-content";

export async function GET() {
  const snippets = await getCmsAboutSnippets();
  return NextResponse.json(
    { snippets },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    },
  );
}
