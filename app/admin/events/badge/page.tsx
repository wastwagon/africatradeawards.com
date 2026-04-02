'use client'

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { fetchJsonOrThrow, toErrorMessage } from "@/components/admin/admin-api";
import useAdminAsyncAction from "@/components/admin/useAdminAsyncAction";
import useAdminFeedback from "@/components/admin/useAdminFeedback";
import AdminToastViewport from "@/components/admin/AdminToastViewport";

type Role = "SUPER_ADMIN" | "PROGRAM_MANAGER" | "AUDITOR" | "JUDGE" | "ENTRANT";

type BadgeRegistration = {
  attendeeFullName: string;
  attendeeEmail: string;
  organization: string | null;
  roleTitle: string | null;
  qrTokenHint: string;
  checkedInAt: string | null;
  event: {
    name: string;
    venueName: string;
    startsAt: string;
  };
  _count: {
    checkIns: number;
    badgePrintLogs: number;
  };
};

export default function AdminBadgePrintPage() {
  const params = useSearchParams();
  const eventId = params.get("eventId") ?? "";
  const registrationId = params.get("registrationId") ?? "";
  const [registration, setRegistration] = useState<BadgeRegistration | null>(null);
  const [badgeSignature, setBadgeSignature] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [needsOverride, setNeedsOverride] = useState(false);
  const [printsLast24h, setPrintsLast24h] = useState(0);
  const [overridePolicy, setOverridePolicy] = useState(false);
  const [overrideReason, setOverrideReason] = useState("");
  const { isBusy: loading, withBusy } = useAdminAsyncAction();
  const { toasts, dismissToast, setErrorMessage: setError } = useAdminFeedback();

  const canLoad = useMemo(() => eventId.length > 5 && registrationId.length > 5, [eventId, registrationId]);

  useEffect(() => {
    if (!canLoad) return;
    setError(null);
    void (async () => {
      await withBusy(async () => {
        try {
          const data = await fetchJsonOrThrow<{
            registration?: BadgeRegistration;
            badgeSignature?: string;
            userRole?: Role;
            reprintPolicy?: { needsOverride?: boolean; printsLast24h?: number };
          }>(`/api/events/${eventId}/registrations/${registrationId}/badge`, { cache: "no-store" }, "Could not load badge data");
          setRegistration(data.registration ?? null);
          setBadgeSignature(data.badgeSignature ?? null);
          setUserRole((data.userRole ?? null) as Role | null);
          setNeedsOverride(Boolean(data.reprintPolicy?.needsOverride));
          setPrintsLast24h(Number(data.reprintPolicy?.printsLast24h ?? 0));
        } catch (err) {
          setError(toErrorMessage(err, "Could not load badge data"));
        }
      });
    })();
  }, [canLoad, eventId, registrationId, setError, withBusy]);

  return (
    <main>
      <h1>Badge print studio</h1>
      <p className="admin-muted">Generate a printable attendee badge template and print directly from this page.</p>
      <AdminToastViewport toasts={toasts} onClose={dismissToast} />
      {loading ? <p className="admin-muted">Loading badge data...</p> : null}
      {!canLoad ? <p className="admin-error">Missing eventId or registrationId in query parameters.</p> : null}

      {registration ? (
        <>
          <section>
            <div className="badge-print-card">
              <p className="badge-print-kicker">{registration.event.name}</p>
              <h2>{registration.attendeeFullName}</h2>
              <p>{registration.roleTitle || "Attendee"}</p>
              <p>{registration.organization || "—"}</p>
              <hr />
              <p>{registration.attendeeEmail}</p>
              <p>{registration.event.venueName}</p>
              <p>{new Date(registration.event.startsAt).toLocaleString()}</p>
              <p>Pass ref: {registration.qrTokenHint}</p>
              <p>Badge sig: {badgeSignature ?? "—"}</p>
            </div>
          </section>

          <section>
            {needsOverride && userRole !== "SUPER_ADMIN" ? (
              <div className="admin-form">
                <label>
                  <input type="checkbox" checked={overridePolicy} onChange={(e) => setOverridePolicy(e.target.checked)} />
                  Acknowledge override for policy-triggered reprint
                </label>
                <label>
                  Override reason (required, min 12 chars)
                  <textarea rows={3} value={overrideReason} onChange={(e) => setOverrideReason(e.target.value)} />
                </label>
                <p className="admin-muted">Policy trigger: {printsLast24h} prints in last 24h or rapid reprint interval.</p>
              </div>
            ) : null}
            <div className="admin-inline-actions">
              <button
                type="button"
                className="admin-quick-action"
                onClick={() => {
                  window.print();
                }}
              >
                Print badge
              </button>
              <a
                className="admin-quick-action"
                href={`/api/events/${eventId}/registrations/${registrationId}/badge/pdf?overridePolicy=${
                  overridePolicy ? "1" : "0"
                }&overrideReason=${encodeURIComponent(overrideReason.trim())}`}
                target="_blank"
                rel="noreferrer"
                onClick={(event) => {
                  if (needsOverride && userRole !== "SUPER_ADMIN") {
                    if (!overridePolicy || overrideReason.trim().length < 12) {
                      event.preventDefault();
                      setError("Override acknowledgement and reason (min 12 chars) are required.");
                    }
                  }
                }}
              >
                Open signed PDF
              </a>
            </div>
          </section>
        </>
      ) : null}

      <style jsx>{`
        .badge-print-card {
          max-width: 420px;
          background: linear-gradient(160deg, #141414, #1f1f1f);
          border: 1px solid rgba(255, 255, 255, 0.18);
          color: #fff;
          border-radius: 18px;
          padding: 20px;
          display: grid;
          gap: 6px;
        }
        .badge-print-kicker {
          color: #f8c43d;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 12px;
        }
        @media print {
          :global(.admin-shell__sidebar),
          :global(.admin-command-launch) {
            display: none !important;
          }
          .badge-print-card {
            box-shadow: none;
            border: 2px solid #000;
            break-inside: avoid;
          }
        }
      `}</style>
    </main>
  );
}
