'use client'
import Countdown from '@/components/elements/Countdown'
import Layout from "@/components/layout/Layout"
import Link from "next/link"

export default function AwardCategories() {
	return (
		<Layout headerStyle={1} footerStyle={1}>
			<div>
				<div className="inner-page-header" style={{ backgroundImage: 'url(assets/img/bg/header-bg5.png)' }}>
					<div className="container">
						<div className="row">
							<div className="col-lg-4 m-auto">
								<div className="heading1 text-center">
									<h1>Award Categories</h1>
									<div className="space20" />
									<Link href="/">Home <i className="fa-solid fa-angle-right" /> <span>Award Categories</span></Link>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/*===== OVERVIEW AREA STARTS =======*/}
				<div className="about1-section-area sp1">
					<div className="container">
						<div className="row">
							<div className="col-lg-8 m-auto">
								<div className="heading2 text-center space-margin60">
									<h5 data-aos="fade-up" data-aos-duration={800}>Overview</h5>
									<div className="space16" />
									<h2 className="text-anime-style-3">Honouring the Champions of Africa&apos;s Trade and Industrialisation</h2>
									<div className="space24" />
									<p data-aos="fade-up" data-aos-duration={900}>Under the 2026 theme &quot;Honouring the Champions of Africa&apos;s Trade and Industrialisation,&quot; the Awards recognise individuals, enterprises, and institutions that exemplify excellence, innovation, and leadership in advancing Africa&apos;s trade and industrial transformation.</p>
									<div className="space16" />
									<p data-aos="fade-up" data-aos-duration={900}>The Awards are organised into five thematic tiers reflecting the full spectrum of Africa&apos;s trade ecosystem.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/*===== TIER I =======*/}
				<div className="event-team-area sp2">
					<div className="container">
						<div className="row">
							<div className="col-lg-6 m-auto">
								<div className="heading2 text-center space-margin60">
									<h5>Tier I</h5>
									<div className="space16" />
									<h2>Continental Leadership Awards</h2>
									<p className="mt-3">Celebrating visionary leadership and continental impact.</p>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration={800}>
								<div className="event2-boxarea">
									<div className="content-area">
										<h3>1. African Trade Personality of the Year</h3>
									</div>
								</div>
							</div>
							<div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration={900}>
								<div className="event2-boxarea">
									<div className="content-area">
										<h3>2. Pan-African Business Leadership Award</h3>
									</div>
								</div>
							</div>
							<div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration={1000}>
								<div className="event2-boxarea">
									<div className="content-area">
										<h3>3. Lifetime Achievement in Trade &amp; Industrialisation</h3>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/*===== TIER II =======*/}
				<div className="event-team-area sp2">
					<div className="container">
						<div className="row">
							<div className="col-lg-6 m-auto">
								<div className="heading2 text-center space-margin60">
									<h5>Tier II</h5>
									<div className="space16" />
									<h2>Industry Excellence Awards</h2>
									<p className="mt-3">Honouring sectoral leadership and innovation.</p>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration={800}>
								<div className="event2-boxarea">
									<div className="content-area">
										<h3>1. Mining &amp; Minerals Value-Chain Leadership Award</h3>
									</div>
								</div>
							</div>
							<div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration={900}>
								<div className="event2-boxarea">
									<div className="content-area">
										<h3>2. Energy &amp; Power Development Excellence Award</h3>
									</div>
								</div>
							</div>
							<div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration={1000}>
								<div className="event2-boxarea">
									<div className="content-area">
										<h3>3. Infrastructure Development Award</h3>
									</div>
								</div>
							</div>
							<div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration={1100}>
								<div className="event2-boxarea">
									<div className="content-area">
										<h3>4. Manufacturing &amp; Industrial Innovation Award</h3>
									</div>
								</div>
							</div>
							<div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration={1200}>
								<div className="event2-boxarea">
									<div className="content-area">
										<h3>5. Agro-Industrialisation &amp; Food Systems Transformation Award</h3>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/*===== TIER III =======*/}
				<div className="event-team-area sp2">
					<div className="container">
						<div className="row">
							<div className="col-lg-6 m-auto">
								<div className="heading2 text-center space-margin60">
									<h5>Tier III</h5>
									<div className="space16" />
									<h2>Enterprise Awards</h2>
									<p className="mt-3">Celebrating innovation, growth, and entrepreneurship.</p>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration={800}>
								<div className="event2-boxarea">
									<div className="content-area">
										<h3>1. SME of the Year</h3>
									</div>
								</div>
							</div>
							<div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration={900}>
								<div className="event2-boxarea">
									<div className="content-area">
										<h3>2. Young Trade Leader Award</h3>
									</div>
								</div>
							</div>
							<div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration={1000}>
								<div className="event2-boxarea">
									<div className="content-area">
										<h3>3. Women in Trade &amp; Industry Leadership Award</h3>
									</div>
								</div>
							</div>
							<div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration={1100}>
								<div className="event2-boxarea">
									<div className="content-area">
										<h3>4. Diaspora Trade Excellence Award</h3>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/*===== TIER IV =======*/}
				<div className="event-team-area sp2">
					<div className="container">
						<div className="row">
							<div className="col-lg-6 m-auto">
								<div className="heading2 text-center space-margin60">
									<h5>Tier IV</h5>
									<div className="space16" />
									<h2>Institutional &amp; Enabler Awards</h2>
									<p className="mt-3">Recognising institutions that make continental trade possible.</p>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration={800}>
								<div className="event2-boxarea">
									<div className="content-area">
										<h3>1. Development Finance Institution of the Year</h3>
									</div>
								</div>
							</div>
							<div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration={900}>
								<div className="event2-boxarea">
									<div className="content-area">
										<h3>2. Trade Promotion Agency of the Year</h3>
									</div>
								</div>
							</div>
							<div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration={1000}>
								<div className="event2-boxarea">
									<div className="content-area">
										<h3>3. Customs &amp; Port Efficiency Award</h3>
									</div>
								</div>
							</div>
							<div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration={1100}>
								<div className="event2-boxarea">
									<div className="content-area">
										<h3>4. AfCFTA Implementation Partner Award</h3>
									</div>
								</div>
							</div>
							<div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration={1200}>
								<div className="event2-boxarea">
									<div className="content-area">
										<h3>5. Public–Private Partnership Award</h3>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/*===== TIER V =======*/}
				<div className="event-team-area sp2">
					<div className="container">
						<div className="row">
							<div className="col-lg-6 m-auto">
								<div className="heading2 text-center space-margin60">
									<h5>Tier V</h5>
									<div className="space16" />
									<h2>Special Recognition Awards</h2>
									<p className="mt-3">Reserved for exceptional, non-competitive distinctions.</p>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration={800}>
								<div className="event2-boxarea">
									<div className="content-area">
										<h3>1. Lifetime Impact Award</h3>
									</div>
								</div>
							</div>
							<div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration={900}>
								<div className="event2-boxarea">
									<div className="content-area">
										<h3>2. Excellence in Trade Policy &amp; Governance Award</h3>
									</div>
								</div>
							</div>
							<div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration={1000}>
								<div className="event2-boxarea">
									<div className="content-area">
										<h3>3. Sustainability &amp; ESG Innovation Award</h3>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/*===== NOMINATION GUIDANCE =======*/}
				<div className="about1-section-area sp2">
					<div className="container">
						<div className="row">
							<div className="col-lg-8 m-auto">
								<div className="heading2 text-center space-margin60">
									<h5 data-aos="fade-up" data-aos-duration={800}>Nomination Guidance</h5>
									<div className="space16" />
									<h2 className="text-anime-style-3">How to Nominate</h2>
									<div className="space24" />
									<div className="text-left" data-aos="fade-up" data-aos-duration={900}>
										<ul style={{ listStyle: 'disc', paddingLeft: '20px' }}>
											<li>Nominations may be submitted by individuals, organisations, or through self-nomination.</li>
											<li>Submissions must demonstrate measurable impact, innovation, and continental relevance.</li>
											<li>Each entry includes:
												<ul style={{ listStyle: 'circle', paddingLeft: '20px', marginTop: '10px' }}>
													<li>Profile summary (max 500 words)</li>
													<li>Achievements and measurable outcomes</li>
													<li>Endorsements or references</li>
													<li>Supporting evidence (reports, media, images)</li>
												</ul>
											</li>
										</ul>
									</div>
									<div className="space32" />
									<div className="btn-area1">
										<Link href="/nomination" className="vl-btn1">Nominate Now</Link>
										<Link href="/nomination" className="vl-btn2">Download Nomination Guide</Link>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/*===== CTA AREA =======*/}
				<div className="cta1-section-area">
					<div className="container">
						<div className="row">
							<div className="col-lg-10 m-auto">
								<div className="cta1-main-boxarea">
									<div className="timer-btn-area">
										<Countdown />
										<div className="btn-area1">
											<Link href="/nomination" className="vl-btn1">Submit Nomination</Link>
										</div>
									</div>
									<ul>
										<li>
											<Link href="/#"><img src="/assets/img/icons/calender1.svg" alt="" />30 January 2026 - 6:30pm to 11:00pm</Link>
										</li>
										<li className="m-0">
											<Link href="/#"><img src="/assets/img/icons/location1.svg" alt="" />Kempinski Gold Coast City Hotel, Accra</Link>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	)
}





