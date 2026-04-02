import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { rowsToCsv, withUtf8Bom } from "@/lib/csv";

export type ExportFilterOptions = {
  programId?: string;
  seasonId?: string;
  /** Inclusive lower bound on each resource's own `createdAt`. */
  createdAfter?: Date;
  /** Inclusive upper bound on each resource's own `createdAt`. */
  createdBefore?: Date;
};

export type ParsedExportFilters = ExportFilterOptions & {
  error?: string;
};

function entryScopeOnly(programId?: string | null, seasonId?: string | null): Prisma.EntryWhereInput | undefined {
  if (!programId && !seasonId) return undefined;
  const w: Prisma.EntryWhereInput = {};
  if (programId) w.programId = programId;
  if (seasonId) w.seasonId = seasonId;
  return w;
}

function dateTimeFilter(createdAfter?: Date, createdBefore?: Date): Prisma.DateTimeFilter | undefined {
  if (!createdAfter && !createdBefore) return undefined;
  const f: Prisma.DateTimeFilter = {};
  if (createdAfter) f.gte = createdAfter;
  if (createdBefore) f.lte = createdBefore;
  return f;
}

function entryWhereForExport(opts: ExportFilterOptions): Prisma.EntryWhereInput | undefined {
  const scope = entryScopeOnly(opts.programId, opts.seasonId);
  const dt = dateTimeFilter(opts.createdAfter, opts.createdBefore);
  if (!scope && !dt) return undefined;
  return {
    ...(scope ?? {}),
    ...(dt ? { createdAt: dt } : {}),
  };
}

export function parseExportFilters(searchParams: URLSearchParams): ParsedExportFilters {
  const programId = searchParams.get("programId")?.trim() || undefined;
  const seasonId = searchParams.get("seasonId")?.trim() || undefined;
  const afterRaw = searchParams.get("createdAfter")?.trim();
  const beforeRaw = searchParams.get("createdBefore")?.trim();

  let createdAfter: Date | undefined;
  let createdBefore: Date | undefined;
  if (afterRaw) {
    const d = new Date(afterRaw);
    if (Number.isNaN(d.getTime())) return { error: "Invalid createdAfter datetime" };
    createdAfter = d;
  }
  if (beforeRaw) {
    const d = new Date(beforeRaw);
    if (Number.isNaN(d.getTime())) return { error: "Invalid createdBefore datetime" };
    createdBefore = d;
  }
  if (createdAfter && createdBefore && createdAfter.getTime() > createdBefore.getTime()) {
    return { error: "createdAfter must not be after createdBefore" };
  }

  return { programId, seasonId, createdAfter, createdBefore };
}

export async function buildEntriesCsv(opts: ExportFilterOptions): Promise<string> {
  const where = entryWhereForExport(opts);
  const entries = await prisma.entry.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      entrant: { select: { email: true, fullName: true } },
      program: { select: { slug: true, name: true } },
      season: { select: { year: true } },
      category: { select: { slug: true, name: true } },
    },
  });

  const headers = [
    "id",
    "title",
    "status",
    "entrantEmail",
    "entrantName",
    "programSlug",
    "programName",
    "seasonYear",
    "categorySlug",
    "categoryName",
    "createdAt",
    "submissionJson",
  ];

  const rows = entries.map((e) => {
    const submissionJson =
      e.submissionData === null || e.submissionData === undefined
        ? ""
        : JSON.stringify(e.submissionData).slice(0, 8000);

    return [
      e.id,
      e.title,
      e.status,
      e.entrant.email,
      e.entrant.fullName,
      e.program.slug,
      e.program.name,
      e.season.year,
      e.category.slug,
      e.category.name,
      e.createdAt.toISOString(),
      submissionJson,
    ];
  });

  return withUtf8Bom(rowsToCsv(headers, rows));
}

