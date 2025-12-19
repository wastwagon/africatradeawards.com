'use client'
import Link from 'next/link'

const contactInfo = [
	{
		icon: 'fa-solid fa-envelope',
		title: 'General Inquiries',
		content: 'info@africantradechamber.org',
		link: 'mailto:info@africantradechamber.org',
		type: 'email'
	},
	{
		icon: 'fa-solid fa-phone',
		title: 'Call/Message',
		content: '+233 50 536 6200',
		link: 'tel:+233505366200',
		type: 'phone'
	},
	{
		icon: 'fa-solid fa-handshake',
		title: 'Partnerships',
		content: 'partnerships@africantradechamber.org',
		link: 'mailto:partnerships@africantradechamber.org',
		type: 'email'
	},
	{
		icon: 'fa-solid fa-location-dot',
		title: 'Our Location',
		content: 'Accra, Ghana',
		link: '#',
		type: 'location'
	}
]

export default function ContactSection() {
	return (
		<section className="contact2-bg-section sp2">
			<div className="container">
				<div className="row">
					<div className="col-lg-8 m-auto">
						<div className="heading2 text-center space-margin60">
							<h5 data-aos="fade-up" data-aos-duration={800}>Get In Touch</h5>
							<div className="space16" />
							<h2 className="text-anime-style-3">Contact Us</h2>
							<div className="space16" />
							<p data-aos="fade-up" data-aos-duration={900}>
								Have questions or want to learn more? We&apos;re here to help. Reach out to us through any of the channels below.
							</p>
						</div>
					</div>
				</div>
				<div className="space32" />
				<div className="row">
					{contactInfo.map((info, index) => (
						<div key={index} className="col-lg-3 col-md-6" data-aos="zoom-in" data-aos-duration={800 + (index * 100)}>
							<div className="contact-boxarea" style={{ textAlign: 'center', height: '100%' }}>
								<div className="icons">
									<i className={info.icon} style={{ fontSize: '2.5rem', color: '#4e2b5a' }}></i>
								</div>
								<div className="space16" />
								<div className="text">
									<h5>{info.title}</h5>
									<div className="space14" />
									{info.type === 'email' || info.type === 'phone' ? (
										<Link href={info.link} style={{ color: '#4e2b5a' }}>
											{info.content}
										</Link>
									) : (
										<p style={{ color: '#666' }}>{info.content}</p>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
				<div className="space32" />
				<div className="row">
					<div className="col-lg-8 m-auto">
						<div className="heading2 text-center">
							<h3>Send Us a Message</h3>
							<div className="space24" />
							<div className="btn-area1">
								<Link href="/contact" className="vl-btn1">Go to Contact Page</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}


