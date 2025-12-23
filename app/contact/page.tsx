'use client'
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
										<Link href="/"><span className="breadcrumb-home">Home</span> <i className="fa-solid fa-angle-right" /> <span className="breadcrumb-current">Contact</span></Link>
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
					{/*===== CONTACT INFORMATION =======*/}
					<div className="modern-contact-section sp2">
						<div className="container">
							<div className="row">
								<div className="col-lg-10 m-auto">
									<div className="contact-card-wrapper">
									<div className="modern-section-header text-center">
										<span className="section-accent-label" data-aos="fade-up" data-aos-duration={800}>Contact Information</span>
										<div className="space20" />
										<h2 className="modern-section-title" data-aos="fade-up" data-aos-duration={900}>Africa Trade Awards Secretariat</h2>
										<div className="space24" />
										<p className="modern-section-subtitle" data-aos="fade-up" data-aos-duration={1000} style={{ marginBottom: '40px' }}>
											<strong>African Trade Chamber</strong><br />
											Accra, Ghana
										</p>
									</div>
										<div className="contact-info-grid">
											<div className="contact-info-item" data-aos="fade-up" data-aos-duration={900}>
												<div className="contact-icon">
													<i className="fa-solid fa-envelope"></i>
												</div>
												<h6>Email</h6>
												<Link href="mailto:info@africantradechamber.org">info@africantradechamber.org</Link>
											</div>
											<div className="contact-info-item" data-aos="fade-up" data-aos-duration={1000}>
												<div className="contact-icon">
													<i className="fa-solid fa-phone"></i>
												</div>
												<h6>Phone</h6>
												<Link href="tel:+233505366200">+233 50 536 6200</Link>
											</div>
											<div className="contact-info-item" data-aos="fade-up" data-aos-duration={1100}>
												<div className="contact-icon">
													<i className="fa-solid fa-handshake"></i>
												</div>
												<h6>Partnerships</h6>
												<Link href="mailto:partnerships@africantradechamber.org">partnerships@africantradechamber.org</Link>
											</div>
											<div className="contact-info-item" data-aos="fade-up" data-aos-duration={1200}>
												<div className="contact-icon">
													<i className="fa-solid fa-newspaper"></i>
												</div>
												<h6>Media</h6>
												<Link href="mailto:media@agilemediasolutions.com">media@agilemediasolutions.com</Link>
											</div>
											<div className="contact-info-item" data-aos="fade-up" data-aos-duration={1300}>
												<div className="contact-icon">
													<i className="fa-solid fa-location-dot"></i>
												</div>
												<h6>Location</h6>
												<span className="breadcrumb-current">Accra, Ghana</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					{/*===== CONTACT INFORMATION ENDS =======*/}
				</div>

			</Layout>
		</>
	)
}