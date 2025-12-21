'use client'
import Link from 'next/link'

export default function HeroSection() {
	return (
		<section className="hero1-section-area" 
			style={{ 
				minHeight: '100vh', 
				display: 'flex', 
				alignItems: 'center', 
				position: 'relative',
				overflow: 'hidden'
			}}>
			
			{/* Video Background */}
			<video
				autoPlay
				loop
				muted
				playsInline
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					objectFit: 'cover',
					zIndex: 0
				}}
			>
				<source src="/assets/video/hero-video.mp4" type="video/mp4" />
			</video>
			
			{/* Overlay for better text readability */}
			<div style={{
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				background: 'linear-gradient(135deg, rgba(78, 43, 90, 0.7) 0%, rgba(61, 34, 71, 0.6) 50%, rgba(90, 111, 216, 0.5) 100%)',
				pointerEvents: 'none',
				zIndex: 1
			}} />
			
			<div className="container" style={{ position: 'relative', zIndex: 10 }}>
				<div className="row justify-content-center align-items-center" style={{ minHeight: '100vh', padding: '80px 0' }}>
					{/* Main Content Column */}
					<div className="col-lg-10 col-xl-9">
						<div className="premium-hero-content">
							{/* Badge/Year */}
							<div className="premium-hero-badge" data-aos="fade-down" data-aos-duration={600}>
								<span>2026</span>
							</div>
							
							{/* Main Heading */}
							<div className="premium-hero-heading" data-aos="fade-up" data-aos-duration={800}>
								<h5 className="premium-hero-subtitle">Africa Trade Awards</h5>
								<h1 className="premium-hero-title">
									Celebrating Africa&apos;s <br />
									Trade Excellence <br />
									and Industrial Champions
								</h1>
							</div>
							
							{/* Premium Info Cards Grid */}
							<div className="row premium-hero-cards" style={{ marginTop: '60px' }}>
								{/* Theme Card */}
								<div className="col-lg-6 col-md-6 mb-4" data-aos="fade-up" data-aos-duration={900} data-aos-delay={100}>
									<div className="premium-card premium-theme-card">
										<div className="premium-card-header">
											<div className="premium-card-icon">
												<i className="fa-solid fa-star"></i>
											</div>
											<h6 className="premium-card-label">Theme 2026</h6>
										</div>
										<p className="premium-card-content">
											&quot;Honouring the Champions of Africa&apos;s Trade and Industrialisation.&quot;
										</p>
									</div>
								</div>
								
								{/* Event Details Card */}
								<div className="col-lg-6 col-md-6 mb-4" data-aos="fade-up" data-aos-duration={900} data-aos-delay={200}>
									<div className="premium-card premium-event-card">
										<div className="premium-card-header">
											<div className="premium-card-icon">
												<i className="fa-solid fa-calendar-days"></i>
											</div>
											<h6 className="premium-card-label">Event Details</h6>
										</div>
										<div className="premium-event-info">
											<div className="premium-info-item">
												<i className="fa-solid fa-calendar"></i>
												<span>28th and 29th January 2026</span>
											</div>
											<div className="premium-info-item">
												<i className="fa-solid fa-location-dot"></i>
												<span>Kempinski Gold Coast City Hotel, Accra</span>
											</div>
										</div>
									</div>
								</div>
							</div>
							
							{/* Call to Action Section */}
							<div className="premium-hero-cta" data-aos="fade-up" data-aos-duration={1000} data-aos-delay={300}>
								<p className="premium-hero-description">
									Join a historic moment of recognition, prestige, and progress. Nominate, partner, or attend the Awards and stand with the pioneers advancing Africa&apos;s trade and industrial future.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

