'use client'

import Link from 'next/link'
import { galleryImages } from '@/data/gallery'
import GallerySlider from '@/components/elements/GallerySlider'

export default function GallerySection() {
	const images = galleryImages

	return (
		<section className="home-gallery-section">
			<div className="container">
				<div className="row">
					<div className="col-lg-10 m-auto">
						<div className="home-gallery-header awards-header-compact text-center" data-aos="fade-up" data-aos-duration={600}>
							<h2 className="awards-title-compact">Gallery</h2>
							<div className="space16" />
							<p className="awards-intro-compact">A glimpse into the ceremony and celebrations.</p>
						</div>
						<div className="home-gallery-slider-wrap" data-aos="fade-up" data-aos-duration={800} data-aos-delay={150}>
							<GallerySlider
								images={images}
								alt="Africa Trade Awards"
								autoplayMs={5000}
								className="home-gallery-slider"
								showCounter={false}
							/>
							<div className="home-gallery-cta">
								<Link href="/gallery" className="cta-btn-primary">
									<span>View Full Gallery</span>
									<i className="fa-solid fa-arrow-right" />
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>

			<style jsx>{`
				.home-gallery-section {
					padding: 56px 0 64px;
					background: linear-gradient(180deg, #f5f4f7 0%, #edeaf0 50%, #f2eff5 100%);
					position: relative;
					overflow: hidden;
				}
				.home-gallery-header {
					text-align: center;
					margin-bottom: 36px;
				}
				.home-gallery-slider-wrap {
					position: relative;
				}
				.home-gallery-cta {
					text-align: center;
					margin-top: 28px;
				}
			`}</style>
		</section>
	)
}
