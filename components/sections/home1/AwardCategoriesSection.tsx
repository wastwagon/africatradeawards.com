'use client'
import Link from 'next/link'

export default function AwardCategoriesSection() {
	return (
		<div className="elegant-cta-section awards-structure-section">
			<div className="choose-section-area premium-categories-section">
				<div className="container">
					<div className="row">
						<div className="col-lg-8 m-auto">
							<div className="heading2 text-center">
								<h2 className="text-anime-style-3 premium-section-title">Awards Structure</h2>
								<div className="space8" />
								<p className="premium-section-description" data-aos="fade-up" data-aos-duration={900}>The Africa Trade Awards are organised across a tiered structure designed to reflect the different layers through which Africa&apos;s trade and industrial systems are shaped, delivered, and sustained.</p>
							</div>
						</div>
					</div>
					<div className="space16" />
				</div>
			</div>
			<div className="image-cards-wrapper">
				<div className="container">
					<div className="image-cards-grid image-cards-grid-all">
						{/* Tier I - Continental Leadership */}
						<div className="image-card" data-aos="fade-up" data-aos-duration={800}>
							<div className="card-image-wrapper">
								<img src="/assets/img/all-images/categories/Continental Leadership.jpg" alt="Tier I – Continental Leadership" />
							</div>
							<div className="card-content-box">
								<h3 className="card-title">Tier I – Continental Leadership</h3>
								<div className="card-description tier-full-description">
									<p>Tier I recognitions acknowledge leadership exercised at continental or multi-regional scale. They honour individuals and institutions whose strategic decisions influenced how trade and industrial activity are financed, organised, or executed across multiple African markets.</p>
									<p className="tier-highlight-text">Recognition under this tier reflects contributions that shaped market structures, industrial platforms, or financial architectures with effects extending beyond a single country or sector.</p>
								</div>
							</div>
						</div>

						{/* Tier II - Industry & Value Chains */}
						<div className="image-card" data-aos="fade-up" data-aos-duration={900}>
							<div className="card-image-wrapper">
								<img src="/assets/img/all-images/categories/Industry Excellence.jpg" alt="Tier II – Industry & Value Chains" />
							</div>
							<div className="card-content-box">
								<h3 className="card-title">Tier II – Industry & Value Chains</h3>
								<div className="card-description tier-full-description">
									<p>Tier II recognitions focus on the development of industrial production and strategic value chains. They honour enterprises and projects that established or expanded manufacturing capacity, energy systems, agro-industrial platforms, health production, or industrial technology essential to sustained economic activity.</p>
									<p className="tier-highlight-text">The emphasis is on operational scale, continuity of production, and the integration of value chains that retain economic value within Africa.</p>
								</div>
							</div>
						</div>

						{/* Tier III - Markets & Enterprise */}
						<div className="image-card" data-aos="fade-up" data-aos-duration={1000}>
							<div className="card-image-wrapper">
								<img src="/assets/img/all-images/categories/Enterprise Awards.webp" alt="Tier III – Markets & Enterprise" />
							</div>
							<div className="card-content-box">
								<h3 className="card-title">Tier III – Markets & Enterprise</h3>
								<div className="card-description tier-full-description">
									<p>Tier III recognitions address the systems that enable trade to function in practice. They focus on trade infrastructure, logistics networks, financial platforms, payment systems, and enterprise mechanisms that support cross-border commerce.</p>
									<p className="tier-highlight-text">This tier recognises contributions that improved market connectivity, reduced friction in trade execution, or enabled enterprises—large and small—to operate across African markets.</p>
								</div>
							</div>
						</div>

						{/* Tier IV - Trade Policy & Systems */}
						<div className="image-card" data-aos="fade-up" data-aos-duration={1100}>
							<div className="card-image-wrapper">
								<img src="/assets/img/all-images/categories/Institutional & Enabler.jpg.avif" alt="Tier IV – Trade Policy & Systems" />
							</div>
							<div className="card-content-box">
								<h3 className="card-title">Tier IV – Trade Policy & Systems</h3>
								<div className="card-description tier-full-description">
									<p>Tier IV recognitions acknowledge public-sector execution where national or regional policy decisions led to measurable improvements in trade facilitation, corridor performance, or market usability.</p>
									<p className="tier-highlight-text">They recognise that effective trade integration depends on implemented policies, functioning systems, and coordinated institutions that support predictable and efficient cross-border movement of goods and services.</p>
								</div>
							</div>
						</div>

						{/* Tier V - Distinguished Recognition */}
						<div className="image-card tier-card-featured" data-aos="fade-up" data-aos-duration={1200}>
							<div className="card-image-wrapper">
								<img src="/assets/img/all-images/categories/Special Recognition.jpg" alt="Tier V – Distinguished Recognition" />
							</div>
							<div className="card-content-box">
								<h3 className="card-title">Tier V – Distinguished Recognition</h3>
								<div className="card-description tier-full-description">
									<p>Tier V is reserved for exceptional recognition of cumulative, long-term contribution to Africa&apos;s trade and industrial development. It honours work whose influence has been sustained over time and has shaped institutions, markets, or integration pathways at a foundational level.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
