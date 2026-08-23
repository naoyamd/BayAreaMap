import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  classifyLocation,
  distanceKm,
  hashId,
  selectFeatures,
  sourceMentionsLocation,
} from '../scripts/audit.mjs';

const SHARD_COUNT = 45;

const geo = JSON.parse(
  readFileSync(new URL('../data/entities.geojson', import.meta.url), 'utf8'),
);
const features = geo.features;

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
  assert.strictEqual(sony.properties.location.status, 'verified');
});

test('location verification separates coordinate match from official evidence', () => {
  const location = {
    address: '2207 Bridgepointe Pkwy',
    city: 'San Mateo',
  };
  const officialPage = '<p>2207 Bridgepointe Pkwy, San Mateo, CA 94404</p>';

  assert.strictEqual(sourceMentionsLocation(officialPage, location), true);
  assert.strictEqual(sourceMentionsLocation('<p>San Mateo office</p>', location), false);
  assert.strictEqual(classifyLocation({ distance: 0.2, sourceUrl: null }), 'matched');
  assert.strictEqual(
    classifyLocation({ distance: 0.2, sourceUrl: 'https://example.com', sourceMatches: true }),
    'verified',
  );
  assert.strictEqual(classifyLocation({ distance: 1.2, sourceUrl: null }), 'review');
});
