'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { useEffect, useRef } from "react"
import CommitteeProfiles from '@/components/sections/CommitteeProfiles'

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
											<img src="/assets/img/all-images/about.jpeg" alt="Africa Trade Awards" />
										</div>
									</div>
								</div>
								<div className="col-lg-6">
									<div className="overview-content">
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
					
					{/*===== RECOGNITION PROCESS & GOVERNANCE CARDS AREA STARTS =======*/}
					<div className="about1-section-area recognition-governance-cards-section sp2">
						<div className="recognition-governance-unified-card">
							<div className="recognition-governance-content-wrapper">
								{/* Left Column - Recognition Process */}
								<div className="recognition-column" data-aos="fade-up" data-aos-duration={800}>
									<h3 className="tier-name-elegant">How Recognition Works</h3>
									<div className="tier-text-elegant">
										<p>The 2026 Africa Trade Awards are conferred as recognition honours. They do not operate as competitive prizes and are not based on open nominations or public voting. Recognition is determined through a structured review process conducted by the Recognition and Validation Committee, drawing on evidence of delivered outcomes within the reference period.</p>
										<p className="tier-text-highlight">Consideration is given to the scale, durability, and relevance of each contribution, including its effect on production capacity, trade execution, industrial value chains, or policy and regulatory systems. The emphasis is on work whose impact is visible in operation—through facilities built, systems deployed, capital mobilised, or reforms implemented.</p>
									</div>
								</div>

								{/* Divider */}
								<div className="recognition-governance-divider"></div>

								{/* Right Column - Governance & Oversight */}
								<div className="governance-column" data-aos="fade-up" data-aos-duration={900}>
									<h3 className="tier-name-elegant">Governance & Oversight</h3>
									<div className="tier-text-elegant">
										<p>The Africa Trade Awards are governed through a structured oversight framework designed to ensure professional judgment, consistency, and institutional credibility in all recognition decisions.</p>
										<p className="tier-text-highlight">Governance arrangements reflect the nature of the Awards as recognition honours, grounded in evidence of delivered outcomes and assessed through informed, independent review.</p>
									</div>
								</div>
							</div>
						</div>
					</div>
					{/*===== RECOGNITION PROCESS & GOVERNANCE CARDS AREA ENDS =======*/}
					
					{/*===== RECOGNITION & VALIDATION COMMITTEE TEXT SECTION =======*/}
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
					{/*===== RECOGNITION & VALIDATION COMMITTEE TEXT SECTION ENDS =======*/}
					
					{/*===== RECOGNITION & VALIDATION COMMITTEE PROFILES SECTION =======*/}
					<div className="committee-banner-section">
						<div className="container">
							<div className="row">
								<div className="col-12">
									<CommitteeProfiles />
								</div>
							</div>
						</div>
					</div>
					{/*===== RECOGNITION & VALIDATION COMMITTEE SECTION ENDS =======*/}
				</div>
			</Layout>
		</>
	)
}
