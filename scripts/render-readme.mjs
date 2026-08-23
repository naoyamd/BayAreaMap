#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const DATA_PATH = fileURLToPath(new URL("../data/entities.geojson", import.meta.url));
const README_PATH = fileURLToPath(new URL("../README.md", import.meta.url));
const SITE_URL = "https://naoyamd.github.io/BayAreaMap/";

const MFG_INDUSTRIES = new Set([
  "manufacturing",
  "automotive",
  "electronics",
  "robotics",
  "semiconductors",
]);

const TYPE_LABELS = {
  company: "企業",
  "vc-cvc": "VC・CVC",
  support: "支援機関",
  "university-research": "大学・研究機関",
};

const SCALE_LABELS = {
  startup: "スタートアップ",
  growth: "グロース",
  large: "大規模",
  "not-applicable": "該当なし",
};

const STATUS_LABELS = {
  ok: "確認済み",
  review: "要確認",
  unchecked: "未確認",
};

const LOCATION_PRECISION_LABELS = {
  address: "番地単位",
  city: "都市中心（概略）",
};

const LOCATION_STATUS_LABELS = {
  unchecked: "未照合",
  matched: "住所・座標一致",
  review: "要確認",
};

const PRESENCE_STATUS_LABELS = {
  unchecked: "未確認",
  verified: "確認済み",
  review: "要確認",
};

const SHARD_COUNT = 45;

function escText(value) {
  return String(value ?? "")
    .replace(/\r\n|\r|\n/g, " ")
    .replace(/([\\[\]|])/g, "\\$1");
}

function cell(value) {
  return String(value ?? "")
    .replace(/\r\n|\r|\n/g, " ")
    .replace(/\|/g, "\\|");
}

function mdLink(label, url) {
  if (!url) return escText(label);
  const safe = url.replace(/ /g, "%20").replace(/\(/g, "%28").replace(/\)/g, "%29");
  return `[${escText(label)}](${safe})`;
}

function isJapanLinked(props) {
  return Boolean(props.japanConnection) && props.japanConnection !== "none";
}

function maxOf(features, read) {
  return features.reduce((max, feature) => {
    const v = String(read(feature) ?? "");
    return v > max ? v : max;
  }, "");
}

