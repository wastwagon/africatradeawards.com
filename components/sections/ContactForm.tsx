'use client'
import { useState } from 'react'

const inquiryTypes = [
	{ value: 'general', label: 'General Inquiry', icon: 'fa-envelope' },
	{ value: 'partnership', label: 'Partnership', icon: 'fa-handshake' },
	{ value: 'media', label: 'Media Inquiry', icon: 'fa-newspaper' },
	{ value: 'nomination', label: 'Nomination Support', icon: 'fa-file-circle-check' },
	{ value: 'awards', label: 'Awards Information', icon: 'fa-trophy' },
	{ value: 'event', label: 'Event Information', icon: 'fa-calendar' },
	{ value: 'other', label: 'Other', icon: 'fa-circle-question' }
]

export default function ContactForm() {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		inquiryType: 'general',
		subject: '',
		message: ''
	})
	const [errors, setErrors] = useState<{ [key: string]: string }>({})
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

	const validateForm = () => {
		const newErrors: { [key: string]: string } = {}

		if (!formData.name.trim()) {
			newErrors.name = 'Name is required'
		}

		if (!formData.email.trim()) {
			newErrors.email = 'Email is required'
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			newErrors.email = 'Please enter a valid email address'
		}

		if (!formData.phone.trim()) {
			newErrors.phone = 'Phone number is required'
		} else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
			newErrors.phone = 'Please enter a valid phone number'
		}

		if (!formData.subject.trim()) {
			newErrors.subject = 'Subject is required'
		}

		if (!formData.message.trim()) {
			newErrors.message = 'Message is required'
		} else if (formData.message.trim().length < 10) {
			newErrors.message = 'Message must be at least 10 characters'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
		// Clear error when user starts typing
		if (errors[name] || errors._form) {
			setErrors(prev => {
				const newErrors = { ...prev }
				delete newErrors[name]
				delete newErrors._form
				return newErrors
			})
		}
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (!validateForm()) {
			return
		}

		const formEl = e.currentTarget
		const hp = (formEl.elements.namedItem('website') as HTMLInputElement | null)?.value ?? ''

		setIsSubmitting(true)
		setSubmitStatus('idle')
		setErrors({})

		try {
			const res = await fetch('/api/site/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: formData.name,
					email: formData.email,
					phone: formData.phone,
					inquiryType: formData.inquiryType,
					subject: formData.subject,
					message: formData.message,
					website: hp,
				}),
			})
			const data = await res.json().catch(() => ({}))
			if (!res.ok) {
				setErrors({
					_form: typeof data.error === 'string' ? data.error : 'Something went wrong. Please try again.',
				})
				return
			}
			setSubmitStatus('success')
			setFormData({
				name: '',
				email: '',
				phone: '',
				inquiryType: 'general',
				subject: '',
				message: '',
			})
			setTimeout(() => setSubmitStatus('idle'), 4000)
		} catch {
			setErrors({ _form: 'Network error. Check your connection and try again.' })
		} finally {
			setIsSubmitting(false)
		}
	}

	const selectedInquiryType = inquiryTypes.find(type => type.value === formData.inquiryType)

	return (
		<div className="premium-contact-form-section">
			<div className="container">
				<div className="row">
					<div className="col-lg-10 m-auto">
						<div className="premium-contact-form-wrapper">
							<div className="form-header">
								<div className="heading2 text-center">
									<h5 data-aos="fade-up" data-aos-duration={800}>Send Us a Message</h5>
									<div className="space16" />
									<p data-aos="fade-up" data-aos-duration={900}>
										Have questions or want to learn more? Fill out the form below and we&apos;ll get back to you as soon as possible.
									</p>
								</div>
							</div>

							<form className="premium-contact-form" onSubmit={handleSubmit}>
								<input type="text" name="website" tabIndex={-1} autoComplete="off" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} aria-hidden />
								{errors._form ? (
									<div className="form-group" style={{ marginBottom: 16 }}>
										<span className="error-message" role="alert">
											{errors._form}
										</span>
									</div>
								) : null}
								<div className="form-row">
									<div className="form-group col-md-6">
										<label htmlFor="name">
											<i className="fa-solid fa-user"></i>
											<span>Full Name *</span>
										</label>
										<input
											type="text"
											id="name"
											name="name"
											value={formData.name}
											onChange={handleChange}
											className={errors.name ? 'error' : ''}
											placeholder="Enter your full name"
										/>
										{errors.name && <span className="error-message">{errors.name}</span>}
									</div>

									<div className="form-group col-md-6">
										<label htmlFor="email">
											<i className="fa-solid fa-envelope"></i>
											<span>Email Address *</span>
										</label>
										<input
											type="email"
											id="email"
											name="email"
											value={formData.email}
											onChange={handleChange}
											className={errors.email ? 'error' : ''}
											placeholder="your.email@example.com"
										/>
										{errors.email && <span className="error-message">{errors.email}</span>}
									</div>
								</div>

								<div className="form-row">
									<div className="form-group col-md-6">
										<label htmlFor="phone">
											<i className="fa-solid fa-phone"></i>
											<span>Phone Number *</span>
										</label>
										<input
											type="tel"
											id="phone"
											name="phone"
											value={formData.phone}
											onChange={handleChange}
											className={errors.phone ? 'error' : ''}
											placeholder="+233 55 401 4753"
										/>
										{errors.phone && <span className="error-message">{errors.phone}</span>}
									</div>

									<div className="form-group col-md-6">
										<label htmlFor="inquiryType">
											<i className={`fa-solid ${selectedInquiryType?.icon || 'fa-circle-question'}`}></i>
											<span>Inquiry Type *</span>
										</label>
										<div className="select-wrapper">
											<select
												id="inquiryType"
												name="inquiryType"
												value={formData.inquiryType}
												onChange={handleChange}
											>
												{inquiryTypes.map((type) => (
													<option key={type.value} value={type.value}>
														{type.label}
													</option>
												))}
											</select>
											<i className="fa-solid fa-chevron-down select-arrow"></i>
										</div>
									</div>
								</div>

								<div className="form-group">
									<label htmlFor="subject">
										<i className="fa-solid fa-tag"></i>
										<span>Subject *</span>
									</label>
									<input
										type="text"
										id="subject"
										name="subject"
										value={formData.subject}
										onChange={handleChange}
										className={errors.subject ? 'error' : ''}
										placeholder="What is your inquiry about?"
									/>
									{errors.subject && <span className="error-message">{errors.subject}</span>}
								</div>

								<div className="form-group">
									<label htmlFor="message">
										<i className="fa-solid fa-message"></i>
										<span>Message *</span>
									</label>
									<textarea
										id="message"
										name="message"
										value={formData.message}
										onChange={handleChange}
										className={errors.message ? 'error' : ''}
										placeholder="Please provide details about your inquiry..."
										rows={6}
										maxLength={500}
									/>
									<div className={`char-count ${formData.message.length > 450 ? 'warning' : ''}`}>
										{formData.message.length} / 500 characters
									</div>
									{errors.message && <span className="error-message">{errors.message}</span>}
								</div>

								<div className="form-submit-wrapper">
									<button
										type="submit"
										className={`premium-submit-btn ${isSubmitting ? 'submitting' : ''} ${submitStatus === 'success' ? 'success' : ''}`}
										disabled={isSubmitting}
									>
										{isSubmitting ? (
											<>
												<i className="fa-solid fa-spinner fa-spin"></i>
												<span>Sending...</span>
											</>
										) : submitStatus === 'success' ? (
											<>
												<i className="fa-solid fa-check"></i>
												<span>Message Sent!</span>
											</>
										) : (
											<>
												<span>Send Message</span>
												<i className="fa-solid fa-paper-plane"></i>
											</>
										)}
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
