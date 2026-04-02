'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchJson, fetchJsonOrThrow, getApiErrorMessage, toErrorMessage } from "@/components/admin/admin-api";
import useAdminAsyncAction from "@/components/admin/useAdminAsyncAction";
import useAdminFeedback from "@/components/admin/useAdminFeedback";
import AdminToastViewport from "@/components/admin/AdminToastViewport";

type EventRow = {
  id: string;
  name: string;
  startsAt: string;
  venueName: string;
};

type QueuedCheckIn = {
  id: string;
  qrPayload: string;
  location: string;
  deviceLabel: string;
  queuedAt: string;
  attempts: number;
  state: "pending" | "conflict";
  lastError?: string;
};

type ScanPayload = {
  type?: string;
  eventId?: string;
  registrationId?: string;
  token?: string;
};

type CheckInSource = "CAMERA" | "MANUAL" | "OFFLINE_SYNC" | "API";
const QUEUE_WARN_AGE_MS = 10 * 60 * 1000;
const QUEUE_CRITICAL_AGE_MS = 30 * 60 * 1000;
const QUEUE_WARN_COUNT = 25;
const INCIDENT_REPORT_COOLDOWN_MS = 10 * 60 * 1000;

function formatAge(ms: number): string {
  if (ms < 60 * 1000) return `${Math.max(1, Math.round(ms / 1000))}s`;
  const minutes = Math.floor(ms / 60000);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return `${hours}h ${remaining}m`;
}

function queueKey(eventId: string): string {
  return `event_checkin_queue_${eventId}`;
}

function isLocalQueueId(id: string): boolean {
  return id.startsWith("local_");
}

function sessionKey(eventId: string): string {
  return `event_scanner_session_${eventId}`;
}

function incidentReportKey(eventId: string): string {
  return `event_scanner_incident_report_${eventId}`;
}

