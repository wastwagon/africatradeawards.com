import { NextResponse } from "next/server";
import { buildContactInquiryWhere } from "@/lib/admin-contact-inquiry-filters";
import { requireManager } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export { dynamic } from "@/lib/force-dynamic-api";

function csvEscape(s: string): string {
  const t = String(s ?? "").replace(/"/g, '""');
  if (/[",\n\r]/.test(t)) return `"${t}"`;
  return t;
}

export async function GET(request: Request) {
  const auth = await requireManager();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const { searchParams } = new URL(request.url);
  const where = buildContactInquiryWhere({
    q: searchParams.get("q") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    from: searchParams.get("from") ?? undefined,
    to: searchParams.get("to") ?? undefined,
  });

  const rows = await prisma.contactInquiry.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 5000,
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      name: true,
      email: true,
      phone: true,
      inquiryType: true,
      subject: true,
      message: true,
      status: true,
      emailedAt: true,
      emailError: true,
    },
  });

  const header = [
    "id",
    "createdAt",
    "updatedAt",
    "name",
    "email",
    "phone",
    "inquiryType",
    "subject",
    "message",
    "status",
    "emailedAt",
    "emailError",
  ];

  const lines = [
    header.join(","),
    ...rows.map((r: Record<string, unknown>) =>
      [
        r.id,
        r.createdAt ? new Date(r.createdAt as string).toISOString() : "",
        r.updatedAt ? new Date(r.updatedAt as string).toISOString() : "",
        csvEscape(String(r.name ?? "")),
        csvEscape(String(r.email ?? "")),
        csvEscape(String(r.phone ?? "")),
        csvEscape(String(r.inquiryType ?? "")),
        csvEscape(String(r.subject ?? "")),
        csvEscape(String(r.message ?? "")),
        csvEscape(String(r.status ?? "")),
        r.emailedAt ? new Date(r.emailedAt as string).toISOString() : "",
        csvEscape(String(r.emailError ?? "")),
      ].join(","),
    ),
  ];

  const body = lines.join("\n") + "\n";
  const filename = `contact-inquiries-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
