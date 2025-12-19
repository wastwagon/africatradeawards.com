'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"

export default function IndependentAudit() {
	return (
		<Layout headerStyle={1} footerStyle={1}>
			<div>
				<div className="inner-page-header" style={{ backgroundImage: 'url(assets/img/bg/header-bg5.png)' }}>
					<div className="container">
						<div className="row">
							<div className="col-lg-4 m-auto">
								<div className="heading1 text-center">
									<h1>Independent Audit &amp; Verification</h1>
									<div className="space20" />
									<Link href="/">Home <i className="fa-solid fa-angle-right" /> <span>Independent Audit</span></Link>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/*===== OVERVIEW AREA STARTS =======*/}
				<div className="about1-section-area sp1">
					<div className="container">
						<div className="row">
							<div className="col-lg-8 m-auto">
								<div className="modern-section-header text-center space-margin60">
									<span className="section-accent-label" data-aos="fade-up" data-aos-duration={800}>Overview</span>
									<div className="space20" />
									<h2 className="modern-section-title" data-aos="fade-up" data-aos-duration={900}>Guaranteeing Integrity Through Independent Verification</h2>
									<div className="space16" />
									<p className="modern-section-subtitle" data-aos="fade-up" data-aos-duration={1000}>To guarantee integrity, the Africa Trade Awards are independently audited by Forvis Mazars Ghana, the official Independent Process Verification Partner.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/*===== SCOPE OF VERIFICATION =======*/}
				<div className="choose-section-area trending-verification-section sp2">
					<div className="verification-hero-bg"></div>
					<div className="container">
						<div className="row">
							<div className="col-lg-8 m-auto">
								<div className="modern-section-header text-center space-margin60">
									<span className="section-accent-label" data-aos="fade-up" data-aos-duration={800}>Scope of Verification</span>
									<div className="space20" />
									<h2 className="modern-section-title" data-aos="fade-up" data-aos-duration={900}>What We Verify</h2>
								</div>
							</div>
						</div>
						<div className="space50" />
						<div className="row">
							<div className="col-lg-12">
								<div className="trending-verification-grid">
									<div className="trending-verification-card card-featured" data-aos="fade-up" data-aos-duration={800} data-aos-once="true">
										<div className="card-number-overlay">
											<span>01</span>
										</div>
										<div className="card-gradient-overlay"></div>
										<div className="card-content-inner">
											<div className="card-icon-featured">
												<div className="icon-glow"></div>
												<i className="fa-solid fa-file-circle-check"></i>
											</div>
											<h3>Nomination &amp; Eligibility Review</h3>
											<p>Verification of all nomination submissions and eligibility criteria compliance.</p>
										</div>
										<div className="card-border-glow"></div>
									</div>
									<div className="trending-verification-card" data-aos="fade-up" data-aos-duration={900} data-aos-once="true">
										<div className="card-number-overlay">
											<span>02</span>
										</div>
										<div className="card-gradient-overlay"></div>
										<div className="card-content-inner">
											<div className="card-icon-featured">
												<div className="icon-glow"></div>
												<i className="fa-solid fa-chart-line"></i>
											</div>
											<h3>Evaluation Scoring Integrity</h3>
											<p>Audit of evaluation process and scoring methodology to ensure fairness and objectivity.</p>
										</div>
										<div className="card-border-glow"></div>
									</div>
									<div className="trending-verification-card" data-aos="fade-up" data-aos-duration={1000} data-aos-once="true">
										<div className="card-number-overlay">
											<span>03</span>
										</div>
										<div className="card-gradient-overlay"></div>
										<div className="card-content-inner">
											<div className="card-icon-featured">
												<div className="icon-glow"></div>
												<i className="fa-solid fa-lock"></i>
											</div>
											<h3>Data Security &amp; Confidentiality</h3>
											<p>Review of data handling procedures and confidentiality protocols.</p>
										</div>
										<div className="card-border-glow"></div>
									</div>
									<div className="trending-verification-card" data-aos="fade-up" data-aos-duration={1100} data-aos-once="true">
										<div className="card-number-overlay">
											<span>04</span>
										</div>
										<div className="card-gradient-overlay"></div>
										<div className="card-content-inner">
											<div className="card-icon-featured">
												<div className="icon-glow"></div>
												<i className="fa-solid fa-calculator"></i>
											</div>
											<h3>Result Compilation</h3>
											<p>Verification of result compilation and accuracy of final outcomes.</p>
										</div>
										<div className="card-border-glow"></div>
									</div>
									<div className="trending-verification-card" data-aos="fade-up" data-aos-duration={1200} data-aos-once="true">
										<div className="card-number-overlay">
											<span>05</span>
										</div>
										<div className="card-gradient-overlay"></div>
										<div className="card-content-inner">
											<div className="card-icon-featured">
												<div className="icon-glow"></div>
												<i className="fa-solid fa-file-lines"></i>
											</div>
											<h3>Post-Award Audit Report</h3>
											<p>Comprehensive audit report issued after the Awards ceremony.</p>
										</div>
										<div className="card-border-glow"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/*===== GOVERNANCE FRAMEWORK =======*/}
				<div className="about1-section-area trending-governance-section sp2">
					<div className="container">
						<div className="row">
							<div className="col-lg-10 m-auto">
								<div className="trending-governance-grid">
									<div className="trending-governance-card" data-aos="fade-up" data-aos-duration={800} data-aos-once="true">
										<div className="governance-card-pattern"></div>
										<div className="governance-card-content">
											<div className="governance-icon-featured">
												<div className="icon-pulse"></div>
												<i className="fa-solid fa-users-line"></i>
											</div>
											<h3>Governance Framework</h3>
											<p>Oversight Board comprising ATC, Agile Media Solutions, Forvis Mazars Ghana, and an independent trade expert.</p>
										</div>
										<div className="governance-card-shine"></div>
									</div>
									<div className="trending-governance-card" data-aos="fade-up" data-aos-duration={900} data-aos-once="true">
										<div className="governance-card-pattern"></div>
										<div className="governance-card-content">
											<div className="governance-icon-featured">
												<div className="icon-pulse"></div>
												<i className="fa-solid fa-certificate"></i>
											</div>
											<h3>Verification Statement</h3>
											<p>After review, Forvis Mazars Ghana issues a Verification Statement confirming adherence to all procedures and international standards of fairness.</p>
										</div>
										<div className="governance-card-shine"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/*===== CTA AREA =======*/}
				<div className="about1-section-area sp2">
					<div className="container">
						<div className="row">
							<div className="col-lg-10 m-auto">
								<div className="trending-cta-group">
									<Link href="/contact" className="elegant-btn">
										<span>Download Verification Statement</span>
										<i className="fa-solid fa-paper-plane"></i>
									</Link>
									<Link href="/contact" className="elegant-btn">
										<span>Meet Oversight Board</span>
										<i className="fa-solid fa-paper-plane"></i>
									</Link>
									<Link href="/partnerships" className="elegant-btn">
										<span>Partner with ATA</span>
										<i className="fa-solid fa-paper-plane"></i>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	)
}



