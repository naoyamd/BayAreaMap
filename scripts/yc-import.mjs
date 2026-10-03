#!/usr/bin/env node
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const SOURCE_URL = "https://yc-oss.github.io/api/companies/all.json";
export const OFFICIAL_PROFILE_ORIGIN = "https://www.ycombinator.com/companies/";
export const SOURCE_META_URL = "https://yc-oss.github.io/api/meta.json";
export const OFFICIAL_REQUEST_TIMEOUT_MS = 15_000;
export const DEFAULT_LIMIT = 492;
export const DEFAULT_DATE = new Date().toISOString().slice(0, 10);
export const PRIORITY_CORRECTION_DATE = "2026-10-03";

const CENSUS_GEOCODER_URL = "https://geocoding.geo.census.gov/geocoder/";
const OSM_OMRON_URL = "https://www.openstreetmap.org/?mlat=37.6890409&mlon=-121.8927267";
export const CURATED_PRESENCE_OVERRIDES = Object.freeze({
  "ihi-rakunest": Object.freeze({
    facilityId: "rakunest",
    name: "IHI",
    nameJa: "株式会社IHI",
    profileSourceUrl: "https://www.ihi.co.jp/en/",
    userStatementDate: "2026-10-03",
    userStatement: "IHI Launch Pad has closed. IHI currently has a private office inside RakuNest.",
    supportingSourceUrl: "https://www.rakunest.com/contact",
  }),
});
const PRIORITY_CORRECTIONS = Object.freeze({
  "acario-innovation": {
    nameAliases: ["Acario Innovation", "Acario Office"],
    sourceUrl: "https://acarioinnovation.com/contact-us/",
    address: "1875 South Grant Street, Suite 920",
    city: "San Mateo",
    postalCode: "94402",
    county: "San Mateo County",
    coordinates: [-122.302099564596, 37.553492836924],
  },
  "honda-innovations-silicon-valley": {
    sourceUrl: "https://xcelerator.hondainnovations.com/",
    address: "375 Ravendale Drive",
    city: "Mountain View",
    postalCode: "94043",
    county: "Santa Clara County",
    coordinates: [-122.052788099316, 37.390117606267],
  },
  "hitachi-america": {
    sourceUrl: "https://www.hitachi.com/content/hitachi/us/en_us/about.html",
    address: "2535 Augustine Drive, 3F",
    city: "Santa Clara",
    postalCode: "95054",
    county: "Santa Clara County",
    coordinates: [-121.972500241993, 37.382365997997],
  },
  "nissan-research-center-silicon-valley": {
    name: "Nissan Advanced Technology Center Silicon Valley",
    nameJa: "日産アドバンストテクノロジーセンター シリコンバレー",
    sourceUrl: "https://www.nissan-global.com/EN/INNOVATION/TECHNOLOGY/ADVANCED_TECH_CENTER/",
    address: "3400 Central Expressway",
    city: "Santa Clara",
    postalCode: "95051",
    county: "Santa Clara County",
    coordinates: [-121.989835700612, 37.377518478362],
  },
  "rohm-semiconductor-usa": {
    sourceUrl: "https://www.rohm.com/company/about/branch",
    address: "3033 Olcott Street",
    city: "Santa Clara",
    postalCode: "95054",
    county: "Santa Clara County",
    coordinates: [-121.967229349355, 37.377022297257],
  },
  "omron-robotics-and-safety-technologies": {
    nameAliases: ["OMRON Robotics"],
    sourceUrl: "https://robotics.omron.com/contact/",
    address: "4225 Hacienda Drive",
    city: "Pleasanton",
    postalCode: "94588",
    county: "Alameda County",
    coordinates: [-121.8927267, 37.6890409],
    coordinateSource: "openstreetmap",
    coordinateSourceUrl: OSM_OMRON_URL,
  },
  "denso-international-america": {
    nameAliases: ["Silicon Valley Innovation Center"],
    sourceUrl: "https://www.denso.com/us-ca/home/about-us/company-information/us/diam/",
    address: "575 High Street, Suite 110",
    city: "Palo Alto",
    postalCode: "94301",
    county: "Santa Clara County",
    coordinates: [-122.162307338882, 37.443478502963],
  },
  "yamaha-motor-ventures": {
    sourceUrl: "https://www.yamahamotor.vc/",
    address: "422 Portage Avenue",
    city: "Palo Alto",
    postalCode: "94306",
    county: "Santa Clara County",
    coordinates: [-122.137541287811, 37.422276461943],
  },
  "tdk-usa": {
    sourceUrl: "https://www.tdk.com/en/worldwide/index.html",
    address: "1745 Technology Drive, Suite 100",
    city: "San Jose",
    postalCode: "95110",
    county: "Santa Clara County",
    coordinates: [-121.918953303873, 37.367759392667],
  },
});

