'use client'
import Link from 'next/link'

export default function HeroSection() {
	return (
		<section className="hero1-section-area" 
			style={{ 
				background: 'linear-gradient(135deg, #3d1f47 0%, #4e2b5a 25%, #5d3a6b 50%, #6b4a7c 75%, #7a5a8d 100%)',
				minHeight: '100vh', 
				display: 'flex', 
				alignItems: 'center', 
				position: 'relative',
				overflow: 'hidden'
			}}>
			
			{/* Gradient overlay for depth */}
			<div style={{
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				background: 'radial-gradient(circle at 30% 50%, rgba(123, 90, 141, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(78, 43, 90, 0.4) 0%, transparent 50%)',
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
							<h1 className="text-anime-style-3" style={{ color: 'white', fontSize: 'clamp(1.35rem, 3vw, 2.2rem)', fontWeight: 'bold', lineHeight: '1.2' }}>
								Celebrating Africa&apos;s <br className="d-lg-block d-none" />
								Trade Excellence <br className="d-lg-block d-none" />
								and Industrial Champions
							</h1>
							<div className="space16" />
							<p data-aos="fade-left" data-aos-duration={900} style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.1rem' }}>
								The Africa Trade Awards honour the trailblazers, innovators, and institutions powering the continent&apos;s trade transformation and industrial renaissance.
							</p>
							<div className="space16" />
							<div className="theme-badge" data-aos="fade-left" data-aos-duration={1000} style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
								<strong style={{ color: 'white' }}>Theme 2026:</strong>
								<span style={{ color: 'rgba(255, 255, 255, 0.9)', marginLeft: '0.5rem' }}>
									&quot;Honouring the Champions of Africa&apos;s Trade and Industrialisation.&quot;
								</span>
							</div>
							<div className="space20" />
							<div className="btn-area1" data-aos="fade-left" data-aos-duration={1100}>
								<Link 
									href="/nomination" 
									style={{
										color: '#ffffff',
										fontSize: '18px',
										fontWeight: '600',
										textDecoration: 'none',
										display: 'inline-flex',
										alignItems: 'center',
										gap: '8px',
										transition: 'all 0.3s ease'
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.opacity = '0.8';
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.opacity = '1';
									}}
								>
									Nominate Now
									<i className="fa-solid fa-arrow-right" style={{ fontSize: '14px' }}></i>
								</Link>
							</div>
						</div>
					</div>
					
					{/* Right Column - Image & Info */}
					<div className="col-lg-5" data-aos="fade-left" data-aos-duration={1000}>
						<div className="header-images">
							<div className="img1" data-aos="zoom-in" data-aos-duration={1000}>
								<img src="/assets/img/all-images/hero/hero-img1.png" alt="" />
							</div>
							<div className="images-content-area" data-aos="fade-up" data-aos-duration={900} style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.2)', color: 'white', marginTop: '1.5rem' }}>
								<h3 style={{ color: 'white', fontWeight: 'bold' }}>AFRICA TRADE AWARDS 2026</h3>
								<div className="space12" />
								<Link href="/#" style={{ color: 'rgba(255, 255, 255, 0.9)', display: 'block' }}>
									<i className="fa-solid fa-calendar" style={{ marginRight: '0.5rem' }}></i>
									28th and 29th January 2026
								</Link>
								<div className="space12" />
								<Link href="/#" style={{ color: 'rgba(255, 255, 255, 0.9)', display: 'block' }}>
									<i className="fa-solid fa-location-dot" style={{ marginRight: '0.5rem' }}></i>
									Kempinski Gold Coast City Hotel, Accra
								</Link>
								<div className="space16" />
								<p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
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

