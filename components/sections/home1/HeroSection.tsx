'use client'

import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules'
import { heroBannerImages } from '@/app/assets/hero'

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
					<p className="hero-banner-eyebrow">28–29 January 2026 · Accra, Ghana</p>
					<h1 className="hero-banner-heading">Africa Trade Awards</h1>
					<p className="hero-banner-tagline">
						Celebrating the people and organisations advancing Africa&apos;s trade and industrial future—live recognition,
						public voice, and programmes you can join online.
					</p>
					<div className="hero-banner-actions">
						<Link href="/vote/" className="vl-btn1 hero-banner-btn-primary">
							Cast Your Vote
						</Link>
						<Link href="/portal/entrant/" className="hero-banner-btn-secondary">
							Enter your submission
						</Link>
						<Link href="/login/" className="hero-banner-tertiary">
							Sign In for Your Dashboard
							<i className="fa-solid fa-arrow-right" aria-hidden />
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
					flex-wrap: wrap;
					gap: 12px 14px;
					justify-content: center;
					align-items: center;
				}
				.hero-banner-btn-primary.vl-btn1 {
					box-shadow: 0 6px 20px rgba(0,0,0,0.35);
				}
				.hero-banner-btn-secondary {
					font-family: var(--grotesk), sans-serif;
					font-size: 0.81rem;
					font-weight: 700;
					text-transform: uppercase;
					letter-spacing: 0.06em;
					padding: 14px 26px;
					border-radius: 8px;
					background: rgba(255,255,255,0.12);
					border: 1px solid rgba(255,255,255,0.45);
					color: #fff;
					text-decoration: none;
					backdrop-filter: blur(8px);
					transition: background 0.25s, transform 0.2s;
				}
				.hero-banner-btn-secondary:hover {
					background: rgba(255,255,255,0.22);
					color: #fff;
					transform: translateY(-2px);
				}
				.hero-banner-tertiary {
					display: inline-flex;
					align-items: center;
					gap: 8px;
					font-family: var(--grotesk), sans-serif;
					font-size: 0.9rem;
					font-weight: 600;
					color: rgba(255,255,255,0.95);
					text-decoration: none;
					border-bottom: 2px solid rgba(255, 200, 120, 0.6);
					padding-bottom: 2px;
				}
				.hero-banner-tertiary:hover {
					color: #ffe8b8;
					border-bottom-color: #ffe8b8;
				}
				@media (max-width: 575px) {
					.hero-banner-overlay { padding-bottom: 96px; }
					.hero-banner-actions { flex-direction: column; }
				}
			`}</style>
		</section>
	)
}
