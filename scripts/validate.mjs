#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const FILE = join(dirname(fileURLToPath(import.meta.url)), "..", "data", "entities.geojson");
const REQUIRED_STRINGS = [
  "name", "nameJa", "website", "entityType", "japanConnection", "scale",
  "profileSourceUrl", "updatedAt",
];
const ENUMS = {
  entityType: ["company", "vc-cvc", "support", "university-research"],
  japanConnection: ["japan-headquartered", "japanese-founded", "japan-focused", "none"],
  scale: ["startup", "growth", "large", "not-applicable"],
};
const LOCATION_PRECISIONS = ["address", "city"];
const COORDINATE_SOURCES = ["census-geocoder", "openstreetmap", "city-centroid", "legacy"];
const LOCATION_STATUSES = ["unchecked", "matched", "review"];
const WEBSITE_STATUSES = ["unchecked", "ok", "review"];
const PRESENCE_STATUSES = ["unchecked", "verified", "review"];
const MFG_INDUSTRIES = new Set(["manufacturing", "automotive", "electronics", "robotics", "semiconductors"]);
const BAY_AREA_COUNTIES = [
  "Alameda", "Contra Costa", "Marin", "Napa", "San Francisco",
  "San Mateo", "Santa Clara", "Solano", "Sonoma",
];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const errors = [];
const err = (msg) => errors.push(msg);
const nonEmptyString = (v) => typeof v === "string" && v.trim().length > 0;
const countyKey = (c) => c.replace(/\s+County$/i, "").toLowerCase();
const validDate = (v) => nonEmptyString(v) && DATE_RE.test(v.trim());

