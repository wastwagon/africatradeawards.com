'use client'

import Layout from '@/components/layout/Layout'
import Link from 'next/link'
import { galleryImages } from '@/data/gallery'
import GallerySlider from '@/components/elements/GallerySlider'

const AUTOPLAY_MS = 5500

export default function GalleryPage() {
	return (
		<Layout headerStyle={1} footerStyle={1}>
			{/* Page Header */}
			<div className="inner-page-header">
				<div className="container">
					<div className="row">
						<div className="col-lg-4 m-auto">
							<div className="heading1 text-center">
								<div className="space20" />
								<Link href="/">
									<span className="breadcrumb-home">Home</span>
									<i className="fa-solid fa-angle-right" />
									<span className="breadcrumb-current">Gallery</span>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Premium auto slideshow */}
			<section className="gallery-premium-section">
				<div className="gallery-premium-header" data-aos="fade-up" data-aos-duration={600}>
					<span className="gallery-premium-badge">Africa Trade Awards 2026</span>
					<h1 className="gallery-premium-title">Gallery</h1>
					<p className="gallery-premium-subtitle">Moments from the ceremony and celebrations</p>
				</div>
				<div className="gallery-premium-slider-wrap" data-aos="fade-up" data-aos-duration={800} data-aos-delay={150}>
					<GallerySlider
						images={galleryImages}
						alt="Africa Trade Awards Gallery"
						autoplayMs={AUTOPLAY_MS}
						className="gallery-premium-slider"
						showCounter={false}
						transition="fade"
					/>
				</div>
			</section>

			<style jsx>{`
				.gallery-premium-section {
					padding: 20px 0 72px;
					background: linear-gradient(180deg, #0d0b0e 0%, #1a1518 35%, #251f28 100%);
					min-height: 100vh;
					position: relative;
				}
				.gallery-premium-header {
					text-align: center;
					padding: 32px 24px 40px;
					max-width: 560px;
					margin: 0 auto;
				}
				.gallery-premium-badge {
					display: inline-block;
					font-size: 10px;
					font-weight: 700;
					letter-spacing: 2px;
					color: rgba(255, 255, 255, 0.5);
					margin-bottom: 14px;
					text-transform: uppercase;
				}
				.gallery-premium-title {
					font-size: clamp(28px, 4vw, 42px);
					font-weight: 700;
					color: #fff;
					margin: 0 0 10px;
					letter-spacing: -0.02em;
				}
				.gallery-premium-subtitle {
					font-size: 15px;
					color: rgba(255, 255, 255, 0.7);
					margin: 0;
					line-height: 1.5;
				}
				.gallery-premium-slider-wrap {
					position: relative;
					max-width: 1280px;
					margin: 0 auto;
					padding: 0 24px;
				}
				:global(.gallery-premium-slider) {
					--gallery-nav-size: 56px;
				}
				:global(.gallery-premium-slider .gallery-slider-main) {
					border-radius: 20px;
					overflow: hidden;
					box-shadow: 0 32px 80px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.06);
				}
				:global(.gallery-premium-slider .gallery-slider-hero) {
					aspect-ratio: 16 / 9;
				}
				:global(.gallery-premium-slider .gallery-slider-nav) {
					background: rgba(0, 0, 0, 0.4);
					border-color: rgba(255, 255, 255, 0.2);
					backdrop-filter: blur(16px);
				}
				:global(.gallery-premium-slider .gallery-slider-nav:hover) {
					background: rgba(0, 0, 0, 0.55);
					border-color: rgba(255, 255, 255, 0.35);
				}
				:global(.gallery-premium-slider .gallery-slider-footer) {
					padding: 20px 20px 0;
					justify-content: center;
				}
				:global(.gallery-premium-slider .gallery-slider-dot) {
					width: 10px;
					height: 10px;
					background: rgba(255, 255, 255, 0.35);
				}
				:global(.gallery-premium-slider .gallery-slider-dot.active) {
					background: #fff;
					box-shadow: 0 0 12px rgba(255, 255, 255, 0.5);
				}
				:global(.gallery-premium-slider .gallery-slider-dot:hover) {
					background: rgba(255, 255, 255, 0.6);
				}
				@media (max-width: 991px) {
					.gallery-premium-section {
						padding: 16px 0 56px;
					}
					.gallery-premium-header {
						padding: 24px 20px 32px;
					}
					.gallery-premium-slider-wrap {
						padding: 0 16px;
					}
					:global(.gallery-premium-slider .gallery-slider-hero) {
						aspect-ratio: 4 / 3;
					}
				}
				@media (max-width: 575px) {
					.gallery-premium-section {
						padding: 12px 0 48px;
					}
					.gallery-premium-title {
						font-size: 26px;
					}
					.gallery-premium-subtitle {
						font-size: 14px;
					}
				}
			`}</style>
		</Layout>
	)
}