const REVIEW_CORRECTIONS = Object.freeze({
  "fujitsu-north-america": {
    sourceUrl: "https://global.fujitsu/en-us/subsidiaries",
    note: "Fujitsu's official subsidiary directory distinguishes Fujitsu North America from Fujitsu Research of America in Santa Clara; preserve this parent identity until the Bay Area placement is resolved.",
  },
  "nec-corporation-of-america": {
    sourceUrl: "https://www.nec.com/en/global/rd/labs/america/index.html",
    note: "NEC's official pages distinguish NEC Corporation of America from NEC Laboratories America in San Jose; preserve this parent identity until the Bay Area placement is resolved.",
  },
  "panasonic-north-america": {
    sourceUrl: "https://industry.panasonic.com/ap/en/salesnetwork/globalnetwork/america",
    note: "Panasonic's official sales network lists its US industrial sales headquarters in Newark, New Jersey. This does not substantiate the current Newark, California placement of Panasonic North America.",
  },
});

// YC's public directory supplies a headquarters city, not a street address.
// Keep those records at city precision until an official street source is found.
export const BAY_AREA_CITIES = Object.freeze({
  Alameda: { county: "Alameda County", coordinates: [-122.2416, 37.7652] },
  Berkeley: { county: "Alameda County", coordinates: [-122.2682, 37.8699] },
  Brentwood: { county: "Contra Costa County", coordinates: [-121.6961, 37.9318] },
  Burlingame: { county: "San Mateo County", coordinates: [-122.3481, 37.5841] },
  Campbell: { county: "Santa Clara County", coordinates: [-121.949, 37.2872] },
  Cupertino: { county: "Santa Clara County", coordinates: [-122.0322, 37.323] },
  Danville: { county: "Contra Costa County", coordinates: [-121.9999, 37.8216] },
  Dublin: { county: "Alameda County", coordinates: [-121.9358, 37.7022] },
  EastPaloAlto: { county: "San Mateo County", coordinates: [-122.1411, 37.4688] },
  ElCerrito: { county: "Contra Costa County", coordinates: [-122.3108, 37.9255] },
  Emeryville: { county: "Alameda County", coordinates: [-122.2879, 37.8313] },
  Fairfield: { county: "Solano County", coordinates: [-122.0399, 38.2494] },
  FosterCity: { county: "San Mateo County", coordinates: [-122.2661, 37.5585] },
  Fremont: { county: "Alameda County", coordinates: [-121.9886, 37.5483] },
  Hayward: { county: "Alameda County", coordinates: [-122.0808, 37.6688] },
  Lafayette: { county: "Contra Costa County", coordinates: [-122.118, 37.8858] },
  Livermore: { county: "Alameda County", coordinates: [-121.7681, 37.6819] },
  LosAltos: { county: "Santa Clara County", coordinates: [-122.1141, 37.3852] },
  Martinez: { county: "Contra Costa County", coordinates: [-122.1341, 38.0194] },
  MenloPark: { county: "San Mateo County", coordinates: [-122.1817, 37.4538] },
  MillValley: { county: "Marin County", coordinates: [-122.5449, 37.906] },
  Milpitas: { county: "Santa Clara County", coordinates: [-121.8927, 37.4323] },
  Moraga: { county: "Contra Costa County", coordinates: [-122.1297, 37.8349] },
  MorganHill: { county: "Santa Clara County", coordinates: [-121.6544, 37.1305] },
  MountainView: { county: "Santa Clara County", coordinates: [-122.0839, 37.3861] },
  Napa: { county: "Napa County", coordinates: [-122.2869, 38.2975] },
  Newark: { county: "Alameda County", coordinates: [-122.0402, 37.5297] },
  Novato: { county: "Marin County", coordinates: [-122.5697, 38.1074] },
  Oakland: { county: "Alameda County", coordinates: [-122.2711, 37.8044] },
  Orinda: { county: "Contra Costa County", coordinates: [-122.1797, 37.8771] },
  Pacifica: { county: "San Mateo County", coordinates: [-122.4869, 37.6138] },
  PaloAlto: { county: "Santa Clara County", coordinates: [-122.143, 37.4419] },
  Petaluma: { county: "Sonoma County", coordinates: [-122.6367, 38.2324] },
  PleasantHill: { county: "Contra Costa County", coordinates: [-122.0608, 37.94798] },
  Pleasanton: { county: "Alameda County", coordinates: [-121.8747, 37.6624] },
  RedwoodCity: { county: "San Mateo County", coordinates: [-122.2364, 37.4852] },
  Richmond: { county: "Contra Costa County", coordinates: [-122.3477, 37.9358] },
  SanBruno: { county: "San Mateo County", coordinates: [-122.4108, 37.6305] },
  SanCarlos: { county: "San Mateo County", coordinates: [-122.2605, 37.5072] },
  SanFrancisco: { county: "San Francisco County", coordinates: [-122.4194, 37.7749] },
  SanJose: { county: "Santa Clara County", coordinates: [-121.8863, 37.3382] },
  SanLeandro: { county: "Alameda County", coordinates: [-122.1561, 37.7249] },
  SanMateo: { county: "San Mateo County", coordinates: [-122.3255, 37.563] },
  SanRamon: { county: "Contra Costa County", coordinates: [-121.978, 37.7799] },
  SantaClara: { county: "Santa Clara County", coordinates: [-121.9552, 37.3541] },
  SantaRosa: { county: "Sonoma County", coordinates: [-122.7144, 38.4404] },
  Sausalito: { county: "Marin County", coordinates: [-122.4853, 37.8591] },
  Sebastopol: { county: "Sonoma County", coordinates: [-122.8239, 38.4021] },
  SouthSanFrancisco: { county: "San Mateo County", coordinates: [-122.4194, 37.6547] },
  SuisunCity: { county: "Solano County", coordinates: [-122.0402, 38.2382] },
  Sunnyvale: { county: "Santa Clara County", coordinates: [-122.0363, 37.3688] },
  Tiburon: { county: "Marin County", coordinates: [-122.4578, 37.8735] },
  UnionCity: { county: "Alameda County", coordinates: [-122.0816, 37.5934] },
  Vacaville: { county: "Solano County", coordinates: [-121.9877, 38.3566] },
  Vallejo: { county: "Solano County", coordinates: [-122.2566, 38.1041] },
  WalnutCreek: { county: "Contra Costa County", coordinates: [-122.0619, 37.9101] },
});

