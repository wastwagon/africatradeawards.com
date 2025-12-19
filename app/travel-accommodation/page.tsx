'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"

const partnerHotels = [
	{
		name: 'Movenpick Ambassador',
		icon: 'fa-hotel'
	},
	{
		name: 'Accra City Hotel',
		icon: 'fa-hotel'
	},
	{
		name: 'Alisa Hotel',
		icon: 'fa-hotel'
	},
	{
		name: 'One Oxford Hotel',
		icon: 'fa-hotel'
	}
]

const infoSections = [
	{
		icon: 'fa-passport',
		badge: 'Visa & Entry',
		title: 'Visa & Entry Requirements',
		content: 'Valid passport (6 months) + ATC invitation + hotel proof.',
		contact: {
			label: 'Visa support',
			email: 'participants@africatradesummit.com'
		}
	},
	{
		icon: 'fa-shuttle-van',
		badge: 'Transfers',
		title: 'Airport Transfers',
		content: 'VIP pickups | Delegate shuttles | Airport desk (28–30 Jan 2026).',
		hasButtons: true,
		buttons: [
			{ text: 'Submit Arrival Details', link: '/contact', primary: true },
			{ text: 'Request Airport Assistance', link: '/contact', primary: false }
		]
	},
	{
		icon: 'fa-shield-halved',
		badge: 'Health & Safety',
		title: 'Health & Safety',
		content: 'Health & Safety Protocol in force with on-site medical desk.',
		contact: {
			email: 'participants@africatradesummit.com',
			phone: '+233 50 536 6200'
		}
	}
]

export default function TravelAccommodation() {
	return (
		<Layout headerStyle={1} footerStyle={1}>
			<div>
				<div className="inner-page-header" style={{ backgroundImage: 'url(assets/img/bg/header-bg5.png)' }}>
					<div className="container">
						<div className="row">
							<div className="col-lg-4 m-auto">
								<div className="heading1 text-center">
									<h1>Travel &amp; Accommodation</h1>
									<div className="space20" />
									<Link href="/">Home <i className="fa-solid fa-angle-right" /> <span>Travel &amp; Accommodation</span></Link>
								</div>
							</div>
						</div>
					</div>
				</div>
				
				{/*===== OFFICIAL VENUE =======*/}
				<div className="modern-venue-section">
					<div className="container">
						<div className="row">
							<div className="col-lg-10 m-auto">
								<div className="venue-card-wrapper">
									<div className="heading2 text-center">
										<h5 data-aos="fade-up" data-aos-duration={800}>Official Venue</h5>
										<div className="space16" />
										<h2 className="text-anime-style-3">Kempinski Gold Coast City Hotel, Accra</h2>
										<div className="space24" />
									</div>
									<div className="venue-details-grid">
										<div className="venue-detail-item" data-aos="fade-up" data-aos-duration={900}>
											<div className="venue-icon">
												<i className="fa-solid fa-location-dot"></i>
											</div>
											<h6>Address</h6>
											<p>Gamel Abdul Nasser Ave, Accra, Ghana</p>
										</div>
										<div className="venue-detail-item" data-aos="fade-up" data-aos-duration={1000}>
											<div className="venue-icon">
												<i className="fa-solid fa-door-open"></i>
											</div>
											<h6>Check-in</h6>
											<p>2:00 p.m.</p>
										</div>
										<div className="venue-detail-item" data-aos="fade-up" data-aos-duration={1100}>
											<div className="venue-icon">
												<i className="fa-solid fa-calendar-check"></i>
											</div>
											<h6>Check-out</h6>
											<p>12:00 noon</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				
				{/*===== PARTNER HOTELS =======*/}
				<div className="modern-benefits-section">
					<div className="container">
						<div className="row">
							<div className="col-lg-8 m-auto">
								<div className="heading2 text-center space-margin60">
									<h5 data-aos="fade-up" data-aos-duration={800}>Partner Hotels</h5>
									<div className="space18" />
									<h2 className="text-anime-style-3">Other Accommodation Options</h2>
									<div className="space12" />
									<p data-aos="fade-up" data-aos-duration={900}>All provide shuttle services to Kempinski during the event period.</p>
								</div>
							</div>
						</div>
						<div className="row">
							{partnerHotels.map((hotel, index) => (
								<div key={index} className="col-lg-3 col-md-6" data-aos="fade-up" data-aos-duration={800 + (index * 100)}>
									<div className="modern-benefit-card">
										<div className="benefit-icon-wrapper">
											<i className={`fa-solid ${hotel.icon}`}></i>
										</div>
										<div className="benefit-content">
											<h4>{hotel.name}</h4>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
				
				{/*===== INFO SECTIONS =======*/}
				<div className="modern-legal-sections">
					<div className="container">
						<div className="row">
							{infoSections.map((section, index) => (
								<div key={index} className="col-lg-4" data-aos="fade-up" data-aos-duration={800 + (index * 100)}>
									<div className="modern-legal-card">
										<div className="legal-card-header">
											<div className="legal-icon-wrapper">
												<i className={`fa-solid ${section.icon}`}></i>
											</div>
											<div className="legal-badge">{section.badge}</div>
										</div>
										<div className="legal-card-content">
											<h3>{section.title}</h3>
											<p>{section.content}</p>
											{section.contact && (
												<div className="legal-contact-info">
													{section.contact.label && (
														<p><strong>{section.contact.label}:</strong> <Link href={`mailto:${section.contact.email}`}>{section.contact.email}</Link></p>
													)}
													{section.contact.email && !section.contact.label && (
														<p>Email: <Link href={`mailto:${section.contact.email}`}>{section.contact.email}</Link></p>
													)}
													{section.contact.phone && (
														<p>Phone: <Link href={`tel:${section.contact.phone.replace(/\s/g, '')}`}>{section.contact.phone}</Link></p>
													)}
												</div>
											)}
											{section.hasButtons && section.buttons && (
												<div className="legal-card-button" style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
													{section.buttons.map((btn, btnIndex) => (
														<Link 
															key={btnIndex}
															href={btn.link} 
															className={btn.primary ? "modern-legal-btn" : "modern-legal-btn secondary"}
														>
															<span>{btn.text}</span>
															<i className="fa-solid fa-arrow-right"></i>
														</Link>
													))}
												</div>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
				
				{/*===== LOCAL INFO =======*/}
				<div className="modern-benefits-section">
					<div className="container">
						<div className="row">
							<div className="col-lg-8 m-auto">
								<div className="heading2 text-center space-margin60">
									<h5 data-aos="fade-up" data-aos-duration={800}>Local Information</h5>
									<div className="space18" />
									<h2 className="text-anime-style-3">Know Before You Go</h2>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration={800}>
								<div className="choose-widget-boxarea local-info-card">
									<div className="local-info-icon-wrapper">
										<i className="fa-solid fa-language"></i>
									</div>
									<div className="content-area">
										<h6>Language</h6>
										<p>English</p>
									</div>
								</div>
							</div>
							<div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration={900}>
								<div className="choose-widget-boxarea local-info-card">
									<div className="local-info-icon-wrapper">
										<i className="fa-solid fa-sun"></i>
									</div>
									<div className="content-area">
										<h6>Weather</h6>
										<p>30 °C avg</p>
									</div>
								</div>
							</div>
							<div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration={1000}>
								<div className="choose-widget-boxarea local-info-card">
									<div className="local-info-icon-wrapper">
										<i className="fa-solid fa-clock"></i>
									</div>
									<div className="content-area">
										<h6>Time Zone</h6>
										<p>GMT (+0)</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	)
}





