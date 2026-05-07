'use client'

import Link from 'next/link'

const planningCards = [
	{
		title: 'Passes & access',
		copy: 'Executive, delegate, and partner pathways with dedicated check-in lanes and managed guest services.',
		icon: 'fa-solid fa-ticket',
	},
	{
		title: 'Travel & concierge',
		copy: 'Preferred hotel guidance, airport transfer coordination, and support for visiting delegations.',
		icon: 'fa-solid fa-plane-departure',
	},
	{
		title: 'Dress & protocol',
		copy: 'Business formal for summit sessions; black tie or national formal for gala recognition.',
		icon: 'fa-solid fa-user-tie',
	},
	{
		title: 'VIP & media desk',
		copy: 'On-site coordination for interviews, official photography windows, and accredited media teams.',
		icon: 'fa-solid fa-camera-retro',
	},
] as const

export default function PremiumAttendanceSection() {
	return (
		<section className="premium-attendance" aria-labelledby="premium-attendance-heading">
			<div className="container">
				<div className="premium-attendance__head text-center">
					<p className="premium-attendance__eyebrow">Attendance planning</p>
					<h2 id="premium-attendance-heading" className="premium-attendance__title">
						Executive-level guest experience from arrival to gala night
					</h2>
					<p className="premium-attendance__intro">
						Designed for regional leaders, institutions, founders, and media. Prepare early so your delegation can move
						seamlessly across summit sessions, private networking rooms, and the main-stage programme.
					</p>
				</div>

				<div className="row g-4">
					{planningCards.map((card) => (
						<div key={card.title} className="col-md-6 col-xl-3 d-flex">
							<article className="premium-attendance__card">
								<div className="premium-attendance__icon" aria-hidden>
									<i className={card.icon} />
								</div>
								<h3>{card.title}</h3>
								<p>{card.copy}</p>
							</article>
						</div>
					))}
				</div>

				<div className="premium-attendance__actions">
					<Link href="/event/" className="premium-attendance__btn premium-attendance__btn-primary">
						Review full programme
					</Link>
					<Link href="/event/register/" className="premium-attendance__btn premium-attendance__btn-secondary">
						Secure your place
					</Link>
				</div>
			</div>

			<style jsx>{`
				.premium-attendance {
					padding: 64px 0 72px;
					background: linear-gradient(180deg, #fcf9f5 0%, #f4edf6 100%);
				}
				.premium-attendance__head {
					max-width: 780px;
					margin: 0 auto 40px;
				}
				.premium-attendance__eyebrow {
					margin: 0 0 10px;
					font-size: 0.74rem;
					font-weight: 700;
					letter-spacing: 0.2em;
					text-transform: uppercase;
					color: #6a4082;
				}
				.premium-attendance__title {
					margin: 0 0 14px;
					font-family: var(--grotesk), sans-serif;
					font-size: clamp(1.6rem, 3.2vw, 2.25rem);
					font-weight: 700;
					line-height: 1.2;
					color: #1d1427;
				}
				.premium-attendance__intro {
					margin: 0;
					font-size: 1rem;
					line-height: 1.65;
					color: rgba(29, 20, 39, 0.75);
				}
				.premium-attendance__card {
					width: 100%;
					height: 100%;
					padding: 24px 22px;
					border-radius: 16px;
					background: #fff;
					border: 1px solid rgba(106, 64, 130, 0.12);
					box-shadow: 0 14px 34px rgba(30, 21, 40, 0.08);
				}
				.premium-attendance__icon {
					width: 44px;
					height: 44px;
					display: inline-flex;
					align-items: center;
					justify-content: center;
					border-radius: 12px;
					background: linear-gradient(135deg, rgba(232, 200, 154, 0.42), rgba(106, 64, 130, 0.2));
					color: #4e2b5a;
					margin-bottom: 14px;
				}
				.premium-attendance__card h3 {
					margin: 0 0 10px;
					font-size: 1.05rem;
					font-weight: 700;
					color: #1d1427;
				}
				.premium-attendance__card p {
					margin: 0;
					font-size: 0.95rem;
					line-height: 1.55;
					color: rgba(29, 20, 39, 0.74);
				}
				.premium-attendance__actions {
					display: flex;
					flex-wrap: wrap;
					gap: 12px;
					justify-content: center;
					margin-top: 30px;
				}
				.premium-attendance__btn {
					display: inline-flex;
					align-items: center;
					justify-content: center;
					min-height: 44px;
					padding: 0 20px;
					border-radius: 999px;
					text-decoration: none;
					font-size: 0.78rem;
					font-weight: 700;
					letter-spacing: 0.07em;
					text-transform: uppercase;
				}
				.premium-attendance__btn-primary {
					color: #fff;
					background: linear-gradient(135deg, #4e2b5a 0%, #6a3f84 100%);
				}
				.premium-attendance__btn-secondary {
					color: #3a2448;
					background: rgba(255, 255, 255, 0.9);
					border: 1px solid rgba(78, 43, 90, 0.24);
				}
			`}</style>
		</section>
	)
}
