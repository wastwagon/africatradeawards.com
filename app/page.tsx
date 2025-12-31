import Layout from "@/components/layout/Layout"
import HeroSection from '@/components/sections/home1/HeroSection'
import AboutSection from '@/components/sections/home1/AboutSection'
import AwardCategoriesSection from '@/components/sections/home1/AwardCategoriesSection'

export default function Home() {
	return (
		<>
			<Layout headerStyle={1} footerStyle={1}>
				<HeroSection />
				<AboutSection />
				<AwardCategoriesSection />
				
				{/*===== RECOGNITION & VALIDATION COMMITTEE BANNER SECTION =======*/}
				<div className="committee-modern-banner-section sp2">
					{/* Background Image */}
					<div className="banner-background-image">
						<img src="/assets/img/all-images/award-winner.webp" alt="Award Winner Background" />
					</div>
					
					{/* Gradient Overlay */}
					<div className="banner-gradient-overlay"></div>
					
					{/* Decorative Background Shapes */}
					<div className="banner-shape banner-shape-1"></div>
					<div className="banner-shape banner-shape-2"></div>
					<div className="banner-shape banner-shape-3"></div>
					<div className="banner-shape banner-shape-4"></div>
					
					<div className="container">
						<div className="row align-items-center">
							<div className="col-lg-5">
								<div className="committee-banner-image-area">
									<div className="banner-image-wrapper">
										<img src="/assets/img/all-images/award-winner.webp" alt="Recognition & Validation Committee" />
									</div>
								</div>
							</div>
							<div className="col-lg-7">
								<div className="committee-banner-content">
									<h2 className="banner-main-title">Recognition & Validation Committee</h2>
									<div className="space16" />
									<p className="banner-description">The Recognition & Validation Committee is responsible for reviewing and validating all recognition decisions under the Africa Trade Awards. The Committee comprises senior professionals drawn from trade, finance, industry, infrastructure, and public policy, selected for their experience in evaluating complex institutional, commercial, and policy outcomes.</p>
									<div className="space24" />
									<p className="banner-subtitle">The Committee&apos;s role includes:</p>
									<div className="space16" />
									<ul className="committee-benefits-list">
										<li>
											<i className="fa-solid fa-check"></i>
											<span>Reviewing evidence of contribution and impact within the reference period</span>
										</li>
										<li>
											<i className="fa-solid fa-check"></i>
											<span>Assessing relevance, scale, and durability of outcomes</span>
										</li>
										<li>
											<i className="fa-solid fa-check"></i>
											<span>Ensuring consistency across recognition tiers and categories</span>
										</li>
										<li>
											<i className="fa-solid fa-check"></i>
											<span>Safeguarding the integrity and intent of the Awards</span>
										</li>
									</ul>
									<div className="space32" />
									<p className="banner-footer-text">Recognition decisions are reached through deliberation and professional judgment, guided by the Awards&apos; principles and scope.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/*===== RECOGNITION & VALIDATION COMMITTEE BANNER SECTION ENDS =======*/}
			</Layout>
		</>
	)
}
