import path from "node:path";

type PdfLikeDocument = {
  registerFont: (name: string, src: string) => unknown;
  font: (name: string) => unknown;
};

const PDF_FONT_REGULAR = path.join(process.cwd(), "public", "assets", "fonts", "pdf", "NotoSans-Regular.ttf");
const PDF_FONT_BOLD = path.join(process.cwd(), "public", "assets", "fonts", "pdf", "NotoSans-Bold.ttf");

/**
 * Register deterministic local fonts so PDFKit does not rely on packaged AFM built-ins.
 */
export function registerPdfFonts(doc: PdfLikeDocument): void {
  doc.registerFont("Sans", PDF_FONT_REGULAR);
  doc.registerFont("Sans-Bold", PDF_FONT_BOLD);
}

export function getPdfDefaultFontPath(): string {
  return PDF_FONT_REGULAR;
}

export function applyPdfSans<T extends PdfLikeDocument>(doc: T): T {
  doc.font("Sans");
  return doc;
}

export function applyPdfSansBold<T extends PdfLikeDocument>(doc: T): T {
  doc.font("Sans-Bold");
  return doc;
}

