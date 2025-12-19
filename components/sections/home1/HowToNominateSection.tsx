'use client'

const processSteps = [
	{
		number: '01',
		title: 'Eligibility & Submission',
		description: 'Nominations open to individuals, enterprises, and institutions across Africa. All submissions must meet eligibility criteria and include required documentation.',
		icon: 'fa-file-circle-check'
	},
	{
		number: '02',
		title: 'Documentation Requirements',
		description: 'Each nomination must include: profile summary (max 500 words), achievements and measurable outcomes, endorsements or references, and supporting evidence.',
		icon: 'fa-folder-tree'
	},
	{
		number: '03',
		title: 'Screening & Verification',
		description: 'All nominations undergo initial screening for completeness and eligibility. Independent verification partner reviews all submissions for authenticity.',
		icon: 'fa-shield-halved'
	},
	{
		number: '04',
		title: 'Evaluation & Scoring',
		description: 'Multidisciplinary Jury Board evaluates each nomination based on criteria: Innovation, Impact, Sustainability, AfCFTA Contribution, and Ethics.',
		icon: 'fa-chart-line'
	},
	{
		number: '05',
		title: 'Independent Audit & Ratification',
		description: 'Forvis Mazars Ghana conducts independent audit of evaluation process and results. Oversight Board ratifies final decisions.',
		icon: 'fa-stamp'
	},
	{
		number: '06',
		title: 'Finalist Announcement',
		description: 'Finalists are announced through official channels. All finalists are invited to the Awards Gala Night.',
		icon: 'fa-award'
	}
]

export default function HowToNominateSection() {
	return (
		<>
			<div className="about1-section-area nomination-process-section">
				<div className="container">
					<div className="row">
						<div className="col-lg-8 m-auto">
							<div className="heading2 text-center">
								<h2 className="text-anime-style-3 premium-section-title">Rigorous Multi-Stage Evaluation</h2>
								<div className="space12" />
								<p className="premium-section-description" data-aos="fade-up" data-aos-duration={900}>Our nomination process ensures credibility, fairness, and transparency through a rigorous multi-stage evaluation system, independently audited by Forvis Mazars Ghana.</p>
							</div>
						</div>
					</div>
					<div className="space50" />
				</div>

				{/* Timeline Grid */}
				<div className="timeline-grid-section">
					<div className="container">
						<div className="row">
							{processSteps.map((step, index) => (
								<div key={index} className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-duration={800 + (index * 100)}>
									<div className="timeline-step-card">
										<div className="step-node">
											<div className="node-circle">
												<div className="node-icon">
													<i className={`fa-solid ${step.icon}`}></i>
												</div>
											</div>
											<div className="node-number">{step.number}</div>
										</div>
										<div className="step-content">
											<h3 className="step-title">{step.title}</h3>
											<p className="step-description">{step.description}</p>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

			</div>
		</>
	)
}