function validUrl(value) {
  if (!nonEmptyString(value)) return false;
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

let doc;
try {
  doc = JSON.parse(readFileSync(FILE, "utf8"));
} catch (e) {
  console.error(`FAIL: cannot read/parse ${FILE}: ${e.message}`);
  process.exit(1);
}

if (doc?.type !== "FeatureCollection") {
  err(`top-level: type must be "FeatureCollection" (got ${JSON.stringify(doc?.type)})`);
}
if (doc?.metadata?.schemaVersion !== 3) {
  err(`top-level: metadata.schemaVersion must be 3 (got ${JSON.stringify(doc?.metadata?.schemaVersion)})`);
}
if (!validDate(doc?.metadata?.updatedAt)) {
  err(`top-level: metadata.updatedAt must match YYYY-MM-DD (got ${JSON.stringify(doc?.metadata?.updatedAt)})`);
}
if (doc?.metadata?.coordinateSystem !== "WGS84 / GeoJSON [longitude, latitude]") {
  err("top-level: metadata.coordinateSystem must document WGS84 GeoJSON coordinate order");
}

const features = doc?.features;
if (!Array.isArray(features)) {
  err("top-level: features must be an array");
  console.error(`FAIL: ${errors.length} error(s):\n  - ` + errors.join("\n  - "));
  process.exit(1);
}
if (features.length < 300) err(`top-level: expected at least 300 features, got ${features.length}`);

const seenIds = new Map();
const countiesSeen = new Set();
let japanLinked = 0;
let largeScale = 0;
let mfgRelated = 0;
let nonCompany = 0;
let cityPrecision = 0;
let verifiedPresence = 0;
let newestEntityUpdate = "";

for (let i = 0; i < features.length; i++) {
  const f = features[i];
  const at = (msg) => `[${i}] ${msg}`;
  if (f?.type !== "Feature") err(at(`type must be "Feature" (got ${JSON.stringify(f?.type)})`));

  const coordinates = f?.geometry?.coordinates;
  if (f?.geometry?.type !== "Point") {
    err(at(`geometry.type must be "Point" (got ${JSON.stringify(f?.geometry?.type)})`));
  } else if (!Array.isArray(coordinates) || coordinates.length !== 2 ||
      !Number.isFinite(coordinates[0]) || !Number.isFinite(coordinates[1])) {
    err(at(`coordinates must be [lon, lat] finite numbers (got ${JSON.stringify(coordinates)})`));
  } else {
    const [lon, lat] = coordinates;
    if (lon < -123.5 || lon > -121.0) err(at(`longitude ${lon} outside -123.5..-121.0`));
    if (lat < 36.8 || lat > 39.2) err(at(`latitude ${lat} outside 36.8..39.2`));
  }

  const p = f?.properties ?? {};
  if (!nonEmptyString(p.id)) {
    err(at("properties.id must be a nonempty string"));
  } else if (seenIds.has(p.id)) {
    err(at(`duplicate properties.id "${p.id}" (first seen at [${seenIds.get(p.id)}])`));
  } else {
    seenIds.set(p.id, i);
  }

  for (const key of REQUIRED_STRINGS) {
    if (!nonEmptyString(p[key])) err(at(`properties.${key} must be a nonempty string`));
  }
  for (const key of ["website", "profileSourceUrl"]) {
    if (p[key] !== undefined && !validUrl(p[key])) err(at(`properties.${key} must be an http(s) URL`));
  }
  if (nonEmptyString(p.updatedAt) && !validDate(p.updatedAt)) {
    err(at(`properties.updatedAt must match YYYY-MM-DD (got ${JSON.stringify(p.updatedAt)})`));
  }
  if (validDate(p.updatedAt) && p.updatedAt > newestEntityUpdate) newestEntityUpdate = p.updatedAt;

  if (!Array.isArray(p.industries) || p.industries.length === 0 ||
      !p.industries.every(nonEmptyString)) {
    err(at("properties.industries must be a nonempty array of nonempty strings"));
  }
  for (const [key, allowed] of Object.entries(ENUMS)) {
    if (!allowed.includes(p[key])) err(at(`properties.${key} must be one of ${allowed.join("|")}`));
  }

  const location = p.location;
  if (!location || typeof location !== "object" || Array.isArray(location)) {
    err(at("properties.location must be an object"));
  } else {
    for (const key of ["city", "region", "countryCode", "county"]) {
      if (!nonEmptyString(location[key])) err(at(`properties.location.${key} must be a nonempty string`));
    }
    if (!LOCATION_PRECISIONS.includes(location.precision)) {
      err(at(`properties.location.precision must be ${LOCATION_PRECISIONS.join("|")}`));
    }
    if (!COORDINATE_SOURCES.includes(location.coordinateSource)) {
      err(at(`properties.location.coordinateSource must be ${COORDINATE_SOURCES.join("|")}`));
    }
    if (!LOCATION_STATUSES.includes(location.status)) {
      err(at(`properties.location.status must be ${LOCATION_STATUSES.join("|")}`));
    }
    if (location.address !== null && !nonEmptyString(location.address)) {
      err(at("properties.location.address must be null or a nonempty string"));
    }
    if (location.postalCode !== null && !nonEmptyString(location.postalCode)) {
      err(at("properties.location.postalCode must be null or a nonempty string"));
    }
    if (location.sourceUrl !== null && !validUrl(location.sourceUrl)) {
      err(at("properties.location.sourceUrl must be null or an http(s) URL"));
    }
    if (location.checkedAt !== null && !validDate(location.checkedAt)) {
      err(at("properties.location.checkedAt must be null or YYYY-MM-DD"));
    }
    if (location.precision === "city") {
      cityPrecision++;
      if (location.address !== null) err(at("city-precision locations must have address: null"));
      if (location.coordinateSource !== "city-centroid") {
        err(at("city-precision locations must use coordinateSource: city-centroid"));
      }
    }
    if (location.precision === "address" && !nonEmptyString(location.address)) {
      err(at("address-precision locations require a street address"));
    }
    if (location.status === "unchecked" && location.checkedAt !== null) {
      err(at("unchecked locations must have checkedAt: null"));
    }
    if (location.status !== "unchecked" && !validDate(location.checkedAt)) {
      err(at("checked locations require checkedAt"));
    }
    if (nonEmptyString(location.county)) countiesSeen.add(countyKey(location.county));
  }

  const presenceCheck = p.presenceCheck;
  if (!presenceCheck || typeof presenceCheck !== "object" || Array.isArray(presenceCheck)) {
    err(at("properties.presenceCheck must be an object"));
  } else {
    if (!PRESENCE_STATUSES.includes(presenceCheck.status)) {
      err(at(`properties.presenceCheck.status must be ${PRESENCE_STATUSES.join("|")}`));
    }
    if (presenceCheck.sourceUrl !== null && !validUrl(presenceCheck.sourceUrl)) {
      err(at("properties.presenceCheck.sourceUrl must be null or an http(s) URL"));
    }
    if (presenceCheck.checkedAt !== null && !validDate(presenceCheck.checkedAt)) {
      err(at("properties.presenceCheck.checkedAt must be null or YYYY-MM-DD"));
    }
    if (presenceCheck.status === "unchecked" && presenceCheck.checkedAt !== null) {
      err(at("unchecked presence checks must have checkedAt: null"));
    }
    if (presenceCheck.status !== "unchecked" && !validDate(presenceCheck.checkedAt)) {
      err(at("completed presence checks require checkedAt"));
    }
    if (presenceCheck.status === "verified") {
      verifiedPresence++;
      if (!validUrl(presenceCheck.sourceUrl)) err(at("verified presence checks require sourceUrl"));
    }
  }

  const websiteCheck = p.websiteCheck;
  if (!websiteCheck || typeof websiteCheck !== "object" || Array.isArray(websiteCheck)) {
    err(at("properties.websiteCheck must be an object"));
  } else {
    if (!WEBSITE_STATUSES.includes(websiteCheck.status)) {
      err(at(`properties.websiteCheck.status must be ${WEBSITE_STATUSES.join("|")}`));
    }
    if (websiteCheck.checkedAt !== null && !validDate(websiteCheck.checkedAt)) {
      err(at("properties.websiteCheck.checkedAt must be null or YYYY-MM-DD"));
    }
    if (websiteCheck.status === "unchecked" && websiteCheck.checkedAt !== null) {
      err(at("unchecked website checks must have checkedAt: null"));
    }
    if (websiteCheck.status !== "unchecked" && !validDate(websiteCheck.checkedAt)) {
      err(at("completed website checks require checkedAt"));
    }
  }

  if (p.japanConnection !== "none") japanLinked++;
  if (p.scale === "large") largeScale++;
  if (Array.isArray(p.industries) && p.industries.some((s) => MFG_INDUSTRIES.has(s.toLowerCase()))) {
    mfgRelated++;
  }
  if (p.entityType !== "company") nonCompany++;
}

if (doc?.metadata?.updatedAt !== newestEntityUpdate) {
  err(`top-level: metadata.updatedAt ${doc?.metadata?.updatedAt} must equal newest entity update ${newestEntityUpdate}`);
}
if (japanLinked < 100) err(`composition: japanConnection != none count ${japanLinked} < 100`);
if (largeScale < 70) err(`composition: scale == large count ${largeScale} < 70`);
if (mfgRelated < 60) err(`composition: manufacturing-related count ${mfgRelated} < 60`);
if (nonCompany < 20) err(`composition: entityType != company count ${nonCompany} < 20`);
const missingCounties = BAY_AREA_COUNTIES.filter((c) => !countiesSeen.has(c.toLowerCase()));
if (missingCounties.length) err(`composition: missing Bay Area counties: ${missingCounties.join(", ")}`);

if (errors.length) {
  const shown = errors.slice(0, 60);
  console.error(
    `FAIL: ${errors.length} error(s) in ${features.length} features:\n  - ` + shown.join("\n  - ") +
    (errors.length > shown.length ? `\n  - ...and ${errors.length - shown.length} more` : ""),
  );
  process.exitCode = 1;
} else {
  console.log(
    `OK ${FILE}: schema v3, ${features.length} features | japan-linked ${japanLinked}, ` +
    `city-precision ${cityPrecision}, address-precision ${features.length - cityPrecision}, ` +
    `verified current presence ${verifiedPresence}, all 9 counties present`,
  );
}
