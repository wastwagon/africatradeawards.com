'use client'
import Link from 'next/link'

export default function Section2() {
	return (
		<>
			<div className="about1-section-area overview-section sp1">
				<div className="container">
					<div className="row align-items-center">
						<div className="col-lg-6">
							<div className="overview-image-layout">
								<div className="main-image">
									<img src="/assets/img/all-images/about/about-img8.png" alt="Africa Trade Awards" />
								</div>
								<div className="secondary-images">
									<div className="secondary-image">
										<img src="/assets/img/all-images/about/about-img8.png" alt="Trade Excellence" />
									</div>
									<div className="secondary-image">
										<img src="/assets/img/all-images/about/about-img8.png" alt="Industrial Champions" />
									</div>
								</div>
							</div>
						</div>
						<div className="col-lg-6">
							<div className="overview-content">
								<h2 className="overview-heading">
									Celebrating Visionaries Transforming Africa&apos;s Economy
								</h2>
								<div className="space12" />
								<div className="overview-description">
									<p>The Africa Trade Awards celebrates the visionaries transforming Africa&apos;s economy—those who innovate, lead, and build pathways to prosperity across borders.</p>
									<div className="space12" />
									<p>As the flagship recognition platform of the Africa Trade Summit, the Awards honour individuals and institutions advancing enterprise, policy, and investment that drive the continent&apos;s trade, industrialisation, and economic integration.</p>
								</div>
								
								<div className="space24" />
								
								{/* Our Mission */}
								<div className="mission-content">
									<div className="mission-badge">
										<span>MISSION</span>
									</div>
									<div className="space12" />
									<p className="mission-description">To celebrate and promote excellence, innovation, and responsible leadership in African trade and industrial development, while fostering cross-border partnerships that advance the goals of the AfCFTA and Agenda 2063.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
