'use client'

import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect, useRef, useState } from 'react'
import styles from './PublicationBodyEditor.module.css'

type Props = {
  value: string
  onChange: (html: string) => void
  disabled?: boolean
}

export default function PublicationBodyEditor({ value, onChange, disabled }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const skipNextOnChange = useRef(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
    extensions: [
      StarterKit.configure({
        code: false,
        codeBlock: false,
        heading: { levels: [2, 3] },
        horizontalRule: false,
        link: {
          openOnClick: false,
          HTMLAttributes: {
            rel: 'noopener noreferrer',
            target: '_blank',
          },
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: styles.inlineImage,
        },
      }),
      Placeholder.configure({
        placeholder:
          'Write the article here. Use the toolbar for headings, lists, links, and images.',
      }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: styles.proseMirror,
      },
    },
    onUpdate: ({ editor: ed }) => {
      if (skipNextOnChange.current) {
        skipNextOnChange.current = false
        return
      }
      onChange(ed.getHTML())
    },
  })

  useEffect(() => {
    if (!editor) return
    if (editor.isFocused) return
    const next = value ?? ''
    const cur = editor.getHTML()
    if (next === cur) return
    skipNextOnChange.current = true
    editor.commands.setContent(next || '', { emitUpdate: false })
  }, [value, editor])

  useEffect(() => {
    if (editor) editor.setEditable(!disabled)
  }, [disabled, editor])

  async function onPickImage(files: FileList | null) {
    const file = files?.[0]
    if (!file || !editor) return
    setUploadError(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/cms/publication-image', {
        method: 'POST',
        body: fd,
        credentials: 'same-origin',
      })
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string }
      if (!res.ok) throw new Error(typeof data.error === 'string' ? data.error : 'Upload failed')
      const url = typeof data.url === 'string' ? data.url.trim() : ''
      if (!url) throw new Error('Upload failed')
      editor.chain().focus().setImage({ src: url }).run()
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Image upload failed')
    } finally {
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  function addLink() {
    if (!editor) return
    const previous = editor.getAttributes('link').href as string | undefined
    const next = window.prompt('Link URL', previous ?? 'https://')
    if (next === null) return
    const trimmed = next.trim()
    if (trimmed === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: trimmed }).run()
  }

  if (!editor) {
    return <div className={styles.loading}>Loading editor…</div>
  }

  return (
    <div className={`${styles.wrap} ${disabled ? styles.disabled : ''}`}>
      <input
        ref={fileRef}
        type="file"
        className={styles.hiddenFile}
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        tabIndex={-1}
        aria-hidden
        onChange={(e) => void onPickImage(e.target.files)}
      />
      <div className={styles.toolbar} role="toolbar" aria-label="Article formatting">
        <button
          type="button"
          className={editor.isActive('bold') ? styles.toolbarBtnActive : ''}
          onClick={() => editor.chain().focus().toggleBold().run()}
          aria-label="Bold text"
          title="Bold text"
        >
          Bold
        </button>
        <button
          type="button"
          className={editor.isActive('italic') ? styles.toolbarBtnActive : ''}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          aria-label="Italic text"
          title="Italic text"
        >
          Italic
        </button>
        <button
          type="button"
          className={editor.isActive('underline') ? styles.toolbarBtnActive : ''}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          aria-label="Underline text"
          title="Underline text"
        >
          Underline
        </button>
        <button
          type="button"
          className={editor.isActive('heading', { level: 2 }) ? styles.toolbarBtnActive : ''}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          aria-label="Section heading"
          title="Section heading"
        >
          Heading
        </button>
        <button
          type="button"
          className={editor.isActive('heading', { level: 3 }) ? styles.toolbarBtnActive : ''}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          aria-label="Subheading"
          title="Subheading"
        >
          Subheading
        </button>
        <button
          type="button"
          className={editor.isActive('bulletList') ? styles.toolbarBtnActive : ''}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet list"
        >
          • List
        </button>
        <button
          type="button"
          className={editor.isActive('orderedList') ? styles.toolbarBtnActive : ''}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered list"
        >
          1. List
        </button>
        <button
          type="button"
          className={editor.isActive('blockquote') ? styles.toolbarBtnActive : ''}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          aria-label="Quote block"
          title="Quote block"
        >
          Quote
        </button>
        <button type="button" onClick={addLink} aria-label="Insert or edit link" title="Insert or edit link">
          Link
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          aria-label="Insert image from file"
          title="Insert image from file"
        >
          Image
        </button>
      </div>
      {uploadError ? (
        <p className="admin-error" style={{ margin: '8px 12px 0', fontSize: 13 }}>
          {uploadError}
        </p>
      ) : null}
      <div className={styles.editorShell}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
