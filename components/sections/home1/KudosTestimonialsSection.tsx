'use client'

const testimonials = [
	{
		name: 'Programme Partner',
		quote:
			'The platform made stakeholder coordination straightforward, from nomination intake through final recognition publishing.',
	},
	{
		name: 'Committee Member',
		quote:
			'Review workflows are clearer and faster. Evidence, scoring context, and decision tracking are all in one place.',
	},
	{
		name: 'Entrant Organisation',
		quote:
			'Submission and status tracking felt professional end-to-end. The process gave us confidence in fairness and transparency.',
	},
] as const

export default function KudosTestimonialsSection() {
	return (
		<section className="kudos-testimonials-section" aria-labelledby="kudos-testimonials-heading">
			<div className="container">
				<div className="kudos-testimonials-head text-center" data-aos="fade-up" data-aos-duration={700}>
					<p className="kudos-testimonials-eyebrow">Testimonials</p>
					<h2 id="kudos-testimonials-heading" className="kudos-testimonials-title">
						Trusted by entrants, partners, and reviewers
					</h2>
				</div>
				<div className="row g-4">
					{testimonials.map((item, index) => (
						<div key={item.name} className="col-lg-4">
							<article
								className="kudos-testimonial-card"
								data-aos="fade-up"
								data-aos-duration={700}
								data-aos-delay={index * 80}
							>
								<p className="kudos-testimonial-quote">{item.quote}</p>
								<p className="kudos-testimonial-name">{item.name}</p>
							</article>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
