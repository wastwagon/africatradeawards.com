export const INCIDENT_ACK_SLA_MINUTES = 15;
export const INCIDENT_RESOLVE_SLA_MINUTES = 60;

export type IncidentSlaState = "ON_TRACK" | "ACK_BREACHED" | "RESOLVE_BREACHED" | "RESOLVED_LATE";

export function computeIncidentSlaState(input: {
  createdAt: Date;
  status: string;
  resolvedAt: Date | null;
  nowMs?: number;
}): IncidentSlaState {
  const nowMs = input.nowMs ?? Date.now();
  const ackSlaMs = INCIDENT_ACK_SLA_MINUTES * 60 * 1000;
  const resolveSlaMs = INCIDENT_RESOLVE_SLA_MINUTES * 60 * 1000;
  const ageMs = nowMs - input.createdAt.getTime();

  if (input.status !== "RESOLVED" && ageMs > resolveSlaMs) return "RESOLVE_BREACHED";
  if (input.status === "OPEN" && ageMs > ackSlaMs) return "ACK_BREACHED";
  if (
    input.status === "RESOLVED" &&
    input.resolvedAt &&
    input.resolvedAt.getTime() - input.createdAt.getTime() > resolveSlaMs
  ) {
    return "RESOLVED_LATE";
  }
  return "ON_TRACK";
}
