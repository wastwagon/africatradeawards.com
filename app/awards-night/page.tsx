'use client'
import Countdown from '@/components/elements/Countdown'
import Layout from "@/components/layout/Layout"
import Link from "next/link"

export default function AwardsNight() {
	return (
		<Layout headerStyle={1} footerStyle={1}>
			<div>
				<div className="inner-page-header" style={{ backgroundImage: 'url(assets/img/bg/header-bg5.png)' }}>
					<div className="container">
						<div className="row">
							<div className="col-lg-4 m-auto">
								<div className="heading1 text-center">
									<h1>Awards Night Experience</h1>
									<div className="space20" />
									<Link href="/">Home <i className="fa-solid fa-angle-right" /> <span>Awards Night</span></Link>
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
									<h2 className="text-anime-style-3">The Pinnacle of Continental Recognition</h2>
									<div className="space24" />
									<p data-aos="fade-up" data-aos-duration={900}>The Africa Trade Awards Gala Night is the pinnacle of continental recognition—where policy meets enterprise and Africa&apos;s distinguished leaders gather under one roof to honour the power of trade.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/*===== EVENT DETAILS =======*/}
				<div className="event-team-area sp2">
					<div className="container">
						<div className="row">
							<div className="col-lg-8 m-auto">
								<div className="event-widget-area">
									<div className="row">
										<div className="col-lg-12">
											<div className="event2-boxarea box1" data-aos="fade-up" data-aos-duration={800}>
												<div className="content-area text-center">
													<h3>Date &amp; Time</h3>
													<div className="space16" />
													<p><strong>Friday, 30 January 2026</strong><br />6:30 p.m. – 11:00 p.m.</p>
												</div>
											</div>
										</div>
									</div>
									<div className="space30" />
									<div className="row">
										<div className="col-lg-12">
											<div className="event2-boxarea box1" data-aos="fade-up" data-aos-duration={900}>
												<div className="content-area text-center">
													<h3>Venue</h3>
													<div className="space16" />
													<p><strong>Kempinski Gold Coast City Hotel, Accra – Ghana</strong></p>
												</div>
											</div>
										</div>
									</div>
									<div className="space30" />
									<div className="row">
										<div className="col-lg-12">
											<div className="event2-boxarea box1" data-aos="fade-up" data-aos-duration={1000}>
												<div className="content-area text-center">
													<h3>Dress Code</h3>
													<div className="space16" />
													<p><strong>Black Tie / African Elegant</strong></p>
												</div>
											</div>
										</div>
									</div>
									<div className="space30" />
									<div className="row">
										<div className="col-lg-12">
											<div className="event2-boxarea box1" data-aos="fade-up" data-aos-duration={1100}>
												<div className="content-area">
													<h3>Distinguished Guests</h3>
													<div className="space16" />
													<p>Heads of State | Ministers | CEOs | DFIs | Industry Leaders | Diplomats</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/*===== EVENING HIGHLIGHTS =======*/}
				<div className="choose-section-area sp2">
					<div className="container">
						<div className="row">
							<div className="col-lg-6 m-auto">
								<div className="heading2 text-center space-margin60">
									<h5>Evening Highlights</h5>
									<div className="space18" />
									<h2>What to Expect</h2>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-lg-3 col-md-6" data-aos="zoom-in" data-aos-duration={800}>
								<div className="choose-widget-boxarea">
									<div className="icons">
										<img src="/assets/img/icons/choose-icons1.svg" alt="" />
									</div>
									<div className="space24" />
									<div className="content-area">
										<h6>Red Carpet &amp; Networking</h6>
										<div className="space16" />
										<p>Reception with continental leaders and industry pioneers.</p>
									</div>
								</div>
							</div>
							<div className="col-lg-3 col-md-6" data-aos="zoom-in" data-aos-duration={900}>
								<div className="choose-widget-boxarea">
									<div className="icons">
										<img src="/assets/img/icons/choose-icons1.svg" alt="" />
									</div>
									<div className="space24" />
									<div className="content-area">
										<h6>Opening Ceremony</h6>
										<div className="space16" />
										<p>Formal opening with keynote addresses and welcome messages.</p>
									</div>
								</div>
							</div>
							<div className="col-lg-3 col-md-6" data-aos="zoom-in" data-aos-duration={1000}>
								<div className="choose-widget-boxarea">
									<div className="icons">
										<img src="/assets/img/icons/choose-icons1.svg" alt="" />
									</div>
									<div className="space24" />
									<div className="content-area">
										<h6>Awards Presentations</h6>
										<div className="space16" />
										<p>Celebration of winners across all award categories.</p>
									</div>
								</div>
							</div>
							<div className="col-lg-3 col-md-6" data-aos="zoom-in" data-aos-duration={1100}>
								<div className="choose-widget-boxarea">
									<div className="icons">
										<img src="/assets/img/icons/choose-icons1.svg" alt="" />
									</div>
									<div className="space24" />
									<div className="content-area">
										<h6>Gala Dinner</h6>
										<div className="space16" />
										<p>Premium dining experience with continental cuisine.</p>
									</div>
								</div>
							</div>
							<div className="col-lg-6 col-md-6" data-aos="zoom-in" data-aos-duration={1200}>
								<div className="choose-widget-boxarea">
									<div className="icons">
										<img src="/assets/img/icons/choose-icons1.svg" alt="" />
									</div>
									<div className="space24" />
									<div className="content-area">
										<h6>Cultural Performances</h6>
										<div className="space16" />
										<p>Showcasing Africa&apos;s rich cultural heritage through music and dance.</p>
									</div>
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
											<Link href="/contact" className="vl-btn1">View Agenda</Link>
											<Link href="/media-centre" className="vl-btn2">Livestream Event</Link>
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



