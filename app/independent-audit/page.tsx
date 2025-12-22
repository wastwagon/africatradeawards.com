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
									<Link href="/"><span className="breadcrumb-home">Home</span> <i className="fa-solid fa-angle-right" /> <span className="breadcrumb-current">Independent Audit</span></Link>
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
								<div className="heading2 text-center space-margin60">
									<h5 data-aos="fade-up" data-aos-duration={800}>Overview</h5>
									<div className="space18" />
									<h2 className="text-anime-style-3" data-aos="fade-up" data-aos-duration={900}>Guaranteeing Integrity Through Independent Verification</h2>
									<div className="space16" />
									<p data-aos="fade-up" data-aos-duration={1000}>To guarantee integrity, the Africa Trade Awards are independently audited by Forvis Mazars Ghana, the official Independent Process Verification Partner.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/*===== SCOPE OF VERIFICATION =======*/}
				<div className="modern-benefits-section">
					<div className="container">
						<div className="row">
							<div className="col-lg-8 m-auto">
								<div className="heading2 text-center space-margin60">
									<h5 data-aos="fade-up" data-aos-duration={800}>Scope of Verification</h5>
									<div className="space18" />
									<h2 className="text-anime-style-3">What We Verify</h2>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-duration={800}>
								<div className="modern-press-card">
									<div className="press-image-wrapper">
										<img src="/assets/img/all-images/about/about-img8.png" alt="Nomination & Eligibility Review" />
										<div className="press-overlay"></div>
										<div className="press-number-badge">01</div>
									</div>
									<div className="press-content">
										<h4>Nomination &amp; Eligibility Review</h4>
										<p>Verification of all nomination submissions and eligibility criteria compliance.</p>
									</div>
								</div>
							</div>
							<div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-duration={900}>
								<div className="modern-press-card">
									<div className="press-image-wrapper">
										<img src="/assets/img/all-images/about/about-img8.png" alt="Evaluation Scoring Integrity" />
										<div className="press-overlay"></div>
										<div className="press-number-badge">02</div>
									</div>
									<div className="press-content">
										<h4>Evaluation Scoring Integrity</h4>
										<p>Audit of evaluation process and scoring methodology to ensure fairness and objectivity.</p>
									</div>
								</div>
							</div>
							<div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-duration={1000}>
								<div className="modern-press-card">
									<div className="press-image-wrapper">
										<img src="/assets/img/all-images/about/about-img8.png" alt="Data Security & Confidentiality" />
										<div className="press-overlay"></div>
										<div className="press-number-badge">03</div>
									</div>
									<div className="press-content">
										<h4>Data Security &amp; Confidentiality</h4>
										<p>Review of data handling procedures and confidentiality protocols.</p>
									</div>
								</div>
							</div>
							<div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-duration={1100}>
								<div className="modern-press-card">
									<div className="press-image-wrapper">
										<img src="/assets/img/all-images/about/about-img8.png" alt="Result Compilation" />
										<div className="press-overlay"></div>
										<div className="press-number-badge">04</div>
									</div>
									<div className="press-content">
										<h4>Result Compilation</h4>
										<p>Verification of result compilation and accuracy of final outcomes.</p>
									</div>
								</div>
							</div>
							<div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-duration={1200}>
								<div className="modern-press-card">
									<div className="press-image-wrapper">
										<img src="/assets/img/all-images/about/about-img8.png" alt="Post-Award Audit Report" />
										<div className="press-overlay"></div>
										<div className="press-number-badge">05</div>
									</div>
									<div className="press-content">
										<h4>Post-Award Audit Report</h4>
										<p>Comprehensive audit report issued after the Awards ceremony.</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/*===== GOVERNANCE FRAMEWORK =======*/}
				<div className="about1-section-area modern-governance-integrity-section sp2">
					<div className="container">
						<div className="row">
							<div className="col-lg-10 m-auto">
								<div className="heading2 text-center space-margin60">
									<h5 data-aos="fade-up" data-aos-duration={800}>Governance & Integrity</h5>
									<div className="space18" />
									<h2 className="text-anime-style-3">Transparency and Trust</h2>
									<div className="space24" />
									<p data-aos="fade-up" data-aos-duration={900} style={{ marginBottom: '40px', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}>
										The Awards operate under a governance framework guaranteeing transparency and trust:
									</p>
								</div>
								<div className="governance-integrity-grid">
									<div className="governance-integrity-item" data-aos="fade-up" data-aos-duration={900}>
										<div className="governance-item-icon">
											<i className="fa-solid fa-building"></i>
										</div>
										<div className="governance-item-content">
											<h4>Host Institution</h4>
											<p>African Trade Chamber (ATC)</p>
										</div>
									</div>
									<div className="governance-integrity-item" data-aos="fade-up" data-aos-duration={1000}>
										<div className="governance-item-icon">
											<i className="fa-solid fa-copyright"></i>
										</div>
										<div className="governance-item-content">
											<h4>Intellectual Property Holder</h4>
											<p>Agile Media Solutions</p>
										</div>
									</div>
									<div className="governance-integrity-item" data-aos="fade-up" data-aos-duration={1100}>
										<div className="governance-item-icon">
											<i className="fa-solid fa-shield-halved"></i>
										</div>
										<div className="governance-item-content">
											<h4>Independent Verification Partner</h4>
											<p>Forvis Mazars Ghana</p>
										</div>
									</div>
									<div className="governance-integrity-item" data-aos="fade-up" data-aos-duration={1200}>
										<div className="governance-item-icon">
											<i className="fa-solid fa-users-line"></i>
										</div>
										<div className="governance-item-content">
											<h4>Oversight Board</h4>
											<p>Representatives from ATC, Agile, and independent experts</p>
										</div>
									</div>
								</div>
								<div className="space32" />
								<div className="governance-integrity-statement" data-aos="fade-up" data-aos-duration={1300}>
									<p>All nominations and evaluations undergo rigorous scrutiny and independent verification prior to ratification.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/*===== VERIFICATION STATEMENT =======*/}
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
										<span className="breadcrumb-current">Download Verification Statement</span>
										<i className="fa-solid fa-paper-plane"></i>
									</Link>
									<Link href="/contact" className="elegant-btn">
										<span className="breadcrumb-current">Meet Oversight Board</span>
										<i className="fa-solid fa-paper-plane"></i>
									</Link>
									<Link href="/partnerships" className="elegant-btn">
										<span className="breadcrumb-current">Partner with ATA</span>
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





