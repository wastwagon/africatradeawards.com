import { prisma } from "@/lib/prisma";
import {
  DEFAULT_ABOUT_SNIPPETS,
  DEFAULT_FAQS,
  DEFAULT_PUBLICATIONS,
  type CmsFaqItem,
  type CmsPublicationItem,
  type CmsSnippetItem,
} from "@/lib/cms-defaults";

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
