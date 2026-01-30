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
					height: 52vh;
					min-height: 320px;
					max-height: 480px;
					overflow: hidden;
					display: flex;
					align-items: center;
					justify-content: center;
					background: #1a1518;
				}
				.hero-banner-image-wrapper {
					position: absolute;
					inset: 0;
					width: 100%;
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
				}
				.hero-banner-image {
					width: 100%;
					height: 100%;
					object-fit: contain;
					object-position: center center;
					display: block;
					vertical-align: middle;
				}
				@media (max-width: 991px) {
					.hero-banner-section {
						height: 45vh;
						min-height: 280px;
						max-height: 400px;
					}
				}
				@media (max-width: 575px) {
					.hero-banner-section {
						height: 40vh;
						min-height: 220px;
						max-height: 340px;
					}
				}
			`}</style>
		</section>
	)
}
