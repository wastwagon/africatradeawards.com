'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'

type PublicPageHeroProps = {
	title: string
	currentLabel: string
	subtitle?: string
	parentLabel?: string
	parentHref?: string
	useVideo?: boolean
}

export default function PublicPageHero({
	title,
	currentLabel,
	subtitle,
	parentLabel,
	parentHref,
	useVideo = true,
}: PublicPageHeroProps) {
	const videoRef = useRef<HTMLVideoElement>(null)

	useEffect(() => {
		if (!useVideo) return
		const video = videoRef.current
		if (video) {
			video.play().catch(() => {
				// Ignore autoplay restrictions.
			})
		}
	}, [useVideo])

	return (
		<div className="inner-page-header">
			{useVideo ? (
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
			) : null}
			<div className="container">
				<div className="row">
					<div className="col-lg-8 m-auto">
						<div className="heading1 text-center public-page-hero__content">
							<div className="space20" />
							<Link href="/">
								<span className="breadcrumb-home">Home</span>
							</Link>
							{parentLabel && parentHref ? (
								<>
									{' '}
									<i className="fa-solid fa-angle-right" />{' '}
									<Link href={parentHref}>
										<span className="breadcrumb-home">{parentLabel}</span>
									</Link>
								</>
							) : null}
							{' '}
							<i className="fa-solid fa-angle-right" />{' '}
							<span className="breadcrumb-current">{currentLabel}</span>
							<div className="space16" />
							<h1 className="text-white public-page-hero__title">{title}</h1>
							{subtitle ? (
								<>
									<div className="space12" />
									<p className="text-white-50 mb-0 public-page-hero__subtitle">{subtitle}</p>
								</>
							) : null}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
