"use strict";

const MAP_CENTER = [37.55, -122.2];
const MAP_ZOOM = 9;
const MAX_ZOOM = 19;
const ICON_SIZE = 42;
const TOWN_ZOOM = 14;
const DENSE_CLUSTER_CITIES = new Set(["San Francisco", "San Jose", "Santa Clara"]);

const ENTITY_TYPE_LABELS = {
  "vc-cvc": "VC / CVC",
  support: "Support organization",
  "university-research": "University / research",
  company: "Company",
};

const SCALE_LABELS = {
  large: "Large",
  growth: "Growth",
  startup: "Startup",
  "not-applicable": "Not applicable",
};

const JAPAN_CONNECTION_LABELS = {
  "japan-headquartered": "Japan-headquartered",
  "japanese-founded": "Japanese-founded",
  "japan-focused": "Japan-focused",
  none: "Other",
};

const CHECK_STATUS_LABELS = {
  unchecked: "Not checked",
  ok: "OK",
  review: "Review",
};

const LOCATION_PRECISION_LABELS = {
  address: "Street address",
  city: "City center (approx.)",
};

const LOCATION_STATUS_LABELS = {
  unchecked: "Not checked",
  matched: "Address and coordinates match",
  review: "Review",
};

const PRESENCE_STATUS_LABELS = {
  unchecked: "Not checked",
  verified: "Verified",
  review: "Review",
};

let map;
let markerLayer;
let townMarkerLayer;
let overlapLegLayer;
let entities = [];
let visibleEntities = [];
let townMode = false;
let maxZoomMode = false;
const markersById = new Map();

const filterState = {
  japanConnection: new Set(),
  entityType: new Set(),
  scale: new Set(),
  industries: new Set(),
  county: new Set(),
  locationPrecision: new Set(),
  presenceStatus: new Set(),
};

const FILTER_GROUPS = {
  japanConnection: "filter-japan",
  entityType: "filter-type",
  scale: "filter-scale",
  industries: "filter-industry",
  county: "filter-county",
  locationPrecision: "filter-location-precision",
  presenceStatus: "filter-presence",
};

function initMap() {
  map = L.map("map", { center: MAP_CENTER, zoom: MAP_ZOOM });
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: MAX_ZOOM,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  markerLayer = L.markerClusterGroup({
    showCoverageOnHover: false,
    maxClusterRadius: 55,
    spiderfyDistanceMultiplier: 1.5,
    iconCreateFunction(cluster) {
      return L.divIcon({
        className: "company-cluster",
        html: `<span>${cluster.getChildCount()}</span>`,
        iconSize: [44, 44],
      });
    },
  }).addTo(map);
  overlapLegLayer = L.layerGroup().addTo(map);
  townMarkerLayer = L.layerGroup().addTo(map);
  map.on("zoomend", () => {
    const nextTownMode = map.getZoom() >= TOWN_ZOOM;
    const nextMaxZoomMode = map.getZoom() === MAX_ZOOM;
    if (nextTownMode === townMode && nextMaxZoomMode === maxZoomMode) return;
    townMode = nextTownMode;
    maxZoomMode = nextMaxZoomMode;
    rebuildMarkers(visibleEntities);
  });
}

function latlngOf(feature) {
  const [lon, lat] = feature.geometry.coordinates;
  return [lat, lon];
}

function logoSources(props) {
  const sources = [];
  if (props.logoUrl) sources.push(props.logoUrl);
  try {
    if (!props.website) return sources;
    const website = new URL(props.website);
    sources.push(
      new URL("/apple-touch-icon.png", website).href,
      new URL("/favicon.svg", website).href,
      `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(website.origin)}&sz=128`,
      new URL("/favicon.ico", website).href,
    );
  } catch {
    return sources;
  }
  return [...new Set(sources)];
}