function render(entities, metadata) {
  const total = entities.length;
  const japanLinked = entities.filter((p) => isJapanLinked(p)).length;
  const large = entities.filter((p) => p.scale === "large").length;
  const mfgRelated = entities.filter((p) =>
    (p.industries ?? []).some((s) => MFG_INDUSTRIES.has(String(s).toLowerCase())),
  ).length;
  const nonCompany = entities.filter(
    (p) => p.entityType && p.entityType !== "company",
  ).length;
  const counties = [...new Set(entities.map((p) => p.location.county).filter(Boolean))].sort();
  const addressPrecision = entities.filter((p) => p.location.precision === "address").length;
  const cityPrecision = entities.filter((p) => p.location.precision === "city").length;
  const verifiedPresence = entities.filter((p) => p.presenceCheck.status === "verified").length;
  const updatedAt = metadata?.updatedAt || maxOf(entities, (p) => p.updatedAt) || "—";
  const checkedAt = maxOf(entities, (p) => p.websiteCheck.checkedAt) || "—";
  const locationCheckedAt = maxOf(entities, (p) => p.location.checkedAt) || "—";
  const presenceCheckedAt = maxOf(entities, (p) => p.presenceCheck.checkedAt) || "—";

  const lines = [];
  lines.push("# ベイエリア企業マップ");
  lines.push("");
  lines.push(`**公開URL: <${SITE_URL}>**`);
  lines.push("");
  lines.push(
    "サンフランシスコ・ベイエリアの日本関連企業・VC/CVC・支援機関・大学などを地図上に可視化する個人プロジェクトです。ベイエリア進出検討時の初回コンタクト先の把握を目的としています。",
  );
  lines.push("");
  lines.push(
    "> [!WARNING]",
    "> 本データは個人的な利用を想定してゆるく管理しているものです。正確性・網羅性・鮮度は保証しません。実務で使う場合は必ず各社の公式情報をご確認ください。",
  );
  lines.push("");
  lines.push("## データサマリ");
  lines.push("");
  lines.push(`- データ更新日: ${updatedAt}`);
  lines.push(`- 現所在確認日: ${presenceCheckedAt}`);
  lines.push(`- 座標照合日: ${locationCheckedAt}`);
  lines.push(`- URL確認日: ${checkedAt}`);
  lines.push(`- 掲載件数: ${total}件`);
  lines.push(`- 日本関連: ${japanLinked}件`);
  lines.push(`- 大規模（scale: large）: ${large}件`);
  lines.push(`- 製造業関連: ${mfgRelated}件`);
  lines.push(`- 企業以外（VC/CVC・支援機関・大学など）: ${nonCompany}件`);
  lines.push(`- 位置精度: 番地単位 ${addressPrecision}件／都市中心の概略位置 ${cityPrecision}件`);
  lines.push(`- 現在のベイエリア所在を確認済み: ${verifiedPresence}件`);
  lines.push(`- 対象カウンティ: 全${counties.length}カウンティ（${counties.join("・")}）`);
  lines.push("");
  lines.push("## 初回コンタクトの目安");
  lines.push("");
  lines.push(
    "1. **JETRO San Francisco / Global Acceleration Hub** と **Japan Innovation Campus**",
    "2. **Plug and Play Tech Center** と **500 Global**",
    "3. **Stanford / UC Berkeley** 系エコシステム、主要VC、日本人コミュニティ",
  );
  lines.push("");
  lines.push("## 使い方");
  lines.push("");
  lines.push(
    "- 各ピンは公式サイトのロゴ候補（apple-touch-icon / favicon）を使った**正方形アイコン**です。縮小時は近隣企業を件数表示へまとめ、町レベルでは同一座標のピンだけを自動で放射展開します。日本関連は枠色、都市中心の概略位置は破線、現所在未確認は淡色で表示します。",
    "- **検索ボックス**で社名・日本語名・都市などのキーワードで絞り込めます。",
    "- **フィルター**で日系／タイプ／規模／業種／カウンティを組み合わせて絞り込めます（日系・大企業・製造業などのプリセットボタン付き）。",
  );
  lines.push("");
  lines.push("## 所在地データ設計（schema v3）");
  lines.push("");
  lines.push(
    "- GeoJSON座標はWGS84の `[経度, 緯度]`。`location.precision` で番地単位（address）と都市中心（city）を区別します。",
    "- `location.status` は住所と座標の照合結果だけを表し、`presenceCheck` は現在もベイエリアに拠点がある根拠を別管理します。住所が座標化できただけでは現所在確認済みにしません。",
    "- 親会社のブランド名と現地法人・子会社名は同一視しません。公式の拠点・連絡先・グループ会社ページ内で、対象法人名と住所が同じ掲載区画にある場合だけ自動採用します。",
    "- `websiteCheck` はサイト疎通です。データ更新日・現所在確認日・座標照合日・URL確認日を分けて表示します。",
  );
  lines.push("");
  lines.push("## 分散監査（シャード方式）");
  lines.push("");
  lines.push(
    `各エンティティIDのハッシュで全件を${SHARD_COUNT}シャードに決定論的に分割し、毎日1シャード分を確認します。約1.5か月で全件を一巡し、各社公式サイトの拠点・連絡先・グループ会社ページを探索します。同じ都市というだけでは採用せず、法人名と住所を同時確認できた場合だけ番地へ昇格します。既存の番地も公式ページを探索して出典を補完し、退去疑いで自動削除はせず「要確認」に留めます。`,
  );
  lines.push("");
  lines.push("## ホスティング");
  lines.push("");
  lines.push(
    `現在は GitHub Pages（${SITE_URL}）で公開されています。将来の独自ドメイン移行に備え、CSS/JS/データはすべて相対パスで参照しています。`,
  );
  lines.push("");
  lines.push("## 掲載候補の探索順");
  lines.push("");
  lines.push(
    "1. **大手・地域主要企業**: Silicon Valley Leadership Group、Bay Area Council",
    "2. **日系企業**: Japan Society of Northern California、JCCNC、Japan Innovation Campus、METI・JETRO資料",
    "3. **スタートアップ**: Built In、Y Combinator、Berkeley SkyDeck、StartX、Alchemist",
    "4. **住所の努力確認**: 各社公式サイトを優先。退去疑いは自動削除せず要確認にします。CrunchbaseとWellfoundは直接クロールしません。",
  );
  lines.push("");
  lines.push("## 出典");
  lines.push("");
  lines.push(
    "- Silicon Valley Leadership Group Member Companies: <https://www.svlg.org/member-companies/>",
    "- Japan Society of Northern California Corporate Members: <https://www.usajapan.org/about/corporate-members/>",
    "- JETRO「ベイエリア進出日本企業調査報告書」: <https://www.jetro.go.jp/usa/topics/survey-report-on-japan-based-companies-operating-in-the-san-francisco-bay-area.html>",
    "- シリコンバレー・サンフランシスコ進出の大手日系企業52社【2024年以降】: <https://blog.nightly.dedyn.io/daily/2026-08-05-japanese-companies-silicon-valley-2024/>",
    "- sf-companies（theShiva）: <https://github.com/theShiva/sf-companies>",
  );
  lines.push("");
  lines.push("## ローカルコマンド");
  lines.push("");
  lines.push("```sh", "npm test                     # テストとデータ検証");
  lines.push("npm run readme               # README.md 再生成");
  lines.push("npm run audit -- --shard 0   # シャード0のデータ監査");
  lines.push("npm run audit -- --all       # 全件のデータ監査");
  lines.push("npm run audit -- --all --city-only # 都市中心データだけ住所探索", "```");
  lines.push("");
  lines.push("## 掲載データ一覧");
  lines.push("");
  lines.push(
    "| 日系 | 名称 | タイプ | 規模 | 都市／カウンティ | 業種 | 位置精度 | 現所在確認 | 座標照合 | URL確認 | 更新日 |",
  );
  lines.push("| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |");

  for (const p of entities) {
    const nameCell = mdLink(p.name, p.website);
    const row = [
      isJapanLinked(p) ? "○" : "",
      nameCell,
      cell(TYPE_LABELS[p.entityType] ?? p.entityType),
      cell(SCALE_LABELS[p.scale] ?? p.scale),
      cell([p.location.city, p.location.county].filter(Boolean).join("／")),
      cell((p.industries ?? []).join(", ")),
      cell(LOCATION_PRECISION_LABELS[p.location.precision] ?? p.location.precision),
      cell(`${PRESENCE_STATUS_LABELS[p.presenceCheck.status] ?? p.presenceCheck.status}（${p.presenceCheck.checkedAt || "—"}）`),
      cell(`${LOCATION_STATUS_LABELS[p.location.status] ?? p.location.status}（${p.location.checkedAt || "—"}）`),
      cell(`${STATUS_LABELS[p.websiteCheck.status] ?? p.websiteCheck.status}（${p.websiteCheck.checkedAt || "—"}）`),
      cell(p.updatedAt),
    ];
    lines.push(`| ${row.join(" | ")} |`);
  }
  lines.push("");

  return lines.join("\n");
}

