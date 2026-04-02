import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const CMS_SCOPES = ["faqs", "publications", "about-snippets"] as const;
export type CmsScope = (typeof CMS_SCOPES)[number];

export function isCmsScope(value: string): value is CmsScope {
  return CMS_SCOPES.includes(value as CmsScope);
}

export async function createCmsRevision(
  scope: CmsScope,
  snapshot: Prisma.InputJsonValue,
  createdById?: string,
  options?: { title?: string; note?: string },
) {
  await prisma.cmsRevision.create({
    data: {
      scope,
      snapshot,
      createdById: createdById ?? null,
      title: options?.title?.trim() || null,
      note: options?.note?.trim() || null,
    },
  });
}

export async function listCmsRevisions(scope: CmsScope, take = 10) {
  return prisma.cmsRevision.findMany({
    where: { scope },
    orderBy: { createdAt: "desc" },
    take,
    select: {
      id: true,
      scope: true,
      title: true,
      note: true,
      createdAt: true,
      createdBy: { select: { fullName: true, email: true } },
    },
  });
}

export async function getCmsRevisionById(scope: CmsScope, id: string) {
  return prisma.cmsRevision.findFirst({
    where: { id, scope },
    select: { id: true, scope: true, snapshot: true, createdAt: true },
  });
}
