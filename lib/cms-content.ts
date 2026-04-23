import { prisma } from "@/lib/prisma";
import {
  DEFAULT_ABOUT_SNIPPETS,
  DEFAULT_FAQS,
  DEFAULT_PUBLICATIONS,
  type CmsFaqItem,
  type CmsPublicationItem,
  type CmsSnippetItem,
} from "@/lib/cms-defaults";
import { normalizePublicationDateTextForState } from "@/lib/cms-publication-date";
import { publicationHrefFromSlug } from "@/lib/cms-publication-slug";

function shouldFallback(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return (
    error.message.includes("Environment variable not found: DATABASE_URL") ||
    error.message.includes("P2021") ||
    error.message.includes("Can't reach database server")
  );
}

export async function getCmsFaqs(): Promise<CmsFaqItem[]> {
  try {
    const now = new Date();
    const rows = await prisma.cmsFaq.findMany({
      where: {
        published: true,
        AND: [
          { OR: [{ publishAt: null }, { publishAt: { lte: now } }] },
          { OR: [{ unpublishAt: null }, { unpublishAt: { gt: now } }] },
        ],
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    if (rows.length === 0) return DEFAULT_FAQS;
    return rows.map((row) => ({
      question: row.question,
      answer: row.answer,
      category: row.category ?? "General",
      sortOrder: row.sortOrder,
      published: row.published,
      publishAt: row.publishAt?.toISOString(),
      unpublishAt: row.unpublishAt?.toISOString(),
    }));
  } catch (error) {
    if (shouldFallback(error)) return DEFAULT_FAQS;
    throw error;
  }
}

export async function getCmsPublications(): Promise<CmsPublicationItem[]> {
  try {
    const now = new Date();
    const rows = await prisma.cmsPublication.findMany({
      where: {
        published: true,
        AND: [
          { OR: [{ publishAt: null }, { publishAt: { lte: now } }] },
          { OR: [{ unpublishAt: null }, { unpublishAt: { gt: now } }] },
        ],
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    if (rows.length === 0) return DEFAULT_PUBLICATIONS;
    return rows.map((row) => ({
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      body: row.body ?? "",
      dateText: row.dateText,
      dateline: row.dateline ?? "",
      image: row.image ?? "",
      href: row.href ?? `/publications/${row.slug}`,
      sortOrder: row.sortOrder,
      published: row.published,
      publishAt: row.publishAt?.toISOString(),
      unpublishAt: row.unpublishAt?.toISOString(),
    }));
  } catch (error) {
    if (shouldFallback(error)) return DEFAULT_PUBLICATIONS;
    throw error;
  }
}

export async function getCmsPublicationBySlug(slug: string): Promise<CmsPublicationItem | null> {
  const normalized = slug.trim().toLowerCase();
  if (!normalized) return null;
  const now = new Date();
  try {
    const row = await prisma.cmsPublication.findFirst({
      where: {
        slug: normalized,
        published: true,
        AND: [
          { OR: [{ publishAt: null }, { publishAt: { lte: now } }] },
          { OR: [{ unpublishAt: null }, { unpublishAt: { gt: now } }] },
        ],
      },
    });
    if (!row) {
      const fallback = DEFAULT_PUBLICATIONS.find((item) => item.slug === normalized);
      return fallback ?? null;
    }
    return {
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      body: row.body ?? "",
      dateText: row.dateText,
      dateline: row.dateline ?? "",
      image: row.image ?? "",
      href: row.href ?? `/publications/${row.slug}`,
      sortOrder: row.sortOrder,
      published: row.published,
      publishAt: row.publishAt?.toISOString(),
      unpublishAt: row.unpublishAt?.toISOString(),
    };
  } catch (error) {
    if (shouldFallback(error)) {
      const fallback = DEFAULT_PUBLICATIONS.find((item) => item.slug === normalized);
      return fallback ?? null;
    }
    throw error;
  }
}

export async function getCmsAboutSnippets(): Promise<CmsSnippetItem[]> {
  try {
    const rows = await prisma.cmsSnippet.findMany({
      orderBy: [{ sortOrder: "asc" }, { key: "asc" }],
    });
    if (rows.length === 0) return DEFAULT_ABOUT_SNIPPETS;
    return rows.map((row) => ({
      key: row.key,
      label: row.label,
      content: row.content,
      sortOrder: row.sortOrder,
    }));
  } catch (error) {
    if (shouldFallback(error)) return DEFAULT_ABOUT_SNIPPETS;
    throw error;
  }
}

/** Same shapes as admin GET `/api/admin/cms/*` for the friendly CMS editor (no client mount fetch). */
export type AdminCmsEditorBundle = {
  faqs: CmsFaqItem[];
  publications: CmsPublicationItem[];
  snippets: CmsSnippetItem[];
};

export async function getAdminCmsEditorBundle(): Promise<AdminCmsEditorBundle> {
  try {
    const [faqRows, pubRows, snippetRows] = await Promise.all([
      prisma.cmsFaq.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] }),
      prisma.cmsPublication.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] }),
      prisma.cmsSnippet.findMany({ orderBy: [{ sortOrder: "asc" }, { key: "asc" }] }),
    ]);

    const faqs: CmsFaqItem[] =
      faqRows.length === 0
        ? DEFAULT_FAQS.map((faq, index) => ({
            ...faq,
            sortOrder: faq.sortOrder ?? index + 1,
            publishAt: faq.publishAt ?? "",
            unpublishAt: faq.unpublishAt ?? "",
          }))
        : faqRows.map((row, index) => ({
            question: row.question,
            answer: row.answer,
            category: row.category ?? "",
            sortOrder: row.sortOrder ?? index + 1,
            published: row.published,
            publishAt: row.publishAt?.toISOString() ?? "",
            unpublishAt: row.unpublishAt?.toISOString() ?? "",
          }));

    const publications: CmsPublicationItem[] =
      pubRows.length === 0
        ? DEFAULT_PUBLICATIONS.map((item, index) => ({
            ...item,
            body: item.body ?? "",
            sortOrder: item.sortOrder ?? index + 1,
            publishAt: item.publishAt ?? "",
            unpublishAt: item.unpublishAt ?? "",
          }))
        : pubRows.map((row, index) => ({
            slug: row.slug,
            title: row.title,
            excerpt: row.excerpt,
            body: row.body ?? "",
            dateText: normalizePublicationDateTextForState(row.dateText),
            dateline: row.dateline ?? "",
            image: row.image ?? "",
            href: publicationHrefFromSlug(row.slug),
            sortOrder: row.sortOrder ?? index + 1,
            published: row.published,
            publishAt: row.publishAt?.toISOString() ?? "",
            unpublishAt: row.unpublishAt?.toISOString() ?? "",
          }));

    const snippets: CmsSnippetItem[] =
      snippetRows.length === 0
        ? DEFAULT_ABOUT_SNIPPETS.map((item, index) => ({
            ...item,
            sortOrder: item.sortOrder ?? index + 1,
          }))
        : snippetRows.map((row, index) => ({
            key: row.key,
            label: row.label,
            content: row.content,
            sortOrder: row.sortOrder ?? index + 1,
          }));

    return { faqs, publications, snippets };
  } catch (error) {
    if (shouldFallback(error)) {
      return {
        faqs: DEFAULT_FAQS.map((faq, index) => ({
          ...faq,
          sortOrder: faq.sortOrder ?? index + 1,
          publishAt: faq.publishAt ?? "",
          unpublishAt: faq.unpublishAt ?? "",
        })),
        publications: DEFAULT_PUBLICATIONS.map((item, index) => ({
          ...item,
          body: item.body ?? "",
          sortOrder: item.sortOrder ?? index + 1,
          publishAt: item.publishAt ?? "",
          unpublishAt: item.unpublishAt ?? "",
        })),
        snippets: DEFAULT_ABOUT_SNIPPETS.map((item, index) => ({
          ...item,
          sortOrder: item.sortOrder ?? index + 1,
        })),
      };
    }
    throw error;
  }
}
