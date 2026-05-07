'use client'

import Layout from '@/components/layout/Layout'
import Link from 'next/link'
import PublicPageHero from '@/components/sections/PublicPageHero'
import { useSiteConfig } from '@/components/site/SiteConfigProvider'
import { useCallback, useState } from 'react'
import { PRESS_BOILERPLATE_LONG, PRESS_BOILERPLATE_SHORT } from '@/data/press-boilerplate'

const HASHTAG = '#AfricaTradeAwards2026'
const MEDIA_KIT_ITEMS = [
	'Official logo (PNG)',
	'Event boilerplate (long + short copy)',
	'Core event facts (date, venue, hashtag)',
	'Press and accreditation contact paths',
] as const
const EDITORIAL_STANDARDS = [
	'Accreditation requests are handled in order of urgency and broadcast timelines.',
	'Interview windows are confirmed against speaker and finalist availability.',
	'Published event details should always be validated against the live event pages.',
] as const

export default function PressPage() {
	const { headerDateLine, heroBarVenueLine, supportEmail } = useSiteConfig()
	const dates = headerDateLine.trim() || '28–29 January 2026'
	const venue = heroBarVenueLine.trim() || 'Kempinski Gold Coast City Hotel, Accra-Ghana'
	const mail = supportEmail.trim() || 'secretariat@africatradeawards.com'
	const pressSubject = encodeURIComponent('Press & media enquiry')
	const pressMail = `mailto:${mail}?subject=${pressSubject}`
	const [copied, setCopied] = useState(false)

	const downloadTxt = useCallback(() => {
		const blob = new Blob([PRESS_BOILERPLATE_LONG], { type: 'text/plain;charset=utf-8' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = 'africa-trade-awards-2026-boilerplate.txt'
		a.rel = 'noopener'
		document.body.appendChild(a)
		a.click()
		a.remove()
		URL.revokeObjectURL(url)
	}, [])

	const copyShort = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(PRESS_BOILERPLATE_SHORT)
			setCopied(true)
			window.setTimeout(() => setCopied(false), 2400)
		} catch {
			setCopied(false)
		}
	}, [])

	return (
		<Layout>
			<div>
				<PublicPageHero
					title="Press & media"
					currentLabel="Press"
					subtitle="Official descriptions, key facts, and how to reach the secretariat for accreditation, interviews, and assets."
				/>

				<div className="sp2">
					<div className="container">
						<div className="row">
							<div className="col-lg-10 m-auto">
								<div className="modern-section-header text-center space-margin60">
									<span className="section-accent-label" data-aos="fade-up" data-aos-duration={700}>
										Overview
									</span>
									<div className="space20" />
									<p className="mb-0" data-aos="fade-up" data-aos-duration={800} style={{ fontSize: '1.05rem', lineHeight: 1.65, color: 'rgba(30, 21, 40, 0.82)' }}>
										{PRESS_BOILERPLATE_SHORT}
									</p>
								</div>
							</div>
						</div>

						<div className="row justify-content-center mb-5">
							<div className="col-lg-10">
								<div
									className="press-key-facts"
									data-aos="fade-up"
									data-aos-duration={750}
									style={{
										display: 'grid',
										gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
										gap: '16px',
										padding: '24px',
										borderRadius: '16px',
										background: 'linear-gradient(135deg, #f8f6fa 0%, #edeaf0 100%)',
										border: '1px solid rgba(78, 43, 90, 0.12)',
										boxShadow: '0 16px 40px rgba(30, 21, 40, 0.07)',
									}}
								>
									<div>
										<p
											style={{
												margin: '0 0 6px',
												fontSize: '0.7rem',
												fontWeight: 700,
												letterSpacing: '0.14em',
												textTransform: 'uppercase',
												color: '#5c3d6b',
											}}
										>
											Event dates
										</p>
										<p style={{ margin: 0, fontWeight: 600, fontSize: '1.05rem', color: '#1e1528' }}>{dates}</p>
									</div>
									<div>
										<p
											style={{
												margin: '0 0 6px',
												fontSize: '0.7rem',
												fontWeight: 700,
												letterSpacing: '0.14em',
												textTransform: 'uppercase',
												color: '#5c3d6b',
											}}
										>
											Venue
										</p>
										<p style={{ margin: 0, fontWeight: 600, fontSize: '1.02rem', lineHeight: 1.45, color: '#1e1528' }}>
											{venue}
										</p>
									</div>
									<div>
										<p
											style={{
												margin: '0 0 6px',
												fontSize: '0.7rem',
												fontWeight: 700,
												letterSpacing: '0.14em',
												textTransform: 'uppercase',
												color: '#5c3d6b',
											}}
										>
											Hashtag
										</p>
										<p style={{ margin: 0, fontWeight: 700, fontSize: '1.05rem', color: '#1e1528' }}>{HASHTAG}</p>
									</div>
								</div>
							</div>
						</div>

						<div className="row justify-content-center mb-5">
							<div className="col-lg-10">
								<div className="press-editorial-standards" data-aos="fade-up" data-aos-duration={770}>
									<p className="press-editorial-standards__eyebrow">Editorial standards</p>
									<h3 className="press-editorial-standards__title">Editorial workflow standards</h3>
									<ul className="press-editorial-standards__list">
										{EDITORIAL_STANDARDS.map((item) => (
											<li key={item}>{item}</li>
										))}
									</ul>
								</div>
							</div>
						</div>

						<div className="row justify-content-center mb-5">
							<div className="col-lg-10">
								<div
									data-aos="fade-up"
									data-aos-duration={760}
									style={{
										padding: '26px 24px',
										borderRadius: '18px',
										background: 'linear-gradient(160deg, #1a1222 0%, #24182e 100%)',
										border: '1px solid rgba(231, 207, 170, 0.24)',
										boxShadow: '0 20px 48px rgba(20, 12, 28, 0.26)',
									}}
								>
									<div className="d-flex flex-wrap align-items-start justify-content-between gap-3">
										<div style={{ maxWidth: '660px' }}>
											<p style={{ margin: '0 0 8px', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#e7cfaa' }}>
												Media kit
											</p>
											<h3 style={{ margin: '0 0 12px', color: '#fbf7f1', fontFamily: 'var(--grotesk), serif' }}>
												Core press materials in one place
											</h3>
											<ul style={{ margin: 0, paddingLeft: '1.1rem', color: 'rgba(251, 247, 241, 0.85)', lineHeight: 1.7 }}>
												{MEDIA_KIT_ITEMS.map((item) => (
													<li key={item}>{item}</li>
												))}
											</ul>
										</div>
										<div className="d-flex flex-wrap gap-2">
											<button type="button" className="elegant-btn premium-about-btn" onClick={downloadTxt} style={{ padding: '12px 18px' }}>
												<span>Download copy pack</span>
												<i className="fa-solid fa-download" style={{ fontSize: '11px' }} />
											</button>
											<a
												href="/assets/img/logo/logo1.png?v=2"
												download="africa-trade-awards-logo.png"
												className="elegant-btn premium-about-btn"
												style={{ padding: '12px 18px' }}
											>
												<span>Download logo</span>
												<i className="fa-solid fa-download" style={{ fontSize: '11px' }} />
											</a>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="row">
							<div className="col-lg-8 m-auto">
								<div className="modern-section-header text-center space-margin60">
									<span className="section-accent-label" data-aos="fade-up" data-aos-duration={700}>
										Downloads and copy
									</span>
									<div className="space20" />
									<h2 className="modern-section-title" data-aos="fade-up" data-aos-duration={800}>
										Boilerplate and assets
									</h2>
								</div>

								<div className="space32" />

								<div
									className="press-download-card mb-4"
									data-aos="fade-up"
									data-aos-duration={750}
									style={{
										padding: '28px 24px',
										borderRadius: '16px',
										background: '#fff',
										border: '1px solid rgba(78, 43, 90, 0.1)',
										boxShadow: '0 12px 36px rgba(30, 21, 40, 0.06)',
									}}
								>
									<h3 style={{ fontFamily: 'var(--grotesk), serif', fontSize: '1.15rem', marginBottom: '12px', color: '#1e1528' }}>
										Full boilerplate (.txt)
									</h3>
									<p style={{ marginBottom: '18px', lineHeight: 1.6, color: 'rgba(30, 21, 40, 0.78)' }}>
										A plain-text file suitable for editorial systems and programme notes. Includes hashtag and reminder to confirm dates on the live site.
									</p>
									<button type="button" className="elegant-btn premium-about-btn" onClick={downloadTxt} style={{ padding: '12px 22px' }}>
										<span>Download boilerplate</span>
										<i className="fa-solid fa-download" style={{ fontSize: '11px' }} />
									</button>
								</div>

								<div
									className="press-download-card mb-4"
									data-aos="fade-up"
									data-aos-duration={780}
									data-aos-delay={50}
									style={{
										padding: '28px 24px',
										borderRadius: '16px',
										background: '#fff',
										border: '1px solid rgba(78, 43, 90, 0.1)',
										boxShadow: '0 12px 36px rgba(30, 21, 40, 0.06)',
									}}
								>
									<h3 style={{ fontFamily: 'var(--grotesk), serif', fontSize: '1.15rem', marginBottom: '12px', color: '#1e1528' }}>
										Short descriptor (clipboard)
									</h3>
									<p style={{ marginBottom: '14px', lineHeight: 1.6, color: 'rgba(30, 21, 40, 0.78)' }}>
										One paragraph for captions, chyrons, and social stubs.
									</p>
									<button type="button" className="elegant-btn premium-about-btn" onClick={copyShort} style={{ padding: '12px 22px' }}>
										<span>{copied ? 'Copied' : 'Copy short descriptor'}</span>
										<i className={copied ? 'fa-solid fa-check' : 'fa-solid fa-copy'} style={{ fontSize: '11px' }} />
									</button>
								</div>

								<div
									className="press-download-card mb-5"
									data-aos="fade-up"
									data-aos-duration={800}
									data-aos-delay={80}
									style={{
										padding: '28px 24px',
										borderRadius: '16px',
										background: '#fff',
										border: '1px solid rgba(78, 43, 90, 0.1)',
										boxShadow: '0 12px 36px rgba(30, 21, 40, 0.06)',
									}}
								>
									<h3 style={{ fontFamily: 'var(--grotesk), serif', fontSize: '1.15rem', marginBottom: '12px', color: '#1e1528' }}>
										Logo (PNG)
									</h3>
									<p style={{ marginBottom: '18px', lineHeight: 1.6, color: 'rgba(30, 21, 40, 0.78)' }}>
										Use on light backgrounds; preserve clear space around the mark. For vector formats or colour variants, email the press desk.
									</p>
									<a
										href="/assets/img/logo/logo1.png?v=2"
										download="africa-trade-awards-logo.png"
										className="elegant-btn premium-about-btn"
										style={{ padding: '12px 22px', display: 'inline-flex', alignItems: 'center', gap: '10px' }}
									>
										<span>Download PNG</span>
										<i className="fa-solid fa-download" style={{ fontSize: '11px' }} />
									</a>
								</div>

								<div className="modern-section-header text-center space-margin60">
									<span className="section-accent-label" data-aos="fade-up" data-aos-duration={700}>
										Working with us
									</span>
									<div className="space20" />
									<h2 className="modern-section-title" data-aos="fade-up" data-aos-duration={800}>
										Accreditation & enquiries
									</h2>
								</div>

								<ul
									style={{
										maxWidth: '640px',
										margin: '0 auto 40px',
										paddingLeft: '1.25rem',
										lineHeight: 1.75,
										color: 'rgba(30, 21, 40, 0.82)',
									}}
									data-aos="fade-up"
									data-aos-duration={750}
								>
									<li>Submit accreditation and crew lists in advance; on-site capacity may be limited during the gala.</li>
									<li>Interview requests are scheduled subject to speaker and finalist availability.</li>
									<li>B-roll and stills: see the Gallery and Memories sections for atmosphere; fresh assets may be offered closer to the event.</li>
								</ul>

								<div
									className="text-center"
									data-aos="fade-up"
									data-aos-duration={750}
									style={{ marginBottom: '48px' }}
								>
									<a href={pressMail} className="elegant-btn premium-about-btn me-2 me-md-3 mb-2 mb-md-0" style={{ padding: '12px 22px' }}>
										<span>Email press desk</span>
										<i className="fa-solid fa-envelope" style={{ fontSize: '11px' }} />
									</a>
									<Link href="/contact/" className="elegant-btn premium-about-btn" style={{ padding: '12px 22px', opacity: 0.95 }}>
										<span>Contact secretariat</span>
										<i className="fa-solid fa-arrow-right" style={{ fontSize: '11px' }} />
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<style jsx global>{`
				.press-editorial-standards {
					padding: 24px 24px 20px;
					border-radius: 18px;
					background: linear-gradient(180deg, #faf6fb 0%, #f2ebf6 100%);
					border: 1px solid rgba(78, 43, 90, 0.12);
					box-shadow: 0 14px 34px rgba(30, 21, 40, 0.08);
				}
				.press-editorial-standards__eyebrow {
					margin: 0 0 8px;
					font-size: 0.7rem;
					font-weight: 700;
					letter-spacing: 0.18em;
					text-transform: uppercase;
					color: #6a4082;
				}
				.press-editorial-standards__title {
					margin: 0 0 12px;
					font-family: var(--grotesk), serif;
					color: #1e1528;
				}
				.press-editorial-standards__list {
					margin: 0;
					padding-left: 1.1rem;
					line-height: 1.7;
					color: rgba(30, 21, 40, 0.8);
				}
			`}</style>
		</Layout>
	)
}
