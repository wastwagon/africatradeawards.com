import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const eventSlug = process.env.OPS_EVENT_SLUG ?? "africa-trade-awards-2026-live";
  const event = await prisma.event.findUnique({
    where: { slug: eventSlug },
    select: { id: true, name: true },
  });

  if (!event) {
    console.error(`FAIL: Event not found for slug ${eventSlug}`);
    process.exit(1);
  }

  const [registrations, checkIns, queueCounts, incidents, audits24h] = await Promise.all([
    prisma.eventRegistration.count({ where: { eventId: event.id } }),
    prisma.eventCheckIn.count({ where: { eventId: event.id } }),
    prisma.eventCheckInQueueItem.groupBy({
      by: ["state"],
      where: { eventId: event.id },
      _count: { _all: true },
    }),
    prisma.eventOnsiteIncident.count({ where: { eventId: event.id } }),
    prisma.auditLog.count({
      where: {
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
    }),
  ]);

  const pending = queueCounts.find((row) => row.state === "PENDING")?._count._all ?? 0;
  const conflict = queueCounts.find((row) => row.state === "CONFLICT")?._count._all ?? 0;

  const checks = [
    { ok: registrations > 0, label: "registrations present", detail: registrations },
    { ok: checkIns >= 0, label: "check-in table reachable", detail: checkIns },
    { ok: incidents > 0, label: "incident records present", detail: incidents },
    { ok: audits24h > 0, label: "audit records present (24h)", detail: audits24h },
    { ok: pending + conflict >= 0, label: "queue state readable", detail: `${pending}/${conflict}` },
  ];

  let allOk = true;
  console.log(`Onsite Ops Verification for ${event.name}`);
  for (const check of checks) {
    const icon = check.ok ? "PASS" : "FAIL";
    console.log(`- ${icon}: ${check.label} -> ${check.detail}`);
    if (!check.ok) allOk = false;
  }

  if (!allOk) {
    console.error("Onsite ops verification failed.");
    process.exit(1);
  }
  console.log("Onsite ops verification passed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