function queueItemId(): string {
  return `local_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function parseScanPayload(raw: string): ScanPayload | null {
  try {
    const payload = JSON.parse(raw) as ScanPayload;
    if (!payload?.registrationId || !payload?.token) return null;
    return payload;
  } catch {
    return null;
  }
}

export default function EventCheckinDeskPage() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [location, setLocation] = useState("Main entrance");
  const [deviceLabel, setDeviceLabel] = useState("Scanner desk A");
  const [manualPayload, setManualPayload] = useState("");
  const [cameraOn, setCameraOn] = useState(false);
  const [sessionPin, setSessionPin] = useState("");
  const [sessionMinutes, setSessionMinutes] = useState(120);
  const [sessionLocked, setSessionLocked] = useState(true);
  const [sessionPinInput, setSessionPinInput] = useState("");
  const [lastScan, setLastScan] = useState<string | null>(null);
  const [queued, setQueued] = useState<QueuedCheckIn[]>([]);
  const { isBusy: busy, withBusy } = useAdminAsyncAction();
  const { toasts, dismissToast, setSuccessMessage: setStatus, setErrorMessage: setError } = useAdminFeedback();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectorRef = useRef<{ detect: (source: ImageBitmapSource) => Promise<Array<{ rawValue?: string }>> } | null>(null);
  const rafRef = useRef<number | null>(null);
  const dedupeRef = useRef<string>("");
  const dedupeAtRef = useRef<number>(0);
  const lastActivityRef = useRef<number>(Date.now());

  const selectedEvent = useMemo(
    () => events.find((event) => event.id === selectedEventId) ?? null,
    [events, selectedEventId]
  );

  const queueRisk = useMemo(() => {
    const now = Date.now();
    let oldestPendingAgeMs = 0;
    let warningAgeCount = 0;
    let criticalAgeCount = 0;
    let conflictCount = 0;
    for (const item of queued) {
      const ageMs = Math.max(0, now - new Date(item.queuedAt).getTime());
      if (item.state === "conflict") conflictCount += 1;
      if (item.state === "pending") {
        if (ageMs > oldestPendingAgeMs) oldestPendingAgeMs = ageMs;
        if (ageMs >= QUEUE_WARN_AGE_MS) warningAgeCount += 1;
        if (ageMs >= QUEUE_CRITICAL_AGE_MS) criticalAgeCount += 1;
      }
    }
    return {
      size: queued.length,
      conflictCount,
      warningAgeCount,
      criticalAgeCount,
      oldestPendingAgeMs,
      hasRisk: queued.length >= QUEUE_WARN_COUNT || warningAgeCount > 0 || conflictCount > 0,
      isCritical: criticalAgeCount > 0 || conflictCount >= 5,
    };
  }, [queued]);

  const refreshQueue = useCallback(async () => {
    if (!selectedEventId) {
      setQueued([]);
      return;
    }

    let localQueued: QueuedCheckIn[] = [];
    try {
      const raw = window.localStorage.getItem(queueKey(selectedEventId));
      const parsed = raw ? (JSON.parse(raw) as QueuedCheckIn[]) : [];
      localQueued = Array.isArray(parsed) ? parsed : [];
    } catch {
      localQueued = [];
    }

    try {
      const data = await fetchJsonOrThrow<{ items?: Array<Record<string, unknown>> }>(
        `/api/events/${selectedEventId}/checkin-queue`,
        { cache: "no-store" },
        "Could not load check-in queue"
      );
      const remoteQueued = ((data.items ?? []) as Array<Record<string, unknown>>).map((item) => ({
        id: String(item.id),
        qrPayload: String(item.qrPayload ?? ""),
        location: String(item.location ?? ""),
        deviceLabel: String(item.deviceLabel ?? ""),
        queuedAt: String(item.queuedAt ?? new Date().toISOString()),
        attempts: Number(item.attempts ?? 0),
        state: (String(item.state ?? "PENDING").toLowerCase() === "conflict" ? "conflict" : "pending") as
          | "pending"
          | "conflict",
        lastError: item.lastError ? String(item.lastError) : undefined,
      }));
      setQueued([...remoteQueued, ...localQueued].slice(0, 500));
    } catch {
      setQueued(localQueued);
    }
  }, [selectedEventId]);

  const persistLocalQueue = useCallback(
    (next: QueuedCheckIn[]) => {
      if (!selectedEventId) return;
      window.localStorage.setItem(queueKey(selectedEventId), JSON.stringify(next.filter((item) => isLocalQueueId(item.id))));
    },
    [selectedEventId]
  );

  const queueOffline = useCallback(
    (payload: Omit<QueuedCheckIn, "id" | "attempts" | "state">) => {
      if (!selectedEventId) return;
      const fallbackItem: QueuedCheckIn = {
        id: queueItemId(),
        qrPayload: payload.qrPayload,
        location: payload.location,
        deviceLabel: payload.deviceLabel,
        queuedAt: payload.queuedAt,
        attempts: 0,
        state: "pending",
      };
      void (async () => {
        try {
          const response = await fetch(`/api/events/${selectedEventId}/checkin-queue`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              qrPayload: payload.qrPayload,
              location: payload.location,
              deviceLabel: payload.deviceLabel,
              source: "OFFLINE_SYNC",
              queuedAt: payload.queuedAt,
            }),
          });
          if (!response.ok) throw new Error("queue_create_failed");
          await refreshQueue();
        } catch {
          const next = [fallbackItem, ...queued.filter((item) => isLocalQueueId(item.id))].slice(0, 300);
          persistLocalQueue(next);
          setQueued((current) => [fallbackItem, ...current].slice(0, 500));
        }
      })();
    },
    [persistLocalQueue, queued, refreshQueue, selectedEventId]
  );

  const performCheckIn = useCallback(
    async (qrPayload: string, source: CheckInSource): Promise<{ ok: boolean; recoverable: boolean; message: string }> => {
      if (!selectedEventId) throw new Error("Select event first");
      const parsed = parseScanPayload(qrPayload);
      if (!parsed) throw new Error("Invalid QR payload");
      if (parsed.eventId && parsed.eventId !== selectedEventId) {
        throw new Error("Scanned pass belongs to another event");
      }

      const body = {
        qrPayload,
        source,
        location,
        deviceLabel,
      };

      try {
        const result = await fetchJson<{ attendee?: { fullName?: string }; error?: string }>(
          `/api/events/${selectedEventId}/checkins`,
          {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          }
        );
        if (!result.ok) {
          const message = getApiErrorMessage(result.data, "Check-in failed");
          const recoverable = result.status >= 500 || result.status === 429;
          return { ok: false, recoverable, message };
        }
        return {
          ok: true,
          recoverable: false,
          message: `Checked in ${result.data.attendee?.fullName ?? "attendee"}`,
        };
      } catch (err) {
        return {
          ok: false,
          recoverable: true,
          message: toErrorMessage(err, "Network error"),
        };
      }
    },
    [deviceLabel, location, selectedEventId]
  );

  const scanLoop = useCallback(async () => {
    if (!cameraOn || !videoRef.current || !detectorRef.current) return;
    try {
      const codes = await detectorRef.current.detect(videoRef.current);
      const raw = codes[0]?.rawValue?.trim();
      if (raw) {
        const now = Date.now();
        const isDuplicate = dedupeRef.current === raw && now - dedupeAtRef.current < 4000;
        if (!isDuplicate) {
          dedupeRef.current = raw;
          dedupeAtRef.current = now;
          setLastScan(raw);
          const result = await performCheckIn(raw, "CAMERA");
          if (result.ok) {
            setStatus(result.message);
            setError(null);
          } else if (result.recoverable) {
            queueOffline({
              qrPayload: raw,
              location,
              deviceLabel,
              queuedAt: new Date().toISOString(),
            });
            setError(`${result.message}. Saved to offline queue.`);
          } else {
            setError(result.message);
          }
        }
      }
    } catch {
      /* ignore detector frame errors */
    }
    rafRef.current = window.requestAnimationFrame(() => {
      void scanLoop();
    });
  }, [cameraOn, deviceLabel, location, performCheckIn, queueOffline, setError, setStatus]);

  const stopCamera = useCallback(() => {
    setCameraOn(false);
    if (rafRef.current != null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) track.stop();
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    if (sessionLocked) {
      setError("Unlock scanner session first");
      return;
    }
    if (!selectedEventId) {
      setError("Select event before starting scanner");
      return;
    }
    if (!("mediaDevices" in navigator) || !navigator.mediaDevices.getUserMedia) {
      setError("Camera API not supported in this browser");
      return;
    }
    if (!("BarcodeDetector" in window)) {
      setError("Barcode scanner not supported in this browser. Use manual payload mode.");
      return;
    }
    try {
      const detector = new (window as unknown as { BarcodeDetector: new (opts: { formats: string[] }) => { detect: (source: ImageBitmapSource) => Promise<Array<{ rawValue?: string }>> } }).BarcodeDetector({
        formats: ["qr_code"],
      });
      detectorRef.current = detector;
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setError(null);
      setStatus("Camera scanner active");
      setCameraOn(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start camera scanner");
      stopCamera();
    }
  }, [selectedEventId, sessionLocked, setError, setStatus, stopCamera]);

  async function syncQueued() {
    if (!selectedEventId || queued.length === 0) return;
    setStatus(null);
    setError(null);
    await withBusy(async () => {
      let success = 0;
      const localNext: QueuedCheckIn[] = [];
      for (const item of queued) {
        const result = await performCheckIn(item.qrPayload, "OFFLINE_SYNC");
        if (result.ok) {
          success += 1;
          if (!isLocalQueueId(item.id)) {
            await fetch(`/api/events/${selectedEventId}/checkin-queue/${item.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                state: "SYNCED",
                attempts: item.attempts + 1,
                processed: true,
              }),
            }).catch(() => null);
          }
        } else if (result.recoverable) {
          const nextItem = {
            ...item,
            attempts: item.attempts + 1,
            state: "pending",
            lastError: result.message,
          } as QueuedCheckIn;
          if (isLocalQueueId(item.id)) {
            localNext.push(nextItem);
          } else {
            await fetch(`/api/events/${selectedEventId}/checkin-queue/${item.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                state: "PENDING",
                attempts: nextItem.attempts,
                lastError: nextItem.lastError,
              }),
            }).catch(() => null);
          }
        } else {
          const nextItem = {
            ...item,
            attempts: item.attempts + 1,
            state: "conflict",
            lastError: result.message,
          } as QueuedCheckIn;
          if (isLocalQueueId(item.id)) {
            localNext.push(nextItem);
          } else {
            await fetch(`/api/events/${selectedEventId}/checkin-queue/${item.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                state: "CONFLICT",
                attempts: nextItem.attempts,
                lastError: nextItem.lastError,
              }),
            }).catch(() => null);
          }
        }
      }
      persistLocalQueue(localNext);
      await refreshQueue();
      const remainingCount = localNext.length + queued.filter((item) => !isLocalQueueId(item.id)).length;
      if (remainingCount > 0) {
        setError(`Synced ${success}, some items still queued`);
      } else {
        setStatus(`Synced all ${success} queued check-ins`);
      }
    });
  }

  async function submitManual() {
    if (!manualPayload.trim()) return;
    const result = await performCheckIn(manualPayload.trim(), "MANUAL");
    if (result.ok) {
      setStatus(result.message);
      setError(null);
    } else if (result.recoverable) {
      queueOffline({
        qrPayload: manualPayload.trim(),
        location,
        deviceLabel,
        queuedAt: new Date().toISOString(),
      });
      setError(`${result.message}. Saved to offline queue.`);
    } else {
      setError(result.message);
    }
    setManualPayload("");
  }

  function unlockSession() {
    if (!selectedEventId) {
      setError("Select event first");
      return;
    }
    const pin = sessionPinInput.trim();
    if (pin.length < 4) {
      setError("PIN must be at least 4 digits");
      return;
    }
    const expiresAt = Date.now() + Math.max(5, sessionMinutes) * 60 * 1000;
    window.localStorage.setItem(
      sessionKey(selectedEventId),
      JSON.stringify({ pin, expiresAt, deviceLabel })
    );
    setSessionPin(pin);
    setSessionLocked(false);
    setSessionPinInput("");
    setError(null);
    setStatus("Scanner session unlocked");
  }

  const lockSession = useCallback(() => {
    stopCamera();
    setSessionLocked(true);
    setSessionPin("");
    setSessionPinInput("");
    if (selectedEventId) {
      window.localStorage.removeItem(sessionKey(selectedEventId));
    }
  }, [selectedEventId, stopCamera]);

  async function removeQueued(id: string) {
    if (!selectedEventId) return;
    if (isLocalQueueId(id)) {
      const next = queued.filter((item) => item.id !== id && isLocalQueueId(item.id));
      persistLocalQueue(next);
      await refreshQueue();
      return;
    }
    await fetch(`/api/events/${selectedEventId}/checkin-queue/${id}`, { method: "DELETE" }).catch(() => null);
    await refreshQueue();
  }

  async function retryQueued(id: string) {
    const target = queued.find((item) => item.id === id);
    if (!target) return;
    const result = await performCheckIn(target.qrPayload, "OFFLINE_SYNC");
    if (result.ok) {
      setStatus(result.message);
      setError(null);
      await removeQueued(id);
      return;
    }
    const nextState = result.recoverable ? "pending" : "conflict";
    if (isLocalQueueId(id)) {
      const localNext = queued
        .filter((item) => isLocalQueueId(item.id))
        .map((item) =>
          item.id === id
            ? {
                ...item,
                attempts: item.attempts + 1,
                state: nextState as "pending" | "conflict",
                lastError: result.message,
              }
            : item
        );
      persistLocalQueue(localNext);
    } else if (selectedEventId) {
      const nextAttempts = target.attempts + 1;
      await fetch(`/api/events/${selectedEventId}/checkin-queue/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          state: nextState === "pending" ? "PENDING" : "CONFLICT",
          attempts: nextAttempts,
          lastError: result.message,
        }),
      }).catch(() => null);
    }
    await refreshQueue();
    setError(result.message);
  }

  useEffect(() => {
    void (async () => {
      try {
        const data = await fetchJsonOrThrow<{ events?: EventRow[] }>("/api/events", { cache: "no-store" }, "Could not load events");
        const items = (data.events ?? []) as EventRow[];
        setEvents(items);
        if (items[0]?.id) setSelectedEventId(items[0].id);
      } catch (err) {
        setError(toErrorMessage(err, "Could not load events"));
      }
    })();
  }, [setError]);

  useEffect(() => {
    void refreshQueue();
  }, [refreshQueue]);

  useEffect(() => {
    if (!selectedEventId) return;
    try {
      const raw = window.localStorage.getItem(sessionKey(selectedEventId));
      if (!raw) {
        setSessionLocked(true);
        setSessionPin("");
        return;
      }
      const parsed = JSON.parse(raw) as { pin?: string; expiresAt?: number; deviceLabel?: string };
      if (!parsed.pin || !parsed.expiresAt || parsed.expiresAt < Date.now()) {
        setSessionLocked(true);
        setSessionPin("");
        return;
      }
      if (parsed.deviceLabel) setDeviceLabel(parsed.deviceLabel);
      setSessionPin(parsed.pin);
      setSessionLocked(false);
    } catch {
      setSessionLocked(true);
      setSessionPin("");
    }
  }, [selectedEventId]);

  useEffect(() => {
    const markActive = () => {
      lastActivityRef.current = Date.now();
    };
    window.addEventListener("mousemove", markActive);
    window.addEventListener("keydown", markActive);
    const timer = window.setInterval(() => {
      if (sessionLocked) return;
      if (Date.now() - lastActivityRef.current > 10 * 60 * 1000) {
        setStatus(null);
        setError("Scanner auto-locked due to inactivity");
        lockSession();
      }
    }, 30000);
    return () => {
      window.removeEventListener("mousemove", markActive);
      window.removeEventListener("keydown", markActive);
      window.clearInterval(timer);
    };
  }, [lockSession, sessionLocked, setError, setStatus]);

  useEffect(() => {
    if (!cameraOn) return;
    rafRef.current = window.requestAnimationFrame(() => {
      void scanLoop();
    });
    return () => {
      if (rafRef.current != null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [cameraOn, scanLoop]);

  useEffect(() => {
    if (!selectedEventId || !queueRisk.hasRisk) return;
    const key = incidentReportKey(selectedEventId);
    const now = Date.now();
    const signature = `${location}|${deviceLabel}|${queueRisk.size}|${queueRisk.conflictCount}|${queueRisk.warningAgeCount}|${queueRisk.criticalAgeCount}|${Math.floor(queueRisk.oldestPendingAgeMs / 60000)}`;
    let shouldSend = true;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw) as { sentAt?: number; signature?: string };
        if (
          parsed.sentAt &&
          now - parsed.sentAt < INCIDENT_REPORT_COOLDOWN_MS &&
          parsed.signature === signature
        ) {
          shouldSend = false;
        }
      }
    } catch {
      /* ignore bad local storage */
    }
    if (!shouldSend) return;

    void (async () => {
      const payload = {
        title: "Scanner queue risk",
        location,
        deviceLabel,
        queueSize: queueRisk.size,
        conflictCount: queueRisk.conflictCount,
        warningAgeCount: queueRisk.warningAgeCount,
        criticalAgeCount: queueRisk.criticalAgeCount,
        oldestPendingAgeMinutes: Math.floor(queueRisk.oldestPendingAgeMs / 60000),
      };
      const response = await fetch(`/api/events/${selectedEventId}/onsite-incidents/auto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => null);
      if (!response || !response.ok) return;
      window.localStorage.setItem(
        key,
        JSON.stringify({
          sentAt: now,
          signature,
        })
      );
    })();
  }, [deviceLabel, location, queueRisk, selectedEventId]);

  useEffect(() => stopCamera, [stopCamera]);

  return (
    <main>
      <h1>Check-in scanner desk</h1>
      <p className="admin-muted">Use camera QR scan for fast onsite check-ins. If network drops, scans are queued locally.</p>
      <AdminToastViewport toasts={toasts} onClose={dismissToast} />

      <section>
        <h2>Desk setup</h2>
        <form className="admin-form" onSubmit={(event) => event.preventDefault()}>
          <label>
            Event
            <select value={selectedEventId} onChange={(e) => setSelectedEventId(e.target.value)}>
              <option value="">Choose event</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.name} ({new Date(event.startsAt).toLocaleDateString()})
                </option>
              ))}
            </select>
          </label>
          <label>
            Location
            <input value={location} onChange={(e) => setLocation(e.target.value)} />
          </label>
          <label>
            Device label
            <input value={deviceLabel} onChange={(e) => setDeviceLabel(e.target.value)} />
          </label>
        </form>
        {selectedEvent ? (
          <p className="admin-muted">
            Active event: <strong>{selectedEvent.name}</strong> at {selectedEvent.venueName}
          </p>
        ) : null}
      </section>

      <section>
        <h2>Session security</h2>
        <p className="admin-muted">Lock scanner desks with a local PIN and auto-lock after inactivity.</p>
        <div className="admin-inline-actions">
          <input
            value={sessionPinInput}
            onChange={(e) => setSessionPinInput(e.target.value.replace(/\D/g, ""))}
            placeholder="PIN"
            inputMode="numeric"
            maxLength={8}
          />
          <input
            value={String(sessionMinutes)}
            onChange={(e) => setSessionMinutes(Math.max(5, Number(e.target.value || "5")))}
            placeholder="Minutes"
            inputMode="numeric"
          />
          <button type="button" className="admin-quick-action" onClick={unlockSession}>
            Unlock session
          </button>
          <button type="button" className="admin-quick-action" onClick={lockSession}>
            Lock now
          </button>
        </div>
        <p className="admin-muted">
          Session: {sessionLocked ? "Locked" : `Unlocked (PIN ${"*".repeat(Math.max(4, sessionPin.length))})`}
        </p>
      </section>

      <section>
        <h2>Camera scanner</h2>
        <div className="admin-inline-actions">
          <button type="button" className="admin-quick-action" onClick={() => void startCamera()} disabled={cameraOn}>
            Start scanner
          </button>
          <button type="button" className="admin-quick-action" onClick={stopCamera} disabled={!cameraOn}>
            Stop scanner
          </button>
        </div>
        <video
          ref={videoRef}
          muted
          playsInline
          style={{ width: "100%", maxWidth: 560, borderRadius: 12, border: "1px solid rgba(255,255,255,.15)", marginTop: 12 }}
        />
        {lastScan ? (
          <p className="admin-muted" style={{ marginTop: 10, wordBreak: "break-word" }}>
            Last scan: {lastScan}
          </p>
        ) : null}
      </section>

      <section>
        <h2>Manual payload mode</h2>
        <form
          className="admin-form"
          onSubmit={(event) => {
            event.preventDefault();
            void submitManual();
          }}
        >
          <label>
            QR payload JSON
            <textarea rows={4} value={manualPayload} onChange={(e) => setManualPayload(e.target.value)} />
          </label>
          <button type="submit">Check in from payload</button>
        </form>
      </section>

      <section>
        <h2>Offline queue</h2>
        <p className="admin-muted">{queued.length} queued scans waiting to sync.</p>
        {queueRisk.hasRisk ? (
          <p className={queueRisk.isCritical ? "admin-error" : "admin-muted"}>
            Queue risk: {queueRisk.size} total, {queueRisk.conflictCount} conflicts, {queueRisk.warningAgeCount} aged items (
            oldest {formatAge(queueRisk.oldestPendingAgeMs)}).
          </p>
        ) : null}
        <div className="admin-inline-actions">
          <button type="button" className="admin-quick-action" disabled={busy || queued.length === 0} onClick={() => void syncQueued()}>
            {busy ? "Syncing..." : "Sync queued scans"}
          </button>
        </div>
        {queued.length > 0 ? (
          <div className="admin-table-wrap" style={{ marginTop: 12 }}>
            <table>
              <thead>
                <tr>
                  <th>Queued at</th>
                  <th>Age</th>
                  <th>State</th>
                  <th>Attempts</th>
                  <th>Error</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {queued.map((item) => (
                  <tr key={item.id}>
                    <td>{new Date(item.queuedAt).toLocaleString()}</td>
                    <td>{formatAge(Math.max(0, Date.now() - new Date(item.queuedAt).getTime()))}</td>
                    <td>{item.state}</td>
                    <td>{item.attempts}</td>
                    <td>{item.lastError ?? "—"}</td>
                    <td>
                      <div className="admin-inline-actions">
                        <button type="button" onClick={() => void retryQueued(item.id)}>
                          Retry
                        </button>
                        <button type="button" onClick={() => void removeQueued(item.id)}>
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </main>
  );
}
