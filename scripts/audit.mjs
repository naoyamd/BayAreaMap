import { appendFileSync, readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL, fileURLToPath } from "node:url";
import { gunzipSync } from "node:zlib";

const SHARD_COUNT = 45;
export const DEFAULT_BATCH_SIZE = 75;
const TIMEOUT_MS = 12000;
const CONCURRENCY = 3;
const MAX_OFFICIAL_PAGES = 8;
const MAX_SITEMAPS = 2;
const MAX_SITEMAP_BYTES = 5 * 1024 * 1024;
const MAX_LOCATION_DISTANCE_KM = 1;
const USER_AGENT = "BayAreaMap-Audit/2.0 (+https://github.com/naoyamd/BayAreaMap)";
const ROBOTS_AGENT = "bayareamap-audit";
const DATA_PATH = fileURLToPath(new URL("../data/entities.geojson", import.meta.url));
const CENSUS_GEOCODER = "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress";
const robotsCache = new Map();
const sitemapCache = new Map();

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

export function selectFeatures(features, { all = false, shard = null, ids = null, cityOnly = false, city = null, limit = DEFAULT_BATCH_SIZE } = {}) {
  let selected = ids
    ? features.filter((f) => ids.has(f?.properties?.id))
    : all
    ? features.filter(() => true)
    : shard !== null
    ? features.filter((f) => hashId(f?.properties?.id ?? "") % SHARD_COUNT === shard)
    : [...features].sort((a, b) =>
      String(a?.properties?.websiteCheck?.checkedAt ?? "").localeCompare(
        String(b?.properties?.websiteCheck?.checkedAt ?? ""),
      ) || String(a?.properties?.id ?? "").localeCompare(String(b?.properties?.id ?? "")),
    );
  selected = selected.filter((feature) => {
    const location = feature?.properties?.location;
    return (!city || location?.city === city) && (!cityOnly || locationNeedsAddress(location));
  });
  return !ids && !all && shard === null ? selected.slice(0, limit) : selected;
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
  const documentWords = normalizedWords(html);
  const document = ` ${documentWords.join(" ")} `;
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
  return variants.some((variant) => {
    if (document.includes(` ${variant.join(" ")} `)) return true;
    const compact = variant.join("");
    if (compact.length < 6) return false;
    for (let i = 0; i < documentWords.length; i++) {
      let joined = "";
      for (let j = i; j < Math.min(documentWords.length, i + variant.length + 2); j++) {
        joined += documentWords[j];
        if (joined === compact) return true;
        if (joined.length >= compact.length) break;
      }
    }
    return false;
  });
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
  const locationUrl = properties?.location?.sourceUrl;
  if (sameOrganizationHost(locationUrl, website)) return locationUrl;
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
    const label = `${url.pathname} ${match[3].replace(/<[^>]+>/g, " ")}`;
    const score = officialLocationScore(label);
    if (score) candidates.push({ url: url.href, score });
  }
  return [...new Map(
    candidates.sort((a, b) => b.score - a.score).map((item) => [item.url, item]),
  ).values()].map((item) => item.url);
}

function officialLocationScore(value) {
  const label = String(value ?? "").toLowerCase().replace(/[^a-z]+/g, " ");
  if (/\b(privacy|terms?|legal|polic(?:y|ies)|agreements?|rules?|careers?|jobs?|news|press|blog|campaigns?|insights?|support|products?|login)\b/.test(label)) return 0;
  if (/\b(locations?|offices?|branches|where we are|global network)\b/.test(label)) return 5;
  if (/\b(contact|subsidiaries|affiliates|group companies)\b/.test(label)) return 4;
  if (/\b(about|company|corporate|profile)\b/.test(label)) return 1;
  return 0;
}

