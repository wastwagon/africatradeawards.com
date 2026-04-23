const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Normalise stored `dateText` to `YYYY-MM-DD` when possible (for admin date input).
 */
export function normalizePublicationDateTextForState(raw: string): string {
  const t = String(raw ?? "").trim();
  if (ISO_DATE.test(t)) return t;
  const d = new Date(t);
  if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return "";
}

/**
 * Public label for listing / press release header. ISO dates format as long English text; legacy strings pass through.
 */
export function formatPublicationDateLabel(dateText: string): string {
  const t = String(dateText ?? "").trim();
  if (ISO_DATE.test(t)) {
    const [y, m, d] = t.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
  }
  return t;
}