function main() {
  const args = process.argv.slice(2);
  const checkOnly = args.includes("--check");
  if (args.some((a) => a !== "--check")) {
    console.error("Usage: node scripts/render-readme.mjs [--check]");
    process.exitCode = 1;
    return;
  }

  let geo;
  try {
    geo = JSON.parse(readFileSync(DATA_PATH, "utf8"));
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

  const collator = new Intl.Collator("en", { sensitivity: "base", numeric: true });
  const entities = features
    .map((f) => f.properties ?? {})
    .sort(
      (a, b) =>
        Number(isJapanLinked(b)) - Number(isJapanLinked(a)) ||
        collator.compare(String(a.name ?? ""), String(b.name ?? "")) ||
        collator.compare(String(a.id ?? ""), String(b.id ?? "")),
    );

  const markdown = render(entities, geo.metadata);

  if (checkOnly) {
    let current;
    try {
      current = readFileSync(README_PATH, "utf8");
    } catch {
      console.error(`STALE: ${README_PATH} does not exist (run without --check to generate)`);
      process.exitCode = 1;
      return;
    }
    if (current === markdown) {
      console.log(`OK: README.md is up to date (${entities.length} entities)`);
    } else {
      console.error(`STALE: README.md does not match generated output (${entities.length} entities); run "npm run readme"`);
      process.exitCode = 1;
    }
    return;
  }

  writeFileSync(README_PATH, markdown);
  console.log(`Wrote README.md (${entities.length} entities)`);
}

main();
