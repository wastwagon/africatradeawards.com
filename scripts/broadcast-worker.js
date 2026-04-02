/* eslint-disable no-console */
const Redis = require("ioredis");
const { PrismaClient } = require("@prisma/client");
const nodemailer = require("nodemailer");

const prisma = new PrismaClient();
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
const redis = new Redis(redisUrl, { maxRetriesPerRequest: null });
const MAIL_QUEUE_KEY = "jobs:mail";
const MAIL_RETRY_KEY = "jobs:mail:scheduled";
const MAIL_MAX_ATTEMPTS = Number(process.env.MAIL_JOB_MAX_ATTEMPTS || 5);

function createTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    throw new Error("SMTP configuration is missing");
  }
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

async function audienceRecipients(audience) {
  const where =
    audience === "entrants"
      ? { role: "ENTRANT" }
      : audience === "judges"
        ? { role: "JUDGE" }
        : audience === "managers"
          ? { role: { in: ["PROGRAM_MANAGER", "SUPER_ADMIN", "AUDITOR"] } }
          : {};
  const users = await prisma.user.findMany({
    where,
    select: { email: true },
  });
  return users.map((u) => u.email).filter(Boolean);
}

async function processJob(raw) {
  const job = JSON.parse(raw);
  if (job.type !== "broadcast_email") return;

  const recipients = await audienceRecipients(job.payload?.audience || "all");
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  let sent = 0;

  if (recipients.length) {
    const transporter = createTransport();
    const batchSize = 50;
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      await transporter.sendMail({
        from,
        bcc: batch,
        subject: job.payload?.subject || "(No subject)",
        text: job.payload?.message || "",
      });
      sent += batch.length;
    }
  }

  await prisma.auditLog.create({
    data: {
      action: "broadcast_queued_processed",
      metadata: {
        audience: job.payload?.audience,
        subject: job.payload?.subject,
        sent,
        recipients: recipients.length,
        createdAt: job.createdAt,
        createdBy: job.createdBy,
      },
      userId: job.createdBy || null,
    },
  });
  console.log("Processed broadcast job:", job.payload?.subject || "no-subject", "sent:", sent);
}

function nominationReceivedText(payload) {
  return [
    `Hello ${payload.nominatorName?.trim() || "there"},`,
    "",
    "Your nomination has been received.",
    `Nominee: ${payload.nomineeFullName}`,
    `Program: ${payload.programName}`,
    `Category: ${payload.categoryName}`,
    `Season: ${payload.seasonYear}`,
    payload.trackingUrl ? `Track your nomination: ${payload.trackingUrl}` : null,
    "",
    "Our review team will assess it and update you on the outcome.",
  ]
    .filter(Boolean)
    .join("\n");
}

