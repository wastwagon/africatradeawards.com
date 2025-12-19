'use client'
import Link from 'next/link'

export default function MediaSection() {
	return (
		<>
			<div className="elegant-media-section">
				<div className="container">
					<div className="row">
						<div className="col-lg-8 m-auto">
							<div className="section-header text-center">
								<h2 className="section-title">Official Communications Hub</h2>
								<div className="space16" />
								<p className="section-description">Access press releases, photo galleries, livestream links, and media accreditation information.</p>
							</div>
						</div>
					</div>
					<div className="space32" />
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
				</div>
			</div>
		</>
	)
}