function initialsOf(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

function fallbackLogo(name) {
  const span = document.createElement("span");
  span.className = "logo-fallback";
  span.textContent = initialsOf(name);
  return span;
}

function fillLogo(container, props) {
  delete container.dataset.logoStatus;
  const sources = logoSources(props);
  if (!sources.length) {
    container.dataset.logoStatus = "fallback";
    container.replaceChildren(fallbackLogo(props.name));
    return;
  }
  const img = document.createElement("img");
  img.alt = "";
  img.decoding = "async";
  img.referrerPolicy = "no-referrer";
  let index = 0;
  img.addEventListener("load", () => {
    container.dataset.logoStatus = "loaded";
  });
  img.addEventListener("error", () => {
    index += 1;
    if (index < sources.length) img.src = sources[index];
    else {
      container.dataset.logoStatus = "fallback";
      container.replaceChildren(fallbackLogo(props.name));
    }
  });
  img.src = sources[index];
  container.replaceChildren(img);
}

function makeIcon(props) {
  const classes = ["logo-pin"];
  if (props.japanConnection && props.japanConnection !== "none") {
    classes.push("japan");
  }
  if (props.location.precision === "city") classes.push("approximate");
  if (props.presenceCheck.status !== "verified") classes.push("presence-unverified");
  return L.divIcon({
    className: classes.join(" "),
    iconSize: [ICON_SIZE, ICON_SIZE],
    html: "",
  });
}

function rebuildMarkers(features) {
  markerLayer.clearLayers();
  townMarkerLayer.clearLayers();
  overlapLegLayer.clearLayers();
  markersById.clear();
  const displayLatLngs = new Map(
    features.map((feature) => [feature.properties.id, latlngOf(feature)]),
  );

  if (townMode) {
    const groups = new Map();
    for (const feature of features) {
      if (DENSE_CLUSTER_CITIES.has(feature.properties.location.city) && !maxZoomMode) continue;
      const key = feature.geometry.coordinates.join(",");
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(feature);
    }
    for (const group of groups.values()) {
      if (group.length < 2) continue;
      const origin = latlngOf(group[0]);
      const center = map.latLngToLayerPoint(origin);
      const radius = Math.max(58, (group.length * (ICON_SIZE + 10)) / (2 * Math.PI));
      group.forEach((feature, index) => {
        const angle = (index * 2 * Math.PI) / group.length - Math.PI / 2;
        const display = map.layerPointToLatLng([
          center.x + Math.cos(angle) * radius,
          center.y + Math.sin(angle) * radius,
        ]);
        displayLatLngs.set(feature.properties.id, display);
        L.polyline([origin, display], {
          className: "overlap-leg",
          interactive: false,
          opacity: 0.55,
          weight: 1.5,
        }).addTo(overlapLegLayer);
      });
    }
  }

  for (const feature of features) {
    const props = feature.properties;
    const marker = L.marker(displayLatLngs.get(props.id), { icon: makeIcon(props) });
    const notes = [];
    if (props.location.precision === "city") notes.push("approximate location");
    if (props.presenceCheck.status !== "verified") notes.push("presence unverified");
    marker.bindTooltip(`${props.name}${notes.length ? ` (${notes.join(", ")})` : ""}`);
    marker.on("click", () => selectEntity(feature));
    marker.on("add", () => {
      const el = marker.getElement();
      fillLogo(el, props);
      el.setAttribute("aria-label", props.name);
    });
    const stayClustered = DENSE_CLUSTER_CITIES.has(props.location.city) && !maxZoomMode;
    marker.addTo(townMode && !stayClustered ? townMarkerLayer : markerLayer);
    markersById.set(props.id, marker);
  }
}

function matchesQuery(props, query) {
  const location = props.location;
  const haystack = [
    props.name,
    props.nameJa,
    location.address,
    location.city,
    location.county,
    ...(Array.isArray(props.industries) ? props.industries : []),
  ]
    .filter(Boolean)
    .join("\n")
    .toLowerCase();
  return haystack.includes(query);
}

function filterValue(props, group) {
  if (group === "county") return props.location.county;
  if (group === "locationPrecision") return props.location.precision;
  if (group === "presenceStatus") return props.presenceCheck.status;
  return props[group];
}

function matchesActiveGroups(props) {
  for (const [group, selected] of Object.entries(filterState)) {
    if (selected.size === 0) continue;
    if (group === "industries") {
      const list = Array.isArray(props.industries) ? props.industries : [];
      if (!list.some((industry) => selected.has(industry))) return false;
    } else if (!selected.has(filterValue(props, group))) {
      return false;
    }
  }
  return true;
}

function applyFilter(rawQuery) {
  const query = String(rawQuery || "").trim().toLowerCase();
  const filtered = entities.filter(
    (feature) =>
      (query === "" || matchesQuery(feature.properties, query)) &&
      matchesActiveGroups(feature.properties),
  );
  visibleEntities = filtered;
  rebuildMarkers(filtered);
  renderResults(filtered);
  document.getElementById("visible-count").textContent = String(filtered.length);
  return filtered;
}

function makeResultCard(feature) {
  const props = feature.properties;
  const card = document.createElement("div");
  card.className = "result-card";
  card.setAttribute("role", "button");
  card.tabIndex = 0;

  const logo = document.createElement("span");
  logo.className = "logo-pin";
  if (props.japanConnection && props.japanConnection !== "none") {
    logo.classList.add("japan");
  }
  if (props.location.precision === "city") logo.classList.add("approximate");
  if (props.presenceCheck.status !== "verified") logo.classList.add("presence-unverified");
  fillLogo(logo, props);

  const body = document.createElement("div");
  const heading = document.createElement("h3");
  heading.textContent = props.name;
  body.append(heading);
  if (props.nameJa) {
    const nameJaLine = document.createElement("p");
    nameJaLine.lang = "ja";
    nameJaLine.textContent = props.nameJa;
    body.append(nameJaLine);
  }
  const placeLine = document.createElement("p");
  placeLine.textContent = [props.location.city, props.location.county]
    .filter(Boolean)
    .join(" · ");
  const metaLine = document.createElement("p");
  metaLine.textContent = `${LOCATION_PRECISION_LABELS[props.location.precision]} · Presence: ${statusWithDate(PRESENCE_STATUS_LABELS[props.presenceCheck.status], props.presenceCheck.checkedAt)} · Updated: ${props.updatedAt}`;
  body.append(placeLine, metaLine);

  card.append(logo, body);
  card.addEventListener("click", () => selectEntity(feature));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectEntity(feature);
    }
  });
  return card;
}

