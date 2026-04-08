import nodemailer from "nodemailer";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";

function createTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
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

function roleAudienceToWhere(audience: "entrants" | "judges" | "managers" | "all") {
  if (audience === "all") return {};
  if (audience === "entrants") return { role: UserRole.ENTRANT };
  if (audience === "judges") return { role: UserRole.JUDGE };
  return {
    role: { in: [UserRole.PROGRAM_MANAGER, UserRole.SUPER_ADMIN, UserRole.AUDITOR] as UserRole[] },
  };
}

export async function sendBroadcastEmail(params: {
  audience: "entrants" | "judges" | "managers" | "all";
  subject: string;
  message: string;
}) {
  const transporter = createTransport();
  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER;

  const users = await prisma.user.findMany({
    where: roleAudienceToWhere(params.audience),
    select: { email: true },
  });
  const recipients = users.map((u) => u.email).filter(Boolean);

  if (!recipients.length) {
    return { sent: 0 };
  }

  // Send in small batches to avoid SMTP throttling.
  const batchSize = 50;
  let sent = 0;
  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);
    await transporter.sendMail({
      from,
      bcc: batch,
      subject: params.subject,
      text: params.message,
    });
    sent += batch.length;
  }

  return { sent };
}

export async function sendVotingVerificationEmail(params: {
  to: string;
  code: string;
  entryTitle?: string;
}) {
  const transporter = createTransport();
  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER;
  const subject = "Your voting verification code";
  const text = `Your verification code is ${params.code}. It expires in 10 minutes.${
    params.entryTitle ? `\nEntry: ${params.entryTitle}` : ""
  }`;

  await transporter.sendMail({
    from,
    to: params.to,
    subject,
    text,
  });
}

export async function sendVotingLinkEmail(params: {
  to: string;
  voteUrl: string;
  entryTitle?: string;
}) {
  const transporter = createTransport();
  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER;
  const subject = "Your secure voting link";
  const text = `Use this one-time voting link:\n${params.voteUrl}\n\n${
    params.entryTitle ? `Entry: ${params.entryTitle}\n` : ""
  }This link expires soon and is bound to your network signature.`;

  await transporter.sendMail({
    from,
    to: params.to,
    subject,
    text,
  });
}

export async function sendEventTicketRecoveryEmail(params: {
  to: string;
  code: string;
  eventName: string;
}) {
  const transporter = createTransport();
  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER;
  const subject = `Your ticket recovery code for ${params.eventName}`;
  const text = `Use this code to recover your event ticket: ${params.code}\n\nEvent: ${params.eventName}\nCode expires in 10 minutes.`;

  await transporter.sendMail({
    from,
    to: params.to,
    subject,
    text,
  });
}

export async function sendOnsiteIncidentAlertEmail(params: {
  eventName: string;
  incidentTitle: string;
  severity: string;
  status: string;
  location?: string | null;
  detail?: string | null;
}) {
  const transporter = createTransport();
  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER;
  const subject = `[Onsite Alert] ${params.severity} - ${params.incidentTitle}`;
  const text = [
    `Event: ${params.eventName}`,
    `Incident: ${params.incidentTitle}`,
    `Severity: ${params.severity}`,
    `Status: ${params.status}`,
    `Location: ${params.location ?? "Unspecified"}`,
    params.detail ? `Detail: ${params.detail}` : null,
    `Generated at: ${new Date().toISOString()}`,
  ]
    .filter(Boolean)
    .join("\n");

  const users = await prisma.user.findMany({
    where: {
      role: { in: [UserRole.PROGRAM_MANAGER, UserRole.SUPER_ADMIN, UserRole.AUDITOR] },
    },
    select: { email: true },
  });
  const recipients = users.map((user) => user.email).filter(Boolean);
  if (!recipients.length) return { sent: 0 };

  await transporter.sendMail({
    from,
    bcc: recipients,
    subject,
    text,
  });
  return { sent: recipients.length };
}

export async function safeSendOnsiteIncidentAlertEmail(params: {
  eventName: string;
  incidentTitle: string;
  severity: string;
  status: string;
  location?: string | null;
  detail?: string | null;
}) {
  try {
    return await sendOnsiteIncidentAlertEmail(params);
  } catch {
    return { sent: 0 };
  }
}

export async function sendNominationReceivedEmail(params: {
  to: string;
  nominatorName?: string | null;
  nomineeFullName: string;
  programName: string;
  categoryName: string;
  seasonYear: number;
  trackingUrl?: string | null;
}) {
  const transporter = createTransport();
  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER;
  const subject = "Nomination received";
  const text = [
    `Hello ${params.nominatorName?.trim() || "there"},`,
    "",
    "Your nomination has been received.",
    `Nominee: ${params.nomineeFullName}`,
    `Program: ${params.programName}`,
    `Category: ${params.categoryName}`,
    `Season: ${params.seasonYear}`,
    params.trackingUrl ? `Track your nomination: ${params.trackingUrl}` : null,
    "",
    "Our review team will assess it and update you on the outcome.",
  ]
    .filter(Boolean)
    .join("\n");

  await transporter.sendMail({ from, to: params.to, subject, text });
}

