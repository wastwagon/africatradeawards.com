'use client'
import Image from "next/image"
import { useState } from 'react'
import ModalVideo from 'react-modal-video'
import "@/node_modules/react-modal-video/css/modal-video.css"
import Countdown from '@/components/elements/Countdown'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import PublicPageHero from '@/components/sections/PublicPageHero'
export default function BlogSingle() {

	const [isOpen, setOpen] = useState(false)
	return (
		<>

			<Layout>
				<div>
					<PublicPageHero
						title="Editorial Detail"
						currentLabel="Blog Details"
						parentLabel="Blog"
						parentHref="/blog"
					/>
					{/*===== HERO AREA ENDS =======*/}
					{/*===== BLOG AREA STARTS =======*/}
					<div className="blog-details-section sp8">
						<div className="container">
							<div className="row">
								<div className="col-lg-8">
									<div className="blog-deatils-content heading2">
										<div className="img1">
											<Image src="/assets/img/all-images/blog/blog-img7.png" alt="" width={1200} height={700} />
										</div>
										<div className="space32" />
										<ul>
											<li>
												<Link href="/#"><Image src="/assets/img/icons/calender1.svg" alt="" width={18} height={18} />26 Jan 2025 <span className="breadcrumb-current"> | </span></Link>
											</li>
											<li>
												<Link href="/#"><Image src="/assets/img/icons/user1.svg" alt="" width={18} height={18} />Gisselle <span className="breadcrumb-current"> | </span></Link>
											</li>
											<li>
												<Link href="/#"><Image src="/assets/img/icons/comments1.svg" alt="" width={18} height={18} />2 Comments</Link>
											</li>
										</ul>
										<div className="space18" />
										<h2>Step Into the Future of Business with Africa Trade Awards</h2>
										<div className="space16" />
										<p>At Africa Trade Awards 2026, you&apos;ll join an exclusive gathering of business leaders and innovators shaping the future of their industries. This one-day conference offers dynamic sessions on leadership, technology, and strategy to help you stay ahead in today&apos;s competitive market. Whether you&apos;re looking to unlock new opportunities or build lasting partnerships, Africa Trade Awards is where you need to be.</p>
										<div className="space48" />
										<div className="row">
											<div className="col-lg-6 col-md-6">
												<div className="img1 image-anime">
													<Image src="/assets/img/all-images/blog/blog-img8.png" alt="" width={900} height={600} />
												</div>
											</div>
											<div className="col-lg-6 col-md-6">
												<div className="space30 d-md-none d-block" />
												<div className="img1 image-anime">
													<Image src="/assets/img/all-images/blog/blog-img9.png" alt="" width={900} height={600} />
												</div>
											</div>
										</div>
										<div className="space32" />
										<h3>Africa Trade Awards: Your Gateway to Strategic Growth</h3>
										<div className="space16" />
										<p>Fuel your business growth with actionable insights from world-class experts at Africa Trade Awards 2026. This premier event brings together forward-thinking professionals to explore the latest trends, technologies, and strategies for success. From keynote speeches to interactive workshops, Africa Trade Awards provides you with the tools you need.</p>
										<div className="space16" />
										<p>&ldquo;Join us at Africa Trade Awards 2026, where innovation meets opportunity. This conference is the ultimate destination for business leaders seeking to push the boundaries of what&apos;s possible. With sessions on disruptive technologies, leadership trends, and market strategies, you&apos;ll walk away with the knowledge and connections to lead.&rdquo;</p>
										<div className="space48" />
										<div className="video-btn-area">
											<div className="img1">
												<Image src="/assets/img/all-images/blog/blog-img10.png" alt="" width={1200} height={700} />
											</div>
											<div className="play">
												<a onClick={() => setOpen(true)} className="popup-youtube"><i className="fa-solid fa-play" /></a>
											</div>
										</div>
										<div className="space32" />
										<h3>Reimagine Business Possibilities at Africa Trade Awards</h3>
										<div className="space16" />
										<p>&ldquo;Africa Trade Awards 2026 is the ultimate destination for professionals eager to stay ahead in the evolving business landscape. This event brings together innovators, industry leaders, and experts to explore the future of business strategy and technology.&rdquo;</p>
										<div className="space32" />
										<div className="tags-social-area">
											<div className="tags">
												<h4>Tags:</h4>
												<ul>
													<li><Link href="/#">#Conferences</Link></li>
													<li><Link href="/#" className="m-0">#AfricaTradeAwards2026</Link></li>
												</ul>
											</div>
											<div className="social">
												<h4>Social:</h4>
												<ul>
													<li>
														<Link href="/#"><i className="fa-brands fa-facebook-f" /></Link>
													</li>
													<li>
														<Link href="/#"><i className="fa-brands fa-instagram" /></Link>
													</li>
													<li>
														<Link href="/#" className="m-0"><i className="fa-brands fa-youtube" /></Link>
													</li>
												</ul>
											</div>
										</div>
									</div>
								</div>
								<div className="col-lg-4">
									<div className="space30 d-lg-none d-block" />
									<div className="blog-auhtor-details">
										<div className="search-area">
											<h3>Search</h3>
											<div className="space24" />
											<form>
												<input type="text" placeholder="Search..." />
												<button type="submit"><i className="fa-solid fa-magnifying-glass" /></button>
											</form>
										</div>
										<div className="space32" />
										<div className="blog-categories">
											<h3>Editorial Categories</h3>
											<div className="space12" />
											<ul>
												<li>
													<Link href="/#">Trade Policy &amp; Systems <span><i className="fa-solid fa-angle-right" /></span></Link>
												</li>
												<li>
													<Link href="/#">Industry &amp; Value Chains <span><i className="fa-solid fa-angle-right" /></span></Link>
												</li>
												<li>
													<Link href="/#">Markets &amp; Enterprise <span><i className="fa-solid fa-angle-right" /></span></Link>
												</li>
												<li>
													<Link href="/#">Recognition &amp; Governance <span><i className="fa-solid fa-angle-right" /></span></Link>
												</li>
												<li>
													<Link href="/#">Summit Highlights <span><i className="fa-solid fa-angle-right" /></span></Link>
												</li>
												<li>
													<Link href="/#">Awardees &amp; Citations <span><i className="fa-solid fa-angle-right" /></span></Link>
												</li>
											</ul>
										</div>
										<div className="space32" />
										<div className="tags-area">
											<h3>Popular Hashtags</h3>
											<div className="space12" />
											<ul>
												<li><Link href="/#">#Conferences</Link></li>
												<li><Link href="/#">#AfricaTradeAwards2026</Link></li>
												<li><Link href="/#">#Event</Link></li>
											</ul>
											<ul>
												<li><Link href="/#">#AfricaTradeAwards2026</Link></li>
												<li><Link href="/#">#DigitalTransformation</Link></li>
											</ul>
											<ul>
												<li><Link href="/#">#BusinessLeadership</Link></li>
												<li><Link href="/#">#IndustryTrends</Link></li>
											</ul>
										</div>
										<div className="space32" />
										<div className="author-images-area">
											<h3>Featured Contributors</h3>
											<div className="space12" />
											<ul>
												<li><Image src="/assets/img/all-images/blog/blog-img11.png" alt="" width={80} height={80} /></li>
												<li><Image src="/assets/img/all-images/blog/blog-img12.png" alt="" width={80} height={80} /></li>
												<li><Image src="/assets/img/all-images/blog/blog-img13.png" alt="" width={80} height={80} /></li>
												<li><Image src="/assets/img/all-images/blog/blog-img14.png" alt="" width={80} height={80} /></li>
											</ul>
											<ul>
												<li><Image src="/assets/img/all-images/blog/blog-img15.png" alt="" width={80} height={80} /></li>
												<li><Image src="/assets/img/all-images/blog/blog-img16.png" alt="" width={80} height={80} /></li>
												<li><Image src="/assets/img/all-images/blog/blog-img17.png" alt="" width={80} height={80} /></li>
												<li><Image src="/assets/img/all-images/blog/blog-img18.png" alt="" width={80} height={80} /></li>
											</ul>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					{/*===== BLOG AREA ENDS =======*/}
					{/*===== BLOG AREA STARTS =======*/}
					<div className="bloginner-section-area sp1">
						<div className="container">
							<div className="row">
								<div className="col-lg-5 m-auto">
									<div className="heading2 text-center space-margin60">
										<h2>Read More Blogs</h2>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration={800}>
									<div className="blog4-boxarea">
										<div className="img1">
											<Image src="/assets/img/all-images/memory/memory-img7.png" alt="" width={900} height={600} />
										</div>
										<div className="content-area">
											<ul>
												<li>
													<Link href="/#"><Image src="/assets/img/icons/calender1.svg" alt="" width={18} height={18} />26 Jan 2025 <span className="breadcrumb-current"> | </span></Link>
												</li>
												<li>
													<Link href="/#"><Image src="/assets/img/icons/user1.svg" alt="" width={18} height={18} />Beverly</Link>
												</li>
											</ul>
											<div className="space20" />
											<Link href="/blog-single">Africa Trade Awards 2026: Unlock the Future of Business</Link>
											<div className="space24" />
											<Link href="/blog-single" className="readmore">read more <i className="fa-solid fa-arrow-right" /></Link>
											<div className="arrow">
												<Link href="/blog-single"><i className="fa-solid fa-arrow-right" /></Link>
											</div>
										</div>
									</div>
								</div>
								<div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration={1000}>
									<div className="blog4-boxarea">
										<div className="img1">
											<Image src="/assets/img/all-images/memory/memory-img8.png" alt="" width={900} height={600} />
										</div>
										<div className="content-area">
											<ul>
												<li>
													<Link href="/#"><Image src="/assets/img/icons/calender1.svg" alt="" width={18} height={18} />26 Jan 2025 <span className="breadcrumb-current"> | </span></Link>
												</li>
												<li>
													<Link href="/#"><Image src="/assets/img/icons/user1.svg" alt="" width={18} height={18} />Gisselle</Link>
												</li>
											</ul>
											<div className="space20" />
											<Link href="/blog-single">Where Vision Meets Opportunity: Africa Trade Awards 2026</Link>
											<div className="space24" />
											<Link href="/blog-single" className="readmore">read more <i className="fa-solid fa-arrow-right" /></Link>
											<div className="arrow">
												<Link href="/blog-single"><i className="fa-solid fa-arrow-right" /></Link>
											</div>
										</div>
									</div>
								</div>
								<div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration={1200}>
									<div className="blog4-boxarea">
										<div className="img1">
											<Image src="/assets/img/all-images/memory/memory-img9.png" alt="" width={900} height={600} />
										</div>
										<div className="content-area">
											<ul>
												<li>
													<Link href="/#"><Image src="/assets/img/icons/calender1.svg" alt="" width={18} height={18} />26 Jan 2025 <span className="breadcrumb-current"> | </span></Link>
												</li>
												<li>
													<Link href="/#"><Image src="/assets/img/icons/user1.svg" alt="" width={18} height={18} />Mertie</Link>
												</li>
											</ul>
											<div className="space20" />
											<Link href="/blog-single">Fuel Your Business Growth at Africa Trade Awards</Link>
											<div className="space24" />
											<Link href="/blog-single" className="readmore">read more <i className="fa-solid fa-arrow-right" /></Link>
											<div className="arrow">
												<Link href="/blog-single"><i className="fa-solid fa-arrow-right" /></Link>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					{/*===== BLOG AREA ENDS =======*/}
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
				<ModalVideo channel='youtube' isOpen={isOpen} videoId="JXMWOmuR1hU" onClose={() => setOpen(false)} />
			</Layout>
		</>
	)
}