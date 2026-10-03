import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const source = readFileSync(new URL("../app.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

// A small DOM stand-in exercises the real startup/list flows without a browser dependency.
function app({ storage = "{}", failStorage = false, query = "" } = {}) {
  const nodes = [];
  class Element {
    constructor(tag = "div") {
      this.tagName = tag; this.children = []; this.events = {}; this.attributes = {};
      this.dataset = {}; this.value = ""; this.hidden = false; this.open = false;
      this.className = ""; this._text = ""; nodes.push(this);
      this.classList = {
        add: (...names) => { this.className = [...new Set([...this.className.split(" "), ...names])].join(" ").trim(); },
        remove: (name) => { this.className = this.className.split(" ").filter((item) => item !== name).join(" "); },
        toggle: (name, enabled) => enabled ? this.classList.add(name) : this.classList.remove(name),
      };
    }
    get textContent() { return this._text + this.children.map((node) => node.textContent || "").join(""); }
    set textContent(text) { this._text = String(text); this.children = []; }
    append(...children) { this.children.push(...children); for (const child of children) child.parent = this; }
    replaceChildren(...children) { this._text = ""; this.children = []; this.append(...children); }
    setAttribute(name, value) { this.attributes[name] = String(value); }
    removeAttribute(name) { delete this.attributes[name]; }
    addEventListener(name, callback) { (this.events[name] ||= []).push(callback); }
    fire(name, event = {}) { for (const fn of this.events[name] || []) fn({ target: this, stopPropagation() {}, ...event }); }
    click() { this.fire("click"); }
    focus() { document.activeElement = this; }
    showModal() { this.open = true; }
    close() { this.open = false; this.fire("close"); }
    scrollIntoView() {}
    querySelectorAll(selector) {
      return this.children.flatMap((node) => [node, ...node.querySelectorAll(selector)])
        .filter((node) => selector === ".result-card" && node.className.split(" ").includes("result-card"));
    }
  }
  for (const match of html.matchAll(/id="([^"]+)"/g)) { const node = new Element(); node.id = match[1]; }
  let startup;
  const document = {
    body: new Element("body"), activeElement: null,
    getElementById: (id) => nodes.findLast((node) => node.id === id),
    createElement: (tag) => new Element(tag),
    createTextNode: (text) => { const node = new Element("text"); node.textContent = text; return node; },
    addEventListener: (name, fn) => { if (name === "DOMContentLoaded") startup = fn; },
    querySelectorAll: () => [], contains: () => true,
  };
  let stored = storage;
  const geo = {
    type: "FeatureCollection", metadata: { updatedAt: "2026-10-03" }, features: [
      feature("near", "Near, Inc.", "San Mateo", [-122.3255, 37.563]),
      feature("far", "Distant Company", "San Francisco", [-122.42, 37.78], "review"),
    ],
  };
  const sandbox = {
    document, HTMLElement: Element, URL, URLSearchParams, AbortSignal,
    localStorage: { getItem: () => stored, setItem: (key, value) => { if (failStorage) throw new Error("quota"); stored = value; } },
    window: { setTimeout, clearTimeout, addEventListener() {} }, requestAnimationFrame: (fn) => fn(),
    location: { pathname: "/", search: query, href: `https://example.test/${query}` },
    history: { state: null, pushState() {}, replaceState() {} }, navigator: {},
    fetch: async () => ({ ok: true, json: async () => structuredClone(geo) }),
  };
  runInNewContext(source + "\n;globalThis.logic = { state, personal, computeVisible, buildCsv, csvCell, readPersonalData, enrichFeature, rankFeature, clearAllFilters, serializeState, populateDetail, loadEntities, actionLink, refreshCityMarkers, setCityLayer(value) { cityMarkerLayer = value; }, setVisible(value) { visibleEntities = value; } };", sandbox);
  return { document, sandbox, logic: sandbox.logic, startup, stored: () => stored };
}

function feature(id, name, city, coordinates, status = "verified") {
  return { geometry: { type: "Point", coordinates }, properties: {
    id, name, nameJa: name, website: "https://example.test/", description: "Robotic orchard harvesting",
    entityType: "company", scale: "startup", japanConnection: "none", industries: ["robotics"],
    updatedAt: "2026-10-03", profileSourceUrl: "https://example.test/company",
    location: { city, county: city + " County", precision: "city", status: "unchecked", checkedAt: null },
    presenceCheck: { status, checkedAt: "2026-10-03", sourceUrl: "https://example.test/company" },
    websiteCheck: { status: "unchecked", checkedAt: null },
  } };
}

test("startup keeps the list usable when the map CDN is unavailable; notebook, notes and filters work", async () => {
  const ui = app(); ui.startup();
  // Await the startup fetch/json microtasks.
  await new Promise((resolve) => setImmediate(resolve));
  const $ = (id) => ui.document.getElementById(id);
  assert.equal($("visible-count").textContent, "2");
  assert.match($("app-status").textContent, /Map unavailable/);
  assert.equal($("fit-results").disabled, true);
  const near = ui.logic.computeVisible()[0];
  ui.logic.populateDetail(near);
  const notebook = $("detail-content").children.find((node) => node.className === "company-notebook");
  notebook.children[0].click();
  assert.match($("app-status").textContent, /Map unavailable/);
  assert.equal($("saved-count").textContent, "1");
  $("company-note").value = "Ask about a visit"; $("company-note").fire("input");
  assert.equal(JSON.parse(ui.stored()).notes.near, "Ask about a visit");
  $("saved-only").click();
  assert.equal($("visible-count").textContent, "1");
  assert.equal(ui.logic.serializeState().get("saved"), "1");
  ui.logic.clearAllFilters();
  $("radius").value = "10"; $("radius").fire("change");
  assert.equal($("visible-count").textContent, "1");
  assert.equal(ui.logic.computeVisible()[0].properties.id, "near");
  ui.logic.clearAllFilters();
  $("city").value = "San Francisco"; $("city").fire("change");
  assert.equal(ui.logic.computeVisible()[0].properties.id, "far");
  $("verified-only").click();
  assert.equal($("visible-count").textContent, "0");
  assert.equal($("export-csv").disabled, true);
  ui.logic.clearAllFilters();
  assert.equal($("visible-count").textContent, "2");
});

test("shared city/radius filters roundtrip; descriptions are searchable", async () => {
  const ui = app({ query: "?city=San%20Mateo&radius=25&expand=1" }); ui.startup();
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(ui.logic.state.city, "San Mateo");
  assert.equal(ui.logic.state.radius, 25);
  assert.equal(ui.logic.state.expandOffices, true);
  assert.match(ui.document.getElementById("expand-offices").textContent, /expanded/);
  const params = ui.logic.serializeState();
  assert.equal(params.get("city"), "San Mateo"); assert.equal(params.get("radius"), "25");
  const near = ui.logic.computeVisible()[0];
  assert.equal(ui.logic.rankFeature(near.properties, "orchard"), 6);
  const invalid = app({ query: "?city=Unknown&radius=-10" }); invalid.startup();
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(invalid.logic.state.city, ""); assert.equal(invalid.logic.state.radius, null);
});

test("notebook validates browser storage and visibly handles quota errors", async () => {
  for (const storage of ["broken JSON", "null", '{"saved":12,"notes":42}']) {
    const ui = app({ storage });
    assert.equal(ui.logic.personal.saved.size, 0); assert.equal(Object.keys(ui.logic.personal.notes).length, 0);
  }
  const ui = app({ failStorage: true }); ui.startup();
  await new Promise((resolve) => setImmediate(resolve));
  ui.logic.populateDetail(ui.logic.computeVisible()[0]);
  ui.document.getElementById("company-note").value = "Keep this";
  ui.document.getElementById("company-note").fire("input");
  assert.match(ui.document.getElementById("app-status").textContent, /storage is unavailable/);
});

test("CSV preserves quoted/multiline notes, includes evidence, and neutralizes spreadsheet formulas", () => {
  const ui = app();
  ui.logic.personal.notes.near = 'A "quote"\nsecond line';
  ui.logic.personal.saved.add("near");
  const csv = ui.logic.buildCsv([feature("near", "=CMD()", "San Mateo", [-122.3255, 37.563])]);
  assert.ok(csv.startsWith("\uFEFF"));
  assert.match(csv, /"'=CMD\(\)"/);
  assert.match(csv, /A ""quote""\nsecond line/);
  assert.match(csv, /Presence source/);
  assert.match(csv, /"yes"/);
  for (const value of ["+1", "-1", "@SUM(1)", "\t=1"]) assert.ok(ui.logic.csvCell(value).startsWith('"\''));
});

test("city locations never produce a directions link and unsafe source schemes are inert", () => {
  const ui = app(); ui.startup();
  ui.logic.populateDetail(feature("city", "City Company", "San Mateo", [-122.3255, 37.563]));
  const actions = ui.document.getElementById("detail-content").children.find((node) => node.className === "detail-actions");
  assert.ok(!actions.children.some((node) => node.textContent === "Get directions"));
  const exact = feature("street", "Street Company", "San Mateo", [-122.3255, 37.563]);
  exact.properties.location.precision = "address"; exact.properties.location.address = "123 Main St";
  ui.logic.populateDetail(exact);
  const preciseActions = ui.document.getElementById("detail-content").children.find((node) => node.className === "detail-actions");
  assert.ok(preciseActions.children.some((node) => node.textContent === "Get directions"));
  assert.equal(ui.logic.actionLink("javascript:alert(1)", "Source").tagName, "span");
  assert.equal(ui.logic.actionLink("https://example.test/", "Source").tagName, "a");
});

test("city centroids produce one clearly approximate aggregate, never individual street pins", () => {
  const ui = app();
  const layer = { items: [], clearLayers() { this.items = []; } };
  ui.sandbox.L = {
    divIcon: (icon) => icon,
    marker: (position, options) => ({
      position, options, events: {}, bindTooltip(text) { this.tooltip = text.textContent; },
      on(name, fn) { this.events[name] = fn; }, addTo(target) { target.items.push(this); },
    }),
  };
  ui.logic.setCityLayer(layer);
  const first = feature("one", "One", "San Mateo", [-122.3255, 37.563]);
  const second = feature("two", "Two", "San Mateo", [-122.3255, 37.563]);
  const street = feature("three", "Three", "San Mateo", [-122.3255, 37.563]);
  street.properties.location.precision = "address";
  ui.logic.setVisible([first, second, street]); ui.logic.refreshCityMarkers();
  assert.equal(layer.items.length, 1);
  assert.match(layer.items[0].options.icon.className, /city-cluster/);
  assert.equal(layer.items[0].options.icon.html, "<span>2</span>");
  assert.equal(layer.items[0].options.pane, "city-centroids");
  assert.match(layer.items[0].tooltip, /approximate city locations/);
});

test("current-office user evidence is clearly distinguished from official web verification", () => {
  const ui = app(); ui.startup();
  const current = feature("ihi-rakunest", "IHI", "San Mateo", [-122.300177371754, 37.555182590093]);
  current.properties.presenceCheck = {
    status: "verified", sourceUrl: null, sourceType: "user-confirmed", checkedAt: "2026-10-03",
    userStatementDate: "2026-10-03", userStatement: "IHI now has a private office inside RakuNest.",
    supportingSourceUrl: "https://www.rakunest.com/contact",
  };
  ui.logic.populateDetail(current);
  assert.match(ui.document.getElementById("detail-content").textContent, /Current office confirmed by user/);
  assert.match(ui.document.getElementById("detail-content").textContent, /IHI now has a private office inside RakuNest/);
  assert.match(ui.document.getElementById("detail-content").textContent, /Supporting facility source/);
});