const CITY_BY_NAME = new Map(
  Object.entries(BAY_AREA_CITIES).map(([key, value]) => [key.replace(/[A-Z]/g, (m) => ` ${m}`).trim(), value]),
);

// Handle names whose title-case key is not the display spelling above.
for (const [name, value] of Object.entries({
  "East Palo Alto": BAY_AREA_CITIES.EastPaloAlto,
  "El Cerrito": BAY_AREA_CITIES.ElCerrito,
  "Foster City": BAY_AREA_CITIES.FosterCity,
  "Los Altos": BAY_AREA_CITIES.LosAltos,
  "Menlo Park": BAY_AREA_CITIES.MenloPark,
  "Mill Valley": BAY_AREA_CITIES.MillValley,
  "Mountain View": BAY_AREA_CITIES.MountainView,
  "Palo Alto": BAY_AREA_CITIES.PaloAlto,
  "Redwood City": BAY_AREA_CITIES.RedwoodCity,
  "San Bruno": BAY_AREA_CITIES.SanBruno,
  "San Carlos": BAY_AREA_CITIES.SanCarlos,
  "San Francisco": BAY_AREA_CITIES.SanFrancisco,
  "San Jose": BAY_AREA_CITIES.SanJose,
  "San Leandro": BAY_AREA_CITIES.SanLeandro,
  "San Mateo": BAY_AREA_CITIES.SanMateo,
  "San Ramon": BAY_AREA_CITIES.SanRamon,
  "Santa Clara": BAY_AREA_CITIES.SantaClara,
  "Santa Rosa": BAY_AREA_CITIES.SantaRosa,
  "South San Francisco": BAY_AREA_CITIES.SouthSanFrancisco,
  "Suisun City": BAY_AREA_CITIES.SuisunCity,
  "Walnut Creek": BAY_AREA_CITIES.WalnutCreek,
})) CITY_BY_NAME.set(name, value);

const INDUSTRY_ALIASES = Object.freeze({
  b2b: ["software"],
  consumer: ["services"],
  education: ["education"],
  fintech: ["fintech"],
  healthcare: ["healthcare"],
  industrials: ["industrial"],
  "real-estate-and-construction": ["real-estate", "construction"],
});

export function normalizeName(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/\([^)]*\)/g, "")
    .replace(/\b(incorporated|inc|corporation|corp|company|co|llc|ltd|plc)\b/g, "")
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

