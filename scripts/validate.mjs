#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const FILE = join(dirname(fileURLToPath(import.meta.url)), "..", "data", "entities.geojson");

const REQUIRED_STRINGS = [
  "name", "nameJa", "website", "address", "city", "county",
  "entityType", "japanConnection", "scale", "sourceUrl",
  "updatedAt", "checkedAt", "checkStatus",
];

const ENUMS = {
  entityType: ["company", "vc-cvc", "support", "university-research"],
  japanConnection: ["japan-headquartered", "japanese-founded", "japan-focused", "none"],
  scale: ["startup", "growth", "large", "not-applicable"],
  checkStatus: ["ok", "review", "unchecked"],
};

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
const features = doc?.features;
if (!Array.isArray(features)) {
  err("top-level: features must be an array");
  console.error(`FAIL: ${errors.length} error(s):\n  - ` + errors.join("\n  - "));
  process.exit(1);
}
if (features.length < 300) {
  err(`top-level: expected at least 300 features, got ${features.length}`);
}

const seenIds = new Map();
const countiesSeen = new Set();
let japanLinked = 0;
let largeScale = 0;
let mfgRelated = 0;
let nonCompany = 0;

for (let i = 0; i < features.length; i++) {
  const f = features[i];
  const at = (msg) => `[${i}] ${msg}`;

  if (f?.type !== "Feature") err(at(`type must be "Feature" (got ${JSON.stringify(f?.type)})`));

  const geom = f?.geometry;
  if (!geom || geom.type !== "Point") {
    err(at(`geometry.type must be "Point" (got ${JSON.stringify(geom?.type)})`));
  } else {
    const c = geom.coordinates;
    if (
      !Array.isArray(c) || c.length !== 2 ||
      !Number.isFinite(c[0]) || !Number.isFinite(c[1])
    ) {
      err(at(`coordinates must be [lon, lat] finite numbers (got ${JSON.stringify(c)})`));
    } else {
      const [lon, lat] = c;
      if (lon < -123.5 || lon > -121.0) err(at(`longitude ${lon} outside -123.5..-121.0`));
      if (lat < 36.8 || lat > 39.2) err(at(`latitude ${lat} outside 36.8..39.2`));
    }
  }

  const p = f?.properties ?? {};
  const id = p.id;
  if (!nonEmptyString(id)) {
    err(at("properties.id must be a nonempty string"));
  } else if (seenIds.has(id)) {
    err(at(`duplicate properties.id "${id}" (first seen at [${seenIds.get(id)}])`));
  } else {
    seenIds.set(id, i);
  }

  for (const key of REQUIRED_STRINGS) {
    if (!nonEmptyString(p[key])) {
      err(at(`properties.${key} must be a nonempty string (got ${JSON.stringify(p[key])})`));
    }
  }

  for (const key of ["website", "sourceUrl"]) {
    const v = p[key];
    if (nonEmptyString(v)) {
      let ok = false;
      try {
        const u = new URL(v);
        ok = u.protocol === "http:" || u.protocol === "https:";
      } catch {}
      if (!ok) err(at(`properties.${key} must be an http(s) URL (got ${JSON.stringify(v)})`));
    }
  }

  for (const key of ["updatedAt", "checkedAt"]) {
    const v = p[key];
    if (nonEmptyString(v) && !DATE_RE.test(v.trim())) {
      err(at(`properties.${key} must match YYYY-MM-DD (got ${JSON.stringify(v)})`));
    }
  }

  if (!Array.isArray(p.industries) || p.industries.length === 0 ||
      !p.industries.every((s) => nonEmptyString(s))) {
    err(at("properties.industries must be a nonempty array of nonempty strings"));
  }

  for (const [key, allowed] of Object.entries(ENUMS)) {
    const v = p[key];
    if (nonEmptyString(v) && !allowed.includes(v)) {
      err(at(`properties.${key} must be one of ${allowed.join("|")} (got ${JSON.stringify(v)})`));
    }
  }

  if (p.japanConnection !== undefined && p.japanConnection !== "none") japanLinked++;
  if (p.scale === "large") largeScale++;
  if (Array.isArray(p.industries) &&
      p.industries.some((s) => typeof s === "string" && MFG_INDUSTRIES.has(s.toLowerCase()))) {
    mfgRelated++;
  }
  if (p.entityType !== undefined && p.entityType !== "company") nonCompany++;
  if (nonEmptyString(p.county)) countiesSeen.add(countyKey(p.county));
}

if (japanLinked < 100) err(`composition: japanConnection != none count ${japanLinked} < 100`);
if (largeScale < 70) err(`composition: scale == large count ${largeScale} < 70`);
if (mfgRelated < 60) err(`composition: manufacturing-related industries count ${mfgRelated} < 60`);
if (nonCompany < 20) err(`composition: entityType != company count ${nonCompany} < 20`);

const missingCounties = BAY_AREA_COUNTIES.filter((c) => !countiesSeen.has(c.toLowerCase()));
if (missingCounties.length > 0) {
  err(`composition: missing Bay Area counties: ${missingCounties.join(", ")}`);
}

if (errors.length > 0) {
  const shown = errors.slice(0, 60);
  const rest = errors.length - shown.length;
  console.error(
    `FAIL: ${errors.length} error(s) in ${features.length} features:\n  - ` +
    shown.join("\n  - ") +
    (rest > 0 ? `\n  - ...and ${rest} more` : "")
  );
  process.exitCode = 1;
} else {
  console.log(
    `OK ${FILE}: ${features.length} features, ${seenIds.size} unique ids | ` +
    `japan-linked ${japanLinked}, large ${largeScale}, mfg-related ${mfgRelated}, ` +
    `non-company ${nonCompany}, all 9 counties present`
  );
}
