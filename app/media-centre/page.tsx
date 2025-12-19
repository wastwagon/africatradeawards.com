'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"

export default function MediaCentre() {
	return (
		<Layout headerStyle={1} footerStyle={1}>
			<div>
				<div className="inner-page-header" style={{ backgroundImage: 'url(assets/img/bg/header-bg5.png)' }}>
					<div className="container">
						<div className="row">
							<div className="col-lg-4 m-auto">
								<div className="heading1 text-center">
									<h1>Media Centre</h1>
									<div className="space20" />
									<Link href="/">Home <i className="fa-solid fa-angle-right" /> <span>Media Centre</span></Link>
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
									<h2 className="text-anime-style-3">Official Communications Hub</h2>
									<div className="space24" />
									<p data-aos="fade-up" data-aos-duration={900}>The Media Centre is the official communications hub for journalists, photographers, and broadcasters covering Africa&apos;s premier celebration of trade excellence.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/*===== PRESS RELEASES =======*/}
				<div className="blog1-section-area sp2">
					<div className="container">
						<div className="row">
							<div className="col-lg-6 m-auto">
								<div className="blog-header text-center heading2 space-margin60">
									<h5>Press Releases</h5>
									<div className="space16" />
									<h2>Latest Updates</h2>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration={800}>
								<div className="blog1-auhtor-boxarea">
									<div className="content-area">
										<h6>Media Launch</h6>
										<div className="space16" />
										<p>Official launch announcement and event details.</p>
									</div>
								</div>
							</div>
							<div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration={900}>
								<div className="blog1-auhtor-boxarea">
									<div className="content-area">
										<h6>Jury Announcements</h6>
										<div className="space16" />
										<p>Announcement of Jury Board members and evaluation process.</p>
									</div>
								</div>
							</div>
							<div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration={1000}>
								<div className="blog1-auhtor-boxarea">
									<div className="content-area">
										<h6>Nominee Releases</h6>
										<div className="space16" />
										<p>Announcement of finalists and nominees across all categories.</p>
									</div>
								</div>
							</div>
							<div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration={1100}>
								<div className="blog1-auhtor-boxarea">
									<div className="content-area">
										<h6>Gala Highlights</h6>
										<div className="space16" />
										<p>Coverage of Awards Gala Night and winner announcements.</p>
									</div>
								</div>
							</div>
							<div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration={1200}>
								<div className="blog1-auhtor-boxarea">
									<div className="content-area">
										<h6>Post-Event Report</h6>
										<div className="space16" />
										<p>Comprehensive post-event summary and impact report.</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/*===== PHOTO & VIDEO GALLERY =======*/}
				<div className="about1-section-area sp2">
					<div className="container">
						<div className="row">
							<div className="col-lg-6 m-auto">
								<div className="heading2 text-center space-margin60">
									<h5>Photo &amp; Video Gallery</h5>
									<div className="space16" />
									<h2>Visual Content</h2>
									<div className="space24" />
									<div className="row">
										<div className="col-lg-6 col-md-6" data-aos="fade-up" data-aos-duration={800}>
											<div className="btn-area1">
												<Link href="/memories" className="vl-btn1">Launch Event</Link>
											</div>
										</div>
										<div className="col-lg-6 col-md-6" data-aos="fade-up" data-aos-duration={900}>
											<div className="btn-area1">
												<Link href="/memories" className="vl-btn1">Nominee Spotlights</Link>
											</div>
										</div>
										<div className="col-lg-6 col-md-6" data-aos="fade-up" data-aos-duration={1000}>
											<div className="btn-area1">
												<Link href="/memories" className="vl-btn1">Gala Highlights</Link>
											</div>
										</div>
										<div className="col-lg-6 col-md-6" data-aos="fade-up" data-aos-duration={1100}>
											<div className="btn-area1">
												<Link href="/memories" className="vl-btn1">Winner Interviews</Link>
											</div>
										</div>
										<div className="col-lg-12" data-aos="fade-up" data-aos-duration={1200}>
											<div className="btn-area1">
												<Link href="/memories" className="vl-btn1">Behind-the-Scenes</Link>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/*===== LIVESTREAM ACCESS =======*/}
				<div className="about1-section-area sp2">
					<div className="container">
						<div className="row">
							<div className="col-lg-8 m-auto">
								<div className="heading2 text-center space-margin60">
									<h5 data-aos="fade-up" data-aos-duration={800}>Livestream Access</h5>
									<div className="space16" />
									<p data-aos="fade-up" data-aos-duration={900}><strong>Website:</strong> <Link href="https://www.africatradeawards.com/live">www.africatradeawards.com/live</Link></p>
									<p data-aos="fade-up" data-aos-duration={900}><strong>YouTube:</strong> @AfricaTradeChamber</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/*===== ACCREDITATION =======*/}
				<div className="about1-section-area sp2">
					<div className="container">
						<div className="row">
							<div className="col-lg-8 m-auto">
								<div className="heading2 text-center space-margin60">
									<h5 data-aos="fade-up" data-aos-duration={800}>Accreditation</h5>
									<div className="space16" />
									<p data-aos="fade-up" data-aos-duration={900}>All media must register for accreditation with valid press ID and assignment letter.</p>
									<div className="space32" />
									<div className="contact-info">
										<p><strong>Press Contact:</strong></p>
										<p>Email: <Link href="mailto:media@agilemediasolutions.com">media@agilemediasolutions.com</Link></p>
										<p>Phone: <Link href="tel:+233505366200">+233 50 536 6200</Link></p>
									</div>
									<div className="space32" />
									<div className="hashtags">
										<p><strong>Hashtags:</strong> #AfricaTradeAwards #ATA2026 #AfricaTradeSummit</p>
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