export function isVerificationSourceUrl(sourceUrl) {
  try {
    const url = new URL(sourceUrl);
    const label = `${url.hostname} ${url.pathname}`.toLowerCase().replace(/[^a-z0-9]+/g, " ");
    if (/\.pdf$/i.test(url.pathname)) return false;
    if (/\b(privacy|terms?|legal|polic(?:y|ies)|agreements?|rules?|careers?|jobs?|news|press|blog|campaigns?|insights?|products?|support|login)\b/.test(label)) return false;
    if (/\/20\d{2}\//.test(url.pathname) && !officialLocationScore(url.pathname)) return false;
    return /^https?:$/.test(url.protocol);
  } catch {
    return false;
  }
}

export function isOfficialLocationPageUrl(sourceUrl) {
  try { return officialLocationScore(new URL(sourceUrl).pathname) >= 4; } catch { return false; }
}

function decodeXml(value) {
  return String(value ?? "")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'");
}

export function extractSitemapUrls(xml) {
  return [...String(xml ?? "").matchAll(/<loc\b[^>]*>([\s\S]*?)<\/loc>/gi)]
    .map((match) => decodeXml(match[1]).trim())
    .filter(Boolean);
}

export function rankOfficialLocationUrls(urls, website) {
  const ranked = [];
  for (const candidate of urls) {
    try {
      const url = new URL(candidate);
      url.hash = "";
      const score = sameOrganizationHost(url.href, website) ? officialLocationScore(url.pathname) : 0;
      if (score) ranked.push({ url: url.href, score });
    } catch {
      // Ignore malformed sitemap entries.
    }
  }
  return [...new Map(
    ranked.sort((a, b) => b.score - a.score || a.url.localeCompare(b.url))
      .map((item) => [item.url, item]),
  ).values()].map((item) => item.url);
}

export function rankSitemapUrls(urls, website) {
  return [...urls].sort((a, b) =>
    sitemapPriority(b, website) - sitemapPriority(a, website) || a.localeCompare(b),
  );
}

export function parseRobots(text, origin) {
  const sitemaps = [];
  const groups = [];
  let agents = [];
  let rules = [];
  let sawRule = false;
  const flush = () => {
    if (agents.length) groups.push({ agents, rules });
    agents = [];
    rules = [];
    sawRule = false;
  };
  for (const rawLine of String(text ?? "").split(/\r?\n/)) {
    const line = rawLine.replace(/\s+#.*$/, "").trim();
    if (!line) continue;
    const match = line.match(/^([a-z-]+)\s*:\s*(.*)$/i);
    if (!match) continue;
    const key = match[1].toLowerCase();
    const value = match[2].trim();
    if (key === "sitemap") {
      try { sitemaps.push(new URL(value, origin).href); } catch { /* ignore */ }
    } else if (key === "user-agent") {
      if (sawRule) flush();
      agents.push(value.toLowerCase());
    } else if ((key === "allow" || key === "disallow") && agents.length) {
      sawRule = true;
      if (value) rules.push({ type: key, path: value });
    }
  }
  flush();
  const namedGroups = groups.filter((group) => group.agents.includes(ROBOTS_AGENT));
  const applicableGroups = namedGroups.length
    ? namedGroups
    : groups.filter((group) => group.agents.includes("*"));
  return {
    sitemaps: [...new Set(sitemaps)],
    rules: applicableGroups.flatMap((group) => group.rules),
  };
}

export function robotsAllows(sourceUrl, rules) {
  let target;
  try {
    const url = new URL(sourceUrl);
    target = `${url.pathname}${url.search}`;
  } catch {
    return false;
  }
  const matching = [];
  for (const rule of rules ?? []) {
    const end = rule.path.endsWith("$");
    const raw = end ? rule.path.slice(0, -1) : rule.path;
    const pattern = raw.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
    if (new RegExp(`^${pattern}${end ? "$" : ""}`).test(target)) matching.push(rule);
  }
  if (!matching.length) return true;
  matching.sort((a, b) => b.path.length - a.path.length || (a.type === "allow" ? -1 : 1));
  return matching[0].type === "allow";
}

export function robotsPolicyAllows(sourceUrl, policy) {
  return (policy?.ok || policy?.status === 404) && robotsAllows(sourceUrl, policy?.rules);
}

export function decodeSitemapBytes(bytes) {
  const buffer = Buffer.from(bytes);
  return (buffer[0] === 0x1f && buffer[1] === 0x8b ? gunzipSync(buffer) : buffer).toString("utf8");
}

function jsonLdType(value) {
  return new Set((Array.isArray(value) ? value : [value]).map((item) =>
    String(item ?? "").toLowerCase().split(/[\/#]/).at(-1),
  ));
}

function formatPostalAddress(address) {
  if (!address || typeof address !== "object") return "";
  return [address.streetAddress, address.addressLocality, address.addressRegion, address.postalCode]
    .flatMap((value) => Array.isArray(value) ? value : [value])
    .filter(Boolean).join(", ");
}

export function extractJsonLdAddressText(html) {
  const found = [];
  const add = (name, address) => {
    const text = [name, formatPostalAddress(address)].filter(Boolean).join(" ");
    if (text) found.push(text);
  };
  const walk = (value, parentName = "") => {
    if (Array.isArray(value)) {
      for (const item of value) walk(item, parentName);
      return;
    }
    if (!value || typeof value !== "object") return;
    const types = jsonLdType(value["@type"]);
    const name = value.name ?? parentName;
    if (types.has("postaladdress")) add(parentName, value);
    if (["organization", "corporation", "localbusiness"].some((type) => types.has(type))) {
      for (const address of Array.isArray(value.address) ? value.address : [value.address]) add(name, address);
    }
    for (const [key, child] of Object.entries(value)) {
      if (key !== "address") walk(child, name);
    }
  };
  for (const match of String(html ?? "").matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (!/\btype\s*=\s*(["'])application\/ld\+json\1/i.test(match[1])) continue;
    try { walk(JSON.parse(match[2].trim())); } catch { /* ignore malformed JSON-LD */ }
  }
  return [...new Set(found)].join(" ");
}

function addressText(html) {
  return `${extractJsonLdAddressText(html)} ${String(html ?? "")
    .replace(/<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")}`;
}

export function extractCaliforniaAddresses(html, cities) {
  const text = addressText(html);
  const suffix = "(?:Street|St\\.?|Avenue|Ave\\.?|Road|Rd\\.?|Boulevard|Blvd\\.?|Drive|Dr\\.?|Lane|Ln\\.?|Way|Circle|Cir\\.?|Court|Ct\\.?|Parkway|Pkwy\\.?|Plaza|Place|Pl\\.?|Highway|Hwy\\.?|Expressway|Expy\\.?|Terrace|Trail|Loop|Square|Center|Mall|Real|Robles)";
  const streetNumber = "(?:\\d{1,6}|One|Two|Three|Four|Five|Six|Seven|Eight|Nine|Ten)";
  const streetWord = "(?:[A-Za-z.'’&-]+|\\d+(?:st|nd|rd|th))";
  const unit = "(?:\\s*,?\\s*(?:Tower|Building|Bldg\\.?|Suite|Ste\\.?|Floor|Fl\\.?|Unit|#)\\s*[A-Za-z0-9-]+){0,2}";
  const results = [];
  for (const city of [...new Set(cities)].sort((a, b) => b.length - a.length)) {
    const escapedCity = String(city ?? "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (!escapedCity) continue;
    const matches = text.matchAll(new RegExp(
      `\\b(${streetNumber}\\s+(?:${streetWord}\\s+){0,8}${suffix}${unit})\\s*,?\\s*${escapedCity}\\s*,?\\s*(?:California|CA)\\s*[,.]?\\s*(\\d{5}(?:-\\d{4})?)\\b`,
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
  return trustedSource && isVerificationSourceUrl(sourceUrl) && sourceOk && sourceMentionsEntity(sourceHtml, entityName) &&
    sourceMentionsPresence(sourceHtml, location) ? "verified" : "review";
}

export function parseArgs(argv) {
  const opts = { all: false, shard: null, ids: null, cityOnly: false, city: null };
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
    } else if (arg === "--ids") {
      if (opts.ids !== null) throw new Error("--ids given more than once");
      const raw = argv[++i];
      const ids = String(raw ?? "").split(",").map((id) => id.trim()).filter(Boolean);
      if (!ids.length || ids.some((id) => !/^[a-z0-9][a-z0-9-]*$/.test(id))) {
        throw new Error("--ids requires comma-separated entity IDs");
      }
      opts.ids = new Set(ids);
    } else {
      throw new Error(`unknown argument: ${arg}`);
    }
  }
  if ([opts.all, opts.shard !== null, opts.ids !== null].filter(Boolean).length > 1) {
    throw new Error("--all, --shard, and --ids are mutually exclusive");
  }
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

export function reviewUnverifiedPresence(properties, date) {
  if (properties?.presenceCheck?.sourceUrl) return false;
  properties.presenceCheck = { checkedAt: date, status: "review", sourceUrl: null };
  properties.updatedAt = date;
  return true;
}

async function getRobots(sourceUrl) {
  let origin;
  try {
    origin = new URL(sourceUrl).origin;
  } catch {
    return { origin: "", ok: false, status: null, sitemaps: [], rules: [] };
  }
  if (!robotsCache.has(origin)) {
    robotsCache.set(origin, fetchPage(`${origin}/robots.txt`, true).then((result) => ({
      origin,
      ok: result.ok,
      status: result.status,
      ...parseRobots(result.ok ? result.text : "", origin),
    })));
  }
  return robotsCache.get(origin);
}

async function fetchSitemap(sourceUrl) {
  if (!sitemapCache.has(sourceUrl)) {
    sitemapCache.set(sourceUrl, (async () => {
      try {
        const response = await fetch(sourceUrl, {
          redirect: "follow",
          signal: AbortSignal.timeout(TIMEOUT_MS),
          headers: { "User-Agent": USER_AGENT },
        });
        if (!response.ok) return { ok: false, status: response.status, detail: `HTTP ${response.status}`, text: "" };
        const bytes = Buffer.from(await response.arrayBuffer());
        if (bytes.length > MAX_SITEMAP_BYTES) {
          return { ok: false, status: response.status, detail: "sitemap too large", text: "" };
        }
        return {
          ok: true,
          status: response.status,
          detail: `HTTP ${response.status}`,
          text: decodeSitemapBytes(bytes),
          url: response.url,
        };
      } catch (error) {
        return {
          ok: false,
          status: null,
          detail: error?.cause?.code ?? error?.cause?.message ?? error?.message ?? "network error",
          text: "",
        };
      }
    })());
  }
  return sitemapCache.get(sourceUrl);
}

function sitemapPriority(sourceUrl, website) {
  const path = (() => {
    try { return new URL(website).pathname.toLowerCase(); } catch { return ""; }
  })();
  const locale = path.split("/").find((part) => /^[a-z]{2}(?:-[a-z]{2})?$/i.test(part));
  const candidate = String(sourceUrl).toLowerCase();
  if (/(?:job|career|news|press|blog|product)[^/]*sitemap/.test(candidate)) return -100;
  return (locale && candidate.includes(`/${locale}/`) ? 10 : 0) +
    (/\/(?:us-en|en-us)\//.test(candidate) ? 5 : 0) +
    (/sitemap/.test(candidate) ? 1 : 0);
}

async function discoverSitemapLocationUrls(website, robots, stats) {
  const queue = rankSitemapUrls(
    robots.sitemaps.filter((url) => sameOrganizationHost(url, website)), website,
  );
  const visited = new Set();
  const candidates = [];
  while (queue.length && visited.size < MAX_SITEMAPS) {
    const sourceUrl = queue.shift();
    if (visited.has(sourceUrl)) continue;
    visited.add(sourceUrl);
    const sitemap = await fetchSitemap(sourceUrl);
    if (!sitemap.ok || !sameOrganizationHost(sitemap.url ?? sourceUrl, website)) {
      stats.networkBlocked++;
      continue;
    }
    stats.sitemapsFetched++;
    const urls = extractSitemapUrls(sitemap.text);
    if (/<sitemapindex\b/i.test(sitemap.text)) {
      const children = rankSitemapUrls(
        urls.filter((url) => sameOrganizationHost(url, website)), website,
      );
      queue.unshift(...children);
      continue;
    }
    candidates.push(...rankOfficialLocationUrls(urls, website));
    if (candidates.length) break;
  }
  return [...new Set(candidates)];
}

async function fetchOfficialAddressPages(properties, stats) {
  const website = properties.website;
  const robots = await getRobots(website);
  if (!robots.ok && robots.status !== 404) {
    stats.networkBlocked++;
    return [];
  }
  const sitemapUrls = await discoverSitemapLocationUrls(website, robots, stats);
  const queue = [...new Set([
    officialAddressSource(properties), properties.presenceCheck?.sourceUrl,
    properties.location?.sourceUrl, properties.profileSourceUrl, website, ...sitemapUrls,
  ].filter((url) => url && sameOrganizationHost(url, website)))];
  const visited = new Set();
  const pages = [];
  while (queue.length && visited.size < MAX_OFFICIAL_PAGES) {
    const requestedUrl = queue.shift();
    if (visited.has(requestedUrl)) continue;
    visited.add(requestedUrl);
    const policy = new URL(requestedUrl).origin === robots.origin ? robots : await getRobots(requestedUrl);
    if (!robotsPolicyAllows(requestedUrl, policy)) {
      if (!policy.ok && policy.status !== 404) stats.networkBlocked++;
      else stats.robotsBlocked++;
      continue;
    }
    stats.pagesFetched++;
    const page = await fetchPage(requestedUrl, true);
    const sourceUrl = page.url || requestedUrl;
    if (!page.ok || !sameOrganizationHost(sourceUrl, website)) {
      stats.networkBlocked++;
      continue;
    }
    pages.push({ sourceUrl, text: page.text });
    for (const url of discoverOfficialLocationUrls(page.text, sourceUrl, website)) {
      if (!visited.has(url) && !queue.includes(url)) queue.push(url);
    }
  }
  return pages;
}

function officialAddressCandidates(pages, entityName, cities) {
  const candidates = pages.flatMap((page) => {
    let path;
    try { path = new URL(page.sourceUrl).pathname; } catch { return []; }
    if (!isVerificationSourceUrl(page.sourceUrl) || !isOfficialLocationPageUrl(page.sourceUrl)) return [];
    const found = extractCaliforniaAddresses(page.text, cities);
    const directory = /\b(locations?|offices?|branches|contact)\b/.test(
      path.toLowerCase().replace(/[^a-z]+/g, " "),
    );
    const pageMatches = sourceMentionsEntity(page.text, entityName);
    return found.map((candidate) => ({
      ...candidate,
      sourceUrl: page.sourceUrl,
      entityMatched: found.length === 1 || directory
        ? pageMatches
        : sourceMentionsEntityNearLocation(page.text, candidate, entityName),
    }));
  });
  return {
    candidates,
    matched: candidates.filter((candidate) => candidate.entityMatched),
  };
}

function appendGitHubSummary(summary) {
  const output = process.env.GITHUB_STEP_SUMMARY;
  if (!output) return;
  const rows = [
    ["Selected", summary.selected],
    ["Official HTML attempts", summary.pagesFetched],
    ["Sitemaps fetched", summary.sitemapsFetched],
    ["Newly verified", summary.newlyVerified],
    ["Official sources linked", summary.officialSourcesLinked],
    ["Addresses updated", summary.addressesUpdated],
    ["No exact official evidence", summary.noEvidence],
    ["Robots blocked", summary.robotsBlocked],
    ["Network/fetch failures", summary.networkBlocked],
    ["Entity mismatch", summary.entityMismatch],
    ["Address conflict", summary.addressConflict],
    ["Website review", summary.websiteReview],
    ["Location review", summary.locationReview],
    ["Presence review", summary.presenceReview],
  ];
  try {
    appendFileSync(output, [
      `## BayAreaMap audit: ${summary.selectionLabel}`,
      "",
      "| Metric | Count |",
      "| --- | ---: |",
      ...rows.map(([label, value]) => `| ${label} | ${value} |`),
      "",
      "> Moving unchecked records to review records an attempt; it is not counted as verification.",
      "",
    ].join("\n"));
  } catch (error) {
    console.warn(`failed to append GitHub summary: ${error.message}`);
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
    console.error('Usage: node scripts/audit.mjs [--all | --shard N | --ids id[,id...]] [--city-only] [--city "City"]   (N: 0..44)');
    process.exitCode = 1;
    return;
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
  const initialPresence = new Map(selected.map((feature) => [
    feature.properties.id, feature.properties.presenceCheck.status,
  ]));
  const discoveryStats = {
    pagesFetched: 0,
    sitemapsFetched: 0,
    noEvidence: 0,
    robotsBlocked: 0,
    networkBlocked: 0,
    entityMismatch: 0,
    addressConflict: 0,
    addressesUpdated: 0,
  };
  const selectionLabel = opts.ids ? "priority" : opts.all ? "all" :
    opts.shard !== null ? `shard ${opts.shard}` : `oldest ${DEFAULT_BATCH_SIZE}`;
  console.log(`BayAreaMap audit ${date} | selection: ${selectionLabel} | selected: ${selected.length}`);

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
    const pages = await fetchOfficialAddressPages(props, discoveryStats);
    const entityName = props.name;
    const { candidates, matched } = officialAddressCandidates(pages, entityName, bayAreaCities);
    const candidate = chooseAddressCandidate(matched, location.city);
    if (candidates.length && !matched.length) discoveryStats.entityMismatch++;
    if (matched.length && !candidate) discoveryStats.addressConflict++;
    if (!candidate) {
      const presencePage = pages.find((page) => isOfficialLocationPageUrl(page.sourceUrl) && classifyPresence({
        sourceUrl: page.sourceUrl,
        sourceOk: true,
        sourceHtml: page.text,
        location,
        entityName,
      }) === "verified");
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
      props.presenceCheck = { checkedAt: date, status: "review", sourceUrl: candidate.sourceUrl };
      props.updatedAt = date;
      geo.metadata.updatedAt = date;
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
    discoveryStats.addressesUpdated++;
    console.log(`matched  discovery ${props.id} ${oldCity} -> ${candidate.city} | ${candidate.address}`);
  });

  const addressFeatures = selected.filter((feature) => feature.properties.location.precision === "address");
  await runPool(addressFeatures, CONCURRENCY, async (feature) => {
    const props = feature.properties;
    const location = props.location;
    if (!location.sourceUrl || !isOfficialLocationPageUrl(location.sourceUrl)) {
      const entityName = props.name;
      const pages = await fetchOfficialAddressPages(props, discoveryStats);
      const source = pages.find((page) => isOfficialLocationPageUrl(page.sourceUrl) && classifyPresence({
        sourceUrl: page.sourceUrl,
        sourceOk: true,
        sourceHtml: page.text,
        location,
        entityName,
      }) === "verified");
      if (source) {
        location.sourceUrl = source.sourceUrl;
        props.presenceCheck = { checkedAt: date, status: "verified", sourceUrl: source.sourceUrl };
        props.updatedAt = date;
        geo.metadata.updatedAt = date;
        officialSourcesLinked++;
      } else {
        const { candidates, matched } = officialAddressCandidates(pages, entityName, bayAreaCities);
        const candidate = chooseAddressCandidate(matched, location.city);
        if (candidates.length && !matched.length) discoveryStats.entityMismatch++;
        if (matched.length && !candidate) discoveryStats.addressConflict++;
        if (candidate) {
          const geocode = await geocodeLocation({ ...location, ...candidate, region: "CA" });
          if (!geocode.ok) {
            props.presenceCheck = { checkedAt: date, status: "review", sourceUrl: candidate.sourceUrl };
            props.updatedAt = date;
            geo.metadata.updatedAt = date;
            console.log(`review  discovery ${props.id} ${geocode.detail}`);
          } else {
            const oldAddress = location.address;
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
            discoveryStats.addressesUpdated++;
            console.log(`matched  correction ${props.id} ${oldAddress} -> ${candidate.address}`);
          }
        }
      }
    }
    locationChecked++;
    const geocode = await geocodeLocation(location);
    location.checkedAt = date;
    if (!geocode.ok) {
      location.status = "review";
      locationReview++;
      console.log(`review  location ${props.id} ${geocode.detail}`);
      return;
    }

    const distance = distanceKm(feature.geometry.coordinates, geocode.coordinates);
    location.status = classifyLocation({ distance });
    if (location.status === "review") locationReview++;
    console.log(
      `${location.status.padEnd(8)} location ${props.id} ${distance.toFixed(2)} km`,
    );
  });

  for (const feature of selected) {
    const props = feature.properties;
    if (props.presenceCheck.sourceUrl) continue;
    reviewUnverifiedPresence(props, date);
    geo.metadata.updatedAt = date;
    discoveryStats.noEvidence++;
    console.log(`review  presence ${props.id} no exact official evidence`);
  }

  let presenceChecked = 0;
  for (const feature of selected) {
    const props = feature.properties;
    const check = props.presenceCheck;
    if (!check.sourceUrl) continue;
    presenceChecked++;
    const policy = await getRobots(check.sourceUrl);
    if (!isVerificationSourceUrl(check.sourceUrl)) {
      check.checkedAt = date;
      check.status = "review";
      props.updatedAt = date;
      geo.metadata.updatedAt = date;
      console.log(`review   presence ${props.id} source is not eligible for verification`);
      continue;
    }
    if (!policy.ok && policy.status !== 404) {
      discoveryStats.networkBlocked++;
      console.log(`${check.status.padEnd(8)} presence ${props.id} robots unavailable, retained`);
      continue;
    }
    if (!robotsAllows(check.sourceUrl, policy.rules)) {
      discoveryStats.robotsBlocked++;
      console.log(`${check.status.padEnd(8)} presence ${props.id} robots disallow, retained`);
      continue;
    }
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
    props.updatedAt = date;
    geo.metadata.updatedAt = date;
    console.log(`${check.status.padEnd(8)} presence ${props.id} ${source.detail}`);
  }

  const presenceReview = selected.filter((feature) => feature.properties.presenceCheck.status === "review").length;
  const newlyVerified = selected.filter((feature) =>
    initialPresence.get(feature.properties.id) !== "verified" &&
    feature.properties.presenceCheck.status === "verified",
  ).length;

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
    `Summary: ${selectionLabel} | selected ${selected.length} | website ok ${websiteOk}, review ${websiteReview} | ` +
    `address locations checked ${locationChecked}, review ${locationReview} | ` +
    `official sources linked ${officialSourcesLinked}, city locations upgraded ${cityLocationsUpgraded} | ` +
    `presence checked ${presenceChecked}, review ${presenceReview} | ` +
    `${selected.length ? "wrote" : "no changes written"}`,
  );
  appendGitHubSummary({
    selectionLabel,
    selected: selected.length,
    ...discoveryStats,
    newlyVerified,
    officialSourcesLinked,
    websiteReview,
    locationReview,
    presenceReview,
  });
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  audit(process.argv.slice(2)).catch((error) => {
    console.error(`audit failed: ${error.message}`);
    process.exitCode = 1;
  });
}
