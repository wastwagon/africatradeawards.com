"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { UserRole } from "@prisma/client";
import { resolvePostLoginPath } from "@/lib/post-login-redirect";
import PlatformSiteChrome from "@/components/platform/PlatformSiteChrome";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextRaw = searchParams.get("next");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError((body.error as string) ?? "Sign-in failed");
      return;
    }

    const data = await res.json();
    const role = data.user?.role as UserRole;
    if (!role) {
      setError("Invalid session response");
      return;
    }

    const dest = resolvePostLoginPath(role, nextRaw);
    router.push(dest);
    router.refresh();
  }

  return (
    <PlatformSiteChrome>
      <section className="platform-page">
        <div className="container">
          <div className="platform-page-header">
            <p className="platform-eyebrow">Awards platform</p>
            <h1 className="platform-title">Sign In</h1>
            <p className="platform-lead">
              One account for programme managers, auditors, judges, and entrants. After you sign in, we send you straight to
              the right workspace.
            </p>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-7">
              <div className="platform-card">
                <form onSubmit={onSubmit}>
                  <label className="platform-field">
                    Email
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="username"
                    />
                  </label>
                  <label className="platform-field">
                    Password
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                    />
                  </label>
                  {error ? <p className="platform-msg-error">{error}</p> : null}
                  <button type="submit" className="vl-btn1" disabled={loading}>
                    {loading ? "Signing in…" : "Sign In"}
                  </button>
                </form>
                <p className="platform-muted" style={{ marginTop: "1.25rem", marginBottom: 0 }}>
                  <Link href="/vote/">Public voting</Link>
                  {" · "}
                  <Link href="/portal/nominator/">Nominator portal</Link>
                  {" · "}
                  <Link href="/portal/entrant/">Entrant portal</Link>
                  {" · "}
                  <Link href="/">Home</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PlatformSiteChrome>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <PlatformSiteChrome>
          <section className="platform-page">
            <div className="container text-center">
              <p className="platform-lead">Loading…</p>
            </div>
          </section>
        </PlatformSiteChrome>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
