'use client'
import Countdown from '@/components/elements/Countdown'
import Link from 'next/link'

export default function Section9() {
	return (
		<>
			<div className="elegant-cta-section">
				<div className="container">
					<div className="row">
						<div className="col-lg-10 m-auto">
							<div className="cta-content-wrapper">
								<div className="cta-header" data-aos="fade-up" data-aos-duration={800}>
									<h2 className="cta-title">Join Us in Celebrating Excellence</h2>
									<p className="cta-subtitle">Be part of Africa&apos;s premier trade recognition event</p>
								</div>
								<div className="space50" />
								
								{/* Premium Countdown Timer */}
								<div className="cta-countdown" data-aos="fade-up" data-aos-duration={900}>
									<div className="premium-countdown-timer">
										<Countdown />
									</div>
								</div>
								
								<div className="space50" />
								
								{/* CTA Buttons */}
								<div className="cta-buttons-group" data-aos="fade-up" data-aos-duration={1000}>
									<Link href="/nomination" className="elegant-btn large">
										<span>Nominate Now</span>
										<i className="fa-solid fa-paper-plane"></i>
									</Link>
									<Link href="/award-categories" className="elegant-btn large">
										<span>View Categories</span>
										<i className="fa-solid fa-paper-plane"></i>
									</Link>
								</div>
								
								<div className="space50" />
								
								{/* Event Info */}
								<div className="cta-event-info" data-aos="fade-up" data-aos-duration={1100}>
									<div className="info-item">
										<div className="info-icon">
											<i className="fa-solid fa-calendar-days"></i>
										</div>
										<span className="info-text">28th and 29th January 2026 - 6:30pm to 11:00pm</span>
									</div>
									<div className="info-item">
										<div className="info-icon">
											<i className="fa-solid fa-location-dot"></i>
										</div>
										<span className="info-text">Kempinski Gold Coast City Hotel, Accra</span>
									</div>
								</div>
								
								<div className="space40" />
								
								{/* Footer Text */}
								<p className="cta-footer-text" data-aos="fade-up" data-aos-duration={1200}>
									An official initiative of the African Trade Chamber in partnership with Agile Media Solutions. Independently audited by Forvis Mazars Ghana.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