function nominationStatusText(payload) {
  return [
    `Hello ${payload.nominatorName?.trim() || "there"},`,
    "",
    "Your nomination status has changed.",
    `Nominee: ${payload.nomineeFullName}`,
    `New status: ${payload.status}`,
    payload.reviewNote ? `Review note: ${payload.reviewNote}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

function nominationTrackingLinkText(payload) {
  return [
    `Hello ${payload.nominatorName?.trim() || "there"},`,
    "",
    "Here is your refreshed tracking link for your nomination.",
    `Nominee: ${payload.nomineeFullName}`,
    `Tracking link: ${payload.trackingUrl}`,
    payload.expiresAt ? `Link expires: ${new Date(payload.expiresAt).toISOString()}` : null,
    "",
    "Use this link to check status or update submission details while editing is still open.",
  ]
    .filter(Boolean)
    .join("\n");
}

function nominationManagerAlertText(payload) {
  return [
    "A new nomination was submitted.",
    `Nominee: ${payload.nomineeFullName}`,
    `Program: ${payload.programName}`,
    `Category: ${payload.categoryName}`,
    `Season: ${payload.seasonYear}`,
    `Source: ${payload.source}`,
    `Nominator: ${payload.nominatorName ?? "Unknown"} (${payload.nominatorEmail ?? "No email"})`,
    "",
    "Review queue: /admin/nominations",
  ].join("\n");
}

async function managerRecipients() {
  const managers = await prisma.user.findMany({
    where: {
      role: { in: ["PROGRAM_MANAGER", "SUPER_ADMIN"] },
    },
    select: { email: true },
  });
  return managers.map((manager) => manager.email).filter(Boolean);
}

async function sendNominationMailJob(job) {
  const transporter = createTransport();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  if (job.type === "nomination_received_email") {
    await transporter.sendMail({
      from,
      to: job.payload.to,
      subject: "Nomination received",
      text: nominationReceivedText(job.payload),
    });
    return { sent: 1 };
  }

  if (job.type === "nomination_status_email") {
    await transporter.sendMail({
      from,
      to: job.payload.to,
      subject: `Nomination status update: ${job.payload.status}`,
      text: nominationStatusText(job.payload),
    });
    return { sent: 1 };
  }

  if (job.type === "nomination_tracking_link_email") {
    await transporter.sendMail({
      from,
      to: job.payload.to,
      subject: "Your refreshed nomination tracking link",
      text: nominationTrackingLinkText(job.payload),
    });
    return { sent: 1 };
  }

  if (job.type === "nomination_manager_alert_email") {
    const recipients = await managerRecipients();
    if (!recipients.length) return { sent: 0 };
    await transporter.sendMail({
      from,
      bcc: recipients,
      subject: `[Nominations] New submission: ${job.payload.nomineeFullName}`,
      text: nominationManagerAlertText(job.payload),
    });
    return { sent: recipients.length };
  }

  return { sent: 0 };
}

function backoffMs(attempts) {
  const exp = Math.max(1, attempts);
  const ms = Math.min(60 * 60 * 1000, 10_000 * 2 ** (exp - 1));
  return ms;
}

async function scheduleMailRetry(job, error) {
  const attempts = Number(job?.attempts || 0) + 1;
  if (attempts >= MAIL_MAX_ATTEMPTS) {
    await prisma.auditLog.create({
      data: {
        action: "mail_job_failed",
        metadata: {
          type: job?.type,
          createdAt: job?.createdAt,
          createdBy: job?.createdBy,
          attempts,
          error: error?.message || "Unknown error",
        },
        userId: job?.createdBy || null,
      },
    });
    return;
  }
  const retryJob = {
    ...job,
    attempts,
    lastError: error?.message || "Unknown error",
  };
  const dueAt = Date.now() + backoffMs(attempts);
  await redis.zadd(MAIL_RETRY_KEY, dueAt, JSON.stringify(retryJob));
}

async function processMailJob(raw) {
  const job = JSON.parse(raw);
  try {
    const { sent } = await sendNominationMailJob(job);
    await prisma.auditLog.create({
      data: {
        action: "mail_job_processed",
        metadata: {
          type: job.type,
          sent,
          attempts: Number(job.attempts || 0),
          createdAt: job.createdAt,
          createdBy: job.createdBy,
        },
        userId: job.createdBy || null,
      },
    });
  } catch (error) {
    await scheduleMailRetry(job, error);
    console.error("Failed processing mail job:", error);
  }
}

async function moveDueScheduledJobs() {
  try {
    const now = Date.now();
    const dueBroadcastJobs = await redis.zrangebyscore("jobs:broadcast:scheduled", 0, now, "LIMIT", 0, 25);
    if (dueBroadcastJobs.length) {
      for (const job of dueBroadcastJobs) {
        await redis.lpush("jobs:broadcast", job);
        await redis.zrem("jobs:broadcast:scheduled", job);
      }
    }
    const dueMailJobs = await redis.zrangebyscore(MAIL_RETRY_KEY, 0, now, "LIMIT", 0, 25);
    if (dueMailJobs.length) {
      for (const job of dueMailJobs) {
        await redis.lpush(MAIL_QUEUE_KEY, job);
        await redis.zrem(MAIL_RETRY_KEY, job);
      }
    }
  } catch (err) {
    console.error("Failed moving scheduled jobs:", err);
  }
}

async function run() {
  console.log("Broadcast worker started.");
  while (true) {
    await moveDueScheduledJobs();
    const result = await redis.brpop("jobs:broadcast", MAIL_QUEUE_KEY, 0);
    if (!result || result.length < 2) continue;
    const queueKey = result[0];
    const payload = result[1];
    if (queueKey === MAIL_QUEUE_KEY) {
      await processMailJob(payload);
      continue;
    }
    try {
      await processJob(payload);
    } catch (err) {
      console.error("Failed processing job:", err);
    }
  }
}

run().catch((err) => {
  console.error("Worker crashed:", err);
  process.exit(1);
});
