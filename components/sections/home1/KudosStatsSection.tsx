'use client'

const stats = [
	{ label: 'Years of ecosystem leadership', value: '12+' },
	{ label: 'Nominations and programme entries', value: '1,350+' },
	{ label: 'Industry experts and committee members', value: '18+' },
	{ label: 'Partners and sponsors engaged', value: '80+' },
] as const

export default function KudosStatsSection() {
	return (
		<section className="kudos-stats-section" aria-label="Awards impact highlights">
			<div className="container">
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
