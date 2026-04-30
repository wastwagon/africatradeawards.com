"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { UserRole } from "@prisma/client";
import { resolvePostLoginPath } from "@/lib/post-login-redirect";
import PlatformSiteChrome from "@/components/platform/PlatformSiteChrome";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextRaw = searchParams.get("next");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/auth/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, fullName }),
    });

    setLoading(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError((body.error as string) ?? "Registration failed");
      return;
    }

    const data = await res.json();
    const role = data.user?.role as UserRole;
    if (role !== UserRole.VOTER) {
      setError("Unexpected account type");
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
          <div className="platform-page-header platform-page-header--center">
            <p className="platform-eyebrow">Africa Trade Awards · Public vote</p>
            <h1 className="platform-title">Create a voter account</h1>
            <p className="platform-lead">
              Free account to track the entries you vote for and see how they rank in their category. You must be signed in
              before voting for votes to appear here.
            </p>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-7">
              <div className="platform-card">
                <form onSubmit={onSubmit}>
                  <label className="platform-field">
                    Full name
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      autoComplete="name"
                    />
                  </label>
                  <label className="platform-field">
                    Email
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </label>
                  <label className="platform-field">
                    Password (at least 10 characters)
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={10}
                      autoComplete="new-password"
                    />
                  </label>
                  {error ? <p className="platform-msg-error">{error}</p> : null}
                  <button type="submit" className="vl-btn1" disabled={loading}>
                    {loading ? "Creating account…" : "Create account"}
                  </button>
                </form>
                <p className="platform-muted" style={{ marginTop: "1.25rem", marginBottom: 0 }}>
                  Already have an account? <Link href="/login/?next=%2Fportal%2Fvoter%2F">Sign in</Link>
                  {" · "}
                  <Link href="/vote/">Public voting</Link>
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

export default function RegisterPage() {
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
      <RegisterForm />
    </Suspense>
  );
}
