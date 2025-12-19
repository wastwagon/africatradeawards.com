'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"

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
				{/*===== OVERVIEW AREA STARTS =======*/}
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
				{/*===== WHY PARTNER =======*/}
				<div className="choose-section-area sp2">
					<div className="container">
						<div className="row">
							<div className="col-lg-6 m-auto">
								<div className="heading2 text-center space-margin60">
									<h5>Why Partner</h5>
									<div className="space18" />
									<h2>Benefits of Partnership</h2>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration={800}>
								<div className="choose-widget-boxarea">
									<div className="icons">
										<img src="/assets/img/icons/choose-icons1.svg" alt="" />
									</div>
									<div className="space24" />
									<div className="content-area">
										<h6>Unrivalled Visibility</h6>
										<div className="space16" />
										<p>Maximum exposure across all event platforms and media channels.</p>
									</div>
								</div>
							</div>
							<div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration={900}>
								<div className="choose-widget-boxarea">
									<div className="icons">
										<img src="/assets/img/icons/choose-icons1.svg" alt="" />
									</div>
									<div className="space24" />
									<div className="content-area">
										<h6>Strategic Alignment</h6>
										<div className="space16" />
										<p>Alignment with ATC &amp; AfCFTA objectives and continental trade agenda.</p>
									</div>
								</div>
							</div>
							<div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration={1000}>
								<div className="choose-widget-boxarea">
									<div className="icons">
										<img src="/assets/img/icons/choose-icons1.svg" alt="" />
									</div>
									<div className="space24" />
									<div className="content-area">
										<h6>Thought Leadership Access</h6>
										<div className="space16" />
										<p>Access to high-level thought leadership platforms and networking opportunities.</p>
									</div>
								</div>
							</div>
							<div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration={1100}>
								<div className="choose-widget-boxarea">
									<div className="icons">
										<img src="/assets/img/icons/choose-icons1.svg" alt="" />
									</div>
									<div className="space24" />
									<div className="content-area">
										<h6>Verified Integrity</h6>
										<div className="space16" />
										<p>Association with independently verified and audited awards process.</p>
									</div>
								</div>
							</div>
							<div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration={1200}>
								<div className="choose-widget-boxarea">
									<div className="icons">
										<img src="/assets/img/icons/choose-icons1.svg" alt="" />
									</div>
									<div className="space24" />
									<div className="content-area">
										<h6>Legacy Impact</h6>
										<div className="space16" />
										<p>Support youth and SME programmes that create lasting continental impact.</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/*===== SPONSORSHIP PACKAGES =======*/}
				<div className="pricing-lan-section-area sp2">
					<div className="container">
						<div className="row">
							<div className="col-lg-5 m-auto">
								<div className="heading2 text-center space-margin60">
									<h5>Sponsorship Packages</h5>
									<div className="space18" />
									<h2>Choose Your Partnership Tier</h2>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration={800}>
								<div className="pricing-boxarea">
									<h5>Title Sponsor</h5>
									<div className="space20" />
									<p>Exclusive naming rights – &quot;Africa Trade Awards 2026 presented by [Partner]&quot;</p>
									<div className="space28" />
									<div className="btn-area1">
										<Link href="/contact" className="vl-btn1">Contact Us</Link>
									</div>
								</div>
							</div>
							<div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration={900}>
								<div className="pricing-boxarea">
									<h5>Platinum Partner</h5>
									<div className="space20" />
									<p>Category co-branding, premium visibility across all platforms</p>
									<div className="space28" />
									<div className="btn-area1">
										<Link href="/contact" className="vl-btn1">Contact Us</Link>
									</div>
								</div>
							</div>
							<div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration={1000}>
								<div className="pricing-boxarea">
									<h5>Gold Partner</h5>
									<div className="space20" />
									<p>Stage and media wall branding, digital recognition</p>
									<div className="space28" />
									<div className="btn-area1">
										<Link href="/contact" className="vl-btn1">Contact Us</Link>
									</div>
								</div>
							</div>
							<div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration={1100}>
								<div className="pricing-boxarea">
									<h5>Silver Partner</h5>
									<div className="space20" />
									<p>Digital and print recognition, event access</p>
									<div className="space28" />
									<div className="btn-area1">
										<Link href="/contact" className="vl-btn1">Contact Us</Link>
									</div>
								</div>
							</div>
							<div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration={1200}>
								<div className="pricing-boxarea">
									<h5>Category Sponsor</h5>
									<div className="space20" />
									<p>Dedicated award association, targeted visibility</p>
									<div className="space28" />
									<div className="btn-area1">
										<Link href="/contact" className="vl-btn1">Contact Us</Link>
									</div>
								</div>
							</div>
							<div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration={1300}>
								<div className="pricing-boxarea">
									<h5>Media Partner</h5>
									<div className="space20" />
									<p>Cross-platform coverage, content collaboration</p>
									<div className="space28" />
									<div className="btn-area1">
										<Link href="/contact" className="vl-btn1">Contact Us</Link>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/*===== CONTACT INFO =======*/}
				<div className="about1-section-area sp2">
					<div className="container">
						<div className="row">
							<div className="col-lg-8 m-auto">
								<div className="heading2 text-center space-margin60">
									<h5 data-aos="fade-up" data-aos-duration={800}>Get In Touch</h5>
									<div className="space16" />
									<p data-aos="fade-up" data-aos-duration={900}>Email: <Link href="mailto:partnerships@africantradechamber.org">partnerships@africantradechamber.org</Link></p>
									<p data-aos="fade-up" data-aos-duration={900}>Phone: <Link href="tel:+233505366200">+233 50 536 6200</Link></p>
									<div className="space32" />
									<div className="btn-area1">
										<Link href="/contact" className="vl-btn1">Download Prospectus</Link>
										<Link href="/contact" className="vl-btn2">Become a Partner</Link>
										<Link href="/contact" className="vl-btn2">Contact Our Team</Link>
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





