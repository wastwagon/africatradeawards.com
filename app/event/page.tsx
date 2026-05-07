import Image from "next/image"
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import PublicPageHero from '@/components/sections/PublicPageHero'

const days = [
	{
		name: "Day 1",
		label: "Summit sessions",
		date: "28 January 2026",
		sessions: [
			{
				index: "01",
				title: "Leadership Breakfast & Delegate Arrival",
				time: "08:00 AM - 09:30 AM",
				location: "Diplomatic Hall, Kempinski",
				hosts: "Secretariat + partner hosts",
				speakers: ["Trade chamber leadership", "Regional delegation leads", "Protocol office"],
				image: "/assets/img/all-images/event/event-img4.png",
			},
			{
				index: "02",
				title: "Continental Trade Outlook & Policy Dialogue",
				time: "10:00 AM - 12:15 PM",
				location: "Main Summit Stage",
				hosts: "Regional policy and trade leaders",
				speakers: ["Policy ministers", "Development finance leads", "Cross-border operators"],
				image: "/assets/img/all-images/event/event-img5.png",
			},
			{
				index: "03",
				title: "Industry & Infrastructure Roundtables",
				time: "01:30 PM - 04:30 PM",
				location: "Breakout Rooms A-C",
				hosts: "Banking, logistics, and enterprise panels",
				speakers: ["Banking executives", "Port and rail operators", "Manufacturing founders"],
				image: "/assets/img/all-images/event/event-img6.png",
			},
		],
	},
	{
		name: "Day 2",
		label: "Gala & recognition",
		date: "29 January 2026",
		sessions: [
			{
				index: "04",
				title: "Finalist Reception & Red Carpet Arrivals",
				time: "05:00 PM - 06:15 PM",
				location: "Grand Foyer",
				hosts: "Finalists, nominees, invited guests",
				speakers: ["Nominee delegations", "Partner executives", "Media representatives"],
				image: "/assets/img/all-images/event/event-img4.png",
			},
			{
				index: "05",
				title: "Awards Main Show & Category Announcements",
				time: "06:30 PM - 09:30 PM",
				location: "Grand Ballroom",
				hosts: "Official hosts + category presenters",
				speakers: ["Category presenters", "Jury representatives", "Master of ceremonies"],
				image: "/assets/img/all-images/event/event-img6.png",
			},
			{
				index: "06",
				title: "Honourees Dinner & Closing Networking",
				time: "09:30 PM - 11:30 PM",
				location: "Private Dining & Networking Lounge",
				hosts: "Awardees, partners, delegations, media",
				speakers: ["Awardees and partners", "Summit speakers", "Strategic investors"],
				image: "/assets/img/all-images/event/event-img5.png",
			},
		],
	},
]

const attendeeProfiles = [
	{
		title: 'Enterprise leaders',
		copy: 'Executive teams leading market expansion, supply-chain strategy, and cross-border partnerships.',
		icon: 'fa-solid fa-briefcase',
	},
	{
		title: 'Policy and institution teams',
		copy: 'Ministries, chambers, and development institutions shaping cross-border policy and growth frameworks.',
		icon: 'fa-solid fa-landmark',
	},
	{
		title: 'Investors and partners',
		copy: 'Investment and partner teams sourcing validated opportunities and strategic relationships.',
		icon: 'fa-solid fa-chart-line',
	},
] as const

