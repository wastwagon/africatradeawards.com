'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"

const legalSections = [
	{
		icon: 'fa-shield-halved',
		badge: 'Privacy Policy',
		title: 'Privacy Policy',
		content: 'Personal data collected through nominations or registrations is used solely for event administration and never shared without consent.',
		hasButton: true,
		buttonText: 'Read Full Privacy Policy (PDF)',
		buttonLink: '/contact'
	},
	{
		icon: 'fa-file-contract',
		badge: 'Terms & Conditions',
		title: 'Terms & Conditions',
		content: [
			'Entries must meet deadlines and include verifiable evidence.',
			'Jury decisions are final and non-appealable.',
			'Participation implies acceptance of these terms.'
		],
		isList: true
	},
	{
		icon: 'fa-scale-balanced',
		badge: 'Governance Disclaimer',
		title: 'Governance Disclaimer',
		content: 'The Africa Trade Awards is an initiative of the African Trade Chamber and Agile Media Solutions, in partnership with Forvis Mazars. The organisers reserve the right to modify event details while maintaining process integrity.'
	},
	{
		icon: 'fa-copyright',
		badge: 'Intellectual Property Notice',
		title: 'Intellectual Property Notice',
		content: '"Africa Trade Awards," "Africa Trade Summit," and all associated marks are registered intellectual property of Agile Media Solutions. All content on this site is protected under copyright law. Unauthorised reproduction is prohibited.'
	}
]

const contactInfo = [
	{
		icon: 'fa-envelope',
		label: 'Email',
		value: 'info@africantradechamber.org',
		link: 'mailto:info@africantradechamber.org'
	},
	{
		icon: 'fa-globe',
		label: 'Website',
		value: 'www.africatradeawards.com',
		link: 'https://www.africatradeawards.com'
	},
	{
		icon: 'fa-handshake',
		label: 'Partnerships',
		value: 'partnerships@africantradechamber.org',
		link: 'mailto:partnerships@africantradechamber.org'
	},
	{
		icon: 'fa-newspaper',
		label: 'Media',
		value: 'media@agilemediasolutions.com',
		link: 'mailto:media@agilemediasolutions.com'
	},
	{
		icon: 'fa-phone',
		label: 'Phone',
		value: '+233 50 536 6200',
		link: 'tel:+233505366200'
	}
]

export default function Legal() {
	return (
		<Layout headerStyle={1} footerStyle={1}>
			<div>
				<div className="inner-page-header" style={{ backgroundImage: 'url(assets/img/bg/header-bg5.png)' }}>
					<div className="container">
						<div className="row">
							<div className="col-lg-4 m-auto">
								<div className="heading1 text-center">
									<h1>Legal &amp; Administrative</h1>
									<div className="space20" />
									<Link href="/">Home <i className="fa-solid fa-angle-right" /> <span>Legal &amp; Administrative</span></Link>
								</div>
							</div>
						</div>
					</div>
				</div>
				
				{/*===== LEGAL SECTIONS =======*/}
				<div className="modern-legal-sections">
					<div className="container">
						<div className="row">
							{legalSections.map((section, index) => (
								<div key={index} className="col-lg-6" data-aos="fade-up" data-aos-duration={800 + (index * 100)}>
									<div className="modern-legal-card">
										<div className="legal-card-header">
											<div className="legal-icon-wrapper">
												<i className={`fa-solid ${section.icon}`}></i>
											</div>
											<div className="legal-badge">{section.badge}</div>
										</div>
										<div className="legal-card-content">
											<h3>{section.title}</h3>
											{section.isList ? (
												<ul className="legal-list">
													{Array.isArray(section.content) && section.content.map((item, i) => (
														<li key={i}>{item}</li>
													))}
												</ul>
											) : (
												<p>{section.content}</p>
											)}
											{section.hasButton && (
												<div className="legal-card-button">
													<Link href={section.buttonLink || '#'} className="modern-legal-btn">
														<span>{section.buttonText}</span>
														<i className="fa-solid fa-arrow-right"></i>
													</Link>
												</div>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
				
				{/*===== CONTACT INFORMATION =======*/}
				<div className="modern-contact-section">
					<div className="container">
						<div className="row">
							<div className="col-lg-10 m-auto">
								<div className="contact-card-wrapper">
									<div className="heading2 text-center">
										<h5 data-aos="fade-up" data-aos-duration={800}>Contact Information</h5>
										<div className="space16" />
										<h2 className="text-anime-style-3">Africa Trade Awards Secretariat</h2>
										<div className="space24" />
										<p data-aos="fade-up" data-aos-duration={900} style={{ marginBottom: '40px' }}>
											<strong>African Trade Chamber</strong><br />
											Accra, Ghana
										</p>
									</div>
									<div className="contact-info-grid">
										{contactInfo.map((contact, index) => (
											<div key={index} className="contact-info-item" data-aos="fade-up" data-aos-duration={900 + (index * 100)}>
												<div className="contact-icon">
													<i className={`fa-solid ${contact.icon}`}></i>
												</div>
												<h6>{contact.label}</h6>
												<Link href={contact.link}>{contact.value}</Link>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				
				{/*===== COPYRIGHT =======*/}
				<div className="modern-copyright-section">
					<div className="container">
						<div className="row">
							<div className="col-lg-8 m-auto">
								<div className="copyright-content" data-aos="fade-up" data-aos-duration={800}>
									<p>&copy; 2026 African Trade Chamber &amp; Agile Media Solutions. All Rights Reserved.</p>
									<p>Designed and Powered by Agile Media Solutions in partnership with the African Trade Chamber.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	)
}