export async function sendNominationStatusEmail(params: {
  to: string;
  nominatorName?: string | null;
  nomineeFullName: string;
  status: string;
  reviewNote?: string | null;
}) {
  const transporter = createTransport();
  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER;
  const subject = `Nomination status update: ${params.status}`;
  const text = [
    `Hello ${params.nominatorName?.trim() || "there"},`,
    "",
    "Your nomination status has changed.",
    `Nominee: ${params.nomineeFullName}`,
    `New status: ${params.status}`,
    params.reviewNote ? `Review note: ${params.reviewNote}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  await transporter.sendMail({ from, to: params.to, subject, text });
}

export async function sendNominationManagerAlertEmail(params: {
  nominatorName?: string | null;
  nominatorEmail?: string | null;
  nomineeFullName: string;
  programName: string;
  categoryName: string;
  seasonYear: number;
  source: string;
}) {
  const transporter = createTransport();
  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER;

  const managers = await prisma.user.findMany({
    where: {
      role: { in: [UserRole.PROGRAM_MANAGER, UserRole.SUPER_ADMIN] },
    },
    select: { email: true },
  });
  const recipients = managers.map((manager) => manager.email).filter(Boolean);
  if (!recipients.length) return { sent: 0 };

  const subject = `[Nominations] New submission: ${params.nomineeFullName}`;
  const text = [
    "A new nomination was submitted.",
    `Nominee: ${params.nomineeFullName}`,
    `Program: ${params.programName}`,
    `Category: ${params.categoryName}`,
    `Season: ${params.seasonYear}`,
    `Source: ${params.source}`,
    `Nominator: ${params.nominatorName ?? "Unknown"} (${params.nominatorEmail ?? "No email"})`,
    "",
    "Review queue: /admin/nominations",
  ].join("\n");

  await transporter.sendMail({ from, bcc: recipients, subject, text });
  return { sent: recipients.length };
}

export async function safeSendNominationReceivedEmail(params: {
  to: string;
  nominatorName?: string | null;
  nomineeFullName: string;
  programName: string;
  categoryName: string;
  seasonYear: number;
  trackingUrl?: string | null;
}) {
  try {
    await sendNominationReceivedEmail(params);
    return { sent: 1 };
  } catch {
    return { sent: 0 };
  }
}

export async function safeSendNominationStatusEmail(params: {
  to: string;
  nominatorName?: string | null;
  nomineeFullName: string;
  status: string;
  reviewNote?: string | null;
}) {
  try {
    await sendNominationStatusEmail(params);
    return { sent: 1 };
  } catch {
    return { sent: 0 };
  }
}

export async function safeSendNominationManagerAlertEmail(params: {
  nominatorName?: string | null;
  nominatorEmail?: string | null;
  nomineeFullName: string;
  programName: string;
  categoryName: string;
  seasonYear: number;
  source: string;
}) {
  try {
    return await sendNominationManagerAlertEmail(params);
  } catch {
    return { sent: 0 };
  }
}

export async function sendNominationTrackingLinkEmail(params: {
  to: string;
  nominatorName?: string | null;
  nomineeFullName: string;
  trackingUrl: string;
  expiresAt?: Date | null;
}) {
  const transporter = createTransport();
  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER;
  const subject = "Your refreshed nomination tracking link";
  const text = [
    `Hello ${params.nominatorName?.trim() || "there"},`,
    "",
    "Here is your refreshed tracking link for your nomination.",
    `Nominee: ${params.nomineeFullName}`,
    `Tracking link: ${params.trackingUrl}`,
    params.expiresAt ? `Link expires: ${params.expiresAt.toISOString()}` : null,
    "",
    "Use this link to check status or update submission details while editing is still open.",
  ]
    .filter(Boolean)
    .join("\n");

  await transporter.sendMail({ from, to: params.to, subject, text });
}

export async function safeSendNominationTrackingLinkEmail(params: {
  to: string;
  nominatorName?: string | null;
  nomineeFullName: string;
  trackingUrl: string;
  expiresAt?: Date | null;
}) {
  try {
    await sendNominationTrackingLinkEmail(params);
    return { sent: 1 };
  } catch {
    return { sent: 0 };
  }
}

export async function sendContactInquiryEmail(params: {
  to: string;
  replyTo: string;
  name: string;
  phone: string;
  inquiryTypeLabel: string;
  subject: string;
  message: string;
}) {
  const transporter = createTransport();
  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER;
  const subject = `[Africa Trade Awards] ${params.inquiryTypeLabel}: ${params.subject}`;
  const text = [
    "New message from the website contact form.",
    "",
    `Name: ${params.name}`,
    `Email: ${params.replyTo}`,
    `Phone: ${params.phone}`,
    `Inquiry type: ${params.inquiryTypeLabel}`,
    "",
    "Message:",
    params.message,
  ].join("\n");

  await transporter.sendMail({
    from,
    to: params.to,
    replyTo: params.replyTo,
    subject,
    text,
  });
}
