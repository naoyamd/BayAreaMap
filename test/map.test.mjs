import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const source = readFileSync(new URL("../app.js", import.meta.url), "utf8");
const styles = readFileSync(new URL("../styles.css", import.meta.url), "utf8");

function mapLogic() {
  const legs = [];
  const layers = [];
  const panes = { markerPane: { style: { zIndex: 600 } } };
  const map = {
    zoom: 14,
    getZoom() { return this.zoom; },
    getBounds: () => ({ contains: ([lat]) => lat < 38 }),
    latLngToLayerPoint: ([lat, lng]) => ({ x: lng * 10000, y: lat * 10000 }),
    layerPointToLatLng: ([x, y]) => ({ lat: y / 10000, lng: x / 10000 }),
    createPane(name) { return panes[name] = { style: {} }; },
    on() {},
  };
  const group = () => ({ addTo() { layers.push(this); return this; }, clearLayers() { legs.length = 0; } });
  const sandbox = {
    URLSearchParams,
    document: { addEventListener() {} },
    L: {
      map: () => map, tileLayer: () => group(), markerClusterGroup: () => group(), layerGroup: group,
      polyline: (points) => ({ addTo() { legs.push(points); } }),
    },
  };
  runInNewContext(source + "\n;globalThis.logic = { initMap, computeLayout, state, serializeState, setVisible(value) { visibleEntities = value; } };", sandbox);
  sandbox.logic.initMap([37.55, -122.2], 9);
  return { ...sandbox.logic, map, panes, legs };
}

function point(id, city, coordinates = [-122.3, 37.55], precision = "address") {
  return { properties: { id, location: { city, precision } }, geometry: { coordinates } };
}

test("approximate city counts have a pane below every normal marker and cluster", () => {
  const logic = mapLogic();
  assert.ok(Number(logic.panes["city-centroids"].style.zIndex) < Number(logic.panes.markerPane.style.zIndex));
});

test("shared addresses expand from street zoom in every city and stay expanded through maximum zoom", () => {
  for (const city of ["San Francisco", "San Jose", "Santa Clara", "San Mateo"]) {
    const logic = mapLogic();
    const shared = [point("first", city), point("second", city)];
    logic.setVisible(shared);
    for (const zoom of [14, 15, 17, 18, 19]) {
      logic.map.zoom = zoom;
      const layout = logic.computeLayout();
      assert.equal(layout.townIds.size, 2, `${city} at zoom ${zoom}`);
      assert.notDeepEqual(layout.positions.get("first"), layout.positions.get("second"));
      assert.equal(logic.legs.length, 2);
      assert.deepEqual(shared[0].geometry.coordinates, [-122.3, 37.55], "display layout never changes stored coordinates");
    }
  }
});

test("manual expansion reveals shared offices at wider zooms without expanding centroids or isolated pins", () => {
  const logic = mapLogic();
  logic.map.zoom = 11;
  logic.setVisible([
    point("first", "San Mateo"), point("second", "San Mateo"),
    point("alone", "San Mateo", [-122.31, 37.56]),
    point("city", "San Mateo", [-122.3, 37.55], "city"),
    point("outside", "Santa Rosa", [-122.71, 38.44]),
  ]);
  assert.equal(logic.computeLayout().townIds.size, 0);
  logic.state.expandOffices = true;
  assert.deepEqual([...logic.computeLayout().townIds].sort(), ["first", "second"]);
  assert.equal(logic.serializeState().get("expand"), "1");
  logic.state.expandOffices = false;
  assert.equal(logic.computeLayout().townIds.size, 0);
  assert.equal(logic.serializeState().get("expand"), null);
});

test("shared offices use a circle below 9 pins and a spaced spiral from 9, with matching connector endpoints", () => {
  for (const count of [2, 8, 9, 12, 40]) {
    const logic = mapLogic();
    const features = Array.from({ length: count }, (_, index) => point(`office-${index}`, "San Mateo"));
    logic.setVisible(features);
    const layout = logic.computeLayout();
    const center = logic.map.latLngToLayerPoint([37.55, -122.3]);
    const points = features.map(f => {
      const position = layout.positions.get(f.properties.id);
      assert.deepEqual(logic.legs[Number(f.properties.id.split("-")[1])][1], position,
        "connector ends at the exact display position used by the marker");
      return logic.map.latLngToLayerPoint([position.lat, position.lng]);
    });
    const radii = points.map(p => Math.hypot(p.x - center.x, p.y - center.y));
    const spread = Math.max(...radii) - Math.min(...radii);
    assert.ok(count < 9 ? spread < 0.001 : spread > 20, `${count} pins choose the correct layout`);
    for (let i = 0; i < points.length; i++) for (let j = i + 1; j < points.length; j++) {
      assert.ok(Math.abs(points[i].x - points[j].x) >= 42 || Math.abs(points[i].y - points[j].y) >= 42,
        `${count} square logos must not overlap`);
    }
  }
});

test("review badges keep Leaflet's absolute marker positioning and use relative positioning only in cards", () => {
  const reviewRule = styles.match(/\.logo-pin\.presence-unverified\s*\{([^}]+)\}/)[1];
  assert.doesNotMatch(reviewRule, /position\s*:/, "map markers must inherit absolute positioning from Leaflet");
  assert.match(styles, /\.result-card\s+\.logo-pin\.presence-unverified\s*\{\s*position:\s*relative;/);
});