export function normalizeHost(value) {
  try {
    return new URL(value).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function slugify(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "company";
}

export function extractHeadquarters(record) {
  const first = String(record?.all_locations ?? "").split(";")[0].trim();
  const match = first.match(/^(.+?),\s*CA,\s*USA$/i);
  if (!match) return null;
  const city = match[1].trim();
  const place = CITY_BY_NAME.get(city);
  return place ? { city, ...place } : null;
}

export function sourceRecordUrl(record) {
  return `${OFFICIAL_PROFILE_ORIGIN}${encodeURIComponent(String(record?.slug ?? ""))}`;
}

function decodeHtml(value) {
  return String(value)
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

export function parseOfficialProfile(html) {
  const match = String(html).match(/data-page="([^"]+)"/);
  if (!match) return null;
  try {
    const page = JSON.parse(decodeHtml(match[1]));
    return page?.props?.company ?? null;
  } catch {
    return null;
  }
}

export function mergeOfficialRecord(record, company) {
  const city = String(company?.city || company?.location || "").trim();
  return {
    ...record,
    ...company,
    name: company?.name || record.name,
    slug: record.slug,
    website: validWebsite(company?.website) ? company.website : record.website,
    all_locations: city ? `${city}, CA, USA` : record.all_locations,
    status: company?.ycdc_status || record.status,
    team_size: company?.team_size ?? record.team_size,
    one_liner: company?.one_liner || record.one_liner,
    long_description: company?.long_description || record.long_description,
    tags: company?.tags || record.tags,
    __officialVerified: true,
    __officialCompany: {
      id: company?.id ?? null,
      slug: company?.slug ?? null,
      name: company?.name ?? null,
      city,
      country: company?.country ?? null,
      cityTag: company?.city_tag ?? null,
      status: company?.ycdc_status ?? null,
      website: company?.website ?? null,
    },
  };
}

export async function verifyOfficialRecord(record, fetchImpl = fetch) {
  const profileUrl = sourceRecordUrl(record);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), OFFICIAL_REQUEST_TIMEOUT_MS);
  let response;
  try {
    response = await fetchImpl(profileUrl, {
      headers: { "user-agent": "BayAreaMap-YCOfficialVerification/1.0" },
      signal: controller.signal,
    });
  } catch (error) {
    clearTimeout(timeout);
    return { record, status: "rejected", reason: error.name === "AbortError" ? "fetch-timeout" : `fetch-error:${error.message}` };
  }
  if (!response.ok) {
    clearTimeout(timeout);
    return { record, status: "rejected", reason: `http-${response.status}` };
  }
  let html;
  try {
    html = await response.text();
  } catch (error) {
    clearTimeout(timeout);
    return { record, status: "rejected", reason: `response-text-error:${error.message}` };
  }
  clearTimeout(timeout);
  let company;
  try {
    company = parseOfficialProfile(html);
  } catch (error) {
    return { record, status: "rejected", reason: `profile-parse-error:${error.message}` };
  }
  if (!company) return { record, status: "rejected", reason: "official-profile-data-missing" };
  if (company.id == null || typeof company.name !== "string" || !company.name.trim()) {
    return { record, status: "rejected", reason: "official-identity-missing" };
  }
  if (String(company.slug) !== String(record.slug)) {
    return { record, status: "rejected", reason: "slug-mismatch", officialSlug: company.slug };
  }
  if (company.ycdc_status !== "Active") {
    return { record, status: "rejected", reason: `official-status:${company.ycdc_status || "missing"}` };
  }
  if (String(company.country || "").toUpperCase() !== "US") {
    return { record, status: "rejected", reason: `official-country:${company.country || "missing"}` };
  }
  if (!validWebsite(company.website)) return { record, status: "rejected", reason: "official-website-missing" };
  if (!String(company.city || company.location || "").trim()) {
    return { record, status: "rejected", reason: "official-city-missing" };
  }
  if (!CITY_BY_NAME.has(String(company.city || "").trim())) {
    return { record, status: "rejected", reason: "official-city-outside-bay-area" };
  }
  const merged = mergeOfficialRecord(record, company);
  if (!extractHeadquarters(merged)) return { record, status: "rejected", reason: "official-city-outside-bay-area" };
  if (!validWebsite(merged.website)) return { record, status: "rejected", reason: "official-website-missing" };
  return { record: merged, status: "verified", profileUrl };
}

export async function verifyOfficialRecords(records, base, { date = DEFAULT_DATE, limit = DEFAULT_LIMIT, concurrency = 8 } = {}) {
  const names = new Map();
  const domains = new Map();
  for (const feature of base.features ?? []) {
    const p = feature.properties ?? {};
    const name = normalizeName(p.name);
    const domain = normalizeHost(p.website);
    if (name) names.set(name, feature);
    if (domain) domains.set(domain, feature);
  }
  const pool = selectRecords(records, { all: true });
  const checks = [];
  const verified = [];
  const promotions = [];
  for (let index = 0; index < pool.length && verified.length < limit; index += concurrency) {
    const batch = pool.slice(index, index + concurrency);
    const results = await Promise.all(batch.map((record) => verifyOfficialRecord(record)));
    for (const result of results) {
      checks.push({
        name: result.record.name,
        slug: result.record.slug,
        profileUrl: result.profileUrl || sourceRecordUrl(result.record),
        status: result.status,
        reason: result.reason || null,
      });
      if (result.status !== "verified") continue;
      const feature = featureFromRecord(result.record, date, { trustedOfficial: true });
      if (!feature) continue;
      const existing = findExistingMatch(feature, names, domains);
      if (existing) {
        promotions.push(result.record);
        continue;
      }
      verified.push(result.record);
      names.set(normalizeName(feature.properties.name), feature);
      domains.set(normalizeHost(feature.properties.website), feature);
      if (verified.length >= limit) break;
    }
  }
  return {
    generatedAt: new Date().toISOString(),
    sourceDate: date,
    candidateSourceUrl: SOURCE_URL,
    officialSourceOrigin: OFFICIAL_PROFILE_ORIGIN,
    candidateCount: pool.length,
    verifiedCount: verified.length,
    promotedCount: promotions.length,
    rejectedCount: checks.filter((check) => check.status !== "verified").length,
    records: verified,
    promotions,
    checks,
  };
}

