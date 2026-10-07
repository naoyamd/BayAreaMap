#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { DEFAULT_BATCH_SIZE } from "./audit.mjs";

const DATA_PATH = fileURLToPath(new URL("../data/entities.geojson", import.meta.url));
const README_PATH = fileURLToPath(new URL("../README.md", import.meta.url));
const SITE_URL = "https://map.nightly.dedyn.io/";

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
  lines.push("", "バージョン2.0：企業探索・現所在確認・フィールドノートを統合したディレクトリです。");
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
    "- 各ピンは公式サイトのロゴ候補（favicon）を使った**正方形アイコン**です。縮小時は近隣企業を件数表示へまとめ、町レベルでは同一番地や都市中心の代表地点に集まったピンを展開します（8件以下は円形、9件以上はらせん）。日本関連は枠色、都市中心の概略位置はアイコンと接続線の破線、現所在未確認は琥珀色のマークで表示します。概略位置の展開は企業の実際の番地を示すものではありません。",
    "- **検索ボックス**で社名・日本語名・都市・企業紹介などのキーワードで絞り込めます。",
    "- **フィルター**で日系／タイプ／規模／業種／カウンティを組み合わせて絞り込めます（日系・大企業・製造業などのプリセットボタン付き）。",
    "- **Your field notebook**で企業を保存し、詳細パネルに個別メモを残せます。保存先は利用中のブラウザのlocalStorageです。保存・メモの同期は行いません。ストレージに保存できない場合は警告します。",
    "- **City / Around San Mateo**で都市やSan Mateoの中心から10・25・50km圏内に絞れます。概略位置の企業では距離も概算です。**Verified presence**は現在の所在確認済みだけを表示します。",
    "- **Shared offices** ボタンは、auto（全都市を番地ズームから自動展開）とexpanded（任意のズームで同一住所や都市代表地点の企業を個別表示）を切り替えます。縮小時の黄色い都市代表地点をクリックしても拡大・展開できます。縮小時の概数表示は番地ピンの背後に置かれます。",
    "- **Export results CSV**で絞り込み中の全件と個別メモ、確認出典を出力できます。日本語対応のUTF-8 BOM付きです。**Fit results**で表示対象が地図内に収まります。",
    "- 検索・都市・距離・地図範囲はURLで共有できます。保存リストとメモはブラウザごとの情報です。地図ライブラリが読み込めない場合も企業リストを利用できます。",
  );
  lines.push("");
  lines.push("## 所在地データ設計（schema v3）");
  lines.push("");
  lines.push(
    "- GeoJSON座標はWGS84の `[経度, 緯度]`。`location.precision` で番地単位（address）と都市中心（city）を区別します。",
    "- `location.status` は住所と座標の照合結果だけを表し、`presenceCheck` は現在もベイエリアに拠点がある根拠を別管理します。住所が座標化できただけでは現所在確認済みにしません。",
    "- `presenceCheck.status: review` は探索済みでも現在地を確定できる公式根拠がない状態です。`sourceUrl: null` の要確認は試行記録であり、確認済み件数には含めません。",
    "- `presenceCheck.sourceType: official-directory` はYC公式プロフィールが報告する都市を確認したものです。新規登録は都市中心で表示し、既存の番地は住所の出典と座標照合を別管理したまま保持します。YCプロフィールだけでは番地の現状を確認済みにしません。",
    "- `presenceCheck.sourceType: user-confirmed` はユーザー本人の明示的な現所在確認です。`userStatementDate` と `userStatement` を保存し、公式確認と混同しないよう `sourceUrl: null` と `supportingSourceUrl`（施設側の公開ページ）を分けて記録します。",
    "- 親会社のブランド名と現地法人・子会社名は同一視しません。公式の拠点・連絡先・グループ会社ページ内で、対象法人名と住所が同じ掲載区画にある場合だけ自動採用します。",
    "- `websiteCheck` はサイト疎通です。データ更新日・現所在確認日・座標照合日・URL確認日を分けて表示します。",
  );
  lines.push("");
  lines.push("## 最古優先監査");
  lines.push("");
  lines.push(
    `URL監査の試行日が未設定または最も古い${DEFAULT_BATCH_SIZE}件を6時間ごとに確認します。成功日（checkedAt）と試行日（attemptedAt）を分け、接続できない企業だけが毎回選ばれないようにします。約${Math.ceil(total / DEFAULT_BATCH_SIZE)}回で全件を一巡する規模です。フェーズごとに結果を保存し、個別企業の例外は他社の監査から切り離します。各社公式サイト内リンクに加えてrobots.txtのsitemapとJSON-LDから拠点・連絡先・グループ会社ページを探索します。法人名と住所を同時確認できた場合だけ番地へ昇格します。既存の番地も公式ページを探索して出典を補完し、根拠なしや退去疑いは「要確認」に留めます。一時的な取得障害で、以前の所在確認を降格させません。`,
  );
  lines.push(
    "GitHub Actionsの定期実行とは別に、既存のOpenClaw監視も利用しています。監査がデータを保存すると、完了イベントからPagesを再配信します。Issueの優先確認先を取得できなくても通常監査は進みます。公開用audit-report.jsonに試行数・新規確認数・取得失敗数などを残し、地図のData quality datesから最終完了レポートと実行履歴を参照できます。失敗時も監査レポートと途中のデータを14日間のartifactに保管します。Pagesには地図に必要な静的ファイルだけを配信します。",
  );
  lines.push("");
  lines.push("## Wikipedia候補探索（月次）");
  lines.push("");
  lines.push(
    "Wikipediaの Silicon Valley企業、Bay Areaテクノロジー企業、米国の無人航空機メーカー、大学、研究機関カテゴリを月1回だけ直列取得し、未掲載候補のJSONをGitHub Actions artifactへ保存します。Wikipediaは候補発見にだけ使い、自動登録はしません。現役で、地域的・産業的な重要性が高い大企業／上場企業／主要スタートアップ／大学・研究機関を選び、公式サイトで現住所を確認できたものだけGeoJSONへ採用します。",
  );
  lines.push("", "## YC企業の継続登録（週次）", "");
  lines.push("YC-OSSの公開ミラーは候補の発見に使います。登録前に各社のY Combinator公式プロフィールを取得し、企業の識別・営業状態・米国内のベイエリア都市を照合します。企業名やURLの重複を除いたうえで、週次ワークフローが新規企業を最大50件登録し、READMEと公開地図へ反映します。現在の公式プロフィールに根拠がない候補を、確認済みとして登録することはありません。企業紹介・業種・出典と確認日を保存し、番地の記載がない企業は都市中心で表示します。");
  lines.push("");
  lines.push("## ホスティング");
  lines.push("");
  lines.push(
    `独自ドメイン ${SITE_URL} を割り当てた GitHub Pages で公開しています。CSS/JS/データはすべて相対パスで参照しています。`,
  );
  lines.push("");
  lines.push("## 掲載候補の探索順");
  lines.push("");
  lines.push(
    "1. **候補発見**: WikipediaのSilicon Valley企業・Bay Areaテクノロジー企業・米国無人航空機メーカー・大学・研究機関カテゴリ（月次・直列・自動登録なし）",
    "2. **大手・地域主要企業**: Silicon Valley Leadership Group、Bay Area Council",
    "3. **日系企業**: Japan Society of Northern California、JCCNC、Japan Innovation Campus、METI・JETRO資料",
    "4. **スタートアップ**: Built In、Y Combinator、Berkeley SkyDeck、StartX、Alchemist",
    "5. **住所の努力確認**: 各社公式サイトを優先。退去疑いは自動削除せず要確認にします。CrunchbaseとWellfoundは直接クロールしません。",
  );
  lines.push("");
  lines.push("## 出典");
  lines.push("");
  lines.push(
    "- Silicon Valley Leadership Group Member Companies: <https://www.svlg.org/member-companies/>",
    "- Wikipedia Category:Companies based in Silicon Valley: <https://en.wikipedia.org/wiki/Category:Companies_based_in_Silicon_Valley>",
    "- Wikipedia Category:Technology companies based in the San Francisco Bay Area: <https://en.wikipedia.org/wiki/Category:Technology_companies_based_in_the_San_Francisco_Bay_Area>",
    "- Wikipedia Category:Unmanned aerial vehicle manufacturers of the United States: <https://en.wikipedia.org/wiki/Category:Unmanned_aerial_vehicle_manufacturers_of_the_United_States>",
    "- Wikipedia Category:Universities and colleges in the San Francisco Bay Area: <https://en.wikipedia.org/wiki/Category:Universities_and_colleges_in_the_San_Francisco_Bay_Area>",
    "- Wikipedia Category:Research institutes in the San Francisco Bay Area: <https://en.wikipedia.org/wiki/Category:Research_institutes_in_the_San_Francisco_Bay_Area>",
    "- Japan Society of Northern California Corporate Members: <https://www.usajapan.org/about/corporate-members/>",
    "- JETRO「ベイエリア進出日本企業調査報告書」: <https://www.jetro.go.jp/usa/topics/survey-report-on-japan-based-companies-operating-in-the-san-francisco-bay-area.html>",
    "- シリコンバレー・サンフランシスコ進出の大手日系企業52社【2024年以降】: <https://blog.nightly.dedyn.io/daily/2026-08-05-japanese-companies-silicon-valley-2024/>",
    "- sf-companies（theShiva）: <https://github.com/theShiva/sf-companies>",
    "- Y Combinator公式企業ディレクトリ（都市レベルの現所在根拠）: <https://www.ycombinator.com/companies>",
    "- YC-OSS API（候補発見用ミラー、確認根拠は各社のYC公式プロフィール）: <https://yc-oss.github.io/api/companies/all.json>",
  );
  lines.push("");
  lines.push("## ローカルコマンド");
  lines.push("");
  lines.push("```sh", "npm test                     # テストとデータ検証");
  lines.push("npm run readme               # README.md 再生成");
  lines.push(`npm run audit                # 未確認・最古の${DEFAULT_BATCH_SIZE}件を監査`);
  lines.push("npm run audit -- --shard 0   # シャード0のデータ監査");
  lines.push("npm run audit -- --all       # 全件のデータ監査");
  lines.push("npm run audit -- --all --city-only # 都市中心データだけ住所探索");
  lines.push("npm run discover:wikipedia    # Wikipediaから未掲載候補を生成（データへは自動登録しない）");
  lines.push("npm run discover:yc           # YCの未掲載候補をwork/へ出力");
  lines.push("npm run import:yc             # YC公式プロフィール照合後に企業を追加");
  lines.push("npm run import:yc -- --limit=50 # 追加件数を制限して登録・既存情報を照合");
  lines.push('npm run audit -- --all --city-only --city "San Francisco" # 都市を絞って住所探索', "```");
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
