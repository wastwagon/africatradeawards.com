'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import PartnersSection from '@/components/sections/home1/PartnersSection'

const benefits = [
	{
		icon: 'fa-chart-line',
		title: 'Unrivalled Visibility',
		description: 'Maximum exposure across all event platforms and media channels.'
	},
	{
		icon: 'fa-handshake',
		title: 'Strategic Alignment',
		description: 'Alignment with ATC & AfCFTA objectives and continental trade agenda.'
	},
	{
		icon: 'fa-lightbulb',
		title: 'Thought Leadership Access',
		description: 'Access to high-level thought leadership platforms and networking opportunities.'
	},
	{
		icon: 'fa-shield-halved',
		title: 'Verified Integrity',
		description: 'Association with independently verified and audited awards process.'
	},
	{
		icon: 'fa-star',
		title: 'Legacy Impact',
		description: 'Support youth and SME programmes that create lasting continental impact.'
	},
	{
		icon: 'fa-users',
		title: 'Network Expansion',
		description: 'Connect with Africa\'s most influential trade leaders and decision-makers.'
	}
]

export default function Partnerships() {
	return (
		<Layout headerStyle={1} footerStyle={1}>
			<div>
				<div className="inner-page-header" style={{ backgroundImage: 'url(assets/img/bg/header-bg5.png)' }}>
					<div className="container">
						<div className="row">
							<div className="col-lg-4 m-auto">
								<div className="heading1 text-center">
									<h1>Partnerships &amp; Sponsorship</h1>
									<div className="space20" />
									<Link href="/">Home <i className="fa-solid fa-angle-right" /> <span>Partnerships</span></Link>
								</div>
							</div>
						</div>
					</div>
				</div>
				
				{/*===== OVERVIEW AREA =======*/}
				<div className="about1-section-area sp1">
					<div className="container">
						<div className="row">
							<div className="col-lg-8 m-auto">
								<div className="heading2 text-center space-margin60">
									<h5 data-aos="fade-up" data-aos-duration={800}>Overview</h5>
									<div className="space16" />
									<h2 className="text-anime-style-3">The Africa Trade Awards Thrives on Collaboration</h2>
									<div className="space24" />
									<p data-aos="fade-up" data-aos-duration={900}>Becoming a partner is a declaration of commitment to Africa&apos;s prosperity, sustainability, and self-determined growth—anchored in the 2026 theme &quot;Honouring the Champions of Africa&apos;s Trade and Industrialisation.&quot;</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				
				{/*===== BENEFITS SECTION =======*/}
				<div className="modern-benefits-section">
					<div className="container">
						<div className="row">
							<div className="col-lg-8 m-auto">
								<div className="heading2 text-center space-margin60">
									<h5 data-aos="fade-up" data-aos-duration={800}>Why Partner</h5>
									<div className="space18" />
									<h2 className="text-anime-style-3">Benefits of Partnership</h2>
								</div>
							</div>
						</div>
						<div className="row">
							{benefits.map((benefit, index) => (
								<div key={index} className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-duration={800 + (index * 100)}>
									<div className="modern-benefit-card">
										<div className="benefit-icon-wrapper">
											<i className={`fa-solid ${benefit.icon}`}></i>
										</div>
										<div className="benefit-content">
											<h4>{benefit.title}</h4>
											<p>{benefit.description}</p>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
				
				{/*===== PARTNERSHIP TIERS =======*/}
				<PartnersSection />
				
				{/*===== CONTACT SECTION =======*/}
				<div className="modern-contact-section">
					<div className="container">
						<div className="row">
							<div className="col-lg-10 m-auto">
								<div className="contact-card-wrapper">
									<div className="heading2 text-center">
										<h5 data-aos="fade-up" data-aos-duration={800}>Get In Touch</h5>
										<div className="space16" />
										<h2 className="text-anime-style-3">Ready to Partner With Us?</h2>
										<div className="space24" />
									</div>
									<div className="contact-info-grid">
										<div className="contact-info-item" data-aos="fade-up" data-aos-duration={900}>
											<div className="contact-icon">
												<i className="fa-solid fa-envelope"></i>
											</div>
											<h6>Email</h6>
											<Link href="mailto:partnerships@africantradechamber.org">partnerships@africantradechamber.org</Link>
										</div>
										<div className="contact-info-item" data-aos="fade-up" data-aos-duration={1000}>
											<div className="contact-icon">
												<i className="fa-solid fa-phone"></i>
											</div>
											<h6>Phone</h6>
											<Link href="tel:+233505366200">+233 50 536 6200</Link>
										</div>
									</div>
									<div className="space32" />
									<div className="cta-buttons-group">
										<Link href="/contact" className="modern-cta-btn primary" data-aos="fade-up" data-aos-duration={1100}>
											<span>Download Prospectus</span>
											<i className="fa-solid fa-download"></i>
										</Link>
										<Link href="/contact" className="modern-cta-btn secondary" data-aos="fade-up" data-aos-duration={1200}>
											<span>Become a Partner</span>
											<i className="fa-solid fa-arrow-right"></i>
										</Link>
										<Link href="/contact" className="modern-cta-btn secondary" data-aos="fade-up" data-aos-duration={1300}>
											<span>Contact Our Team</span>
											<i className="fa-solid fa-envelope"></i>
										</Link>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	)
}





