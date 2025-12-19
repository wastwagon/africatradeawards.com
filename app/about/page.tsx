'use client'
import Layout from "@/components/layout/Layout"
import Section7 from '@/components/sections/home1/section7'
import Link from "next/link"
export default function About() {

	return (
		<>

			<Layout headerStyle={1} footerStyle={1}>
				<div>
					<div className="inner-page-header" style={{ backgroundImage: 'url(assets/img/bg/header-bg5.png)' }}>
						<div className="container">
							<div className="row">
								<div className="col-lg-4 m-auto">
									<div className="heading1 text-center">
										<h1>About the Awards</h1>
										<div className="space20" />
										<Link href="/">Home <i className="fa-solid fa-angle-right" /> <span>About the Awards</span></Link>
									</div>
								</div>
							</div>
						</div>
					</div>
					{/*===== HERO AREA ENDS =======*/}
					{/*===== OVERVIEW AREA STARTS =======*/}
					<div className="about1-section-area overview-section sp1">
						<div className="container">
							<div className="row align-items-center">
								<div className="col-lg-6">
									<div className="overview-image-layout">
										<div className="main-image">
											<img src="/assets/img/all-images/about/about-img8.png" alt="Africa Trade Awards" />
										</div>
										<div className="secondary-images">
											<div className="secondary-image">
												<img src="/assets/img/all-images/about/about-img8.png" alt="Trade Excellence" />
											</div>
											<div className="secondary-image">
												<img src="/assets/img/all-images/about/about-img8.png" alt="Industrial Champions" />
											</div>
										</div>
									</div>
								</div>
								<div className="col-lg-6">
									<div className="overview-content">
										<h2 className="overview-heading">
											Celebrating Visionaries Transforming Africa&apos;s Economy
										</h2>
										<div className="space12" />
										<div className="overview-description">
											<p>The Africa Trade Awards celebrates the visionaries transforming Africa&apos;s economy—those who innovate, lead, and build pathways to prosperity across borders.</p>
											<div className="space12" />
											<p>As the flagship recognition platform of the Africa Trade Summit, the Awards honour individuals and institutions advancing enterprise, policy, and investment that drive the continent&apos;s trade, industrialisation, and economic integration.</p>
										</div>
										
										<div className="space24" />
										
										{/* Our Mission */}
										<div className="mission-content">
											<div className="mission-badge">
												<span>MISSION</span>
											</div>
											<div className="space12" />
											<p className="mission-description">To celebrate and promote excellence, innovation, and responsible leadership in African trade and industrial development, while fostering cross-border partnerships that advance the goals of the AfCFTA and Agenda 2063.</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					{/*===== OVERVIEW AREA ENDS =======*/}
					{/*===== OBJECTIVES AREA STARTS =======*/}
					<div className="choose-section-area modern-objectives-section sp2">
						<div className="objectives-gradient-bg"></div>
						<div className="container">
							<div className="row">
								<div className="col-lg-8 m-auto">
									<div className="modern-section-header text-center space-margin60">
										<span className="section-accent-label" data-aos="fade-up" data-aos-duration={800}>Our Objectives</span>
										<div className="space20" />
										<h2 className="modern-section-title" data-aos="fade-up" data-aos-duration={900}>Driving Excellence Across Africa</h2>
										<div className="space16" />
										<p className="modern-section-subtitle" data-aos="fade-up" data-aos-duration={1000}>Our mission is to recognize, inspire, and elevate the champions transforming Africa&apos;s economic landscape.</p>
									</div>
								</div>
							</div>
							<div className="space40" />
							<div className="modern-objectives-grid">
								<div className="modern-objective-card" data-aos="fade-up" data-aos-duration={800} data-aos-once="true">
									<div className="card-icon-wrapper">
										<div className="icon-bg-gradient"></div>
										<i className="fa-solid fa-trophy"></i>
									</div>
									<div className="card-content">
										<h3>Recognise Excellence</h3>
										<p>Recognise outstanding contributions to intra-African trade and industrialisation.</p>
									</div>
									<div className="card-accent-line"></div>
								</div>
								<div className="modern-objective-card" data-aos="fade-up" data-aos-duration={900} data-aos-once="true">
									<div className="card-icon-wrapper">
										<div className="icon-bg-gradient"></div>
										<i className="fa-solid fa-lightbulb"></i>
									</div>
									<div className="card-content">
										<h3>Encourage Innovation</h3>
										<p>Encourage innovation, inclusion, and sustainability in enterprise and policy.</p>
									</div>
									<div className="card-accent-line"></div>
								</div>
								<div className="modern-objective-card" data-aos="fade-up" data-aos-duration={1000} data-aos-once="true">
									<div className="card-icon-wrapper">
										<div className="icon-bg-gradient"></div>
										<i className="fa-solid fa-handshake"></i>
									</div>
									<div className="card-content">
										<h3>Highlight Partnerships</h3>
										<p>Highlight the role of public–private partnerships in value-chain advancement.</p>
									</div>
									<div className="card-accent-line"></div>
								</div>
								<div className="modern-objective-card" data-aos="fade-up" data-aos-duration={1100} data-aos-once="true">
									<div className="card-icon-wrapper">
										<div className="icon-bg-gradient"></div>
										<i className="fa-solid fa-users"></i>
									</div>
									<div className="card-content">
										<h3>Inspire Next Generation</h3>
										<p>Inspire the next generation of African entrepreneurs, manufacturers, and trade leaders.</p>
									</div>
									<div className="card-accent-line"></div>
								</div>
								<div className="modern-objective-card" data-aos="fade-up" data-aos-duration={1200} data-aos-once="true">
									<div className="card-icon-wrapper">
										<div className="icon-bg-gradient"></div>
										<i className="fa-solid fa-globe"></i>
									</div>
									<div className="card-content">
										<h3>Strengthen Visibility</h3>
										<p>Strengthen Africa&apos;s visibility as a globally competitive trade and investment destination.</p>
									</div>
									<div className="card-accent-line"></div>
								</div>
							</div>
						</div>
					</div>
					{/*===== OBJECTIVES AREA ENDS =======*/}
					{/*===== LEADERSHIP MESSAGES AREA STARTS =======*/}
					<div className="testimonials1-section-area modern-leadership-section sp2">
						<div className="leadership-gradient-bg"></div>
						<div className="container">
							<div className="row">
								<div className="col-lg-8 m-auto">
									<div className="modern-section-header text-center space-margin60">
										<span className="section-accent-label" data-aos="fade-up" data-aos-duration={800}>Leadership Messages</span>
										<div className="space20" />
										<h2 className="modern-section-title" data-aos="fade-up" data-aos-duration={900}>Voices of Vision</h2>
										<div className="space16" />
										<p className="modern-section-subtitle" data-aos="fade-up" data-aos-duration={1000}>Hear from the leaders shaping Africa&apos;s trade future</p>
									</div>
								</div>
							</div>
							<div className="space40" />
							<div className="row">
								<div className="col-lg-6" data-aos="fade-up" data-aos-duration={900} data-aos-once="true">
									<div className="modern-testimonial-card">
										<div className="testimonial-quote-mark">
											<svg xmlns="http://www.w3.org/2000/svg" width={56} height={48} viewBox="0 0 28 24" fill="none">
												<path d="M15.3469 5.73963C15.3469 7.2063 15.7303 8.43797 16.4969 9.43463C17.0403 10.1213 17.7775 10.5724 18.7086 10.788C19.6253 11.0013 20.4919 11.0163 21.2753 10.8346C21.5419 12.418 21.1086 14.0946 20.0086 15.8713C18.9064 17.6469 17.4853 18.9819 15.7453 19.8763L18.3803 23.668C19.7136 23.008 20.9803 22.1713 22.1469 21.1596C23.3303 20.148 24.3803 18.9846 25.3136 17.6696C26.2469 16.3546 26.9469 14.8696 27.3969 13.1863C27.8469 11.503 27.9719 9.7863 27.7569 8.01963C27.4769 5.6863 26.7236 3.81963 25.4969 2.4363C24.2714 1.03519 22.7447 0.334633 20.9169 0.334633C19.3086 0.334633 17.9736 0.817966 16.9169 1.79797C15.8714 2.75797 15.3492 4.07352 15.3503 5.74463L15.3469 5.73963ZM0.140263 5.73963C0.140263 7.2063 0.523598 8.43797 1.29026 9.43463C1.83471 10.1346 2.57193 10.5885 3.50193 10.7963C4.43526 11.0019 5.29082 11.0141 6.06859 10.833C6.33526 12.3996 5.9186 14.083 4.81526 15.8663C3.71526 17.633 2.29526 18.9663 0.555264 19.8663L3.1836 23.668C4.51804 23.008 5.7736 22.1719 6.95026 21.1596C8.14426 20.1329 9.20475 18.9604 10.1069 17.6696C11.0336 16.353 11.7236 14.8696 12.1736 13.1863C12.6307 11.5043 12.7536 9.74894 12.5353 8.01963C12.2586 5.6863 11.5086 3.81963 10.2853 2.4363C9.06304 1.04519 7.53915 0.349634 5.7136 0.349634C4.10248 0.347412 2.76804 0.834633 1.71026 1.8113C0.664705 2.7713 0.141375 4.08685 0.140263 5.75797V5.73963Z" fill="url(#quoteGradient)" opacity="0.15" />
												<defs>
													<linearGradient id="quoteGradient" x1="0" y1="0" x2="28" y2="24">
														<stop offset="0%" stopColor="#4e2b5a" />
														<stop offset="100%" stopColor="#5a6fd8" />
													</linearGradient>
												</defs>
											</svg>
										</div>
										<div className="testimonial-content">
											<p className="quote-text">&quot;The Africa Trade Awards celebrates those who dare to build. Every innovation and partnership honoured here represents a step toward Africa&apos;s economic freedom.&quot;</p>
											<div className="testimonial-author">
												<h4>Benedicta Lasi</h4>
												<span>Executive Chair – African Trade Chamber</span>
											</div>
										</div>
										<div className="card-gradient-border"></div>
									</div>
								</div>
								<div className="col-lg-6" data-aos="fade-up" data-aos-duration={1000} data-aos-once="true">
									<div className="modern-testimonial-card">
										<div className="testimonial-quote-mark">
											<svg xmlns="http://www.w3.org/2000/svg" width={56} height={48} viewBox="0 0 28 24" fill="none">
												<path d="M15.3469 5.73963C15.3469 7.2063 15.7303 8.43797 16.4969 9.43463C17.0403 10.1213 17.7775 10.5724 18.7086 10.788C19.6253 11.0013 20.4919 11.0163 21.2753 10.8346C21.5419 12.418 21.1086 14.0946 20.0086 15.8713C18.9064 17.6469 17.4853 18.9819 15.7453 19.8763L18.3803 23.668C19.7136 23.008 20.9803 22.1713 22.1469 21.1596C23.3303 20.148 24.3803 18.9846 25.3136 17.6696C26.2469 16.3546 26.9469 14.8696 27.3969 13.1863C27.8469 11.503 27.9719 9.7863 27.7569 8.01963C27.4769 5.6863 26.7236 3.81963 25.4969 2.4363C24.2714 1.03519 22.7447 0.334633 20.9169 0.334633C19.3086 0.334633 17.9736 0.817966 16.9169 1.79797C15.8714 2.75797 15.3492 4.07352 15.3503 5.74463L15.3469 5.73963ZM0.140263 5.73963C0.140263 7.2063 0.523598 8.43797 1.29026 9.43463C1.83471 10.1346 2.57193 10.5885 3.50193 10.7963C4.43526 11.0019 5.29082 11.0141 6.06859 10.833C6.33526 12.3996 5.9186 14.083 4.81526 15.8663C3.71526 17.633 2.29526 18.9663 0.555264 19.8663L3.1836 23.668C4.51804 23.008 5.7736 22.1719 6.95026 21.1596C8.14426 20.1329 9.20475 18.9604 10.1069 17.6696C11.0336 16.353 11.7236 14.8696 12.1736 13.1863C12.6307 11.5043 12.7536 9.74894 12.5353 8.01963C12.2586 5.6863 11.5086 3.81963 10.2853 2.4363C9.06304 1.04519 7.53915 0.349634 5.7136 0.349634C4.10248 0.347412 2.76804 0.834633 1.71026 1.8113C0.664705 2.7713 0.141375 4.08685 0.140263 5.75797V5.73963Z" fill="url(#quoteGradient2)" opacity="0.15" />
												<defs>
													<linearGradient id="quoteGradient2" x1="0" y1="0" x2="28" y2="24">
														<stop offset="0%" stopColor="#4e2b5a" />
														<stop offset="100%" stopColor="#5a6fd8" />
													</linearGradient>
												</defs>
											</svg>
										</div>
										<div className="testimonial-content">
											<p className="quote-text">&quot;Through the Africa Trade Awards, we tell the story of Africa&apos;s excellence with the dignity, glamour, and global recognition it deserves.&quot;</p>
											<div className="testimonial-author">
												<h4>Chief Executive</h4>
												<span>Agile Media Solutions</span>
											</div>
										</div>
										<div className="card-gradient-border"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
					{/*===== LEADERSHIP MESSAGES AREA ENDS =======*/}
					{/*===== PARTNERS AREA STARTS =======*/}
					<Section7 />
					{/*===== PARTNERS AREA ENDS =======*/}
				</div>

			</Layout>
		</>
	)
}