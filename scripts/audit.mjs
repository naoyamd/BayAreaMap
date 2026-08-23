import { readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL, fileURLToPath } from "node:url";

const SHARD_COUNT = 45;
const TIMEOUT_MS = 12000;
const CONCURRENCY = 3;
const MAX_OFFICIAL_PAGES = 8;
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

export function locationNeedsAddress(location) {
  if (location?.precision === "city") return true;
  const address = normalizedWords(location?.address).join(" ");
  const city = normalizedWords(location?.city).join(" ");
  const region = normalizedWords(location?.region).join(" ");
  return Boolean(city) && (address === city || address === `${city} ${region}`);
}

export function selectFeatures(features, { all = false, shard = null, cityOnly = false, city = null } = {}) {
  const selected = all
    ? features.filter(() => true)
    : features.filter((f) => hashId(f?.properties?.id ?? "") % SHARD_COUNT === shard);
  return selected.filter((feature) => {
    const location = feature?.properties?.location;
    return (!city || location?.city === city) && (!cityOnly || locationNeedsAddress(location));
  });
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

export function sourceMentionsEntity(html, name) {
  const document = ` ${normalizedWords(html).join(" ")} `;
  const names = [...new Set([
    String(name ?? ""),
    String(name ?? "").replace(/\s+(?:san francisco|san jose|silicon valley|bay area)$/i, ""),
  ])];
  const legalSuffixes = new Set([
    "co", "company", "corp", "corporation", "inc", "incorporated", "llc", "ltd", "limited",
  ]);
  const variants = names.flatMap((candidate) => {
    const words = normalizedWords(candidate);
    if (!words.length) return [];
    return words.length > 2 && legalSuffixes.has(words.at(-1)) ? [words, words.slice(0, -1)] : [words];
  });
  return variants.some((variant) => document.includes(` ${variant.join(" ")} `));
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

export function sourceMentionsEntityNearLocation(html, location, name) {
  const words = normalizedWords(addressText(html));
  const addressWords = normalizedWords(location.address);
  if (addressWords.length < 2) return false;
  for (let i = 0; i < words.length - 1; i++) {
    if (words[i] !== addressWords[0] || words[i + 1] !== addressWords[1]) continue;
    const postalIndex = location.postalCode
      ? words.slice(i, i + 30).indexOf(String(location.postalCode).toLowerCase())
      : -1;
    const end = postalIndex >= 0 ? i + postalIndex + 1 : i + addressWords.length + 10;
    if (sourceMentionsEntity(words.slice(Math.max(0, i - 60), end).join(" "), name)) return true;
  }
  return false;
}

function host(url) {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\d*\./, "");
  } catch {
    return "";
  }
}

function sameOrganizationHost(a, b) {
  const aHost = host(a);
  const bHost = host(b);
  return aHost && bHost &&
    (aHost === bHost || aHost.endsWith(`.${bHost}`) || bHost.endsWith(`.${aHost}`));
}

export function officialAddressSource(properties) {
  const website = properties?.website;
  const websiteHost = host(website);
  const presenceUrl = properties?.presenceCheck?.sourceUrl;
  const presenceHost = host(presenceUrl);
  if (presenceHost && websiteHost &&
      (presenceHost === websiteHost || presenceHost.endsWith(`.${websiteHost}`) ||
       websiteHost.endsWith(`.${presenceHost}`))) {
    return presenceUrl;
  }
  const profileUrl = properties?.profileSourceUrl;
  if (sameOrganizationHost(profileUrl, website)) return profileUrl;
  return website ?? null;
}

