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
					{/* Content Column - Left Aligned */}
					<div className="col-lg-8 col-xl-7">
						<div className="hero1-header heading1" style={{ color: 'white', textAlign: 'left' }}>
							<h5 data-aos="fade-up" data-aos-duration={800} style={{ textAlign: 'left' }}>
								Africa Trade Awards 2026
							</h5>
							<div className="space16" />
							<h1 className="text-anime-style-3" style={{ color: 'white', fontSize: 'clamp(0.95rem, 2vw, 1.5rem)', fontWeight: 'bold', lineHeight: '1.3', textAlign: 'left' }}>
								Celebrating Africa&apos;s Trade Excellence <br className="d-lg-block d-none" />
								and Industrial Champions
							</h1>
							<div className="space24" />
							<div className="theme-badge" data-aos="fade-up" data-aos-duration={1000} style={{ color: 'white', padding: '0', textAlign: 'left' }}>
								<strong style={{ color: 'white', display: 'block', marginBottom: '12px', fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)' }}>Theme 2026:</strong>
								<p style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '20px', fontSize: 'clamp(0.85rem, 1.3vw, 1rem)', lineHeight: '1.5' }}>
									&quot;Honouring the Champions of Africa&apos;s Trade and Industrialisation.&quot;
								</p>
								<div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)', paddingTop: '20px', marginTop: '20px' }}>
									<Link href="/#" style={{ color: 'rgba(255, 255, 255, 0.9)', display: 'block', marginBottom: '12px', textDecoration: 'none', fontSize: 'clamp(0.85rem, 1.2vw, 0.95rem)' }}>
										<i className="fa-solid fa-calendar" style={{ marginRight: '0.5rem' }}></i>
										28th and 29th January 2026
									</Link>
									<Link href="/#" style={{ color: 'rgba(255, 255, 255, 0.9)', display: 'block', marginBottom: '0', textDecoration: 'none', fontSize: 'clamp(0.85rem, 1.2vw, 0.95rem)' }}>
										<i className="fa-solid fa-location-dot" style={{ marginRight: '0.5rem' }}></i>
										Kempinski Gold Coast City Hotel, Accra
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

