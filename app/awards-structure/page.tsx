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
										<div className="space20" />
										<Link href="/"><span className="breadcrumb-home">Home</span> <i className="fa-solid fa-angle-right" /> <span className="breadcrumb-current">Awards Structure</span></Link>
									</div>
								</div>
							</div>
						</div>
					</div>
					
					{/*===== OVERVIEW AREA STARTS =======*/}
					<div className="compact-awards-structure-section">
						<div className="container">
							<div className="row">
								<div className="col-lg-10 m-auto">
									<div className="awards-header-compact text-center" data-aos="fade-up" data-aos-duration={800}>
										<h2 className="awards-title-compact">Tiered Recognition Framework</h2>
										<div className="space16" />
										<p className="awards-intro-compact">The Africa Trade Awards are organised across a tiered structure designed to reflect the different layers through which Africa&apos;s trade and industrial systems are shaped, delivered, and sustained.</p>
									</div>
									<div className="space40" />
									<div className="awards-header-compact text-center">
										<p className="awards-intro-compact">The structure recognises that trade outcomes are not produced by a single set of actors, but by the interaction of leadership decisions, industrial production, enabling markets, infrastructure, finance, and policy execution. Each tier therefore focuses on a distinct dimension of contribution, while collectively reflecting the full architecture of Africa&apos;s trade and industrial development.</p>
									</div>
								</div>
							</div>
						</div>
					</div>
					{/*===== OVERVIEW AREA ENDS =======*/}
					
					{/*===== TIERS GRID AREA STARTS =======*/}
					<div className="compact-awards-structure-section">
						<div className="container">
							<div className="elegant-tiers-grid">
								{/* Tier I - Continental Leadership */}
								<div className="elegant-tier-card" data-aos="fade-up" data-aos-duration={800}>
									<div className="tier-card-elegant">
										<div className="tier-top-elegant">
											<div className="tier-number-elegant" style={{ color: '#4e2b5a' }}>
												<span className="tier-roman-elegant">I</span>
											</div>
										</div>
										<div className="tier-body-elegant">
											<h3 className="tier-name-elegant">Continental Leadership</h3>
											<div className="space16" />
											<div className="tier-text-elegant">
												<p>Tier I recognitions acknowledge leadership exercised at continental or multi-regional scale. They honour individuals and institutions whose strategic decisions influenced how trade and industrial activity are financed, organised, or executed across multiple African markets.</p>
												<div className="space12" />
												<p style={{ fontWeight: 'var(--ztc-weight-semibold)', color: 'var(--ztc-text-text-2)' }}>Recognition under this tier reflects contributions that shaped market structures, industrial platforms, or financial architectures with effects extending beyond a single country or sector.</p>
											</div>
										</div>
										<div className="tier-border-elegant" style={{ backgroundColor: '#4e2b5a' }}></div>
									</div>
								</div>

								{/* Tier II - Industry & Value Chains */}
								<div className="elegant-tier-card" data-aos="fade-up" data-aos-duration={900}>
									<div className="tier-card-elegant">
										<div className="tier-top-elegant">
											<div className="tier-number-elegant" style={{ color: '#78508c' }}>
												<span className="tier-roman-elegant">II</span>
											</div>
										</div>
										<div className="tier-body-elegant">
											<h3 className="tier-name-elegant">Industry & Value Chains</h3>
											<div className="space16" />
											<div className="tier-text-elegant">
												<p>Tier II recognitions focus on the development of industrial production and strategic value chains. They honour enterprises and projects that established or expanded manufacturing capacity, energy systems, agro-industrial platforms, health production, or industrial technology essential to sustained economic activity.</p>
												<div className="space12" />
												<p style={{ fontWeight: 'var(--ztc-weight-semibold)', color: 'var(--ztc-text-text-2)' }}>The emphasis is on operational scale, continuity of production, and the integration of value chains that retain economic value within Africa.</p>
											</div>
										</div>
										<div className="tier-border-elegant" style={{ backgroundColor: '#78508c' }}></div>
									</div>
								</div>

								{/* Tier III - Markets & Enterprise */}
								<div className="elegant-tier-card" data-aos="fade-up" data-aos-duration={1000}>
									<div className="tier-card-elegant">
										<div className="tier-top-elegant">
											<div className="tier-number-elegant" style={{ color: '#4e2b5a' }}>
												<span className="tier-roman-elegant">III</span>
											</div>
										</div>
										<div className="tier-body-elegant">
											<h3 className="tier-name-elegant">Markets & Enterprise</h3>
											<div className="space16" />
											<div className="tier-text-elegant">
												<p>Tier III recognitions address the systems that enable trade to function in practice. They focus on trade infrastructure, logistics networks, financial platforms, payment systems, and enterprise mechanisms that support cross-border commerce.</p>
												<div className="space12" />
												<p style={{ fontWeight: 'var(--ztc-weight-semibold)', color: 'var(--ztc-text-text-2)' }}>This tier recognises contributions that improved market connectivity, reduced friction in trade execution, or enabled enterprises—large and small—to operate across African markets.</p>
											</div>
										</div>
										<div className="tier-border-elegant" style={{ backgroundColor: '#4e2b5a' }}></div>
									</div>
								</div>

								{/* Tier IV - Trade Policy & Systems */}
								<div className="elegant-tier-card" data-aos="fade-up" data-aos-duration={1100}>
									<div className="tier-card-elegant">
										<div className="tier-top-elegant">
											<div className="tier-number-elegant" style={{ color: '#78508c' }}>
												<span className="tier-roman-elegant">IV</span>
											</div>
										</div>
										<div className="tier-body-elegant">
											<h3 className="tier-name-elegant">Trade Policy & Systems</h3>
											<div className="space16" />
											<div className="tier-text-elegant">
												<p>Tier IV recognitions acknowledge public-sector execution where national or regional policy decisions led to measurable improvements in trade facilitation, corridor performance, or market usability.</p>
												<div className="space12" />
												<p style={{ fontWeight: 'var(--ztc-weight-semibold)', color: 'var(--ztc-text-text-2)' }}>They recognise that effective trade integration depends on implemented policies, functioning systems, and coordinated institutions that support predictable and efficient cross-border movement of goods and services.</p>
											</div>
										</div>
										<div className="tier-border-elegant" style={{ backgroundColor: '#78508c' }}></div>
									</div>
								</div>

								{/* Tier V - Distinguished Recognition */}
								<div className="elegant-tier-card" data-aos="fade-up" data-aos-duration={1200}>
									<div className="tier-card-elegant">
										<div className="tier-top-elegant">
											<div className="tier-number-elegant" style={{ color: '#4e2b5a' }}>
												<span className="tier-roman-elegant">V</span>
											</div>
										</div>
										<div className="tier-body-elegant">
											<h3 className="tier-name-elegant">Distinguished Recognition</h3>
											<div className="space16" />
											<div className="tier-text-elegant">
												<p>Tier V is reserved for exceptional recognition of cumulative, long-term contribution to Africa&apos;s trade and industrial development. It honours work whose influence has been sustained over time and has shaped institutions, markets, or integration pathways at a foundational level.</p>
											</div>
										</div>
										<div className="tier-border-elegant" style={{ backgroundColor: '#4e2b5a' }}></div>
									</div>
								</div>
							</div>
							<div className="space50" />
						</div>
					</div>
					{/*===== TIERS GRID AREA ENDS =======*/}
				</div>
			</Layout>
		</>
	)
}

