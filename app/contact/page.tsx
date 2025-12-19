'use client'
import Countdown from '@/components/elements/Countdown'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import ContactForm from '@/components/sections/ContactForm'

export default function Contact() {

	return (
		<>

			<Layout headerStyle={1} footerStyle={1}>
				<div>
					<div className="inner-page-header" style={{ backgroundImage: 'url(assets/img/bg/header-bg12.png)' }}>
						<div className="container">
							<div className="row">
								<div className="col-lg-6 m-auto">
									<div className="heading1 text-center">
										<h1>Contact Us</h1>
										<div className="space20" />
										<Link href="/">Home <i className="fa-solid fa-angle-right" /> <span>Contact</span></Link>
									</div>
								</div>
							</div>
						</div>
					</div>
					{/*===== HERO AREA ENDS =======*/}
					{/*===== PREMIUM CONTACT FORM =======*/}
					<div className="sp2">
						<ContactForm />
					</div>
					{/*===== CONTACT FORM ENDS =======*/}
					{/*===== CONTACT AREA STARTS =======*/}
					<div className="contact2-bg-section">
						<div className="img1">
							<img src="/assets/img/all-images/contact/contact-img1.png" alt="" className="contact-img1" />
						</div>
						<div className="container">
							<div className="row">
								<div className="col-lg-6">
									<div className="space48" />
									<div className="row">
										<div className="col-lg-6 col-md-6">
											<div className="contact-boxarea" data-aos="zoom-in" data-aos-duration={900}>
												<div className="icons">
													<img src="/assets/img/icons/mail1.svg" alt="" />
												</div>
									<div className="text">
										<h5>General Inquiries</h5>
										<div className="space14" />
										<Link href="mailto:info@africantradechamber.org">info@africantradechamber.org</Link>
									</div>
								</div>
								<div className="space18" />
								<div className="contact-boxarea" data-aos="zoom-in" data-aos-duration={1000}>
									<div className="icons">
										<img src="/assets/img/icons/location1.svg" alt="" />
									</div>
									<div className="text">
										<h5>Our Location</h5>
										<div className="space14" />
										<Link href="/#">Accra, Ghana</Link>
									</div>
								</div>
							</div>
							<div className="col-lg-6 col-md-6">
								<div className="space20 d-md-none d-block" />
								<div className="contact-boxarea" data-aos="zoom-in" data-aos-duration={1000}>
									<div className="icons">
										<img src="/assets/img/icons/phn1.svg" alt="" />
									</div>
									<div className="text">
										<h5>Call/Message</h5>
										<div className="space14" />
										<Link href="tel:+233505366200">+233 50 536 6200</Link>
									</div>
								</div>
								<div className="space18" />
								<div className="contact-boxarea" data-aos="zoom-in" data-aos-duration={1200}>
									<div className="icons">
										<img src="/assets/img/icons/mail1.svg" alt="" />
									</div>
									<div className="text">
										<h5>Partnerships</h5>
										<div className="space14" />
										<Link href="mailto:partnerships@africantradechamber.org">partnerships@africantradechamber.org</Link>
									</div>
								</div>
								<div className="space18" />
								<div className="contact-boxarea" data-aos="zoom-in" data-aos-duration={1300}>
									<div className="icons">
										<img src="/assets/img/icons/mail1.svg" alt="" />
									</div>
									<div className="text">
										<h5>Media</h5>
										<div className="space14" />
										<Link href="mailto:media@agilemediasolutions.com">media@agilemediasolutions.com</Link>
									</div>
								</div>
							</div>
									</div>
								</div>
							</div>
						</div>
						<div className="mapouter">
							<div className="gmap_canvas">
								<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d4506257.120552435!2d88.67021924228865!3d21.954385721237916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1704088968016!5m2!1sen!2sbd" width={600} height={450} style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
							</div>
						</div>
					</div>
					<div className="space100 d-lg-block d-none" />
					<div className="space50 d-lg-none d-block" />
					{/*===== CONTACT AREA ENDS =======*/}
					{/*===== CTA AREA STARTS =======*/}
					<div className="cta1-section-area d-lg-block d-block">
						<div className="container">
							<div className="row">
								<div className="col-lg-10 m-auto">
									<div className="cta1-main-boxarea">
										<div className="timer-btn-area">
										<Countdown />
											<div className="btn-area1">
												<Link href="/nomination" className="vl-btn1">Nominate Now</Link>
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
												<Link href="/nomination" className="vl-btn1">Nominate Now</Link>
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
		</>
	)
}