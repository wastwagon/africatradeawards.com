'use client'

import Layout from '@/components/layout/Layout'
import { DEFAULT_PUBLICATIONS } from '@/lib/cms-defaults'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

export default function PublicationsPage() {
	const videoRef = useRef<HTMLVideoElement>(null)
	const [publications, setPublications] = useState(DEFAULT_PUBLICATIONS)

	useEffect(() => {
		const video = videoRef.current
		if (video) {
			video.play().catch((error) => {
				console.warn('Video autoplay failed:', error)
			})
		}
	}, [])

	useEffect(() => {
		void (async () => {
			try {
				const res = await fetch('/api/site/publications', { cache: 'no-store' })
				const data = await res.json()
				if (!res.ok || !Array.isArray(data.publications)) return
				setPublications(
					data.publications.map((item: Record<string, unknown>) => ({
						slug: String(item.slug ?? ''),
						title: String(item.title ?? ''),
						excerpt: String(item.excerpt ?? ''),
						dateText: String(item.dateText ?? item.date ?? ''),
						dateline: String(item.dateline ?? ''),
						image: String(item.image ?? ''),
						href: String(item.href ?? `/publications/${item.slug ?? ''}`),
						sortOrder: Number(item.sortOrder ?? 0),
						published: Boolean(item.published ?? true),
					}))
				)
			} catch {
				// Keep defaults on failure.
			}
		})()
	}, [])

	return (
		<Layout>
			<div>
				<div className="inner-page-header publications-page-header">
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
							<div className="col-lg-6 m-auto">
								<div className="heading1 text-center">
									<div className="space20" />
									<Link href="/">
										<span className="breadcrumb-home">Home</span>{' '}
										<i className="fa-solid fa-angle-right" />{' '}
										<span className="breadcrumb-current">Publications</span>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="publications-section-area sp1">
					<div className="container">
						<div className="row">
							<div className="col-12">
								<div className="publications-intro text-center">
									<h2 className="publications-section-title">Press Releases &amp; News</h2>
									<p className="publications-section-subtitle">
										Official statements and announcements from the Africa Trade Chamber and Africa Trade Awards.
									</p>
								</div>
							</div>
						</div>
						<div className="row publications-grid">
							{publications.map((pub, index) => (
								<div
									key={pub.slug}
									className="col-lg-4 col-md-6"
									data-aos="fade-up"
									data-aos-duration={600}
									data-aos-delay={index * 100}
								>
									<Link href={pub.href || `/publications/${pub.slug}`} className="publication-card-link">
										<article className="publication-card">
											<div className="publication-card-accent" />
											{pub.image && (
												<div className="publication-card-image">
													<Image
														src={pub.image}
														alt={pub.title}
														width={1200}
														height={700}
													/>
												</div>
											)}
											<div className="publication-card-body">
												<span className="publication-card-badge">Press Release</span>
												<h3 className="publication-card-title">{pub.title}</h3>
												<p className="publication-card-excerpt">{pub.excerpt}</p>
												<div className="publication-card-meta">
													<span className="publication-card-date">
														<i className="fa-solid fa-calendar-days" /> {pub.dateline && `${pub.dateline} | `}{pub.dateText}
													</span>
												</div>
												<span className="publication-card-cta">
													Read full release <i className="fa-solid fa-arrow-right" />
												</span>
											</div>
										</article>
									</Link>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</Layout>
	)
}
