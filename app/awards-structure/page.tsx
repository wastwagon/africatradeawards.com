'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { useEffect, useRef } from "react"

export default function AwardsStructure() {
	const videoRef = useRef<HTMLVideoElement>(null)

	useEffect(() => {
		const video = videoRef.current
		if (video) {
			video.play().catch((error) => {
				console.warn('Video autoplay failed:', error)
			})
		}
	}, [])

	return (
		<>
			<Layout headerStyle={1} footerStyle={1}>
				<div>
					<div className="inner-page-header">
						<video
							ref={videoRef}
							autoPlay
							loop
							muted
							playsInline
							preload="auto"
							className="header-video-background"
						>
							<source src="/assets/video/hero-video.mp4" type="video/mp4" />
						</video>
						<div className="container">
							<div className="row">
								<div className="col-lg-4 m-auto">
									<div className="heading1 text-center">
										<h1>Awards Structure</h1>
										<div className="space20" />
										<Link href="/"><span className="breadcrumb-home">Home</span> <i className="fa-solid fa-angle-right" /> <span className="breadcrumb-current">Awards Structure</span></Link>
									</div>
								</div>
							</div>
						</div>
					</div>
					
					{/*===== OVERVIEW AREA STARTS =======*/}
					<div className="about1-section-area overview-section sp1">
						<div className="container">
							<div className="row">
								<div className="col-lg-10 m-auto">
									<div className="modern-section-header text-center space-margin60">
										<span className="section-accent-label" data-aos="fade-up" data-aos-duration={800}>Structure</span>
										<div className="space20" />
										<h2 className="modern-section-title" data-aos="fade-up" data-aos-duration={900}>Tiered Recognition Framework</h2>
										<div className="space16" />
										<div className="compact-silver-text-box">
											<div className="compact-text-content">
												<p>The Africa Trade Awards are organised across a tiered structure designed to reflect the different layers through which Africa&apos;s trade and industrial systems are shaped, delivered, and sustained.</p>
											</div>
										</div>
									</div>
									<div className="space40" />
									<div className="compact-silver-text-box">
										<div className="compact-text-content">
											<p>The structure recognises that trade outcomes are not produced by a single set of actors, but by the interaction of leadership decisions, industrial production, enabling markets, infrastructure, finance, and policy execution. Each tier therefore focuses on a distinct dimension of contribution, while collectively reflecting the full architecture of Africa&apos;s trade and industrial development.</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					{/*===== OVERVIEW AREA ENDS =======*/}
					
					{/*===== TIERS GRID AREA STARTS =======*/}
					<div className="elegant-cta-section">
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
					{/*===== TIERS GRID AREA ENDS =======*/}
				</div>
			</Layout>
		</>
	)
}

