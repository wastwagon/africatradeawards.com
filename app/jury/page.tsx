'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"

export default function Jury() {
	return (
		<Layout headerStyle={1} footerStyle={1}>
			<div>
				<div className="inner-page-header" style={{ backgroundImage: 'url(assets/img/bg/header-bg5.png)' }}>
					<div className="container">
						<div className="row">
							<div className="col-lg-4 m-auto">
								<div className="heading1 text-center">
									<h1>Jury &amp; Evaluation</h1>
									<div className="space20" />
									<Link href="/">Home <i className="fa-solid fa-angle-right" /> <span>Jury &amp; Evaluation</span></Link>
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
									<h2 className="modern-section-title" data-aos="fade-up" data-aos-duration={900}>Integrity at the Heart of the Africa Trade Awards</h2>
									<div className="space16" />
									<p className="modern-section-subtitle" data-aos="fade-up" data-aos-duration={1000}>Integrity lies at the heart of the Africa Trade Awards (ATA). Our multidisciplinary Jury Board ensures every nomination is assessed objectively and transparently, reflecting the 2026 theme &quot;Honouring the Champions of Africa&apos;s Trade and Industrialisation.&quot;</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/*===== JURY DETAILS =======*/}
				<div className="choose-section-area modern-jury-section sp2">
					<div className="jury-gradient-bg"></div>
					<div className="container">
						<div className="row">
							<div className="col-lg-10 m-auto">
								<div className="modern-jury-grid">
									<div className="modern-jury-card" data-aos="fade-up" data-aos-duration={800} data-aos-once="true">
										<div className="jury-card-icon-wrapper">
											<div className="jury-icon-bg-gradient"></div>
											<i className="fa-solid fa-users-gear"></i>
										</div>
										<div className="jury-card-content">
											<h3>Composition</h3>
											<p>Trade, finance, academia, industry, and governance leaders from across Africa.</p>
										</div>
										<div className="jury-card-accent-line"></div>
									</div>
									<div className="modern-jury-card" data-aos="fade-up" data-aos-duration={900} data-aos-once="true">
										<div className="jury-card-icon-wrapper">
											<div className="jury-icon-bg-gradient"></div>
											<i className="fa-solid fa-shield-halved"></i>
										</div>
										<div className="jury-card-content">
											<h3>Principles</h3>
											<p>Objectivity, Fairness, Transparency, Diversity, Confidentiality.</p>
										</div>
										<div className="jury-card-accent-line"></div>
									</div>
									<div className="modern-jury-card modern-jury-card-wide" data-aos="fade-up" data-aos-duration={1000} data-aos-once="true">
										<div className="jury-card-icon-wrapper">
											<div className="jury-icon-bg-gradient"></div>
											<i className="fa-solid fa-clipboard-check"></i>
										</div>
										<div className="jury-card-content">
											<h3>Evaluation Criteria</h3>
											<p>Innovation, Impact, Sustainability, AfCFTA Contribution, Ethics.</p>
										</div>
										<div className="jury-card-accent-line"></div>
									</div>
								</div>
								<div className="space40" />
								<div className="text-center">
									<p className="jury-declaration-text" data-aos="fade-up" data-aos-duration={900}>Each juror signs a confidentiality and conflict-of-interest declaration prior to evaluation.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/*===== CTA AREA =======*/}
				<div className="about1-section-area sp2">
					<div className="container">
						<div className="row">
							<div className="col-lg-6 m-auto">
								<div className="btn-area1 text-center">
									<Link href="/contact" className="elegant-btn">
										<span>Meet the Jury</span>
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


