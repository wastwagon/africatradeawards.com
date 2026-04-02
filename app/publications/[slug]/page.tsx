import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Layout from "@/components/layout/Layout";
import { getCmsPublicationBySlug } from "@/lib/cms-content";

export default async function PublicationDetailPage({ params }: { params: { slug: string } }) {
  const publication = await getCmsPublicationBySlug(params.slug);
  if (!publication) {
    notFound();
  }

  const internalHref = publication.href.startsWith("/") ? publication.href : "";
  const readLink = internalHref && internalHref !== `/publications/${publication.slug}` ? internalHref : "";

  return (
    <Layout>
      <div className="publications-section-area sp1">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 m-auto">
              <p className="admin-backlink">
                <Link href="/publications">← Back to publications</Link>
              </p>
              <article className="publication-card" style={{ padding: 24 }}>
                <span className="publication-card-badge">Press Release</span>
                <h1 className="publication-card-title" style={{ marginTop: 10 }}>
                  {publication.title}
                </h1>
                <p className="publication-card-date">
                  <i className="fa-solid fa-calendar-days" /> {publication.dateline ? `${publication.dateline} | ` : ""}
                  {publication.dateText}
                </p>
                {publication.image ? (
                  <div className="publication-card-image" style={{ marginTop: 16 }}>
                    <Image src={publication.image} alt={publication.title} width={1400} height={780} />
                  </div>
                ) : null}
                <p style={{ marginTop: 18 }}>{publication.excerpt}</p>
                {readLink ? (
                  <p style={{ marginTop: 16 }}>
                    <Link href={readLink}>Open full publication page</Link>
                  </p>
                ) : null}
              </article>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
