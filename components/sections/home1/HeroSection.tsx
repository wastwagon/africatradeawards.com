'use client'

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
			`}</style>
		</section>
	)
}
