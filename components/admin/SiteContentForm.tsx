'use client'

import type { PublicSiteSettingsDTO } from '@/lib/public-site-settings'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

type Props = { initial: PublicSiteSettingsDTO }

const fields: { key: keyof PublicSiteSettingsDTO; label: string; hint: string }[] = [
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
			setMessage('Saved. Public pages will pick up changes on next load.')
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
				Dates and venue copy for the marketing header, mobile menu, and homepage event bar. Program managers can edit;
				changes apply after save site-wide.
			</p>

			<form onSubmit={onSubmit} className="admin-form">
				{fields.map(({ key, label, hint }) => (
					<div key={key} className="admin-form__group">
						<label htmlFor={key} className="admin-form__label">
							{label}
						</label>
						<p className="admin-form__hint">{hint}</p>
						<input
							id={key}
							name={key}
							value={values[key]}
							onChange={(ev) => setValues((v) => ({ ...v, [key]: ev.target.value }))}
							required
							className="admin-form__input"
						/>
					</div>
				))}

				<button type="submit" disabled={saving} className="admin-form__submit">
					{saving ? 'Saving…' : 'Save'}
				</button>
			</form>

			{message ? <p className="admin-ok">{message}</p> : null}
			{error ? <p className="admin-error">{error}</p> : null}
		</main>
	)
}
