"use client";

import { useEffect, useState } from "react";

/**
 * Keeps the manager-only open inquiry count in sync when returning to the tab
 * (e.g. after triage in another window). Auditors: pass `undefined`, hook is a no-op.
 */
export function useSyncOpenContactCount(openContactInquiries?: number) {
  const [value, setValue] = useState<number | undefined>(() => openContactInquiries);

  useEffect(() => {
    setValue(openContactInquiries);
  }, [openContactInquiries]);

  useEffect(() => {
    if (openContactInquiries === undefined) return;

    async function refresh() {
      const res = await fetch("/api/admin/contact-inquiries/open-count");
      if (!res.ok) return;
      const data = (await res.json().catch(() => ({}))) as { open?: number };
      if (typeof data.open === "number") setValue(data.open);
    }

    const onVisibility = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [openContactInquiries]);

  return openContactInquiries === undefined ? undefined : value;
}
