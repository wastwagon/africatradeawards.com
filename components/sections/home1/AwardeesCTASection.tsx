'use client'

import Link from 'next/link'

export default function AwardeesCTASection() {
	return (
		<section className="awardees-cta-section">
			<div className="awardees-cta-bg" aria-hidden="true" />
			<div className="container awardees-cta-inner">
				<div className="row">
					<div className="col-lg-10 m-auto">
						<div className="awards-header-compact text-center awardees-cta-content" data-aos="fade-up" data-aos-duration={600}>
							<h2 className="awards-title-compact">Recognition Honours 2026</h2>
							<div className="space16" />
							<p className="awards-intro-compact">
								Individuals, institutions, and initiatives recognised for their contribution to Africa&apos;s trade and industrial landscape.
							</p>
							<div className="space24" />
							<Link href="/awardees" className="cta-btn-primary awardees-cta-btn">
								<span>View Awardees</span>
								<i className="fa-solid fa-arrow-right" />
							</Link>
						</div>
					</div>
				</div>
			</div>
			<style jsx>{`
				.awardees-cta-section {
					padding: 56px 0 64px;
					position: relative;
					overflow: hidden;
				}
				.awardees-cta-bg {
					position: absolute;
					inset: 0;
					/* Theme gradient: #4e2b5a (deep purple) + #78508c (violet) */
					background: linear-gradient(135deg,
						rgba(248, 246, 252, 1) 0%,
						rgba(240, 232, 248, 1) 22%,
						rgba(232, 220, 244, 1) 40%,
						rgba(225, 210, 240, 1) 55%,
						rgba(235, 222, 248, 1) 70%,
						rgba(242, 235, 250, 1) 85%,
						rgba(248, 244, 252, 1) 100%
					);
				}
				.awardees-cta-bg::before {
					content: '';
					position: absolute;
					inset: 0;
					background: radial-gradient(ellipse 90% 70% at 30% 10%, rgba(120, 80, 140, 0.22) 0%, transparent 55%);
					pointer-events: none;
				}
				.awardees-cta-bg::after {
					content: '';
					position: absolute;
					inset: 0;
					background: radial-gradient(ellipse 80% 60% at 85% 90%, rgba(78, 43, 90, 0.18) 0%, transparent 55%);
					pointer-events: none;
				}
				.awardees-cta-inner {
					position: relative;
					z-index: 1;
				}
				.awardees-cta-content .awards-title-compact {
					color: #2d1f33;
				}
				.awardees-cta-content .awards-intro-compact {
					color: #4a3d52;
				}
				.awardees-cta-btn {
					box-shadow: 0 4px 20px rgba(78, 43, 90, 0.35);
				}
				.awardees-cta-btn:hover {
					box-shadow: 0 8px 28px rgba(78, 43, 90, 0.45);
				}
				@media (max-width: 991px) {
					.awardees-cta-section {
						padding: 48px 0 56px;
					}
				}
				@media (max-width: 575px) {
					.awardees-cta-section {
						padding: 40px 0 48px;
					}
				}
			`}</style>
		</section>
	)
}
