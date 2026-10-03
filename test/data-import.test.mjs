import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  extractHeadquarters,
  featureFromRecord,
  importDataset,
  parseOfficialProfile,
  selectRecords,
  verifyOfficialRecord,
} from "../scripts/yc-import.mjs";

const sourceRecord = {
  id: 123456,
  name: "Example Robotics",
  slug: "example-robotics",
  website: "https://example-robotics.test",
  all_locations: "San Carlos, CA, USA",
  one_liner: "Robots for safer warehouses",
  long_description: "Longer description",
  team_size: 24,
  industry: "Industrials",
  subindustry: "Industrials -> Manufacturing and Robotics",
  tags: ["Robotics", "AI"],
  batch: "Summer 2026",
  status: "Active",
  url: "https://www.ycombinator.com/companies/example-robotics",
  api: "https://yc-oss.github.io/api/batches/summer-2026/example-robotics.json",
  __officialVerified: true,
};

const base = {
  type: "FeatureCollection",
  metadata: {
    schemaVersion: 3,
    updatedAt: "2026-09-11",
    coordinateSystem: "WGS84 / GeoJSON [longitude, latitude]",
  },
  features: [],
};

const currentGeo = JSON.parse(readFileSync(new URL("../data/entities.geojson", import.meta.url), "utf8"));

test("YC headquarters conversion keeps city precision and rejects non-Bay-Area cities", () => {
  assert.deepStrictEqual(extractHeadquarters(sourceRecord), {
    city: "San Carlos",
    county: "San Mateo County",
    coordinates: [-122.2605, 37.5072],
  });
  assert.equal(extractHeadquarters({ ...sourceRecord, all_locations: "Austin, TX, USA" }), null);
  const feature = featureFromRecord(sourceRecord, "2026-10-03", { trustedOfficial: true });
  assert.equal(feature.properties.location.precision, "city");
  assert.equal(feature.properties.location.address, null);
  assert.equal(feature.properties.presenceCheck.status, "verified");
  assert.equal(feature.properties.description, sourceRecord.one_liner);
});

test("YC import is idempotent and deduplicates an existing domain", () => {
  const first = importDataset(base, [sourceRecord], { date: "2026-10-03", limit: 492, trustedOfficial: true });
  assert.equal(first.added, 1);
  assert.equal(first.doc.features.length, 1);
  assert.equal(first.doc.metadata.sourceCatalog.added, 1);

  const second = importDataset(first.doc, [sourceRecord], { date: "2026-10-03", limit: 492, trustedOfficial: true });
  assert.equal(second.added, 0);
  assert.equal(second.doc.features.length, 1);
  assert.equal(second.promoted, 1);
  assert.deepStrictEqual(second.doc.features, first.doc.features);
});

test("mirror flags cannot self certify presence and same-city mismatches stay review", () => {
  const untrusted = featureFromRecord(sourceRecord, "2026-10-03");
  assert.equal(untrusted.properties.presenceCheck.status, "review");
  assert.equal(untrusted.properties.presenceCheck.sourceType, "candidate-mirror");

  const existing = featureFromRecord({ ...sourceRecord, website: "https://different-legal-entity.test" }, "2026-09-01", { trustedOfficial: true });
  existing.properties.presenceCheck = { checkedAt: null, status: "review", sourceUrl: null };
  const result = importDataset({ ...base, features: [existing] }, [sourceRecord], {
    date: "2026-10-03",
    limit: 492,
    trustedOfficial: true,
  });
  assert.equal(result.promoted, 0);
  assert.equal(result.added, 1, "same-name different-host entity is retained separately");
  assert.equal(result.doc.features[0].properties.presenceCheck.status, "review");
});

function officialPage(company) {
  const json = JSON.stringify({ props: { company } }).replaceAll('"', "&quot;");
  return `<div data-page="${json}"></div>`;
}

