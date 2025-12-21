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
							{/* Premium Badge */}
							<div className="premium-year-badge" data-aos="fade-up" data-aos-duration={600}>
								<span>2026 Africa Trade Awards</span>
							</div>
							
							<div className="space24" />
							
							{/* Main Title with Enhanced Styling */}
							<div className="premium-hero-heading" data-aos="fade-up" data-aos-duration={800}>
								<h1 className="premium-hero-title-enhanced">
									Celebrating Africa&apos;s Trade Excellence <br className="d-lg-block d-none" />
									and Industrial Champions
								</h1>
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

							<div className="space50" />

							{/* Enhanced Descriptive Content */}
							<div className="premium-hero-description-enhanced" data-aos="fade-up" data-aos-duration={1200}>
								<div className="description-intro">
									<p className="intro-text">
										The Africa Trade Awards celebrates the visionaries transforming Africa&apos;s economy—those who innovate, lead, and build pathways to prosperity across borders.
									</p>
								</div>
								
								<div className="space12" />
								
								<div className="description-details">
									<p className="details-text">
										As the flagship recognition platform of the Africa Trade Summit, the Awards honour individuals and institutions advancing enterprise, policy, and investment that drive the continent&apos;s trade, industrialisation, and economic integration.
									</p>
								</div>
								
								<div className="space40" />
								
								{/* Premium Event Details Card */}
								<div className="premium-event-details-card" data-aos="fade-up" data-aos-duration={1400}>
									<div className="event-details-header">
										<i className="fa-solid fa-calendar-days"></i>
										<span className="event-details-label">Event Details</span>
									</div>
									<div className="event-details-content">
										<div className="event-detail-item">
											<i className="fa-solid fa-calendar"></i>
											<span>28th and 29th January 2026</span>
										</div>
										<div className="event-detail-item">
											<i className="fa-solid fa-location-dot"></i>
											<span>Kempinski Gold Coast City Hotel, Accra</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
