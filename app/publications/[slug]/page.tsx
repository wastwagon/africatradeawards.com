import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PublicationPressReleaseView from "@/components/publications/PublicationPressReleaseView";
import { getCmsPublicationBySlug } from "@/lib/cms-content";

/** Press release HTML and metadata come from Postgres (`CmsPublication`). */
export const dynamic = "force-dynamic";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const publication = await getCmsPublicationBySlug(params.slug);
  if (!publication) {
    return { title: "Publication" };
  }
  const description =
    publication.excerpt.length > 165 ? `${publication.excerpt.slice(0, 162)}…` : publication.excerpt;
  return {
    title: `${publication.title} | Press Release`,
    description,
  };
}

export default async function PublicationDetailPage({ params }: Props) {
  const publication = await getCmsPublicationBySlug(params.slug);
  if (!publication) {
    notFound();
  }
  return <PublicationPressReleaseView publication={publication} />;
}
