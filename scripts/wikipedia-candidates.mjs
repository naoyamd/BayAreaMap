#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const API_URL = "https://en.wikipedia.org/w/api.php";
const USER_AGENT = "BayAreaMap-WikipediaDiscovery/1.0 (https://github.com/naoyamd/BayAreaMap)";
const DELAY_MS = 1500;
const DATA_PATH = fileURLToPath(new URL("../data/entities.geojson", import.meta.url));
const OUTPUT_PATH = fileURLToPath(new URL("../data/wikipedia-candidates.json", import.meta.url));
const ROOTS = [
  ["Category:Companies based in Silicon Valley", "company"],
  ["Category:Technology companies based in the San Francisco Bay Area", "company"],
  ["Category:Unmanned aerial vehicle manufacturers of the United States", "company"],
  ["Category:Universities and colleges in the San Francisco Bay Area", "university-research"],
  ["Category:Research institutes in the San Francisco Bay Area", "university-research"],
];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function normalizeName(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/\([^)]*\)/g, "")
    .replace(/\b(incorporated|inc|corporation|corp|company|co|llc|ltd|plc)\b/g, "")
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

export function buildCandidateReport(pages, knownNames) {
  const known = new Set(knownNames.map(normalizeName).filter(Boolean));
  return [...pages.values()]
    .filter((page) => !known.has(normalizeName(page.title)))
    .map((page) => ({
      title: page.title,
      kind: [...page.kinds].sort(),
      sourceCategories: [...page.sourceCategories].sort(),
      wikipediaUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title.replaceAll(" ", "_"))}`,
    }))
    .sort((a, b) =>
      Number(b.kind.includes("university-research")) - Number(a.kind.includes("university-research")) ||
      b.sourceCategories.length - a.sourceCategories.length ||
      a.title.localeCompare(b.title, "en"),
    );
}

async function requestCategory(title) {
  const items = [];
  let requestCount = 0;
  let continuation = null;
  do {
    const params = new URLSearchParams({
      action: "query", list: "categorymembers", cmtitle: title, cmtype: "page|subcat",
      cmlimit: "max", format: "json", formatversion: "2", maxlag: "5",
    });
    if (continuation) params.set("cmcontinue", continuation);
    let response;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      response = await fetch(`${API_URL}?${params}`, { headers: { "User-Agent": USER_AGENT } });
      requestCount += 1;
      if (response.ok) break;
      if (![429, 503].includes(response.status)) throw new Error(`${title}: HTTP ${response.status}`);
      const retryAfter = Number(response.headers.get("retry-after")) || 5;
      await wait(retryAfter * 1000);
    }
    if (!response?.ok) throw new Error(`${title}: Wikipedia remained busy after retries`);
    const payload = await response.json();
    if (payload.error) throw new Error(`${title}: ${payload.error.info || payload.error.code}`);
    items.push(...(payload.query?.categorymembers ?? []));
    continuation = payload.continue?.cmcontinue ?? null;
    await wait(DELAY_MS);
  } while (continuation);
  return { items, requestCount };
}

async function main() {
  const geojson = JSON.parse(readFileSync(DATA_PATH, "utf8"));
  const knownNames = geojson.features.flatMap(({ properties }) => [properties.name, properties.nameJa]);
  const pages = new Map();
  let requestCount = 0;

  for (const [root, kind] of ROOTS) {
    const rootResponse = await requestCategory(root);
    const rootItems = rootResponse.items;
    requestCount += rootResponse.requestCount;
    const categories = [root, ...rootItems.filter((item) => item.ns === 14).map((item) => item.title)];
    for (const category of categories) {
      const response = category === root ? null : await requestCategory(category);
      const items = response?.items ?? rootItems;
      requestCount += response?.requestCount ?? 0;
      for (const item of items.filter((entry) => entry.ns === 0)) {
        const page = pages.get(item.pageid) ?? {
          title: item.title, kinds: new Set(), sourceCategories: new Set(),
        };
        page.kinds.add(kind);
        page.sourceCategories.add(category);
        pages.set(item.pageid, page);
      }
    }
  }

  const candidates = buildCandidateReport(pages, knownNames);
  const report = {
    generatedAt: new Date().toISOString(),
    policy: "Discovery only. Manually select important active organizations and verify an official street address before adding data.",
    roots: ROOTS.map(([title]) => title),
    requestCount,
    knownEntityCount: geojson.features.length,
    candidateCount: candidates.length,
    candidates,
  };
  writeFileSync(OUTPUT_PATH, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Wrote ${candidates.length} candidates from ${requestCount} serialized requests to ${OUTPUT_PATH}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
