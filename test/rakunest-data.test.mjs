import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const geo = JSON.parse(readFileSync(new URL('../data/entities.geojson', import.meta.url), 'utf8'));
const byId = new Map(geo.features.map(feature => [feature.properties.id, feature]));

test('RakuNest additions retain the exact publicly named subsidiary and independent office sources', () => {
  const names = {
    'morisawa-usa-rakunest': 'Morisawa USA Inc.',
    'nagashima-us-silicon-valley': 'Nagashima Ohno & Tsunematsu US LLP — Silicon Valley',
    'mori-hamada-us-san-mateo': 'Mori Hamada US LLP — San Mateo',
    'hitachi-solutions-america-san-mateo': 'Hitachi Solutions America, Ltd. — Bay Area',
    'revvo-technologies-rakunest': 'Revvo Technologies, Inc.',
    'nissan-chemical-america-open-innovation': 'Nissan Chemical America Corporation — Open Innovation Office',
  };
  for (const [id, name] of Object.entries(names)) {
    const feature = byId.get(id);
    assert.equal(feature.properties.name, name);
    assert.match(feature.properties.location.address, /^900 Concar Drive/);
    assert.deepEqual(feature.geometry.coordinates, byId.get('rakunest').geometry.coordinates);
    assert.equal(feature.properties.presenceCheck.status, 'verified');
    assert.notEqual(feature.properties.presenceCheck.sourceUrl, 'https://www.rakunest.com/clients',
      'new street entries need entity-specific evidence, not the mixed online-member logo list');
  }
  assert.equal(byId.get('hakuhodo-dy-irep').properties.name, 'Irep Inc.');
  assert.equal(byId.get('hakuhodo-dy-irep').properties.website, 'https://irep.inc/');
  assert.equal(byId.get('fujifilm-dimatix').properties.location.city, 'Santa Clara');
  assert.equal(byId.get('hitachi-america').properties.location.city, 'Santa Clara', 'Hitachi America is not Hitachi Solutions');
});

test('Nissan Chemical uses its explicitly published office address rather than its separate mailing address', () => {
  const feature = byId.get('nissan-chemical-america-open-innovation');
  assert.equal(feature.properties.location.precision, 'address');
  assert.equal(feature.properties.location.address, '900 Concar Drive, Suite 400');
  assert.equal(feature.properties.presenceCheck.status, 'verified');
  assert.equal(feature.properties.location.sourceUrl, 'https://nissanchem-usa.com/open-innovation-office/contact-open-innovation/');
  assert.match(feature.properties.dataQualityNote, /800 Concar.*mailing/i);
});
