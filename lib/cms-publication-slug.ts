/**
 * Shared slug rules for CMS publications (admin UI + API).
 */
export function normalizePublicationSlug(raw: string): string {
  return String(raw ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-");
}

export function publicationHrefFromSlug(slug: string): string {
  const s = normalizePublicationSlug(slug);
  if (!s) return "";
  return `/publications/${s}`;
}
