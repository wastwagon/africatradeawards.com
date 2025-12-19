'use client'
import Countdown from '@/components/elements/Countdown'
import Layout from "@/components/layout/Layout"
import Link from "next/link"

export default function Nomination() {
	return (
		<Layout headerStyle={1} footerStyle={1}>
			<div>
				<div className="inner-page-header" style={{ backgroundImage: 'url(assets/img/bg/header-bg5.png)' }}>
					<div className="container">
						<div className="row">
							<div className="col-lg-4 m-auto">
								<div className="heading1 text-center">
									<h1>Nomination Process</h1>
									<div className="space20" />
									<Link href="/">Home <i className="fa-solid fa-angle-right" /> <span>Nomination Process</span></Link>
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
									<h2 className="text-anime-style-3">Rigorous Multi-Stage Evaluation System</h2>
									<div className="space24" />
									<p data-aos="fade-up" data-aos-duration={900}>Aligned with the 2026 theme &quot;Honouring the Champions of Africa&apos;s Trade and Industrialisation,&quot; the nomination process ensures credibility, fairness, and transparency through a rigorous multi-stage evaluation system.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/*===== PROCESS STEPS =======*/}
				<div className="event-team-area sp2">
					<div className="container">
						<div className="row">
							<div className="col-lg-10 m-auto">
								<div className="event-widget-area">
									<div className="row">
										<div className="col-lg-12">
											<div className="event2-boxarea box1" data-aos="fade-up" data-aos-duration={800}>
												<h1 className="active">01</h1>
												<div className="content-area">
													<h3>Eligibility &amp; Submission</h3>
													<div className="space16" />
													<p>Nominations open to individuals, enterprises, and institutions across Africa. All submissions must meet eligibility criteria and include required documentation.</p>
												</div>
											</div>
										</div>
									</div>
									<div className="space30" />
									<div className="row">
										<div className="col-lg-12">
											<div className="event2-boxarea box1" data-aos="fade-up" data-aos-duration={900}>
												<h1 className="active">02</h1>
												<div className="content-area">
													<h3>Documentation Requirements</h3>
													<div className="space16" />
													<p>Each nomination must include: profile summary (max 500 words), achievements and measurable outcomes, endorsements or references, and supporting evidence (reports, media, images).</p>
												</div>
											</div>
										</div>
									</div>
									<div className="space30" />
									<div className="row">
										<div className="col-lg-12">
											<div className="event2-boxarea box1" data-aos="fade-up" data-aos-duration={1000}>
												<h1 className="active">03</h1>
												<div className="content-area">
													<h3>Screening &amp; Verification</h3>
													<div className="space16" />
													<p>All nominations undergo initial screening for completeness and eligibility. Independent verification partner reviews all submissions for authenticity.</p>
												</div>
											</div>
										</div>
									</div>
									<div className="space30" />
									<div className="row">
										<div className="col-lg-12">
											<div className="event2-boxarea box1" data-aos="fade-up" data-aos-duration={1100}>
												<h1 className="active">04</h1>
												<div className="content-area">
													<h3>Evaluation &amp; Scoring</h3>
													<div className="space16" />
													<p>Multidisciplinary Jury Board evaluates each nomination based on criteria: Innovation, Impact, Sustainability, AfCFTA Contribution, and Ethics.</p>
												</div>
											</div>
										</div>
									</div>
									<div className="space30" />
									<div className="row">
										<div className="col-lg-12">
											<div className="event2-boxarea box1" data-aos="fade-up" data-aos-duration={1200}>
												<h1 className="active">05</h1>
												<div className="content-area">
													<h3>Independent Audit &amp; Ratification</h3>
													<div className="space16" />
													<p>Forvis Mazars Ghana conducts independent audit of evaluation process and results. Oversight Board ratifies final decisions.</p>
												</div>
											</div>
										</div>
									</div>
									<div className="space30" />
									<div className="row">
										<div className="col-lg-12">
											<div className="event2-boxarea box1" data-aos="fade-up" data-aos-duration={1300}>
												<h1 className="active">06</h1>
												<div className="content-area">
													<h3>Finalist Announcement</h3>
													<div className="space16" />
													<p>Finalists are announced through official channels. All finalists are invited to the Awards Gala Night.</p>
												</div>
											</div>
										</div>
									</div>
									<div className="space30" />
									<div className="row">
										<div className="col-lg-12">
											<div className="event2-boxarea box1" data-aos="fade-up" data-aos-duration={1400}>
												<h1 className="active">07</h1>
												<div className="content-area">
													<h3>Awards Gala</h3>
													<div className="space16" />
													<p>Winners are announced and honoured at the Africa Trade Awards Gala Night on 30 January 2026 at Kempinski Gold Coast City Hotel, Accra.</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/*===== INTEGRITY STATEMENT =======*/}
				<div className="about1-section-area sp2">
					<div className="container">
						<div className="row">
							<div className="col-lg-8 m-auto">
								<div className="heading2 text-center space-margin60">
									<h5 data-aos="fade-up" data-aos-duration={800}>Integrity Statement</h5>
									<div className="space16" />
									<p data-aos="fade-up" data-aos-duration={900} style={{ fontStyle: 'italic', fontSize: '18px' }}>All Jury decisions are final and confidential, adhering to the highest global standards of ethics and impartiality.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/*===== CTA AREA =======*/}
				<div className="cta1-section-area">
					<div className="container">
						<div className="row">
							<div className="col-lg-10 m-auto">
								<div className="cta1-main-boxarea">
									<div className="timer-btn-area">
										<Countdown />
										<div className="btn-area1">
											<Link href="/contact" className="vl-btn1">Submit Nomination</Link>
											<Link href="/award-categories" className="vl-btn2">View Categories</Link>
											<Link href="/nomination" className="vl-btn2">Download Nomination Guide</Link>
										</div>
									</div>
									<ul>
										<li>
											<Link href="/#"><img src="/assets/img/icons/calender1.svg" alt="" />30 January 2026 - 6:30pm to 11:00pm</Link>
										</li>
										<li className="m-0">
											<Link href="/#"><img src="/assets/img/icons/location1.svg" alt="" />Kempinski Gold Coast City Hotel, Accra</Link>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	)
}



