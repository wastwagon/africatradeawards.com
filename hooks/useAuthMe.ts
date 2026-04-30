"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export type AuthMeUser = {
  id: string;
  email: string;
  fullName: string;
  role: string;
};

export function useAuthMe() {
  const pathname = usePathname();
  const [user, setUser] = useState<AuthMeUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch("/api/auth/me", { credentials: "include", cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { user?: AuthMeUser } | null) => {
        if (cancelled) return;
        setUser(data?.user ?? null);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return { user, loading };
}
