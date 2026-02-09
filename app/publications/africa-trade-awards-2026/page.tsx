'use client'

import Layout from '@/components/layout/Layout'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

export default function AfricaTradeAwards2026PressRelease() {
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
		<Layout headerStyle={1} footerStyle={1}>
			<div>
				<div className="inner-page-header publications-single-header">
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
							<div className="col-lg-8 m-auto">
								<div className="heading1 text-center">
									<div className="space20" />
									<>
										<Link href="/"><span className="breadcrumb-home">Home</span></Link>{' '}
										<i className="fa-solid fa-angle-right" />{' '}
										<Link href="/publications"><span className="breadcrumb-home">Publications</span></Link>{' '}
										<i className="fa-solid fa-angle-right" />{' '}
										<span className="breadcrumb-current">Press Release</span>
									</>
								</div>
							</div>
						</div>
					</div>
				</div>

				<article className="press-release-page">
					<div className="container">
						<div className="row">
							<div className="col-lg-10 m-auto">
								<header className="press-release-header">
									<p className="press-release-label">FOR IMMEDIATE RELEASE</p>
									<h1 className="press-release-title">
										Africa Trade Awards 2026 Honour Leaders Driving Africa&apos;s Industrialisation and Intra-African Trade
									</h1>
									<p className="press-release-dateline">Accra, Ghana | January 29, 2026</p>
								</header>

								<div className="press-release-body">
									<p>
										The Africa Trade Awards 2026 concluded in Accra as a landmark celebration of leadership,
										innovation, and execution in advancing Africa&apos;s industrialisation and intra-African trade
										agenda under the African Continental Free Trade Area (AfCFTA).
									</p>
									<p>
										Held as the closing highlight of the Africa Trade Summit, the Awards Gala convened Heads
										of State, senior government officials, captains of industry, development finance institutions,
										and regional bodies to recognise individuals and institutions delivering measurable impact
										across Africa&apos;s trade and industrial value chains.
									</p>
									<figure className="press-release-inline-image">
										<img src="/assets/img/gallery/2P9A9102.jpg" alt="Africa Trade Summit and Awards Gala" />
									</figure>
									<p>
										Delivering the keynote address at the Awards Ceremony, H.E Prof Jane Naana
										Opoku-Agyemang, Vice President of the Republic of Ghana, congratulated all award
										recipients for their leadership, resilience, and contribution to building a more competitive and
										integrated African economy. She emphasised that while the AfCFTA represents the world&apos;s
										largest free trade area by number of participating countries, its promise will only be realised
										through consistent implementation, infrastructure alignment, institutional discipline, and
										political will.
									</p>
									<p>
										The Vice President underscored that Africa&apos;s economic sovereignty depends on its ability to
										process its resources, strengthen SMEs, create jobs, and build resilient infrastructure, noting
										that inclusive growth—anchored in youth, women, and enterprise development—is essential
										to sustaining Africa&apos;s long-term transformation.
									</p>
									<p>
										In a special address delivered at the Summit&apos;s closing ceremony, H.E Carlos Vila Nova,
										President of the Democratic Republic of São Tomé and Príncipe, challenged African leaders
										to confront the persistent gap between ambition and outcomes. He stressed that Africa&apos;s
										industrial future will not be determined by vision alone, but by how infrastructure, energy
										systems, borders, and financing are governed as integrated, functional systems rather than
										isolated assets.
									</p>
									<p>
										President Vila Nova warned that time has become Africa&apos;s most expensive deficit, noting that
										delays in implementation carry generational costs for competitiveness, employment, and
										investor confidence. He called for stronger regional coordination, reliable power for industry,
										efficient border systems, and bankable project structures that align public ambition with
										private capital.
									</p>
									<p>
										Adding a private-sector and institutional perspective, Sir Sam Jonah, Chairman of the
										Advisory Board of the African Trade Chamber, described Africa&apos;s industrialisation as &quot;no
										longer a matter of intent, but a call to coordination, execution, and institutional resolve.&quot; He
										emphasised that infrastructure must serve production and trade, not prestige, and that
										borders must become bridges for commerce rather than barriers of bureaucracy.
									</p>
									<p>
										Sir Sam Jonah further noted that Africa&apos;s success will depend on focused
										execution—prioritising specific corridors, sectors, and value chains where alignment
										between government, financiers, and the private sector can deliver scale and
										competitiveness. He highlighted the African Trade Chamber&apos;s emerging role as a platform
										for alignment between policy and industry, translating dialogue into delivery and long-term
										investment readiness.
									</p>
									<figure className="press-release-inline-image">
										<img src="/assets/img/gallery/2P9A9197.jpg" alt="Africa Trade Awards 2026" />
									</figure>
									<h2 className="press-release-h2">Africa Trade Awards 2026 – Award Recipients</h2>
									<p>The 2026 Awards recognised excellence across five tiers:</p>

									<section className="award-tier">
										<h3 className="award-tier-title">Tier I – Continental Leadership Recognitions</h3>
										<ul className="award-tier-list">
											<li>Africa Trade Leader of the Year: Prof. Benedict Oramah (Former President, Afreximbank)</li>
											<li>Africa Trade Finance Architect of the Year: Afreximbank</li>
										</ul>
									</section>

									<section className="award-tier">
										<h3 className="award-tier-title">Tier II – Industry &amp; Strategic Value Chain Recognitions</h3>
										<ul className="award-tier-list">
											<li>Industrial Energy Project of the Year: Grand Ethiopian Renaissance Dam (GERD)</li>
											<li>Advanced Manufacturing Excellence Award: Elsewedy Electric</li>
											<li>Pharmaceutical &amp; Health Manufacturing Excellence Award: Aspen Pharmacare</li>
											<li>Industrial Technology &amp; Automation Award: Bakhresa Group</li>
											<li>Industrial Export Champion of the Year: OCP Group</li>
										</ul>
									</section>

									<section className="award-tier">
										<h3 className="award-tier-title">Tier III – Markets, Capital &amp; Enterprise Recognitions</h3>
										<ul className="award-tier-list">
											<li>Trade Infrastructure &amp; Logistics Excellence Award: Africa Global Logistics</li>
											<li>SME Trade Expansion Platform of the Year: Flutterwave</li>
											<li>Intra-African Trade Systems Champion of the Year: Rwanda</li>
											<li>Trade &amp; Industrial Finance Institution of the Year: Trade &amp; Development Bank</li>
											<li>Enterprise and Expansion Award: Ethiopian Airlines</li>
											<li>Women in Trade &amp; Industry Leadership Award: Patricia Poku-Diaby</li>
										</ul>
									</section>

									<section className="award-tier">
										<h3 className="award-tier-title">Tier IV – Trade Policy, Systems &amp; Market Impact</h3>
										<ul className="award-tier-list">
											<li>Trade Infrastructure &amp; Systems Impact Award: Pan-African Payment and Settlement System (PAPSS)</li>
										</ul>
									</section>

									<section className="award-tier">
										<h3 className="award-tier-title">Tier V – Distinguished Recognition</h3>
										<ul className="award-tier-list">
											<li>Distinguished Recognition Award: Gervais Koffi Djondo</li>
										</ul>
									</section>

									<p>
										The Africa Trade Awards reinforce the central message of the Africa Trade Summit: that
										Africa&apos;s trade and industrial transformation will be driven by <strong>discipline, coordination, and
										sustained execution</strong>, not declarations alone.
									</p>
									<p>
										The Awards are expected to become an annual continental benchmark for recognising
										leadership that strengthens Africa&apos;s industrial base, deepens regional value chains, and
										advances intra-African trade.
									</p>
								</div>

								<footer className="press-release-contact">
									<h3 className="press-release-contact-title">Media Contact:</h3>
									<p className="press-release-contact-org">Africa Trade Chamber</p>
									<p className="press-release-contact-emails">
										<a href="mailto:media@africatradesummit.com">media@africatradesummit.com</a>
										{' | '}
										<a href="mailto:partnerships@africantradechamber.org">partnerships@africantradechamber.org</a>
										{' | '}
										<a href="mailto:participants@africatradesummit.com">participants@africatradesummit.com</a>
									</p>
									<p className="press-release-contact-phone">
										Phone/WhatsApp: <a href="tel:+233505366248">+233 50 536 6248</a> | <a href="tel:+233264000360">+233264000360</a>
									</p>
									<p className="press-release-contact-web">
										<a href="https://www.africatradesummit.com" target="_blank" rel="noopener noreferrer">www.africatradesummit.com</a>
										{' | '}
										<a href="https://www.africatradeawards.com" target="_blank" rel="noopener noreferrer">www.africatradeawards.com</a>
									</p>
								</footer>

								<div className="press-release-back">
									<Link href="/publications" className="vl-btn1 publication-back-btn">
										<i className="fa-solid fa-arrow-left" /> Back to Publications
									</Link>
								</div>
							</div>
						</div>
					</div>
				</article>
			</div>
		</Layout>
	)
}
