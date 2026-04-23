'use client'

import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"

export type FaqDisplayItem = {
	id: number
	question: string
	answer: string
	category: string
	icon: string
}

export default function FaqClient({ initialFaqs }: { initialFaqs: FaqDisplayItem[] }) {
	const [activeCard, setActiveCard] = useState<number | null>(null)
	const [searchQuery, setSearchQuery] = useState("")
	const [faqs] = useState(initialFaqs)
	const videoRef = useRef<HTMLVideoElement>(null)

	useEffect(() => {
		setActiveCard(null)
	}, [searchQuery])

	useEffect(() => {
		const video = videoRef.current
		if (video) {
			video.play().catch((error) => {
				console.warn('Video autoplay failed:', error)
			})
		}
	}, [])

	const filteredFaqs = faqs.filter(faq =>
		faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
		faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
	)

	const handleCardClick = (faqId: number) => {
		const isExpanding = activeCard !== faqId
		setActiveCard(isExpanding ? faqId : null)

		if (isExpanding) {
			setTimeout(() => {
				const element = document.querySelector(`[data-faq-id="${faqId}"]`)
				if (element) {
					element.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
				}
			}, 100)
		}
	}

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
								<div className="col-lg-9 m-auto">
									<div className="heading1 text-center">
										<div className="space20" />
										<Link href="/"><span className="breadcrumb-home">Home</span> <i className="fa-solid fa-angle-right" /> <span className="breadcrumb-current">Frequently Asked Questions</span></Link>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="premium-faq-grid-section sp1">
						<div className="container">
							<div className="row">
								<div className="col-lg-8 m-auto">
									<div className="premium-faq-header text-center">
										<p className="faq-subtitle">Everything you need to know about the Africa Trade Awards 2026</p>
									</div>
								</div>
							</div>

							<div className="space40" />

							<div className="row">
								<div className="col-lg-7 m-auto">
									<div className="premium-search-container">
										<div className="premium-search-box">
											<i className="fa-solid fa-magnifying-glass"></i>
											<input
												type="text"
												placeholder="Search questions..."
												value={searchQuery}
												onChange={(e) => setSearchQuery(e.target.value)}
											/>
											{searchQuery && (
												<button onClick={() => setSearchQuery("")} className="search-clear-btn">
													<i className="fa-solid fa-times"></i>
												</button>
											)}
										</div>
									</div>
								</div>
							</div>

							<div className="space50" />

							<div className="row">
								<div className="col-lg-12">
									{filteredFaqs.length > 0 ? (
										<div className="premium-faq-grid">
											{filteredFaqs.map((faq, index) => (
												<div
													key={faq.id}
													data-faq-id={faq.id}
													className={`premium-faq-card ${activeCard === faq.id ? 'expanded' : ''}`}
													onClick={() => handleCardClick(faq.id)}
													style={{ animationDelay: `${index * 50}ms` }}
												>
													<div className="faq-card-inner">
														<div className="faq-card-header">
															<div className="faq-card-content">
																<span className="faq-category">{faq.category}</span>
																<h3 className="faq-card-question">{faq.question}</h3>
															</div>
															<div className="faq-card-toggle">
																<div className="toggle-icon-wrapper">
																	<i className="fa-solid fa-chevron-down"></i>
																</div>
															</div>
														</div>
														<div className={`faq-card-answer ${activeCard === faq.id ? 'visible' : ''}`}>
															<div className="faq-answer-text">
																<p>{faq.answer}</p>
															</div>
														</div>
													</div>
												</div>
											))}
										</div>
									) : (
										<div className="faq-empty-state">
											<div className="empty-state-icon">
												<i className="fa-solid fa-magnifying-glass"></i>
											</div>
											<h3>No results found</h3>
											<p>Try searching with different keywords or browse all questions below.</p>
										</div>
									)}
								</div>
							</div>

							<div className="space60" />

							<div className="row">
								<div className="col-lg-10 m-auto">
									<div className="premium-faq-contact">
										<div className="faq-contact-content">
											<div className="contact-icon-wrapper">
												<i className="fa-solid fa-envelope"></i>
											</div>
											<div className="contact-text">
												<h3>Still have questions?</h3>
												<p>Our team is here to help. Get in touch with us for more information.</p>
											</div>
											<Link href="/contact" className="premium-contact-btn">
												Contact Us
												<i className="fa-solid fa-arrow-right"></i>
											</Link>
										</div>
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
