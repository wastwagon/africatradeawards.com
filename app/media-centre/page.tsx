'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"

const pressReleases = [
	{
		icon: 'fa-bullhorn',
		title: 'Media Launch',
		description: 'Official launch announcement and event details.'
	},
	{
		icon: 'fa-users',
		title: 'Jury Announcements',
		description: 'Announcement of Jury Board members and evaluation process.'
	},
	{
		icon: 'fa-star',
		title: 'Nominee Releases',
		description: 'Announcement of finalists and nominees across all categories.'
	},
	{
		icon: 'fa-trophy',
		title: 'Gala Highlights',
		description: 'Coverage of Awards Gala Night and winner announcements.'
	},
	{
		icon: 'fa-file-lines',
		title: 'Post-Event Report',
		description: 'Comprehensive post-event summary and impact report.'
	}
]

const galleryItems = [
	{
		icon: 'fa-rocket',
		title: 'Launch Event',
		link: '/memories'
	},
	{
		icon: 'fa-star',
		title: 'Nominee Spotlights',
		link: '/memories'
	},
	{
		icon: 'fa-trophy',
		title: 'Gala Highlights',
		link: '/memories'
	},
	{
		icon: 'fa-microphone',
		title: 'Winner Interviews',
		link: '/memories'
	},
	{
		icon: 'fa-camera',
		title: 'Behind-the-Scenes',
		link: '/memories'
	}
]

const livestreamInfo = [
	{
		icon: 'fa-globe',
		label: 'Website',
		value: 'www.africatradeawards.com/live',
		link: 'https://www.africatradeawards.com/live'
	},
	{
		icon: 'fa-youtube',
		label: 'YouTube',
		value: '@AfricaTradeChamber',
		link: '#'
	}
]

export default function MediaCentre() {
	return (
		<Layout headerStyle={1} footerStyle={1}>
			<div>
				<div className="inner-page-header" style={{ backgroundImage: 'url(assets/img/bg/header-bg5.png)' }}>
					<div className="container">
						<div className="row">
							<div className="col-lg-4 m-auto">
								<div className="heading1 text-center">
									<h1>Media Centre</h1>
									<div className="space20" />
									<Link href="/">Home <i className="fa-solid fa-angle-right" /> <span>Media Centre</span></Link>
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
									<h2 className="text-anime-style-3">Official Communications Hub</h2>
									<div className="space24" />
									<p data-aos="fade-up" data-aos-duration={900}>The Media Centre is the official communications hub for journalists, photographers, and broadcasters covering Africa&apos;s premier celebration of trade excellence.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				
				{/*===== PRESS RELEASES =======*/}
				<div className="modern-benefits-section">
					<div className="container">
						<div className="row">
							<div className="col-lg-8 m-auto">
								<div className="heading2 text-center space-margin60">
									<h5 data-aos="fade-up" data-aos-duration={800}>Press Releases</h5>
									<div className="space18" />
									<h2 className="text-anime-style-3">Latest Updates</h2>
								</div>
							</div>
						</div>
						<div className="row">
							{pressReleases.map((release, index) => (
								<div key={index} className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-duration={800 + (index * 100)}>
									<div className="modern-press-card">
										<div className="press-icon-wrapper">
											<i className={`fa-solid ${release.icon}`}></i>
										</div>
										<div className="press-content">
											<h4>{release.title}</h4>
											<p>{release.description}</p>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
				
				{/*===== PHOTO & VIDEO GALLERY =======*/}
				<div className="modern-benefits-section">
					<div className="container">
						<div className="row">
							<div className="col-lg-8 m-auto">
								<div className="heading2 text-center space-margin60">
									<h5 data-aos="fade-up" data-aos-duration={800}>Photo &amp; Video Gallery</h5>
									<div className="space18" />
									<h2 className="text-anime-style-3">Visual Content</h2>
								</div>
							</div>
						</div>
						<div className="row">
							{galleryItems.map((item, index) => (
								<div key={index} className={index === 4 ? "col-lg-6 col-md-6" : "col-lg-3 col-md-6"} data-aos="fade-up" data-aos-duration={800 + (index * 100)}>
									<Link href={item.link} className="modern-gallery-btn">
										<div className="gallery-icon-wrapper">
											<i className={`fa-solid ${item.icon}`}></i>
										</div>
										<span>{item.title}</span>
										<i className="fa-solid fa-arrow-right"></i>
									</Link>
								</div>
							))}
						</div>
					</div>
				</div>
				
				{/*===== LIVESTREAM ACCESS =======*/}
				<div className="modern-contact-section">
					<div className="container">
						<div className="row">
							<div className="col-lg-8 m-auto">
								<div className="contact-card-wrapper">
									<div className="heading2 text-center">
										<h5 data-aos="fade-up" data-aos-duration={800}>Livestream Access</h5>
										<div className="space16" />
										<h2 className="text-anime-style-3">Watch Live</h2>
										<div className="space24" />
									</div>
									<div className="contact-info-grid">
										{livestreamInfo.map((info, index) => (
											<div key={index} className="contact-info-item" data-aos="fade-up" data-aos-duration={900 + (index * 100)}>
												<div className="contact-icon">
													<i className={`fa-brands ${info.icon === 'fa-youtube' ? 'fa-youtube' : 'fa-solid ' + info.icon}`}></i>
												</div>
												<h6>{info.label}</h6>
												<Link href={info.link}>{info.value}</Link>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				
				{/*===== ACCREDITATION =======*/}
				<div className="modern-legal-sections">
					<div className="container">
						<div className="row">
							<div className="col-lg-6" data-aos="fade-up" data-aos-duration={800}>
								<div className="modern-legal-card">
									<div className="legal-card-header">
										<div className="legal-icon-wrapper">
											<i className="fa-solid fa-id-card"></i>
										</div>
										<div className="legal-badge">Accreditation</div>
									</div>
									<div className="legal-card-content">
										<h3>Media Accreditation</h3>
										<p>All media must register for accreditation with valid press ID and assignment letter.</p>
										<div className="legal-contact-info">
											<p><strong>Press Contact:</strong></p>
											<p>Email: <Link href="mailto:media@agilemediasolutions.com">media@agilemediasolutions.com</Link></p>
											<p>Phone: <Link href="tel:+233505366200">+233 50 536 6200</Link></p>
										</div>
									</div>
								</div>
							</div>
							<div className="col-lg-6" data-aos="fade-up" data-aos-duration={900}>
								<div className="modern-legal-card">
									<div className="legal-card-header">
										<div className="legal-icon-wrapper">
											<i className="fa-solid fa-hashtag"></i>
										</div>
										<div className="legal-badge">Social Media</div>
									</div>
									<div className="legal-card-content">
										<h3>Follow the Conversation</h3>
										<p>Join the conversation and share your coverage using our official hashtags.</p>
										<div className="legal-contact-info">
											<p style={{ fontSize: '18px', fontWeight: 'bold', color: '#4e2b5a', marginTop: '20px' }}>
												#AfricaTradeAwards #ATA2026 #AfricaTradeSummit
											</p>
										</div>
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





