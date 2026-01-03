'use client'
import Link from 'next/link'

export default function AboutSection() {
	return (
		<div className="about1-section-area overview-section sp1 about-section-silver">
			{/* Animated Decorative Elements */}
			<div className="animated-sparkle sparkle-1"></div>
			<div className="animated-sparkle sparkle-2"></div>
			<div className="animated-sparkle sparkle-3"></div>
			<div className="animated-sparkle sparkle-4"></div>
			<div className="animated-sparkle sparkle-5"></div>
			
			<div className="container">
				<div className="row align-items-center">
					<div className="col-lg-6">
						<div className="premium-hero-image-layout" data-aos="fade-right" data-aos-duration={800}>
							<div className="premium-main-image premium-3d-circle">
								<div className="circle-gradient-border"></div>
								<div className="circle-inner-shadow"></div>
								<img src="/assets/img/all-images/about.jpeg" alt="Africa Trade Awards" />
							</div>
						</div>
					</div>
					<div className="col-lg-6">
						<div className="overview-content">
							<div className="overview-description" data-aos="fade-up" data-aos-duration={900}>
								<p>The Africa Trade Awards are recognition honours established by the African Trade Chamber to acknowledge individuals, institutions, enterprises, and public authorities whose work has materially shaped Africa&apos;s trade and industrial landscape.</p>
								<div className="space12" />
								<p>The Awards recognise those whose decisions and execution influenced how goods are produced, financed, moved, and exchanged across African markets. They focus on contributions that strengthened industrial capacity, improved market connectivity, enabled cross-border commerce, or delivered systems that are now in use by businesses and institutions across the continent.</p>
							</div>
							<div className="space24" />
							<div className="btn-area1" data-aos="fade-up" data-aos-duration={1000}>
								<Link href="/about" className="elegant-btn premium-about-btn">
									<span>Learn More</span>
									<i className="fa-solid fa-arrow-right"></i>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

