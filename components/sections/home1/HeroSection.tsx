'use client'
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Navigation, Pagination, EffectFade } from "swiper/modules"

const heroSlides = [
	{
		id: 1,
		country: "Ghana",
		name: "Her Excellency Professor Jane Naana Opoku-Agyemang",
		title: "Vice President of the Republic of Ghana",
		image: "/assets/img/speakers/her-excellency-jane-naana-opoku-agyemang.png",
		tagline: "OPEN",
		taglineSub: "to all opportunities"
	},
	{
		id: 2,
		country: "São Tomé",
		name: "His Excellency Américo Ramos",
		title: "Prime Minister of the Democratic Republic of São Tomé and Príncipe",
		image: "/assets/img/speakers/his-excellency-americo-ramos.png",
		tagline: "OPEN",
		taglineSub: "to all opportunities"
	}
]

const swiperOptions = {
	modules: [Autoplay, Navigation, Pagination, EffectFade],
	slidesPerView: 1,
	effect: 'fade' as const,
	fadeEffect: {
		crossFade: true
	},
	autoplay: {
		delay: 6000,
		disableOnInteraction: false,
	},
	loop: true,
	speed: 1200,
	navigation: {
		nextEl: '.hero-slider-next',
		prevEl: '.hero-slider-prev',
	},
	pagination: {
		el: '.hero-slider-pagination',
		clickable: true,
		type: 'bullets' as const,
	},
}

