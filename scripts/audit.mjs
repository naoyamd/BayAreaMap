import { readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL, fileURLToPath } from "node:url";

const SHARD_COUNT = 45;
const TIMEOUT_MS = 12000;
const CONCURRENCY = 3;
const MAX_LOCATION_DISTANCE_KM = 1;
const USER_AGENT = "BayAreaMap-Audit/2.0 (+https://github.com/naoyamd/BayAreaMap)";
const DATA_PATH = fileURLToPath(new URL("../data/entities.geojson", import.meta.url));
const CENSUS_GEOCODER = "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress";

export function hashId(id) {
  let h = 0x811c9dc5;
  for (const char of String(id)) {
    h ^= char.charCodeAt(0);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

export function selectFeatures(features, { all = false, shard = null } = {}) {
  if (all) return features.filter(() => true);
  return features.filter((f) => hashId(f?.properties?.id ?? "") % SHARD_COUNT === shard);
}

export function distanceKm([lon1, lat1], [lon2, lat2]) {
  const radians = Math.PI / 180;
  const dLat = (lat2 - lat1) * radians;
  const dLon = (lon2 - lon1) * radians;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * radians) * Math.cos(lat2 * radians) * Math.sin(dLon / 2) ** 2;
  return 6371.0088 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function normalizedWords(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/<[^>]*>/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

export function sourceMentionsLocation(html, location) {
  const documentWords = new Set(normalizedWords(html));
  const addressWords = normalizedWords(location.address);
  const number = addressWords.find((word) => /^\d+$/.test(word));
  const street = addressWords.find((word) => /^[a-z]{4,}$/.test(word));
  const city = normalizedWords(location.city).filter((word) => word.length >= 4);
  const required = [number, street, ...city].filter(Boolean);
  return required.length >= 2 && required.every((word) => documentWords.has(word));
}

export function sourceMentionsPresence(html, location) {
  if (location.precision === "address") return sourceMentionsLocation(html, location);
  const documentWords = new Set(normalizedWords(html));
  const cityWords = normalizedWords(location.city).filter((word) => word.length >= 3);
  return cityWords.length > 0 && cityWords.every((word) => documentWords.has(word));
}

export function classifyLocation({ distance }) {
  if (!Number.isFinite(distance) || distance > MAX_LOCATION_DISTANCE_KM) return "review";
  return "matched";
}

export function classifyPresence({ sourceUrl, sourceOk, sourceHtml, location }) {
  if (!sourceUrl) return "unchecked";
  return sourceOk && sourceMentionsPresence(sourceHtml, location) ? "verified" : "review";
}

function parseArgs(argv) {
  const opts = { all: false, shard: null };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--all") {
      if (opts.all) throw new Error("--all given more than once");
      opts.all = true;
    } else if (arg === "--shard") {
      if (opts.shard !== null) throw new Error("--shard given more than once");
      const raw = argv[++i];
      if (raw === undefined || !/^\d+$/.test(raw)) throw new Error("--shard requires an integer");
      const n = Number(raw);
      if (!Number.isInteger(n) || n < 0 || n >= SHARD_COUNT) {
        throw new Error(`--shard must be between 0 and ${SHARD_COUNT - 1}`);
      }
      opts.shard = n;
    } else {
      throw new Error(`unknown argument: ${arg}`);
    }
  }
  if (opts.all && opts.shard !== null) throw new Error("--all and --shard are mutually exclusive");
  return opts;
}

function utcToday() {
  return new Date().toISOString().slice(0, 10);
}

async function fetchPage(url, readBody = false) {
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { "User-Agent": USER_AGENT },
    });
    const ok = response.status >= 200 && response.status <= 399;
    const text = readBody && ok ? await response.text() : "";
    if (!readBody) await response.body?.cancel().catch(() => {});
    return { ok, status: response.status, detail: `HTTP ${response.status}`, text };
  } catch (error) {
    return {
      ok: false,
      status: null,
      detail: error?.cause?.code ?? error?.cause?.message ?? error?.message ?? "network error",
      text: "",
    };
  }
}

async function geocodeLocation(location) {
  const address = [
    location.address,
    location.city,
    location.region,
    location.postalCode,
  ].filter(Boolean).join(", ");
  const url = new URL(CENSUS_GEOCODER);
  url.searchParams.set("address", address);
  url.searchParams.set("benchmark", "Public_AR_Current");
  url.searchParams.set("format", "json");
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { "User-Agent": USER_AGENT },
    });
    if (!response.ok) return { ok: false, detail: `HTTP ${response.status}` };
    const body = await response.json();
    const match = body?.result?.addressMatches?.[0];
    const lon = Number(match?.coordinates?.x);
    const lat = Number(match?.coordinates?.y);
    if (!Number.isFinite(lon) || !Number.isFinite(lat)) {
      return { ok: false, detail: "no address match" };
    }
    return {
      ok: true,
      coordinates: [lon, lat],
      detail: match.matchedAddress ?? "matched",
    };
  } catch (error) {
    return {
      ok: false,
      detail: error?.cause?.code ?? error?.cause?.message ?? error?.message ?? "network error",
    };
  }
}

