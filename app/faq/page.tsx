'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"

export default function Faq() {
	const [activeCard, setActiveCard] = useState<number | null>(null)
	const [searchQuery, setSearchQuery] = useState("")
	const videoRef = useRef<HTMLVideoElement>(null)

	// Reset active card when search changes
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

	const faqs = [
		{
			id: 1,
			question: "What are the Africa Trade Awards?",
			answer: "The Africa Trade Awards are recognition honours established by the African Trade Chamber to acknowledge individuals, institutions, enterprises, and public authorities whose work has had a material impact on Africa's trade and industrial development.",
			icon: "fa-trophy",
			category: "About"
		},
		{
			id: 2,
			question: "Are the Awards competitive?",
			answer: "No. The Africa Trade Awards are conferred as recognition honours. They do not operate as competitive prizes and are not based on open nominations, rankings, or public voting.",
			icon: "fa-medal",
			category: "Process"
		},
		{
			id: 3,
			question: "How are recognition decisions made?",
			answer: "Recognition decisions are made through a structured review process conducted by the Recognition & Validation Committee. The Committee assesses evidence of delivered outcomes within the reference period, drawing on professional judgment and sector expertise.",
			icon: "fa-clipboard-check",
			category: "Process"
		},
		{
			id: 4,
			question: "What types of contributions are recognised?",
			answer: "The Awards recognise contributions that strengthened trade execution, industrial production, market connectivity, trade finance, infrastructure, payment systems, or policy implementation. Recognition is grounded in work that is operational and in use.",
			icon: "fa-handshake",
			category: "Eligibility"
		},
		{
			id: 5,
			question: "Who is eligible for recognition?",
			answer: "Recognition may be conferred on individuals, enterprises, financial institutions, public authorities, and regional or continental bodies whose work falls within the scope of Africa's trade and industrial systems.",
			icon: "fa-users",
			category: "Eligibility"
		},
		{
			id: 6,
			question: "Is there a nomination or application process?",
			answer: "No. Recognition is not based on applications or public nominations. Consideration is guided by evidence of impact and professional assessment by the Recognition & Validation Committee.",
			icon: "fa-file-circle-question",
			category: "Process"
		},
		{
			id: 7,
			question: "What is the reference period for assessment?",
			answer: "The reference period for assessment is communicated as part of the Awards framework and reflects recent, demonstrable contributions relevant to the recognition year.",
			icon: "fa-calendar-days",
			category: "Process"
		},
		{
			id: 8,
			question: "Who oversees the Awards process?",
			answer: "The Awards are overseen by the Recognition & Validation Committee, with independent professional support provided by Forvis Mazars as Independent Partner of the Awards.",
			icon: "fa-shield-halved",
			category: "Governance"
		},
		{
			id: 9,
			question: "When and where are the Awards conferred?",
			answer: "The Africa Trade Awards 2026 will be conferred during the Africa Trade Summit 2026, convened by the African Trade Chamber in Accra, Ghana.",
			icon: "fa-location-dot",
			category: "Event"
		}
	]

	// Filter FAQs based on search
	const filteredFaqs = faqs.filter(faq =>
		faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
		faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
	)

	// Handle card click with smooth scroll
	const handleCardClick = (faqId: number) => {
		const isExpanding = activeCard !== faqId
		setActiveCard(isExpanding ? faqId : null)
		
		// Smooth scroll to card when expanding
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
								<div className="col-lg-9 m-auto">
									<div className="heading1 text-center">
										<div className="space20" />
										<Link href="/"><span className="breadcrumb-home">Home</span> <i className="fa-solid fa-angle-right" /> <span className="breadcrumb-current">Frequently Asked Questions</span></Link>
									</div>
								</div>
							</div>
						</div>
					</div>
					
					{/*===== PREMIUM GRID FAQ AREA STARTS =======*/}
					<div className="premium-faq-grid-section sp1">
						<div className="container">
							{/* Header Section */}
							<div className="row">
								<div className="col-lg-8 m-auto">
									<div className="premium-faq-header text-center">
										<p className="faq-subtitle">Everything you need to know about the Africa Trade Awards 2026</p>
									</div>
								</div>
							</div>

							<div className="space40" />

							{/* Search Bar */}
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


							{/* FAQ Grid Cards */}
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

							{/* Contact Section */}
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
					{/*===== PREMIUM GRID FAQ AREA ENDS =======*/}
				</div>
			</Layout>
		</>
	)
}
