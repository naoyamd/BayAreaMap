import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL, fileURLToPath } from 'node:url';

const SHARD_COUNT = 45;
const TIMEOUT_MS = 12000;
const CONCURRENCY = 3;
const USER_AGENT = 'BayAreaMap-Audit/1.0 (+https://github.com/naoyamd/BayAreaMap)';
const DATA_PATH = fileURLToPath(new URL('../data/entities.geojson', import.meta.url));

export function hashId(id) {
  let h = 0x811c9dc5;
  const s = String(id);
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

export function selectFeatures(features, { all = false, shard = null } = {}) {
  if (all) return features.filter(() => true);
  return features.filter((f) => hashId(f?.properties?.id ?? '') % SHARD_COUNT === shard);
}

function parseArgs(argv) {
  const opts = { all: false, shard: null };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--all') {
      if (opts.all) throw new Error('--all given more than once');
      opts.all = true;
    } else if (arg === '--shard') {
      if (opts.shard !== null) throw new Error('--shard given more than once');
      const raw = argv[++i];
      if (raw === undefined || !/^\d+$/.test(raw)) throw new Error('--shard requires an integer');
      const n = Number(raw);
      if (!Number.isInteger(n) || n < 0 || n >= SHARD_COUNT) {
        throw new Error(`--shard must be between 0 and ${SHARD_COUNT - 1}`);
      }
      opts.shard = n;
    } else {
      throw new Error(`unknown argument: ${arg}`);
    }
  }
  if (opts.all && opts.shard !== null) throw new Error('--all and --shard are mutually exclusive');
  return opts;
}

function utcToday() {
  return new Date().toISOString().slice(0, 10);
}

async function checkUrl(url) {
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { 'User-Agent': USER_AGENT },
    });
    const ok = res.status >= 200 && res.status <= 399;
    await res.body?.cancel().catch(() => {});
    return { ok, detail: `HTTP ${res.status}` };
  } catch (err) {
    const cause = err?.cause?.code ?? err?.cause?.message;
    const detail = cause ?? err?.message ?? 'network error';
    return { ok: false, detail };
  }
}

async function runPool(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
  return results;
}

async function audit(argv) {
  let opts;
  try {
    opts = parseArgs(argv);
  } catch (err) {
    console.error(err.message);
    console.error('Usage: node scripts/audit.mjs [--all | --shard N]   (N: 0..44)');
    process.exitCode = 1;
    return;
  }
  if (!opts.all && opts.shard === null) {
    opts.shard = Math.floor(Date.now() / 86400000) % SHARD_COUNT;
  }

  let geo;
  try {
    geo = JSON.parse(readFileSync(DATA_PATH, 'utf8'));
  } catch (err) {
    console.error(`failed to read/parse ${DATA_PATH}: ${err.message}`);
    process.exitCode = 1;
    return;
  }
  const features = geo?.features;
  if (!Array.isArray(features)) {
    console.error(`${DATA_PATH} is not a FeatureCollection with a features array`);
    process.exitCode = 1;
    return;
  }

  const selected = selectFeatures(features, opts);
  const date = utcToday();
  const shardLabel = opts.all ? 'all' : String(opts.shard);
  console.log(`BayAreaMap audit ${date} | shard: ${shardLabel} | selected: ${selected.length}`);

  let attempted = 0;
  let okCount = 0;
  let reviewCount = 0;

  await runPool(selected, CONCURRENCY, async (feature) => {
    const props = feature?.properties ?? {};
    const id = props.id ?? '(no id)';
    const url = props.sourceUrl || props.website;
    let status;
    let detail;

    attempted++;
    if (!url) {
      status = 'review';
      detail = 'missing url';
    } else {
      const result = await checkUrl(url);
      status = result.ok ? 'ok' : 'review';
      detail = result.detail;
    }
    props.checkedAt = date;
    props.checkStatus = status;
    if (status === 'ok') okCount++; else reviewCount++;

    console.log(`${status.padEnd(6)} ${id} ${detail}${url ? ` ${url}` : ''}`);
  });

  if (attempted > 0) {
    try {
      writeFileSync(DATA_PATH, `${JSON.stringify(geo, null, 2)}\n`);
    } catch (err) {
      console.error(`failed to write ${DATA_PATH}: ${err.message}`);
      process.exitCode = 1;
      return;
    }
  }

  console.log(
    `Summary: shard ${shardLabel} | selected ${selected.length} | attempted ${attempted} | ok ${okCount} | review ${reviewCount} | ${attempted > 0 ? 'wrote' : 'no changes written'}`,
  );
}

const isMain =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  audit(process.argv.slice(2)).catch((err) => {
    console.error(`audit failed: ${err.message}`);
    process.exitCode = 1;
  });
}
