'use client'
import Link from 'next/link'

const partnershipTiers = [
	{
		name: 'Title Sponsor',
		description: 'Exclusive naming rights – "Africa Trade Awards 2026 presented by [Partner]"'
	},
	{
		name: 'Platinum Partner',
		description: 'Category co-branding, premium visibility across all platforms'
	},
	{
		name: 'Gold Partner',
		description: 'Stage and media wall branding, digital recognition'
	},
	{
		name: 'Silver Partner',
		description: 'Digital and print recognition, event access'
	},
	{
		name: 'Category Sponsor',
		description: 'Dedicated award association, targeted visibility'
	},
	{
		name: 'Media Partner',
		description: 'Cross-platform coverage, content collaboration'
	}
]

export default function PartnersSection() {
	return (
		<>
			<div className="elegant-partnership-section">
				<div className="container">
					<div className="row justify-content-center">
						<div className="col-lg-10">
							<div className="partnership-content text-center">
								<h2 className="section-title" data-aos="fade-up" data-aos-duration={900} data-aos-once="true">Join Us in Celebrating Africa&apos;s Excellence</h2>
								<div className="space12" />
								<p className="section-description" data-aos="fade-up" data-aos-duration={1000} data-aos-once="true">Becoming a partner is a declaration of commitment to Africa&apos;s prosperity, sustainability, and self-determined growth. Choose from Title Sponsor, Platinum, Gold, Silver, Category Sponsor, or Media Partner tiers.</p>
								<div className="space16" />
							</div>
						</div>
					</div>
					
					{/* Partnership Tier Cards */}
					<div className="partnership-cards-grid">
						{partnershipTiers.map((tier, index) => (
							<div key={index} className="partnership-tier-card" data-aos="fade-up" data-aos-duration={900 + (index * 100)} data-aos-once="true">
								<div className="tier-badge">
									<span>{tier.name}</span>
								</div>
								<div className="tier-description">
									<p>{tier.description}</p>
								</div>
								<Link href="/contact" className="tier-contact-btn">
									<span>Contact Us</span>
									<i className="fa-solid fa-arrow-right"></i>
								</Link>
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	)
}

