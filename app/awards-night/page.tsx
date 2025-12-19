'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"

const eventDetails = [
	{
		icon: 'fa-calendar-days',
		title: 'Date & Time',
		content: 'Friday, 30 January 2026',
		subContent: '6:30 p.m. – 11:00 p.m.'
	},
	{
		icon: 'fa-location-dot',
		title: 'Venue',
		content: 'Kempinski Gold Coast City Hotel, Accra – Ghana'
	},
	{
		icon: 'fa-shirt',
		title: 'Dress Code',
		content: 'Black Tie / African Elegant'
	},
	{
		icon: 'fa-users',
		title: 'Distinguished Guests',
		content: 'Heads of State | Ministers | CEOs | DFIs | Industry Leaders | Diplomats'
	}
]

const eveningHighlights = [
	{
		icon: 'fa-red-carpet',
		title: 'Red Carpet & Networking',
		description: 'Reception with continental leaders and industry pioneers.'
	},
	{
		icon: 'fa-microphone',
		title: 'Opening Ceremony',
		description: 'Formal opening with keynote addresses and welcome messages.'
	},
	{
		icon: 'fa-trophy',
		title: 'Awards Presentations',
		description: 'Celebration of winners across all award categories.'
	},
	{
		icon: 'fa-utensils',
		title: 'Gala Dinner',
		description: 'Premium dining experience with continental cuisine.'
	},
	{
		icon: 'fa-music',
		title: 'Cultural Performances',
		description: 'Showcasing Africa\'s rich cultural heritage through music and dance.'
	}
]

export default function AwardsNight() {
	return (
		<Layout headerStyle={1} footerStyle={1}>
			<div>
				<div className="inner-page-header" style={{ backgroundImage: 'url(assets/img/bg/header-bg5.png)' }}>
					<div className="container">
						<div className="row">
							<div className="col-lg-4 m-auto">
								<div className="heading1 text-center">
									<h1>Awards Night Experience</h1>
									<div className="space20" />
									<Link href="/">Home <i className="fa-solid fa-angle-right" /> <span>Awards Night</span></Link>
								</div>
							</div>
						</div>
					</div>
				</div>
				
				{/*===== OVERVIEW =======*/}
				<div className="about1-section-area sp1">
					<div className="container">
						<div className="row">
							<div className="col-lg-8 m-auto">
								<div className="heading2 text-center space-margin60">
									<h5 data-aos="fade-up" data-aos-duration={800}>Overview</h5>
									<div className="space16" />
									<h2 className="text-anime-style-3">The Pinnacle of Continental Recognition</h2>
									<div className="space24" />
									<p data-aos="fade-up" data-aos-duration={900}>The Africa Trade Awards Gala Night is the pinnacle of continental recognition—where policy meets enterprise and Africa&apos;s distinguished leaders gather under one roof to honour the power of trade.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				
				{/*===== EVENT DETAILS =======*/}
				<div className="modern-event-details-section">
					<div className="container">
						<div className="row">
							{eventDetails.map((detail, index) => (
								<div key={index} className="col-lg-3 col-md-6" data-aos="fade-up" data-aos-duration={800 + (index * 100)}>
									<div className="modern-event-detail-card">
										<div className="event-detail-icon">
											<i className={`fa-solid ${detail.icon}`}></i>
										</div>
										<h4>{detail.title}</h4>
										<p className="event-detail-content">{detail.content}</p>
										{detail.subContent && <p className="event-detail-subcontent">{detail.subContent}</p>}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
				
				{/*===== EVENING HIGHLIGHTS =======*/}
				<div className="modern-benefits-section">
					<div className="container">
						<div className="row">
							<div className="col-lg-8 m-auto">
								<div className="heading2 text-center space-margin60">
									<h5 data-aos="fade-up" data-aos-duration={800}>Evening Highlights</h5>
									<div className="space18" />
									<h2 className="text-anime-style-3">What to Expect</h2>
								</div>
							</div>
						</div>
						<div className="row">
							{eveningHighlights.map((highlight, index) => (
								<div key={index} className={index === 4 ? "col-lg-6 col-md-6" : "col-lg-3 col-md-6"} data-aos="fade-up" data-aos-duration={800 + (index * 100)}>
									<div className="modern-benefit-card">
										<div className="benefit-icon-wrapper">
											<i className={`fa-solid ${highlight.icon}`}></i>
										</div>
										<div className="benefit-content">
											<h4>{highlight.title}</h4>
											<p>{highlight.description}</p>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</Layout>
	)
}





