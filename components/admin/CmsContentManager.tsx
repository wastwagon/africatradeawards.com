'use client'

import {
  DEFAULT_ABOUT_SNIPPETS,
  DEFAULT_FAQS,
  DEFAULT_PUBLICATIONS,
  faqCategorySelectValues,
  type CmsFaqItem,
  type CmsPublicationItem,
  type CmsSnippetItem,
} from '@/lib/cms-defaults'
import type { AdminCmsEditorBundle } from '@/lib/cms-content'
import Image from 'next/image'
import { normalizePublicationDateTextForState } from '@/lib/cms-publication-date'
import { normalizePublicationSlug, publicationHrefFromSlug } from '@/lib/cms-publication-slug'
import { useEffect, useState } from 'react'

const CMS_SCHEDULE_HELP =
  'Publish at / Unpublish at: optional schedule on top of “Published”. Leave both blank for no schedule. If Publish at is set, this content stays hidden on the public site until that time. If Unpublish at is set, it stops showing from that time onward.'

type Tab = 'faqs' | 'publications' | 'about'
type CmsScope = 'faqs' | 'publications' | 'about-snippets'
type RevisionItem = {
  id: string
  createdAt: string
  title: string | null
  note: string | null
  createdBy: { fullName: string | null; email: string } | null
}

function isoToLocalInput(value?: string) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function localInputToIso(value: string) {
  if (!value.trim()) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString()
}

function normalizeFaqCategory(category: string): string {
  const trimmed = String(category ?? '').trim()
  return trimmed || 'General'
}

