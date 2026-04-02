import PDFDocument from "pdfkit";
import { EntryStatus, UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/api-auth";

export { dynamic } from "@/lib/force-dynamic-api";

const schema = z.object({
  entryId: z.string().min(1),
});

export async function POST(request: Request) {
  const auth = await requireRole(UserRole.PROGRAM_MANAGER);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const entry = await prisma.entry.findUnique({
    where: { id: parsed.data.entryId },
    include: {
      program: { select: { name: true } },
      category: { select: { name: true } },
      season: { select: { year: true } },
      entrant: { select: { fullName: true } },
    },
  });
  if (!entry) return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  if (entry.status !== EntryStatus.WINNER) {
    return NextResponse.json({ error: "Certificates can only be generated for winners" }, { status: 400 });
  }

  const doc = new PDFDocument({ size: "A4", margin: 60 });
  const chunks: Buffer[] = [];
  doc.on("data", (chunk) => chunks.push(chunk));

  doc.fontSize(14).text("Africa Trade Awards", { align: "center" });
  doc.moveDown(1);
  doc.fontSize(34).text("Certificate of Recognition", { align: "center" });
  doc.moveDown(1.6);
  doc.fontSize(16).text("This certifies that", { align: "center" });
  doc.moveDown(0.6);
  doc.fontSize(28).text(entry.entrant.fullName, { align: "center" });
  doc.moveDown(0.8);
  doc.fontSize(16).text("is recognized as a Winner for", { align: "center" });
  doc.moveDown(0.4);
  doc.fontSize(22).text(entry.title, { align: "center" });
  doc.moveDown(0.4);
  doc.fontSize(14).text(`${entry.category.name} | ${entry.program.name} | Season ${entry.season.year}`, { align: "center" });
  doc.moveDown(2);
  doc.fontSize(12).text(`Date issued: ${new Date().toLocaleDateString()}`, { align: "center" });
  doc.end();

  const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });

  return new NextResponse(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="winner-certificate-${entry.id}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
