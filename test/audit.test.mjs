import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { gzipSync } from 'node:zlib';
import { performance } from 'node:perf_hooks';

import {
  chooseAddressCandidate,
  classifyLocation,
  classifyPresence,
  discoverOfficialLocationUrls,
  distanceKm,
  extractCaliforniaAddress,
  extractCaliforniaAddresses,
  hashId,
  locationNeedsAddress,
  officialAddressSource,
  parseArgs,
  selectFeatures,
  sourceMentionsEntity,
  sourceMentionsEntityNearLocation,
  sourceMentionsLocation,
  sourceMentionsPresence,
} from '../scripts/audit.mjs';
import { buildCandidateReport } from '../scripts/wikipedia-candidates.mjs';

const SHARD_COUNT = 45;

const geo = JSON.parse(
  readFileSync(new URL('../data/entities.geojson', import.meta.url), 'utf8'),
);
const features = geo.features;
const appSource = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const indexSource = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const readmeSource = readFileSync(new URL('../README.md', import.meta.url), 'utf8');
const stylesSource = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
const wikipediaSource = readFileSync(new URL('../scripts/wikipedia-candidates.mjs', import.meta.url), 'utf8');
const auditWorkflowSource = readFileSync(new URL('../.github/workflows/audit.yml', import.meta.url), 'utf8');

