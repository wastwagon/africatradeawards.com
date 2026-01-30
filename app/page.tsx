import Layout from "@/components/layout/Layout"
import HeroSection from '@/components/sections/home1/HeroSection'
import EventDateVenueBar from '@/components/sections/home1/EventDateVenueBar'
import AboutSection from '@/components/sections/home1/AboutSection'
import AwardCategoriesSection from '@/components/sections/home1/AwardCategoriesSection'
import AwardeesCTASection from '@/components/sections/home1/AwardeesCTASection'
import CommitteeProfiles from '@/components/sections/CommitteeProfiles'
import GallerySection from '@/components/sections/home1/GallerySection'
import SponsorsSection from '@/components/sections/SponsorsSection'

/**
 * Homepage content flow (audience journey):
 * 1. Hero + Event bar — Attention: first impression, when/where
 * 2. About — Understanding: what the awards are
 * 3. Award structure — Understanding: how recognition is organized
 * 4. Awardees CTA — Recognition intro + CTA to awardees page
 * 5. Gallery — Proof & emotion: moments from the event
 * 6. Committee — Trust: who validates the outcomes
 * 7. Sponsors — Support: who backs the awards
 */

export default function Home() {
	return (
		<>
			<Layout headerStyle={1} footerStyle={1}>
				{/* 1. Attention */}
				<HeroSection />
				<EventDateVenueBar />

				{/* 2–3. Understanding */}
				<AboutSection />
				<AwardCategoriesSection />

				{/* 4. Recognition intro + CTA to awardees page */}
				<AwardeesCTASection />

				{/* 5. Proof & emotion: event moments */}
				<GallerySection />

				{/* 6. Trust: who validates */}
				<div className="committee-text-section">
					<div className="container">
						<div className="row">
							<div className="col-lg-10 m-auto">
								<div className="committee-text-content">
									<h2 className="committee-text-title">Recognition & Validation Committee</h2>
									<div className="space16" />
									<p className="committee-text-description">The Recognition & Validation Committee is responsible for reviewing and validating all recognition decisions under the Africa Trade Awards. The Committee comprises senior professionals drawn from trade, finance, industry, infrastructure, and public policy, selected for their experience in evaluating complex institutional, commercial, and policy outcomes.</p>
									<div className="space24" />
									<h3 className="committee-text-subtitle">The Committee&apos;s role includes:</h3>
									<div className="space16" />
									<div className="committee-roles-grid-cards">
										<div className="committee-role-card">
											<div className="role-icon-box">
												<i className="fa-solid fa-check"></i>
											</div>
											<p className="role-card-text">Reviewing evidence of contribution and impact within the reference period</p>
										</div>
										<div className="committee-role-card">
											<div className="role-icon-box">
												<i className="fa-solid fa-check"></i>
											</div>
											<p className="role-card-text">Assessing relevance, scale, and durability of outcomes</p>
										</div>
										<div className="committee-role-card">
											<div className="role-icon-box">
												<i className="fa-solid fa-check"></i>
											</div>
											<p className="role-card-text">Ensuring consistency across recognition tiers and categories</p>
										</div>
										<div className="committee-role-card">
											<div className="role-icon-box">
												<i className="fa-solid fa-check"></i>
											</div>
											<p className="role-card-text">Safeguarding the integrity and intent of the Awards</p>
										</div>
									</div>
									<div className="space24" />
									<p className="committee-text-footer">Recognition decisions are reached through deliberation and professional judgment, guided by the Awards&apos; principles and scope.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="committee-banner-section">
					<div className="container">
						<div className="row">
							<div className="col-12">
								<CommitteeProfiles />
							</div>
						</div>
					</div>
				</div>

				{/* 7. Support: partners & sponsors */}
				<SponsorsSection />
			</Layout>
		</>
	)
}