function renderResults(features) {
  const results = document.getElementById("results");
  results.replaceChildren(...features.map(makeResultCard));
}

function showLoadingError() {
  document.getElementById("visible-count").textContent = "0";
  document.getElementById("dataset-date").textContent = "—";
  document.getElementById("presence-checked-date").textContent = "—";
  document.getElementById("location-checked-date").textContent = "—";
  document.getElementById("checked-date").textContent = "—";
  const results = document.getElementById("results");
  const message = document.createElement("p");
  message.textContent =
    "Could not load the company data. Check your connection and reload the page.";
  results.replaceChildren(message);
}

function filterValueLabel(group, value) {
  if (group === "entityType" && ENTITY_TYPE_LABELS[value]) {
    return ENTITY_TYPE_LABELS[value];
  }
  if (group === "scale" && SCALE_LABELS[value]) {
    return SCALE_LABELS[value];
  }
  if (group === "japanConnection" && JAPAN_CONNECTION_LABELS[value]) {
    return JAPAN_CONNECTION_LABELS[value];
  }
  if (group === "locationPrecision" && LOCATION_PRECISION_LABELS[value]) {
    return LOCATION_PRECISION_LABELS[value];
  }
  if (group === "presenceStatus" && PRESENCE_STATUS_LABELS[value]) {
    return PRESENCE_STATUS_LABELS[value];
  }
  return String(value).replace(/-/g, " ");
}

function buildFilterControls() {
  const valuesByGroup = {};
  for (const group of Object.keys(FILTER_GROUPS)) {
    const values = new Set();
    for (const feature of entities) {
      const raw = filterValue(feature.properties, group);
      if (Array.isArray(raw)) {
        for (const item of raw) if (item) values.add(item);
      } else if (raw) {
        values.add(raw);
      }
    }
    valuesByGroup[group] = [...values].sort();
  }
  for (const [group, fieldsetId] of Object.entries(FILTER_GROUPS)) {
    const fieldset = document.getElementById(fieldsetId);
    const labels = [];
    for (const value of valuesByGroup[group]) {
      const input = document.createElement("input");
      input.type = "checkbox";
      input.value = value;
      input.addEventListener("change", () => {
        if (input.checked) {
          filterState[group].add(value);
        } else {
          filterState[group].delete(value);
        }
        applyFilter(document.getElementById("search").value);
      });
      const label = document.createElement("label");
      label.append(input, textNode(filterValueLabel(group, value)));
      labels.push(label);
    }
    fieldset.append(...labels);
  }
}