function validWebsite(value) {
  return /^https?:\/\//i.test(String(value ?? "")) && Boolean(normalizeHost(value));
}

function industriesFor(record) {
  const source = [
    record?.industry,
    ...(String(record?.subindustry ?? "").split("->").slice(-1)),
    ...(Array.isArray(record?.tags) ? record.tags : []),
  ];
  const tags = source.map(slugify).filter(Boolean);
  for (const tag of [...tags]) tags.push(...(INDUSTRY_ALIASES[tag] ?? []));
  return [...new Set(tags)].slice(0, 12);
}

function scaleFor(record) {
  const size = Number(record?.team_size);
  if (size >= 100) return "large";
  if (size >= 20) return "growth";
  return "startup";
}

export function featureFromRecord(record, date, { trustedOfficial = false } = {}) {
  const headquarters = extractHeadquarters(record);
  if (!headquarters || !validWebsite(record.website)) return null;
  const profileUrl = sourceRecordUrl(record);
  const official = trustedOfficial && record.__officialVerified === true;
  const id = `yc-${slugify(record.slug || record.name)}-${record.id}`;
  const description = String(record.one_liner || record.long_description || "").trim();
  return {
    type: "Feature",
    geometry: { type: "Point", coordinates: headquarters.coordinates },
    properties: {
      id,
      name: String(record.name).trim(),
      nameJa: String(record.name).trim(),
      website: record.website,
      description: description || `${record.name} (Y Combinator ${record.batch || "company"})`,
      entityType: "company",
      japanConnection: "none",
      scale: scaleFor(record),
      industries: industriesFor(record),
      profileSourceUrl: profileUrl,
      location: {
        address: null,
        city: headquarters.city,
        region: "CA",
        postalCode: null,
        countryCode: "US",
        county: headquarters.county,
        precision: "city",
        coordinateSource: "city-centroid",
        sourceUrl: profileUrl,
        sourceType: "official-directory",
        checkedAt: null,
        status: "unchecked",
      },
      websiteCheck: { checkedAt: null, status: "unchecked" },
      updatedAt: date,
      presenceCheck: {
        checkedAt: date,
        status: official ? "verified" : "review",
        sourceUrl: official ? profileUrl : null,
        sourceType: official ? "official-directory" : "candidate-mirror",
      },
      source: {
        provider: official ? "Y Combinator official company profile" : "YC-OSS API candidate mirror",
        recordUrl: profileUrl,
        apiUrl: record.api || null,
        sourceDate: date,
        sourceStatus: record.status || null,
        officialVerifiedAt: official ? date : null,
        officialCompany: record.__officialCompany || null,
        headquarters: record.all_locations || null,
        batch: record.batch || null,
        teamSize: Number.isFinite(Number(record.team_size)) ? Number(record.team_size) : null,
      },
    },
  };
}

function findExistingMatch(feature, names, domains) {
  const properties = feature.properties ?? {};
  const name = normalizeName(properties.name);
  const domain = normalizeHost(properties.website);
  if (domain && domains.has(domain)) return domains.get(domain);
  const byName = name && names.get(name);
  if (!byName) return null;
  const existingDomain = normalizeHost(byName.properties?.website);
  // Same names with two usable hosts may be different legal entities; leave both.
  if (domain && existingDomain) return null;
  return byName;
}

function exactEntityMatch(existing, candidate) {
  const existingProperties = existing.properties ?? {};
  const candidateProperties = candidate.properties ?? {};
  const sameName = normalizeName(existingProperties.name) === normalizeName(candidateProperties.name);
  const existingHost = normalizeHost(existingProperties.website);
  const candidateHost = normalizeHost(candidateProperties.website);
  if (!sameName) return false;
  return !existingHost || !candidateHost || existingHost === candidateHost;
}

function promotePresence(existing, sourceFeature, date) {
  if (sourceFeature.properties.presenceCheck.sourceType !== "official-directory") return false;
  if (!exactEntityMatch(existing, sourceFeature)) return false;
  const p = existing.properties;
  const sourceCity = sourceFeature.properties.location.city.toLowerCase();
  if (String(p.location?.city ?? "").toLowerCase() !== sourceCity) return false;
  p.presenceCheck = {
    checkedAt: date,
    status: "verified",
    sourceUrl: sourceFeature.properties.presenceCheck.sourceUrl,
    sourceType: "official-directory",
  };
  // Keep street address, geocoder, and existing location evidence intact.
  p.updatedAt = date;
  return true;
}

