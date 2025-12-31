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
						
						{/* Committee Member Profiles */}
						<div className="row">
							<div className="col-lg-10 m-auto">
								<div className="space60" />
								<div className="committee-profiles-circular-grid">
									{/* Profile Card 1 */}
									<div className="committee-profile-circular-card">
										<div className="premium-hero-image-layout">
											<div className="premium-main-image premium-3d-circle">
												<div className="circle-gradient-border"></div>
												<div className="circle-inner-shadow"></div>
												<img src="https://ui-avatars.com/api/?name=Dr.+Sarah+Okafor&background=4e2b5a&color=fff&size=200&bold=true&font-size=0.5" alt="Dr. Sarah Okafor" />
											</div>
										</div>
										<div className="profile-content">
											<h4 className="profile-name">Dr. Sarah Okafor</h4>
											<p className="profile-role">Senior Trade Policy Advisor</p>
											<div className="profile-divider"></div>
											<p className="profile-background">With over 20 years of experience in international trade policy and economic development across Africa, Dr. Okafor has advised multiple governments and regional bodies on trade facilitation and market integration strategies.</p>
											<div className="profile-expertise">
												<span className="expertise-label">Expertise:</span>
												<span className="expertise-text">Trade Policy & Regional Integration</span>
											</div>
										</div>
									</div>

									{/* Profile Card 2 */}
									<div className="committee-profile-circular-card">
										<div className="premium-hero-image-layout">
											<div className="premium-main-image premium-3d-circle">
												<div className="circle-gradient-border"></div>
												<div className="circle-inner-shadow"></div>
												<img src="https://ui-avatars.com/api/?name=James+Kamau&background=4e2b5a&color=fff&size=200&bold=true&font-size=0.5" alt="James Kamau" />
											</div>
										</div>
										<div className="profile-content">
											<h4 className="profile-name">James Kamau</h4>
											<p className="profile-role">Chief Financial Officer, Pan-African Bank</p>
											<div className="profile-divider"></div>
											<p className="profile-background">A seasoned finance executive with extensive experience in cross-border capital markets and infrastructure financing. Mr. Kamau has led financing initiatives for major industrial and trade infrastructure projects across the continent.</p>
											<div className="profile-expertise">
												<span className="expertise-label">Expertise:</span>
												<span className="expertise-text">Finance & Infrastructure Investment</span>
											</div>
										</div>
									</div>

									{/* Profile Card 3 */}
									<div className="committee-profile-circular-card">
										<div className="premium-hero-image-layout">
											<div className="premium-main-image premium-3d-circle">
												<div className="circle-gradient-border"></div>
												<div className="circle-inner-shadow"></div>
												<img src="https://ui-avatars.com/api/?name=Prof.+Amina+Diop&background=4e2b5a&color=fff&size=200&bold=true&font-size=0.5" alt="Prof. Amina Diop" />
											</div>
										</div>
										<div className="profile-content">
											<h4 className="profile-name">Prof. Amina Diop</h4>
											<p className="profile-role">Director, Industrial Development Institute</p>
											<div className="profile-divider"></div>
											<p className="profile-background">An academic and practitioner with deep expertise in industrial policy and value chain development. Prof. Diop has contributed to shaping manufacturing strategies and industrial transformation initiatives in multiple African economies.</p>
											<div className="profile-expertise">
												<span className="expertise-label">Expertise:</span>
												<span className="expertise-text">Industrial Policy & Value Chains</span>
											</div>
										</div>
									</div>
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
