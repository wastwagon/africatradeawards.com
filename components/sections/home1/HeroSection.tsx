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
			
			
			<div className="container" style={{ position: 'relative', zIndex: 10 }}>
				<div className="row">
					{/* Content Column - Left Aligned */}
					<div className="col-lg-8 col-xl-7">
						<div className="premium-hero-wrapper" style={{ textAlign: 'left' }}>
							{/* Premium Badge */}
							<div className="premium-year-badge" data-aos="fade-up" data-aos-duration={600}>
								<span style={{
									display: 'inline-block',
									padding: '10px 28px',
									background: 'linear-gradient(135deg, rgba(192, 192, 192, 0.3) 0%, rgba(78, 43, 90, 0.4) 100%)',
									backdropFilter: 'blur(15px)',
									border: '1px solid rgba(255, 255, 255, 0.3)',
									borderRadius: '50px',
									fontFamily: 'var(--grotesk)',
									fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)',
									fontWeight: 'var(--ztc-weight-bold)',
									letterSpacing: '3px',
									textTransform: 'uppercase',
									color: '#ffffff',
									boxShadow: '0 8px 32px rgba(78, 43, 90, 0.3)'
								}}>
									2026
								</span>
							</div>
							
							<div className="space20" />
							
							{/* Main Heading */}
							<div className="premium-hero-heading" data-aos="fade-up" data-aos-duration={800}>
								<h5 style={{
									fontFamily: 'var(--grotesk)',
									fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
									fontWeight: 'var(--ztc-weight-medium)',
									letterSpacing: '4px',
									textTransform: 'uppercase',
									color: 'rgba(255, 255, 255, 0.95)',
									marginBottom: '20px',
									textAlign: 'left',
									textShadow: '0 2px 10px rgba(78, 43, 90, 0.5)'
								}}>
									Africa Trade Awards
								</h5>
								<h1 className="premium-hero-title" style={{
									fontFamily: 'var(--grotesk)',
									fontSize: 'clamp(1.8rem, 5vw, 3.2rem)',
									fontWeight: 'var(--ztc-weight-bold)',
									lineHeight: '1.2',
									letterSpacing: '-0.5px',
									color: '#ffffff',
									textAlign: 'left',
									margin: 0,
									background: 'linear-gradient(135deg, #ffffff 0%, rgba(192, 192, 192, 0.95) 50%, #ffffff 100%)',
									WebkitBackgroundClip: 'text',
									WebkitTextFillColor: 'transparent',
									backgroundClip: 'text',
									textShadow: '0 4px 20px rgba(78, 43, 90, 0.4)',
									filter: 'drop-shadow(0 2px 8px rgba(192, 192, 192, 0.3))'
								}}>
									Celebrating Africa&apos;s <br className="d-lg-block d-none" />
									Trade Excellence <br className="d-lg-block d-none" />
									and Industrial Champions
								</h1>
							</div>
							
							<div className="space32" />
							
							{/* Premium Theme Card */}
							<div className="premium-theme-card" data-aos="fade-up" data-aos-duration={1000} style={{
								background: 'linear-gradient(135deg, rgba(192, 192, 192, 0.15) 0%, rgba(78, 43, 90, 0.25) 100%)',
								backdropFilter: 'blur(20px)',
								border: '1px solid rgba(255, 255, 255, 0.2)',
								borderRadius: '20px',
								padding: '32px',
								boxShadow: '0 20px 60px rgba(78, 43, 90, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
								position: 'relative',
								overflow: 'hidden'
							}}>
								{/* Shine effect */}
								<div style={{
									position: 'absolute',
									top: 0,
									left: '-100%',
									width: '100%',
									height: '100%',
									background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
									animation: 'shine 3s infinite'
								}}></div>
								
								<strong style={{
									color: '#ffffff',
									display: 'block',
									marginBottom: '16px',
									fontSize: 'clamp(0.95rem, 1.5vw, 1.15rem)',
									fontFamily: 'var(--grotesk)',
									fontWeight: 'var(--ztc-weight-bold)',
									letterSpacing: '2px',
									textTransform: 'uppercase',
									textShadow: '0 2px 8px rgba(78, 43, 90, 0.5)'
								}}>
									Theme 2026
								</strong>
								<p style={{
									color: 'rgba(255, 255, 255, 0.95)',
									marginBottom: '24px',
									fontSize: 'clamp(0.95rem, 1.3vw, 1.1rem)',
									lineHeight: '1.6',
									fontFamily: 'var(--figtree)',
									textShadow: '0 1px 4px rgba(78, 43, 90, 0.4)'
								}}>
									&quot;Honouring the Champions of Africa&apos;s Trade and Industrialisation.&quot;
								</p>
								<div style={{
									borderTop: '1px solid rgba(255, 255, 255, 0.25)',
									paddingTop: '24px',
									marginTop: '24px'
								}}>
									<Link href="/#" style={{
										color: 'rgba(255, 255, 255, 0.95)',
										display: 'flex',
										alignItems: 'center',
										marginBottom: '16px',
										textDecoration: 'none',
										fontSize: 'clamp(0.9rem, 1.2vw, 1rem)',
										fontFamily: 'var(--figtree)',
										transition: 'all 0.3s ease',
										textShadow: '0 1px 4px rgba(78, 43, 90, 0.4)'
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.color = '#ffffff';
										e.currentTarget.style.transform = 'translateX(5px)';
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.color = 'rgba(255, 255, 255, 0.95)';
										e.currentTarget.style.transform = 'translateX(0)';
									}}>
										<i className="fa-solid fa-calendar" style={{ marginRight: '12px', fontSize: '18px', color: 'rgba(192, 192, 192, 0.9)' }}></i>
										28th and 29th January 2026
									</Link>
									<Link href="/#" style={{
										color: 'rgba(255, 255, 255, 0.95)',
										display: 'flex',
										alignItems: 'center',
										marginBottom: '0',
										textDecoration: 'none',
										fontSize: 'clamp(0.9rem, 1.2vw, 1rem)',
										fontFamily: 'var(--figtree)',
										transition: 'all 0.3s ease',
										textShadow: '0 1px 4px rgba(78, 43, 90, 0.4)'
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.color = '#ffffff';
										e.currentTarget.style.transform = 'translateX(5px)';
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.color = 'rgba(255, 255, 255, 0.95)';
										e.currentTarget.style.transform = 'translateX(0)';
									}}>
										<i className="fa-solid fa-location-dot" style={{ marginRight: '12px', fontSize: '18px', color: 'rgba(192, 192, 192, 0.9)' }}></i>
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