export function applyPriorityCorrections(doc, date = PRIORITY_CORRECTION_DATE) {
  const applied = [];
  const reviewed = [];
  for (const [id, correction] of Object.entries(PRIORITY_CORRECTIONS)) {
    const feature = doc.features?.find((item) => item.properties?.id === id);
    if (!feature) continue;
    const p = feature.properties;
    const sourceUrl = correction.sourceUrl;
    p.name = correction.name || p.name;
    p.nameJa = correction.nameJa || p.nameJa;
    if (correction.nameAliases) p.nameAliases = correction.nameAliases;
    p.profileSourceUrl = sourceUrl;
    p.location = {
      ...p.location,
      address: correction.address,
      city: correction.city,
      region: "CA",
      postalCode: correction.postalCode,
      countryCode: "US",
      county: correction.county,
      precision: "address",
      coordinateSource: correction.coordinateSource || "census-geocoder",
      coordinateSourceUrl: correction.coordinateSourceUrl || CENSUS_GEOCODER_URL,
      sourceUrl,
      checkedAt: date,
      status: "matched",
      sourceType: "official-location-page",
    };
    feature.geometry = { type: "Point", coordinates: correction.coordinates };
    p.presenceCheck = {
      checkedAt: date,
      status: "verified",
      sourceUrl,
      sourceType: "official-location-page",
      ...(correction.evidenceScope ? { evidenceScope: correction.evidenceScope } : {}),
    };
    p.correctionSource = { sourceUrl, checkedAt: date, sourceType: "official-location-page" };
    p.updatedAt = date;
    delete p.dataQualityNote;
    applied.push(id);
  }

  for (const [id, correction] of Object.entries(REVIEW_CORRECTIONS)) {
    const feature = doc.features?.find((item) => item.properties?.id === id);
    if (!feature) continue;
    const p = feature.properties;
    p.dataQualityNote = correction.note;
    p.presenceCheck = {
      ...(p.presenceCheck ?? {}),
      checkedAt: date,
      status: "review",
      sourceUrl: correction.sourceUrl,
      sourceType: "official-location-page",
    };
    p.correctionSource = {
      sourceUrl: correction.sourceUrl,
      checkedAt: date,
      sourceType: "official-location-page",
    };
    p.updatedAt = date;
    reviewed.push(id);
  }

  const previous = Array.isArray(doc.metadata?.manualCorrections)
    ? doc.metadata.manualCorrections.filter((item) => ![...applied, ...reviewed].includes(item.id))
    : [];
  doc.metadata.manualCorrections = [
    ...previous,
    ...applied.map((id) => ({ id, checkedAt: date, status: "verified", sourceType: "official-location-page", sourceUrl: PRIORITY_CORRECTIONS[id].sourceUrl })),
    ...reviewed.map((id) => ({ id, checkedAt: date, status: "review", sourceType: "official-location-page", sourceUrl: REVIEW_CORRECTIONS[id].sourceUrl })),
  ];
  return { applied, reviewed };
}

export function applyCuratedPresenceOverrides(doc, date = PRIORITY_CORRECTION_DATE) {
  const applied = [];
  const eligible = new Set();
  const skipped = new Set();
  for (const [id, override] of Object.entries(CURATED_PRESENCE_OVERRIDES)) {
    const feature = doc.features?.find((item) => item.properties?.id === id);
    const facility = doc.features?.find((item) => item.properties?.id === override.facilityId);
    if (!feature || !facility?.properties?.location || !Array.isArray(facility.geometry?.coordinates)) continue;
    eligible.add(id);

    const p = feature.properties;
    if (p.presenceCheck?.sourceType === "user-confirmed" &&
        typeof p.presenceCheck.userStatementDate === "string" &&
        p.presenceCheck.userStatementDate > override.userStatementDate) {
      skipped.add(id);
      continue;
    }
    const facilityLocation = facility.properties.location;
    const before = JSON.stringify({
      name: p.name,
      nameJa: p.nameJa,
      profileSourceUrl: p.profileSourceUrl,
      location: p.location,
      coordinates: feature.geometry?.coordinates,
      presenceCheck: p.presenceCheck,
      correctionSource: p.correctionSource,
    });

    p.name = override.name;
    p.nameJa = override.nameJa;
    p.profileSourceUrl = override.profileSourceUrl;
    p.location = {
      ...facilityLocation,
      sourceUrl: override.supportingSourceUrl,
    };
    feature.geometry = {
      type: facility.geometry.type,
      coordinates: [...facility.geometry.coordinates],
    };
    p.presenceCheck = {
      checkedAt: override.userStatementDate,
      status: "verified",
      sourceUrl: null,
      sourceType: "user-confirmed",
      userStatementDate: override.userStatementDate,
      userStatement: override.userStatement,
      supportingSourceUrl: override.supportingSourceUrl,
    };
    delete p.correctionSource;
    delete p.dataQualityNote;

    const after = JSON.stringify({
      name: p.name,
      nameJa: p.nameJa,
      profileSourceUrl: p.profileSourceUrl,
      location: p.location,
      coordinates: feature.geometry.coordinates,
      presenceCheck: p.presenceCheck,
      correctionSource: p.correctionSource,
    });
    if (before !== after) {
      p.updatedAt = date;
      applied.push(id);
    }
  }

  if (!doc.metadata) doc.metadata = {};
  const ids = eligible;
  const previous = Array.isArray(doc.metadata.manualCorrections)
    ? doc.metadata.manualCorrections.filter((item) =>
      !ids.has(item.id) || skipped.has(item.id) || (typeof item.userStatementDate === "string" &&
        item.userStatementDate > CURATED_PRESENCE_OVERRIDES[item.id]?.userStatementDate))
    : [];
  const current = Object.entries(CURATED_PRESENCE_OVERRIDES)
    .filter(([id]) => eligible.has(id))
    .filter(([id]) => !skipped.has(id))
    .filter(([id, override]) => !previous.some((item) => item.id === id && item.userStatementDate > override.userStatementDate))
    .map(([id, override]) => ({
      id,
      checkedAt: override.userStatementDate,
      status: "verified",
      sourceType: "user-confirmed",
      sourceUrl: null,
      userStatementDate: override.userStatementDate,
      userStatement: override.userStatement,
      supportingSourceUrl: override.supportingSourceUrl,
    }));
  doc.metadata.manualCorrections = [
    ...previous,
    ...current,
  ];
  if (applied.length && (!doc.metadata.updatedAt || doc.metadata.updatedAt < date)) {
    doc.metadata.updatedAt = date;
  }
  return { applied };
}

