'use client'
import Link from 'next/link'

export default function HeroContentSection() {
	return (
		<section className="premium-hero-content-section">
			<div className="container">
				<div className="row">
					{/* Content Column - Left Aligned */}
					<div className="col-lg-8 col-xl-7">
						<div className="premium-hero-wrapper" style={{ textAlign: 'left' }}>
							{/* Premium Badge */}
							<div className="premium-year-badge" data-aos="fade-up" data-aos-duration={600}>
								<span>
									2026
								</span>
							</div>
							
							<div className="space20" />
							
							{/* Main Heading */}
							<div className="premium-hero-heading" data-aos="fade-up" data-aos-duration={800}>
								<h5 className="premium-hero-subtitle">
									Africa Trade Awards
								</h5>
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
								<div className="theme-divider">
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
