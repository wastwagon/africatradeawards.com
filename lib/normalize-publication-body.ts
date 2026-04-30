/**
 * Normalizes sanitized CMS publication HTML so legacy publication styles apply
 * to both old seeded markup and new WYSIWYG-authored content.
 */
export function normalizePublicationBodyToLegacy(rawHtml: string): string {
  let html = String(rawHtml ?? "").trim();
  if (!html) return "";

  // If this is already legacy body, keep idempotent behavior.
  const hasLegacyBody = /class\s*=\s*["'][^"']*\bpress-release-body\b[^"']*["']/i.test(html);

  // Keep legacy image framing class.
  html = html.replace(
    /<figure(?![^>]*\bpress-release-inline-image\b)([^>]*)>/gi,
    '<figure class="press-release-inline-image"$1>',
  );

  // Wrap standalone images into legacy figure block.
  html = html.replace(
    /(^|>)(\s*)<img\b([^>]*?)>(\s*)(?=<|$)/gi,
    '$1$2<figure class="press-release-inline-image"><img$3></figure>$4',
  );

  // Keep heading style hook.
  html = html.replace(
    /<h2(?![^>]*\bpress-release-h2\b)([^>]*)>/gi,
    '<h2 class="press-release-h2"$1>',
  );

  // Tier headings should use legacy class.
  html = html.replace(
    /<h3(?![^>]*\baward-tier-title\b)([^>]*)>(\s*Tier\b[\s\S]*?)<\/h3>/gi,
    '<h3 class="award-tier-title"$1>$2</h3>',
  );

  // Contact block class hook (when present without class).
  html = html.replace(
    /<footer(?![^>]*\bpress-release-contact\b)([^>]*)>/gi,
    '<footer class="press-release-contact"$1>',
  );

  // Group tier title + list into award-tier sections when not already wrapped.
  html = html.replace(
    /(<h3[^>]*\baward-tier-title\b[^>]*>[\s\S]*?<\/h3>\s*(?:<(?:ul|ol)[\s\S]*?<\/(?:ul|ol)>))/gi,
    '<section class="award-tier">$1</section>',
  );

  // If author wrote "Media Contact" as heading but not inside footer, wrap tail.
  if (!/\bpress-release-contact\b/i.test(html)) {
    const mediaContactMatch = html.match(
      /(<(?:h2|h3|p)[^>]*>\s*(?:<strong>)?\s*Media Contact:?\s*(?:<\/strong>)?\s*<\/(?:h2|h3|p)>[\s\S]*)$/i,
    );
    if (mediaContactMatch) {
      const tail = mediaContactMatch[1];
      const head = html.slice(0, html.length - tail.length);
      html = `${head}<footer class="press-release-contact">${tail}</footer>`;
    }
  }

  // Guarantee top-level legacy body wrapper for baseline typography/list spacing.
  if (!hasLegacyBody) {
    const footerMatch = html.match(/<footer[^>]*\bpress-release-contact\b[\s\S]*<\/footer>\s*$/i);
    if (footerMatch) {
      const footer = footerMatch[0];
      const bodyOnly = html.slice(0, html.length - footer.length).trim();
      html = `<div class="press-release-body">${bodyOnly}</div>${footer}`;
    } else {
      html = `<div class="press-release-body">${html}</div>`;
    }
  }

  return html;
}
