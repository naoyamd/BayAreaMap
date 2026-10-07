import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const source = readFileSync(new URL("../app.js", import.meta.url), "utf8");
const geo = JSON.parse(readFileSync(new URL("../data/entities.geojson", import.meta.url), "utf8"));

function ownershipHarness(features) {
  const markers = new Map();
  const town = { members: new Set(), addTo() { return this; }, addLayer(m) { this.members.add(m); m.visible = true; }, removeLayer(m) { this.members.delete(m); m.visible = false; } };
  const lines = { count: 0, points: [], options: [], addTo() { return this; }, clearLayers() { this.count = 0; this.points = []; this.options = []; } };
  const city = { members: new Set(), addTo() { return this; }, clearLayers() { this.members.clear(); } };
  let logic;
  const map = {
    zoom: 13, inBounds: true,
    getZoom() { return this.zoom; },
    getBounds() { return { contains: () => this.inBounds }; },
    createPane: () => ({ style: {} }), on() {},
    setView(center, zoom) { this.zoom = zoom; logic.refreshMapLayers(); cluster.render(); },
    latLngToLayerPoint([lat, lng]) {
      const size = 256 * 2 ** this.zoom;
      const sin = Math.sin(lat * Math.PI / 180);
      return { x: size * (lng + 180) / 360, y: size * (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) };
    },
    layerPointToLatLng([x, y]) {
      const size = 256 * 2 ** this.zoom;
      return { lng: x / size * 360 - 180, lat: Math.atan(Math.sinh((0.5 - y / size) * 2 * Math.PI)) * 180 / Math.PI };
    },
  };
  const tuple = (value) => Array.isArray(value) ? [...value] : [value.lat, value.lng];
  const cluster = {
    members: new Set(), moveEvents: 0,
    addTo() { return this; },
    hasLayer(marker) { return this.members.has(marker); },
    addLayer(m) {
      this.members.add(m);
      // MarkerClusterGroup 1.5.3 _childMarkerMoved/_moveChild remove and re-add on move.
      m.clusterMove = (from, to) => {
        this.moveEvents++;
        m.pos = from; this.removeLayer(m);
        m.pos = to; this.addLayer(m);
      };
    },
    addLayers(batch) { batch.forEach(m => this.addLayer(m)); logic.chunkProgress(batch.length, batch.length); },
    removeLayer(m) { if (!this.members.has(m)) return; this.members.delete(m); delete m.clusterMove; m.visible = false; },
    // Unlike removeLayer, native v1.5.3 removeLayers leaves its move listeners attached.
    removeLayers(batch) { batch.forEach(m => { this.members.delete(m); m.visible = false; }); },
    render() { if (this.members.size > 1) this.members.forEach(m => { m.visible = false; }); },
  };
  for (const f of features) {
    const m = {
      id: f.properties.id, pos: [f.geometry.coordinates[1], f.geometry.coordinates[0]], visible: false,
      getLatLng() { return { equals: next => { const p = tuple(next); return p[0] === this.pos[0] && p[1] === this.pos[1]; } }; },
      setLatLng(next) { const old = [...this.pos]; this.pos = tuple(next); this.clusterMove?.(old, [...this.pos]); },
    };
    markers.set(m.id, m);
  }
  const layerGroups = [lines, town, city];
  const sandbox = { URLSearchParams, document: { addEventListener() {}, createTextNode: text => ({ textContent: text }) }, L: {
    map: () => map, tileLayer: () => ({ addTo() {} }),
    markerClusterGroup: options => { cluster.options = options; return cluster; },
    layerGroup: () => layerGroups.shift(), polyline: (points, options) => ({ addTo(group) { group.count++; group.points.push(points); group.options.push(options); } }),
    divIcon: options => options,
    marker: () => ({ events: {}, bindTooltip() {}, on(event, fn) { this.events[event] = fn; }, addTo(group) { group.members.add(this); } }),
  } };
  runInNewContext(source + "\n;globalThis.logic = { initMap, refreshMapLayers, focusEntity, state, chunkProgress: onClusterChunkProgress, setData(value, cache) { visibleEntities = value; markersById = cache; } };", sandbox);
  logic = sandbox.logic;
  logic.initMap([37.55, -122.3], 13);
  logic.setData(features, markers);
  const refresh = zoom => { map.zoom = zoom; logic.refreshMapLayers(); cluster.render(); };
  return { map, cluster, town, city, lines, markers, refresh, focus: logic.focusEntity, state: logic.state, setVisible: value => logic.setData(value, markers) };
}

const raku = geo.features.find(f => f.properties.id === "rakunest");
const rakuOffices = geo.features.filter(f => f.properties.location.precision === "address" &&
  f.geometry.coordinates.join() === raku.geometry.coordinates.join());

