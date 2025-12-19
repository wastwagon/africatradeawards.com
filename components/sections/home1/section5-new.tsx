'use client'
import Link from 'next/link'

export default function Section5New() {
	return (
		<>
			<div className="elegant-event-section sp2">
				<div className="container">
					<div className="row">
						<div className="col-lg-8 m-auto">
							<div className="section-header text-center">
								<h2 className="section-title">The Pinnacle of Continental Recognition</h2>
								<div className="space24" />
								<p className="section-description">Join Africa&apos;s distinguished leaders at the Gala Night where policy meets enterprise and we honour the power of trade.</p>
							</div>
						</div>
					</div>
					<div className="space60" />
					<div className="event-info-grid">
						<div className="event-info-card">
							<div className="card-icon">
								<i className="fa-solid fa-calendar-days"></i>
							</div>
							<h6 className="card-label">Date &amp; Time</h6>
							<p className="card-content">28th and 29th January 2026<br />6:30 p.m. – 11:00 p.m.</p>
						</div>
						<div className="event-info-card">
							<div className="card-icon">
								<i className="fa-solid fa-location-dot"></i>
							</div>
							<h6 className="card-label">Venue</h6>
							<p className="card-content">Kempinski Gold Coast City Hotel<br />Accra, Ghana</p>
						</div>
						<div className="event-info-card">
							<div className="card-icon">
								<i className="fa-solid fa-shirt"></i>
							</div>
							<h6 className="card-label">Dress Code</h6>
							<p className="card-content">Black Tie /<br />African Elegant</p>
						</div>
					</div>
					<div className="space40" />
					<div className="row">
						<div className="col-lg-6 m-auto">
							<div className="event-cta-group text-center">
								<Link href="/awards-night" className="elegant-btn">
									<span>View Full Details</span>
									<i className="fa-solid fa-paper-plane"></i>
								</Link>
								<Link href="/travel-accommodation" className="elegant-btn">
									<span>Travel Info</span>
									<i className="fa-solid fa-paper-plane"></i>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

