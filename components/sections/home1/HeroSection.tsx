'use client'

import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules'
import { heroBannerImages } from '@/app/assets/hero'
import { useSiteConfig } from '@/components/site/SiteConfigProvider'

const swiperOptions = {
	modules: [Autoplay, Navigation, Pagination, EffectFade],
	slidesPerView: 1,
	effect: 'fade' as const,
	fadeEffect: { crossFade: true },
	autoplay: { delay: 5000, disableOnInteraction: false },
	loop: true,
	speed: 1000,
	navigation: {
		nextEl: '.hero-banner-slider-next',
		prevEl: '.hero-banner-slider-prev',
	},
	pagination: {
		el: '.hero-banner-slider-pagination',
		clickable: true,
		type: 'bullets' as const,
	},
}

export default function HeroSection() {
	const { eventLiveStreamEnabled, eventLiveStreamTitle, heroBarDateLine, heroBarVenueLine } = useSiteConfig()
	const liveAria =
		eventLiveStreamTitle.trim().length > 0
			? `${eventLiveStreamTitle.trim()} — open live page`
			: 'Watch live stream'
	const heroDateVenueLine = `${heroBarDateLine.trim() || '28–29 January 2026'} · ${heroBarVenueLine.trim() || 'Accra, Ghana'}`

	return (
		<section className="hero-banner-section" aria-label="Hero banner">
			<Swiper {...swiperOptions} className="hero-banner-swiper">
				{heroBannerImages.map((src, i) => (
					<SwiperSlide key={i}>
						<div className="hero-banner-slide">
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								src={src}
								alt={`Africa Trade Awards 2026 ${i + 1}`}
								className="hero-banner-slide-img"
								loading={i === 0 ? 'eager' : 'lazy'}
								decoding="async"
							/>
						</div>
					</SwiperSlide>
				))}
			</Swiper>

			<button type="button" className="hero-banner-slider-nav hero-banner-slider-prev" aria-label="Previous">
				<i className="fa-solid fa-chevron-left" />
			</button>
			<button type="button" className="hero-banner-slider-nav hero-banner-slider-next" aria-label="Next">
				<i className="fa-solid fa-chevron-right" />
			</button>
			<div className="hero-banner-slider-pagination" />

			<div className="hero-banner-overlay" aria-hidden="false">
				<div className="container hero-banner-overlay-inner">
					<p className="hero-banner-eyebrow">{heroDateVenueLine}</p>
					<h1 className="hero-banner-heading">Africa Trade Awards</h1>
					<p className="hero-banner-tagline">
						Celebrating the people and organisations advancing Africa&apos;s trade and industrial future—live recognition,
						public voice, and programmes you can join online.
					</p>
					<div className="hero-banner-actions">
						<Link href="/vote/" className="hero-banner-cta hero-banner-btn-primary">
							Cast Your Vote
						</Link>
						{eventLiveStreamEnabled ? (
							<Link
								href="/live/"
								className="hero-banner-cta hero-banner-btn-secondary hero-banner-btn-live"
								aria-label={liveAria}
							>
								<i className="fa-solid fa-circle-play" aria-hidden />
								Watch live
							</Link>
						) : null}
						<Link href="/portal/entrant/" className="hero-banner-cta hero-banner-btn-secondary">
							Enter your submission
						</Link>
					</div>
				</div>
			</div>

			<style jsx global>{`
				.hero-banner-section {
					position: relative;
					width: 100%;
					max-width: 100vw;
					height: 88vh;
					min-height: 520px;
					max-height: 920px;
					overflow: hidden;
					background: #1a1518;
				}
				.hero-banner-swiper {
					width: 100%;
					height: 100%;
				}
				.hero-banner-swiper .swiper-slide {
					width: 100%;
					height: 100%;
				}
				.hero-banner-slide {
					position: relative;
					width: 100%;
					height: 100%;
				}
				:global(.hero-banner-slide-img) {
					position: absolute;
					inset: 0;
					width: 100%;
					height: 100%;
					object-fit: cover !important;
					object-position: center center !important;
				}
				.hero-banner-slider-nav {
					position: absolute;
					top: 50%;
					transform: translateY(-50%);
					width: 52px;
					height: 52px;
					border-radius: 50%;
					background: rgba(255,255,255,0.15);
					backdrop-filter: blur(12px);
					border: 1px solid rgba(255,255,255,0.3);
					color: #fff;
					display: flex;
					align-items: center;
					justify-content: center;
					cursor: pointer;
					z-index: 10;
					transition: all 0.25s ease;
				}
				.hero-banner-slider-nav:hover {
					background: rgba(255,255,255,0.25);
					border-color: rgba(255,255,255,0.5);
					transform: translateY(-50%) scale(1.08);
				}
				.hero-banner-slider-nav i { font-size: 20px; }
				.hero-banner-slider-prev { left: 24px; }
				.hero-banner-slider-next { right: 24px; }
				.hero-banner-slider-pagination {
					position: absolute;
					bottom: 28px;
					left: 50%;
					transform: translateX(-50%);
					z-index: 10;
				}
				.hero-banner-slider-pagination :global(.swiper-pagination-bullet) {
					width: 10px;
					height: 10px;
					background: rgba(255,255,255,0.45);
					margin: 0 5px;
					opacity: 1;
					transition: all 0.25s ease;
				}
				.hero-banner-slider-pagination :global(.swiper-pagination-bullet-active) {
					width: 32px;
					border-radius: 5px;
					background: #fff;
				}
				@media (max-width: 991px) {
					.hero-banner-section {
						height: 80vh;
						min-height: 420px;
						max-height: 720px;
					}
				}
				@media (max-width: 575px) {
					.hero-banner-section {
						height: 82vh;
						min-height: 380px;
						max-height: none;
					}
					.hero-banner-slider-nav { width: 44px; height: 44px; }
					.hero-banner-slider-nav i { font-size: 16px; }
					.hero-banner-slider-prev { left: 14px; }
					.hero-banner-slider-next { right: 14px; }
					.hero-banner-slider-pagination { bottom: 20px; }
				}

				.hero-banner-overlay {
					position: absolute;
					inset: 0;
					z-index: 6;
					display: flex;
					align-items: flex-end;
					justify-content: center;
					padding: 0 16px 64px;
					pointer-events: none;
					background: linear-gradient(
						to top,
						rgba(12, 8, 14, 0.92) 0%,
						rgba(20, 12, 24, 0.55) 38%,
						rgba(26, 21, 24, 0.15) 62%,
						transparent 100%
					);
				}
				.hero-banner-overlay-inner {
					pointer-events: auto;
					text-align: center;
					max-width: 900px;
				}
				.hero-banner-eyebrow {
					font-family: var(--grotesk), sans-serif;
					font-size: 0.78rem;
					font-weight: 700;
					letter-spacing: 0.2em;
					text-transform: uppercase;
					color: rgba(255, 220, 160, 0.95);
					margin: 0 0 10px;
				}
				.hero-banner-heading {
					font-family: var(--grotesk), sans-serif;
					font-size: clamp(2rem, 6vw, 3.35rem);
					font-weight: 700;
					line-height: 1.05;
					color: #fff;
					margin: 0 0 12px;
					text-shadow: 0 2px 24px rgba(0,0,0,0.35);
				}
				.hero-banner-tagline {
					font-family: var(--figtree), system-ui, sans-serif;
					font-size: clamp(0.95rem, 2.2vw, 1.125rem);
					line-height: 1.55;
					color: rgba(255,255,255,0.88);
					max-width: 640px;
					margin: 0 auto 22px;
				}
				.hero-banner-actions {
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					gap: 12px 14px;
					justify-content: center;
					align-items: center;
				}
				/* Shrink to label width — avoid full-width in column flex / stretched layouts */
				.hero-banner-actions > :global(a) {
					flex: 0 0 auto;
					width: auto;
					max-width: 100%;
					text-align: center;
				}
				/* Shared shell for all hero CTAs (not .vl-btn1 — global styles fight height/line-height) */
				section.hero-banner-section .hero-banner-cta {
					font-family: var(--grotesk), sans-serif;
					font-size: 0.81rem;
					font-weight: 700;
					text-transform: uppercase;
					letter-spacing: 0.06em;
					line-height: 1;
					display: inline-flex;
					align-items: center;
					justify-content: center;
					min-height: 2.75rem;
					padding: 0 1.4rem;
					border-radius: 8px;
					box-sizing: border-box;
					text-decoration: none;
					transition: background 0.25s, transform 0.2s, box-shadow 0.2s, border-color 0.2s, color 0.2s;
				}
				section.hero-banner-section .hero-banner-btn-primary {
					color: #fff;
					background: linear-gradient(135deg, #4e2b5a 0%, #3d2247 50%, #5a6fd8 100%);
					border: 1px solid transparent;
					box-shadow: 0 4px 12px rgba(78, 43, 90, 0.35);
				}
				section.hero-banner-section .hero-banner-btn-primary:hover {
					color: #fff;
					background: linear-gradient(135deg, #5a3a66 0%, #4a2d55 50%, #6a7fe8 100%);
					box-shadow: 0 6px 16px rgba(78, 43, 90, 0.4);
					transform: translateY(-2px);
				}
				section.hero-banner-section .hero-banner-btn-secondary {
					background: rgba(255,255,255,0.12);
					border: 1px solid rgba(255,255,255,0.45);
					color: #fff;
					backdrop-filter: blur(8px);
				}
				section.hero-banner-section .hero-banner-btn-secondary:hover {
					background: rgba(255,255,255,0.22);
					color: #fff;
					transform: translateY(-2px);
				}
				.hero-banner-btn-live {
					display: inline-flex;
					align-items: center;
					gap: 8px;
					border-color: rgba(255, 200, 120, 0.7) !important;
					box-shadow: 0 0 0 1px rgba(255, 200, 120, 0.12);
				}
				.hero-banner-btn-live:hover {
					border-color: rgba(255, 220, 160, 0.9) !important;
				}
				@media (max-width: 575px) {
					.hero-banner-overlay { padding-bottom: 96px; }
					/* Keep buttons on one row when they fit; wrap to next line only if needed. Never stack full-width. */
					.hero-banner-actions {
						flex-direction: row;
						flex-wrap: wrap;
						align-items: center;
						justify-content: center;
					}
					section.hero-banner-section .hero-banner-cta {
						min-height: 2.5rem;
						padding: 0 1rem;
						font-size: 0.75rem;
					}
				}
			`}</style>
		</section>
	)
}
