'use client'

import Layout from '@/components/layout/Layout'
import Link from 'next/link'
import Image from 'next/image'
import type { CmsPublicationItem } from '@/lib/cms-defaults'
import { formatPublicationDateLabel } from '@/lib/cms-publication-date'
import { normalizePublicationBodyToLegacy } from '@/lib/normalize-publication-body'
import { sanitizePublicationBodyHtml } from '@/lib/sanitize-publication-html'
import { useEffect, useRef } from 'react'

export default function PublicationPressReleaseView({ publication }: { publication: CmsPublicationItem }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const html = normalizePublicationBodyToLegacy(
    sanitizePublicationBodyHtml(publication.body ?? '').trim(),
  )

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.play().catch((error) => {
        console.warn('Video autoplay failed:', error)
      })
    }
  }, [])

  return (
    <Layout>
      <div>
        <div className="inner-page-header publications-single-header">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="header-video-background"
          >
            <source src="/assets/video/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="container">
            <div className="row">
              <div className="col-lg-8 m-auto">
                <div className="heading1 text-center">
                  <div className="space20" />
                  <>
                    <Link href="/"><span className="breadcrumb-home">Home</span></Link>{' '}
                    <i className="fa-solid fa-angle-right" />{' '}
                    <Link href="/publications"><span className="breadcrumb-home">Publications</span></Link>{' '}
                    <i className="fa-solid fa-angle-right" />{' '}
                    <span className="breadcrumb-current">Press Release</span>
                  </>
                </div>
              </div>
            </div>
          </div>
        </div>

        <article className="press-release-page">
          <div className="container">
            <div className="row">
              <div className="col-lg-10 m-auto">
                <header className="press-release-header">
                  <p className="press-release-label">FOR IMMEDIATE RELEASE</p>
                  <h1 className="press-release-title">{publication.title}</h1>
                  <p className="press-release-dateline">
                    {publication.dateline ? `${publication.dateline} | ` : ''}
                    {formatPublicationDateLabel(publication.dateText)}
                  </p>
                </header>

                {html ? (
                  <div className="press-release-cms-html" dangerouslySetInnerHTML={{ __html: html }} />
                ) : (
                  <div className="press-release-body">
                    {publication.image ? (
                      <div className="publication-card-image" style={{ marginBottom: 20 }}>
                        <Image src={publication.image} alt={publication.title} width={1400} height={780} />
                      </div>
                    ) : null}
                    <p>{publication.excerpt}</p>
                    {publication.href &&
                    publication.href.startsWith('/') &&
                    publication.href !== `/publications/${publication.slug}` ? (
                      <p style={{ marginTop: 16 }}>
                        <Link href={publication.href}>Open linked page</Link>
                      </p>
                    ) : null}
                  </div>
                )}
                <div className="press-release-back">
                  <Link href="/publications" className="vl-btn1 publication-back-btn">
                    <i className="fa-solid fa-arrow-left" /> Back to Publications
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </Layout>
  )
}
