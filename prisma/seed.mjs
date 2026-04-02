/**
 * Demo users for local testing — two per UserRole.
 * Run: DEMO_SEED=true npx prisma db seed
 * Do not run against production databases.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const prisma = new PrismaClient();

const DEMO_PASSWORD = "Demo_Awards_2026!";

const users = [
  { email: "super.demo@local.test", fullName: "Demo Super Admin", role: "SUPER_ADMIN" },
  { email: "super.demo2@local.test", fullName: "Demo Super Admin Two", role: "SUPER_ADMIN" },
  { email: "manager.demo@local.test", fullName: "Demo Program Manager", role: "PROGRAM_MANAGER" },
  { email: "manager.demo2@local.test", fullName: "Demo Program Manager Two", role: "PROGRAM_MANAGER" },
  { email: "auditor.demo@local.test", fullName: "Demo Auditor", role: "AUDITOR" },
  { email: "auditor.demo2@local.test", fullName: "Demo Auditor Two", role: "AUDITOR" },
  { email: "judge.demo@local.test", fullName: "Demo Judge", role: "JUDGE" },
  { email: "judge.demo2@local.test", fullName: "Demo Judge Two", role: "JUDGE" },
  { email: "entrant.demo@local.test", fullName: "Demo Entrant", role: "ENTRANT" },
  { email: "entrant.demo2@local.test", fullName: "Demo Entrant Two", role: "ENTRANT" },
];

function hashEventQrToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function hashText(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function attendeeSeedRows() {
  return [
    ["Amina Bello", "amina.bello@example.org", "Lagos Chamber", "Director"],
    ["Kojo Mensah", "kojo.mensah@example.org", "Accra Trade Council", "Program Lead"],
    ["Fatou Ndiaye", "fatou.ndiaye@example.org", "Dakar Logistics Group", "Operations Manager"],
    ["Thabo Molefe", "thabo.molefe@example.org", "SA Export Alliance", "Head of Strategy"],
    ["Mariam Hassan", "mariam.hassan@example.org", "Nairobi Venture Hub", "Partner"],
    ["Peter Okafor", "peter.okafor@example.org", "Eko Finserve", "Country Manager"],
    ["Aisha Umar", "aisha.umar@example.org", "Blue Nile Foods", "Founder"],
    ["Jean-Paul Koffi", "jeanpaul.koffi@example.org", "Abidjan Ports", "Regional Lead"],
    ["Linda Ncube", "linda.ncube@example.org", "Harare Commerce Board", "Policy Analyst"],
    ["Samuel Tetteh", "samuel.tetteh@example.org", "West Africa Freight", "Chief Operating Officer"],
    ["Grace Chisomo", "grace.chisomo@example.org", "Lusaka Agri Export", "Coordinator"],
    ["Youssef Karim", "youssef.karim@example.org", "Cairo Market Systems", "Business Development"],
  ];
}

async function main() {
  if (process.env.DEMO_SEED !== "true") {
    console.error("Refusing to seed: set DEMO_SEED=true (local/demo only).");
    console.error("Example: DEMO_SEED=true npx prisma db seed");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      create: {
        email: u.email,
        fullName: u.fullName,
        passwordHash,
        role: u.role,
      },
      update: {
        fullName: u.fullName,
        passwordHash,
        role: u.role,
      },
    });
    console.log(`Seeded ${u.role}: ${u.email}`);
  }

  const program = await prisma.program.upsert({
    where: { slug: "africa-trade-awards" },
    create: {
      slug: "africa-trade-awards",
      name: "Africa Trade Awards",
      description: "Recognition honours for trade and industrial impact.",
      isActive: true,
    },
    update: {
      name: "Africa Trade Awards",
      description: "Recognition honours for trade and industrial impact.",
      isActive: true,
    },
  });

  const season = await prisma.season.upsert({
    where: { programId_year: { programId: program.id, year: 2026 } },
    create: {
      programId: program.id,
      year: 2026,
      startDate: new Date("2026-01-01T00:00:00.000Z"),
      endDate: new Date("2026-12-31T23:59:59.000Z"),
      isArchived: false,
    },
    update: {
      startDate: new Date("2026-01-01T00:00:00.000Z"),
      endDate: new Date("2026-12-31T23:59:59.000Z"),
      isArchived: false,
    },
  });

  const categoryTrade = await prisma.category.upsert({
    where: { programId_slug: { programId: program.id, slug: "trade-innovation" } },
    create: {
      programId: program.id,
      slug: "trade-innovation",
      name: "Trade Innovation",
      description: "Impactful trade innovation outcomes.",
    },
    update: {
      name: "Trade Innovation",
      description: "Impactful trade innovation outcomes.",
    },
  });

  const categoryIndustrial = await prisma.category.upsert({
    where: { programId_slug: { programId: program.id, slug: "industrial-excellence" } },
    create: {
      programId: program.id,
      slug: "industrial-excellence",
      name: "Industrial Excellence",
      description: "Industrial capacity and value chain impact.",
    },
    update: {
      name: "Industrial Excellence",
      description: "Industrial capacity and value chain impact.",
    },
  });

  const entrantOne = await prisma.user.findUnique({ where: { email: "entrant.demo@local.test" }, select: { id: true } });
  const entrantTwo = await prisma.user.findUnique({ where: { email: "entrant.demo2@local.test" }, select: { id: true } });
  const managerTwo = await prisma.user.findUnique({ where: { email: "manager.demo2@local.test" }, select: { id: true } });
  const judgeOne = await prisma.user.findUnique({ where: { email: "judge.demo@local.test" }, select: { id: true } });
  const judgeTwo = await prisma.user.findUnique({ where: { email: "judge.demo2@local.test" }, select: { id: true } });

  await prisma.publicSiteSettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      headerDateLine: "28–29 January 2026",
      headerVenueLine: "Kempinski Gold Coast City · Accra",
      mobileNavMetaLine: "28–29 Jan · Accra",
      heroBarDateLine: "29th January 2026",
      heroBarVenueLine: "Kempinski Gold Coast City Hotel, Accra-Ghana",
    },
    update: {
      headerDateLine: "28–29 January 2026",
      headerVenueLine: "Kempinski Gold Coast City · Accra",
      mobileNavMetaLine: "28–29 Jan · Accra",
      heroBarDateLine: "29th January 2026",
      heroBarVenueLine: "Kempinski Gold Coast City Hotel, Accra-Ghana",
    },
  });

  await prisma.cmsSnippet.upsert({
    where: { key: "about_intro" },
    create: {
      key: "about_intro",
      label: "About intro",
      content:
        "The Africa Trade Awards celebrate institutions and leaders delivering measurable trade and industrial impact across the continent.",
      sortOrder: 1,
    },
    update: {
      label: "About intro",
      content:
        "The Africa Trade Awards celebrate institutions and leaders delivering measurable trade and industrial impact across the continent.",
      sortOrder: 1,
    },
  });

  await prisma.cmsFaq.upsert({
    where: { id: "cmseed_faq_1" },
    create: {
      id: "cmseed_faq_1",
      question: "Who can submit a nomination?",
      answer: "Any verified account holder can submit via the nominator portal, and public nominators can use the public form.",
      category: "Nominations",
      sortOrder: 1,
      published: true,
    },
    update: {
      question: "Who can submit a nomination?",
      answer: "Any verified account holder can submit via the nominator portal, and public nominators can use the public form.",
      category: "Nominations",
      sortOrder: 1,
      published: true,
    },
  });

  await prisma.cmsPublication.upsert({
    where: { slug: "africa-trade-awards-2026" },
    create: {
      slug: "africa-trade-awards-2026",
      title: "Africa Trade Awards 2026 Programme Launch",
      excerpt: "Programme launch update, key milestones, and nomination timeline for the 2026 cycle.",
      dateText: "January 2026",
      dateline: "Accra",
      sortOrder: 1,
      published: true,
    },
    update: {
      title: "Africa Trade Awards 2026 Programme Launch",
      excerpt: "Programme launch update, key milestones, and nomination timeline for the 2026 cycle.",
      dateText: "January 2026",
      dateline: "Accra",
      sortOrder: 1,
      published: true,
    },
  });

  const entryRows = [
    {
      title: "PanAfrica Logistics Corridor Digitization",
      entrantId: entrantOne?.id,
      categoryId: categoryTrade.id,
      status: "SUBMITTED",
      submissionData: {
        summary: "Digitized corridor workflows and reduced settlement delays across borders.",
        evidenceLinks: ["https://example.org/entry/pan-africa-logistics"],
      },
    },
    {
      title: "Nile Agro Industrial Export Expansion",
      entrantId: entrantTwo?.id,
      categoryId: categoryIndustrial.id,
      status: "SHORTLISTED",
      submissionData: {
        summary: "Expanded exports through traceability and manufacturing upgrades.",
        evidenceLinks: ["https://example.org/entry/nile-agro"],
      },
    },
    {
      title: "West Africa SME Trade Enablement Platform",
      entrantId: entrantOne?.id,
      categoryId: categoryTrade.id,
      status: "WINNER",
      submissionData: {
        summary: "Built a shared platform that improved SME onboarding and customs readiness.",
        evidenceLinks: ["https://example.org/entry/sme-platform"],
      },
    },
  ];

  const seededEntries = [];
  for (const row of entryRows) {
    if (!row.entrantId) continue;
    const existing = await prisma.entry.findFirst({
      where: { title: row.title, seasonId: season.id },
      select: { id: true },
    });
    const data = {
      title: row.title,
      entrantId: row.entrantId,
      programId: program.id,
      seasonId: season.id,
      categoryId: row.categoryId,
      status: row.status,
      submissionData: row.submissionData,
    };
    if (existing) {
      seededEntries.push(
        await prisma.entry.update({
          where: { id: existing.id },
          data,
          select: { id: true, title: true },
        }),
      );
      continue;
    }
    seededEntries.push(await prisma.entry.create({ data, select: { id: true, title: true } }));
  }

  const stageOne = await prisma.judgingStage.upsert({
    where: {
      programId_seasonId_stageOrder: {
        programId: program.id,
        seasonId: season.id,
        stageOrder: 1,
      },
    },
    create: {
      programId: program.id,
      seasonId: season.id,
      stageOrder: 1,
      name: "Initial Review",
      isActive: true,
    },
    update: { name: "Initial Review", isActive: true },
  });

  const stageTwo = await prisma.judgingStage.upsert({
    where: {
      programId_seasonId_stageOrder: {
        programId: program.id,
        seasonId: season.id,
        stageOrder: 2,
      },
    },
    create: {
      programId: program.id,
      seasonId: season.id,
      stageOrder: 2,
      name: "Final Deliberation",
      isActive: true,
    },
    update: { name: "Final Deliberation", isActive: true },
  });

  for (const entry of seededEntries) {
    if (judgeOne?.id) {
      await prisma.judgeAssignment.upsert({
        where: { judgeId_entryId: { judgeId: judgeOne.id, entryId: entry.id } },
        create: { judgeId: judgeOne.id, entryId: entry.id },
        update: {},
      });
    }
    if (judgeTwo?.id) {
      await prisma.judgeAssignment.upsert({
        where: { judgeId_entryId: { judgeId: judgeTwo.id, entryId: entry.id } },
        create: { judgeId: judgeTwo.id, entryId: entry.id },
        update: {},
      });
    }
  }

  if (judgeTwo?.id && seededEntries[2]?.id) {
    await prisma.judgeRecusal.upsert({
      where: { judgeId_entryId: { judgeId: judgeTwo.id, entryId: seededEntries[2].id } },
      create: { judgeId: judgeTwo.id, entryId: seededEntries[2].id, reason: "Advisory relationship disclosed." },
      update: { reason: "Advisory relationship disclosed." },
    });
  }

  for (const [index, entry] of seededEntries.entries()) {
    if (judgeOne?.id) {
      const criteria = ["Impact", "Innovation", "Scalability"];
      for (const criterion of criteria) {
        const existing = await prisma.score.findFirst({
          where: { judgeId: judgeOne.id, entryId: entry.id, criteria: criterion },
          select: { id: true },
        });
        const scoreData = {
          judgeId: judgeOne.id,
          entryId: entry.id,
          stageId: index % 2 === 0 ? stageOne.id : stageTwo.id,
          criteria: criterion,
          value: 7 + (index % 3),
          comment: "Seeded benchmark score for dashboard analytics.",
        };
        if (existing) {
          await prisma.score.update({ where: { id: existing.id }, data: scoreData });
        } else {
          await prisma.score.create({ data: scoreData });
        }
      }
    }
  }

  const voteRows = [
    { entryIndex: 0, ip: "197.210.1.2", status: "VALID" },
    { entryIndex: 0, ip: "102.89.4.10", status: "VALID" },
    { entryIndex: 1, ip: "154.72.11.90", status: "VALID" },
    { entryIndex: 1, ip: "154.72.11.99", status: "QUARANTINED" },
    { entryIndex: 2, ip: "41.66.100.4", status: "VALID" },
    { entryIndex: 2, ip: "41.66.100.5", status: "BLOCKED_DUPLICATE" },
  ];

  for (const row of voteRows) {
    const entry = seededEntries[row.entryIndex];
    if (!entry) continue;
    const ipHash = hashText(`seed-vote-ip:${row.ip}`);
    await prisma.publicVote.upsert({
      where: { entryId_ipHash: { entryId: entry.id, ipHash } },
      create: {
        entryId: entry.id,
        ipHash,
        status: row.status,
        userAgent: "seed-script",
        quarantineReason: row.status === "QUARANTINED" ? "Seeded anomaly sample" : null,
      },
      update: {
        status: row.status,
        userAgent: "seed-script",
        quarantineReason: row.status === "QUARANTINED" ? "Seeded anomaly sample" : null,
      },
    });
  }

  const nominationRows = [
    {
      nominatorId: entrantOne?.id,
      nomineeFullName: "Kwame Boateng",
      nomineeEmail: "kwame.boateng@example.org",
      nomineeOrganization: "PanAfrica Logistics",
      nomineeRoleTitle: "Chief Operations Officer",
      summary: "Led cross-border trade corridor digitization that reduced customs processing times and increased SME trade throughput.",
      evidenceLinks: "https://example.org/kwame-impact",
      programId: program.id,
      seasonId: season.id,
      categoryId: categoryTrade.id,
      status: "SUBMITTED",
      reviewNote: null,
      reviewedById: null,
      reviewedAt: null,
    },
    {
      nominatorId: entrantTwo?.id,
      nomineeFullName: "Aisha Sule",
      nomineeEmail: "aisha.sule@example.org",
      nomineeOrganization: "Nile Agro Processors",
      nomineeRoleTitle: "Founder",
      summary: "Expanded regional agro-processing exports with traceable supply chains and local manufacturing upgrades.",
      evidenceLinks: "https://example.org/aisha-impact",
      programId: program.id,
      seasonId: season.id,
      categoryId: categoryIndustrial.id,
      status: "UNDER_REVIEW",
      reviewNote: "Good evidence set. Awaiting committee deliberation.",
      reviewedById: managerTwo?.id ?? null,
      reviewedAt: new Date(),
    },
  ];

  for (const row of nominationRows) {
    if (!row.nominatorId) continue;
    const existing = await prisma.nomination.findFirst({
      where: { nominatorId: row.nominatorId, nomineeFullName: row.nomineeFullName, seasonId: row.seasonId },
      select: { id: true },
    });
    if (existing) {
      await prisma.nomination.update({
        where: { id: existing.id },
        data: row,
      });
      continue;
    }
    await prisma.nomination.create({ data: row });
  }

  const demoEvent = await prisma.event.upsert({
    where: { slug: "africa-trade-awards-2026-live" },
    create: {
      slug: "africa-trade-awards-2026-live",
      name: "Africa Trade Awards 2026 - Gala & Summit",
      description: "Main in-person summit day with keynote, awards, and networking.",
      type: "IN_PERSON",
      venueName: "Kigali Convention Centre",
      venueAddress: "KG 2 Roundabout, Kigali, Rwanda",
      startsAt: new Date("2026-09-18T08:30:00.000Z"),
      endsAt: new Date("2026-09-18T21:30:00.000Z"),
      capacity: 1500,
      isPublished: true,
    },
    update: {
      name: "Africa Trade Awards 2026 - Gala & Summit",
      description: "Main in-person summit day with keynote, awards, and networking.",
      venueName: "Kigali Convention Centre",
      venueAddress: "KG 2 Roundabout, Kigali, Rwanda",
      startsAt: new Date("2026-09-18T08:30:00.000Z"),
      endsAt: new Date("2026-09-18T21:30:00.000Z"),
      capacity: 1500,
      isPublished: true,
    },
  });

  const manager = await prisma.user.findUnique({ where: { email: "manager.demo@local.test" }, select: { id: true } });
  const seededRegistrationIds = [];

  for (const [fullName, email, organization, roleTitle] of attendeeSeedRows()) {
    const token = `ata_evt_seed_${email.replace(/[^a-z0-9]/gi, "").toLowerCase()}`;
    const registration = await prisma.eventRegistration.upsert({
      where: { qrTokenHash: hashEventQrToken(token) },
      create: {
        eventId: demoEvent.id,
        status: "CONFIRMED",
        attendeeFullName: fullName,
        attendeeEmail: email,
        attendeePhone: "+250700000000",
        organization,
        roleTitle,
        qrTokenHash: hashEventQrToken(token),
        qrTokenHint: token.slice(-6).toUpperCase(),
      },
      update: {
        attendeeFullName: fullName,
        attendeeEmail: email,
        organization,
        roleTitle,
        status: "CONFIRMED",
      },
    });
    seededRegistrationIds.push(registration.id);

    const shouldBeCheckedIn =
      email === "amina.bello@example.org" ||
      email === "kojo.mensah@example.org" ||
      email === "fatou.ndiaye@example.org" ||
      email === "thabo.molefe@example.org";

    if (shouldBeCheckedIn && !registration.checkedInAt) {
      const now = new Date();
      await prisma.eventRegistration.update({
        where: { id: registration.id },
        data: { checkedInAt: now },
      });
      await prisma.eventCheckIn.create({
        data: {
          eventId: demoEvent.id,
          registrationId: registration.id,
          checkedInById: manager?.id,
          method: "QR_SCAN",
          location: "Main hall gate",
          deviceLabel: "Seeded desk scanner",
          note: "Seeded demo check-in",
        },
      });
      await prisma.eventCheckInAttempt.create({
        data: {
          eventId: demoEvent.id,
          registrationId: registration.id,
          actorId: manager?.id,
          outcome: "SUCCESS",
          source: "CAMERA",
          reasonCode: "CHECKED_IN",
          location: "Main hall gate",
          deviceLabel: "Seeded desk scanner",
          note: "Seeded successful attempt",
        },
      });
    }

    if (shouldBeCheckedIn) {
      const existingPrintLog = await prisma.eventBadgePrintLog.findFirst({
        where: { registrationId: registration.id },
        select: { id: true },
      });
      if (!existingPrintLog) {
        await prisma.eventBadgePrintLog.create({
          data: {
            eventId: demoEvent.id,
            registrationId: registration.id,
            printedById: manager?.id,
            printerLabel: "Seeded badge printer",
            note: "Seeded demo badge print",
          },
        });
      }
    }

    if (email === "peter.okafor@example.org") {
      await prisma.eventCheckInAttempt.create({
        data: {
          eventId: demoEvent.id,
          registrationId: registration.id,
          actorId: manager?.id,
          outcome: "FAILED",
          source: "MANUAL",
          reasonCode: "INVALID_TOKEN",
          location: "Main hall gate",
          deviceLabel: "Seeded desk scanner",
          note: "Seeded failed attempt",
        },
      });
    }
  }

  await prisma.eventOnsiteIncident.deleteMany({ where: { eventId: demoEvent.id } });
  const now = Date.now();
  await prisma.eventOnsiteIncident.createMany({
    data: [
      {
        eventId: demoEvent.id,
        createdById: manager?.id,
        title: "Main gate queue buildup",
        category: "Queue backlog",
        severity: "HIGH",
        status: "OPEN",
        detail: "Queue exceeded target threshold during peak entry window.",
        location: "Main hall gate",
        deviceLabel: "Seeded desk scanner",
        occurredAt: new Date(now - 35 * 60 * 1000),
        createdAt: new Date(now - 35 * 60 * 1000),
      },
      {
        eventId: demoEvent.id,
        createdById: manager?.id,
        title: "Scanner lens obstruction",
        category: "Hardware",
        severity: "MEDIUM",
        status: "IN_REVIEW",
        detail: "Intermittent read failures due to lens smudge; cleaning underway.",
        location: "VIP desk",
        deviceLabel: "Seeded VIP scanner",
        occurredAt: new Date(now - 20 * 60 * 1000),
        createdAt: new Date(now - 20 * 60 * 1000),
      },
      {
        eventId: demoEvent.id,
        createdById: manager?.id,
        resolvedById: manager?.id,
        title: "Network jitter at registration lane",
        category: "Connectivity",
        severity: "LOW",
        status: "RESOLVED",
        detail: "Temporary packet loss resolved after AP failover.",
        location: "Registration lane",
        deviceLabel: "Seeded desk scanner B",
        occurredAt: new Date(now - 95 * 60 * 1000),
        createdAt: new Date(now - 95 * 60 * 1000),
        resolvedAt: new Date(now - 25 * 60 * 1000),
        resolutionNote: "Switched to backup access point and confirmed stable checks.",
      },
    ],
  });

  await prisma.eventCheckInQueueItem.deleteMany({ where: { eventId: demoEvent.id } });
  await prisma.eventCheckInQueueItem.createMany({
    data: [
      {
        eventId: demoEvent.id,
        createdById: manager?.id,
        state: "PENDING",
        attempts: 1,
        qrPayload: JSON.stringify({
          type: "event-pass",
          eventId: demoEvent.id,
          registrationId: seededRegistrationIds[0],
          token: "seeded-pending-token",
        }),
        location: "Main hall gate",
        deviceLabel: "Seeded desk scanner",
        source: "OFFLINE_SYNC",
        lastError: "Temporary network timeout",
      },
      {
        eventId: demoEvent.id,
        createdById: manager?.id,
        state: "CONFLICT",
        attempts: 3,
        qrPayload: JSON.stringify({
          type: "event-pass",
          eventId: demoEvent.id,
          registrationId: seededRegistrationIds[1],
          token: "seeded-conflict-token",
        }),
        location: "VIP desk",
        deviceLabel: "Seeded VIP scanner",
        source: "OFFLINE_SYNC",
        lastError: "Attendee already checked in",
      },
    ],
  });

  await prisma.auditLog.createMany({
    data: [
      {
        userId: manager?.id,
        action: "seed.ops_bootstrap",
        metadata: {
          eventId: demoEvent.id,
          note: "Seeded event operations, incidents, and queue state.",
        },
      },
      {
        userId: manager?.id,
        action: "seed.ops_incident_baseline",
        metadata: {
          eventId: demoEvent.id,
          incidentCount: 3,
          queueCount: 2,
        },
      },
    ],
  });

  console.log("");
  console.log("All demo accounts use the same password:");
  console.log(`  ${DEMO_PASSWORD}`);
  console.log("");
  console.log("Seeded event operations demo:");
  console.log("  Event slug: africa-trade-awards-2026-live");
  console.log("  Route: /event/register");
  console.log("  Admin route: /admin/events");
  console.log("  Nominator route: /portal/nominator");
  console.log("  Admin nominations: /admin/nominations");
  console.log("");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
