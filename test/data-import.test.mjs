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

test("curated IHI presence uses the RakuNest facility without claiming official IHI evidence", () => {
  const result = importDataset(currentGeo, [], { date: "2026-10-03", all: true });
  const byId = new Map(result.doc.features.map((feature) => [feature.properties.id, feature]));
  const ihi = byId.get("ihi-rakunest");
  const rakunest = byId.get("rakunest");
  assert.equal(ihi.properties.name, "IHI");
  assert.equal(ihi.properties.nameJa, "株式会社IHI");
  assert.deepStrictEqual(ihi.geometry.coordinates, rakunest.geometry.coordinates);
  assert.equal(ihi.properties.location.address, rakunest.properties.location.address);
  assert.equal(ihi.properties.location.city, rakunest.properties.location.city);
  assert.equal(ihi.properties.location.county, rakunest.properties.location.county);
  assert.equal(ihi.properties.presenceCheck.status, "verified");
  assert.equal(ihi.properties.presenceCheck.sourceType, "user-confirmed");
  assert.equal(ihi.properties.presenceCheck.sourceUrl, null);
  assert.equal(ihi.properties.presenceCheck.userStatementDate, "2026-10-03");
  assert.match(ihi.properties.presenceCheck.userStatement, /IHI Launch Pad has closed/);
  assert.equal(ihi.properties.presenceCheck.supportingSourceUrl, "https://www.rakunest.com/contact");
  assert.equal(byId.get("fujitsu-north-america").properties.name, "Fujitsu North America");
  assert.match(byId.get("panasonic-north-america").properties.dataQualityNote, /Newark, New Jersey/);
});

test("recurring imports restore stale IHI data while retaining user confirmation dates", () => {
  const replay = structuredClone(currentGeo);
  const ihi = replay.features.find((feature) => feature.properties.id === "ihi-rakunest");
  const originalWebsiteCheck = structuredClone(ihi.properties.websiteCheck);
  ihi.geometry.coordinates = [-122.249823194785, 37.505417687692];
  ihi.properties.name = "IHI Launch Pad";
  ihi.properties.location = {
    ...ihi.properties.location,
    address: "963 Industrial Road, Suite D",
    city: "San Carlos",
    postalCode: "94070",
    county: "San Mateo County",
    sourceUrl: "https://www.ihi.co.jp/ihi_launchpad/",
    checkedAt: "2026-10-03",
  };
  ihi.properties.presenceCheck = {
    checkedAt: "2026-10-03",
    status: "verified",
    sourceUrl: "https://www.ihi.co.jp/ihi_launchpad/",
    sourceType: "official-location-page",
  };
  const result = importDataset(replay, [], { date: "2026-11-02", all: true });
  const preserved = result.doc.features.find((feature) => feature.properties.id === "ihi-rakunest");
  const rakunest = result.doc.features.find((feature) => feature.properties.id === "rakunest");
  assert.equal(preserved.properties.name, "IHI");
  assert.deepStrictEqual(preserved.properties.industries, ["industrial", "manufacturing", "aerospace", "defense", "space"]);
  assert.deepStrictEqual(preserved.geometry.coordinates, rakunest.geometry.coordinates);
  assert.equal(preserved.properties.location.address, rakunest.properties.location.address);
  assert.equal(preserved.properties.location.checkedAt, rakunest.properties.location.checkedAt);
  assert.equal(preserved.properties.presenceCheck.checkedAt, "2026-10-03");
  assert.equal(preserved.properties.presenceCheck.userStatementDate, "2026-10-03");
  assert.equal(preserved.properties.presenceCheck.sourceUrl, null);
  assert.deepStrictEqual(preserved.properties.websiteCheck, originalWebsiteCheck);
  assert.equal(result.doc.metadata.updatedAt, "2026-11-02");
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