async function runPool(items, limit, fn) {
  let next = 0;
  async function worker() {
    while (next < items.length) await fn(items[next++]);
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
}

async function audit(argv) {
  let opts;
  try {
    opts = parseArgs(argv);
  } catch (error) {
    console.error(error.message);
    console.error("Usage: node scripts/audit.mjs [--all | --shard N]   (N: 0..44)");
    process.exitCode = 1;
    return;
  }
  if (!opts.all && opts.shard === null) {
    opts.shard = Math.floor(Date.now() / 86400000) % SHARD_COUNT;
  }

  let geo;
  try {
    geo = JSON.parse(readFileSync(DATA_PATH, "utf8"));
  } catch (error) {
    console.error(`failed to read/parse ${DATA_PATH}: ${error.message}`);
    process.exitCode = 1;
    return;
  }
  const features = geo?.features;
  if (!Array.isArray(features)) {
    console.error(`${DATA_PATH} is not a FeatureCollection with a features array`);
    process.exitCode = 1;
    return;
  }

  const selected = selectFeatures(features, opts);
  const date = utcToday();
  const shardLabel = opts.all ? "all" : String(opts.shard);
  console.log(`BayAreaMap audit ${date} | shard: ${shardLabel} | selected: ${selected.length}`);

  let websiteOk = 0;
  let websiteReview = 0;
  await runPool(selected, CONCURRENCY, async (feature) => {
    const props = feature.properties;
    const result = await fetchPage(props.website);
    props.websiteCheck = {
      checkedAt: date,
      status: result.ok ? "ok" : "review",
    };
    if (result.ok) websiteOk++; else websiteReview++;
    console.log(`${props.websiteCheck.status.padEnd(7)} website ${props.id} ${result.detail}`);
  });

  let locationChecked = 0;
  let locationReview = 0;
  for (const feature of selected) {
    const props = feature.properties;
    const location = props.location;
    if (location.precision !== "address") continue;
    locationChecked++;
    const geocode = await geocodeLocation(location);
    location.checkedAt = date;
    if (!geocode.ok) {
      location.status = "review";
      locationReview++;
      console.log(`review  location ${props.id} ${geocode.detail}`);
      continue;
    }

    const distance = distanceKm(feature.geometry.coordinates, geocode.coordinates);
    location.status = classifyLocation({ distance });
    if (location.status === "review") locationReview++;
    console.log(
      `${location.status.padEnd(8)} location ${props.id} ${distance.toFixed(2)} km`,
    );
  }

  let presenceChecked = 0;
  let presenceReview = 0;
  for (const feature of selected) {
    const props = feature.properties;
    const check = props.presenceCheck;
    if (!check.sourceUrl) continue;
    presenceChecked++;
    const source = await fetchPage(check.sourceUrl, true);
    if (!source.ok && ![404, 410].includes(source.status)) {
      console.log(`${check.status.padEnd(8)} presence ${props.id} ${source.detail}, retained`);
      continue;
    }
    check.checkedAt = date;
    check.status = classifyPresence({
      sourceUrl: check.sourceUrl,
      sourceOk: source.ok,
      sourceHtml: source.text,
      location: props.location,
    });
    if (check.status === "review") presenceReview++;
    console.log(`${check.status.padEnd(8)} presence ${props.id} ${source.detail}`);
  }

  if (selected.length) {
    try {
      writeFileSync(DATA_PATH, `${JSON.stringify(geo, null, 2)}\n`);
    } catch (error) {
      console.error(`failed to write ${DATA_PATH}: ${error.message}`);
      process.exitCode = 1;
      return;
    }
  }

  console.log(
    `Summary: shard ${shardLabel} | selected ${selected.length} | website ok ${websiteOk}, review ${websiteReview} | ` +
    `address locations checked ${locationChecked}, review ${locationReview} | ` +
    `presence checked ${presenceChecked}, review ${presenceReview} | ` +
    `${selected.length ? "wrote" : "no changes written"}`,
  );
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  audit(process.argv.slice(2)).catch((error) => {
    console.error(`audit failed: ${error.message}`);
    process.exitCode = 1;
  });
}
