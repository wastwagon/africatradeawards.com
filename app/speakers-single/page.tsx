
import Image from "next/image"
import Countdown from '@/components/elements/Countdown'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import PublicPageHero from '@/components/sections/PublicPageHero'
export default function SpeakersSingle() {

	return (
		<>

			<Layout>
				<div>
					<PublicPageHero
						title="Speaker Profile"
						currentLabel="Speaker Details"
						parentLabel="Speakers"
						parentHref="/speakers"
					/>
					{/*===== HERO AREA ENDS =======*/}
					{/*===== TEAM AREA STARTS =======*/}
					<div className="team-details-section-area sp1">
						<div className="container">
							<div className="row">
								<div className="col-lg-10 m-auto">
									<div className="speakers-details-box">
										<div className="row align-items-center">
											<div className="col-lg-5">
												<div className="our-team-boxarea">
													<div className="team-widget-area">
														<Image src="/assets/img/elements/elements25.png" alt="" className="elements21" width={80} height={80} />
														<Image src="/assets/img/elements/elements26.png" alt="" className="elements22" width={80} height={80} />
														<div className="img1">
															<Image src="/assets/img/all-images/team/team-img12.png" alt="" className="team-img4" width={450} height={520} />
														</div>
													</div>
													<div className="content-area">
														<Link href="/#">Prof. Benedict Oramah</Link>
														<div className="space16" />
														<p>Awards Speaker</p>
														<div className="space24" />
														<ul>
															<li>
																<Link href="/#" className="icon1"><i className="fa-brands fa-facebook-f" /></Link>
															</li>
															<li>
																<Link href="/#" className="icon2"><i className="fa-brands fa-linkedin-in" /></Link>
															</li>
															<li>
																<Link href="/#" className="icon3"><i className="fa-brands fa-instagram" /></Link>
															</li>
															<li>
																<Link href="/#" className="icon4"><i className="fa-brands fa-pinterest-p" /></Link>
															</li>
														</ul>
													</div>
												</div>
											</div>
											<div className="col-lg-7">
												<div className="speakesr-details-content heading2">
													<h2>Speaker Profile</h2>
													<div className="space16" />
													<p>Prof. Benedict Oramah is recognized for his leadership in trade finance and for advancing institutions that support industrialization, export growth, and cross-border commerce across Africa.</p>
													<div className="space32" />
													<div className="row">
														<div className="col-lg-5">
															<div className="details-content">
																<h4>Focus Area:</h4>
																<div className="space12" />
																<Link href="/#">Trade Finance & Industrial Development</Link>
																<div className="space32" />
																<h4>Mobile Number:</h4>
																<div className="space12" />
																<Link href="/tel:+(123)4567890">+(123) 456 7890</Link>
																<div className="space32" />
																<h4>Office:</h4>
																<div className="space12" />
																<Link href="/#">PO Box 16122 Collins Street West Victoria 8007 Newyork</Link>
															</div>
														</div>
														<div className="col-lg-7">
															<div className="heading2">
																<h3>Session Overview</h3>
																<div className="space16" />
																<p>This session focuses on practical pathways for scaling African trade systems: stronger trade finance architecture, investable industrial corridors, and policy-to-execution alignment that delivers measurable outcomes.</p>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="event-team-area sp10">
						<div className="container">
							<div className="row">
								<div className="col-lg-6 m-auto">
									<div className="heading2 text-center space-margin60">
										<h2>Event History Prof. Benedict Oramah</h2>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-lg-12 m-auto">
									<div className="event-widget-area">
										<div className="row">
											<div className="col-lg-10 m-auto">
												<div className="event2-boxarea box1">
													<h1 className="active">01</h1>
													<div className="row align-items-center">
														<div className="col-lg-5">
															<div className="img1">
																<Image src="/assets/img/all-images/event/event-img4.png" alt="" width={900} height={600} />
															</div>
														</div>
														<div className="col-lg-1" />
														<div className="col-lg-6">
															<div className="content-area">
																<ul>
																	<li>
																		<Link href="/#"><Image src="/assets/img/icons/clock1.svg" alt="" width={18} height={18} />10.00 AM -12.00 PM <span className="breadcrumb-current"> | </span></Link>
																	</li>
																	<li>
																		<Link href="/#"><Image src="/assets/img/icons/location1.svg" alt="" width={18} height={18} />Kempinski Gold Coast City Hotel, Accra</Link>
																	</li>
																</ul>
																<div className="space20" />
																<Link href="/event-single" className="head">Accelerating Africa&apos;s Trade Execution</Link>
																<div className="space24" />
																<div className="author-area">
																	<div className="autho-name-area">
																		<div className="img1">
																			<Image src="/assets/img/all-images/testimonials/testimonial-img1.png" alt="" width={80} height={80} />
																		</div>
																		<div className="text">
																			<Link href="/speakers-single">Prof. Benedict Oramah</Link>
																			<div className="space8" />
																			<p>Awards Speaker</p>
																		</div>
																	</div>
																	<div className="autho-name-area" style={{ padding: '0 0 0 12px', border: 'none' }}>
																		<div className="img1">
																			<Image src="/assets/img/all-images/testimonials/testimonial-img2.png" alt="" width={80} height={80} />
																		</div>
																		<div className="text">
																			<Link href="/speakers-single">Sir Sam Jonah</Link>
																			<div className="space8" />
																			<p>Trade Finance Leader</p>
																		</div>
																	</div>
																</div>
																<div className="space24" />
																<div className="btn-area1">
																	<Link href="/event/register" className="vl-btn1"><span className="demo">Buy Ticket</span></Link>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
										<div className="space48" />
										<div className="row">
											<div className="col-lg-10 m-auto">
												<div className="event2-boxarea box1">
													<h1 className="active">02</h1>
													<div className="row align-items-center">
														<div className="col-lg-7">
															<div className="content-area">
																<ul>
																	<li>
																		<Link href="/#"><Image src="/assets/img/icons/clock1.svg" alt="" width={18} height={18} />10.00 AM -12.00 PM <span className="breadcrumb-current"> | </span></Link>
																	</li>
																	<li>
																		<Link href="/#"><Image src="/assets/img/icons/location1.svg" alt="" width={18} height={18} />Kempinski Gold Coast City Hotel, Accra</Link>
																	</li>
																</ul>
																<div className="space20" />
																<Link href="/event-single" className="head">Accelerating Africa&apos;s Trade Execution</Link>
																<div className="space24" />
																<div className="author-area">
																	<div className="autho-name-area">
																		<div className="img1">
																			<Image src="/assets/img/all-images/testimonials/testimonial-img1.png" alt="" width={80} height={80} />
																		</div>
																		<div className="text">
																			<Link href="/speakers-single">H.E. Carlos Vila Nova</Link>
																			<div className="space8" />
																			<p>Awards Speaker</p>
																		</div>
																	</div>
																	<div className="autho-name-area" style={{ padding: '0 0 0 12px', border: 'none' }}>
																		<div className="img1">
																			<Image src="/assets/img/all-images/testimonials/testimonial-img2.png" alt="" width={80} height={80} />
																		</div>
																		<div className="text">
																			<Link href="/speakers-single">Patricia Poku-Diaby</Link>
																			<div className="space8" />
																			<p>Advisory Board Chair</p>
																		</div>
																	</div>
																</div>
																<div className="space24" />
																<div className="btn-area1">
																	<Link href="/event/register" className="vl-btn1"><span className="demo">Buy Ticket</span></Link>
																</div>
															</div>
															<div className="space30 d-lg-none d-block" />
														</div>
														<div className="col-lg-5">
															<div className="img1">
																<Image src="/assets/img/all-images/event/event-img5.png" alt="" width={900} height={600} />
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
										<div className="space30" />
										<div className="row">
											<div className="col-lg-10 m-auto">
												<div className="event2-boxarea box1">
													<h1 className="active">03</h1>
													<div className="row align-items-center">
														<div className="col-lg-5">
															<div className="img1">
																<Image src="/assets/img/all-images/event/event-img6.png" alt="" width={900} height={600} />
															</div>
														</div>
														<div className="col-lg-1" />
														<div className="col-lg-6">
															<div className="content-area">
																<ul>
																	<li>
																		<Link href="/#"><Image src="/assets/img/icons/clock1.svg" alt="" width={18} height={18} />10.00 AM -12.00 PM <span className="breadcrumb-current"> | </span></Link>
																	</li>
																	<li>
																		<Link href="/#"><Image src="/assets/img/icons/location1.svg" alt="" width={18} height={18} />Kempinski Gold Coast City Hotel, Accra</Link>
																	</li>
																</ul>
																<div className="space20" />
																<Link href="/event-single" className="head">Accelerating Africa&apos;s Trade Execution</Link>
																<div className="space24" />
																<div className="author-area">
																	<div className="autho-name-area">
																		<div className="img1">
																			<Image src="/assets/img/all-images/testimonials/testimonial-img1.png" alt="" width={80} height={80} />
																		</div>
																		<div className="text">
																			<Link href="/speakers-single">Prof. Benedict Oramah</Link>
																			<div className="space8" />
																			<p>Awards Speaker</p>
																		</div>
																	</div>
																	<div className="autho-name-area" style={{ padding: '0 0 0 12px', border: 'none' }}>
																		<div className="img1">
																			<Image src="/assets/img/all-images/testimonials/testimonial-img2.png" alt="" width={80} height={80} />
																		</div>
																		<div className="text">
																			<Link href="/speakers-single">Sir Sam Jonah</Link>
																			<div className="space8" />
																			<p>Head of State Delegate</p>
																		</div>
																	</div>
																</div>
																<div className="space24" />
																<div className="btn-area1">
																	<Link href="/event/register" className="vl-btn1"><span className="demo">Buy Ticket</span></Link>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					{/*===== TEAM AREA ENDS =======*/}
					{/*===== CTA AREA STARTS =======*/}
					<div className="cta1-section-area d-lg-block d-block">
						<div className="container">
							<div className="row">
								<div className="col-lg-10 m-auto">
									<div className="cta1-main-boxarea">
										<div className="timer-btn-area">
										<Countdown />
											<div className="btn-area1">
												<Link href="/event/register" className="vl-btn1">Buy Ticket</Link>
											</div>
										</div>
										<ul>
											<li>
												<Link href="/#"><Image src="/assets/img/icons/calender1.svg" alt="" width={18} height={18} />28th and 29th January 2026 - 6pm to 11:30pm</Link>
											</li>
											<li className="m-0">
												<Link href="/#"><Image src="/assets/img/icons/location1.svg" alt="" width={18} height={18} />Kempinski Gold Coast City Hotel, Accra</Link>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>
					{/*===== CTA AREA ENDS =======*/}
					{/*===== CTA AREA STARTS =======*/}
					<div className="cta1-section-area d-lg-none d-block">
						<div className="container">
							<div className="row">
								<div className="col-lg-10 m-auto">
									<div className="cta1-main-boxarea">
										<div className="timer-btn-area">
										<Countdown />
											<div className="btn-area1">
												<Link href="/event/register" className="vl-btn1">Buy Ticket</Link>
											</div>
										</div>
										<ul>
											<li>
												<Link href="/#"><Image src="/assets/img/icons/calender1.svg" alt="" width={18} height={18} />28th and 29th January 2026 - 6pm to 11:30pm</Link>
											</li>
											<li className="m-0">
												<Link href="/#"><Image src="/assets/img/icons/location1.svg" alt="" width={18} height={18} />Kempinski Gold Coast City Hotel, Accra</Link>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

			</Layout>
		</>
	)
}