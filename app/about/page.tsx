'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { useEffect, useRef } from "react"

export default function About() {
	const videoRef = useRef<HTMLVideoElement>(null)

	useEffect(() => {
		// Ensure video autoplays on mount
		const video = videoRef.current
		if (video) {
			video.play().catch((error) => {
				// Handle autoplay policy restrictions
				console.warn('Video autoplay failed:', error)
			})
		}
	}, [])

	return (
		<>
			<Layout headerStyle={1} footerStyle={1}>
				<div>
					<div className="inner-page-header">
						{/* Video Background */}
						<video
							ref={videoRef}
							autoPlay
							loop
							muted
							playsInline
							preload="auto"
							className="header-video-background"
						>
							<source src="/assets/video/hero-video.mp4" type="video/mp4" />
						</video>
						<div className="container">
							<div className="row">
								<div className="col-lg-4 m-auto">
									<div className="heading1 text-center">
										<h1>About the Awards</h1>
										<div className="space20" />
										<Link href="/"><span className="breadcrumb-home">Home</span> <i className="fa-solid fa-angle-right" /> <span className="breadcrumb-current">About the Awards</span></Link>
									</div>
								</div>
							</div>
						</div>
					</div>
					
					{/*===== OVERVIEW AREA STARTS =======*/}
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
									<div className="premium-hero-image-layout">
										<div className="premium-main-image premium-3d-circle">
											<div className="circle-gradient-border"></div>
											<div className="circle-inner-shadow"></div>
											<img src="/assets/img/all-images/award-winner.webp" alt="Africa Trade Awards" />
										</div>
									</div>
								</div>
								<div className="col-lg-6">
									<div className="overview-content">
										<div className="modern-section-header">
											<h2 className="modern-section-title">About the Awards</h2>
										</div>
										<div className="space24" />
										<div className="overview-description">
											<p>The Africa Trade Awards are recognition honours established by the African Trade Chamber to acknowledge individuals, institutions, enterprises, and public authorities whose work has materially shaped Africa&apos;s trade and industrial landscape.</p>
											<div className="space16" />
											<p>The Awards recognise those whose decisions and execution influenced how goods are produced, financed, moved, and exchanged across African markets. They focus on contributions that strengthened industrial capacity, improved market connectivity, enabled cross-border commerce, or delivered systems that are now in use by businesses and institutions across the continent.</p>
											<div className="space16" />
											<p>Conferred as part of the Africa Trade Summit 2026, the Awards sit within a broader convening of public and private sector leaders focused on trade, industrial development, finance, infrastructure, and market integration. The ceremony forms an integral part of the Summit programme and reflects the Chamber&apos;s emphasis on implementation and institutional delivery.</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					{/*===== OVERVIEW AREA ENDS =======*/}
					
					{/*===== RECOGNITION PROCESS AREA STARTS =======*/}
					<div className="about-process-section sp2">
						<div className="container">
							<div className="row">
								<div className="col-lg-10 m-auto">
									<div className="modern-section-header text-center space-margin60">
										<span className="section-accent-label">Recognition Process</span>
										<div className="space20" />
										<h2 className="modern-section-title">How Recognition Works</h2>
									</div>
									<div className="space40" />
									<div className="compact-silver-text-box">
										<div className="compact-text-content">
											<p>The 2026 Africa Trade Awards are conferred as recognition honours. They do not operate as competitive prizes and are not based on open nominations or public voting. Recognition is determined through a structured review process conducted by the Recognition and Validation Committee, drawing on evidence of delivered outcomes within the reference period.</p>
											<div className="space20" />
											<p>Consideration is given to the scale, durability, and relevance of each contribution, including its effect on production capacity, trade execution, industrial value chains, or policy and regulatory systems. The emphasis is on work whose impact is visible in operation—through facilities built, systems deployed, capital mobilised, or reforms implemented.</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					{/*===== RECOGNITION PROCESS AREA ENDS =======*/}
					
					{/*===== AWARDS FRAMEWORK AREA STARTS =======*/}
					<div className="about-framework-section sp2">
						<div className="container">
							<div className="row">
								<div className="col-lg-10 m-auto">
									<div className="modern-section-header text-center space-margin60">
										<span className="section-accent-label">Awards Framework</span>
										<div className="space20" />
										<h2 className="modern-section-title">Tiered Recognition Structure</h2>
									</div>
									<div className="space40" />
									<div className="compact-silver-text-box">
										<div className="compact-text-content">
											<p>The Awards are organised across a tiered framework, reflecting the different layers through which Africa&apos;s trade and industrial systems are developed and sustained. These range from continental leadership and industrial value chains to trade infrastructure, enterprise platforms, and policy execution.</p>
										</div>
									</div>
									<div className="space40" />
									<div className="text-center">
										<Link href="/awards-structure" className="premium-about-btn">
											<span>Explore Awards Structure</span>
											<i className="fa-solid fa-arrow-right"></i>
										</Link>
									</div>
								</div>
							</div>
						</div>
					</div>
					{/*===== AWARDS FRAMEWORK AREA ENDS =======*/}
					
					{/*===== GOVERNANCE & OVERSIGHT AREA STARTS =======*/}
					<div className="about-governance-section sp2">
						<div className="container">
							<div className="row">
								<div className="col-lg-10 m-auto">
									<div className="modern-section-header text-center space-margin60">
										<span className="section-accent-label">Governance & Oversight</span>
										<div className="space20" />
										<h2 className="modern-section-title">Governance & Oversight</h2>
									</div>
									<div className="space40" />
									<div className="compact-silver-text-box">
										<div className="compact-text-content">
											<p>The Africa Trade Awards are governed through a structured oversight framework designed to ensure professional judgment, consistency, and institutional credibility in all recognition decisions.</p>
											<div className="space20" />
											<p>Governance arrangements reflect the nature of the Awards as recognition honours, grounded in evidence of delivered outcomes and assessed through informed, independent review.</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					{/*===== GOVERNANCE & OVERSIGHT AREA ENDS =======*/}
					
					{/*===== RECOGNITION & VALIDATION COMMITTEE AREA STARTS =======*/}
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
					{/*===== COMMITTEE PROFILES AREA STARTS =======*/}
					<div className="about-governance-section sp2">
						<div className="container">
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
					{/*===== COMMITTEE PROFILES AREA ENDS =======*/}
					{/*===== RECOGNITION & VALIDATION COMMITTEE AREA ENDS =======*/}
					
					{/*===== SUMMIT INFORMATION AREA STARTS =======*/}
					<div className="about-summit-section sp2">
						<div className="container">
							<div className="row">
								<div className="col-lg-10 m-auto">
									<div className="modern-section-header text-center space-margin60">
										<span className="section-accent-label">Africa Trade Summit 2026</span>
										<div className="space20" />
										<h2 className="modern-section-title">Ceremony Location</h2>
									</div>
									<div className="space40" />
									<div className="compact-silver-text-box">
										<div className="compact-text-content text-center">
											<p>The Africa Trade Awards 2026 will be conferred during the Africa Trade Summit 2026, convened by the African Trade Chamber in Accra, Ghana, bringing together leaders from government, finance, industry, and trade institutions from across Africa and beyond.</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					{/*===== SUMMIT INFORMATION AREA ENDS =======*/}
				</div>
			</Layout>
		</>
	)
}
