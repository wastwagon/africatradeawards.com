"use client";

import { useEffect, useState } from "react";

type MeResponse = {
  ok?: boolean;
  session?: {
    impersonatedBy?: {
      userId: string;
      email: string;
      role: string;
    } | null;
  };
};

type ImpersonatedBy = NonNullable<NonNullable<MeResponse["session"]>["impersonatedBy"]>;

export default function ImpersonationBanner() {
  const [impersonatedBy, setImpersonatedBy] = useState<ImpersonatedBy | null>(null);
  const [stopping, setStopping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = (await res.json().catch(() => ({}))) as MeResponse;
      if (res.ok && data.session?.impersonatedBy) {
        setImpersonatedBy(data.session.impersonatedBy);
      }
    })();
  }, []);

  async function stopImpersonation() {
    setStopping(true);
    setError(null);
    const res = await fetch("/api/auth/impersonate/stop", { method: "POST" });
    const data = (await res.json().catch(() => ({}))) as { error?: string; redirectTo?: string };
    setStopping(false);
    if (!res.ok) {
      setError(data.error ?? "Could not stop impersonation");
      return;
    }
    window.location.href = data.redirectTo || "/admin/";
  }

  if (!impersonatedBy) return null;

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "#2f1f39",
        color: "#fff",
        padding: "8px 14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
      }}
    >
      <span>
        Impersonation active. Acting as another user. Original admin: <strong>{impersonatedBy.email}</strong>.
      </span>
      <button
        type="button"
        onClick={stopImpersonation}
        disabled={stopping}
        style={{
          border: "1px solid rgba(255,255,255,0.35)",
          color: "#fff",
          background: "transparent",
          borderRadius: 8,
          padding: "6px 10px",
          cursor: "pointer",
          fontWeight: 700,
        }}
      >
        {stopping ? "Returning..." : "Stop impersonation"}
      </button>
      {error ? <span style={{ color: "#ffb8bf" }}>{error}</span> : null}
    </div>
  );
}
