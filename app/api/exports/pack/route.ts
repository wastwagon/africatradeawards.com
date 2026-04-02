import archiver from "archiver";
import { NextResponse } from "next/server";
import { requireManagerOrAuditor } from "@/lib/api-auth";
import {
  buildEntriesCsv,
  buildScoresCsv,
  buildUsersCsv,
  buildVotesCsv,
  exportFilenameSuffix,
  parseExportFilters,
  toExportOptions,
} from "@/lib/exports-csv";

export { dynamic } from "@/lib/force-dynamic-api";

function zipTextFiles(files: { name: string; content: string }[]): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const archive = archiver("zip", { zlib: { level: 6 } });
    const chunks: Buffer[] = [];
    archive.on("data", (chunk: Buffer) => chunks.push(chunk));
    archive.on("end", () => resolve(Buffer.concat(chunks)));
    archive.on("error", reject);

    for (const f of files) {
      archive.append(f.content, { name: f.name });
    }

    void archive.finalize().catch(reject);
  });
}

export async function GET(request: Request) {
  const auth = await requireManagerOrAuditor();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const parsed = parseExportFilters(new URL(request.url).searchParams);
  if (parsed.error) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const opts = toExportOptions(parsed);

  const [entriesCsv, votesCsv, scoresCsv, usersCsv] = await Promise.all([
    buildEntriesCsv(opts),
    buildVotesCsv(opts),
    buildScoresCsv(opts),
    buildUsersCsv(opts),
  ]);

  const buf = await zipTextFiles([
    { name: "entries.csv", content: entriesCsv },
    { name: "public-votes.csv", content: votesCsv },
    { name: "judge-scores.csv", content: scoresCsv },
    { name: "users.csv", content: usersCsv },
  ]);

  const suffix = exportFilenameSuffix(parsed);
  const filename = `export-pack-${suffix ? `${suffix}-` : ""}${new Date().toISOString().slice(0, 10)}.zip`;

  return new NextResponse(new Uint8Array(buf), {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