export function selectRecords(records, { limit = DEFAULT_LIMIT, all = false } = {}) {
  const candidates = records
    .filter((record) => record?.status === "Active")
    .filter((record) => extractHeadquarters(record))
    .filter((record) => validWebsite(record.website))
    .sort((a, b) =>
      Number(b.team_size || 0) - Number(a.team_size || 0) ||
      String(a.name).localeCompare(String(b.name), "en") ||
      Number(a.id || 0) - Number(b.id || 0),
    );
  return all ? candidates : candidates.slice(0, limit);
}

export function importDataset(base, records, { date = DEFAULT_DATE, limit = DEFAULT_LIMIT, all = false, trustedOfficial = false, applyCorrections = false } = {}) {
  const doc = structuredClone(base);
  const features = Array.isArray(doc.features) ? doc.features : [];
  const names = new Map();
  const domains = new Map();
  for (const feature of features) {
    const p = feature.properties ?? {};
    const name = normalizeName(p.name);
    const domain = normalizeHost(p.website);
    if (name) names.set(name, feature);
    if (domain) domains.set(domain, feature);
  }

  let promoted = 0;
  const selected = selectRecords(records, { all: true });
  let considered = 0;
  const added = [];
  for (const record of selected) {
    if (!all && added.length >= limit) break;
    considered += 1;
    const candidate = featureFromRecord(record, date, { trustedOfficial });
    if (!candidate) continue;
    const existing = findExistingMatch(candidate, names, domains);
    if (existing) {
      if (promotePresence(existing, candidate, date)) promoted += 1;
      continue;
    }
    added.push(candidate);
    names.set(normalizeName(candidate.properties.name), candidate);
    domains.set(normalizeHost(candidate.properties.website), candidate);
  }
  doc.features = [...features, ...added];
  // The recorded October corrections are a one-time migration, never a recurring override.
  const priorityCorrections = applyCorrections ? applyPriorityCorrections(doc) : null;
  const curatedPresenceOverrides = applyCuratedPresenceOverrides(doc, date);
  doc.metadata = {
    ...(doc.metadata ?? {}),
    schemaVersion: 3,
    updatedAt: features.concat(added).reduce((newest, feature) =>
      feature.properties.updatedAt > newest ? feature.properties.updatedAt : newest, "") || base.metadata?.updatedAt || date,
    coordinateSystem: "WGS84 / GeoJSON [longitude, latitude]",
    sourceCatalog: {
      provider: "YC-OSS API candidate mirror",
      sourceUrl: SOURCE_URL,
      officialProfileOrigin: OFFICIAL_PROFILE_ORIGIN,
      retrievedAt: date,
      policy: trustedOfficial ? "Active YC companies verified against the current official company profile; city precision only." : "Unverified YC-OSS candidates; presence requires review.",
      selected: selected.length,
      added: added.length,
      promoted,
      officialVerified: added.filter((feature) => feature.properties.presenceCheck.sourceType === "official-directory").length,
      ...(priorityCorrections ? { priorityCorrections } : {}),
      ...(curatedPresenceOverrides.applied.length ? { curatedPresenceOverrides } : {}),
    },
  };
  return { doc, selected: considered, added: added.length, promoted };
}

