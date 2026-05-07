'use client'

const stats = [
	{ label: 'Years hosting the celebration', value: '12+' },
	{ label: 'Stories submitted for recognition', value: '1,350+' },
	{ label: 'Experts shaping the outcome', value: '18+' },
	{ label: 'Partners bringing the stage to life', value: '80+' },
] as const

export default function KudosStatsSection() {
	return (
		<section className="kudos-stats-section" aria-labelledby="kudos-stats-heading">
			<div className="container">
				<div className="kudos-stats-head text-center" data-aos="fade-up" data-aos-duration={650}>
					<p className="kudos-stats-eyebrow">At a glance</p>
					<h2 id="kudos-stats-heading" className="kudos-stats-title">
						The celebration at scale
					</h2>
					<p className="kudos-stats-intro">
						Moments, voices, and schedules tell the human story — these numbers capture how large the movement has become.
					</p>
				</div>
				<div className="kudos-stats-grid">
					{stats.map((stat) => (
						<div key={stat.label} className="kudos-stat-card" data-aos="fade-up" data-aos-duration={700}>
							<p className="kudos-stat-value">{stat.value}</p>
							<p className="kudos-stat-label">{stat.label}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
