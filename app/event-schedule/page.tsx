import Image from "next/image"
import Countdown from '@/components/elements/Countdown'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
export default function EventSchedule() {

	return (
		<>

			<Layout>
				<div>
					<div className="inner-page-header" style={{ backgroundImage: 'url(assets/img/bg/header-bg10.png)' }}>
						<div className="container">
							<div className="row">
								<div className="col-lg-6 m-auto">
									<div className="heading1 text-center">
										<div className="space20" />
										<Link href="/"><span className="breadcrumb-home">Home</span> <i className="fa-solid fa-angle-right" /> <span className="breadcrumb-current">Event Schedule</span></Link>
									</div>
								</div>
							</div>
						</div>
					</div>
					{/*===== HERO AREA ENDS =======*/}
					{/*===== OTHERS AREA STARTS =======*/}
					<div className="choose-section-area sp2">
						<div className="container">
							<div className="row">
								<div className="col-lg-8 m-auto">
									<div className="modern-section-header text-center space-margin60">
										<span className="section-accent-label" data-aos="fade-up" data-aos-duration={800}>Schedule</span>
										<div className="space20" />
										<h2 className="modern-section-title" data-aos="fade-up" data-aos-duration={900}>Event Schedule</h2>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-lg-4 col-md-6">
									<div className="choose-widget-boxarea">
										<div className="icons">
											<Image src="/assets/img/icons/choose-icons1.svg" alt="" width={52} height={52} />
										</div>
										<div className="space24" />
										<div className="content-area">
											<Link href="/event-single">Make Ideas Happen</Link>
											<div className="space16" />
											<p>Africa Trade Awards 2026 brings together the brightest minds and industry leaders for a transformative business experience.</p>
											<div className="space24" />
											<Link href="/event-single" className="readmore">Read More <i className="fa-solid fa-arrow-right" /></Link>
										</div>
									</div>
								</div>
								<div className="col-lg-4 col-md-6">
									<div className="choose-widget-boxarea">
										<div className="icons">
											<Image src="/assets/img/icons/choose-icons1.svg" alt="" width={52} height={52} />
										</div>
										<div className="space24" />
										<div className="content-area">
											<Link href="/event-single">Great Speakers</Link>
											<div className="space16" />
											<p>Whether you&apos;re looking to elevate your business strategy, discover the latest industry trends, or connect.</p>
											<div className="space24" />
											<Link href="/event-single" className="readmore">Read More <i className="fa-solid fa-arrow-right" /></Link>
										</div>
									</div>
								</div>
								<div className="col-lg-4 col-md-6">
									<div className="choose-widget-boxarea">
										<div className="icons">
											<Image src="/assets/img/icons/choose-icons1.svg" alt="" width={52} height={52} />
										</div>
										<div className="space24" />
										<div className="content-area">
											<Link href="/event-single">One Day Ticket</Link>
											<div className="space16" />
											<p>We empower businesses to thrive in an ever-evolving marketplace. This conference more than just an event.</p>
											<div className="space24" />
											<Link href="/event-single" className="readmore">Read More <i className="fa-solid fa-arrow-right" /></Link>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					{/*===== OTHERS AREA ENDS =======*/}
					{/*===== EVENT AREA STARTS =======*/}
					<div className="schedule-section-area sp10">
						<div className="container">
							<div className="row">
								<div className="col-lg-11 m-auto">
									<div className="schedule">
										<table>
											<thead>
												<tr>
													<th>Time</th>
													<th>Friday</th>
													<th>Saturday</th>
													<th>Sunday</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td>09:00-10:00 AM</td>
													<td>Awards Session<br /><span className="breadcrumb-current">By Awards Secretariat</span></td>
													<td>Programme Session<br /><span className="breadcrumb-current">By Awards Secretariat</span></td>
													<td>Programme Session<br /><span className="breadcrumb-current">By Awards Secretariat</span></td>
												</tr>
												<tr>
													<td>09:00-10:00 AM</td>
													<td>Programme Session<br /><span className="breadcrumb-current">By Awards Secretariat</span></td>
													<td>Awards Session<br /><span className="breadcrumb-current">By Awards Secretariat</span></td>
													<td>Awards Session<br /><span className="breadcrumb-current">By Awards Secretariat</span></td>
												</tr>
												<tr>
													<td>09:00-10:00 AM</td>
													<td>Awards Session<br /><span className="breadcrumb-current">By Awards Secretariat</span></td>
													<td>Programme Session<br /><span className="breadcrumb-current">By Awards Secretariat</span></td>
													<td>Programme Session<br /><span className="breadcrumb-current">By Awards Secretariat</span></td>
												</tr>
												<tr>
													<td>09:00-10:00 AM</td>
													<td>Programme Session<br /><span className="breadcrumb-current">By Awards Secretariat</span></td>
													<td>Awards Session<br /><span className="breadcrumb-current">By Awards Secretariat</span></td>
													<td>Awards Session<br /><span className="breadcrumb-current">By Awards Secretariat</span></td>
												</tr>
												<tr>
													<td>09:00-10:00 AM</td>
													<td>Awards Session<br /><span className="breadcrumb-current">By Awards Secretariat</span></td>
													<td>Programme Session<br /><span className="breadcrumb-current">By Awards Secretariat</span></td>
													<td>Programme Session<br /><span className="breadcrumb-current">By Awards Secretariat</span></td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
					</div>
					{/*===== EVENT AREA ENDS =======*/}
					{/*===== CTA AREA STARTS =======*/}
					<div className="cta1-section-area d-lg-block d-block">
						<div className="container">
							<div className="row">
								<div className="col-lg-10 m-auto">
									<div className="cta1-main-boxarea">
										<div className="timer-btn-area">
										<Countdown />
											<div className="btn-area1">
												<Link href="/event/register" className="vl-btn1">Buy Ticket</Link>
											</div>
										</div>
										<ul>
											<li>
												<Link href="/#"><Image src="/assets/img/icons/calender1.svg" alt="" width={18} height={18} />28th and 29th January 2026 - 6pm to 11:30pm</Link>
											</li>
											<li className="m-0">
												<Link href="/#"><Image src="/assets/img/icons/location1.svg" alt="" width={18} height={18} />Kempinski Gold Coast City Hotel, Accra</Link>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>
					{/*===== CTA AREA ENDS =======*/}
					{/*===== CTA AREA STARTS =======*/}
					<div className="cta1-section-area d-lg-none d-block">
						<div className="container">
							<div className="row">
								<div className="col-lg-10 m-auto">
									<div className="cta1-main-boxarea">
										<div className="timer-btn-area">
										<Countdown />
											<div className="btn-area1">
												<Link href="/event/register" className="vl-btn1">Buy Ticket</Link>
											</div>
										</div>
										<ul>
											<li>
												<Link href="/#"><Image src="/assets/img/icons/calender1.svg" alt="" width={18} height={18} />28th and 29th January 2026 - 6pm to 11:30pm</Link>
											</li>
											<li className="m-0">
												<Link href="/#"><Image src="/assets/img/icons/location1.svg" alt="" width={18} height={18} />Kempinski Gold Coast City Hotel, Accra</Link>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

			</Layout>
		</>
	)
}