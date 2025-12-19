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
				<div className="row">
					{/* Left Column - Content */}
					<div className="col-lg-6">
						<div className="hero1-header heading1" style={{ color: 'white' }}>
							<h5 data-aos="fade-left" data-aos-duration={800}>
								Africa Trade Awards 2026
							</h5>
							<div className="space16" />
							<h1 className="text-anime-style-3" style={{ color: 'white', fontSize: 'clamp(0.95rem, 2vw, 1.5rem)', fontWeight: 'bold', lineHeight: '1.2' }}>
								Celebrating Africa&apos;s Trade Excellence <br className="d-lg-block d-none" />
								and Industrial Champions
							</h1>
							<div className="space16" />
							<div className="theme-badge" data-aos="fade-left" data-aos-duration={1000} style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.2)', color: 'white' }}>
								<strong style={{ color: 'white', display: 'block', marginBottom: '12px' }}>Theme 2026:</strong>
								<p style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '16px' }}>
									&quot;Honouring the Champions of Africa&apos;s Trade and Industrialisation.&quot;
								</p>
								<div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)', paddingTop: '16px', marginTop: '16px' }}>
									<Link href="/#" style={{ color: 'rgba(255, 255, 255, 0.9)', display: 'block', marginBottom: '12px', textDecoration: 'none' }}>
										<i className="fa-solid fa-calendar" style={{ marginRight: '0.5rem' }}></i>
										28th and 29th January 2026
									</Link>
									<Link href="/#" style={{ color: 'rgba(255, 255, 255, 0.9)', display: 'block', marginBottom: '16px', textDecoration: 'none' }}>
										<i className="fa-solid fa-location-dot" style={{ marginRight: '0.5rem' }}></i>
										Kempinski Gold Coast City Hotel, Accra
									</Link>
									<p style={{ color: 'rgba(255, 255, 255, 0.9)', margin: 0 }}>
										Join a historic moment of recognition, prestige, and progress. Nominate, partner, or attend the Awards and stand with the pioneers advancing Africa&apos;s trade and industrial future.
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

