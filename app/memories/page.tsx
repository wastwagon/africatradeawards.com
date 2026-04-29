import Image from "next/image"
import Countdown from '@/components/elements/Countdown'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import PublicPageHero from '@/components/sections/PublicPageHero'
export default function Memories() {

	return (
		<>

			<Layout>
				<div>
					<PublicPageHero
						title="Recent Memories"
						currentLabel="Recent Memories"
						subtitle="A curated visual archive of key moments from the summit and awards experience."
					/>
					{/*===== HERO AREA ENDS =======*/}
					{/*===== MEMORY AREA STARTS =======*/}
					<div className="memory-inner-section-area sp1">
						<div className="container">
							<div className="row">
								<div className="col-lg-4 col-md-6">
									<div className="memory3-boxarea">
										<div className="img1">
											<Image src="/assets/img/all-images/memory/memory-img4.png" alt="" width={800} height={600} />
										</div>
										<div className="content-area">
											<p>Africa Trade Awards 2026</p>
											<div className="space12" />
											<Link href="/event-single">Awards Night Highlights</Link>
											<div className="plus">
												<Link href="/event-single"><i className="fa-solid fa-plus" /></Link>
											</div>
										</div>
									</div>
								</div>
								<div className="col-lg-4 col-md-6">
									<div className="memory3-boxarea">
										<div className="img1">
											<Image src="/assets/img/all-images/memory/memory-img5.png" alt="" width={800} height={600} />
										</div>
										<div className="content-area">
											<p>Africa Trade Awards 2026</p>
											<div className="space12" />
											<Link href="/event-single">Awards Night Highlights</Link>
											<div className="plus">
												<Link href="/event-single"><i className="fa-solid fa-plus" /></Link>
											</div>
										</div>
									</div>
								</div>
								<div className="col-lg-4 col-md-6">
									<div className="memory3-boxarea">
										<div className="img1">
											<Image src="/assets/img/all-images/memory/memory-img6.png" alt="" width={800} height={600} />
										</div>
										<div className="content-area">
											<p>Africa Trade Awards 2026</p>
											<div className="space12" />
											<Link href="/event-single">Awards Night Highlights</Link>
											<div className="plus">
												<Link href="/event-single"><i className="fa-solid fa-plus" /></Link>
											</div>
										</div>
									</div>
								</div>
								<div className="col-lg-4 col-md-6">
									<div className="memory3-boxarea">
										<div className="img1">
											<Image src="/assets/img/all-images/memory/memory-img7.png" alt="" width={800} height={600} />
										</div>
										<div className="content-area">
											<p>Africa Trade Awards 2026</p>
											<div className="space12" />
											<Link href="/event-single">Awards Night Highlights</Link>
											<div className="plus">
												<Link href="/event-single"><i className="fa-solid fa-plus" /></Link>
											</div>
										</div>
									</div>
								</div>
								<div className="col-lg-4 col-md-6">
									<div className="memory3-boxarea">
										<div className="img1">
											<Image src="/assets/img/all-images/memory/memory-img8.png" alt="" width={800} height={600} />
										</div>
										<div className="content-area">
											<p>Africa Trade Awards 2026</p>
											<div className="space12" />
											<Link href="/event-single">Awards Night Highlights</Link>
											<div className="plus">
												<Link href="/event-single"><i className="fa-solid fa-plus" /></Link>
											</div>
										</div>
									</div>
								</div>
								<div className="col-lg-4 col-md-6">
									<div className="memory3-boxarea">
										<div className="img1">
											<Image src="/assets/img/all-images/memory/memory-img9.png" alt="" width={800} height={600} />
										</div>
										<div className="content-area">
											<p>Africa Trade Awards 2026</p>
											<div className="space12" />
											<Link href="/event-single">Awards Night Highlights</Link>
											<div className="plus">
												<Link href="/event-single"><i className="fa-solid fa-plus" /></Link>
											</div>
										</div>
									</div>
								</div>
								<div className="col-lg-4 col-md-6">
									<div className="memory3-boxarea">
										<div className="img1">
											<Image src="/assets/img/all-images/memory/memory-img10.png" alt="" width={800} height={600} />
										</div>
										<div className="content-area">
											<p>Africa Trade Awards 2026</p>
											<div className="space12" />
											<Link href="/event-single">Awards Night Highlights</Link>
											<div className="plus">
												<Link href="/event-single"><i className="fa-solid fa-plus" /></Link>
											</div>
										</div>
									</div>
								</div>
								<div className="col-lg-4 col-md-6">
									<div className="memory3-boxarea">
										<div className="img1">
											<Image src="/assets/img/all-images/memory/memory-img11.png" alt="" width={800} height={600} />
										</div>
										<div className="content-area">
											<p>Africa Trade Awards 2026</p>
											<div className="space12" />
											<Link href="/event-single">Awards Night Highlights</Link>
											<div className="plus">
												<Link href="/event-single"><i className="fa-solid fa-plus" /></Link>
											</div>
										</div>
									</div>
								</div>
								<div className="col-lg-4 col-md-6">
									<div className="memory3-boxarea">
										<div className="img1">
											<Image src="/assets/img/all-images/memory/memory-img12.png" alt="" width={800} height={600} />
										</div>
										<div className="content-area">
											<p>Africa Trade Awards 2026</p>
											<div className="space12" />
											<Link href="/event-single">Awards Night Highlights</Link>
											<div className="plus">
												<Link href="/event-single"><i className="fa-solid fa-plus" /></Link>
											</div>
										</div>
									</div>
								</div>
								<div className="space30" />
								<div className="pagination-area">
									<nav aria-label="Page navigation example">
										<ul className="pagination">
											<li className="page-item">
												<Link className="page-link" href="/#" aria-label="Previous">
													<i className="fa-solid fa-angle-left" />
												</Link>
											</li>
											<li className="page-item"><Link className="page-link active" href="/#">1</Link></li>
											<li className="page-item"><Link className="page-link" href="/#">2</Link></li>
											<li className="page-item"><Link className="page-link" href="/#">...</Link></li>
											<li className="page-item"><Link className="page-link" href="/#">12</Link></li>
											<li className="page-item">
												<Link className="page-link" href="/#" aria-label="Next">
													<i className="fa-solid fa-angle-right" />
												</Link>
											</li>
										</ul>
									</nav>
								</div>
							</div>
						</div>
					</div>
					{/*===== MEMORY AREA ENDS =======*/}
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