function syncFilterCheckboxes() {
  const groupsByFieldsetId = {};
  for (const [group, fieldsetId] of Object.entries(FILTER_GROUPS)) {
    groupsByFieldsetId[fieldsetId] = group;
  }
  for (const input of document.querySelectorAll(
    "#filters input[type='checkbox']",
  )) {
    const fieldset = input.closest("fieldset");
    const group = fieldset ? groupsByFieldsetId[fieldset.id] : null;
    if (!group) continue;
    input.checked = filterState[group].has(input.value);
  }
}

function clearFilters(clearSearch = true) {
  for (const selected of Object.values(filterState)) {
    selected.clear();
  }
  for (const input of document.querySelectorAll(
    "#filters input[type='checkbox']",
  )) {
    input.checked = false;
  }
  const searchInput = document.getElementById("search");
  if (clearSearch) {
    searchInput.value = "";
  }
  for (const button of document.querySelectorAll("[data-preset]")) {
    button.setAttribute("aria-pressed", "false");
  }
  applyFilter(searchInput.value);
}

function applyPreset(preset) {
  clearFilters(false);
  const searchInput = document.getElementById("search");
  if (preset === "all") {
    searchInput.value = "";
  } else if (preset === "japan") {
    for (const feature of entities) {
      const value = feature.properties.japanConnection;
      if (value && value !== "none") {
        filterState.japanConnection.add(value);
      }
    }
  } else if (preset === "large") {
    filterState.scale.add("large");
  } else if (preset === "manufacturing") {
    const wanted = new Set([
      "manufacturing",
      "automotive",
      "electronics",
      "robotics",
      "semiconductors",
    ]);
    for (const feature of entities) {
      const list = Array.isArray(feature.properties.industries)
        ? feature.properties.industries
        : [];
      for (const industry of list) {
        if (wanted.has(industry)) {
          filterState.industries.add(industry);
        }
      }
    }
  } else if (preset === "verified") {
    filterState.presenceStatus.add("verified");
  } else if (preset === "startup") {
    filterState.scale.add("startup");
  } else if (preset === "vc-cvc") {
    filterState.entityType.add("vc-cvc");
  } else if (preset === "support") {
    filterState.entityType.add("support");
  } else {
    return;
  }
  syncFilterCheckboxes();
  const button = document.querySelector(`[data-preset="${preset}"]`);
  if (button) button.setAttribute("aria-pressed", "true");
  applyFilter(searchInput.value);
}

async function loadEntities() {
  try {
    const response = await fetch("./data/entities.geojson");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const geojson = await response.json();
    entities = Array.isArray(geojson.features) ? geojson.features : [];
    setDatasetDates(geojson);
    buildFilterControls();
    applyFilter(document.getElementById("search").value);
  } catch {
    showLoadingError();
  }
}

function setDatasetDates(geojson) {
  const maxOf = (read) =>
    geojson.features
      .map((feature) => read(feature.properties))
      .filter(Boolean)
      .sort()
      .at(-1) ?? "—";
  document.getElementById("dataset-date").textContent =
    geojson.metadata?.updatedAt ?? maxOf((props) => props.updatedAt);
  document.getElementById("presence-checked-date").textContent = maxOf(
    (props) => props.presenceCheck.checkedAt,
  );
  document.getElementById("location-checked-date").textContent = maxOf(
    (props) => props.location.checkedAt,
  );
  document.getElementById("checked-date").textContent = maxOf(
    (props) => props.websiteCheck.checkedAt,
  );
}

function detailRow(label, valueNode) {
  const row = document.createElement("div");
  const term = document.createElement("dt");
  term.textContent = label;
  const description = document.createElement("dd");
  description.append(valueNode);
  row.append(term, description);
  return row;
}

function textNode(text) {
  return document.createTextNode(String(text ?? ""));
}