test("official profile parser requires a US company and a mapped Bay Area city", async () => {
  const company = {
    id: 123456,
    slug: sourceRecord.slug,
    name: sourceRecord.name,
    website: sourceRecord.website,
    city: "San Carlos",
    country: "US",
    ycdc_status: "Active",
    team_size: 24,
  };
  assert.equal(parseOfficialProfile(officialPage(company)).slug, sourceRecord.slug);
  const fetchPage = async () => new Response(officialPage(company), { status: 200 });
  assert.equal((await verifyOfficialRecord(sourceRecord, fetchPage)).status, "verified");
  assert.equal((await verifyOfficialRecord(sourceRecord, async () => new Response(
    officialPage({ ...company, country: "CA" }), { status: 200 },
  ))).reason, "official-country:CA");
  assert.equal((await verifyOfficialRecord(sourceRecord, async () => new Response(
    officialPage({ ...company, city: "Austin" }), { status: 200 },
  ))).reason, "official-city-outside-bay-area");
  assert.equal((await verifyOfficialRecord(sourceRecord, async () => new Response(
    officialPage({ ...company, website: "" }), { status: 200 },
  ))).reason, "official-website-missing");
  assert.equal((await verifyOfficialRecord(sourceRecord, async () => new Response(
    officialPage({ ...company, city: "", location: "" }), { status: 200 },
  ))).reason, "official-city-missing", "mirror headquarters cannot replace missing primary evidence");
  assert.equal((await verifyOfficialRecord(sourceRecord, async () => new Response(
    officialPage({ ...company, name: "" }), { status: 200 },
  ))).reason, "official-identity-missing");
  const timeoutError = Object.assign(new Error("aborted"), { name: "AbortError" });
  assert.equal((await verifyOfficialRecord(sourceRecord, async () => { throw timeoutError; })).reason, "fetch-timeout");
  assert.match((await verifyOfficialRecord(sourceRecord, async () => ({
    ok: true,
    text: async () => { throw new Error("broken body"); },
  }))).reason, /^response-text-error:/);
});

test("official promotion preserves an existing street address", () => {
  const existing = featureFromRecord(sourceRecord, "2026-09-01", { trustedOfficial: true });
  existing.properties.location = {
    ...existing.properties.location,
    address: "1 Existing Street",
    precision: "address",
    coordinateSource: "census-geocoder",
    checkedAt: "2026-09-01",
    status: "matched",
  };
  existing.properties.presenceCheck = { checkedAt: null, status: "review", sourceUrl: null };
  const result = importDataset({ ...base, features: [existing] }, [sourceRecord], {
    date: "2026-10-03",
    limit: 492,
    trustedOfficial: true,
  });
  assert.equal(result.promoted, 1);
  assert.equal(result.doc.features[0].properties.location.address, "1 Existing Street");
  assert.equal(result.doc.features[0].properties.presenceCheck.status, "verified");
});

test("primary location corrections carry address evidence without changing parent identities", () => {
  const result = importDataset(currentGeo, [], { date: "2026-10-03", all: true });
  const byId = new Map(result.doc.features.map((feature) => [feature.properties.id, feature]));
  const ihi = byId.get("ihi-rakunest");
  assert.equal(ihi.properties.name, "IHI Launch Pad");
  assert.equal(ihi.properties.location.address, "963 Industrial Road, Suite D");
  assert.equal(ihi.properties.location.city, "San Carlos");
  assert.equal(ihi.properties.presenceCheck.sourceType, "official-location-page");
  assert.equal(byId.get("fujitsu-north-america").properties.name, "Fujitsu North America");
  assert.match(byId.get("panasonic-north-america").properties.dataQualityNote, /Newark, New Jersey/);
});

test("recurring imports preserve later address corrections and retain the actual data update date", () => {
  const later = structuredClone(currentGeo);
  const ihi = later.features.find((feature) => feature.properties.id === "ihi-rakunest");
  ihi.properties.location.address = "1 Later Verified Address";
  ihi.properties.location.checkedAt = "2026-11-01";
  ihi.properties.updatedAt = "2026-11-01";
  later.metadata.updatedAt = "2026-11-01";
  const result = importDataset(later, [], { date: "2026-11-02", all: true });
  const preserved = result.doc.features.find((feature) => feature.properties.id === "ihi-rakunest");
  assert.equal(preserved.properties.location.address, "1 Later Verified Address");
  assert.equal(preserved.properties.location.checkedAt, "2026-11-01");
  assert.equal(result.doc.metadata.updatedAt, "2026-11-01");
});

test("selection only includes active Bay Area records with a usable website", () => {
  const selected = selectRecords([
    sourceRecord,
    { ...sourceRecord, id: 2, name: "Inactive", status: "Inactive" },
    { ...sourceRecord, id: 3, name: "Outside", all_locations: "Austin, TX, USA" },
    { ...sourceRecord, id: 4, name: "No Website", website: "" },
  ], { all: true });
  assert.deepStrictEqual(selected.map((record) => record.name), ["Example Robotics"]);
});