export default function HeroSection() {
	return (
		<section className="promotional-hero-section">
			<Swiper {...swiperOptions} className="hero-promotional-slider">
				{heroSlides.map((slide) => (
					<SwiperSlide key={slide.id}>
						<div className={`hero-slide hero-slide-${slide.id}`}>
							{/* Background Gradient */}
							<div className="slide-background">
								<div className="gradient-overlay"></div>
							</div>

							<div className="container">
								<div className="hero-main-wrapper">
									{/* Left Column - Speaker Image */}
									<div className="hero-image-section">
										<div className="elegant-image-frame">
											<div className="image-wrapper-elegant">
												<div className="image-inner-frame">
													<img 
														src={slide.image} 
														alt={slide.name}
													/>
												</div>
											</div>
										</div>
									</div>

									{/* Right Column - Content */}
									<div className="hero-content-section">
										{/* Theme Title */}
										<div className="hero-title-section">
											<h1 className="hero-theme-title">Honouring The Champions Of Africa&apos;s Trade And Industrialisation</h1>
										</div>

										{/* Speaker Information */}
										<div className="hero-speaker-section">
											<div className="speaker-info-wrapper">
												<div className="guest-speaker-badge">
													<span className="badge-text">Guest Speaker</span>
												</div>
												<h2 className="speaker-name">{slide.name}</h2>
												<p className="speaker-title">{slide.title}</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</SwiperSlide>
				))}
			</Swiper>

			{/* Navigation */}
			<button className="hero-slider-nav hero-slider-prev" aria-label="Previous">
				<i className="fa-solid fa-chevron-left"></i>
			</button>
			<button className="hero-slider-nav hero-slider-next" aria-label="Next">
				<i className="fa-solid fa-chevron-right"></i>
			</button>

			{/* Pagination */}
			<div className="hero-slider-pagination"></div>

			<style jsx global>{`
				.promotional-hero-section {
					position: relative;
					width: 100%;
					height: 100vh;
					min-height: 800px;
					overflow: hidden;
				}

				.hero-promotional-slider {
					width: 100%;
					height: 100%;
				}

				.hero-promotional-slider .swiper-slide {
					width: 100%;
					height: 100%;
				}

				.hero-slide {
					position: relative;
					width: 100%;
					height: 100%;
					display: flex;
					flex-direction: column;
					justify-content: center;
					overflow: hidden;
				}

				.hero-slide .container {
					height: 100%;
					display: flex;
					align-items: center;
				}

				/* Background with Purple Gradient */
				.slide-background {
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					z-index: 0;
				}

				.gradient-overlay {
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					background: linear-gradient(180deg, 
						#2a1832 0%, 
						#32203a 15%, 
						#3d2545 30%, 
						#4a2d55 45%, 
						#543562 55%, 
						#563764 60%, 
						#543562 65%, 
						#4a2d55 75%, 
						#3d2545 85%, 
						#32203a 92%, 
						#2a1832 100%
					);
					opacity: 1;
				}

				.hero-slide-1 .gradient-overlay {
					background: linear-gradient(180deg, 
						#2a1832 0%, 
						#302038 18%, 
						#3d2545 32%, 
						#4a2d55 48%, 
						#543562 56%, 
						#563764 60%, 
						#543562 64%, 
						#4a2d55 73%, 
						#3d2545 84%, 
						#302038 93%, 
						#2a1832 100%
					);
				}

				.hero-slide-2 .gradient-overlay {
					background: linear-gradient(180deg, 
						#2a1832 0%, 
						#33203b 17%, 
						#3f2647 31%, 
						#4c2e57 46%, 
						#563764 58%, 
						#583966 62%, 
						#563764 66%, 
						#4c2e57 76%, 
						#3f2647 86%, 
						#33203b 94%, 
						#2a1832 100%
					);
				}

				.hero-main-wrapper {
					position: relative;
					z-index: 2;
					width: 100%;
					height: 100%;
					display: grid;
					grid-template-columns: 0.85fr 1.15fr;
					gap: 50px;
					align-items: center;
					max-width: 1400px;
					margin: 0 auto;
					padding: 50px 40px;
				}

				/* Image Section */
				.hero-image-section {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 100%;
					max-width: 100%;
					overflow: hidden;
					box-sizing: border-box;
				}

				/* Premium Image Frame - Elegant Design */
				.elegant-image-frame {
					position: relative;
					width: 100%;
					max-width: 350px;
					height: auto;
					aspect-ratio: 2 / 3;
					margin: 0 auto;
					padding: 20px;
					background: rgba(255, 255, 255, 0.1);
					border: 2px solid rgba(255, 255, 255, 0.25);
					border-radius: 24px;
					backdrop-filter: blur(40px);
					transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
					box-shadow: 
						0 25px 70px rgba(0, 0, 0, 0.45),
						0 12px 35px rgba(0, 0, 0, 0.35),
						inset 0 1px 1px rgba(255, 255, 255, 0.3);
					overflow: hidden;
					box-sizing: border-box;
					display: flex;
					flex-direction: column;
				}

				@supports not (aspect-ratio: 2 / 3) {
					.elegant-image-frame {
						height: 0;
						padding-bottom: 150%;
					}
				}

				.elegant-image-frame:hover {
					transform: translateY(-10px);
					background: rgba(255, 255, 255, 0.14);
					border-color: rgba(255, 255, 255, 0.35);
					box-shadow: 
						0 35px 90px rgba(0, 0, 0, 0.55),
						0 18px 45px rgba(0, 0, 0, 0.45),
						inset 0 1px 2px rgba(255, 255, 255, 0.4);
				}

				.image-wrapper-elegant {
					position: relative;
					width: 100%;
					height: 100%;
					min-width: 0;
					min-height: 0;
					border-radius: 18px;
					overflow: hidden;
					background: rgba(0, 0, 0, 0.05);
					z-index: 2;
					box-sizing: border-box;
					flex: 1 1 auto;
					box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.2);
					transition: all 0.6s ease;
				}

				.elegant-image-frame:hover .image-wrapper-elegant {
					box-shadow: inset 0 3px 10px rgba(0, 0, 0, 0.25);
				}

				@supports not (aspect-ratio: 2 / 3) {
					.image-wrapper-elegant {
						position: absolute;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
						width: auto;
						height: auto;
					}
				}

				.image-inner-frame {
					position: relative;
					width: 100%;
					height: 100%;
					max-width: 100%;
					max-height: 100%;
					overflow: hidden;
					box-sizing: border-box;
				}

				.image-inner-frame img {
					width: 100%;
					height: 100%;
					max-width: 100%;
					max-height: 100%;
					min-width: 0;
					min-height: 0;
					display: block;
					object-fit: cover;
					object-position: center top;
					filter: brightness(1.03) contrast(1.06) saturate(1.05);
					transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
					box-sizing: border-box;
					border: none;
					outline: none;
					vertical-align: middle;
				}

				.elegant-image-frame:hover .image-inner-frame img {
					filter: brightness(1.06) contrast(1.09) saturate(1.08);
					transform: scale(1.01);
				}

				/* Content Section */
				.hero-content-section {
					display: flex;
					flex-direction: column;
					gap: 42px;
					padding-left: 30px;
					justify-content: center;
					max-width: 750px;
				}

				/* Title Section */
				.hero-title-section {
					margin-bottom: 0;
				}

				.hero-theme-title {
					font-size: clamp(16px, 2.2vw, 24px) !important;
					font-weight: 400;
					color: #FFFFFF;
					line-height: 1.4;
					margin: 0;
					text-shadow: 0 3px 12px rgba(0, 0, 0, 0.4);
					font-family: 'Cormorant Garamond', 'Playfair Display', 'Georgia', serif;
					letter-spacing: 0.6px;
					text-transform: none;
					font-style: normal;
				}

				/* Speaker Section */
				.hero-speaker-section {
					margin-top: 0;
				}

				.speaker-info-wrapper {
					padding-top: 0;
					padding-bottom: 0;
					border-bottom: none;
					margin-bottom: 0;
					display: flex;
					flex-direction: column;
					gap: 16px;
				}

				/* Guest Speaker Badge */
				.guest-speaker-badge {
					display: inline-flex;
					align-items: center;
					margin-bottom: 8px;
				}

				.badge-text {
					display: inline-block;
					padding: 8px 20px;
					background: rgba(255, 255, 255, 0.15);
					backdrop-filter: blur(10px);
					border: 1px solid rgba(255, 255, 255, 0.25);
					border-radius: 50px;
					font-size: 11px;
					font-weight: 600;
					letter-spacing: 1.2px;
					text-transform: uppercase;
					color: #FFFFFF;
					font-family: 'Inter', 'Helvetica Neue', 'Arial', sans-serif;
					box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
				}

				.speaker-name {
					font-size: clamp(22px, 2.8vw, 32px) !important;
					font-weight: 700;
					color: #FFFFFF;
					line-height: 1.25;
					margin: 0;
					text-shadow: 0 2px 12px rgba(0, 0, 0, 0.45);
					font-family: 'Cormorant Garamond', 'Georgia', 'Times New Roman', serif;
					letter-spacing: 0.3px;
					text-transform: none;
				}

				.speaker-title {
					font-size: clamp(15px, 1.8vw, 18px);
					font-weight: 400;
					color: rgba(255, 255, 255, 0.9);
					font-style: normal;
					line-height: 1.65;
					margin: 0;
					font-family: 'Inter', 'Helvetica Neue', 'Arial', sans-serif;
					letter-spacing: 0.2px;
					text-transform: none;
					font-variant: normal;
				}


				/* Navigation */
				.hero-slider-nav {
					position: absolute;
					top: 50%;
					transform: translateY(-50%);
					width: 50px;
					height: 50px;
					background: rgba(255, 255, 255, 0.15);
					backdrop-filter: blur(10px);
					border: 1px solid rgba(255, 255, 255, 0.3);
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					color: #FFFFFF;
					cursor: pointer;
					z-index: 10;
					transition: all 0.3s ease;
				}

				.hero-slider-nav:hover {
					background: rgba(255, 255, 255, 0.25);
					border-color: rgba(255, 255, 255, 0.5);
					transform: translateY(-50%) scale(1.1);
				}

				.hero-slider-prev {
					left: 30px;
				}

				.hero-slider-next {
					right: 30px;
				}

				/* Pagination */
				.hero-slider-pagination {
					position: absolute;
					bottom: 40px;
					left: 50%;
					transform: translateX(-50%);
					z-index: 10;
				}

				.hero-slider-pagination :global(.swiper-pagination-bullet) {
					width: 12px;
					height: 12px;
					background: rgba(255, 255, 255, 0.4);
					margin: 0 6px;
					opacity: 1;
					transition: all 0.3s ease;
				}

				.hero-slider-pagination :global(.swiper-pagination-bullet-active) {
					width: 40px;
					background: #FFFFFF;
					border-radius: 6px;
				}

				/* Responsive */
				@media (max-width: 1199px) {
					.promotional-hero-section {
						height: auto;
						min-height: 100vh;
					}

					.hero-main-wrapper {
						gap: 40px;
						padding: 45px 30px;
					}

					.hero-content-section {
						gap: 32px;
						padding-left: 20px;
					}

					.hero-theme-title {
						font-size: clamp(15px, 2.1vw, 22px) !important;
					}

					.speaker-name {
						font-size: clamp(20px, 2.6vw, 30px) !important;
					}

					.elegant-image-frame {
						max-width: 320px;
					}
				}

				@media (max-width: 991px) {
					.hero-main-wrapper {
						grid-template-columns: 1fr;
						gap: 35px;
						padding: 45px 30px;
					}

					.hero-content-section {
						gap: 28px;
						padding-left: 0;
						align-items: center;
						max-width: 100%;
					}

					.hero-theme-title {
						text-align: center;
						font-size: clamp(15px, 2.1vw, 22px) !important;
					}

					.speaker-info-wrapper {
						text-align: center;
						align-items: center;
					}

					.guest-speaker-badge {
						justify-content: center;
					}

					.hero-image-section {
						order: 2;
					}

					.hero-content-section {
						order: 1;
						padding-left: 0;
						text-align: center;
						align-items: center;
					}

					.hero-title-section,
					.hero-speaker-section {
						width: 100%;
						max-width: 600px;
						margin: 0 auto;
					}

					.elegant-image-frame {
						max-width: 300px;
					}

					.hero-slider-prev {
						left: 15px;
					}

					.hero-slider-next {
						right: 15px;
					}
				}

				@media (max-width: 575px) {
					.hero-main-wrapper {
						gap: 24px;
						padding: 30px 20px;
					}

					.hero-content-section {
						gap: 24px;
						padding-left: 0;
					}

					.hero-title-section {
						margin-bottom: 0;
					}

					.hero-theme-title {
						font-size: clamp(14px, 2vw, 20px) !important;
						text-align: center;
						line-height: 1.4;
					}

					.speaker-info-wrapper {
						gap: 12px;
						align-items: center;
					}

					.badge-text {
						font-size: 10px;
						padding: 6px 16px;
					}

					.speaker-name {
						font-size: clamp(18px, 2.4vw, 26px) !important;
						text-align: center;
					}

					.speaker-title {
						font-size: clamp(14px, 1.6vw, 16px);
						text-align: center;
					}

					.elegant-image-frame {
						max-width: 260px;
					}

					.hero-slider-nav {
						width: 40px;
						height: 40px;
					}

					.hero-slider-prev {
						left: 10px;
					}

					.hero-slider-next {
						right: 10px;
					}

					.hero-slider-pagination {
						bottom: 20px;
					}
				}
			`}</style>
		</section>
	)
}
