'use client'
import Image from 'next/image'
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
								<Image src="/assets/img/all-images/about.jpeg" alt="Africa Trade Awards" width={900} height={900} />
							</div>
						</div>
					</div>
					<div className="col-lg-6">
						<div className="overview-content">
							<div className="overview-description" data-aos="fade-up" data-aos-duration={900}>
								<p>The Africa Trade Awards platform is built to celebrate institutions, leaders, and enterprises delivering real trade and industrial outcomes across the continent.</p>
								<div className="space12" />
								<p>Beyond recognition, the platform brings together nominations, judging, public voting, publications, and event participation into one consistent digital experience for participants and stakeholders.</p>
							</div>
							<div className="space24" />
							<div className="btn-area1" data-aos="fade-up" data-aos-duration={1000}>
								<Link href="/about" className="elegant-btn premium-about-btn" style={{ padding: '10px 20px', fontSize: '13px', minHeight: 'auto', height: 'auto' }}>
									<span>About the awards</span>
									<i className="fa-solid fa-arrow-right" style={{ fontSize: '11px' }}></i>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