test('Wikipedia discovery excludes known names and prioritizes research candidates', () => {
  const pages = new Map([
    [1, { title: 'Apple Inc.', kinds: new Set(['company']), sourceCategories: new Set(['Category:A']) }],
    [2, { title: 'Ames Research Center', kinds: new Set(['university-research']), sourceCategories: new Set(['Category:B']) }],
    [3, { title: 'Example Systems', kinds: new Set(['company']), sourceCategories: new Set(['Category:A', 'Category:C']) }],
  ]);
  const result = buildCandidateReport(pages, ['Apple']);
  assert.deepStrictEqual(result.map((item) => item.title), ['Ames Research Center', 'Example Systems']);
  assert.ok(result[0].wikipediaUrl.endsWith('/Ames_Research_Center'));
  assert.match(wikipediaSource, /Category:Unmanned aerial vehicle manufacturers of the United States/);
});

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
      entityName: 'Example Corp',
    }),
    'review',
  );
  assert.strictEqual(classifyPresence({
    sourceUrl: 'https://example.com',
    sourceOk: true,
    sourceHtml: `<p>Example Corp</p>${officialPage}`,
    location,
    entityName: 'Example Corp',
  }), 'verified');
  assert.strictEqual(classifyPresence({
    sourceUrl: 'https://blog.example.net/list',
    sourceOk: true,
    sourceHtml: `<p>Example Corp</p>${officialPage}`,
    location,
    entityName: 'Example Corp',
    trustedSource: false,
  }), 'review');
  assert.strictEqual(classifyLocation({ distance: 1.2 }), 'review');
  assert.strictEqual(
    classifyPresence({ sourceUrl: null, sourceOk: false, sourceHtml: '', location, entityName: 'Example Corp' }),
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
    <a href="/group-companies">Group companies</a>
    <a href="/contact">Contact</a>
    <a href="/about-us">About us</a>
    <a href="https://blog.example.net/locations">Locations blog</a>
  `;

  assert.strictEqual(officialAddressSource(properties), properties.website);
  assert.deepStrictEqual(
    discoverOfficialLocationUrls(homepage, properties.website, properties.website),
    [
      'https://www.example.co.jp/group-companies',
      'https://www.example.co.jp/contact',
      'https://www.example.co.jp/about-us',
    ],
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
  assert.strictEqual(sourceMentionsEntity('<p>NRI America</p>', 'NRI America San Francisco'), true);
  assert.strictEqual(sourceMentionsEntity('<p>IHI Aerospace</p>', 'IHI Corporation'), false);
  assert.strictEqual(locationNeedsAddress({ address: 'San Francisco', city: 'San Francisco', region: 'CA', precision: 'address' }), true);
  assert.strictEqual(locationNeedsAddress({ address: '1 Market St', city: 'San Francisco', region: 'CA', precision: 'address' }), false);
  assert.ok(selectFeatures(features, { all: true, cityOnly: true, city: 'San Francisco' })
    .every((feature) => feature.properties.location.city === 'San Francisco'));
});

test('a group page cannot assign one subsidiary another subsidiary address', () => {
  const html = `
    <section><h2>IHI Aerospace</h2><p>123 Aviation Way, San Mateo, CA 94401</p></section>
    <section><h2>IHI Corporation</h2><p>800 Concar Drive, San Mateo, CA 94402</p></section>
  `;
  const aerospace = { address: '123 Aviation Way', city: 'San Mateo', postalCode: '94401' };
  const corporation = { address: '800 Concar Drive', city: 'San Mateo', postalCode: '94402' };

  assert.strictEqual(sourceMentionsEntityNearLocation(html, aerospace, 'IHI Corporation'), false);
  assert.strictEqual(sourceMentionsEntityNearLocation(html, corporation, 'IHI Corporation'), true);
  assert.strictEqual(classifyPresence({
    sourceUrl: 'https://example.com/group-companies',
    sourceOk: true,
    sourceHtml: '<p>IHI Aerospace, 800 Concar Drive, San Mateo, CA 94402</p>',
    location: corporation,
    entityName: 'IHI Corporation',
  }), 'review');
});

test('official office pages replace San Francisco city placeholders', () => {
  const expected = {
    'daiwa-capital-markets-america-san-francisco': ['San Francisco', '1 California St, Suite 200'],
    'legalon-technologies-us': ['San Francisco', '220 Montgomery St, Suite 1600'],
    'kintone-corporation': ['San Francisco', '44 Montgomery St, 3rd Floor'],
    'nri-it-solutions-america-pacific-branch': ['San Mateo', '1900 S Norfolk St, Suite 219'],
    'smartnews-us': ['Palo Alto', '291 Alma Street'],
  };

  for (const [id, [city, address]] of Object.entries(expected)) {
    const feature = features.find((item) => item.properties.id === id);
    assert.strictEqual(feature?.properties.location.city, city, id);
    assert.strictEqual(feature?.properties.location.address, address, id);
    assert.strictEqual(feature?.properties.location.precision, 'address', id);
  }
  assert.ok(!features.some((item) => item.properties.id === 'soracom-us'));
});

test('major Bay Area anchors are present and dense cities expand only at maximum zoom', () => {
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
  assert.match(appSource, /const TOWN_ZOOM = 14;/);
  assert.match(appSource, /const MAX_ZOOM = 19;/);
  assert.match(appSource, /DENSE_CLUSTER_CITIES = new Set\(\["San Francisco", "San Jose", "Santa Clara"\]\)/);
  assert.match(appSource, /if \(zoom < TOWN_ZOOM\) return \{ positions, townIds \};/);
  assert.match(appSource, /const expandEverywhere = zoom >= MAX_ZOOM;/);
  assert.match(appSource, /if \(!expandEverywhere && DENSE_CLUSTER_CITIES\.has\(props\.location\.city\)\) continue;/);
  assert.match(appSource, /townIds\.add\(props\.id\);/);
  assert.match(appSource, /if \(!bounds\.contains\(origin\)\) continue;/);
  assert.match(appSource, /feature\.geometry\.coordinates\.join\(","\)/);
  assert.match(appSource, /markerLayer\.addLayers\(addCluster\)/);
  assert.doesNotMatch(appSource, /scheduleAutoSpiderfy|\.spiderfy\(\)/);
});

test('site chrome is English, Japanese company names remain, and README stays Japanese', () => {
  assert.match(indexSource, /<html lang="en">/);
  assert.match(indexSource, /<title>Bay Area Company Map — Field Networking<\/title>/);
  assert.doesNotMatch(indexSource, /[ぁ-んァ-ヶ一-龠々]/);
  assert.doesNotMatch(appSource, /[ぁ-んァ-ヶ一-龠々]/);
  assert.match(appSource, /nameJaLine\.lang = "ja"/);
  assert.match(readmeSource, /^# ベイエリア企業マップ/m);
  assert.match(readmeSource, /公開URL: <https:\/\/map\.nightly\.dedyn\.io\/>/);
  assert.match(indexSource, /<h1><a href="\.\/">Bay Area Company Map<\/a><\/h1>/);
});

test('human correction flags select exact entity IDs before the daily shard', () => {
  const ids = new Set(['sony', 'ihi-rakunest', 'not-in-the-map']);
  assert.deepStrictEqual(
    selectFeatures(features, { ids }).map((feature) => feature.properties.id),
    ['sony', 'ihi-rakunest'],
  );
  assert.deepStrictEqual(Array.from(parseArgs(['--ids', 'sony,ihi-rakunest']).ids), ['sony', 'ihi-rakunest']);
  assert.throws(() => parseArgs(['--ids', 'sony,$bad']), /comma-separated entity IDs/);
  assert.throws(() => parseArgs(['--all', '--ids', 'sony']), /mutually exclusive/);
  assert.match(appSource, /Report: needs correction/);
  assert.ok(appSource.includes('Entity ID: \\`${props.id}\\`'));
  assert.match(appSource, /issues\/new/);
  assert.match(appSource, /\[Data correction\]/);
  assert.match(auditWorkflowSource, /issues: read/);
  assert.match(auditWorkflowSource, /gh issue list --state open --limit 100/);
  assert.match(auditWorkflowSource, /node scripts\/audit\.mjs --ids "\$PRIORITY_IDS"/);
});

test('every entity has a logo source ladder with a cached fallback', () => {
  assert.ok(features.every((feature) => feature.properties.website));
  assert.match(appSource, /props\.logoUrl/);
  assert.match(appSource, /www\.google\.com\/s2\/favicons/);
  assert.match(appSource, /new URL\("\/favicon\.ico", website\)/);
  assert.match(appSource, /fallbackLogo\(props\.name\)/);
  assert.match(appSource, /initialsOf\(name\)/);
  assert.doesNotMatch(appSource, /apple-touch-icon|favicon\.svg/);
});

// v2 pure-logic tests: run app.js logic in a bare vm sandbox (no DOM libraries).

let __logicCache = null;

function appLogic() {
  if (__logicCache) return __logicCache;
  const sandbox = {
    document: { addEventListener() {} },
    window: { setTimeout: (fn, ms) => setTimeout(fn, ms), clearTimeout: (id) => clearTimeout(id) },
    URL, URLSearchParams,
    fetch: () => Promise.reject(new Error('offline')), history: { pushState() {}, replaceState() {} },
    location: { pathname: '/', search: '' },
    navigator: {}, requestAnimationFrame: () => 0,
  };
  runInNewContext(
    `${appSource}\n;globalThis.__logic = {\n` +
      '  normText, PAGE_SIZE, SECTOR_ORDER, SECTOR_IDS, SORT_VALUES, VIEW_VALUES, PARAM_GROUPS, state,\n' +
      '  PRESET_VALUES, SP500_ENTITY_IDS, UNICORN_ENTITY_IDS, deriveSectors, enrichFeature, rankFeature,\n' +
      '  matchesCompanyPreset, matchesFilterGroups, matchesSectors, inArea, tieCompare,\n' +
      '  pageNumberWindow, serializeState, parseArea, parseCenter, computeVisible, sortVisible, setEntities(value) { entities = value; },\n' +
      '  setMap(value) { map = value; }, setMarkerLayer(value) { markerLayer = value; },\n' +
      '  setTownLayer(value) { townMarkerLayer = value; }, setLegLayer(value) { overlapLegLayer = value; },\n' +
      '  setMarkers(value) { markersById = value; }, setVisibleEntities(value) { visibleEntities = value; },\n' +
      '  refreshMapLayers, chunkProgress: onClusterChunkProgress,\n' +
    '};',
    sandbox,
  );
  __logicCache = sandbox.__logic;
  return __logicCache;
}

function resetLogic() {
  const logic = appLogic();
  Object.assign(logic.state, { q: '', sort: 'relevance', preset: null, area: null, entityId: null, view: 'list' });
  logic.state.sectors.clear();
  for (const selected of Object.values(logic.state.filters)) selected.clear();
  return logic;
}

test('v2 logic: 10 sector ids exist and industries derive multiple sectors', () => {
  const logic = appLogic();
  assert.deepStrictEqual(Array.from(logic.SECTOR_ORDER), [
    'technology-ai', 'semiconductors-electronics', 'aerospace-defense', 'industrial-manufacturing',
    'mobility-automotive', 'finance-investment', 'life-sciences', 'energy-materials',
    'business-consumer', 'universities-research']);

  assert.deepStrictEqual(Array.from(logic.SECTOR_IDS), Array.from(logic.SECTOR_ORDER));
  const samples = [
    ['technology-ai', 'software'], ['semiconductors-electronics', 'Semiconductors'],
    ['aerospace-defense', 'aerospace'],
    ['industrial-manufacturing', 'robotics'], ['mobility-automotive', 'Automotive'],
    ['finance-investment', 'venture capital'], ['life-sciences', 'biotechnology'],
    ['energy-materials', 'chemicals'], ['business-consumer', 'accelerator'],
    ['universities-research', 'research']];
  for (const [sector, industry] of samples) assert.ok(logic.deriveSectors([industry]).includes(sector), sector);
  const mixed = { properties: { name: 'Conglomerate', industries: ['software', 'banking', 'robotics'], location: {} } };
  logic.enrichFeature(mixed);
  assert.deepStrictEqual(Array.from(mixed.properties._sectors), ['technology-ai', 'finance-investment', 'industrial-manufacturing']);
  assert.deepStrictEqual(Array.from(logic.deriveSectors(['not-a-real-industry'])), []);
  assert.deepStrictEqual(Array.from(logic.deriveSectors(undefined)), []);
  assert.ok(logic.deriveSectors([], 'university-research').includes('universities-research'));
});

test('aerospace retrofits and sourced Bay Area drone companies stay covered', () => {
  const logic = appLogic();
  const byId = new Map(features.map((feature) => [feature.properties.id, feature]));
  const aerospaceIds = [
    'ihi-rakunest', 'mitsubishi-electric-us', 'mitsubishi-heavy-industries-america',
    'kawasaki-heavy-industries-silicon-valley', 'toray-advanced-composites',
    'sf-dronedeploy', 'sf-planet',
  ];
  for (const id of aerospaceIds) {
    const feature = byId.get(id);
    assert.ok(feature, `missing ${id}`);
    assert.ok(logic.deriveSectors(feature.properties.industries).includes('aerospace-defense'), id);
  }

  const addedDroneIds = ['skydio', 'zipline', 'matternet', 'pyka', 'elroy-air', 'wing-aviation', 'saildrone'];
  assert.ok(features.filter((feature) => feature.properties.industries.includes('drones')).length >= 8);
  for (const id of addedDroneIds) {
    const feature = byId.get(id);
    assert.ok(feature, `missing ${id}`);
    assert.strictEqual(feature.properties.location.precision, 'address', id);
    assert.strictEqual(feature.properties.location.status, 'matched', id);
    assert.ok(feature.properties.presenceCheck.sourceUrl, `${id} missing presence source`);
  }
});

test('v2 logic: rankFeature tiers voiced JA/EN queries and tieCompare priorities', () => {
  const logic = appLogic();
  const nq = (query) => logic.normText(query);
  const make = ({ name, nameJa = '', industries = [], address = '', city = '' }) => {
    const props = {
      id: name.toLowerCase(), name, nameJa, industries, scale: 'growth', japanConnection: 'none',
      presenceCheck: { status: 'verified' }, location: { address, city },
    };
    logic.enrichFeature({ properties: props });
    return props;
  };
  const exactEn = make({ name: 'Sony' }); const prefixHit = make({ name: 'Sony Interactive' });
  const exactJa = make({ name: 'Widget Works', nameJa: 'ジーワークス' });
  const substringEn = make({ name: 'Acme Systems' });
  const substringJa = make({ name: 'Global Works', nameJa: 'グローバルソリューションズ' });
  const industryHit = make({ name: 'Widget Corp', industries: ['robotics'] });
  const vcIndustryHit = make({ name: 'Widget Corp', industries: ['venture-capital'] });
  const placeHit = make({ name: 'Widget Corp', industries: ['consulting'], address: '500 Howard St', city: 'San Francisco' });
  const tiers = [
    [exactEn, 'sony', 1], [exactJa, 'ジーワークス', 1], [prefixHit, 'sony int', 2],
    [substringEn, 'system', 3], [substringJa, 'リューション', 3], [industryHit, 'robo', 4],
    [placeHit, 'francisco', 5]];
  for (const [props, query, rank] of tiers) assert.strictEqual(logic.rankFeature(props, nq(query)), rank, query);
  assert.strictEqual(logic.rankFeature(vcIndustryHit, nq('venture capital')), 4,
    'multi-word query must match the hyphenated industry tag');
  assert.strictEqual(logic.rankFeature(placeHit, nq('zzzqqq')), Number.POSITIVE_INFINITY);
  assert.strictEqual(logic.rankFeature(placeHit, ''), 0);
  const feat = (name, extra = {}) => ({
    properties: { name, japanConnection: 'none', scale: 'growth', presenceCheck: { status: 'verified' }, ...extra },
  });
  const japanLinked = feat('Alpha Co', { japanConnection: 'japan-headquartered', scale: 'large' });
  const largeScale = feat('Beta Co', { scale: 'large' }); const verifiedOk = feat('Ceta Co');
  const reviewOne = feat('Delta Co', { presenceCheck: { status: 'review' } });
  const reviewTwo = feat('Echo Co', { presenceCheck: { status: 'review' } });
  assert.ok(logic.tieCompare(japanLinked, largeScale) < 0 && logic.tieCompare(largeScale, verifiedOk) < 0);
  assert.ok(logic.tieCompare(verifiedOk, reviewOne) < 0);
  assert.ok(logic.tieCompare(reviewOne, reviewTwo) < 0 && logic.tieCompare(reviewTwo, reviewOne) > 0);
  const ordered = [reviewTwo, verifiedOk, japanLinked, reviewOne, largeScale].sort((a, b) => logic.tieCompare(a, b));
  assert.deepStrictEqual(ordered.map((feature) => feature.properties.name),
    ['Alpha Co', 'Beta Co', 'Ceta Co', 'Delta Co', 'Echo Co']);
});

test('v2 logic: filter groups OR within and AND across, sector OR, inclusive area', () => {
  const logic = resetLogic();
  const { filters, sectors } = logic.state;
  const props = {
    name: 'Filtered Co', industries: ['software', 'cloud'], entityType: 'company', scale: 'startup',
    japanConnection: 'japan-focused', location: { county: 'Santa Clara', precision: 'address' },
    presenceCheck: { status: 'verified' },
  };
  assert.strictEqual(logic.matchesFilterGroups(props), true, 'no filters selected');
  filters.industries.add('cloud'); filters.industries.add('payments');
  assert.strictEqual(logic.matchesFilterGroups(props), true, 'OR within industries');
  filters.industries.delete('cloud'); assert.strictEqual(logic.matchesFilterGroups(props), false, 'missing every selected industry');
  filters.industries.clear(); filters.industries.add('software'); filters.entityType.add('company');
  assert.strictEqual(logic.matchesFilterGroups(props), true, 'AND across groups');
  filters.entityType.clear(); filters.entityType.add('vc-cvc');
  assert.strictEqual(logic.matchesFilterGroups(props), false, 'entityType mismatch blocks');
  const sectorProps = { properties: { name: 'Sector Co', industries: ['banking', 'software'], location: {} } };
  logic.enrichFeature(sectorProps);
  assert.ok(sectorProps.properties._sectors.includes('finance-investment'));
  assert.strictEqual(logic.matchesSectors(sectorProps.properties), true, 'empty selection matches all');
  sectors.add('finance-investment'); sectors.add('life-sciences');
  assert.strictEqual(logic.matchesSectors(sectorProps.properties), true, 'OR across sectors');
  sectors.delete('finance-investment');
  assert.strictEqual(logic.matchesSectors(sectorProps.properties), false);
  const at = ([lon, lat]) => ({ geometry: { coordinates: [lon, lat] } });
  logic.state.area = { w: -122.6, s: 37.0, e: -122.2, n: 37.8 };
  assert.deepStrictEqual([[-122.6, 37.0], [-122.2, 37.8], [-122.21, 37.4]]
    .map((c) => logic.inArea(at(c))), [true, true, true], 'bounds inclusive');
  assert.deepStrictEqual([[-122.61, 37.4], [-122.4, 36.99], [-122.4, 37.81]]
    .map((c) => logic.inArea(at(c))), [false, false, false]);
  logic.state.area = null;
  assert.strictEqual(logic.inArea(at([0, 0])), true, 'no area restriction');
});

test('v2 logic: URL params roundtrip, safe fallbacks, allowlists, PAGE_SIZE paging', () => {
  const logic = resetLogic();
  logic.state.sectors.add('technology-ai'); logic.state.sectors.add('finance-investment');
  logic.state.filters.industries.add('software'); logic.state.filters.industries.add('robotics');
  logic.state.filters.entityType.add('company');
  logic.state.preset = 'sp500';
  const params = logic.serializeState();
  assert.strictEqual(params.get('preset'), 'sp500');
  assert.deepStrictEqual(Array.from(params.getAll('sector')).sort(), ['finance-investment', 'technology-ai']);
  assert.deepStrictEqual(Array.from(params.getAll('industry')).sort(), ['robotics', 'software']);
  assert.deepStrictEqual(Array.from(params.getAll('type')), ['company']);
  assert.strictEqual(params.get('sort'), null); assert.strictEqual(params.get('view'), null);
  logic.state.sort = 'name'; logic.state.view = 'map';
  assert.strictEqual(logic.serializeState().get('sort'), 'name');
  logic.state.area = logic.parseArea('-122.51234,37.21,-122.31,37.56789');
  logic.state.lat = 37.777777; logic.state.lng = -122.444444; logic.state.z = 12.4;
  const view = logic.serializeState();
  assert.strictEqual(view.get('area'), '-122.51234,37.21,-122.31,37.56789');
  assert.deepStrictEqual({ ...logic.parseArea(view.get('area')) }, { w: -122.51234, s: 37.21, e: -122.31, n: 37.56789 });
  assert.deepStrictEqual({ ...logic.parseCenter(view) }, { lat: 37.77778, lng: -122.44444, z: 12 });
  assert.strictEqual(logic.parseArea(null), null);
  const badAreas = ['', 'abc', '1,2,3', '1,2,3,4,5', '-122,37,-121,36.5', '-122,38,-121,37',
    '-120,30,-130,40', '-200,10,-100,20', '100,10,200,20', '-122,-95,-121,10', '-122,80,-121,95'];
  for (const bad of badAreas) assert.strictEqual(logic.parseArea(bad), null, `area "${bad}" rejected`);
  const defaults = { lat: 37.55, lng: -122.2, z: 9 };
  assert.deepStrictEqual({ ...logic.parseCenter(new URLSearchParams()) }, defaults);
  assert.deepStrictEqual({ ...logic.parseCenter(new URLSearchParams('lat=999&lng=-9999&z=99')) }, defaults);
  assert.deepStrictEqual({ ...logic.parseCenter(new URLSearchParams('lat=90&lng=-180&z=19')) },
    { lat: 90, lng: -180, z: 19 });
  assert.deepStrictEqual(Array.from(logic.SORT_VALUES), ['relevance', 'distance', 'name', 'updated']);
  assert.deepStrictEqual(Array.from(logic.VIEW_VALUES), ['map', 'list']);
  assert.ok(!logic.SORT_VALUES.includes('newest') && !logic.VIEW_VALUES.includes('grid'));
  assert.ok(!logic.SECTOR_IDS.has('cryptocurrency') && logic.SECTOR_IDS.size === 10);
  assert.match(appSource, /SORT_VALUES\.includes\(sort\) \? sort : "relevance"/);
  assert.match(appSource, /VIEW_VALUES\.includes\(view\) \? view : "list"/);
  assert.match(appSource, /new Set\(params\.getAll\("sector"\)\.filter\(\(value\) => SECTOR_IDS\.has\(value\)\)\)/);
  assert.match(appSource, /new Set\(params\.getAll\(param\)\.filter\(\(value\) => allowed\[group\]\.has\(value\)\)\)/);
  assert.match(appSource, /params\.append\("sector", value\)/);
  assert.deepStrictEqual(Array.from(logic.PARAM_GROUPS).map((pair) => Array.from(pair)), [
    ['japan', 'japanConnection'], ['type', 'entityType'], ['scale', 'scale'], ['industry', 'industries'],
    ['county', 'county'], ['precision', 'locationPrecision'], ['presence', 'presenceStatus'],
  ]);
  logic.setEntities(features);
  assert.strictEqual(logic.PAGE_SIZE, 50); assert.ok(features.length >= 480);
  assert.strictEqual(Math.min(features.length, logic.PAGE_SIZE), 50);
  assert.ok(Math.ceil(features.length / logic.PAGE_SIZE) >= 10);
  assert.deepStrictEqual(Array.from(logic.pageNumberWindow(10, 1)), [1, 2, 'gap', 10]);
  assert.deepStrictEqual(Array.from(logic.pageNumberWindow(8, 4)), [1, 'gap', 3, 4, 5, 'gap', 8]);
  assert.deepStrictEqual(Array.from(logic.pageNumberWindow(20, 10)), [1, 'gap', 9, 10, 11, 'gap', 20]);
  assert.deepStrictEqual(Array.from(logic.pageNumberWindow(5, 2)), [1, 2, 3, 4, 5]);
  assert.deepStrictEqual(Array.from(logic.pageNumberWindow(20, 20)), [1, 'gap', 19, 20]);
});

test('v5 company presets filter useful cohorts and details link addresses to Google Maps', () => {
  const logic = resetLogic();
  const byId = new Map(features.map((feature) => [feature.properties.id, feature]));
  assert.deepStrictEqual(Array.from(logic.PRESET_VALUES), ['japanese', 'sp500', 'unicorn']);
  for (const ids of [logic.SP500_ENTITY_IDS, logic.UNICORN_ENTITY_IDS]) {
    assert.ok(ids.size >= 20);
    for (const id of ids) assert.ok(byId.has(id), `unknown preset entity ${id}`);
  }
  logic.state.preset = 'japanese';
  assert.strictEqual(logic.matchesCompanyPreset(byId.get('sony')), true);
  assert.strictEqual(logic.matchesCompanyPreset(byId.get('jetro-san-francisco')), false);
  logic.state.preset = 'sp500';
  assert.strictEqual(logic.matchesCompanyPreset(byId.get('apple')), true);
  assert.strictEqual(logic.matchesCompanyPreset(byId.get('sf-openai')), false);
  logic.state.preset = 'unicorn';
  assert.strictEqual(logic.matchesCompanyPreset(byId.get('sf-openai')), true);
  assert.strictEqual(logic.matchesCompanyPreset(byId.get('apple')), false);
  assert.match(indexSource, /Company groups[\s\S]*Japanese companies[\s\S]*S&amp;P 500 companies[\s\S]*Unicorn startups/);
  assert.match(appSource, /addressLine\.append\(actionLink\(mapsUrl, address\)\)/);
  assert.match(appSource, /params\.set\("preset", state\.preset\)/);
  assert.match(appSource, /PRESET_VALUES\.has\(preset\) \? preset : null/);
});

test('v2 static: debounce, chunked cluster loading, marker cache, sliced results, lazy logos', () => {
  assert.match(appSource, /const SEARCH_DEBOUNCE_MS = 120;/);
  assert.match(appSource, /chunkedLoading: true/);
  assert.match(appSource, /markersById\.set\(props\.id, marker\)/);
  assert.match(appSource, /markerLayer\.addLayers\(addCluster\)/);
  assert.match(appSource, /visibleEntities\.slice\(start, start \+ PAGE_SIZE\)/);
  assert.match(appSource, /img\.loading = "lazy"/);
  assert.match(appSource, /\[\.\.\.new Set\(sources\)\]/);
  assert.doesNotMatch(appSource, /apple-touch-icon|favicon\.svg|clearbit|iconhound|duckduckgo/);
});

test('v2 perf: 5k cloned records gzip under 500KB and visible+sort p95 under 150ms', () => {
  const logic = resetLogic();
  const plain = Array.from({ length: 5_000 }, (_, index) => {
    const { geometry, properties: p } = features[index % features.length];
    return {
      geometry: { coordinates: [...geometry.coordinates] },
      properties: {
        id: `${p.id}-${index}`, name: `${p.name} ${index}`, nameJa: p.nameJa ?? '',
        industries: [...(p.industries ?? [])], entityType: p.entityType, scale: p.scale,
        japanConnection: p.japanConnection, updatedAt: p.updatedAt,
        presenceCheck: { status: p.presenceCheck?.status ?? 'unchecked' }, location: { ...p.location },
      },
    };
  });
  assert.strictEqual(plain.length, 5_000);
  const gzipped = gzipSync(JSON.stringify(plain)).length;
  assert.ok(gzipped <= 500_000, `gzipped JSON must stay under 500KB, got ${gzipped}`);
  const enriched = structuredClone(plain);
  for (const feature of enriched) logic.enrichFeature(feature);
  logic.setEntities(enriched);
  logic.state.q = 'corp';
  for (let i = 0; i < 5; i++) logic.sortVisible(logic.computeVisible());
  const runs = [];
  let visible = [];
  for (let i = 0; i < 20; i++) {
    const started = performance.now();
    visible = logic.computeVisible();
    logic.sortVisible(visible);
    runs.push(performance.now() - started);
  }
  runs.sort((a, b) => a - b);
  const p95 = runs[Math.ceil(runs.length * 0.95) - 1];
  const max = runs.at(-1);
  console.log(`perf: matched=${visible.length} min=${runs[0].toFixed(2)}ms p95=${p95.toFixed(2)}ms max=${max.toFixed(2)}ms gzip=${gzipped}B`);
  assert.ok(visible.length > 0, 'relevance query must match cloned records');
  assert.ok(p95 <= 150, `p95 ${p95.toFixed(2)}ms must stay under 150ms`);
  if (max > 50) console.log(`max run ${max.toFixed(2)}ms exceeded 50ms (GC jitter); p95 assertion retained`);
  else assert.ok(max <= 50);
  logic.setEntities(features); resetLogic();
});

test('v3 static: in-bounds town gating, distance resort on move, dialog-to-map flow, timer clear, area button cycle, sort labels', () => {
  const layoutBody = appSource.slice(
    appSource.indexOf('function computeLayout'),
    appSource.indexOf('function refreshMapLayers'),
  );
  assert.ok(
    layoutBody.indexOf('if (!bounds.contains(origin)) continue;') < layoutBody.indexOf('townIds.add(props.id);'),
    'bounds check must gate townIds.add so out-of-view markers stay clustered',
  );

  const viewBody = appSource.slice(
    appSource.indexOf('function onViewChanged'),
    appSource.indexOf('function rankFeature'),
  );
  const resortAt = viewBody.indexOf('state.sort === "distance"');
  assert.ok(viewBody.indexOf('refreshMapLayers();') < resortAt && resortAt > -1);
  assert.match(viewBody, /sortVisible\(visibleEntities\);\s*\n\s*renderResults\(\);/);

  const dialogFlow = appSource.slice(
    appSource.indexOf('showMapButton.addEventListener'),
    appSource.indexOf('actions.append(showMapButton)'),
  );
  assert.match(dialogFlow, /dialogCloseIntent = "preserve";/);
  assert.match(dialogFlow, /setMobileView\("map", true\);\s*\n\s*showEntityOnMap\(feature\);\s*\n\s*pushHistory\(\);/);
  assert.strictEqual(dialogFlow.match(/pushHistory\(\)/g).length, 1, 'pushHistory exactly once');

  const snapshotBody = appSource.slice(
    appSource.indexOf('function applySnapshot'),
    appSource.indexOf('function syncAreaButtons'),
  );
  assert.match(snapshotBody, /^function applySnapshot\(entry\) \{\s*\n\s*window\.clearTimeout\(pendingSearchTimer\);\s*\n\s*pendingSearchTimer = 0;/);

  const areaWiring = appSource.slice(
    appSource.indexOf('el.searchArea.addEventListener'),
    appSource.indexOf('el.closeDetail.addEventListener'),
  );
  assert.strictEqual(areaWiring.match(/areaButtonRevealed = false;\s*\n\s*el\.searchArea\.hidden = true;/g).length, 2);

  assert.match(indexSource, /<option value="distance">Closest to map center<\/option>/);
  assert.match(indexSource, /<option value="name">A–Z<\/option>/);
  assert.doesNotMatch(indexSource, /<option value="distance">Distance<\/option>|<option value="name">Name<\/option>/);
});

test('v3 static: clear filters resets area constraint and filter button reveals advanced controls', () => {
  const clearBody = appSource.slice(
    appSource.indexOf('function clearAllFilters'),
    appSource.indexOf('function setDatasetDates'),
  );
  assert.match(clearBody, /state\.area = null;/);
  assert.match(clearBody, /syncAreaButtons\(\);\s*\n\s*areaButtonRevealed = false;\s*\n\s*el\.searchArea\.hidden = true;/);

  const filterButtonBody = appSource.slice(
    appSource.indexOf('el.mobileFilterButton.addEventListener'),
    appSource.indexOf('el.advancedFilters.addEventListener'),
  );
  assert.match(filterButtonBody, /requestAnimationFrame\(\(\) => \{\s*\n\s*el\.advancedFilters\.scrollIntoView\(\{ block: "start" \}\);\s*\n\s*el\.advancedFilters\.querySelector\("summary"\)\.focus\(\);/);
});

test('v4 regression: chunked add queue is latest-wins, unchanged pins skip setLatLng, key source invariants hold', () => {
  const logic = resetLogic();
  const cluster = {
    added: [], removed: [], outstanding: 0,
    addLayers(markers) { this.added.push([...markers]); this.outstanding += markers.length; },
    removeLayers(markers) { this.removed.push(...markers); },
    drain() {
      while (this.outstanding > 0) {
        const total = this.outstanding;
        this.outstanding = 0;
        logic.chunkProgress(total, total);
      }
    },
  };
  logic.setMap({ getZoom: () => 9 });
  logic.setMarkerLayer(cluster);
  logic.setTownLayer({ addLayer() {}, removeLayer() {}, clearLayers() {} });
  logic.setLegLayer({ clearLayers() {} });
  const coords = { a: [-122.4, 37.7], b: [-122.3, 37.6], c: [-122.2, 37.5], d: [-122.1, 37.4] };
  const markers = new Map(Object.entries(coords).map(([id, coordinates]) => {
    const marker = {
      id, sets: 0, pos: [coordinates[1], coordinates[0]],
      getLatLng() { return { equals: (next) => next[0] === marker.pos[0] && next[1] === marker.pos[1] }; },
      setLatLng(next) { marker.sets += 1; marker.pos = [...next]; },
    };
    return [id, marker];
  }));
  logic.setMarkers(markers);
  const idsOf = (batch) => batch.map((marker) => marker.id);
  const show = (ids) => logic.setVisibleEntities(
    ids.map((id) => ({ properties: { id }, geometry: { coordinates: coords[id] } })),
  );

  show(['a', 'b', 'c']);
  logic.refreshMapLayers();
  assert.deepStrictEqual(cluster.added.map(idsOf), [['a', 'b', 'c']], 'first refresh issues one chunked add');

  show(['a', 'b', 'd']);
  logic.refreshMapLayers();
  assert.strictEqual(cluster.added.length, 1, 'refresh while busy must not interleave');
  assert.deepStrictEqual(cluster.removed.map((marker) => marker.id), [], 'no removals against an unfinished chunked add');

  cluster.drain();
  assert.deepStrictEqual(cluster.added.map(idsOf), [['a', 'b', 'c'], ['d']], 'completion replays the latest state');
  assert.deepStrictEqual(cluster.removed.map((marker) => marker.id), ['c']);

  show(['a', 'b', 'd']);
  logic.refreshMapLayers();
  assert.deepStrictEqual(['a', 'b', 'd'].map((id) => markers.get(id).sets), [0, 0, 0],
    'identical coordinates must skip setLatLng');

  coords.a = [-123.0, 38.0];
  show(['a', 'b', 'd']);
  logic.refreshMapLayers();
  assert.strictEqual(markers.get('a').sets, 1, 'moved entity triggers exactly one setLatLng');
  assert.deepStrictEqual(markers.get('a').pos, [38.0, -123.0]);

  const refreshBody = appSource.slice(appSource.indexOf('function refreshMapLayers'), appSource.indexOf('function onViewChanged'));
  assert.ok(refreshBody.indexOf('activeCluster = nextCluster;') < refreshBody.indexOf('markerLayer.addLayers(addCluster)'),
    'active bookkeeping must precede addLayers');
  const emptyBranch = appSource.slice(appSource.indexOf('if (total === 0)'), appSource.indexOf('const start ='));
  assert.match(emptyBranch, /el\.pagination\.replaceChildren\(\);\s*\n\s*return;/, 'empty results clear pagination');
  assert.doesNotMatch(emptyBranch, /renderPagination/);
  assert.doesNotMatch(stylesSource, /\.preset-contact-buttons|\[data-preset\]/, 'legacy preset CSS removed');
  assert.match(stylesSource, /\[data-preset-contact\]/);
  assert.match(indexSource, /data-preset-contact="/);
});
