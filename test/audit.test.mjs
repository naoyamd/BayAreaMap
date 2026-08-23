import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  chooseAddressCandidate,
  classifyLocation,
  classifyPresence,
  discoverOfficialLocationUrls,
  distanceKm,
  extractCaliforniaAddress,
  extractCaliforniaAddresses,
  hashId,
  officialAddressSource,
  selectFeatures,
  sourceMentionsEntity,
  sourceMentionsLocation,
  sourceMentionsPresence,
} from '../scripts/audit.mjs';

const SHARD_COUNT = 45;

const geo = JSON.parse(
  readFileSync(new URL('../data/entities.geojson', import.meta.url), 'utf8'),
);
const features = geo.features;
const appSource = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const indexSource = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const readmeSource = readFileSync(new URL('../README.md', import.meta.url), 'utf8');

test('hashId is deterministic and unsigned', () => {
  const samples = ['jetro-san-francisco', '', 'x', 'some-long-id-value-123'];

  for (const id of samples) {
    const first = hashId(id);
    for (let i = 0; i < 5; i++) {
      assert.strictEqual(hashId(id), first, `hashId('${id}') must be stable`);
    }
    assert.strictEqual(Number.isInteger(first), true);
    assert.strictEqual(first, first >>> 0, 'must be an unsigned 32-bit value');
    assert.ok(first >= 0 && first <= 0xffffffff, `out of range: ${first}`);
  }
});

test('shards 0..44 partition every feature id exactly once', () => {
  const seen = new Map();

  for (let shard = 0; shard < SHARD_COUNT; shard++) {
    const selected = selectFeatures(features, { shard });
    for (const feature of selected) {
      const id = feature?.properties?.id;
      assert.ok(!seen.has(id), `duplicate id ${id} in shards ${seen.get(id)} and ${shard}`);
      seen.set(id, shard);
      assert.strictEqual(hashId(id) % SHARD_COUNT, shard);
    }
  }

  const allIds = new Set(features.map((f) => f.properties.id));
  assert.strictEqual(seen.size, allIds.size, 'every feature id must appear exactly once');
  for (const id of allIds) {
    assert.ok(seen.has(id), `missing id ${id} from all shards`);
  }
});

test('Sony correction moves the pin from the wrong side of US-101', () => {
  const sony = features.find((feature) => feature.properties.id === 'sony');
  const census = [-122.282282821742, 37.562067494598];
  const old = [-122.3005, 37.5572];

  assert.ok(distanceKm(old, census) > 1, 'old coordinate should be over 1 km away');
  assert.ok(distanceKm(sony.geometry.coordinates, census) < 0.01);
  assert.strictEqual(sony.properties.location.status, 'matched');
  assert.strictEqual(sony.properties.presenceCheck.status, 'verified');
});

test('RakuNest and its mapped tenants share the verified facility address', () => {
  const ids = [
    'rakunest',
    'jcb-silicon-valley',
    'jtb-silicon-valley',
    'hakuhodo-dy-irep',
    'ihi-rakunest',
    'shimizu-rakunest',
    'eneos-rakunest',
    'systena-rakunest',
    'exedy-rakunest',
    'kurita-rakunest',
    'tosoh-rakunest',
    'sekisui-chemical-rakunest',
  ];
  const expected = [-122.300177371754, 37.555182590093];

  for (const id of ids) {
    const feature = features.find((item) => item.properties.id === id);
    assert.ok(feature, `missing ${id}`);
    assert.ok(distanceKm(feature.geometry.coordinates, expected) < 0.01, id);
    assert.strictEqual(feature.properties.location.address, '900 Concar Drive, Suite 400');
    assert.strictEqual(feature.properties.location.status, 'matched');
  }
});

test('San Mateo has one Rakuten group pin at the official Rakuten USA office', () => {
  const rakuten = features.filter((feature) =>
    feature.properties.location.city === 'San Mateo' && /rakuten/i.test(feature.properties.name),
  );

  assert.deepStrictEqual(rakuten.map((feature) => feature.properties.name), ['Rakuten USA, Inc.']);
  assert.strictEqual(rakuten[0].properties.location.address, '800 Concar Drive');
  assert.ok(distanceKm(rakuten[0].geometry.coordinates, [-122.301126718315, 37.555087497011]) < 0.01);
  assert.strictEqual(rakuten[0].properties.presenceCheck.status, 'verified');
});

