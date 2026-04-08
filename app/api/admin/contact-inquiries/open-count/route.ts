import { NextResponse } from "next/server";
import { requireManager } from "@/lib/api-auth";
import { countOpenContactInquiries } from "@/lib/contact-inquiry-open-count";

export { dynamic } from "@/lib/force-dynamic-api";

export async function GET() {
  const auth = await requireManager();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const open = await countOpenContactInquiries();

  return NextResponse.json({ open });
}
