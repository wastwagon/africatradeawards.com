import Image from "next/image"
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import PublicPageHero from '@/components/sections/PublicPageHero'

const posts = [
	{ title: "Africa Trade Awards 2026: Recognition with measurable impact", image: "/assets/img/all-images/memory/memory-img7.png", date: "26 Jan 2026" },
	{ title: "How nomination and validation workflows preserve credibility", image: "/assets/img/all-images/memory/memory-img8.png", date: "21 Jan 2026" },
	{ title: "Building trust in public voting: verification and transparency", image: "/assets/img/all-images/memory/memory-img9.png", date: "18 Jan 2026" },
	{ title: "Why trade awards must connect policy, industry, and enterprise", image: "/assets/img/all-images/memory/memory-img4.png", date: "14 Jan 2026" },
	{ title: "Inside the committee framework for tiered recognition", image: "/assets/img/all-images/memory/memory-img11.png", date: "10 Jan 2026" },
	{ title: "Event-week essentials for delegates, partners, and media", image: "/assets/img/all-images/memory/memory-img6.png", date: "05 Jan 2026" },
]

export default function Blog() {
	return (
		<Layout>
			<div>
				<PublicPageHero title="Insights & Updates" currentLabel="Blog" />

				<div className="bloginner-section-area sp1">
					<div className="container">
						<div className="row">
							{posts.map((post, index) => (
								<div key={post.title} className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-duration={700} data-aos-delay={index * 80}>
									<div className="blog4-boxarea">
										<div className="img1">
											<Image src={post.image} alt={post.title} width={900} height={600} />
										</div>
										<div className="content-area">
											<ul>
												<li>
													<span><Image src="/assets/img/icons/calender1.svg" alt="" width={18} height={18} />{post.date}</span>
												</li>
											</ul>
											<div className="space20" />
											<Link href="/blog-single">{post.title}</Link>
											<div className="space24" />
											<Link href="/blog-single" className="readmore">Read article <i className="fa-solid fa-arrow-right" /></Link>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</Layout>
	)
}