test('coordinate and current-presence checks stay independent', () => {
  const location = {
    address: '2207 Bridgepointe Pkwy',
    city: 'San Mateo',
    precision: 'address',
  };
  const officialPage = '<p>2207 Bridgepointe Pkwy, San Mateo, CA 94404</p>';

  assert.strictEqual(sourceMentionsLocation(officialPage, location), true);
  assert.strictEqual(sourceMentionsLocation('<p>San Mateo office</p>', location), false);
  assert.strictEqual(sourceMentionsPresence(officialPage, location), true);
  assert.strictEqual(classifyLocation({ distance: 0.2 }), 'matched');
  assert.strictEqual(
    classifyPresence({
      sourceUrl: 'https://example.com',
      sourceOk: true,
      sourceHtml: officialPage,
      location,
    }),
    'verified',
  );
  assert.strictEqual(classifyLocation({ distance: 1.2 }), 'review');
  assert.strictEqual(
    classifyPresence({ sourceUrl: null, sourceOk: false, sourceHtml: '', location }),
    'unchecked',
  );
});

test('city locations use a first-party source and can discover a street address', () => {
  const properties = {
    website: 'https://www.example.co.jp/en/',
    presenceCheck: { sourceUrl: 'https://blog.example.net/company-list' },
  };
  const html = '<address>3975 Freedom Circle, Suite 910<br>Santa Clara, CA 95054</address>';
  const homepage = `
    <a href="/contact">Contact</a>
    <a href="/about-us">About us</a>
    <a href="https://blog.example.net/locations">Locations blog</a>
  `;

  assert.strictEqual(officialAddressSource(properties), properties.website);
  assert.deepStrictEqual(
    discoverOfficialLocationUrls(homepage, properties.website, properties.website),
    ['https://www.example.co.jp/contact', 'https://www.example.co.jp/about-us'],
  );
  assert.deepStrictEqual(extractCaliforniaAddress(html, 'Santa Clara'), {
    address: '3975 Freedom Circle, Suite 910',
    postalCode: '95054',
  });
  assert.strictEqual(extractCaliforniaAddress(html, 'San Mateo'), null);
  const corrected = extractCaliforniaAddresses(
    '<p>3160 Silicon Valley Office</p><address>70 Rio Robles<br>San Jose, California 95134</address>',
    ['San Francisco', 'San Jose'],
  );
  assert.deepStrictEqual(chooseAddressCandidate(corrected, 'San Francisco'), {
    address: '70 Rio Robles',
    city: 'San Jose',
    postalCode: '95134',
  });
  assert.strictEqual(sourceMentionsEntity('<p>Resonac America Inc.</p>', 'Resonac US-JOINT'), false);
  assert.strictEqual(sourceMentionsEntity('<p>Resonac US-JOINT</p>', 'Resonac US-JOINT'), true);
});

test('major Bay Area anchors are present and exact overlaps expand at town zoom', () => {
  const ids = [
    'google', 'apple', 'meta', 'nvidia', 'tesla-fremont', 'cisco', 'intel', 'amd',
    'oracle', 'linkedin', 'netflix', 'databricks', 'snowflake', 'anthropic', 'doordash',
    'paypal', 'ebay', 'intuit', 'servicenow', 'zoom',
  ];

  for (const id of ids) {
    const feature = features.find((item) => item.properties.id === id);
    assert.ok(feature, `missing ${id}`);
    assert.strictEqual(feature.properties.location.precision, 'address', id);
    assert.strictEqual(feature.properties.presenceCheck.status, 'verified', id);
  }
  for (const id of ['google', 'apple', 'meta', 'sf-amazon-web-services', 'sf-microsoft']) {
    assert.strictEqual(features.find((item) => item.properties.id === id)?.properties.scale, 'large', id);
  }
  assert.match(appSource, /const TOWN_ZOOM = 13;/);
  assert.match(appSource, /feature\.geometry\.coordinates\.join\(","\)/);
  assert.match(appSource, /marker\.addTo\(townMode \? townMarkerLayer : markerLayer\)/);
  assert.doesNotMatch(appSource, /scheduleAutoSpiderfy|\.spiderfy\(\)/);
});

test('site chrome is English, Japanese company names remain, and README stays Japanese', () => {
  assert.match(indexSource, /<html lang="en">/);
  assert.match(indexSource, /<title>Bay Area Company Map<\/title>/);
  assert.doesNotMatch(indexSource, /[ぁ-んァ-ヶ一-龠々]/);
  assert.doesNotMatch(appSource, /[ぁ-んァ-ヶ一-龠々]/);
  assert.match(appSource, /nameJaLine\.lang = "ja"/);
  assert.match(readmeSource, /^# ベイエリア企業マップ/m);
});

test('every entity has a logo source ladder with a cached fallback', () => {
  assert.ok(features.every((feature) => feature.properties.website));
  assert.match(appSource, /apple-touch-icon\.png/);
  assert.match(appSource, /favicon\.svg/);
  assert.match(appSource, /www\.google\.com\/s2\/favicons/);
});
