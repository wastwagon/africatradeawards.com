'use client'

import { useCallback, useRef, useState } from "react";

export type AdminToastKind = "success" | "error" | "info";

export type AdminToastItem = {
  id: number;
  kind: AdminToastKind;
  message: string;
};

export default function useAdminToastQueue(limit = 4) {
  const [toasts, setToasts] = useState<AdminToastItem[]>([]);
  const nextIdRef = useRef(1);

  const pushToast = useCallback(
    (kind: AdminToastKind, message: string) => {
      const text = message.trim();
      if (!text) return;
      const id = nextIdRef.current++;
      setToasts((current) => [...current, { id, kind, message: text }].slice(-limit));
    },
    [limit]
  );

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  return { toasts, pushToast, dismissToast };
}
