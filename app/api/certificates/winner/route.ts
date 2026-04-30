import PDFDocument from "pdfkit";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { EntryStatus, UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/api-auth";
import { getPdfDefaultFontPath, registerPdfFonts, applyPdfSans, applyPdfSansBold } from "@/lib/pdf-fonts";

export { dynamic } from "@/lib/force-dynamic-api";

const schema = z.object({
  entryId: z.string().min(1),
});

let logoPngBufferPromise: Promise<Buffer | null> | null = null;

async function getCertificateLogoBuffer(): Promise<Buffer | null> {
  if (!logoPngBufferPromise) {
    logoPngBufferPromise = (async () => {
      try {
        const appleIconPath = path.join(process.cwd(), "app", "apple-icon.png");
        const appleIconBytes = await readFile(appleIconPath);
        return await sharp(appleIconBytes).png().toBuffer();
      } catch {
        try {
          const svgPath = path.join(process.cwd(), "public", "assets", "img", "icons", "logo1.svg");
          const svgBytes = await readFile(svgPath);
          return await sharp(svgBytes).png().toBuffer();
        } catch {
          return null;
        }
      }
    })();
  }
  return logoPngBufferPromise;
}

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

  const doc = new PDFDocument({ size: "A4", margin: 44, font: getPdfDefaultFontPath() });
  registerPdfFonts(doc);
  const chunks: Buffer[] = [];
  doc.on("data", (chunk) => chunks.push(chunk));

  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;
  const margin = 28;
  const brandDark = "#0f1e2e";
  const brandGold = "#d6ad52";

  // Decorative frame.
  doc
    .save()
    .lineWidth(2)
    .strokeColor(brandGold)
    .rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2)
    .stroke()
    .lineWidth(0.8)
    .strokeColor("#e5d6ad")
    .rect(margin + 8, margin + 8, pageWidth - (margin + 8) * 2, pageHeight - (margin + 8) * 2)
    .stroke()
    .restore();

  // Optional site logo banner.
  const logoBuffer = await getCertificateLogoBuffer();
  if (logoBuffer) {
    const currentBannerWidth = pageWidth - (margin + 26) * 2;
    const bannerWidth = currentBannerWidth * 0.5;
    const bannerX = (pageWidth - bannerWidth) / 2;
    const bannerY = 54;
    const bannerHeight = 145;
    const logoWidth = 128;
    const logoX = (pageWidth - logoWidth) / 2;
    const logoY = bannerY + (bannerHeight - logoWidth) / 2;

    doc.save().roundedRect(bannerX, bannerY, bannerWidth, bannerHeight, 8).fillColor("#0d1822").fill().restore();
    doc.image(logoBuffer, logoX, logoY, { width: logoWidth });
  }

  const contentTop = logoBuffer ? 198 : 105;
  doc.y = contentTop;

  applyPdfSansBold(doc).fillColor(brandDark).fontSize(42).text("Certificate", { align: "center" });
  applyPdfSansBold(doc).fillColor(brandDark).fontSize(28).text("of Recognition", { align: "center" });

  doc.moveDown(1.3);
  applyPdfSans(doc).fillColor("#1f2f44").fontSize(15).text("This certifies that", { align: "center" });
  doc.moveDown(0.5);
  applyPdfSansBold(doc).fillColor(brandDark).fontSize(30).text(entry.entrant.fullName, {
    align: "center",
    underline: true,
  });
  doc.moveDown(0.8);
  applyPdfSans(doc).fillColor("#1f2f44").fontSize(15).text("is recognized as a Winner for", { align: "center" });
  doc.moveDown(0.35);
  applyPdfSansBold(doc).fillColor(brandDark).fontSize(22).text(entry.title, { align: "center" });
  doc.moveDown(0.45);
  applyPdfSans(doc)
    .fillColor("#3d4c61")
    .fontSize(12)
    .text(`${entry.category.name} | ${entry.program.name} | Season ${entry.season.year}`, { align: "center" });

  // Footer bar with issue date.
  const issued = `Issued on ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}`;
  doc
    .save()
    .fillColor("#f6f1e4")
    .rect(margin + 22, pageHeight - 115, pageWidth - (margin + 22) * 2, 46)
    .fill()
    .restore();
  doc.y = pageHeight - 103;
  applyPdfSansBold(doc).fillColor(brandDark).fontSize(12).text(issued, { align: "center" });

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
