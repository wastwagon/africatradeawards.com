import DOMPurify from "isomorphic-dompurify";

/**
 * Strip scripts and unsafe markup from CMS publication body HTML before persistence or render authority.
 */
export function sanitizePublicationBodyHtml(dirty: string | null | undefined): string {
  const raw = dirty == null ? "" : String(dirty);
  const cleaned = DOMPurify.sanitize(raw, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "s",
      "h2",
      "h3",
      "ul",
      "ol",
      "li",
      "a",
      "img",
      "blockquote",
      "figure",
      "figcaption",
      "section",
      "footer",
      "div",
      "span",
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "src", "alt", "width", "height", "loading", "class"],
    ALLOW_DATA_ATTR: false,
  });
  return cleaned.trim();
}
