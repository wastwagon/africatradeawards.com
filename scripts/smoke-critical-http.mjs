const argv = process.argv.slice(2);

function readArg(name, fallback) {
  const idx = argv.findIndex((value) => value === `--${name}`);
  if (idx === -1) return fallback;
  return argv[idx + 1] ?? fallback;
}

const baseUrl = (readArg("base-url", process.env.SMOKE_BASE_URL ?? "http://127.0.0.1:3003") || "").replace(/\/+$/, "");
const timeoutMs = Number(readArg("timeout-ms", "10000"));

if (!baseUrl) {
  console.error("FAIL: base URL is required (use --base-url or SMOKE_BASE_URL).");
  process.exit(1);
}

const checks = [
  { name: "Home page", path: "/", expected: [200] },
  { name: "Vote page", path: "/vote", expected: [200] },
  { name: "Public site config API", path: "/api/site/public-config", expected: [200] },
  { name: "Health API", path: "/api/health", expected: [200, 500] },
];

function isExpected(status, expected) {
  return expected.includes(status);
}

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: { "user-agent": "oceancyber-smoke-check/1.0" },
    });
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  console.log(`Smoke checks on ${baseUrl}`);
  let failed = 0;

  for (const check of checks) {
    const url = `${baseUrl}${check.path}`;
    try {
      const response = await fetchWithTimeout(url);
      const ok = isExpected(response.status, check.expected);
      const marker = ok ? "PASS" : "FAIL";
      console.log(`- ${marker}: ${check.name} -> ${response.status} (${check.path})`);
      if (!ok) failed += 1;
    } catch (error) {
      failed += 1;
      const reason = error instanceof Error ? error.message : String(error);
      console.log(`- FAIL: ${check.name} -> ${reason} (${check.path})`);
    }
  }

  if (failed > 0) {
    console.error(`Smoke checks failed: ${failed} check(s).`);
    process.exit(1);
  }
  console.log("Smoke checks passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
