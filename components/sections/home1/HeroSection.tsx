'use client'

export default function HeroSection() {
	return (
		<section className="hero-banner-section" aria-label="Hero banner">
			<div className="hero-banner-image-wrapper">
				<img
					src="/assets/img/HeroBanner.jpg"
					alt="Africa Trade Awards 2026"
					className="hero-banner-image"
				/>
			</div>
			<style jsx global>{`
				.hero-banner-section {
					position: relative;
					width: 100%;
					height: 92vh;
					min-height: 560px;
					max-height: 900px;
					overflow: hidden;
				}
				.hero-banner-image-wrapper {
					position: absolute;
					inset: 0;
					width: 100%;
					height: 100%;
				}
				.hero-banner-image {
					width: 100%;
					height: 100%;
					object-fit: cover;
					object-position: center center;
					display: block;
					vertical-align: middle;
				}
				@media (max-width: 991px) {
					.hero-banner-section {
						min-height: 50vh;
						height: 70vh;
					}
				}
				@media (max-width: 575px) {
					.hero-banner-section {
						min-height: 45vh;
						height: 60vh;
					}
				}
			`}</style>
		</section>
	)
}
