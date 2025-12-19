'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'

const processSteps = [
	{
		number: '01',
		title: 'Eligibility & Submission',
		description: 'Nominations open to individuals, enterprises, and institutions across Africa. All submissions must meet eligibility criteria and include required documentation.',
		icon: 'fa-square-xmark'
	},
	{
		number: '02',
		title: 'Documentation Requirements',
		description: 'Each nomination must include: profile summary (max 500 words), achievements and measurable outcomes, endorsements or references, and supporting evidence.',
		icon: 'fa-folder-tree'
	},
	{
		number: '03',
		title: 'Screening & Verification',
		description: 'All nominations undergo initial screening for completeness and eligibility. Independent verification partner reviews all submissions for authenticity.',
		icon: 'fa-shield-halved'
	},
	{
		number: '04',
		title: 'Evaluation & Scoring',
		description: 'Multidisciplinary Jury Board evaluates each nomination based on criteria: Innovation, Impact, Sustainability, AfCFTA Contribution, and Ethics.',
		icon: 'fa-chart-line'
	},
	{
		number: '05',
		title: 'Independent Audit & Ratification',
		description: 'Forvis Mazars Ghana conducts independent audit of evaluation process and results. Oversight Board ratifies final decisions.',
		icon: 'fa-stamp'
	},
	{
		number: '06',
		title: 'Finalist Announcement',
		description: 'Finalists are announced through official channels. All finalists are invited to the Awards Gala Night.',
		icon: 'fa-award'
	}
]

const swiperOptions = {
	modules: [Navigation, Pagination],
	slidesPerView: 3,
	spaceBetween: 30,
	loop: false,
	navigation: {
		nextEl: '.timeline-nav-next',
		prevEl: '.timeline-nav-prev',
	},
	pagination: {
		el: '.timeline-pagination',
		clickable: true,
		type: 'bullets' as const,
	},
	breakpoints: {
		320: {
			slidesPerView: 2,
			spaceBetween: 16,
		},
		768: {
			slidesPerView: 2,
			spaceBetween: 20,
		},
		992: {
			slidesPerView: 3,
			spaceBetween: 30,
		},
		1200: {
			slidesPerView: 3,
			spaceBetween: 30,
		},
	}
}

export default function Section4New() {
	const [swiper, setSwiper] = useState<any>(null)
	const [isBeginning, setIsBeginning] = useState(true)
	const [isEnd, setIsEnd] = useState(false)
	const progressRef = useRef<HTMLDivElement>(null)
	const prevBtnRef = useRef<HTMLButtonElement>(null)
	const nextBtnRef = useRef<HTMLButtonElement>(null)

	const handleSlideChange = (swiperInstance: any) => {
		if (progressRef.current) {
			const maxIndex = processSteps.length - swiperInstance.slidesPerViewDynamic()
			const progress = maxIndex > 0 ? (swiperInstance.activeIndex / maxIndex) * 100 : 0
			progressRef.current.style.width = `${Math.min(progress, 100)}%`
		}
		setIsBeginning(swiperInstance.isBeginning)
		setIsEnd(swiperInstance.isEnd)
		
		// Update button states
		if (prevBtnRef.current) {
			prevBtnRef.current.disabled = swiperInstance.isBeginning
			prevBtnRef.current.classList.toggle('disabled', swiperInstance.isBeginning)
		}
		if (nextBtnRef.current) {
			nextBtnRef.current.disabled = swiperInstance.isEnd
			nextBtnRef.current.classList.toggle('disabled', swiperInstance.isEnd)
		}
	}

	const handleSwiperInit = (swiperInstance: any) => {
		setSwiper(swiperInstance)
		setIsBeginning(swiperInstance.isBeginning)
		setIsEnd(swiperInstance.isEnd)
		
		// Update button states on init
		if (prevBtnRef.current) {
			prevBtnRef.current.disabled = swiperInstance.isBeginning
			prevBtnRef.current.classList.toggle('disabled', swiperInstance.isBeginning)
		}
		if (nextBtnRef.current) {
			nextBtnRef.current.disabled = swiperInstance.isEnd
			nextBtnRef.current.classList.toggle('disabled', swiperInstance.isEnd)
		}
	}

	const handlePrev = () => {
		if (swiper && !swiper.isBeginning) {
			swiper.slidePrev()
		}
	}

	const handleNext = () => {
		if (swiper && !swiper.isEnd) {
			swiper.slideNext()
		}
	}

	return (
		<>
			<div className="about1-section-area nomination-process-section">
				<div className="container">
					<div className="row">
						<div className="col-lg-8 m-auto">
							<div className="heading2 text-center">
								<h2 className="text-anime-style-3 premium-section-title">Rigorous Multi-Stage Evaluation</h2>
								<div className="space12" />
								<p className="premium-section-description" data-aos="fade-up" data-aos-duration={900}>Our nomination process ensures credibility, fairness, and transparency through a rigorous multi-stage evaluation system, independently audited by Forvis Mazars Ghana.</p>
							</div>
						</div>
					</div>
					<div className="space12" />
				</div>

				{/* Timeline Carousel */}
				<div className="timeline-carousel-section">
					<div className="container">
						<div className="timeline-carousel-wrapper">
							{/* Navigation Buttons */}
							<button 
								ref={prevBtnRef}
								className={`timeline-nav-btn timeline-nav-prev ${isBeginning ? 'disabled' : ''}`}
								aria-label="Previous"
								disabled={isBeginning}
								onClick={handlePrev}
							>
								<i className="fa-solid fa-chevron-left"></i>
							</button>
							<button 
								ref={nextBtnRef}
								className={`timeline-nav-btn timeline-nav-next ${isEnd ? 'disabled' : ''}`}
								aria-label="Next"
								disabled={isEnd}
								onClick={handleNext}
							>
								<i className="fa-solid fa-chevron-right"></i>
							</button>

							{/* Progress Line */}
							<div className="timeline-progress-container">
								<div className="timeline-progress-line">
									<div className="timeline-progress-fill" ref={progressRef}></div>
								</div>
							</div>

							{/* Swiper Carousel */}
							<Swiper
								{...swiperOptions}
								onSwiper={handleSwiperInit}
								onSlideChange={handleSlideChange}
								onReachBeginning={() => setIsBeginning(true)}
								onReachEnd={() => setIsEnd(true)}
								className="timeline-swiper"
							>
								{processSteps.map((step, index) => (
									<SwiperSlide key={index}>
										<div className="timeline-step-card">
											<div className="step-node">
												<div className="node-circle">
													<div className="node-icon">
														<i className={`fa-solid ${step.icon}`}></i>
													</div>
												</div>
												<div className="node-number">{step.number}</div>
											</div>
											<div className="step-content">
												<h3 className="step-title">{step.title}</h3>
												<p className="step-description">{step.description}</p>
											</div>
										</div>
									</SwiperSlide>
								))}
							</Swiper>

							{/* Pagination */}
							<div className="timeline-pagination"></div>
						</div>
					</div>
				</div>

				{/* CTA Section */}
				<div className="container">
					<div className="space24" />
					<div className="row">
						<div className="col-lg-8 m-auto">
							<div className="nomination-cta-wrapper text-center">
								<div className="nomination-buttons">
									<Link href="/nomination" className="nomination-btn-primary">
										<span>Learn More</span>
										<i className="fa-solid fa-arrow-right"></i>
									</Link>
									<Link href="/nomination" className="nomination-btn-secondary">
										<span>Submit Nomination</span>
										<i className="fa-solid fa-paper-plane"></i>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
