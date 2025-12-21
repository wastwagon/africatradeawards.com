'use client'
import Link from 'next/link'

export default function HeroContentSection() {
	return (
		<section className="premium-hero-content-section">
			<div className="container">
				<div className="row align-items-center">
					{/* Images Column - Left */}
					<div className="col-lg-6 order-lg-1 order-2">
						<div className="premium-hero-image-layout" data-aos="fade-right" data-aos-duration={800}>
							<div className="premium-main-image premium-3d-circle">
								<div className="circle-gradient-border"></div>
								<div className="circle-inner-shadow"></div>
								<img src="/assets/img/all-images/award-winner.webp" alt="Award Winner - Africa Trade Awards" />
							</div>
						</div>
					</div>

					{/* Content Column - Right */}
					<div className="col-lg-6 order-lg-2 order-1">
						<div className="premium-hero-wrapper" style={{ textAlign: 'left' }}>
							{/* Premium Badge */}
							<div className="premium-year-badge" data-aos="fade-up" data-aos-duration={600}>
								<span>2026 Africa Trade Awards</span>
							</div>
							
							<div className="space24" />
							
							{/* Subtitle */}
							<div className="premium-hero-subtitle-wrapper" data-aos="fade-up" data-aos-duration={700}>
								<p className="premium-hero-subtitle-text">
									The Africa Trade Awards celebrates the visionaries transforming Africa&apos;s economy—those who innovate, lead, and build pathways to prosperity across borders.
								</p>
							</div>
							
							<div className="space40" />
							
							{/* Premium Theme Card - Enhanced */}
							<div className="premium-theme-card-enhanced" data-aos="fade-up" data-aos-duration={1000}>
								<div className="card-shine-effect"></div>
								<div className="theme-content-wrapper">
									<div className="theme-badge-small">
										<span>THEME 2026</span>
									</div>
									<p className="theme-quote-enhanced">
										&quot;Honouring the Champions of Africa&apos;s Trade and Industrialisation.&quot;
									</p>
								</div>
							</div>

						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
