"use strict";

const MAP_CENTER = [37.55, -122.2];
const MAP_ZOOM = 9;
const MAX_ZOOM = 19;
const ICON_SIZE = 42;
const TOWN_ZOOM = 14;
const PAGE_SIZE = 50;
const SEARCH_DEBOUNCE_MS = 120;
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

const SECTOR_ORDER = [
  "technology-ai",
  "semiconductors-electronics",
  "aerospace-defense",
  "industrial-manufacturing",
  "mobility-automotive",
  "finance-investment",
  "life-sciences",
  "energy-materials",
  "business-consumer",
  "universities-research",
];
const SECTOR_IDS = new Set(SECTOR_ORDER);

const SECTOR_INDUSTRIES = {
  "technology-ai": new Set([
    "technology", "software", "ai", "artificial-intelligence", "cloud", "data",
    "internet", "information-technology", "cybersecurity", "database",
    "collaboration", "tools", "enterprise-software", "networking", "computing",
    "telecommunications", "communications", "iot",
  ]),
  "semiconductors-electronics": new Set([
    "semiconductors", "electronics", "imaging", "optics",
    "scientific-instruments", "industrial-printing",
  ]),
  "aerospace-defense": new Set([
    "aerospace", "defense", "space", "satellites", "aviation", "drones",
  ]),
  "industrial-manufacturing": new Set([
    "manufacturing", "industrial", "robotics", "automation", "construction",
    "logistics",
  ]),
  "mobility-automotive": new Set([
    "mobility", "automotive", "motors", "travel", "delivery",
  ]),
  "finance-investment": new Set([
    "finance", "investment", "venture-capital", "banking", "securities",
    "payments", "fintech", "insurance", "trading",
  ]),
  "life-sciences": new Set([
    "life-sciences", "biotechnology", "healthcare", "medical-devices", "science",
  ]),
  "energy-materials": new Set([
    "energy", "materials", "chemicals", "water",
  ]),
  "business-consumer": new Set([
    "business-development", "startup-support", "accelerator", "community",
    "education", "ecommerce", "e-commerce", "entertainment", "legaltech",
    "consulting", "media", "economic-development", "advertising", "marketing",
    "real-estate", "urban-development", "food", "coworking", "services",
    "recruiting", "streaming", "marketplace", "trade-promotion",
    "investment-promotion", "open-innovation", "corporate-innovation",
    "startup-education", "innovation",
  ]),
  "universities-research": new Set([
    "education", "research", "university", "national-laboratory", "research-institute",
  ]),
};

const SORT_VALUES = ["relevance", "distance", "name", "updated"];
const VIEW_VALUES = ["map", "list"];
const PARAM_GROUPS = [
  ["japan", "japanConnection"],
  ["type", "entityType"],
  ["scale", "scale"],
  ["industry", "industries"],
  ["county", "county"],
  ["precision", "locationPrecision"],
  ["presence", "presenceStatus"],
];

const PRESET_VALUES = new Set(["japanese", "sp500", "unicorn"]);
// Curated runtime cohorts; refresh these IDs with the monthly data audit.
const SP500_ENTITY_IDS = new Set([
  "sf-accenture", "sf-adobe", "sf-airbnb", "amd", "sf-amazon-web-services", "apple",
  "cisco", "doordash", "ebay", "google", "intel", "intuit", "sf-mckesson", "meta",
  "sf-microsoft", "nvidia", "netflix", "oracle", "paypal", "sf-salesforce", "servicenow",
  "tesla-fremont", "sf-uber",
]);
const UNICORN_ENTITY_IDS = new Set([
  "sf-algolia", "sf-alpha-sense", "anthropic", "sf-appdirect", "sf-automattic", "sf-betterup",
  "sf-checkr", "sf-collective-health", "databricks", "sf-docker", "sf-envoy", "sf-flexport",
  "sf-fundbox", "sf-gusto", "sf-intercom", "sf-lattice", "sf-mapbox", "sf-mux", "sf-openai",
  "sf-plaid", "sf-sentry", "sf-sift-science", "sf-stripe", "sf-thumbtack", "sf-turo",
  "sf-upgrade", "sf-webflow",
]);

const FILTER_FIELDSETS = {
  japanConnection: "filter-japan",
  entityType: "filter-type",
  scale: "filter-scale",
  industries: "filter-industry",
  county: "filter-county",
  locationPrecision: "filter-location-precision",
  presenceStatus: "filter-presence",
};

let map = null;
let markerLayer = null;
let townMarkerLayer = null;
let overlapLegLayer = null;
let entities = [];
let visibleEntities = [];
let entitiesById = new Map();
let markersById = new Map();
let activeCluster = [];
let activeTown = [];
let currentPage = 1;
let ready = false;
let areaButtonRevealed = false;
let lastSelectedMarker = null;
let detailOpener = null;
let dialogCloseIntent = "dismiss";
let statusTimer = 0;
let pendingSearchTimer = 0;
let clusterAddBusy = false;
let clusterAddPending = false;

const allowed = {
  japanConnection: new Set(),
  entityType: new Set(),
  scale: new Set(),
  industries: new Set(),
  county: new Set(),
  locationPrecision: new Set(),
  presenceStatus: new Set(),
};

const state = {
  q: "",
  sort: "relevance",
  preset: null,
  sectors: new Set(),
  filters: {},
  area: null,
  entityId: null,
  view: "list",
  lat: MAP_CENTER[0],
  lng: MAP_CENTER[1],
  z: MAP_ZOOM,
};
for (const [, group] of PARAM_GROUPS) state.filters[group] = new Set();