export default function CmsContentManager({ initialBundle }: { initialBundle?: AdminCmsEditorBundle }) {
  const [tab, setTab] = useState<Tab>('faqs')
  const [faqs, setFaqs] = useState<CmsFaqItem[]>(() =>
    (initialBundle?.faqs ?? DEFAULT_FAQS).map((x) => ({
      ...x,
      category: normalizeFaqCategory(x.category),
    })),
  )
  const [publications, setPublications] = useState<CmsPublicationItem[]>(() => {
    const base = initialBundle?.publications ?? DEFAULT_PUBLICATIONS
    return base.map((item) => ({
      ...item,
      dateText: normalizePublicationDateTextForState(item.dateText),
      href: publicationHrefFromSlug(item.slug),
    }))
  })
  const [snippets, setSnippets] = useState<CmsSnippetItem[]>(() => initialBundle?.snippets ?? DEFAULT_ABOUT_SNIPPETS)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [revisions, setRevisions] = useState<RevisionItem[]>([])
  const [revisionTitle, setRevisionTitle] = useState('')
  const [revisionNote, setRevisionNote] = useState('')
  const [pubImageUploadIndex, setPubImageUploadIndex] = useState<number | null>(null)

  const scopeFromTab = (value: Tab): CmsScope => (value === 'about' ? 'about-snippets' : value)

  useEffect(() => {
    if (initialBundle) return
    void loadAll()
  }, [initialBundle])

  useEffect(() => {
    void loadRevisions(scopeFromTab(tab))
  }, [tab])

  async function loadAll() {
    setLoading(true)
    setError(null)
    try {
      const [faqRes, pubRes, snippetRes] = await Promise.all([
        fetch('/api/admin/cms/faqs', { cache: 'no-store' }),
        fetch('/api/admin/cms/publications', { cache: 'no-store' }),
        fetch('/api/admin/cms/about-snippets', { cache: 'no-store' }),
      ])
      const [faqData, pubData, snippetData] = await Promise.all([faqRes.json(), pubRes.json(), snippetRes.json()])
      if (!faqRes.ok || !pubRes.ok || !snippetRes.ok) {
        throw new Error('Could not load CMS content')
      }
      if (Array.isArray(faqData.faqs)) {
        setFaqs(
          faqData.faqs.map((item: Record<string, unknown>, index: number) => ({
            question: String(item.question ?? ''),
            answer: String(item.answer ?? ''),
            category: normalizeFaqCategory(String(item.category ?? '')),
            sortOrder: Number(item.sortOrder ?? index + 1),
            published: Boolean(item.published ?? true),
            publishAt: typeof item.publishAt === 'string' ? item.publishAt : '',
            unpublishAt: typeof item.unpublishAt === 'string' ? item.unpublishAt : '',
          })),
        )
      }
      if (Array.isArray(pubData.publications)) {
        setPublications(
          pubData.publications.map((item: Record<string, unknown>, index: number) => {
            const slug = String(item.slug ?? '')
            return {
              slug,
              title: String(item.title ?? ''),
              excerpt: String(item.excerpt ?? ''),
              body: typeof item.body === 'string' ? item.body : '',
              dateText: normalizePublicationDateTextForState(String(item.dateText ?? item.date ?? '')),
              dateline: String(item.dateline ?? ''),
              image: String(item.image ?? ''),
              href: publicationHrefFromSlug(slug),
              sortOrder: Number(item.sortOrder ?? index + 1),
              published: Boolean(item.published ?? true),
              publishAt: typeof item.publishAt === 'string' ? item.publishAt : '',
              unpublishAt: typeof item.unpublishAt === 'string' ? item.unpublishAt : '',
            }
          }),
        )
      }
      if (Array.isArray(snippetData.snippets)) {
        setSnippets(
          snippetData.snippets.map((item: Record<string, unknown>, index: number) => ({
            key: String(item.key ?? `about_snippet_${index + 1}`),
            label: String(item.label ?? `About text ${index + 1}`),
            content: String(item.content ?? ''),
            sortOrder: Number(item.sortOrder ?? index + 1),
          })),
        )
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not load CMS content'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  async function loadRevisions(scope: CmsScope) {
    try {
      const res = await fetch(`/api/admin/cms/revisions/${scope}`, { cache: 'no-store' })
      const data = await res.json()
      if (!res.ok || !Array.isArray(data.revisions)) {
        setRevisions([])
        return
      }
      setRevisions(
        data.revisions.map((item: Record<string, unknown>) => ({
          id: String(item.id ?? ''),
          createdAt: String(item.createdAt ?? ''),
          title: typeof item.title === 'string' ? item.title : null,
          note: typeof item.note === 'string' ? item.note : null,
          createdBy: (item.createdBy as RevisionItem['createdBy']) ?? null,
        })),
      )
    } catch {
      setRevisions([])
    }
  }

  async function rollbackRevision(revisionId: string) {
    if (!revisionId) return
    const scope = scopeFromTab(tab)
    const ok = window.confirm('Restore this revision? Current unsaved edits will be overwritten.')
    if (!ok) return
    setSaving(true)
    setMessage(null)
    setError(null)
    try {
      const res = await fetch(`/api/admin/cms/revisions/${scope}/rollback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          revisionId,
          revisionTitle: `Rollback (${tab})`,
          revisionNote: revisionNote || undefined,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(typeof data.error === 'string' ? data.error : 'Rollback failed')
      await loadAll()
      await loadRevisions(scope)
      setMessage('Revision restored successfully.')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Rollback failed')
    } finally {
      setSaving(false)
    }
  }

  async function saveFaqs() {
    setSaving(true)
    setMessage(null)
    setError(null)
    try {
      const res = await fetch('/api/admin/cms/faqs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          faqs: faqs.map((item) => ({
            ...item,
            publishAt: item.publishAt ? item.publishAt : '',
            unpublishAt: item.unpublishAt ? item.unpublishAt : '',
          })),
          revisionTitle,
          revisionNote,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(typeof data.error === 'string' ? data.error : 'Failed to save FAQs')
      setMessage('FAQs saved successfully.')
      setRevisionTitle('')
      setRevisionNote('')
      await loadAll()
      await loadRevisions('faqs')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save FAQs')
    } finally {
      setSaving(false)
    }
  }

  async function uploadPublicationCoverImage(index: number, file: File | null) {
    if (!file) return
    setError(null)
    setPubImageUploadIndex(index)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/cms/publication-image', {
        method: 'POST',
        body: fd,
        credentials: 'same-origin',
      })
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; url?: string; error?: string }
      if (!res.ok) throw new Error(typeof data.error === 'string' ? data.error : 'Image upload failed')
      const url = typeof data.url === 'string' ? data.url.trim() : ''
      if (!url) throw new Error('Image upload failed')
      setPublications((current) => current.map((x, i) => (i === index ? { ...x, image: url } : x)))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Image upload failed')
    } finally {
      setPubImageUploadIndex(null)
    }
  }

  async function savePublications() {
    setSaving(true)
    setMessage(null)
    setError(null)
    try {
      const publicationsPayload = publications.map((item) => {
        const slug = normalizePublicationSlug(item.slug)
        return {
          ...item,
          slug,
          href: publicationHrefFromSlug(slug),
          dateText: String(item.dateText ?? '').trim(),
          dateline: String(item.dateline ?? '').trim(),
          image: String(item.image ?? '').trim(),
          publishAt: item.publishAt ? item.publishAt : '',
          unpublishAt: item.unpublishAt ? item.unpublishAt : '',
        }
      })
      for (let i = 0; i < publicationsPayload.length; i += 1) {
        const p = publicationsPayload[i]
        if (!p.image) {
          setError(`Publication ${i + 1}: upload a cover image (JPEG, PNG, or WebP).`)
          return
        }
        if (!/^\d{4}-\d{2}-\d{2}$/.test(p.dateText)) {
          setError(`Publication ${i + 1}: choose a publication date.`)
          return
        }
      }
      const res = await fetch('/api/admin/cms/publications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publications: publicationsPayload,
          revisionTitle,
          revisionNote,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(typeof data.error === 'string' ? data.error : 'Failed to save publications')
      setMessage('Publications saved successfully.')
      setRevisionTitle('')
      setRevisionNote('')
      await loadAll()
      await loadRevisions('publications')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save publications')
    } finally {
      setSaving(false)
    }
  }

  async function saveSnippets() {
    setSaving(true)
    setMessage(null)
    setError(null)
    try {
      const res = await fetch('/api/admin/cms/about-snippets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ snippets, revisionTitle, revisionNote }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(typeof data.error === 'string' ? data.error : 'Failed to save about content')
      setMessage('About page copy saved successfully.')
      setRevisionTitle('')
      setRevisionNote('')
      await loadAll()
      await loadRevisions('about-snippets')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save about content')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section>
      <h2>Friendly CMS editor</h2>
      <p className="admin-muted">Edit live website copy in plain English. No JSON fields required.</p>

      <div className="admin-segment">
        <button type="button" className={tab === 'faqs' ? 'is-active' : ''} onClick={() => setTab('faqs')}>
          FAQs
        </button>
        <button type="button" className={tab === 'publications' ? 'is-active' : ''} onClick={() => setTab('publications')}>
          Publications
        </button>
        <button type="button" className={tab === 'about' ? 'is-active' : ''} onClick={() => setTab('about')}>
          About page copy
        </button>
      </div>

      {loading ? <p className="admin-muted">Loading CMS content...</p> : null}
      <div className="admin-panel" style={{ marginBottom: 12 }}>
        <h3 style={{ marginTop: 0 }}>Save checkpoint (optional)</h3>
        <p className="admin-muted">Add a short title and note so revision history is clear for your team.</p>
        <div className="admin-split-grid">
          <label>
            Revision title
            <input
              className="admin-form__input"
              value={revisionTitle}
              onChange={(e) => setRevisionTitle(e.target.value)}
              placeholder="Example: Pre-launch copy polish"
            />
          </label>
          <label>
            Revision note
            <input
              className="admin-form__input"
              value={revisionNote}
              onChange={(e) => setRevisionNote(e.target.value)}
              placeholder="What changed and why"
            />
          </label>
        </div>
      </div>

      {tab === 'faqs' ? (
        <div className="admin-card-list">
          {faqs.map((item, index) => (
            <div key={`faq-${index}`} className="admin-panel">
              <label className="admin-form__label">Question</label>
              <input
                className="admin-form__input"
                value={item.question}
                onChange={(e) =>
                  setFaqs((current) => current.map((x, i) => (i === index ? { ...x, question: e.target.value } : x)))
                }
              />
              <label className="admin-form__label">Answer</label>
              <textarea
                className="admin-form__input"
                value={item.answer}
                onChange={(e) => setFaqs((current) => current.map((x, i) => (i === index ? { ...x, answer: e.target.value } : x)))}
              />
              <label className="admin-form__label">Category</label>
              <select
                className="admin-form__input"
                style={{ maxWidth: 280 }}
                value={normalizeFaqCategory(item.category)}
                onChange={(e) =>
                  setFaqs((current) => current.map((x, i) => (i === index ? { ...x, category: e.target.value } : x)))
                }
              >
                {faqCategorySelectValues(item.category).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <div className="admin-inline-actions">
                <label className="admin-muted" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <input
                    type="checkbox"
                    checked={item.published}
                    onChange={(e) =>
                      setFaqs((current) => current.map((x, i) => (i === index ? { ...x, published: e.target.checked } : x)))
                    }
                  />
                  Published
                </label>
                <label>
                  Publish at
                  <input
                    className="admin-form__input"
                    type="datetime-local"
                    value={isoToLocalInput(item.publishAt)}
                    onChange={(e) =>
                      setFaqs((current) =>
                        current.map((x, i) => (i === index ? { ...x, publishAt: localInputToIso(e.target.value) } : x)),
                      )
                    }
                  />
                </label>
                <label>
                  Unpublish at
                  <input
                    className="admin-form__input"
                    type="datetime-local"
                    value={isoToLocalInput(item.unpublishAt)}
                    onChange={(e) =>
                      setFaqs((current) =>
                        current.map((x, i) => (i === index ? { ...x, unpublishAt: localInputToIso(e.target.value) } : x)),
                      )
                    }
                  />
                </label>
                <button type="button" onClick={() => setFaqs((current) => current.filter((_, i) => i !== index))}>
                  Remove
                </button>
              </div>
            </div>
          ))}
          <p className="admin-muted" style={{ maxWidth: 720 }}>
            {CMS_SCHEDULE_HELP}
          </p>
          <div className="admin-inline-actions">
            <button
              type="button"
              onClick={() =>
                setFaqs((current) => [
                  ...current,
                  {
                    question: '',
                    answer: '',
                    category: 'General',
                    sortOrder: current.length + 1,
                    published: true,
                    publishAt: '',
                    unpublishAt: '',
                  },
                ])
              }
            >
              Add FAQ item
            </button>
            <button type="button" disabled={saving} onClick={saveFaqs}>
              {saving ? 'Saving...' : 'Save FAQs'}
            </button>
          </div>
        </div>
      ) : null}

      {tab === 'publications' ? (
        <div className="admin-card-list">
          {publications.map((item, index) => (
            <div key={`pub-${index}`} className="admin-panel">
              <label className="admin-form__label">Title</label>
              <input
                className="admin-form__input"
                value={item.title}
                onChange={(e) =>
                  setPublications((current) => current.map((x, i) => (i === index ? { ...x, title: e.target.value } : x)))
                }
              />
              <label className="admin-form__label">Summary</label>
              <textarea
                className="admin-form__input"
                value={item.excerpt}
                onChange={(e) =>
                  setPublications((current) => current.map((x, i) => (i === index ? { ...x, excerpt: e.target.value } : x)))
                }
              />
              <label className="admin-form__label">Article body (HTML)</label>
              <p className="admin-muted" style={{ marginTop: 0 }}>
                Trusted HTML only. Renders below the headline on the public press release page.
              </p>
              <textarea
                className="admin-form__input"
                style={{ minHeight: 220, fontFamily: 'ui-monospace, monospace', fontSize: 13 }}
                rows={14}
                value={item.body ?? ''}
                onChange={(e) =>
                  setPublications((current) => current.map((x, i) => (i === index ? { ...x, body: e.target.value } : x)))
                }
              />
              <div className="admin-split-grid">
                <label>
                  Slug
                  <input
                    className="admin-form__input"
                    value={item.slug}
                    onChange={(e) => {
                      const slug = e.target.value
                      setPublications((current) =>
                        current.map((x, i) =>
                          i === index ? { ...x, slug, href: publicationHrefFromSlug(slug) } : x,
                        ),
                      )
                    }}
                  />
                </label>
                <label>
                  Publication date
                  <input
                    className="admin-form__input"
                    type="date"
                    value={item.dateText}
                    onChange={(e) =>
                      setPublications((current) =>
                        current.map((x, i) => (i === index ? { ...x, dateText: e.target.value } : x)),
                      )
                    }
                  />
                </label>
              </div>
              <label className="admin-form__label">Dateline</label>
              <input
                className="admin-form__input"
                value={item.dateline}
                onChange={(e) =>
                  setPublications((current) => current.map((x, i) => (i === index ? { ...x, dateline: e.target.value } : x)))
                }
              />
              <p className="admin-muted" style={{ marginTop: 8, marginBottom: 0 }}>
                Public URL: <strong>{publicationHrefFromSlug(item.slug) || '—'}</strong> (from slug)
              </p>
              <label className="admin-form__label" style={{ marginTop: 16 }}>
                Cover image (required)
              </label>
              <p className="admin-muted" style={{ marginTop: 0 }}>
                JPEG, PNG, or WebP, up to 8MB. Stored under <code>/uploads/publications/</code>.
              </p>
              <input
                className="admin-form__input"
                type="file"
                accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                disabled={pubImageUploadIndex === index}
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null
                  e.target.value = ''
                  void uploadPublicationCoverImage(index, file)
                }}
              />
              {pubImageUploadIndex === index ? <p className="admin-muted">Uploading…</p> : null}
              {item.image ? (
                <div style={{ marginTop: 10 }}>
                  <p className="admin-muted" style={{ marginBottom: 6 }}>
                    Current:{' '}
                    <a href={item.image} target="_blank" rel="noreferrer">
                      {item.image}
                    </a>
                  </p>
                  <Image
                    src={item.image}
                    alt=""
                    width={280}
                    height={160}
                    style={{ objectFit: 'cover', borderRadius: 6, maxWidth: '100%', height: 'auto' }}
                  />
                </div>
              ) : null}
              <div className="admin-inline-actions">
                <label className="admin-muted" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <input
                    type="checkbox"
                    checked={item.published}
                    onChange={(e) =>
                      setPublications((current) => current.map((x, i) => (i === index ? { ...x, published: e.target.checked } : x)))
                    }
                  />
                  Published
                </label>
                <label>
                  Publish at
                  <input
                    className="admin-form__input"
                    type="datetime-local"
                    value={isoToLocalInput(item.publishAt)}
                    onChange={(e) =>
                      setPublications((current) =>
                        current.map((x, i) => (i === index ? { ...x, publishAt: localInputToIso(e.target.value) } : x)),
                      )
                    }
                  />
                </label>
                <label>
                  Unpublish at
                  <input
                    className="admin-form__input"
                    type="datetime-local"
                    value={isoToLocalInput(item.unpublishAt)}
                    onChange={(e) =>
                      setPublications((current) =>
                        current.map((x, i) => (i === index ? { ...x, unpublishAt: localInputToIso(e.target.value) } : x)),
                      )
                    }
                  />
                </label>
                <button type="button" onClick={() => setPublications((current) => current.filter((_, i) => i !== index))}>
                  Remove
                </button>
              </div>
            </div>
          ))}
          <p className="admin-muted" style={{ maxWidth: 720 }}>
            {CMS_SCHEDULE_HELP}
          </p>
          <div className="admin-inline-actions">
            <button
              type="button"
              onClick={() =>
                setPublications((current) => [
                  ...current,
                  {
                    slug: '',
                    title: '',
                    excerpt: '',
                    body: '',
                    dateText: '',
                    dateline: '',
                    image: '',
                    href: '',
                    sortOrder: current.length + 1,
                    published: true,
                    publishAt: '',
                    unpublishAt: '',
                  },
                ])
              }
            >
              Add publication
            </button>
            <button type="button" disabled={saving} onClick={savePublications}>
              {saving ? 'Saving...' : 'Save publications'}
            </button>
          </div>
        </div>
      ) : null}

      {tab === 'about' ? (
        <div className="admin-card-list">
          {snippets.map((item, index) => (
            <div key={item.key} className="admin-panel">
              <label className="admin-form__label">{item.label}</label>
              <textarea
                className="admin-form__input"
                value={item.content}
                onChange={(e) =>
                  setSnippets((current) => current.map((x, i) => (i === index ? { ...x, content: e.target.value } : x)))
                }
              />
            </div>
          ))}
          <div className="admin-inline-actions">
            <button type="button" disabled={saving} onClick={saveSnippets}>
              {saving ? 'Saving...' : 'Save about page copy'}
            </button>
          </div>
        </div>
      ) : null}

      {message ? <p className="admin-ok">{message}</p> : null}
      {error ? <p className="admin-error">{error}</p> : null}
      <div className="admin-panel" style={{ marginTop: 12 }}>
        <h3 style={{ marginTop: 0 }}>Revision history</h3>
        {revisions.length === 0 ? (
          <p className="admin-muted">No revisions yet for this section.</p>
        ) : (
          <ul className="admin-link-list">
            {revisions.map((revision) => (
              <li key={revision.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                <span>
                  <strong>{revision.title || 'Untitled revision'}</strong>
                  <br />
                  {new Date(revision.createdAt).toLocaleString()} by{' '}
                  {revision.createdBy?.fullName || revision.createdBy?.email || 'system'}
                  {revision.note ? (
                    <>
                      <br />
                      <em>{revision.note}</em>
                    </>
                  ) : null}
                </span>
                <button type="button" onClick={() => void rollbackRevision(revision.id)} disabled={saving}>
                  Restore
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