function statusWithDate(status, date) {
  return date ? `${status} · ${date}` : status;
}

function linkNode(href) {
  const link = document.createElement("a");
  link.href = href;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = href;
  return link;
}

function categoryLabel(props) {
  const parts = [];
  if (ENTITY_TYPE_LABELS[props.entityType]) {
    parts.push(ENTITY_TYPE_LABELS[props.entityType]);
  } else if (props.entityType) {
    parts.push(props.entityType);
  }
  if (SCALE_LABELS[props.scale]) {
    parts.push(SCALE_LABELS[props.scale]);
  } else if (props.scale && props.scale !== "not-applicable") {
    parts.push(props.scale);
  }
  return parts.join(" · ");
}

function showDetail(feature) {
  const props = feature.properties;
  const detail = document.getElementById("detail");
  const closeButton = document.getElementById("close-detail");

  const oldBody = document.getElementById("detail-body");
  if (oldBody) oldBody.remove();

  const body = document.createElement("div");
  body.id = "detail-body";

  const heading = document.createElement("h3");
  heading.textContent = props.name;
  body.append(heading);
  if (props.nameJa) {
    const nameJaLine = document.createElement("p");
    nameJaLine.lang = "ja";
    nameJaLine.textContent = props.nameJa;
    body.append(nameJaLine);
  }
  const rows = document.createElement("dl");
  const location = props.location;
  const address = [location.address, location.city, location.region, location.postalCode]
    .filter(Boolean)
    .join(", ");
  rows.append(detailRow("Address", textNode(address)));
  rows.append(
    detailRow("Location precision", textNode(LOCATION_PRECISION_LABELS[location.precision])),
  );
  rows.append(detailRow("Category", textNode(categoryLabel(props))));
  rows.append(
    detailRow("Industries", textNode((props.industries || []).join(", "))),
  );
  if (props.website) rows.append(detailRow("Official website", linkNode(props.website)));
  if (props.profileSourceUrl) {
    rows.append(detailRow("Listing source", linkNode(props.profileSourceUrl)));
  }
  if (location.sourceUrl) {
    rows.append(detailRow("Address source", linkNode(location.sourceUrl)));
  }
  if (props.presenceCheck.sourceUrl) {
    rows.append(detailRow("Presence source", linkNode(props.presenceCheck.sourceUrl)));
  }
  rows.append(detailRow("Data updated", textNode(props.updatedAt)));
  rows.append(
    detailRow(
      "Coordinate check",
      textNode(
        statusWithDate(
          LOCATION_STATUS_LABELS[location.status] || location.status,
          location.checkedAt,
        ),
      ),
    ),
  );
  rows.append(
    detailRow(
      "Presence check",
      textNode(
        statusWithDate(
          PRESENCE_STATUS_LABELS[props.presenceCheck.status] || props.presenceCheck.status,
          props.presenceCheck.checkedAt,
        ),
      ),
    ),
  );
  rows.append(
    detailRow(
      "Website check",
      textNode(
        statusWithDate(
          CHECK_STATUS_LABELS[props.websiteCheck.status] || props.websiteCheck.status,
          props.websiteCheck.checkedAt,
        ),
      ),
    ),
  );

  body.append(rows);
  detail.insertBefore(body, closeButton.nextSibling);
  detail.hidden = false;
}

function hideDetail() {
  document.getElementById("detail").hidden = true;
}

function selectEntity(feature) {
  map.panTo(latlngOf(feature));
  showDetail(feature);
}

document.addEventListener("DOMContentLoaded", () => {
  initMap();

  const searchInput = document.getElementById("search");
  searchInput.addEventListener("input", () => applyFilter(searchInput.value));

  document.getElementById("clear-search").addEventListener("click", () => {
    searchInput.value = "";
    applyFilter("");
    searchInput.focus();
  });

  document.getElementById("close-detail").addEventListener("click", hideDetail);

  for (const button of document.querySelectorAll("[data-preset]")) {
    button.addEventListener("click", () => {
      applyPreset(button.getAttribute("data-preset"));
    });
  }

  document
    .getElementById("reset-filters")
    .addEventListener("click", () => clearFilters(true));

  loadEntities();
});
