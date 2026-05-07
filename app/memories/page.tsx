import Image from "next/image"
import Countdown from '@/components/elements/Countdown'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import PublicPageHero from '@/components/sections/PublicPageHero'
import { galleryImages } from '@/data/gallery'
export default function Memories() {
	const memoryImages = galleryImages.slice(0, 9)

	return (
		<>

			<Layout>
				<div>
					<PublicPageHero
						title="Recent Memories"
						currentLabel="Recent Memories"
						subtitle="A curated visual archive of key moments from the summit and awards experience."
						useVideo={false}
					/>
					{/*===== HERO AREA ENDS =======*/}
					{/*===== MEMORY AREA STARTS =======*/}
					<div className="memory-inner-section-area sp1">
						<div className="container">
							<div className="row">
								{memoryImages.map((image, index) => (
									<div key={image} className="col-lg-4 col-md-6">
										<div className="memory3-boxarea">
											<div className="img1">
												<Image src={image} alt={`Africa Trade Awards memory ${index + 1}`} width={800} height={600} />
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
								))}
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
				<style jsx global>{`
					.inner-page-header {
						background:
							linear-gradient(135deg, rgba(22, 15, 29, 0.88) 0%, rgba(78, 43, 90, 0.78) 42%, rgba(201, 160, 99, 0.32) 100%),
							url('/assets/img/all-images/hero/hero-bg1.png') center/cover no-repeat;
					}
					.memory-inner-section-area {
						background: linear-gradient(180deg, #f8f3ec 0%, #f2ecf6 100%);
					}
					.memory-inner-section-area .memory3-boxarea .content-area {
						background: linear-gradient(90deg, #4e2b5a 0%, #6a3f84 52%, #c9a063 100%);
					}
					.memory-inner-section-area .memory3-boxarea .content-area p {
						color: rgba(255, 255, 255, 0.82);
					}
					.memory-inner-section-area .memory3-boxarea .content-area a {
						color: #fff;
					}
					.memory-inner-section-area .memory3-boxarea .content-area .plus a {
						background: #fff;
						color: #4e2b5a;
					}
				`}</style>

			</Layout>
		</>
	)
}