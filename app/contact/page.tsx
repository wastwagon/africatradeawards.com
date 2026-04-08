'use client'
import Layout from "@/components/layout/Layout"
import { useSiteConfig } from '@/components/site/SiteConfigProvider'
import ContactForm from '@/components/sections/ContactForm'
import Link from "next/link"
import { useEffect, useRef } from "react"

export default function Contact() {
	const { supportEmail } = useSiteConfig()
	const videoRef = useRef<HTMLVideoElement>(null)
	const mailHref = `mailto:${supportEmail}`

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
			<Layout>
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
								<div className="col-lg-8 m-auto">
									<div className="appealing-contact-card">
										<div className="contact-card-header">
											<span className="contact-label">Contact</span>
											<div className="contact-title-badge">
												<h2>Africa Trade Awards Secretariat</h2>
											</div>
										</div>
										<div className="contact-card-body">
											<div className="contact-org-info">
												<p className="org-name">African Trade Chamber</p>
												<p className="org-location">Accra, Ghana</p>
											</div>
											<div className="contact-info-items">
												<div className="contact-info-item">
													<div className="contact-icon-box">
														<i className="fa-solid fa-envelope"></i>
													</div>
													<div className="contact-info-content">
														<span className="info-label">Email</span>
														<Link href={mailHref} className="info-value">
															{supportEmail}
														</Link>
													</div>
												</div>
												<div className="contact-info-item">
													<div className="contact-icon-box">
														<i className="fa-solid fa-phone"></i>
													</div>
													<div className="contact-info-content">
														<span className="info-label">Phone</span>
														<Link href="tel:+233554014753" className="info-value">+233 55 401 4753</Link>
													</div>
												</div>
												<div className="contact-info-item">
													<div className="contact-icon-box">
														<i className="fa-solid fa-location-dot"></i>
													</div>
													<div className="contact-info-content">
														<span className="info-label">Location</span>
														<span className="info-value">Accra, Ghana</span>
													</div>
												</div>
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
