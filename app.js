"use strict";

const MAP_CENTER = [37.55, -122.2];
const MAP_ZOOM = 9;
const ICON_SIZE = 42;

const ENTITY_TYPE_LABELS = {
  "vc-cvc": "VC・CVC",
  support: "支援機関",
  "university-research": "大学・研究機関",
  company: "企業",
};

const SCALE_LABELS = {
  large: "大規模",
  growth: "グロース",
  startup: "スタートアップ",
  "not-applicable": "該当なし",
};

const JAPAN_CONNECTION_LABELS = {
  "japan-headquartered": "日本本社",
  "japanese-founded": "日本人創業",
  "japan-focused": "日本重点",
  none: "その他",
};

const CHECK_STATUS_LABELS = {
  unchecked: "未確認",
  ok: "確認済み",
  review: "要確認",
};

const LOCATION_PRECISION_LABELS = {
  address: "番地単位",
  city: "都市中心（概略）",
};

const LOCATION_STATUS_LABELS = {
  unchecked: "未照合",
  matched: "住所と座標が一致",
  review: "要確認",
};

const PRESENCE_STATUS_LABELS = {
  unchecked: "未確認",
  verified: "確認済み",
  review: "要確認",
};

let map;
let markerLayer;
let entities = [];
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
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  markerLayer = L.markerClusterGroup({
    showCoverageOnHover: false,
    maxClusterRadius: 55,
    disableClusteringAtZoom: 14,
    iconCreateFunction(cluster) {
      return L.divIcon({
        className: "company-cluster",
        html: `<span>${cluster.getChildCount()}</span>`,
        iconSize: [44, 44],
      });
    },
  }).addTo(map);
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
      `https://www.google.com/s2/favicons?domain=${encodeURIComponent(website.hostname)}&sz=128`,
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
  const sources = logoSources(props);
  if (!sources.length) {
    container.replaceChildren(fallbackLogo(props.name));
    return;
  }
  const img = document.createElement("img");
  img.alt = "";
  img.referrerPolicy = "no-referrer";
  let index = 0;
  img.addEventListener("error", () => {
    index += 1;
    if (index < sources.length) img.src = sources[index];
    else container.replaceChildren(fallbackLogo(props.name));
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
  markersById.clear();
  for (const feature of features) {
    const props = feature.properties;
    const marker = L.marker(latlngOf(feature), { icon: makeIcon(props) });
    const notes = [];
    if (props.location.precision === "city") notes.push("概略位置");
    if (props.presenceCheck.status !== "verified") notes.push("現所在未確認");
    marker.bindTooltip(`${props.name}${notes.length ? `（${notes.join("・")}）` : ""}`);
    marker.on("click", () => selectEntity(feature));
    marker.on("add", () => {
      const el = marker.getElement();
      fillLogo(el, props);
      el.setAttribute("aria-label", props.name);
    });
    marker.addTo(markerLayer);
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
  const nameJaLine = document.createElement("p");
  nameJaLine.textContent = props.nameJa || "";
  const placeLine = document.createElement("p");
  placeLine.textContent = [props.location.city, props.location.county]
    .filter(Boolean)
    .join(" ／ ");
  const metaLine = document.createElement("p");
  metaLine.textContent = `${LOCATION_PRECISION_LABELS[props.location.precision]} ／ 現所在 ${PRESENCE_STATUS_LABELS[props.presenceCheck.status]} ${props.presenceCheck.checkedAt || "未確認"} ／ 更新 ${props.updatedAt}`;
  body.append(heading, nameJaLine, placeLine, metaLine);

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
    "データの読み込みに失敗しました。ネットワーク接続を確認して、ページを再読み込みしてください。";
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
  return parts.join("・");
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
  const nameJaLine = document.createElement("p");
  nameJaLine.textContent = props.nameJa || "";

  const rows = document.createElement("dl");
  const location = props.location;
  const address = [location.address, location.city, location.region, location.postalCode]
    .filter(Boolean)
    .join(", ");
  rows.append(detailRow("住所", textNode(address)));
  rows.append(
    detailRow("位置精度", textNode(LOCATION_PRECISION_LABELS[location.precision])),
  );
  rows.append(detailRow("分類", textNode(categoryLabel(props))));
  rows.append(
    detailRow("業種", textNode((props.industries || []).join("・"))),
  );
  if (props.website) rows.append(detailRow("公式サイト", linkNode(props.website)));
  if (props.profileSourceUrl) {
    rows.append(detailRow("掲載根拠", linkNode(props.profileSourceUrl)));
  }
  if (location.sourceUrl) {
    rows.append(detailRow("住所の根拠", linkNode(location.sourceUrl)));
  }
  if (props.presenceCheck.sourceUrl) {
    rows.append(detailRow("現所在の根拠", linkNode(props.presenceCheck.sourceUrl)));
  }
  rows.append(detailRow("データ更新日", textNode(props.updatedAt)));
  rows.append(
    detailRow(
      "座標照合",
      textNode(
        `${LOCATION_STATUS_LABELS[location.status] || location.status} ／ ${location.checkedAt || "未確認"}`,
      ),
    ),
  );
  rows.append(
    detailRow(
      "現所在確認",
      textNode(
        `${PRESENCE_STATUS_LABELS[props.presenceCheck.status] || props.presenceCheck.status} ／ ${props.presenceCheck.checkedAt || "未確認"}`,
      ),
    ),
  );
  rows.append(
    detailRow(
      "サイト確認",
      textNode(
        `${CHECK_STATUS_LABELS[props.websiteCheck.status] || props.websiteCheck.status} ／ ${props.websiteCheck.checkedAt || "未確認"}`,
      ),
    ),
  );

  body.append(heading, nameJaLine, rows);
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
