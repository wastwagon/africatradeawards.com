'use client'

import {
  DEFAULT_ABOUT_SNIPPETS,
  DEFAULT_FAQS,
  DEFAULT_PUBLICATIONS,
  type CmsFaqItem,
  type CmsPublicationItem,
  type CmsSnippetItem,
} from '@/lib/cms-defaults'
import { useEffect, useState } from 'react'

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

export default function CmsContentManager() {
  const [tab, setTab] = useState<Tab>('faqs')
  const [faqs, setFaqs] = useState<CmsFaqItem[]>(DEFAULT_FAQS)
  const [publications, setPublications] = useState<CmsPublicationItem[]>(DEFAULT_PUBLICATIONS)
  const [snippets, setSnippets] = useState<CmsSnippetItem[]>(DEFAULT_ABOUT_SNIPPETS)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [revisions, setRevisions] = useState<RevisionItem[]>([])
  const [revisionTitle, setRevisionTitle] = useState('')
  const [revisionNote, setRevisionNote] = useState('')

  const scopeFromTab = (value: Tab): CmsScope => (value === 'about' ? 'about-snippets' : value)

  useEffect(() => {
    void loadAll()
  }, [])

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
            category: String(item.category ?? ''),
            sortOrder: Number(item.sortOrder ?? index + 1),
            published: Boolean(item.published ?? true),
            publishAt: typeof item.publishAt === 'string' ? item.publishAt : '',
            unpublishAt: typeof item.unpublishAt === 'string' ? item.unpublishAt : '',
          })),
        )
      }
      if (Array.isArray(pubData.publications)) {
        setPublications(
          pubData.publications.map((item: Record<string, unknown>, index: number) => ({
            slug: String(item.slug ?? ''),
            title: String(item.title ?? ''),
            excerpt: String(item.excerpt ?? ''),
            dateText: String(item.dateText ?? item.date ?? ''),
            dateline: String(item.dateline ?? ''),
            image: String(item.image ?? ''),
            href: String(item.href ?? `/publications/${item.slug ?? ''}`),
            sortOrder: Number(item.sortOrder ?? index + 1),
            published: Boolean(item.published ?? true),
            publishAt: typeof item.publishAt === 'string' ? item.publishAt : '',
            unpublishAt: typeof item.unpublishAt === 'string' ? item.unpublishAt : '',
          })),
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
      await loadRevisions('faqs')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save FAQs')
    } finally {
      setSaving(false)
    }
  }

  async function savePublications() {
    setSaving(true)
    setMessage(null)
    setError(null)
    try {
      const res = await fetch('/api/admin/cms/publications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publications: publications.map((item) => ({
            ...item,
            publishAt: item.publishAt ? item.publishAt : '',
            unpublishAt: item.unpublishAt ? item.unpublishAt : '',
          })),
          revisionTitle,
          revisionNote,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(typeof data.error === 'string' ? data.error : 'Failed to save publications')
      setMessage('Publications saved successfully.')
      setRevisionTitle('')
      setRevisionNote('')
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
              <div className="admin-inline-actions">
                <input
                  className="admin-form__input"
                  value={item.category}
                  onChange={(e) =>
                    setFaqs((current) => current.map((x, i) => (i === index ? { ...x, category: e.target.value } : x)))
                  }
                  placeholder="Category"
                />
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
              <div className="admin-split-grid">
                <label>
                  Slug
                  <input
                    className="admin-form__input"
                    value={item.slug}
                    onChange={(e) =>
                      setPublications((current) => current.map((x, i) => (i === index ? { ...x, slug: e.target.value } : x)))
                    }
                  />
                </label>
                <label>
                  Date
                  <input
                    className="admin-form__input"
                    value={item.dateText}
                    onChange={(e) =>
                      setPublications((current) => current.map((x, i) => (i === index ? { ...x, dateText: e.target.value } : x)))
                    }
                  />
                </label>
              </div>
              <div className="admin-split-grid">
                <label>
                  Dateline
                  <input
                    className="admin-form__input"
                    value={item.dateline}
                    onChange={(e) =>
                      setPublications((current) => current.map((x, i) => (i === index ? { ...x, dateline: e.target.value } : x)))
                    }
                  />
                </label>
                <label>
                  Link URL
                  <input
                    className="admin-form__input"
                    value={item.href}
                    onChange={(e) =>
                      setPublications((current) => current.map((x, i) => (i === index ? { ...x, href: e.target.value } : x)))
                    }
                  />
                </label>
              </div>
              <label className="admin-form__label">Image URL</label>
              <input
                className="admin-form__input"
                value={item.image}
                onChange={(e) =>
                  setPublications((current) => current.map((x, i) => (i === index ? { ...x, image: e.target.value } : x)))
                }
              />
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
