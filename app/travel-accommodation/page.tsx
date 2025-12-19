'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"

export default function TravelAccommodation() {
	return (
		<Layout headerStyle={1} footerStyle={1}>
			<div>
				<div className="inner-page-header" style={{ backgroundImage: 'url(assets/img/bg/header-bg5.png)' }}>
					<div className="container">
						<div className="row">
							<div className="col-lg-4 m-auto">
								<div className="heading1 text-center">
									<h1>Travel &amp; Accommodation</h1>
									<div className="space20" />
									<Link href="/">Home <i className="fa-solid fa-angle-right" /> <span>Travel &amp; Accommodation</span></Link>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/*===== OFFICIAL VENUE =======*/}
				<div className="about1-section-area sp1">
					<div className="container">
						<div className="row">
							<div className="col-lg-8 m-auto">
								<div className="heading2 text-center space-margin60">
									<h5 data-aos="fade-up" data-aos-duration={800}>Official Venue</h5>
									<div className="space16" />
									<h2 className="text-anime-style-3">Kempinski Gold Coast City Hotel, Accra</h2>
									<div className="space24" />
									<p data-aos="fade-up" data-aos-duration={900}>Gamel Abdul Nasser Ave, Accra, Ghana</p>
									<p data-aos="fade-up" data-aos-duration={900}><strong>Check-in:</strong> 2:00 p.m. | <strong>Check-out:</strong> 12:00 noon</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/*===== PARTNER HOTELS =======*/}
				<div className="event-team-area sp2">
					<div className="container">
						<div className="row">
							<div className="col-lg-6 m-auto">
								<div className="heading2 text-center space-margin60">
									<h5>Partner Hotels</h5>
									<div className="space16" />
									<h2>Other Accommodation Options</h2>
									<p className="mt-3">All provide shuttle services to Kempinski during the event period.</p>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-lg-6 col-md-6" data-aos="zoom-in" data-aos-duration={800}>
								<div className="event2-boxarea">
									<div className="content-area">
										<h3>Movenpick Ambassador</h3>
									</div>
								</div>
							</div>
							<div className="col-lg-6 col-md-6" data-aos="zoom-in" data-aos-duration={900}>
								<div className="event2-boxarea">
									<div className="content-area">
										<h3>Accra City Hotel</h3>
									</div>
								</div>
							</div>
							<div className="col-lg-6 col-md-6" data-aos="zoom-in" data-aos-duration={1000}>
								<div className="event2-boxarea">
									<div className="content-area">
										<h3>Alisa Hotel</h3>
									</div>
								</div>
							</div>
							<div className="col-lg-6 col-md-6" data-aos="zoom-in" data-aos-duration={1100}>
								<div className="event2-boxarea">
									<div className="content-area">
										<h3>One Oxford Hotel</h3>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/*===== VISA & ENTRY =======*/}
				<div className="about1-section-area sp2">
					<div className="container">
						<div className="row">
							<div className="col-lg-8 m-auto">
								<div className="heading2 text-center space-margin60">
									<h5 data-aos="fade-up" data-aos-duration={800}>Visa &amp; Entry</h5>
									<div className="space16" />
									<div className="text-left" data-aos="fade-up" data-aos-duration={900}>
										<p>Valid passport (6 months) + ATC invitation + hotel proof.</p>
										<p><strong>Visa support:</strong> <Link href="mailto:participants@africatradesummit.com">participants@africatradesummit.com</Link></p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/*===== TRANSFERS =======*/}
				<div className="about1-section-area sp2">
					<div className="container">
						<div className="row">
							<div className="col-lg-8 m-auto">
								<div className="heading2 text-center space-margin60">
									<h5 data-aos="fade-up" data-aos-duration={800}>Transfers</h5>
									<div className="space16" />
									<div className="text-left" data-aos="fade-up" data-aos-duration={900}>
										<p>VIP pickups | Delegate shuttles | Airport desk (28–30 Jan 2026).</p>
									</div>
									<div className="space32" />
									<div className="btn-area1">
										<Link href="/contact" className="vl-btn1">Submit Arrival Details</Link>
										<Link href="/contact" className="vl-btn2">Request Airport Assistance</Link>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/*===== LOCAL INFO =======*/}
				<div className="choose-section-area sp2">
					<div className="container">
						<div className="row">
							<div className="col-lg-8 m-auto">
								<div className="heading2 text-center space-margin60">
									<h5>Local Information</h5>
									<div className="space16" />
									<div className="row">
										<div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration={800}>
											<div className="choose-widget-boxarea">
												<div className="content-area">
													<h6>Language</h6>
													<p>English</p>
												</div>
											</div>
										</div>
										<div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration={900}>
											<div className="choose-widget-boxarea">
												<div className="content-area">
													<h6>Weather</h6>
													<p>30 °C avg</p>
												</div>
											</div>
										</div>
										<div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration={1000}>
											<div className="choose-widget-boxarea">
												<div className="content-area">
													<h6>Time Zone</h6>
													<p>GMT (+0)</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/*===== HEALTH & SAFETY =======*/}
				<div className="about1-section-area sp2">
					<div className="container">
						<div className="row">
							<div className="col-lg-8 m-auto">
								<div className="heading2 text-center space-margin60">
									<h5 data-aos="fade-up" data-aos-duration={800}>Health &amp; Safety</h5>
									<div className="space16" />
									<p data-aos="fade-up" data-aos-duration={900}>Health &amp; Safety Protocol in force with on-site medical desk.</p>
									<div className="space32" />
									<div className="contact-info">
										<p><strong>Contact:</strong></p>
										<p>Email: <Link href="mailto:participants@africatradesummit.com">participants@africatradesummit.com</Link></p>
										<p>Phone: <Link href="tel:+233505366200">+233 50 536 6200</Link></p>
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




