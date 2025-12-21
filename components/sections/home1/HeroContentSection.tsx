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
							<div className="premium-main-image">
								<img src="/assets/img/all-images/about/about-img8.png" alt="Africa Trade Awards" />
							</div>
						</div>
					</div>

					{/* Content Column - Right */}
					<div className="col-lg-6 order-lg-2 order-1">
						<div className="premium-hero-wrapper" style={{ textAlign: 'left' }}>
							{/* Single Main Title */}
							<div className="premium-hero-heading" data-aos="fade-up" data-aos-duration={800}>
								<h1 className="premium-hero-title">
									Celebrating Africa&apos;s <br className="d-lg-block d-none" />
									Trade Excellence <br className="d-lg-block d-none" />
									and Industrial Champions
								</h1>
							</div>
							
							<div className="space32" />
							
							{/* Premium Theme Card */}
							<div className="premium-theme-card" data-aos="fade-up" data-aos-duration={1000}>
								{/* Shine effect */}
								<div className="card-shine-effect"></div>
								
								<strong className="theme-label">
									Theme 2026
								</strong>
								<p className="theme-quote">
									&quot;Honouring the Champions of Africa&apos;s Trade and Industrialisation.&quot;
								</p>
							</div>

							<div className="space50" />

							{/* Descriptive Content */}
							<div className="premium-hero-description" data-aos="fade-up" data-aos-duration={1200}>
								<div className="premium-description-text">
									<p>The Africa Trade Awards celebrates the visionaries transforming Africa&apos;s economy—those who innovate, lead, and build pathways to prosperity across borders.</p>
									<div className="space16" />
									<p>As the flagship recognition platform of the Africa Trade Summit, the Awards honour individuals and institutions advancing enterprise, policy, and investment that drive the continent&apos;s trade, industrialisation, and economic integration.</p>
								</div>
								
								<div className="space32" />
								
								{/* Event Details - Moved Below Description */}
								<div className="premium-event-details" data-aos="fade-up" data-aos-duration={1400}>
									<Link href="/#" className="event-info-link">
										<i className="fa-solid fa-calendar"></i>
										<span>28th and 29th January 2026</span>
									</Link>
									<Link href="/#" className="event-info-link">
										<i className="fa-solid fa-location-dot"></i>
										<span>Kempinski Gold Coast City Hotel, Accra</span>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
