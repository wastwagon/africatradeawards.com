'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
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
const eventOpenAtMs = new Date('2026-01-28T18:30:00+00:00').getTime()

export default function HeroSection() {
	const { eventLiveStreamEnabled, eventLiveStreamTitle } = useSiteConfig()
	const [secondsLeft, setSecondsLeft] = useState(0)
	const liveAria =
		eventLiveStreamTitle.trim().length > 0
			? `${eventLiveStreamTitle.trim()} — open live page`
			: 'Watch live stream'
	useEffect(() => {
		const tick = () => {
			const diff = Math.max(0, Math.floor((eventOpenAtMs - Date.now()) / 1000))
			setSecondsLeft(diff)
		}
		tick()
		const timer = setInterval(tick, 1000)
		return () => clearInterval(timer)
	}, [])

	const days = Math.floor(secondsLeft / 86400)
	const hours = Math.floor((secondsLeft % 86400) / 3600)
	const minutes = Math.floor((secondsLeft % 3600) / 60)
	const seconds = secondsLeft % 60

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
					<h1 className="hero-banner-heading">Africa Trade Awards 2026</h1>
					<p className="hero-banner-tagline">
						The continent&apos;s trade leaders, institutions, and finalists gather in Accra for two days — one summit
						programme, one gala night, audience voting, and recognition on the main stage.
					</p>
					<div className="hero-banner-highlights" aria-label="Event highlights">
						<span>Summit programme</span>
						<span>Gala &amp; recognition</span>
						<span>Voting &amp; networking</span>
					</div>
					<div className="hero-banner-countdown" aria-label="Time remaining to event opening">
						<div className="hero-banner-countdown-item">
							<strong>{days}</strong>
							<span>Days</span>
						</div>
						<div className="hero-banner-countdown-item">
							<strong>{hours}</strong>
							<span>Hours</span>
						</div>
						<div className="hero-banner-countdown-item">
							<strong>{minutes}</strong>
							<span>Min</span>
						</div>
						<div className="hero-banner-countdown-item">
							<strong>{seconds}</strong>
							<span>Sec</span>
						</div>
					</div>
					<div className="hero-banner-actions">
						<Link href="/event/register/" className="hero-banner-cta hero-banner-btn-primary">
							Reserve your seat
						</Link>
						<Link href="/event/" className="hero-banner-cta hero-banner-btn-secondary">
							Review programme
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
					</div>
					<div className="hero-banner-tertiary-links" aria-label="Additional actions">
						<Link href="/portal/entrant/">Entrants: open submission portal</Link>
						<Link href="/nominate/">Submit a nomination</Link>
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
				.hero-banner-section::after {
					content: '';
					position: absolute;
					inset: 0;
					z-index: 5;
					pointer-events: none;
					background:
						radial-gradient(circle at 16% 22%, rgba(255, 216, 150, 0.2) 0%, transparent 30%),
						radial-gradient(circle at 84% 78%, rgba(106, 127, 232, 0.16) 0%, transparent 34%);
					animation: heroGlowFloat 8s ease-in-out infinite alternate;
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
					transform: scale(1.05);
					animation: heroImagePulse 16s ease-in-out infinite alternate;
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
						height: 84vh;
						min-height: 410px;
						max-height: none;
					}
					.hero-banner-slider-nav {
						width: 44px;
						height: 44px;
						top: auto;
						bottom: 14px;
						transform: none;
					}
					.hero-banner-slider-nav i { font-size: 16px; }
					.hero-banner-slider-prev { left: 14px; }
					.hero-banner-slider-next { right: 14px; }
					.hero-banner-slider-pagination { bottom: 14px; }
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
					animation: heroHeadingRise 0.65s ease-out both;
				}
				.hero-banner-tagline {
					font-family: var(--figtree), system-ui, sans-serif;
					font-size: clamp(0.95rem, 2.2vw, 1.125rem);
					line-height: 1.55;
					color: rgba(255,255,255,0.88);
					max-width: 640px;
					margin: 0 auto 22px;
					animation: heroHeadingRise 0.75s ease-out both;
				}
				.hero-banner-highlights {
					display: flex;
					flex-wrap: wrap;
					gap: 8px 10px;
					justify-content: center;
					margin: 0 0 18px;
				}
				.hero-banner-highlights span {
					display: inline-flex;
					align-items: center;
					padding: 6px 10px;
					border-radius: 999px;
					border: 1px solid rgba(255, 255, 255, 0.32);
					background: rgba(255, 255, 255, 0.08);
					color: rgba(255, 255, 255, 0.95);
					font-family: var(--figtree), system-ui, sans-serif;
					font-size: 0.72rem;
					font-weight: 600;
					letter-spacing: 0.03em;
					text-transform: uppercase;
				}
				.hero-banner-countdown {
					display: inline-flex;
					align-items: center;
					gap: 8px;
					margin: 0 auto 18px;
					padding: 8px 10px;
					border-radius: 12px;
					border: 1px solid rgba(255, 255, 255, 0.22);
					background: rgba(10, 8, 16, 0.42);
					backdrop-filter: blur(8px);
					animation: heroHeadingRise 0.85s ease-out both;
				}
				.hero-banner-countdown-item {
					min-width: 58px;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					padding: 6px 8px;
					border-radius: 8px;
					background: rgba(255, 255, 255, 0.08);
				}
				.hero-banner-countdown-item strong {
					font-family: var(--grotesk), sans-serif;
					font-size: 1rem;
					font-weight: 700;
					line-height: 1.1;
					color: #fff;
				}
				.hero-banner-countdown-item span {
					font-family: var(--figtree), system-ui, sans-serif;
					font-size: 0.62rem;
					letter-spacing: 0.08em;
					text-transform: uppercase;
					color: rgba(255, 255, 255, 0.82);
				}
				.hero-banner-actions {
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					gap: 12px 14px;
					justify-content: center;
					align-items: center;
					animation: heroHeadingRise 0.95s ease-out both;
				}
				.hero-banner-tertiary-links {
					margin-top: 12px;
					display: flex;
					flex-wrap: wrap;
					gap: 10px 16px;
					justify-content: center;
				}
				.hero-banner-tertiary-links :global(a) {
					font-family: var(--figtree), system-ui, sans-serif;
					font-size: 0.82rem;
					font-weight: 600;
					color: rgba(255, 255, 255, 0.88);
					text-decoration: underline;
					text-underline-offset: 3px;
				}
				.hero-banner-tertiary-links :global(a):hover {
					color: #fff;
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
					.hero-banner-overlay {
						padding: 0 12px 112px;
						align-items: flex-end;
					}
					.hero-banner-eyebrow {
						font-size: 0.66rem;
						letter-spacing: 0.14em;
						margin-bottom: 8px;
					}
					.hero-banner-heading {
						font-size: clamp(1.8rem, 9vw, 2.2rem);
						line-height: 1.08;
						margin-bottom: 10px;
					}
					.hero-banner-tagline {
						font-size: 0.9rem;
						line-height: 1.45;
						margin-bottom: 16px;
					}
					.hero-banner-highlights {
						gap: 6px 8px;
						margin-bottom: 14px;
					}
					.hero-banner-countdown {
						width: 100%;
						max-width: 340px;
						gap: 6px;
						padding: 8px;
					}
					.hero-banner-countdown-item {
						min-width: 0;
						flex: 1 1 0;
						padding: 6px 4px;
					}
					.hero-banner-countdown-item strong {
						font-size: 0.92rem;
					}
					.hero-banner-highlights span {
						font-size: 0.66rem;
						padding: 5px 9px;
					}
					/* Keep buttons on one row when they fit; wrap to next line only if needed. Never stack full-width. */
					.hero-banner-actions {
						flex-direction: row;
						flex-wrap: wrap;
						align-items: center;
						justify-content: center;
					}
					section.hero-banner-section .hero-banner-cta {
						min-height: 44px;
						padding: 0 0.92rem;
						font-size: 0.72rem;
						letter-spacing: 0.045em;
					}
					.hero-banner-actions {
						gap: 8px;
					}
					.hero-banner-actions > :global(a) {
						flex: 1 1 calc(50% - 8px);
						min-width: 136px;
					}
					.hero-banner-tertiary-links :global(a) {
						font-size: 0.74rem;
					}
				}
				@media (max-width: 413px) {
					.hero-banner-overlay {
						padding: 0 10px 76px;
					}
					.hero-banner-actions > :global(a) {
						flex: 1 1 100%;
						min-width: 0;
					}
				}
				@keyframes heroHeadingRise {
					from {
						opacity: 0;
						transform: translateY(12px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
				@keyframes heroGlowFloat {
					from {
						opacity: 0.7;
						transform: translateY(0);
					}
					to {
						opacity: 1;
						transform: translateY(-8px);
					}
				}
				@keyframes heroImagePulse {
					from {
						transform: scale(1.03);
					}
					to {
						transform: scale(1.08);
					}
				}
			`}</style>
		</section>
	)
}
