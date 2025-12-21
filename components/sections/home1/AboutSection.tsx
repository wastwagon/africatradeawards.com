'use client'
import Link from 'next/link'

export default function AboutSection() {
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
								{/* Content moved to HeroContentSection */}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