export async function buildVotesCsv(opts: ExportFilterOptions): Promise<string> {
  const entryPart = entryScopeOnly(opts.programId, opts.seasonId);
  const voteDt = dateTimeFilter(opts.createdAfter, opts.createdBefore);
  const where: Prisma.PublicVoteWhereInput = {};
  if (entryPart) where.entry = { is: entryPart };
  if (voteDt) where.createdAt = voteDt;

  const votes = await prisma.publicVote.findMany({
    where: Object.keys(where).length ? where : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      entry: {
        select: {
          id: true,
          title: true,
          program: { select: { name: true } },
          category: { select: { name: true } },
          season: { select: { year: true } },
        },
      },
    },
  });

  const headers = [
    "voteId",
    "status",
    "createdAt",
    "entryId",
    "entryTitle",
    "programName",
    "categoryName",
    "seasonYear",
    "voterEmail",
    "ipHash",
    "fingerprintHash",
    "quarantineReason",
    "reviewedAt",
    "userAgent",
  ];

  const rows = votes.map((v) => [
    v.id,
    v.status,
    v.createdAt.toISOString(),
    v.entryId,
    v.entry.title,
    v.entry.program.name,
    v.entry.category.name,
    v.entry.season.year,
    v.voterEmail ?? "",
    v.ipHash,
    v.fingerprintHash ?? "",
    v.quarantineReason ?? "",
    v.reviewedAt?.toISOString() ?? "",
    (v.userAgent ?? "").slice(0, 500),
  ]);

  return withUtf8Bom(rowsToCsv(headers, rows));
}

export async function buildScoresCsv(opts: ExportFilterOptions): Promise<string> {
  const entryPart = entryScopeOnly(opts.programId, opts.seasonId);
  const scoreDt = dateTimeFilter(opts.createdAfter, opts.createdBefore);
  const where: Prisma.ScoreWhereInput = {};
  if (entryPart) where.entry = { is: entryPart };
  if (scoreDt) where.createdAt = scoreDt;

  const scores = await prisma.score.findMany({
    where: Object.keys(where).length ? where : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      judge: { select: { email: true, fullName: true } },
      entry: {
        select: {
          id: true,
          title: true,
          program: { select: { name: true } },
          category: { select: { name: true } },
        },
      },
      stage: { select: { name: true, stageOrder: true } },
    },
  });

  const headers = [
    "scoreId",
    "createdAt",
    "criteria",
    "value",
    "comment",
    "judgeEmail",
    "judgeName",
    "entryId",
    "entryTitle",
    "programName",
    "categoryName",
    "stageOrder",
    "stageName",
  ];

  const rows = scores.map((s) => [
    s.id,
    s.createdAt.toISOString(),
    s.criteria,
    s.value,
    (s.comment ?? "").slice(0, 2000),
    s.judge.email,
    s.judge.fullName,
    s.entryId,
    s.entry.title,
    s.entry.program.name,
    s.entry.category.name,
    s.stage?.stageOrder ?? "",
    s.stage?.name ?? "",
  ]);

  return withUtf8Bom(rowsToCsv(headers, rows));
}

export async function buildUsersCsv(opts: ExportFilterOptions): Promise<string> {
  const programId = opts.programId;
  const userDt = dateTimeFilter(opts.createdAfter, opts.createdBefore);

  const parts: Prisma.UserWhereInput[] = [];
  if (programId) {
    parts.push({
      OR: [
        { entriesAsEntrant: { some: { programId } } },
        { judgeAssignments: { some: { entry: { programId } } } },
      ],
    });
  }
  if (userDt) {
    parts.push({ createdAt: userDt });
  }

  const where = parts.length === 0 ? undefined : parts.length === 1 ? parts[0] : { AND: parts };

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      createdAt: true,
    },
  });

  const headers = ["id", "email", "fullName", "role", "createdAt"];
  const rows = users.map((u) => [u.id, u.email, u.fullName, u.role, u.createdAt.toISOString()]);
  return withUtf8Bom(rowsToCsv(headers, rows));
}

export function toExportOptions(p: ParsedExportFilters): ExportFilterOptions {
  return {
    programId: p.programId,
    seasonId: p.seasonId,
    createdAfter: p.createdAfter,
    createdBefore: p.createdBefore,
  };
}

export function exportFilenameSuffix(p: ParsedExportFilters): string {
  const parts = [p.programId?.slice(0, 8), p.seasonId?.slice(0, 8)].filter(Boolean).join("-");
  const dr =
    p.createdAfter || p.createdBefore
      ? `${p.createdAfter?.toISOString().slice(0, 10) ?? "start"}-${p.createdBefore?.toISOString().slice(0, 10) ?? "end"}`
      : "";
  return [parts, dr].filter(Boolean).join("_");
}