const el = {};

function $(id) {
  return document.getElementById(id);
}

function normText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeIndustry(value) {
  return normText(value).replace(/\s+/g, "-");
}

function roundTo(value, places) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

function finiteInRange(value, min, max) {
  if (value === null || value === undefined || String(value).trim() === "") return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= min && number <= max ? number : null;
}

function debounce(fn, ms) {
  return (...args) => {
    window.clearTimeout(pendingSearchTimer);
    pendingSearchTimer = window.setTimeout(() => fn(...args), ms);
  };
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const radius = 6371;
  const toRad = (degrees) => degrees * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * radius * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
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

function actionLink(href, label) {
  const link = document.createElement("a");
  link.href = href;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = label;
  return link;
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

function filterValueLabel(group, value) {
  if (group === "entityType" && ENTITY_TYPE_LABELS[value]) return ENTITY_TYPE_LABELS[value];
  if (group === "scale" && SCALE_LABELS[value]) return SCALE_LABELS[value];
  if (group === "japanConnection" && JAPAN_CONNECTION_LABELS[value]) return JAPAN_CONNECTION_LABELS[value];
  if (group === "locationPrecision" && LOCATION_PRECISION_LABELS[value]) return LOCATION_PRECISION_LABELS[value];
  if (group === "presenceStatus" && PRESENCE_STATUS_LABELS[value]) return PRESENCE_STATUS_LABELS[value];
  return String(value).replace(/-/g, " ");
}

function deriveSectors(industries, entityType) {
  const found = new Set();
  for (const raw of Array.isArray(industries) ? industries : []) {
    const token = normalizeIndustry(raw);
    for (const sector of SECTOR_ORDER) {
      if (SECTOR_INDUSTRIES[sector].has(token)) found.add(sector);
    }
  }
  if (entityType === "university-research") found.add("universities-research");
  return [...found];
}

function enrichFeature(feature) {
  const props = feature.properties;
  const location = props.location || {};
  props._normName = normText(props.name);
  props._normNameJa = props.nameJa ? normText(props.nameJa) : "";
  props._normIndustries = (Array.isArray(props.industries) ? props.industries : []).map(normalizeIndustry);
  props._normPlace = normText(
    [location.address, location.city, location.county, location.region, location.postalCode]
      .filter(Boolean)
      .join(", "),
  );
  props._sectors = deriveSectors(props.industries, props.entityType);
  const parsed = Date.parse(props.updatedAt);
  props._updatedTs = Number.isFinite(parsed) ? parsed : 0;
}

function latlngOf(feature) {
  const [lon, lat] = feature.geometry.coordinates;
  return [lat, lon];
}

function logoSources(props) {
  const sources = [];
  if (props.logoUrl) sources.push(props.logoUrl);
  try {
    if (props.website) {
      const website = new URL(props.website);
      sources.push(
        `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(website.origin)}&sz=128`,
        new URL("/favicon.ico", website).href,
      );
    }
  } catch {
    return sources;
  }
  return [...new Set(sources)];
}

function initialsOf(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return parts.slice(0, 2).map((part) => part.charAt(0)).join("").toUpperCase();
}

function fallbackLogo(name) {
  const span = document.createElement("span");
  span.className = "logo-fallback";
  span.textContent = initialsOf(name);
  return span;
}

function fillLogo(container, props, lazy) {
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
  if (lazy) {
    img.loading = "lazy";
    img.setAttribute("fetchpriority", "low");
  }
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

function initMap(center, zoom) {
  map = L.map("map", { center, zoom });
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: MAX_ZOOM,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  markerLayer = L.markerClusterGroup({
    showCoverageOnHover: false,
    maxClusterRadius: 55,
    spiderfyDistanceMultiplier: 1.5,
    chunkedLoading: true,
    chunkProgress: onClusterChunkProgress,
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
  map.on("moveend", onViewChanged);
}

function makeIcon(props, selected) {
  const classes = ["logo-pin"];
  if (props.japanConnection && props.japanConnection !== "none") classes.push("japan");
  if (props.location.precision === "city") classes.push("approximate");
  if (props.presenceCheck.status !== "verified") classes.push("presence-unverified");
  if (selected) classes.push("selected");
  return L.divIcon({
    className: classes.join(" "),
    iconSize: [ICON_SIZE, ICON_SIZE],
    html: "",
  });
}

function buildMarkersOnce() {
  for (const feature of entities) {
    const props = feature.properties;
    const marker = L.marker(latlngOf(feature), { icon: makeIcon(props, false) });
    marker._feature = feature;
    marker._town = false;
    const notes = [];
    if (props.location.precision === "city") notes.push("approximate location");
    if (props.presenceCheck.status !== "verified") notes.push("presence unverified");
    marker.bindTooltip(`${props.name}${notes.length ? ` (${notes.join(", ")})` : ""}`);
    marker.on("click", () => selectEntity(feature));
    marker.on("add", () => {
      const node = marker.getElement();
      if (!node) return;
      if (!node.dataset.logoFilled) {
        node.dataset.logoFilled = "1";
        fillLogo(node, props, false);
      }
      node.setAttribute("role", "button");
      node.setAttribute("aria-label", props.name);
      node.classList.toggle("selected", state.entityId === props.id);
    });
    markersById.set(props.id, marker);
  }
}

function computeLayout() {
  const positions = new Map();
  const townIds = new Set();
  for (const feature of visibleEntities) {
    positions.set(feature.properties.id, latlngOf(feature));
  }
  overlapLegLayer.clearLayers();
  const zoom = map.getZoom();
  if (zoom < TOWN_ZOOM) return { positions, townIds };
  const expandEverywhere = zoom >= MAX_ZOOM;
  const bounds = map.getBounds();
  const groups = new Map();
  for (const feature of visibleEntities) {
    const props = feature.properties;
    if (!expandEverywhere && DENSE_CLUSTER_CITIES.has(props.location.city)) continue;
    const origin = latlngOf(feature);
    if (!bounds.contains(origin)) continue;
    townIds.add(props.id);
    const key = feature.geometry.coordinates.join(",");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(feature);
  }
  for (const group of groups.values()) {
    if (group.length < 2) continue;
    const origin = latlngOf(group[0]);
    const centerPoint = map.latLngToLayerPoint(origin);
    const radius = Math.max(58, (group.length * (ICON_SIZE + 10)) / (2 * Math.PI));
    group.forEach((feature, index) => {
      const angle = (index * 2 * Math.PI) / group.length - Math.PI / 2;
      const display = map.layerPointToLatLng([
        centerPoint.x + Math.cos(angle) * radius,
        centerPoint.y + Math.sin(angle) * radius,
      ]);
      positions.set(feature.properties.id, display);
      townIds.add(feature.properties.id);
      L.polyline([origin, display], {
        className: "overlap-leg",
        interactive: false,
        opacity: 0.55,
        weight: 1.5,
      }).addTo(overlapLegLayer);
    });
  }
  return { positions, townIds };
}

function refreshMapLayers() {
  if (!map) return;
  if (clusterAddBusy) {
    clusterAddPending = true;
    return;
  }
  const { positions, townIds } = computeLayout();
  const nextCluster = [];
  const nextTown = [];
  for (const feature of visibleEntities) {
    const marker = markersById.get(feature.properties.id);
    if (!marker) continue;
    const next = positions.get(feature.properties.id) || latlngOf(feature);
    if (!marker.getLatLng().equals(next)) marker.setLatLng(next);
    marker._town = townIds.has(feature.properties.id);
    (marker._town ? nextTown : nextCluster).push(marker);
  }
  const nextClusterSet = new Set(nextCluster);
  const nextTownSet = new Set(nextTown);
  const removeCluster = activeCluster.filter((marker) => !nextClusterSet.has(marker));
  const removeTown = activeTown.filter((marker) => !nextTownSet.has(marker));
  if (removeCluster.length) markerLayer.removeLayers(removeCluster);
  for (const marker of removeTown) townMarkerLayer.removeLayer(marker);
  const previousCluster = new Set(activeCluster);
  const previousTown = new Set(activeTown);
  const addCluster = nextCluster.filter((marker) => !previousCluster.has(marker));
  const addTown = nextTown.filter((marker) => !previousTown.has(marker));
  activeCluster = nextCluster;
  activeTown = nextTown;
  if (addCluster.length) {
    clusterAddBusy = true;
    markerLayer.addLayers(addCluster);
  }
  for (const marker of addTown) townMarkerLayer.addLayer(marker);
}

function onClusterChunkProgress(processed, total) {
  if (processed < total) return;
  clusterAddBusy = false;
  if (clusterAddPending) {
    clusterAddPending = false;
    refreshMapLayers();
  }
}

function onViewChanged() {
  if (!ready || !map) return;
  const center = map.getCenter();
  state.lat = center.lat;
  state.lng = center.lng;
  state.z = map.getZoom();
  if (!areaButtonRevealed) {
    areaButtonRevealed = true;
    el.searchArea.hidden = false;
  }
  refreshMapLayers();
  if (state.sort === "distance") {
    sortVisible(visibleEntities);
    renderResults();
  }
  replaceHistory();
}

function rankFeature(props, query) {
  if (!query) return 0;
  if (props._normName === query || props._normNameJa === query) return 1;
  if (props._normName.startsWith(query) || props._normNameJa.startsWith(query)) return 2;
  if (props._normName.includes(query) || props._normNameJa.includes(query)) return 3;
  const industryQuery = normalizeIndustry(query);
  if (props._normIndustries.some((industry) => industry.includes(industryQuery))) return 4;
  if (props._normPlace.includes(query)) return 5;
  return Number.POSITIVE_INFINITY;
}

function filterValue(props, group) {
  if (group === "county") return props.location.county;
  if (group === "locationPrecision") return props.location.precision;
  if (group === "presenceStatus") return props.presenceCheck.status;
  return props[group];
}

function matchesFilterGroups(props) {
  for (const [, group] of PARAM_GROUPS) {
    const selected = state.filters[group];
    if (!selected.size) continue;
    if (group === "industries") {
      const list = Array.isArray(props.industries) ? props.industries : [];
      if (!list.some((industry) => selected.has(industry))) return false;
    } else if (!selected.has(filterValue(props, group))) {
      return false;
    }
  }
  return true;
}

function matchesSectors(props) {
  if (!state.sectors.size) return true;
  return props._sectors.some((sector) => state.sectors.has(sector));
}

function matchesCompanyPreset(feature) {
  if (!state.preset) return true;
  const props = feature.properties;
  if (state.preset === "japanese") {
    return props.japanConnection === "japan-headquartered" && ["company", "vc-cvc"].includes(props.entityType);
  }
  return (state.preset === "sp500" ? SP500_ENTITY_IDS : UNICORN_ENTITY_IDS).has(props.id);
}

function inArea(feature) {
  const area = state.area;
  if (!area) return true;
  const [lon, lat] = feature.geometry.coordinates;
  return lon >= area.w && lon <= area.e && lat >= area.s && lat <= area.n;
}

function computeVisible() {
  const query = normText(state.q);
  return entities.filter((feature) => {
    const props = feature.properties;
    if (query && rankFeature(props, query) === Number.POSITIVE_INFINITY) return false;
    if (!matchesCompanyPreset(feature)) return false;
    if (!matchesSectors(props)) return false;
    if (!matchesFilterGroups(props)) return false;
    if (!inArea(feature)) return false;
    return true;
  });
}

function tieCompare(a, b) {
  const propsA = a.properties;
  const propsB = b.properties;
  const japanA = propsA.japanConnection && propsA.japanConnection !== "none" ? 1 : 0;
  const japanB = propsB.japanConnection && propsB.japanConnection !== "none" ? 1 : 0;
  if (japanA !== japanB) return japanB - japanA;
  const largeA = propsA.scale === "large" ? 1 : 0;
  const largeB = propsB.scale === "large" ? 1 : 0;
  if (largeA !== largeB) return largeB - largeA;
  const verifiedA = propsA.presenceCheck.status === "verified" ? 1 : 0;
  const verifiedB = propsB.presenceCheck.status === "verified" ? 1 : 0;
  if (verifiedA !== verifiedB) return verifiedB - verifiedA;
  return propsA.name.localeCompare(propsB.name, undefined, { sensitivity: "base" });
}

function sortVisible(list) {
  if (state.sort === "distance") {
    const center = map.getCenter();
    const distances = new Map(
      list.map((feature) => {
        const [lat, lng] = latlngOf(feature);
        return [feature, haversineKm(center.lat, center.lng, lat, lng)];
      }),
    );
    list.sort((a, b) => distances.get(a) - distances.get(b) || tieCompare(a, b));
  } else if (state.sort === "name") {
    list.sort(
      (a, b) =>
        a.properties.name.localeCompare(b.properties.name, undefined, { sensitivity: "base" }) ||
        tieCompare(a, b),
    );
  } else if (state.sort === "updated") {
    list.sort((a, b) => b.properties._updatedTs - a.properties._updatedTs || tieCompare(a, b));
  } else {
    const query = normText(state.q);
    if (query) {
      const ranks = new Map(list.map((feature) => [feature, rankFeature(feature.properties, query)]));
      list.sort((a, b) => ranks.get(a) - ranks.get(b) || tieCompare(a, b));
    } else {
      list.sort(tieCompare);
    }
  }
}

function rerender() {
  visibleEntities = computeVisible();
  sortVisible(visibleEntities);
  refreshMapLayers();
  renderResults();
}

function makeResultCard(feature) {
  const props = feature.properties;
  const card = document.createElement("div");
  card.className = "result-card";
  card.dataset.id = props.id;
  card.setAttribute("role", "button");
  card.tabIndex = 0;
  if (state.entityId === props.id) {
    card.classList.add("selected");
    card.setAttribute("aria-current", "true");
  }

  const logo = document.createElement("span");
  logo.className = "logo-pin";
  if (props.japanConnection && props.japanConnection !== "none") logo.classList.add("japan");
  if (props.location.precision === "city") logo.classList.add("approximate");
  if (props.presenceCheck.status !== "verified") logo.classList.add("presence-unverified");
  fillLogo(logo, props, true);

  const body = document.createElement("div");
  body.className = "result-body";
  const heading = document.createElement("h3");
  heading.textContent = props.name;
  body.append(heading);
  if (props.nameJa) {
    const nameJaLine = document.createElement("p");
    nameJaLine.lang = "ja";
    nameJaLine.className = "result-name-ja";
    nameJaLine.textContent = props.nameJa;
    body.append(nameJaLine);
  }
  if (props.japanConnection && props.japanConnection !== "none") {
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = JAPAN_CONNECTION_LABELS[props.japanConnection] || "Japan-linked";
    body.append(badge);
  }
  const industryLine = document.createElement("p");
  industryLine.className = "result-industries";
  industryLine.textContent = (Array.isArray(props.industries) ? props.industries : [])
    .slice(0, 2)
    .join(" · ");
  const metaLine = document.createElement("p");
  metaLine.className = "result-meta";
  metaLine.textContent = [
    SCALE_LABELS[props.scale] || props.scale,
    props.location.city,
    LOCATION_PRECISION_LABELS[props.location.precision],
    `Presence: ${PRESENCE_STATUS_LABELS[props.presenceCheck.status] || props.presenceCheck.status}`,
  ]
    .filter(Boolean)
    .join(" · ");
  body.append(industryLine, metaLine);

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

function pageNumberWindow(total, current) {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
  const pages = new Set(
    [1, total, current - 1, current, current + 1].filter((page) => page >= 1 && page <= total),
  );
  const sorted = [...pages].sort((a, b) => a - b);
  const output = [];
  let previous = 0;
  for (const page of sorted) {
    if (page - previous > 1) output.push("gap");
    output.push(page);
    previous = page;
  }
  return output;
}

function goToPage(page) {
  const totalPages = Math.max(1, Math.ceil(visibleEntities.length / PAGE_SIZE));
  if (page < 1 || page > totalPages || page === currentPage) return;
  currentPage = page;
  renderResults();
}

function renderPagination(totalPages) {
  const nodes = [];
  const prev = document.createElement("button");
  prev.type = "button";
  prev.textContent = "Previous";
  prev.disabled = currentPage <= 1;
  prev.addEventListener("click", () => goToPage(currentPage - 1));
  nodes.push(prev);
  for (const item of pageNumberWindow(totalPages, currentPage)) {
    if (item === "gap") {
      const gap = document.createElement("span");
      gap.className = "page-gap";
      gap.textContent = "…";
      nodes.push(gap);
      continue;
    }
    const pageButton = document.createElement("button");
    pageButton.type = "button";
    pageButton.textContent = String(item);
    if (item === currentPage) {
      pageButton.disabled = true;
      pageButton.setAttribute("aria-current", "page");
    } else {
      pageButton.addEventListener("click", () => goToPage(item));
    }
    nodes.push(pageButton);
  }
  const next = document.createElement("button");
  next.type = "button";
  next.textContent = "Next";
  next.disabled = currentPage >= totalPages;
  next.addEventListener("click", () => goToPage(currentPage + 1));
  nodes.push(next);
  el.pagination.replaceChildren(...nodes);
}

function renderResults() {
  const total = visibleEntities.length;
  el.visibleCount.textContent = String(total);
  el.resultsCount.textContent = `${total} result${total === 1 ? "" : "s"}`;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (currentPage > totalPages) currentPage = totalPages;
  if (total === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    const message = document.createElement("p");
    message.textContent = "No companies match the current search and filters.";
    const clearButton = document.createElement("button");
    clearButton.type = "button";
    clearButton.textContent = "Clear filters";
    clearButton.addEventListener("click", () => clearAllFilters());
    empty.append(message, clearButton);
    el.results.replaceChildren(empty);
    el.pagination.replaceChildren();
    return;
  }
  const start = (currentPage - 1) * PAGE_SIZE;
  const slice = visibleEntities.slice(start, start + PAGE_SIZE);
  el.results.replaceChildren(...slice.map(makeResultCard));
  renderPagination(totalPages);
}

function syncSelectionUI() {
  for (const card of el.results.querySelectorAll(".result-card")) {
    const selected = card.dataset.id === state.entityId;
    card.classList.toggle("selected", selected);
    if (selected) card.setAttribute("aria-current", "true");
    else card.removeAttribute("aria-current");
  }
  const nextMarker = state.entityId ? markersById.get(state.entityId) : null;
  const previousNode = lastSelectedMarker ? lastSelectedMarker.getElement() : null;
  if (previousNode) previousNode.classList.remove("selected");
  const nextNode = nextMarker ? nextMarker.getElement() : null;
  if (nextNode) nextNode.classList.add("selected");
  lastSelectedMarker = nextMarker;
}

function focusEntity(feature) {
  const marker = markersById.get(feature.properties.id);
  if (!marker) {
    map.setView(latlngOf(feature), Math.max(map.getZoom(), TOWN_ZOOM));
    return;
  }
  if (marker._town) {
    map.setView(marker.getLatLng(), map.getZoom());
  } else if (markerLayer.hasLayer(marker)) {
    markerLayer.zoomToShowLayer(marker);
  } else {
    map.setView(latlngOf(feature), Math.max(map.getZoom(), TOWN_ZOOM));
  }
}

function selectEntity(feature, options = {}) {
  const open = options.open !== false;
  state.entityId = feature.properties.id;
  syncSelectionUI();
  focusEntity(feature);
  if (open) openDetail(feature);
  pushHistory();
}

function setStatus(message) {
  const node = $("detail-status");
  if (!node) return;
  node.textContent = message;
  window.clearTimeout(statusTimer);
  statusTimer = window.setTimeout(() => {
    node.textContent = "";
  }, 2200);
}

async function copyAddress(address) {
  try {
    await navigator.clipboard.writeText(address);
    setStatus("Address copied.");
  } catch {
    setStatus("Copy failed. Select the address text manually.");
  }
}

function revealShareInput(url) {
  const existing = $("share-url-input");
  if (existing) {
    existing.value = url;
    existing.focus();
    existing.select();
    return;
  }
  const label = document.createElement("label");
  label.className = "share-link-label";
  label.setAttribute("for", "share-url-input");
  label.textContent = "Shareable link";
  const input = document.createElement("input");
  input.id = "share-url-input";
  input.type = "text";
  input.readOnly = true;
  input.value = url;
  el.detailContent.append(label, input);
  input.focus();
  input.select();
}

async function shareView() {
  const url = location.href;
  if (navigator.share) {
    try {
      await navigator.share({ title: document.title, url });
      return;
    } catch (error) {
      if (error && error.name === "AbortError") return;
    }
  }
  try {
    await navigator.clipboard.writeText(url);
    setStatus("Link copied to clipboard.");
  } catch {
    revealShareInput(url);
  }
}

function populateDetail(feature) {
  const props = feature.properties;
  const location = props.location;
  const address = [location.address, location.city, location.region, location.postalCode]
    .filter(Boolean)
    .join(", ");
  const mapsQuery = encodeURIComponent([props.name, address].filter(Boolean).join(" "));
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
  el.detailContent.replaceChildren();

  const heading = document.createElement("h2");
  heading.textContent = props.name;
  el.detailContent.append(heading);
  if (props.nameJa) {
    const nameJaLine = document.createElement("p");
    nameJaLine.lang = "ja";
    nameJaLine.textContent = props.nameJa;
    el.detailContent.append(nameJaLine);
  }
  const categoryLine = document.createElement("p");
  categoryLine.className = "detail-category";
  categoryLine.textContent = [categoryLabel(props), location.city, location.county]
    .filter(Boolean)
    .join(" · ");
  const addressLine = document.createElement("p");
  addressLine.className = "detail-address";
  addressLine.append(actionLink(mapsUrl, address));
  el.detailContent.append(categoryLine, addressLine);

  const actions = document.createElement("div");
  actions.className = "detail-actions";
  if (props.website) actions.append(actionLink(props.website, "Open official website"));
  const showMapButton = document.createElement("button");
  showMapButton.type = "button";
  showMapButton.textContent = "Show on map";
  showMapButton.addEventListener("click", () => {
    dialogCloseIntent = "preserve";
    el.dialog.close();
    setMobileView("map", true);
    showEntityOnMap(feature);
    pushHistory();
  });
  actions.append(showMapButton);
  actions.append(actionLink(mapsUrl, "Open in Google Maps"));
  const [lon, lat] = feature.geometry.coordinates;
  actions.append(actionLink(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`, "Get directions"));
  const copyButton = document.createElement("button");
  copyButton.type = "button";
  copyButton.textContent = "Copy address";
  copyButton.addEventListener("click", () => copyAddress(address));
  actions.append(copyButton);
  const shareButton = document.createElement("button");
  shareButton.type = "button";
  shareButton.textContent = "Share this view";
  shareButton.addEventListener("click", () => shareView());
  actions.append(shareButton);
  el.detailContent.append(actions);

  const status = document.createElement("p");
  status.id = "detail-status";
  status.setAttribute("role", "status");
  el.detailContent.append(status);

  const quality = document.createElement("details");
  quality.className = "data-quality";
  const summary = document.createElement("summary");
  summary.textContent = "Data quality";
  quality.append(summary);
  const rows = document.createElement("dl");
  if (location.sourceUrl) rows.append(detailRow("Address source", linkNode(location.sourceUrl)));
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
  if (props.presenceCheck.sourceUrl) {
    rows.append(detailRow("Presence source", linkNode(props.presenceCheck.sourceUrl)));
  }
  rows.append(
    detailRow(
      "Coordinate check",
      textNode(
        statusWithDate(LOCATION_STATUS_LABELS[location.status] || location.status, location.checkedAt),
      ),
    ),
  );
  rows.append(
    detailRow(
      "URL check",
      textNode(
        statusWithDate(CHECK_STATUS_LABELS[props.websiteCheck.status] || props.websiteCheck.status, props.websiteCheck.checkedAt),
      ),
    ),
  );
  rows.append(detailRow("Data updated", textNode(props.updatedAt)));
  quality.append(rows);
  el.detailContent.append(quality);
}

function openDetail(feature, trackOpener = true) {
  if (trackOpener && document.activeElement instanceof HTMLElement && !el.dialog.open) {
    detailOpener = document.activeElement;
  }
  populateDetail(feature);
  if (!el.dialog.open) el.dialog.showModal();
}

function showEntityOnMap(feature) {
  const marker = markersById.get(feature.properties.id);
  if (!marker) {
    map.setView(latlngOf(feature), Math.max(map.getZoom(), 16));
    return;
  }
  if (marker._town) {
    map.setView(marker.getLatLng(), map.getZoom());
  } else if (markerLayer.hasLayer(marker)) {
    markerLayer.zoomToShowLayer(marker);
  } else {
    map.setView(latlngOf(feature), Math.max(map.getZoom(), 16));
  }
  if (state.entityId !== feature.properties.id) {
    state.entityId = feature.properties.id;
    syncSelectionUI();
  }
}

function serializeState() {
  const params = new URLSearchParams();
  const query = state.q.trim();
  if (query) params.set("q", query);
  if (state.sort !== "relevance") params.set("sort", state.sort);
  if (state.preset) params.set("preset", state.preset);
  for (const value of state.sectors) params.append("sector", value);
  for (const [param, group] of PARAM_GROUPS) {
    for (const value of state.filters[group]) params.append(param, value);
  }
  if (state.area) {
    params.set(
      "area",
      [state.area.w, state.area.s, state.area.e, state.area.n]
        .map((value) => roundTo(value, 5))
        .join(","),
    );
  }
  if (state.entityId) params.set("entity", state.entityId);
  if (state.view === "map") params.set("view", "map");
  params.set("lat", String(roundTo(state.lat, 5)));
  params.set("lng", String(roundTo(state.lng, 5)));
  params.set("z", String(Math.round(state.z)));
  return params;
}

function snapshotEntry() {
  return { q: serializeState().toString() };
}

function pushHistory() {
  history.pushState(snapshotEntry(), "", `${location.pathname}${serializeState().toString() ? "?" + serializeState().toString() : ""}`);
}

function replaceHistory() {
  history.replaceState(snapshotEntry(), "", `${location.pathname}${serializeState().toString() ? "?" + serializeState().toString() : ""}`);
}

function parseArea(raw) {
  if (!raw) return null;
  const parts = raw.split(",").map((value) => Number(value));
  if (parts.length !== 4 || parts.some((value) => !Number.isFinite(value))) return null;
  const [w, s, e, n] = parts;
  if (w >= e || s >= n) return null;
  if (w < -180 || e > 180 || s < -90 || n > 90) return null;
  return { w, s, e, n };
}

function parseCenter(params) {
  const lat = finiteInRange(params.get("lat"), -90, 90);
  const lng = finiteInRange(params.get("lng"), -180, 180);
  const z = finiteInRange(params.get("z"), 0, MAX_ZOOM);
  return {
    lat: lat ?? MAP_CENTER[0],
    lng: lng ?? MAP_CENTER[1],
    z: z ?? MAP_ZOOM,
  };
}

function applySnapshot(entry) {
  window.clearTimeout(pendingSearchTimer);
  pendingSearchTimer = 0;
  const source = entry && typeof entry.q === "string" ? entry.q : location.search;
  const params = new URLSearchParams(source);
  state.q = (params.get("q") || "").trim();
  el.search.value = state.q;
  const sort = params.get("sort");
  state.sort = SORT_VALUES.includes(sort) ? sort : "relevance";
  el.sort.value = state.sort;
  const preset = params.get("preset");
  state.preset = PRESET_VALUES.has(preset) ? preset : null;
  state.sectors = new Set(params.getAll("sector").filter((value) => SECTOR_IDS.has(value)));
  for (const [param, group] of PARAM_GROUPS) {
    state.filters[group] = new Set(params.getAll(param).filter((value) => allowed[group].has(value)));
  }
  state.area = parseArea(params.get("area"));
  const entity = params.get("entity");
  state.entityId = entity && entitiesById.has(entity) ? entity : null;
  const view = params.get("view");
  setMobileView(VIEW_VALUES.includes(view) ? view : "list", false);
  const center = parseCenter(params);
  state.lat = center.lat;
  state.lng = center.lng;
  state.z = center.z;
  syncFilterCheckboxes();
  syncSectorButtons();
  syncPresetButtons();
  syncAreaButtons();
  currentPage = 1;
  if (ready && map) map.setView([state.lat, state.lng], state.z, { animate: false });
  rerender();
  if (state.entityId) {
    const feature = entitiesById.get(state.entityId);
    if (feature) openDetail(feature, false);
  } else {
    if (el.dialog.open) {
      dialogCloseIntent = "quiet";
      el.dialog.close();
    }
    syncSelectionUI();
  }
}

function syncAreaButtons() {
  el.showAllArea.hidden = !state.area;
}

function syncSectorButtons() {
  for (const button of document.querySelectorAll("[data-sector]")) {
    button.setAttribute("aria-pressed", state.sectors.has(button.dataset.sector) ? "true" : "false");
  }
}

function syncPresetButtons() {
  for (const button of document.querySelectorAll("[data-preset-contact]")) {
    button.setAttribute("aria-pressed", state.preset === button.dataset.presetContact ? "true" : "false");
  }
}

function syncFilterCheckboxes() {
  const fieldsetToGroup = {};
  for (const [group, fieldsetId] of Object.entries(FILTER_FIELDSETS)) {
    fieldsetToGroup[fieldsetId] = group;
  }
  for (const input of document.querySelectorAll("#filters input[type='checkbox']")) {
    const fieldset = input.closest("fieldset");
    const group = fieldset ? fieldsetToGroup[fieldset.id] : null;
    if (!group) continue;
    input.checked = state.filters[group].has(input.value);
  }
}

function setMobileView(view, invalidate) {
  state.view = view;
  document.body.classList.toggle("mobile-view-map", view === "map");
  document.body.classList.toggle("mobile-view-list", view === "list");
  el.mobileMapTab.setAttribute("aria-selected", view === "map" ? "true" : "false");
  el.mobileListTab.setAttribute("aria-selected", view === "list" ? "true" : "false");
  if (view === "map" && map && invalidate) {
    requestAnimationFrame(() => map.invalidateSize());
  }
}

function buildFilterControls() {
  for (const [param, group] of PARAM_GROUPS) {
    void param;
    const values = new Set();
    for (const feature of entities) {
      const raw = filterValue(feature.properties, group);
      if (Array.isArray(raw)) {
        for (const item of raw) if (item) values.add(item);
      } else if (raw) {
        values.add(raw);
      }
    }
    allowed[group] = values;
  }
  for (const [group, fieldsetId] of Object.entries(FILTER_FIELDSETS)) {
    const fieldset = $(fieldsetId);
    const nodes = [];
    for (const value of [...allowed[group]].sort()) {
      const input = document.createElement("input");
      input.type = "checkbox";
      input.value = value;
      input.addEventListener("change", () => {
        if (input.checked) state.filters[group].add(value);
        else state.filters[group].delete(value);
        currentPage = 1;
        rerender();
        pushHistory();
      });
      const label = document.createElement("label");
      label.append(input, textNode(filterValueLabel(group, value)));
      nodes.push(label);
    }
    fieldset.append(...nodes);
  }
}

function clearAllFilters() {
  state.preset = null;
  state.sectors.clear();
  for (const selected of Object.values(state.filters)) selected.clear();
  state.area = null;
  state.q = "";
  el.search.value = "";
  syncFilterCheckboxes();
  syncSectorButtons();
  syncPresetButtons();
  syncAreaButtons();
  areaButtonRevealed = false;
  el.searchArea.hidden = true;
  currentPage = 1;
  rerender();
  pushHistory();
}

function setDatasetDates(geojson) {
  const maxOf = (read) =>
    entities
      .map((feature) => read(feature.properties))
      .filter(Boolean)
      .sort()
      .at(-1) ?? "—";
  $("dataset-date").textContent = geojson.metadata?.updatedAt ?? maxOf((props) => props.updatedAt);
  $("presence-checked-date").textContent = maxOf((props) => props.presenceCheck.checkedAt);
  $("location-checked-date").textContent = maxOf((props) => props.location.checkedAt);
  $("checked-date").textContent = maxOf((props) => props.websiteCheck.checkedAt);
}

function showLoadingError() {
  el.visibleCount.textContent = "0";
  el.resultsCount.textContent = "0 results";
  $("dataset-date").textContent = "—";
  $("presence-checked-date").textContent = "—";
  $("location-checked-date").textContent = "—";
  $("checked-date").textContent = "—";
  const message = document.createElement("p");
  message.textContent =
    "Could not load the company data. Check your connection and reload the page.";
  el.results.replaceChildren(message);
}

async function loadEntities() {
  try {
    const response = await fetch("./data/entities.geojson");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const geojson = await response.json();
    entities = Array.isArray(geojson.features) ? geojson.features : [];
    for (const feature of entities) enrichFeature(feature);
    entitiesById = new Map(entities.map((feature) => [feature.properties.id, feature]));
    setDatasetDates(geojson);
    buildFilterControls();
    buildMarkersOnce();
    applySnapshot(history.state && typeof history.state.q === "string" ? history.state : undefined);
    ready = true;
    map.invalidateSize();
  } catch {
    showLoadingError();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  el.search = $("search");
  el.clearSearch = $("clear-search");
  el.sort = $("sort");
  el.results = $("results");
  el.resultsCount = $("results-count");
  el.visibleCount = $("visible-count");
  el.pagination = $("pagination");
  el.dialog = $("detail");
  el.detailContent = $("detail-content");
  el.closeDetail = $("close-detail");
  el.searchArea = $("search-area");
  el.showAllArea = $("show-all-area");
  el.mobileMapTab = $("mobile-map-tab");
  el.mobileListTab = $("mobile-list-tab");
  el.mobileFilterButton = $("mobile-filter-button");
  el.advancedFilters = $("advanced-filters");

  const bootstrap = new URLSearchParams(location.search);
  const initial = parseCenter(bootstrap);
  state.lat = initial.lat;
  state.lng = initial.lng;
  state.z = initial.z;

  initMap([initial.lat, initial.lng], initial.z);
  const bootstrapView = bootstrap.get("view");
  setMobileView(VIEW_VALUES.includes(bootstrapView) ? bootstrapView : "list", false);

  const runSearch = () => {
    state.q = el.search.value;
    currentPage = 1;
    rerender();
    replaceHistory();
  };
  el.search.addEventListener("input", debounce(runSearch, SEARCH_DEBOUNCE_MS));
  el.clearSearch.addEventListener("click", () => {
    el.search.value = "";
    runSearch();
    el.search.focus();
  });

  el.sort.addEventListener("change", () => {
    state.sort = el.sort.value;
    currentPage = 1;
    rerender();
    pushHistory();
  });

  for (const button of document.querySelectorAll("#sector-filters [data-sector]")) {
    button.addEventListener("click", () => {
      const sector = button.dataset.sector;
      if (state.sectors.has(sector)) state.sectors.delete(sector);
      else state.sectors.add(sector);
      syncSectorButtons();
      currentPage = 1;
      rerender();
      pushHistory();
    });
  }

  for (const button of document.querySelectorAll("[data-preset-contact]")) {
    button.addEventListener("click", () => {
      const preset = button.dataset.presetContact;
      state.preset = state.preset === preset ? null : preset;
      syncPresetButtons();
      currentPage = 1;
      rerender();
      pushHistory();
    });
  }

  $("reset-filters").addEventListener("click", () => clearAllFilters());

  el.searchArea.addEventListener("click", () => {
    if (!map) return;
    const bounds = map.getBounds();
    state.area = {
      w: bounds.getWest(),
      s: bounds.getSouth(),
      e: bounds.getEast(),
      n: bounds.getNorth(),
    };
    currentPage = 1;
    syncAreaButtons();
    rerender();
    pushHistory();
    areaButtonRevealed = false;
    el.searchArea.hidden = true;
  });

  el.showAllArea.addEventListener("click", () => {
    state.area = null;
    currentPage = 1;
    syncAreaButtons();
    rerender();
    pushHistory();
    areaButtonRevealed = false;
    el.searchArea.hidden = true;
  });

  el.closeDetail.addEventListener("click", () => el.dialog.close());
  el.dialog.addEventListener("click", (event) => {
    if (event.target === el.dialog) el.dialog.close();
  });
  el.dialog.addEventListener("close", () => {
    const intent = dialogCloseIntent;
    dialogCloseIntent = "dismiss";
    if (detailOpener && document.contains(detailOpener)) detailOpener.focus();
    detailOpener = null;
    if (intent !== "dismiss") return;
    if (!state.entityId) return;
    state.entityId = null;
    syncSelectionUI();
    pushHistory();
  });

  el.mobileMapTab.addEventListener("click", () => {
    if (state.view !== "map") {
      setMobileView("map", true);
      pushHistory();
    }
  });
  el.mobileListTab.addEventListener("click", () => {
    if (state.view !== "list") {
      setMobileView("list", false);
      pushHistory();
    }
  });
  el.mobileFilterButton.addEventListener("click", () => {
    el.advancedFilters.open = true;
    el.mobileFilterButton.setAttribute("aria-expanded", "true");
    if (state.view !== "list") {
      setMobileView("list", false);
      pushHistory();
    }
    requestAnimationFrame(() => {
      el.advancedFilters.scrollIntoView({ block: "start" });
      el.advancedFilters.querySelector("summary").focus();
    });
  });
  el.advancedFilters.addEventListener("toggle", () => {
    el.mobileFilterButton.setAttribute("aria-expanded", el.advancedFilters.open ? "true" : "false");
  });

  window.addEventListener("popstate", (event) => {
    applySnapshot(event.state && typeof event.state.q === "string" ? event.state : undefined);
  });

  loadEntities();
});
