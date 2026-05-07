'use client'

const testimonials = [
	{
		name: 'Awards guest',
		quote:
			'The energy in the room felt electric - a real celebration of what trade can do when it is done with purpose.',
	},
	{
		name: 'Finalist team',
		quote:
			'Walking the stage was unforgettable. The production, pacing, and recognition moment felt world-class.',
	},
	{
		name: 'Partner delegate',
		quote:
			'It is rare to be in a room where policy, industry, and community show up with the same level of intent.',
	},
] as const

export default function KudosTestimonialsSection() {
	return (
		<section className="kudos-testimonials-section" aria-labelledby="kudos-testimonials-heading">
			<div className="container">
				<div className="kudos-testimonials-head text-center" data-aos="fade-up" data-aos-duration={700}>
					<p className="kudos-testimonials-eyebrow">In the room</p>
					<h2 id="kudos-testimonials-heading" className="kudos-testimonials-title">
						What people remember after the night ends
					</h2>
					<p className="kudos-testimonials-intro">
						Paths are open and the process is clear — here is what stays with guests, finalists, and partners once the lights
						go down.
					</p>
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
