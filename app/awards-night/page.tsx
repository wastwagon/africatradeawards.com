'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"

const eventDetails = [
	{
		icon: 'fa-calendar',
		title: 'Date & Time',
		content: '28th and 29th January 2026',
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
		icon: 'fa-star',
		title: 'Red Carpet & Networking',
		description: 'Reception with continental leaders and industry pioneers.',
		image: '/assets/img/all-images/about/about-img8.png'
	},
	{
		icon: 'fa-microphone',
		title: 'Opening Ceremony',
		description: 'Formal opening with keynote addresses and welcome messages.',
		image: '/assets/img/all-images/about/about-img8.png'
	},
	{
		icon: 'fa-trophy',
		title: 'Awards Presentations',
		description: 'Celebration of winners across all award categories.',
		image: '/assets/img/all-images/about/about-img8.png'
	},
	{
		icon: 'fa-utensils',
		title: 'Gala Dinner',
		description: 'Premium dining experience with continental cuisine.',
		image: '/assets/img/all-images/about/about-img8.png'
	},
	{
		icon: 'fa-music',
		title: 'Cultural Performances',
		description: 'Showcasing Africa\'s rich cultural heritage through music and dance.',
		image: '/assets/img/all-images/about/about-img8.png'
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
									<Link href="/"><span className="breadcrumb-home">Home</span> <i className="fa-solid fa-angle-right" /> <span className="breadcrumb-current">Awards Night</span></Link>
								</div>
							</div>
						</div>
					</div>
				</div>
				
				{/*===== OVERVIEW =======*/}
				<div className="about1-section-area overview-section sp1">
					<div className="container">
						<div className="row">
							<div className="col-lg-8 m-auto">
								<div className="modern-section-header text-center space-margin60">
									<span className="section-accent-label" data-aos="fade-up" data-aos-duration={800}>Overview</span>
									<div className="space20" />
									<h2 className="modern-section-title" data-aos="fade-up" data-aos-duration={900}>The Pinnacle of Continental Recognition</h2>
									<div className="space16" />
									<p className="modern-section-subtitle" data-aos="fade-up" data-aos-duration={1000}>The Africa Trade Awards Gala Night is the pinnacle of continental recognition—where policy meets enterprise and Africa&apos;s distinguished leaders gather under one roof to honour the power of trade.</p>
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
								<div className="modern-section-header text-center space-margin60">
									<span className="section-accent-label" data-aos="fade-up" data-aos-duration={800}>Evening Highlights</span>
									<div className="space20" />
									<h2 className="modern-section-title" data-aos="fade-up" data-aos-duration={900}>What to Expect</h2>
								</div>
							</div>
						</div>
						<div className="row">
							{eveningHighlights.map((highlight, index) => (
								<div key={index} className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-duration={800 + (index * 100)}>
									<div className="modern-highlight-card">
										<div className="highlight-image-wrapper">
											<img src={highlight.image} alt={highlight.title} />
											<div className="highlight-overlay"></div>
											<div className="highlight-icon-wrapper">
												<i className={`fa-solid ${highlight.icon}`}></i>
											</div>
										</div>
										<div className="highlight-content">
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





