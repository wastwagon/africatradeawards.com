'use client'

import { KeyboardEvent, MouseEvent, ReactNode, useEffect, useRef } from "react";

type AdminActionModalProps = {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
};

export default function AdminActionModal({ open, title, description, onClose, children }: AdminActionModalProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const id = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 0);
    return () => {
      window.clearTimeout(id);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  function onOverlayMouseDown(event: MouseEvent<HTMLDivElement>) {
    if (event.target === overlayRef.current) {
      onClose();
    }
  }

  function onDialogKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key !== "Tab") return;
    const root = cardRef.current;
    if (!root) return;
    const focusables = root.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement as HTMLElement | null;
    if (event.shiftKey) {
      if (active === first || !root.contains(active)) {
        event.preventDefault();
        last.focus();
      }
    } else if (active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="admin-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={onOverlayMouseDown}
      onKeyDown={onDialogKeyDown}
    >
      <div ref={cardRef} className="admin-modal-card">
        <div className="admin-modal-head">
          <h2>{title}</h2>
          <button ref={closeButtonRef} type="button" onClick={onClose} aria-label="Close dialog">
            Close
          </button>
        </div>
        {description ? <p className="admin-muted">{description}</p> : null}
        <div className="admin-modal-body">{children}</div>
      </div>
    </div>
  );
}
