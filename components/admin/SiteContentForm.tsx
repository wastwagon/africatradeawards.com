'use client'

import type { PublicSiteSettingsDTO } from '@/lib/public-site-settings'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

type Props = { initial: PublicSiteSettingsDTO }

const copyFields: { key: keyof PublicSiteSettingsDTO; label: string; hint: string }[] = [
	{
		key: 'headerDateLine',
		label: 'Header date (nav strip)',
		hint: 'Shown next to the logo in the top meta bar, e.g. 28–29 January 2026',
	},
	{
		key: 'headerVenueLine',
		label: 'Header venue (nav strip)',
		hint: 'Second part of the meta bar, e.g. Kempinski Gold Coast City · Accra',
	},
	{
		key: 'mobileNavMetaLine',
		label: 'Mobile menu subtitle',
		hint: 'Short line above the drawer links, e.g. 28–29 Jan · Accra',
	},
	{
		key: 'heroBarDateLine',
		label: 'Homepage bar — date',
		hint: 'Event date block below the hero',
	},
	{
		key: 'heroBarVenueLine',
		label: 'Homepage bar — venue',
		hint: 'Venue line in the cream bar under the hero',
	},
]

export default function SiteContentForm({ initial }: Props) {
	const router = useRouter()
	const [values, setValues] = useState<PublicSiteSettingsDTO>(initial)
	const [saving, setSaving] = useState(false)
	const [message, setMessage] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)

	async function onSubmit(e: FormEvent) {
		e.preventDefault()
		setSaving(true)
		setMessage(null)
		setError(null)
		try {
			const res = await fetch('/api/admin/site-settings', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(values),
			})
			const data = await res.json().catch(() => ({}))
			if (!res.ok) {
				setError(typeof data.error === 'string' ? data.error : 'Save failed')
				return
			}
			if (data.settings) {
				setValues(data.settings as PublicSiteSettingsDTO)
			}
			setMessage('Saved. Public pages and metadata refresh on next load.')
			router.refresh()
		} catch {
			setError('Network error')
		} finally {
			setSaving(false)
		}
	}

	return (
		<main>
			<p className="admin-backlink">
				<Link href="/admin/">← Admin home</Link>
			</p>
			<h1>Site content (public)</h1>
			<p className="admin-muted">
				Dates, venue copy, optional announcement strip, support email, and SEO description. Program managers can edit;
				changes apply site-wide after save.
			</p>

			<form onSubmit={onSubmit} className="admin-form">
				<section className="admin-panel" style={{ marginBottom: '18px' }}>
					<h2 className="admin-kpi-section-title" style={{ marginTop: 0 }}>
						Dates &amp; venue
					</h2>
					{copyFields.map(({ key, label, hint }) => (
						<div key={key} className="admin-form__group">
							<label htmlFor={key} className="admin-form__label">
								{label}
							</label>
							<p className="admin-form__hint">{hint}</p>
							<input
								id={key}
								name={key}
								value={values[key] as string}
								onChange={(ev) => setValues((v) => ({ ...v, [key]: ev.target.value }))}
								required
								className="admin-form__input"
							/>
						</div>
					))}
				</section>

				<section className="admin-panel" style={{ marginBottom: '18px' }}>
					<h2 className="admin-kpi-section-title" style={{ marginTop: 0 }}>
						Support &amp; SEO
					</h2>
					<div className="admin-form__group">
						<label htmlFor="supportEmail" className="admin-form__label">
							Support email
						</label>
						<p className="admin-form__hint">
							Used in footer, mobile menu, contact page, and as the recipient for the website contact form (SMTP env vars
							must be set for form delivery).
						</p>
						<input
							id="supportEmail"
							name="supportEmail"
							type="email"
							value={values.supportEmail}
							onChange={(ev) => setValues((v) => ({ ...v, supportEmail: ev.target.value }))}
							required
							className="admin-form__input"
						/>
					</div>
					<div className="admin-form__group">
						<label htmlFor="seoDescription" className="admin-form__label">
							Meta description (optional)
						</label>
						<p className="admin-form__hint">
							Override the default search / social description. Leave empty to keep the built-in default.
						</p>
						<textarea
							id="seoDescription"
							name="seoDescription"
							rows={3}
							value={values.seoDescription}
							onChange={(ev) => setValues((v) => ({ ...v, seoDescription: ev.target.value }))}
							className="admin-form__input"
							style={{ minHeight: '88px' }}
						/>
					</div>
				</section>

				<section className="admin-panel" style={{ marginBottom: '18px' }}>
					<h2 className="admin-kpi-section-title" style={{ marginTop: 0 }}>
						Event live stream
					</h2>
					<p className="admin-form__hint" style={{ marginTop: 0 }}>
						On event day, turn this on and paste a YouTube watch link, youtu.be short link, youtube.com/embed/… URL, or the
						Facebook embed URL (from Share → Embed → copy the iframe <code>src</code>). The site shows a &quot;Live&quot; link
						in the header and a player on <Link href="/live">/live</Link>.
					</p>
					<label className="admin-form__label" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
						<input
							type="checkbox"
							checked={values.eventLiveStreamEnabled}
							onChange={(ev) => setValues((v) => ({ ...v, eventLiveStreamEnabled: ev.target.checked }))}
						/>
						Show live stream on the website
					</label>
					<div className="admin-form__group">
						<label htmlFor="eventLiveStreamTitle" className="admin-form__label">
							Page title
						</label>
						<input
							id="eventLiveStreamTitle"
							name="eventLiveStreamTitle"
							value={values.eventLiveStreamTitle}
							onChange={(ev) => setValues((v) => ({ ...v, eventLiveStreamTitle: ev.target.value }))}
							className="admin-form__input"
							placeholder="Awards ceremony live"
							maxLength={120}
						/>
					</div>
					<div className="admin-form__group">
						<label htmlFor="eventLiveStreamEmbedUrl" className="admin-form__label">
							YouTube or Facebook embed URL
						</label>
						<p className="admin-form__hint">
							Required when live stream is enabled. Example:{' '}
							<code style={{ wordBreak: 'break-all' }}>https://www.youtube.com/watch?v=…</code> or Facebook{' '}
							<code style={{ wordBreak: 'break-all' }}>https://www.facebook.com/plugins/video.php?href=…</code>
						</p>
						<input
							id="eventLiveStreamEmbedUrl"
							name="eventLiveStreamEmbedUrl"
							type="url"
							value={values.eventLiveStreamEmbedUrl}
							onChange={(ev) => setValues((v) => ({ ...v, eventLiveStreamEmbedUrl: ev.target.value }))}
							className="admin-form__input"
							placeholder="https://"
						/>
					</div>
				</section>

				<section className="admin-panel" style={{ marginBottom: '18px' }}>
					<h2 className="admin-kpi-section-title" style={{ marginTop: 0 }}>
						Site announcement
					</h2>
					<p className="admin-form__hint" style={{ marginTop: 0 }}>
						Optional dismissible bar below the header on public and account pages (hidden in admin).
					</p>
					<label className="admin-form__label" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
						<input
							type="checkbox"
							checked={values.announcementEnabled}
							onChange={(ev) => setValues((v) => ({ ...v, announcementEnabled: ev.target.checked }))}
						/>
						Show announcement
					</label>
					<div className="admin-form__group">
						<label htmlFor="announcementText" className="admin-form__label">
							Message
						</label>
						<textarea
							id="announcementText"
							name="announcementText"
							rows={2}
							value={values.announcementText}
							onChange={(ev) => setValues((v) => ({ ...v, announcementText: ev.target.value }))}
							className="admin-form__input"
							style={{ minHeight: '72px' }}
						/>
					</div>
					<div className="admin-form__group">
						<label htmlFor="announcementLinkUrl" className="admin-form__label">
							Link URL (optional)
						</label>
						<p className="admin-form__hint">Must start with http:// or https://</p>
						<input
							id="announcementLinkUrl"
							name="announcementLinkUrl"
							type="url"
							value={values.announcementLinkUrl}
							onChange={(ev) => setValues((v) => ({ ...v, announcementLinkUrl: ev.target.value }))}
							className="admin-form__input"
							placeholder="https://"
						/>
					</div>
					<div className="admin-form__group">
						<label htmlFor="announcementLinkLabel" className="admin-form__label">
							Link label (optional)
						</label>
						<input
							id="announcementLinkLabel"
							name="announcementLinkLabel"
							value={values.announcementLinkLabel}
							onChange={(ev) => setValues((v) => ({ ...v, announcementLinkLabel: ev.target.value }))}
							className="admin-form__input"
							placeholder="Learn more"
						/>
					</div>
				</section>

				<button type="submit" disabled={saving} className="admin-form__submit">
					{saving ? 'Saving…' : 'Save all'}
				</button>
			</form>

			{message ? <p className="admin-ok">{message}</p> : null}
			{error ? <p className="admin-error">{error}</p> : null}
		</main>
	)
}
