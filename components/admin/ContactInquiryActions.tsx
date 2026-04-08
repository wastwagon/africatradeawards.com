'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Props = {
  id: string
  status: string
}

export default function ContactInquiryActions({ id, status }: Props) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function patch(next: 'REVIEWED' | 'CLOSED' | 'REOPEN') {
    setBusy(true)
    setErr(null)
    try {
      const res = await fetch(`/api/admin/contact-inquiries/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setErr(typeof data.error === 'string' ? data.error : 'Update failed')
        return
      }
      router.refresh()
    } catch {
      setErr('Network error')
    } finally {
      setBusy(false)
    }
  }

  const upper = status.toUpperCase()
  const canTriage = upper !== 'REVIEWED' && upper !== 'CLOSED'
  const canReopen = upper === 'REVIEWED' || upper === 'CLOSED'

  return (
    <div className="admin-inline-actions" style={{ marginTop: 6 }}>
      {canTriage ? (
        <>
          <button type="button" disabled={busy} onClick={() => void patch('REVIEWED')} className="admin-quick-action">
            Mark reviewed
          </button>
          <button type="button" disabled={busy} onClick={() => void patch('CLOSED')} className="admin-quick-action">
            Close
          </button>
        </>
      ) : null}
      {canReopen ? (
        <button type="button" disabled={busy} onClick={() => void patch('REOPEN')} className="admin-quick-action">
          Reopen
        </button>
      ) : null}
      {err ? <span className="admin-error" style={{ width: '100%' }}>{err}</span> : null}
    </div>
  )
}
