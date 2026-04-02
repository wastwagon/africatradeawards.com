import { randomUUID } from "node:crypto";
import { redis } from "@/lib/redis";

type NominationReceivedPayload = {
  to: string;
  nominatorName?: string | null;
  nomineeFullName: string;
  programName: string;
  categoryName: string;
  seasonYear: number;
  trackingUrl?: string | null;
};

type NominationStatusPayload = {
  to: string;
  nominatorName?: string | null;
  nomineeFullName: string;
  status: string;
  reviewNote?: string | null;
};

type NominationManagerAlertPayload = {
  nominatorName?: string | null;
  nominatorEmail?: string | null;
  nomineeFullName: string;
  programName: string;
  categoryName: string;
  seasonYear: number;
  source: string;
};

type NominationTrackingLinkPayload = {
  to: string;
  nominatorName?: string | null;
  nomineeFullName: string;
  trackingUrl: string;
  expiresAt?: Date | string | null;
};

type MailJobType =
  | "nomination_received_email"
  | "nomination_status_email"
  | "nomination_manager_alert_email"
  | "nomination_tracking_link_email";

type MailJobPayload =
  | NominationReceivedPayload
  | NominationStatusPayload
  | NominationManagerAlertPayload
  | NominationTrackingLinkPayload;

type MailJob = {
  id: string;
  type: MailJobType;
  payload: MailJobPayload;
  createdAt: string;
  createdBy: string | null;
  attempts: number;
};

async function enqueueNominationMailJob(type: MailJobType, payload: MailJobPayload, createdBy?: string | null) {
  const job: MailJob = {
    id: randomUUID(),
    type,
    payload,
    createdAt: new Date().toISOString(),
    createdBy: createdBy ?? null,
    attempts: 0,
  };
  await redis.lpush("jobs:mail", JSON.stringify(job));
  return job.id;
}

export async function queueNominationReceivedEmail(
  payload: NominationReceivedPayload,
  createdBy?: string | null,
) {
  return enqueueNominationMailJob("nomination_received_email", payload, createdBy);
}

export async function queueNominationStatusEmail(payload: NominationStatusPayload, createdBy?: string | null) {
  return enqueueNominationMailJob("nomination_status_email", payload, createdBy);
}

export async function queueNominationManagerAlertEmail(
  payload: NominationManagerAlertPayload,
  createdBy?: string | null,
) {
  return enqueueNominationMailJob("nomination_manager_alert_email", payload, createdBy);
}

export async function queueNominationTrackingLinkEmail(
  payload: NominationTrackingLinkPayload,
  createdBy?: string | null,
) {
  return enqueueNominationMailJob("nomination_tracking_link_email", payload, createdBy);
}