export default function Event() {
	return (
		<Layout>
			<div>
				<PublicPageHero title="Programme Highlights" currentLabel="Event" />

				<div className="event-team-area sp1">
					<div className="container">
						<div className="row">
							<div className="col-lg-8 m-auto">
								<div className="modern-section-header text-center space-margin60">
									<span className="section-accent-label" data-aos="fade-up" data-aos-duration={800}>Event</span>
									<div className="space20" />
									<h2 className="modern-section-title" data-aos="fade-up" data-aos-duration={900}>Africa Trade Awards Week</h2>
									<div className="space16" />
									<p data-aos="fade-up" data-aos-duration={950} style={{ margin: 0, fontSize: "1.02rem", lineHeight: 1.65, color: "rgba(30,21,40,0.8)" }}>
										A premium two-day programme in Accra combining strategic intelligence, executive networking, and gala recognition.
									</p>
								</div>
							</div>
						</div>

						{days.map((day) => (
							<div key={day.name} className="row" style={{ marginBottom: 46 }}>
								<div className="col-lg-10 m-auto">
									<div className="d-flex flex-wrap align-items-center justify-content-between mb-4" data-aos="fade-up" data-aos-duration={750}>
										<div>
											<p style={{ margin: "0 0 8px", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#6a4082" }}>
												{day.name}
											</p>
											<h3 style={{ margin: 0, fontFamily: "var(--grotesk), sans-serif", color: "#1e1528" }}>{day.label}</h3>
										</div>
										<span style={{ display: "inline-flex", alignItems: "center", minHeight: 36, borderRadius: 999, padding: "0 14px", border: "1px solid rgba(78,43,90,0.2)", background: "rgba(255,255,255,0.75)", fontWeight: 600, color: "#40244d" }}>
											{day.date}
										</span>
									</div>
									{day.sessions.map((session, idx) => (
										<div key={session.index} className="event2-boxarea box1" style={{ marginBottom: idx === day.sessions.length - 1 ? 0 : 28 }}>
											<h1 className="active">{session.index}</h1>
											<div className="row align-items-center">
												<div className="col-lg-5">
													<div className="img1">
														<Image src={session.image} alt={session.title} width={900} height={600} />
													</div>
												</div>
												<div className="col-lg-1" />
												<div className="col-lg-6">
													<div className="content-area">
														<ul>
															<li><span><Image src="/assets/img/icons/clock1.svg" alt="" width={18} height={18} />{session.time}</span></li>
															<li><span><Image src="/assets/img/icons/location1.svg" alt="" width={18} height={18} />{session.location}</span></li>
														</ul>
														<div className="space20" />
														<h3 className="head">{session.title}</h3>
														<div className="space16" />
														<p style={{ margin: 0, lineHeight: 1.6, color: "rgba(30,21,40,0.78)" }}>
															<strong style={{ color: "#2f1a3b" }}>Featuring:</strong> {session.hosts}
														</p>
														<div className="space12" />
														<div className="d-flex flex-wrap gap-2">
															{session.speakers.map((speaker) => (
																<span key={speaker} className="event-speaker-chip">
																	{speaker}
																</span>
															))}
														</div>
														<div className="space24" />
														<div className="btn-area1 d-flex flex-wrap gap-2">
															<Link href="/event/register" className="vl-btn1"><span className="demo">Register</span></Link>
															<Link href="/contact/" className="vl-btn1 event-btn-secondary">
																<span className="demo">Book concierge support</span>
															</Link>
														</div>
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						))}

						<div className="row" style={{ marginBottom: 46 }}>
							<div className="col-lg-10 m-auto">
								<div
									style={{
										padding: "24px 24px 20px",
										borderRadius: 18,
										background: "linear-gradient(180deg, #faf6fb 0%, #f2ebf6 100%)",
										border: "1px solid rgba(78,43,90,0.12)",
										boxShadow: "0 14px 34px rgba(30,21,40,0.08)",
									}}
								>
									<p style={{ margin: "0 0 8px", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#6a4082" }}>
										Who should attend
									</p>
									<h3 style={{ margin: "0 0 16px", color: "#1e1528", fontFamily: "var(--grotesk), sans-serif" }}>
										Designed for decision-makers and institutional principals
									</h3>
									<div className="row g-3">
										{attendeeProfiles.map((profile) => (
											<div key={profile.title} className="col-md-4 d-flex">
												<article
													style={{
														width: "100%",
														padding: "16px 14px",
														borderRadius: 12,
														background: "#fff",
														border: "1px solid rgba(78,43,90,0.1)",
													}}
												>
													<p style={{ margin: "0 0 8px", color: "#4e2b5a" }}>
														<i className={profile.icon} aria-hidden />
													</p>
													<h4 style={{ margin: "0 0 8px", fontSize: "1rem", color: "#1e1528" }}>{profile.title}</h4>
													<p style={{ margin: 0, fontSize: "0.92rem", lineHeight: 1.55, color: "rgba(30,21,40,0.75)" }}>{profile.copy}</p>
												</article>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>

						<div className="row">
							<div className="col-lg-10 m-auto">
								<div className="row g-4 align-items-start">
									<div className="col-lg-7">
										<div
											style={{
												padding: "26px 24px",
												borderRadius: 18,
												background: "linear-gradient(165deg, #1a1222 0%, #24182e 100%)",
												border: "1px solid rgba(231,207,170,0.24)",
												boxShadow: "0 20px 46px rgba(26,18,34,0.24)",
											}}
										>
											<p style={{ margin: "0 0 8px", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#e7cfaa" }}>
												Guest services
											</p>
											<h3 style={{ margin: "0 0 12px", color: "#fbf7f1", fontFamily: "var(--grotesk), sans-serif" }}>
												Guest operations guidance
											</h3>
											<ul style={{ margin: 0, paddingLeft: "1.1rem", color: "rgba(251,247,241,0.86)", lineHeight: 1.7 }}>
												<li>Check-in opens 90 minutes before summit sessions and red carpet arrivals.</li>
												<li>Summit: business formal. Gala: black tie or national formal attire.</li>
												<li>Dedicated support desk for delegations, protocol teams, and invited media.</li>
												<li>Airport transfer and accommodation guidance available by request.</li>
											</ul>
										</div>
									</div>
									<div className="col-lg-5">
										<div
											style={{
												position: "sticky",
												top: 120,
												padding: "24px 22px",
												borderRadius: 18,
												background: "#fff",
												border: "1px solid rgba(78,43,90,0.12)",
												boxShadow: "0 14px 34px rgba(30,21,40,0.08)",
											}}
										>
											<p style={{ margin: "0 0 8px", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#6a4082" }}>
												Need support?
											</p>
											<h4 style={{ margin: "0 0 12px", color: "#1e1528", fontFamily: "var(--grotesk), sans-serif" }}>
												Concierge & protocol desk
											</h4>
											<p style={{ margin: "0 0 16px", color: "rgba(30,21,40,0.75)", lineHeight: 1.6 }}>
												Support for visiting delegations, official guests, speakers, and partner teams.
											</p>
											<div className="d-flex flex-wrap gap-2">
												<Link href="/contact/" className="vl-btn1">
													<span className="demo">Contact support team</span>
												</Link>
												<Link
													href="/event/register/"
													className="vl-btn1 event-btn-secondary"
												>
													<span className="demo">Complete registration</span>
												</Link>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<style jsx global>{`
				.event-speaker-chip {
					display: inline-flex;
					align-items: center;
					min-height: 30px;
					padding: 0 12px;
					border-radius: 999px;
					background: rgba(78, 43, 90, 0.08);
					border: 1px solid rgba(78, 43, 90, 0.14);
					font-size: 0.76rem;
					font-weight: 600;
					color: #412650;
				}
				.event-btn-secondary.vl-btn1 {
					background: rgba(78, 43, 90, 0.12);
					color: #4e2b5a;
					border: 1px solid rgba(78, 43, 90, 0.2);
				}
				.event-btn-secondary.vl-btn1:hover {
					background: rgba(78, 43, 90, 0.2);
					color: #3a1f47;
				}
			`}</style>
		</Layout>
	)
}
