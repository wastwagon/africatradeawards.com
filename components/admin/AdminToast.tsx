'use client'

import { CSSProperties } from "react";
import { useEffect } from "react";

type AdminToastProps = {
  kind: "success" | "error" | "info";
  message: string;
  onClose: () => void;
  timeoutMs?: number;
  style?: CSSProperties;
};

export default function AdminToast({ kind, message, onClose, timeoutMs = 3500, style }: AdminToastProps) {
  useEffect(() => {
    const id = window.setTimeout(() => onClose(), timeoutMs);
    return () => window.clearTimeout(id);
  }, [onClose, timeoutMs]);

  return (
    <div className={`admin-toast admin-toast--${kind}`} role="status" aria-live="polite" style={style}>
      <span>{message}</span>
      <button type="button" onClick={onClose} aria-label="Close notification">
        ×
      </button>
    </div>
  );
}