export function discoverOfficialLocationUrls(html, baseUrl, website) {
  const candidates = [];
  const links = String(html ?? "").matchAll(
    /<a\b[^>]*href\s*=\s*(["'])(.*?)\1[^>]*>([\s\S]*?)<\/a>/gi,
  );
  for (const match of links) {
    let url;
    try {
      url = new URL(match[2].replace(/&amp;/gi, "&"), baseUrl);
    } catch {
      continue;
    }
    if (!/^https?:$/.test(url.protocol) || !sameOrganizationHost(url.href, website)) continue;
    url.hash = "";
    const label = `${url.pathname} ${match[3].replace(/<[^>]+>/g, " ")}`
      .toLowerCase().replace(/[^a-z]+/g, " ");
    if (/\b(privacy|terms|career|jobs|news|press|blog|support|product|login)\b/.test(label)) continue;
    let score = 0;
    if (/\b(locations?|offices?|network|branches|where we are|global|subsidiaries|affiliates|group companies)\b/.test(label)) score = 4;
    else if (/\bcontact\b/.test(label)) score = 3;
    else if (/\b(about|company|corporate|profile)\b/.test(label)) score = 1;
    if (score) candidates.push({ url: url.href, score });
  }
  return [...new Map(
    candidates.sort((a, b) => b.score - a.score).map((item) => [item.url, item]),
  ).values()].map((item) => item.url);
}

function addressText(html) {
  return String(html ?? "")
    .replace(/<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");
}

export function extractCaliforniaAddresses(html, cities) {
  const text = addressText(html);
  const suffix = "(?:Street|St\\.?|Avenue|Ave\\.?|Road|Rd\\.?|Boulevard|Blvd\\.?|Drive|Dr\\.?|Lane|Ln\\.?|Way|Circle|Cir\\.?|Court|Ct\\.?|Parkway|Pkwy\\.?|Plaza|Place|Pl\\.?|Highway|Hwy\\.?|Expressway|Expy\\.?|Terrace|Trail|Loop|Square|Center|Mall|Real|Robles)";
  const streetWord = "(?:[A-Za-z.'’&-]+|\\d+(?:st|nd|rd|th))";
  const unit = "(?:\\s*,?\\s*(?:Tower|Building|Bldg\\.?|Suite|Ste\\.?|Floor|Fl\\.?|Unit|#)\\s*[A-Za-z0-9-]+){0,2}";
  const results = [];
  for (const city of [...new Set(cities)].sort((a, b) => b.length - a.length)) {
    const escapedCity = String(city ?? "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (!escapedCity) continue;
    const matches = text.matchAll(new RegExp(
      `\\b(\\d{1,6}\\s+(?:${streetWord}\\s+){0,8}${suffix}${unit})\\s*,?\\s*${escapedCity}\\s*,?\\s*(?:California|CA)\\s*[,.]?\\s*(\\d{5}(?:-\\d{4})?)\\b`,
      "gi",
    ));
    for (const match of matches) {
      results.push({
        address: match[1].replace(/\s*,\s*/g, ", ").replace(/\s+/g, " ").trim(),
        city,
        postalCode: match[2],
      });
    }
  }
  return results;
}

export function extractCaliforniaAddress(html, city) {
  const match = extractCaliforniaAddresses(html, [city])[0];
  return match ? { address: match.address, postalCode: match.postalCode } : null;
}

export function chooseAddressCandidate(candidates, currentCity) {
  const unique = [...new Map(candidates.map((candidate) => [
    `${candidate.address}|${candidate.city}|${candidate.postalCode}`.toLowerCase(),
    candidate,
  ])).values()];
  const sameCity = unique.filter((candidate) => candidate.city === currentCity);
  if (sameCity.length === 1) return sameCity[0];
  if (sameCity.length > 1) return null;
  return unique.length === 1 ? unique[0] : null;
}

export function classifyLocation({ distance }) {
  if (!Number.isFinite(distance) || distance > MAX_LOCATION_DISTANCE_KM) return "review";
  return "matched";
}

export function classifyPresence({ sourceUrl, sourceOk, sourceHtml, location, entityName, trustedSource = true }) {
  if (!sourceUrl) return "unchecked";
  return trustedSource && sourceOk && sourceMentionsEntity(sourceHtml, entityName) &&
    sourceMentionsPresence(sourceHtml, location) ? "verified" : "review";
}

function parseArgs(argv) {
  const opts = { all: false, shard: null, cityOnly: false, city: null };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--all") {
      if (opts.all) throw new Error("--all given more than once");
      opts.all = true;
    } else if (arg === "--city-only") {
      if (opts.cityOnly) throw new Error("--city-only given more than once");
      opts.cityOnly = true;
    } else if (arg === "--city") {
      if (opts.city !== null) throw new Error("--city given more than once");
      opts.city = argv[++i];
      if (!opts.city) throw new Error("--city requires a city name");
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
    return { ok, status: response.status, detail: `HTTP ${response.status}`, text, url: response.url };
  } catch (error) {
    return {
      ok: false,
      status: null,
      detail: error?.cause?.code ?? error?.cause?.message ?? error?.message ?? "network error",
      text: "",
    };
  }
}

async function fetchOfficialAddressPages(properties) {
  const website = properties.website;
  const queue = [...new Set([
    officialAddressSource(properties), properties.profileSourceUrl, website,
  ].filter((url) => url && sameOrganizationHost(url, website)))];
  const visited = new Set();
  const pages = [];
  while (queue.length && pages.length < MAX_OFFICIAL_PAGES) {
    const requestedUrl = queue.shift();
    if (visited.has(requestedUrl)) continue;
    visited.add(requestedUrl);
    const page = await fetchPage(requestedUrl, true);
    const sourceUrl = page.url || requestedUrl;
    if (!page.ok || !sameOrganizationHost(sourceUrl, website)) continue;
    pages.push({ sourceUrl, text: page.text });
    for (const url of discoverOfficialLocationUrls(page.text, sourceUrl, website)) {
      if (!visited.has(url) && !queue.includes(url)) queue.push(url);
    }
  }
  return pages;
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
    console.error('Usage: node scripts/audit.mjs [--all | --shard N] [--city-only] [--city "City"]   (N: 0..44)');
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

  const countyByCity = new Map(features.map((feature) => [
    feature.properties.location.city,
    feature.properties.location.county,
  ]));
  const bayAreaCities = [...countyByCity.keys()].filter(Boolean);
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
  let officialSourcesLinked = 0;
  let cityLocationsUpgraded = 0;
  const cityFeatures = selected.filter((feature) => locationNeedsAddress(feature.properties.location));
  await runPool(cityFeatures, CONCURRENCY, async (feature) => {
    const props = feature.properties;
    const location = props.location;
    const pages = await fetchOfficialAddressPages(props);
    const entityName = props.name;
    const candidates = pages.flatMap((page) => {
      const found = extractCaliforniaAddresses(page.text, bayAreaCities);
      return found.map((candidate) => ({
        ...candidate,
        sourceUrl: page.sourceUrl,
        entityMatched: found.length === 1
          ? sourceMentionsEntity(page.text, entityName)
          : sourceMentionsEntityNearLocation(page.text, candidate, entityName),
      }));
    });
    const candidate = chooseAddressCandidate(candidates.filter((item) => item.entityMatched), location.city);
    if (!candidate) {
      const presencePage = pages.find((page) =>
        sourceMentionsEntity(page.text, entityName) && sourceMentionsPresence(page.text, location),
      );
      if (presencePage) {
        location.sourceUrl = presencePage.sourceUrl;
        props.presenceCheck = { checkedAt: date, status: "verified", sourceUrl: presencePage.sourceUrl };
        props.updatedAt = date;
        geo.metadata.updatedAt = date;
        officialSourcesLinked++;
      }
      return;
    }
    const geocode = await geocodeLocation({ ...location, ...candidate, region: "CA" });
    if (!geocode.ok) {
      console.log(`review  discovery ${props.id} ${geocode.detail}`);
      return;
    }
    const oldCity = location.city;
    feature.geometry.coordinates = geocode.coordinates;
    Object.assign(location, {
      address: candidate.address,
      city: candidate.city,
      region: "CA",
      postalCode: candidate.postalCode,
      county: countyByCity.get(candidate.city),
      precision: "address",
      coordinateSource: "census-geocoder",
      sourceUrl: candidate.sourceUrl,
      checkedAt: date,
      status: "matched",
    });
    props.presenceCheck = { checkedAt: date, status: "verified", sourceUrl: candidate.sourceUrl };
    props.updatedAt = date;
    geo.metadata.updatedAt = date;
    officialSourcesLinked++;
    cityLocationsUpgraded++;
    console.log(`matched  discovery ${props.id} ${oldCity} -> ${candidate.city} | ${candidate.address}`);
  });

  for (const feature of selected) {
    const props = feature.properties;
    const location = props.location;
    if (location.precision !== "address") continue;
    if (!location.sourceUrl) {
      const entityName = props.name;
      const pages = await fetchOfficialAddressPages(props);
      const source = pages.find((page) =>
        sourceMentionsEntity(page.text, entityName) && sourceMentionsLocation(page.text, location),
      );
      if (source) {
        location.sourceUrl = source.sourceUrl;
        props.presenceCheck = { checkedAt: date, status: "verified", sourceUrl: source.sourceUrl };
        props.updatedAt = date;
        geo.metadata.updatedAt = date;
        officialSourcesLinked++;
      }
    }
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
      entityName: props.name,
      trustedSource: sameOrganizationHost(check.sourceUrl, props.website) ||
        (props.location.precision === "address" && check.sourceUrl === props.location.sourceUrl),
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
    `official sources linked ${officialSourcesLinked}, city locations upgraded ${cityLocationsUpgraded} | ` +
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