test("RakuNest's 12 pins leave native clustering before moving and never recluster on later zooms", () => {
  assert.equal(rakuOffices.length, 12);
  const h = ownershipHarness(rakuOffices);
  h.refresh(13);
  assert.equal(h.cluster.members.size, 12);
  for (const zoom of [14, 15, 16, 17, 19, 16, 15]) {
    h.refresh(zoom);
    assert.equal(h.cluster.members.size, 0, `no blue clusters among spokes at zoom ${zoom}`);
    assert.equal(h.town.members.size, 12);
    assert.equal([...h.markers.values()].filter(m => m.visible).length, 12, "every line has a visible pin");
    assert.equal(h.lines.count, 12);
    rakuOffices.forEach((feature, index) => assert.deepEqual(
      [h.lines.points[index][1].lat, h.lines.points[index][1].lng],
      h.markers.get(feature.properties.id).pos,
      "verified and review pins both stay at their connector endpoint"));
    assert.equal(h.cluster.moveEvents, 0, "display motion must not trigger native reclustering");
  }
  const points = [...h.markers.values()].map(m => h.map.latLngToLayerPoint(m.pos));
  for (let i = 0; i < points.length; i++) for (let j = i + 1; j < points.length; j++) {
    assert.ok(Math.abs(points[i].x - points[j].x) >= 42 || Math.abs(points[i].y - points[j].y) >= 42,
      "square logo pins must not overlap diagonally");
  }
  h.map.inBounds = false; h.refresh(16);
  assert.equal(h.town.members.size, 0); assert.equal(h.lines.count, 0);
  h.map.inBounds = true; h.refresh(16);
  assert.equal(h.cluster.members.size, 0); assert.equal(h.town.members.size, 12);
  h.refresh(13); assert.equal(h.cluster.members.size, 12);
  h.refresh(17); assert.equal(h.cluster.members.size, 0);
});

test("SF shared buildings retain visible pins rather than empty spokes across zoom transitions", () => {
  const groups = new Map();
  for (const f of geo.features.filter(f => f.properties.location.precision === "address" && f.properties.location.city === "San Francisco")) {
    const key = f.geometry.coordinates.join();
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(f);
  }
  const shared = [...groups.values()].find(group => group.length >= 3);
  assert.ok(shared);
  const h = ownershipHarness(shared);
  h.refresh(13);
  for (const zoom of [17, 18, 16, 19, 14, 17]) {
    h.refresh(zoom);
    assert.equal(h.cluster.members.size, 0);
    assert.equal([...h.markers.values()].filter(m => m.visible).length, shared.length);
    assert.equal(h.lines.count, shared.length);
  }
  assert.equal(h.cluster.options.animate, false, "native delayed animation cleanup cannot remove transferred pins");
});

test("San Jose's approximate count expands 21 selectable pins and collapses cleanly on zoom or filter changes", () => {
  const companies = geo.features.filter(f => f.properties.location.precision === "city" && f.properties.location.city === "San Jose");
  assert.equal(companies.length, 21);
  const original = JSON.stringify(companies);
  const h = ownershipHarness(companies);
  h.refresh(13);
  assert.equal(h.city.members.size, 1); assert.equal(h.town.members.size, 0);
  [...h.city.members][0].events.click();
  for (const zoom of [14, 16, 19, 15]) {
    h.refresh(zoom);
    assert.equal(h.city.members.size, 0); assert.equal(h.town.members.size, 21);
    assert.equal(h.cluster.members.size, 0, "city pins never enter exact-address clusters");
    assert.equal(h.lines.count, 21);
    assert.ok(h.lines.options.every(options => options.dashArray === "4 4"));
    companies.forEach((feature, index) => assert.deepEqual(
      [h.lines.points[index][1].lat, h.lines.points[index][1].lng], h.markers.get(feature.properties.id).pos));
  }
  h.refresh(13);
  assert.equal(h.city.members.size, 1); assert.equal(h.town.members.size, 0); assert.equal(h.lines.count, 0);
  assert.ok([...h.markers.values()].every(marker => marker._town === false), "collapsed pins reset their expansion state");
  h.focus(companies[0]);
  assert.equal(h.map.zoom, 14, "selecting a collapsed city company zooms back to its expanded icons");
  assert.equal(h.town.members.size, 21);
  h.refresh(13);
  h.state.expandOffices = true; h.refresh(11);
  assert.equal(h.city.members.size, 0); assert.equal(h.town.members.size, 21);
  h.setVisible(companies.slice(0, 2)); h.refresh(11);
  assert.equal(h.town.members.size, 2); assert.equal(h.lines.count, 2);
  assert.equal(h.markers.get(companies[2].properties.id)._town, false, "filtered-out pins do not retain stale expansion state");
  h.focus(companies[2]);
  assert.equal(h.map.zoom, 14, "a filtered-out selection does not focus a stale spiral position at wide zoom");
  assert.equal(h.town.members.size, 2, "focusing a hidden company preserves the current filter");
  h.setVisible(companies); h.refresh(11);
  assert.equal(h.town.members.size, 21);
  h.map.inBounds = false; h.refresh(11);
  assert.equal(h.town.members.size, 0); assert.equal(h.lines.count, 0);
  h.map.inBounds = true; h.refresh(11);
  assert.equal(h.town.members.size, 21);
  h.state.expandOffices = false; h.refresh(11);
  assert.equal(h.city.members.size, 1); assert.equal(h.town.members.size, 0);
  assert.equal(JSON.stringify(companies), original, "visual expansion never changes stored location precision or coordinates");
});
