'use client'
import Layout from "@/components/layout/Layout"
import { DEFAULT_FAQS } from "@/lib/cms-defaults"
import Link from "next/link"
import { useState, useEffect } from "react"
import PublicPageHero from '@/components/sections/PublicPageHero'

export default function Faq() {
	const [activeCard, setActiveCard] = useState<number | null>(null)
	const [searchQuery, setSearchQuery] = useState("")
	const [faqs, setFaqs] = useState(DEFAULT_FAQS.map((item, index) => ({ id: index + 1, ...item, icon: "fa-circle-question" })))

	// Reset active card when search changes
	useEffect(() => {
		setActiveCard(null)
	}, [searchQuery])

	useEffect(() => {
		void (async () => {
			try {
				const res = await fetch('/api/site/faqs', { cache: 'no-store' })
				const data = await res.json()
				if (!res.ok || !Array.isArray(data.faqs)) return
				setFaqs(
					data.faqs.map((item: Record<string, unknown>, index: number) => ({
						id: index + 1,
						question: String(item.question ?? ''),
						answer: String(item.answer ?? ''),
						category: String(item.category ?? 'General'),
						icon: "fa-circle-question",
					}))
				)
			} catch {
				// Keep defaults on failure.
			}
		})()
	}, [])

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
			<Layout>
				<div>
					<PublicPageHero
						title="Frequently Asked Questions"
						currentLabel="Frequently Asked Questions"
						subtitle="Everything you need to know about nominations, voting, judging, and event participation."
					/>
					
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
