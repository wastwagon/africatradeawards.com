'use client'
import Link from 'next/link'

const tiers = [
	{
		id: 'tier-i',
		number: 'I',
		title: 'Continental Leadership',
		icon: 'fa-globe',
		accentColor: '#4e2b5a',
		description: 'Leadership exercised at continental or multi-regional scale, honouring strategic decisions that influenced trade and industrial activity across multiple African markets.'
	},
	{
		id: 'tier-ii',
		number: 'II',
		title: 'Industry & Value Chains',
		icon: 'fa-industry',
		accentColor: '#78508c',
		description: 'Development of industrial production and strategic value chains, recognising enterprises that established manufacturing capacity and industrial technology.'
	},
	{
		id: 'tier-iii',
		number: 'III',
		title: 'Markets & Enterprise',
		icon: 'fa-building',
		accentColor: '#4e2b5a',
		description: 'Systems that enable trade to function, focusing on trade infrastructure, logistics networks, financial platforms, and enterprise mechanisms.'
	},
	{
		id: 'tier-iv',
		number: 'IV',
		title: 'Trade Policy & Systems',
		icon: 'fa-file-contract',
		accentColor: '#78508c',
		description: 'Public-sector execution where policy decisions led to measurable improvements in trade facilitation, corridor performance, or market usability.'
	},
	{
		id: 'tier-v',
		number: 'V',
		title: 'Distinguished Recognition',
		icon: 'fa-award',
		accentColor: '#4e2b5a',
		description: 'Exceptional recognition of cumulative, long-term contribution to Africa&apos;s trade and industrial development at a foundational level.',
		featured: true
	}
]

export default function AwardCategoriesSection() {
	return (
		<div className="compact-awards-structure-section">
			<div className="container">
				<div className="row">
					<div className="col-lg-10 m-auto">
						<div className="awards-header-compact text-center" data-aos="fade-up" data-aos-duration={800}>
							<h2 className="awards-title-compact">Tiered Recognition Framework</h2>
							<div className="space16" />
							<p className="awards-intro-compact">The Africa Trade Awards are organised across a tiered structure designed to reflect the different layers through which Africa&apos;s trade and industrial systems are shaped, delivered, and sustained.</p>
						</div>
					</div>
				</div>
				<div className="space50" />
				<div className="view-all-button-wrapper">
					<Link href="/awards-structure" className="view-all-btn">
						<span>View All</span>
						<i className="fa-solid fa-arrow-right"></i>
					</Link>
				</div>
				<div className="space32" />
				<div className="elegant-tiers-grid">
					{tiers.map((tier, index) => (
						<div 
							key={tier.id} 
							className="elegant-tier-card"
							data-aos="fade-up"
							data-aos-duration={600 + (index * 100)}
							data-aos-delay={index * 50}
						>
							<div className="tier-card-elegant">
								{/* Top Section */}
								<div className="tier-top-elegant">
									<div className="tier-number-elegant" style={{ color: tier.accentColor }}>
										<span className="tier-roman-elegant">{tier.number}</span>
									</div>
								</div>

								{/* Content */}
								<div className="tier-body-elegant">
									<h3 className="tier-name-elegant">{tier.title}</h3>
									<div className="space16" />
									<p className="tier-text-elegant">{tier.description}</p>
									<div className="space20" />
									<Link href="/awards-structure" className="tier-read-more">
										<span>Read More</span>
										<i className="fa-solid fa-arrow-right"></i>
									</Link>
								</div>

								{/* Bottom Border */}
								<div className="tier-border-elegant" style={{ backgroundColor: tier.accentColor }}></div>
							</div>
						</div>
					))}
				</div>
				<div className="space50" />
			</div>
		</div>
	)
}
