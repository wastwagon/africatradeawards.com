'use client'
import Link from 'next/link'

export default function GovernanceSection() {
	return (
		<div className="elegant-cta-section governance-premium-section">
			{/* Header Section */}
			<div className="choose-section-area premium-categories-section">
				<div className="container">
					<div className="row">
						<div className="col-lg-8 m-auto">
							<div className="heading2 text-center">
								<h2 className="text-anime-style-3 premium-section-title">Governance & Oversight</h2>
								<div className="space8" />
								<p className="premium-section-description" data-aos="fade-up" data-aos-duration={900}>The Africa Trade Awards are governed through a structured oversight framework designed to ensure professional judgment, consistency, and institutional credibility in all recognition decisions.</p>
							</div>
						</div>
					</div>
					<div className="space16" />
				</div>
			</div>

			{/* Governance Cards - Premium Image Card Style */}
			<div className="image-cards-wrapper">
				<div className="container">
					<div className="row g-4">
						{/* Recognition & Validation Committee */}
						<div className="col-lg-6" data-aos="fade-up" data-aos-duration={800}>
							<div className="image-card governance-premium-card">
								<div className="card-image-wrapper governance-image-wrapper">
									<div className="governance-image-overlay">
										<div className="governance-icon-large">
											<i className="fa-solid fa-users-gear"></i>
										</div>
									</div>
								</div>
								<div className="card-content-box">
									<h3 className="card-title">Recognition & Validation Committee</h3>
									<div className="card-description governance-card-description">
										<p>The Recognition & Validation Committee is responsible for reviewing and validating all recognition decisions under the Africa Trade Awards.</p>
										<p>The Committee comprises senior professionals drawn from trade, finance, industry, infrastructure, and public policy, selected for their experience in evaluating complex institutional, commercial, and policy outcomes.</p>
										<div className="governance-features-list">
											<div className="feature-item">
												<i className="fa-solid fa-check"></i>
												<span>Reviewing evidence of contribution and impact</span>
											</div>
											<div className="feature-item">
												<i className="fa-solid fa-check"></i>
												<span>Assessing relevance, scale, and durability</span>
											</div>
											<div className="feature-item">
												<i className="fa-solid fa-check"></i>
												<span>Ensuring consistency across recognition tiers</span>
											</div>
											<div className="feature-item">
												<i className="fa-solid fa-check"></i>
												<span>Safeguarding the integrity of the Awards</span>
											</div>
										</div>
									</div>
									<Link href="/governance/recognition-committee" className="card-link governance-card-link">
										Learn More
										<i className="fa-solid fa-arrow-right"></i>
									</Link>
								</div>
							</div>
						</div>

						{/* Independent Partner */}
						<div className="col-lg-6" data-aos="fade-up" data-aos-duration={900}>
							<div className="image-card governance-premium-card governance-partner-card">
								<div className="card-image-wrapper governance-image-wrapper partner-image-wrapper">
									<div className="governance-image-overlay partner-overlay">
										<div className="governance-icon-large">
											<i className="fa-solid fa-shield-halved"></i>
										</div>
									</div>
								</div>
								<div className="card-content-box">
									<h3 className="card-title">Independent Partner</h3>
									<div className="card-description governance-card-description">
										<p className="partner-intro"><strong>Forvis Mazars</strong> serves as the Independent Partner of the Africa Trade Awards.</p>
										<p>In this capacity, Forvis Mazars provides independent professional support to the Awards process, focusing on process integrity and consistency rather than selection or adjudication.</p>
										<div className="governance-features-list">
											<div className="feature-item">
												<i className="fa-solid fa-check"></i>
												<span>Supporting structured review processes</span>
											</div>
											<div className="feature-item">
												<i className="fa-solid fa-check"></i>
												<span>Providing assurance on consistency</span>
											</div>
											<div className="feature-item">
												<i className="fa-solid fa-check"></i>
												<span>Enhancing credibility and professional standing</span>
											</div>
										</div>
										<div className="partner-logo-container">
											<img src="/Partners/mazars_ghana_logo.jpeg" alt="Forvis Mazars" className="partner-logo-premium" />
										</div>
									</div>
									<Link href="/governance/independent-partner" className="card-link governance-card-link">
										Learn More
										<i className="fa-solid fa-arrow-right"></i>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