export function buildDiscoveryReport(records, base, date = DEFAULT_DATE) {
  const selected = selectRecords(records, { all: true });
  const domains = new Set(base.features.map((f) => normalizeHost(f.properties?.website)).filter(Boolean));
  const candidates = selected.filter((record) => {
    const feature = featureFromRecord(record, date);
    if (!feature) return false;
    return !domains.has(normalizeHost(feature.properties.website));
  });
  return {
    generatedAt: new Date().toISOString(),
    sourceDate: date,
    sourceUrl: SOURCE_URL,
    policy: "Discovery only; official YC headquarters city is stored at city precision until a street-level official source is found.",
    sourceRecordCount: records.length,
    activeBayAreaWithWebsite: selected.length,
    newCandidates: candidates.length,
    candidates: candidates.map((record) => ({
      name: record.name,
      id: record.id,
      slug: record.slug,
      batch: record.batch,
      teamSize: record.team_size,
      website: record.website,
      headquarters: record.all_locations,
      profileSourceUrl: sourceRecordUrl(record),
      apiUrl: record.api || null,
      status: record.status,
    })),
  };
}

function parseArgs(argv) {
  const args = { input: null, base: null, output: null, report: null, verification: null, date: DEFAULT_DATE, limit: DEFAULT_LIMIT, all: false, discover: false, verify: false, dryRun: false, applyCorrections: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--all") args.all = true;
    else if (arg === "--discover") args.discover = true;
    else if (arg === "--verify") args.verify = true;
    else if (arg === "--apply-priority-corrections") args.applyCorrections = true;
    else if (arg === "--dry-run") args.dryRun = true;
    else if (arg.startsWith("--input=")) args.input = arg.slice(8);
    else if (arg.startsWith("--base=")) args.base = arg.slice(7);
    else if (arg.startsWith("--output=")) args.output = arg.slice(9);
    else if (arg.startsWith("--report=")) args.report = arg.slice(9);
    else if (arg.startsWith("--verification=")) args.verification = arg.slice(15);
    else if (arg.startsWith("--date=")) {
      const value = arg.slice(7);
      const parsed = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00Z`) : null;
      if (!parsed || !Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
        throw new Error(`Invalid --date: ${value} (expected YYYY-MM-DD)`);
      }
      args.date = value;
    } else if (arg.startsWith("--limit=")) {
      const value = Number(arg.slice(8));
      if (!Number.isInteger(value) || value < 0) throw new Error(`Invalid --limit: ${arg.slice(8)}`);
      args.limit = value;
    }
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
}

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function loadRecords(input) {
  if (input) return readJson(resolve(input));
  const response = await fetch(SOURCE_URL, { headers: { "user-agent": "BayAreaMap-YCDiscovery/1.0" }, signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error(`YC source returned HTTP ${response.status}`);
  return response.json();
}

export async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.verify && args.verification) throw new Error("Use either --verify or --verification, not both");
  if (args.discover && (args.verify || args.verification)) throw new Error("Discovery cannot be combined with verified import");
  const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const basePath = resolve(root, args.base || "data/entities.geojson");
  const outputPath = resolve(root, args.output || "data/entities.geojson");
  const reportPath = resolve(root, args.report || "work/yc-discovery.json");
  const records = args.verification ? null : await loadRecords(args.input);
  const base = await readJson(basePath);
  if (args.discover) {
    await mkdir(dirname(reportPath), { recursive: true });
    await writeFile(reportPath, `${JSON.stringify(buildDiscoveryReport(records, base, args.date), null, 2)}\n`);
    console.log(`Wrote YC discovery report for ${records.length} source records to ${reportPath}`);
    return;
  }
  let importRecords = records;
  let importAll = args.all;
  if (args.verify) {
    const verification = await verifyOfficialRecords(records, base, { date: args.date, limit: args.all ? Infinity : args.limit });
    await mkdir(dirname(reportPath), { recursive: true });
    await writeFile(reportPath, `${JSON.stringify(verification, null, 2)}\n`);
    importRecords = [...verification.records, ...verification.promotions];
    importAll = true;
    console.log(`Wrote official YC verification report: ${verification.verifiedCount} additions, ${verification.promotedCount} promotions, ${verification.rejectedCount} rejected`);
  } else if (args.verification) {
    const verification = await readJson(resolve(root, args.verification));
    importRecords = [...(verification.records ?? []), ...(verification.promotions ?? [])];
    importAll = true;
  }
  const result = importDataset(base, importRecords, {
    date: args.date,
    limit: args.limit,
    all: importAll,
    trustedOfficial: Boolean(args.verify || args.verification),
    applyCorrections: args.applyCorrections,
  });
  if (!args.dryRun) await writeFile(outputPath, `${JSON.stringify(result.doc, null, 2)}\n`);
  const hash = createHash("sha256").update(JSON.stringify(result.doc)).digest("hex").slice(0, 16);
  console.log(`${args.dryRun ? "Dry run" : "Wrote"} ${result.added} YC features (${result.promoted} existing presences promoted), total ${result.doc.features.length}, hash ${hash}`);
}

if (process.argv[1]?.replaceAll("\\", "/").endsWith("/yc-import.mjs")) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
