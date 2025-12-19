'use client'
import Link from 'next/link'

export default function Section8() {
	return (
		<>
			<div className="elegant-media-section sp2">
				<div className="container">
					<div className="row">
						<div className="col-lg-8 m-auto">
							<div className="section-header text-center">
								<h2 className="section-title">Official Communications Hub</h2>
								<div className="space24" />
								<p className="section-description">Access press releases, photo galleries, livestream links, and media accreditation information.</p>
							</div>
						</div>
					</div>
					<div className="space60" />
					<div className="media-cards-grid">
						<div className="media-card">
							<div className="card-image-wrapper">
								<img src="/assets/img/all-images/about/about-img8.png" alt="Press Releases" />
								<div className="card-icon-overlay">
									<i className="fa-solid fa-newspaper"></i>
								</div>
							</div>
							<div className="card-content-box">
								<h6 className="card-title">Press Releases</h6>
								<p className="card-text">Latest announcements, jury updates, and nominee releases.</p>
								<Link href="/media-centre" className="card-link">
									View All
									<i className="fa-solid fa-arrow-right"></i>
								</Link>
							</div>
						</div>
						<div className="media-card">
							<div className="card-image-wrapper">
								<img src="/assets/img/all-images/about/about-img8.png" alt="Photo & Video Gallery" />
								<div className="card-icon-overlay">
									<i className="fa-solid fa-images"></i>
								</div>
							</div>
							<div className="card-content-box">
								<h6 className="card-title">Photo &amp; Video Gallery</h6>
								<p className="card-text">Visual content from launch events, gala highlights, and behind-the-scenes.</p>
								<Link href="/media-centre" className="card-link">
									View Gallery
									<i className="fa-solid fa-arrow-right"></i>
								</Link>
							</div>
						</div>
						<div className="media-card">
							<div className="card-image-wrapper">
								<img src="/assets/img/all-images/about/about-img8.png" alt="Livestream Access" />
								<div className="card-icon-overlay">
									<i className="fa-solid fa-video"></i>
								</div>
							</div>
							<div className="card-content-box">
								<h6 className="card-title">Livestream Access</h6>
								<p className="card-text">Watch the Awards Gala Night live on our website and YouTube channel.</p>
								<Link href="/media-centre" className="card-link">
									Access Live
									<i className="fa-solid fa-arrow-right"></i>
								</Link>
							</div>
						</div>
					</div>
					<div className="space40" />
					<div className="row">
						<div className="col-lg-6 m-auto">
							<div className="text-center">
								<Link href="/media-centre" className="elegant-btn">
									<span>Visit Media Centre</span>
									<i className="fa-solid fa-paper-plane"></i>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
