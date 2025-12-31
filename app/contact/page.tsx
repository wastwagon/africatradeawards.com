'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import ContactForm from '@/components/sections/ContactForm'
import { useEffect, useRef } from "react"

export default function Contact() {
	const videoRef = useRef<HTMLVideoElement>(null)

	useEffect(() => {
		const video = videoRef.current
		if (video) {
			video.play().catch((error) => {
				console.warn('Video autoplay failed:', error)
			})
		}
	}, [])

	return (
		<>
			<Layout headerStyle={1} footerStyle={1}>
				<div>
					<div className="inner-page-header">
						<video
							ref={videoRef}
							autoPlay
							loop
							muted
							playsInline
							preload="auto"
							className="header-video-background"
						>
							<source src="/assets/video/hero-video.mp4" type="video/mp4" />
						</video>
						<div className="container">
							<div className="row">
								<div className="col-lg-6 m-auto">
									<div className="heading1 text-center">
										<h1>Contact</h1>
										<div className="space20" />
										<Link href="/"><span className="breadcrumb-home">Home</span> <i className="fa-solid fa-angle-right" /> <span className="breadcrumb-current">Contact</span></Link>
									</div>
								</div>
							</div>
						</div>
					</div>
					
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
									<div className="compact-contact-card-wrapper">
										<div className="modern-section-header text-center">
											<span className="section-accent-label">Contact</span>
											<div className="space16" />
											<h2 className="modern-section-title">Africa Trade Awards Secretariat</h2>
											<div className="space16" />
											<p className="compact-org-name">
												<strong>African Trade Chamber</strong><br />
												<span className="compact-location">Accra, Ghana</span>
											</p>
										</div>
										<div className="compact-contact-info-grid">
											<div className="compact-contact-item">
												<div className="compact-contact-icon-wrapper">
													<i className="fa-solid fa-envelope"></i>
												</div>
												<div className="compact-contact-content">
													<h6>Email</h6>
													<Link href="mailto:secretariat@africatradeawards.com" className="compact-contact-link">secretariat@africatradeawards.com</Link>
												</div>
											</div>
											<div className="compact-contact-item">
												<div className="compact-contact-icon-wrapper">
													<i className="fa-solid fa-location-dot"></i>
												</div>
												<div className="compact-contact-content">
													<h6>Location</h6>
													<span className="compact-contact-text">Accra, Ghana</span>
												</div>
											</div>
										</div>
										<div className="space30" />
										<div className="compact-contact-description">
											<p>For further information on the Africa Trade Awards 2026, please contact the Awards Secretariat of the African Trade Chamber.</p>
											<p>Information on the Africa Trade Summit 2026, during which the Awards will be conferred, is available through the African Trade Chamber Secretariat.</p>
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
