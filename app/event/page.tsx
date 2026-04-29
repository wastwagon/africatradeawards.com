import Image from "next/image"
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import PublicPageHero from '@/components/sections/PublicPageHero'

const sessions = [
	{
		index: "01",
		title: "Summit Opening & Continental Trade Outlook",
		time: "10:00 AM - 12:00 PM",
		location: "Kempinski Gold Coast City Hotel, Accra",
		image: "/assets/img/all-images/event/event-img4.png",
	},
	{
		index: "02",
		title: "Industry, Infrastructure & Value Chain Roundtable",
		time: "01:00 PM - 03:00 PM",
		location: "Kempinski Gold Coast City Hotel, Accra",
		image: "/assets/img/all-images/event/event-img5.png",
	},
	{
		index: "03",
		title: "Awards Gala & Recognition Ceremony",
		time: "06:00 PM - 11:30 PM",
		location: "Kempinski Gold Coast City Hotel, Accra",
		image: "/assets/img/all-images/event/event-img6.png",
	},
]

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
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-lg-10 m-auto">
								{sessions.map((session, idx) => (
									<div key={session.index} className="event2-boxarea box1" style={{ marginBottom: idx === sessions.length - 1 ? 0 : 32 }}>
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
													<div className="space24" />
													<div className="btn-area1">
														<Link href="/event/register" className="vl-btn1"><span className="demo">Register</span></Link>
													</div>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	)
}