"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

type Props = {
  className?: string;
  children?: ReactNode;
  /** After cookie is cleared, before navigation (e.g. close mobile drawer). */
  onLoggedOut?: () => void;
};

/**
 * Clears session via POST /api/auth/logout, then refreshes client state and redirects.
 * (A plain form POST to the JSON route would leave the browser showing the JSON body.)
 */
export default function LogoutButton({ className, children = "Log out", onLoggedOut }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    if (pending) return;
    setPending(true);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      if (!res.ok) return;
      onLoggedOut?.();
      router.refresh();
      router.push("/login/");
    } finally {
      setPending(false);
    }
  }

  return (
    <button type="button" className={className} onClick={() => void handleLogout()} disabled={pending}>
      {pending ? "Signing out…" : children}
    </button>
  );
}
