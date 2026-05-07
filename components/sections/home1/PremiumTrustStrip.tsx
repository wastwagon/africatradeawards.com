'use client'

const trustPillars = [
	'Pan-African delegations',
	'Policy and enterprise principals',
	'Independent recognition governance',
	'Regional media and broadcast desks',
] as const

const metrics = [
	{ value: '30+', label: 'Countries represented' },
	{ value: '2 Days', label: 'Summit and gala programme' },
	{ value: '100+', label: 'Executive and institutional guests' },
] as const

export default function PremiumTrustStrip() {
	return (
		<section className="premium-trust-strip" aria-label="Event trust signals">
			<div className="container">
				<div className="premium-trust-strip__inner">
					<div className="premium-trust-strip__left">
						<p className="premium-trust-strip__eyebrow">Institutional positioning</p>
						<h3>Structured as a flagship continental convening</h3>
						<div className="premium-trust-strip__pillars">
							{trustPillars.map((pillar) => (
								<span key={pillar}>{pillar}</span>
							))}
						</div>
					</div>
					<div className="premium-trust-strip__right">
						{metrics.map((metric) => (
							<div key={metric.label} className="premium-trust-strip__metric">
								<strong>{metric.value}</strong>
								<span>{metric.label}</span>
							</div>
						))}
					</div>
				</div>
			</div>
			<style jsx>{`
				.premium-trust-strip {
					padding: 20px 0 28px;
					background: linear-gradient(180deg, #f7f1ea 0%, #f3ecf6 100%);
				}
				.premium-trust-strip__inner {
					padding: 22px 24px;
					border-radius: 16px;
					background: #fff;
					border: 1px solid rgba(78, 43, 90, 0.1);
					box-shadow: 0 14px 30px rgba(26, 18, 34, 0.08);
					display: grid;
					grid-template-columns: 1fr;
					gap: 22px;
				}
				@media (min-width: 992px) {
					.premium-trust-strip__inner {
						grid-template-columns: 1.4fr 1fr;
						align-items: center;
					}
				}
				.premium-trust-strip__eyebrow {
					margin: 0 0 6px;
					font-size: 0.7rem;
					font-weight: 700;
					letter-spacing: 0.17em;
					text-transform: uppercase;
					color: #6a4082;
				}
				.premium-trust-strip__left h3 {
					margin: 0 0 12px;
					font-family: var(--grotesk), sans-serif;
					font-size: clamp(1.1rem, 2.1vw, 1.4rem);
					color: #1d1427;
				}
				.premium-trust-strip__pillars {
					display: flex;
					flex-wrap: wrap;
					gap: 8px;
				}
				.premium-trust-strip__pillars span {
					display: inline-flex;
					align-items: center;
					min-height: 30px;
					padding: 0 11px;
					border-radius: 999px;
					font-size: 0.74rem;
					font-weight: 600;
					color: #412650;
					background: rgba(78, 43, 90, 0.08);
					border: 1px solid rgba(78, 43, 90, 0.14);
				}
				.premium-trust-strip__right {
					display: grid;
					grid-template-columns: repeat(3, minmax(0, 1fr));
					gap: 10px;
				}
				.premium-trust-strip__metric {
					padding: 12px 10px;
					border-radius: 12px;
					text-align: center;
					background: linear-gradient(145deg, rgba(120, 80, 140, 0.11), rgba(232, 200, 154, 0.15));
					border: 1px solid rgba(78, 43, 90, 0.12);
				}
				.premium-trust-strip__metric strong {
					display: block;
					font-family: var(--grotesk), sans-serif;
					font-size: 1rem;
					color: #2a1836;
				}
				.premium-trust-strip__metric span {
					display: block;
					margin-top: 2px;
					font-size: 0.72rem;
					color: rgba(29, 20, 39, 0.76);
				}
			`}</style>
		</section>
	)
}
