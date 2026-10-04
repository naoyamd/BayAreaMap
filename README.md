# ベイエリア企業マップ

**公開URL: <https://map.nightly.dedyn.io/>**

バージョン2.0：企業探索・現所在確認・フィールドノートを統合したディレクトリです。

サンフランシスコ・ベイエリアの日本関連企業・VC/CVC・支援機関・大学などを地図上に可視化する個人プロジェクトです。ベイエリア進出検討時の初回コンタクト先の把握を目的としています。

> [!WARNING]
> 本データは個人的な利用を想定してゆるく管理しているものです。正確性・網羅性・鮮度は保証しません。実務で使う場合は必ず各社の公式情報をご確認ください。

## データサマリ

- データ更新日: 2026-10-04
- 現所在確認日: 2026-10-04
- 座標照合日: 2026-10-04
- URL確認日: 2026-10-04
- 掲載件数: 984件
- 日本関連: 130件
- 大規模（scale: large）: 258件
- 製造業関連: 111件
- 企業以外（VC/CVC・支援機関・大学など）: 30件
- 位置精度: 番地単位 462件／都市中心の概略位置 522件
- 現在のベイエリア所在を確認済み: 624件
- 対象カウンティ: 全9カウンティ（Alameda County・Contra Costa County・Marin County・Napa County・San Francisco County・San Mateo County・Santa Clara County・Solano County・Sonoma County）

## 初回コンタクトの目安

1. **JETRO San Francisco / Global Acceleration Hub** と **Japan Innovation Campus**
2. **Plug and Play Tech Center** と **500 Global**
3. **Stanford / UC Berkeley** 系エコシステム、主要VC、日本人コミュニティ

## 使い方

- 各ピンは公式サイトのロゴ候補（favicon）を使った**正方形アイコン**です。縮小時は近隣企業を件数表示へまとめ、町レベルでは同一番地のピンを展開します（8件以下は円形、9件以上はらせん）。日本関連は枠色、都市中心の概略位置は破線、現所在未確認は琥珀色のマークで表示します。都市中心のピンは番地のように展開しません。
- **検索ボックス**で社名・日本語名・都市・企業紹介などのキーワードで絞り込めます。
- **フィルター**で日系／タイプ／規模／業種／カウンティを組み合わせて絞り込めます（日系・大企業・製造業などのプリセットボタン付き）。
- **Your field notebook**で企業を保存し、詳細パネルに個別メモを残せます。保存先は利用中のブラウザのlocalStorageです。保存・メモの同期は行いません。ストレージに保存できない場合は警告します。
- **City / Around San Mateo**で都市やSan Mateoの中心から10・25・50km圏内に絞れます。概略位置の企業では距離も概算です。**Verified presence**は現在の所在確認済みだけを表示します。
- **Shared offices** ボタンは、auto（全都市を番地ズームから自動展開）とexpanded（任意のズームで同一住所の企業を個別表示）を切り替えます。都市中心の概数表示は番地ピンの背後に置かれます。
- **Export results CSV**で絞り込み中の全件と個別メモ、確認出典を出力できます。日本語対応のUTF-8 BOM付きです。**Fit results**で表示対象が地図内に収まります。
- 検索・都市・距離・地図範囲はURLで共有できます。保存リストとメモはブラウザごとの情報です。地図ライブラリが読み込めない場合も企業リストを利用できます。

## 所在地データ設計（schema v3）

- GeoJSON座標はWGS84の `[経度, 緯度]`。`location.precision` で番地単位（address）と都市中心（city）を区別します。
- `location.status` は住所と座標の照合結果だけを表し、`presenceCheck` は現在もベイエリアに拠点がある根拠を別管理します。住所が座標化できただけでは現所在確認済みにしません。
- `presenceCheck.status: review` は探索済みでも現在地を確定できる公式根拠がない状態です。`sourceUrl: null` の要確認は試行記録であり、確認済み件数には含めません。
- `presenceCheck.sourceType: official-directory` はYC公式プロフィールが報告する都市を確認したものです。新規登録は都市中心で表示し、既存の番地は住所の出典と座標照合を別管理したまま保持します。YCプロフィールだけでは番地の現状を確認済みにしません。
- `presenceCheck.sourceType: user-confirmed` はユーザー本人の明示的な現所在確認です。`userStatementDate` と `userStatement` を保存し、公式確認と混同しないよう `sourceUrl: null` と `supportingSourceUrl`（施設側の公開ページ）を分けて記録します。
- 親会社のブランド名と現地法人・子会社名は同一視しません。公式の拠点・連絡先・グループ会社ページ内で、対象法人名と住所が同じ掲載区画にある場合だけ自動採用します。
- `websiteCheck` はサイト疎通です。データ更新日・現所在確認日・座標照合日・URL確認日を分けて表示します。

## 最古優先監査

URL監査の試行日が未設定または最も古い75件を6時間ごとに確認します。成功日（checkedAt）と試行日（attemptedAt）を分け、接続できない企業だけが毎回選ばれないようにします。約14回で全件を一巡する規模です。フェーズごとに結果を保存し、個別企業の例外は他社の監査から切り離します。各社公式サイト内リンクに加えてrobots.txtのsitemapとJSON-LDから拠点・連絡先・グループ会社ページを探索します。法人名と住所を同時確認できた場合だけ番地へ昇格します。既存の番地も公式ページを探索して出典を補完し、根拠なしや退去疑いは「要確認」に留めます。一時的な取得障害で、以前の所在確認を降格させません。
GitHub Actionsの定期実行とは別に、既存のOpenClaw監視も利用しています。監査がデータを保存すると、完了イベントからPagesを再配信します。Issueの優先確認先を取得できなくても通常監査は進みます。公開用audit-report.jsonに試行数・新規確認数・取得失敗数などを残し、地図のData quality datesから最終完了レポートと実行履歴を参照できます。失敗時も監査レポートと途中のデータを14日間のartifactに保管します。Pagesには地図に必要な静的ファイルだけを配信します。

## Wikipedia候補探索（月次）

Wikipediaの Silicon Valley企業、Bay Areaテクノロジー企業、米国の無人航空機メーカー、大学、研究機関カテゴリを月1回だけ直列取得し、未掲載候補のJSONをGitHub Actions artifactへ保存します。Wikipediaは候補発見にだけ使い、自動登録はしません。現役で、地域的・産業的な重要性が高い大企業／上場企業／主要スタートアップ／大学・研究機関を選び、公式サイトで現住所を確認できたものだけGeoJSONへ採用します。

## YC企業の継続登録（週次）

YC-OSSの公開ミラーは候補の発見に使います。登録前に各社のY Combinator公式プロフィールを取得し、企業の識別・営業状態・米国内のベイエリア都市を照合します。企業名やURLの重複を除いたうえで、週次ワークフローが新規企業を最大50件登録し、READMEと公開地図へ反映します。現在の公式プロフィールに根拠がない候補を、確認済みとして登録することはありません。企業紹介・業種・出典と確認日を保存し、番地の記載がない企業は都市中心で表示します。

## ホスティング

独自ドメイン https://map.nightly.dedyn.io/ を割り当てた GitHub Pages で公開しています。CSS/JS/データはすべて相対パスで参照しています。

## 掲載候補の探索順

1. **候補発見**: WikipediaのSilicon Valley企業・Bay Areaテクノロジー企業・米国無人航空機メーカー・大学・研究機関カテゴリ（月次・直列・自動登録なし）
2. **大手・地域主要企業**: Silicon Valley Leadership Group、Bay Area Council
3. **日系企業**: Japan Society of Northern California、JCCNC、Japan Innovation Campus、METI・JETRO資料
4. **スタートアップ**: Built In、Y Combinator、Berkeley SkyDeck、StartX、Alchemist
5. **住所の努力確認**: 各社公式サイトを優先。退去疑いは自動削除せず要確認にします。CrunchbaseとWellfoundは直接クロールしません。

## 出典

- Silicon Valley Leadership Group Member Companies: <https://www.svlg.org/member-companies/>
- Wikipedia Category:Companies based in Silicon Valley: <https://en.wikipedia.org/wiki/Category:Companies_based_in_Silicon_Valley>
- Wikipedia Category:Technology companies based in the San Francisco Bay Area: <https://en.wikipedia.org/wiki/Category:Technology_companies_based_in_the_San_Francisco_Bay_Area>
- Wikipedia Category:Unmanned aerial vehicle manufacturers of the United States: <https://en.wikipedia.org/wiki/Category:Unmanned_aerial_vehicle_manufacturers_of_the_United_States>
- Wikipedia Category:Universities and colleges in the San Francisco Bay Area: <https://en.wikipedia.org/wiki/Category:Universities_and_colleges_in_the_San_Francisco_Bay_Area>
- Wikipedia Category:Research institutes in the San Francisco Bay Area: <https://en.wikipedia.org/wiki/Category:Research_institutes_in_the_San_Francisco_Bay_Area>
- Japan Society of Northern California Corporate Members: <https://www.usajapan.org/about/corporate-members/>
- JETRO「ベイエリア進出日本企業調査報告書」: <https://www.jetro.go.jp/usa/topics/survey-report-on-japan-based-companies-operating-in-the-san-francisco-bay-area.html>
- シリコンバレー・サンフランシスコ進出の大手日系企業52社【2024年以降】: <https://blog.nightly.dedyn.io/daily/2026-08-05-japanese-companies-silicon-valley-2024/>
- sf-companies（theShiva）: <https://github.com/theShiva/sf-companies>
- Y Combinator公式企業ディレクトリ（都市レベルの現所在根拠）: <https://www.ycombinator.com/companies>
- YC-OSS API（候補発見用ミラー、確認根拠は各社のYC公式プロフィール）: <https://yc-oss.github.io/api/companies/all.json>

## ローカルコマンド

```sh
npm test                     # テストとデータ検証
npm run readme               # README.md 再生成
npm run audit                # 未確認・最古の75件を監査
npm run audit -- --shard 0   # シャード0のデータ監査
npm run audit -- --all       # 全件のデータ監査
npm run audit -- --all --city-only # 都市中心データだけ住所探索
npm run discover:wikipedia    # Wikipediaから未掲載候補を生成（データへは自動登録しない）
npm run discover:yc           # YCの未掲載候補をwork/へ出力
npm run import:yc             # YC公式プロフィール照合後に企業を追加
npm run import:yc -- --limit=50 # 追加件数を制限して登録・既存情報を照合
npm run audit -- --all --city-only --city "San Francisco" # 都市を絞って住所探索
```

## 掲載データ一覧

| 日系 | 名称 | タイプ | 規模 | 都市／カウンティ | 業種 | 位置精度 | 現所在確認 | 座標照合 | URL確認 | 更新日 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ○ | [500 Global](https://500.co/) | VC・CVC | 大規模 | San Francisco／San Francisco County | venture-capital, accelerator, startup-education | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
| ○ | [Acario Innovation / Tokyo Gas](https://acarioinnovation.com/) | 企業 | 大規模 | San Mateo／San Mateo County | energy, venture-capital | 番地単位 | 確認済み（2026-10-03） | 住所・座標一致（2026-10-03） | 確認済み（2026-09-30） | 2026-10-03 |
| ○ | [Advantest America](https://www.advantest.com) | 企業 | 大規模 | San Jose／Santa Clara County | semiconductors, manufacturing | 番地単位 | 確認済み（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
| ○ | [Aflac Ventures](https://www.aflacventures.com/) | 企業 | 大規模 | Palo Alto／Santa Clara County | venture-capital, insurance | 都市中心（概略） | 要確認（2026-09-30） | 未照合（—） | 確認済み（2026-09-30） | 2026-09-30 |
| ○ | [AGC Electronics America](https://www.agc.com/) | 企業 | 大規模 | San Jose／Santa Clara County | materials, manufacturing | 都市中心（概略） | 要確認（2026-09-30） | 未照合（—） | 確認済み（2026-09-30） | 2026-09-30 |
| ○ | [Alps Alpine North America](https://www.alpsalpine.com/) | 企業 | 大規模 | San Jose／Santa Clara County | electronics, automotive | 都市中心（概略） | 要確認（2026-09-30） | 未照合（—） | 確認済み（2026-09-30） | 2026-09-30 |
| ○ | [Anritsu Company](https://www.anritsu.com/en-us/) | 企業 | 大規模 | Morgan Hill／Santa Clara County | telecommunications, manufacturing | 都市中心（概略） | 要確認（2026-09-30） | 未照合（—） | 要確認（2026-09-30） | 2026-09-30 |
| ○ | [Astellas South San Francisco](https://www.astellas.com/us/) | 企業 | 大規模 | South San Francisco／San Mateo County | biotechnology, life-sciences | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
| ○ | [Autify](https://autify.com/) | 企業 | グロース | San Francisco／San Francisco County | software, ai | 番地単位 | 確認済み（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
| ○ | [Azbil North America](https://www.azbil.com/) | 企業 | 大規模 | Santa Clara／Santa Clara County | automation, manufacturing | 都市中心（概略） | 要確認（2026-09-30） | 未照合（—） | 確認済み（2026-09-30） | 2026-09-30 |
| ○ | [Canon USA](https://www.usa.canon.com/) | 企業 | 大規模 | San Jose／Santa Clara County | imaging, electronics | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 要確認（2026-09-30） | 2026-09-30 |
| ○ | [Chugai Pharmabody Research](https://www.chugai-pharmabody.com/) | 企業 | 大規模 | South San Francisco／San Mateo County | biotechnology, life-sciences | 都市中心（概略） | 要確認（2026-09-30） | 未照合（—） | 確認済み（2026-09-30） | 2026-09-30 |
| ○ | [Dai-ichi Life Innovation Lab Silicon Valley](https://www.dai-ichi-life-hd.com/en/) | 企業 | 大規模 | Palo Alto／Santa Clara County | insurance, innovation | 都市中心（概略） | 要確認（2026-09-30） | 未照合（—） | 確認済み（2026-09-30） | 2026-09-30 |
| ○ | [Daiwa Capital Markets America San Francisco](https://us.daiwacm.com/) | 企業 | 大規模 | San Francisco／San Francisco County | finance, securities | 番地単位 | 確認済み（2026-08-23） | 住所・座標一致（2026-09-30） | 要確認（2026-09-30） | 2026-08-23 |
| ○ | [DENSO Silicon Valley Innovation Center](https://www.denso.com/us-ca/en/) | 企業 | 大規模 | Palo Alto／Santa Clara County | automotive, manufacturing | 番地単位 | 確認済み（2026-10-03） | 住所・座標一致（2026-10-03） | 要確認（2026-09-30） | 2026-10-03 |
| ○ | [DISCO Hi-Tec America](https://www.disco.co.jp/eg/) | 企業 | 大規模 | Santa Clara／Santa Clara County | semiconductors, manufacturing | 都市中心（概略） | 要確認（2026-09-30） | 未照合（—） | 確認済み（2026-09-30） | 2026-09-30 |
| ○ | [dotData](https://dotdata.com/) | 企業 | 大規模 | San Mateo／San Mateo County | ai, data | 番地単位 | 確認済み（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
| ○ | [ENEOS Silicon Valley](https://www.hd.eneos-hd.co.jp/english/) | 企業 | 大規模 | San Mateo／San Mateo County | energy, materials | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 要確認（2026-09-30） | 2026-09-30 |
| ○ | [Epson America](https://epson.com/) | 企業 | 大規模 | San Jose／Santa Clara County | imaging, electronics | 都市中心（概略） | 要確認（2026-09-30） | 未照合（—） | 確認済み（2026-09-30） | 2026-09-30 |
| ○ | [EXEDY Silicon Valley](https://www.exedy.com/en/) | 企業 | 大規模 | San Mateo／San Mateo County | automotive, manufacturing | 番地単位 | 要確認（2026-10-01） | 住所・座標一致（2026-10-01） | 確認済み（2026-10-01） | 2026-10-01 |
| ○ | [FANUC America](https://www.fanucamerica.com/) | 企業 | 大規模 | Union City／Alameda County | robotics, manufacturing | 都市中心（概略） | 要確認（2026-10-01） | 未照合（—） | 確認済み（2026-10-01） | 2026-10-01 |
| ○ | [FUJIFILM Dimatix](https://www.fujifilm.com/fdmx/en/) | 企業 | 大規模 | Santa Clara／Santa Clara County | industrial-printing, electronics, manufacturing | 番地単位 | 確認済み（2026-10-01） | 住所・座標一致（2026-10-01） | 確認済み（2026-10-01） | 2026-10-01 |
| ○ | [Fujitsu North America](https://www.fujitsu.com/us) | 企業 | 大規模 | Sunnyvale／Santa Clara County | electronics, software | 都市中心（概略） | 要確認（2026-10-03） | 未照合（—） | 要確認（2026-10-01） | 2026-10-03 |
| ○ | [Furukawa Electric North America Bay Area](https://www.furukawa.co.jp/en/) | 企業 | 大規模 | San Jose／Santa Clara County | electronics, manufacturing | 都市中心（概略） | 要確認（2026-10-01） | 未照合（—） | 確認済み（2026-10-01） | 2026-10-01 |
| ○ | [Hakuhodo DY Group / Irep](https://www.hakuhodody-holdings.co.jp/english/) | 企業 | 大規模 | San Mateo／San Mateo County | advertising, marketing | 番地単位 | 要確認（2026-10-01） | 住所・座標一致（2026-10-01） | 確認済み（2026-10-01） | 2026-10-01 |
| ○ | [Hitachi America](https://www.hitachi.us) | 企業 | 大規模 | Santa Clara／Santa Clara County | electronics, industrial | 番地単位 | 確認済み（2026-10-03） | 住所・座標一致（2026-10-03） | 確認済み（2026-10-01） | 2026-10-03 |
| ○ | [Honda Innovations Silicon Valley](https://www.honda.com/innovation) | 企業 | 大規模 | Mountain View／Santa Clara County | automotive, innovation | 番地単位 | 確認済み（2026-10-03） | 住所・座標一致（2026-10-03） | 要確認（2026-10-01） | 2026-10-03 |
| ○ | [Honda Research Institute USA](https://usa.honda-ri.com) | 企業 | 大規模 | San Jose／Santa Clara County | automotive, robotics | 番地単位 | 確認済み（2026-10-01） | 住所・座標一致（2026-10-01） | 確認済み（2026-10-01） | 2026-10-01 |
| ○ | [HORIBA Instruments Bay Area](https://www.horiba.com/usa/) | 企業 | 大規模 | Sunnyvale／Santa Clara County | scientific-instruments, manufacturing | 番地単位 | 確認済み（2026-10-01） | 住所・座標一致（2026-10-01） | 確認済み（2026-10-01） | 2026-10-01 |
| ○ | [HOYA Corporation USA](https://www.hoya.com/) | 企業 | 大規模 | Milpitas／Santa Clara County | optics, manufacturing | 番地単位 | 確認済み（2026-10-01） | 住所・座標一致（2026-10-01） | 確認済み（2026-10-01） | 2026-10-01 |
| ○ | [Idemitsu Americas](https://idemitsuamericas.com/) | 企業 | 大規模 | San Jose／Santa Clara County | energy, materials, manufacturing | 番地単位 | 確認済み（2026-10-01） | 住所・座標一致（2026-10-01） | 確認済み（2026-10-01） | 2026-10-01 |
| ○ | [IHI](https://www.ihi.co.jp/en/) | 企業 | 大規模 | San Mateo／San Mateo County | industrial, manufacturing, aerospace, defense, space | 番地単位 | 確認済み（2026-10-03） | 住所・座標一致（2026-09-29） | 確認済み（2026-10-03） | 2026-10-03 |
| ○ | [Innovation Core SEI](https://sumitomoelectric.com/) | 企業 | 大規模 | San Jose／Santa Clara County | electronics, materials, manufacturing | 番地単位 | 確認済み（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
| ○ | [ITOCHU International](https://www.itochu.com/us/en/) | 企業 | 大規模 | Menlo Park／San Mateo County | trading, investment | 番地単位 | 確認済み（2026-10-01） | 住所・座標一致（2026-10-01） | 確認済み（2026-10-01） | 2026-10-01 |
| ○ | [Japan Innovation Campus](https://jp-innovation-campus.org/) | 支援機関 | 該当なし | Palo Alto／Santa Clara County | startup-support, open-innovation, community | 番地単位 | 確認済み（2026-10-01） | 住所・座標一致（2026-10-01） | 要確認（2026-10-01） | 2026-10-01 |
| ○ | [JCB Silicon Valley](https://www.global.jcb/en/) | 企業 | 大規模 | San Mateo／San Mateo County | payments, finance | 番地単位 | 確認済み（2026-10-01） | 住所・座標一致（2026-10-01） | 確認済み（2026-10-01） | 2026-10-01 |
| ○ | [JEOL USA Bay Area](https://www.jeolusa.com/) | 企業 | 大規模 | Pleasanton／Alameda County | scientific-instruments, manufacturing | 都市中心（概略） | 要確認（2026-10-01） | 未照合（—） | 確認済み（2026-10-01） | 2026-10-01 |
| ○ | [JETRO San Francisco](https://www.jetro.go.jp/jetro/overseas/us_sanfrancisco/) | 支援機関 | 該当なし | San Francisco／San Francisco County | trade-promotion, investment-promotion, startup-support | 番地単位 | 確認済み（2026-10-01） | 住所・座標一致（2026-10-01） | 確認済み（2026-10-01） | 2026-10-01 |
| ○ | [JSR Micro](https://www.jsrmicro.com/) | 企業 | 大規模 | Sunnyvale／Santa Clara County | semiconductors, materials | 番地単位 | 確認済み（2026-10-01） | 住所・座標一致（2026-10-01） | 確認済み（2026-10-01） | 2026-10-01 |
| ○ | [JTB Group Silicon Valley](https://www.jtbcorp.jp/en/) | 企業 | 大規模 | San Mateo／San Mateo County | travel, business-development | 番地単位 | 要確認（2026-10-01） | 住所・座標一致（2026-10-01） | 確認済み（2026-10-01） | 2026-10-01 |
| ○ | [JX Advanced Metals America Bay Area](https://www.jx-nmm.com/english/) | 企業 | 大規模 | San Jose／Santa Clara County | materials, manufacturing | 都市中心（概略） | 要確認（2026-10-01） | 未照合（—） | 確認済み（2026-10-01） | 2026-10-01 |
| ○ | [Kanematsu USA](https://www.kanematsuusa.com/) | 企業 | 大規模 | San Jose／Santa Clara County | trading, technology | 都市中心（概略） | 要確認（2026-10-01） | 未照合（—） | 要確認（2026-10-01） | 2026-10-01 |
| ○ | [Kawasaki Heavy Industries Silicon Valley](https://global.kawasaki.com/en/) | 企業 | 大規模 | San Jose／Santa Clara County | robotics, manufacturing, aerospace, defense | 番地単位 | 確認済み（2026-10-01） | 住所・座標一致（2026-10-01） | 確認済み（2026-10-01） | 2026-10-01 |
| ○ | [KDDI America Silicon Valley](https://us.kddi.com/) | 企業 | 大規模 | San Jose／Santa Clara County | telecommunications, cloud | 都市中心（概略） | 要確認（2026-10-01） | 未照合（—） | 確認済み（2026-10-01） | 2026-10-01 |
| ○ | [KEYENCE America Bay Area](https://www.keyence.com/) | 企業 | 大規模 | San Jose／Santa Clara County | automation, manufacturing | 都市中心（概略） | 要確認（2026-10-01） | 未照合（—） | 確認済み（2026-10-01） | 2026-10-01 |
| ○ | [Kikkoman San Francisco](https://www.kikkoman.com/en/) | 企業 | 大規模 | San Francisco／San Francisco County | food, manufacturing | 番地単位 | 確認済み（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
| ○ | [Kintone Corporation (Cybozu Group)](https://www.kintone.com/) | 企業 | グロース | San Francisco／San Francisco County | software, collaboration | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
| ○ | [Kioxia America](https://americas.kioxia.com) | 企業 | 大規模 | San Jose／Santa Clara County | semiconductors, electronics | 番地単位 | 確認済み（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
| ○ | [Komatsu Silicon Valley](https://www.komatsu.com/) | 企業 | 大規模 | San Francisco／San Francisco County | industrial, manufacturing | 都市中心（概略） | 要確認（2026-09-29） | 未照合（—） | 確認済み（2026-09-29） | 2026-09-29 |
| ○ | [Konica Minolta Laboratory USA](https://research.konicaminolta.com) | 企業 | 大規模 | San Mateo／San Mateo County | imaging, research | 都市中心（概略） | 要確認（2026-09-29） | 未照合（—） | 確認済み（2026-09-29） | 2026-09-29 |
| ○ | [Kurita Water Industries Silicon Valley](https://www.kurita-water.com/en/) | 企業 | 大規模 | San Mateo／San Mateo County | water, semiconductors, manufacturing | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 要確認（2026-09-29） | 2026-09-29 |
| ○ | [Kyocera Document Solutions](https://www.kyoceradocumentsolutions.us/) | 企業 | 大規模 | Union City／Alameda County | imaging, electronics | 番地単位 | 確認済み（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
| ○ | [LegalOn Technologies US](https://www.legalontech.com/) | 企業 | 大規模 | San Francisco／San Francisco County | legaltech, ai | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
| ○ | [Makita USA](https://www.makitatools.com/) | 企業 | 大規模 | Hayward／Alameda County | tools, manufacturing | 都市中心（概略） | 要確認（2026-09-29） | 未照合（—） | 要確認（2026-09-29） | 2026-09-29 |
| ○ | [Marubeni America](https://www.marubeniamerica.com/) | 企業 | 大規模 | San Francisco／San Francisco County | trading, investment | 都市中心（概略） | 要確認（2026-09-29） | 未照合（—） | 確認済み（2026-09-29） | 2026-09-29 |
| ○ | [Mercari US](https://www.mercari.com/) | 企業 | 大規模 | Palo Alto／Santa Clara County | ecommerce, software | 都市中心（概略） | 要確認（2026-09-29） | 未照合（—） | 要確認（2026-09-29） | 2026-09-29 |
| ○ | [MinebeaMitsumi Technology Center](https://www.minebeamitsumi.com/) | 企業 | 大規模 | San Jose／Santa Clara County | electronics, manufacturing | 都市中心（概略） | 要確認（2026-09-29） | 未照合（—） | 確認済み（2026-09-29） | 2026-09-29 |
| ○ | [Mitsubishi Chemical America](https://www.mcam.com/) | 企業 | 大規模 | San Jose／Santa Clara County | materials, manufacturing | 都市中心（概略） | 要確認（2026-09-29） | 未照合（—） | 確認済み（2026-09-29） | 2026-09-29 |
| ○ | [Mitsubishi Corporation Americas](https://www.mitsubishicorp.com/us/en/) | 企業 | 大規模 | Palo Alto／Santa Clara County | trading, investment | 番地単位 | 確認済み（2026-08-23） | 住所・座標一致（2026-09-29） | 要確認（2026-09-29） | 2026-08-23 |
| ○ | [Mitsubishi Electric US](https://us.mitsubishielectric.com/) | 企業 | 大規模 | Mountain View／Santa Clara County | electronics, manufacturing, aerospace, space, satellites | 番地単位 | 確認済み（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
| ○ | [Mitsubishi Heavy Industries America](https://www.mhi.com/) | 企業 | 大規模 | Mountain View／Santa Clara County | industrial, manufacturing, aerospace, defense, space | 番地単位 | 確認済み（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
| ○ | [Mitsubishi Materials USA Bay Area](https://www.mitsubishimaterials.com/) | 企業 | 大規模 | San Jose／Santa Clara County | materials, manufacturing | 都市中心（概略） | 要確認（2026-09-29） | 未照合（—） | 要確認（2026-09-29） | 2026-09-29 |
| ○ | [Mitsui and Co USA](https://www.mitsui.com/us/en/) | 企業 | 大規模 | Menlo Park／San Mateo County | trading, investment | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
| ○ | [Mitsui Fudosan San Francisco](https://www.mfamerica.com/) | 企業 | 大規模 | San Francisco／San Francisco County | real-estate, urban-development | 番地単位 | 確認済み（2026-09-29） | 要確認（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
| ○ | [Mizuho Americas San Francisco](https://www.mizuhogroup.com/americas) | 企業 | 大規模 | San Francisco／San Francisco County | finance, banking | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
| ○ | [MODE Inc](https://www.tinkermode.com/) | 企業 | 大規模 | San Mateo／San Mateo County | iot, software | 番地単位 | 確認済み（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
| ○ | [MSIG USA San Francisco](https://www.msigusa.com/) | 企業 | 大規模 | San Francisco／San Francisco County | insurance, finance | 都市中心（概略） | 要確認（2026-09-29） | 未照合（—） | 確認済み（2026-09-29） | 2026-09-29 |
| ○ | [MUFG Bank San Francisco](https://www.mufgamericas.com/) | 企業 | 大規模 | San Francisco／San Francisco County | finance, banking | 番地単位 | 確認済み（2026-08-23） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-08-23 |
| ○ | [Murata Electronics North America](https://www.murata.com) | 企業 | 大規模 | San Mateo／San Mateo County | electronics, manufacturing | 都市中心（概略） | 要確認（2026-09-29） | 未照合（—） | 確認済み（2026-09-29） | 2026-09-29 |
| ○ | [Nagase America](https://www.nagaseamerica.com/) | 企業 | 大規模 | San Jose／Santa Clara County | materials, trading | 都市中心（概略） | 要確認（2026-09-29） | 未照合（—） | 確認済み（2026-09-29） | 2026-09-29 |
| ○ | [NEC Corporation of America](https://www.necam.com) | 企業 | 大規模 | San Jose／Santa Clara County | electronics, software | 都市中心（概略） | 要確認（2026-10-03） | 未照合（—） | 要確認（2026-09-29） | 2026-10-03 |
| ○ | [Nidec America](https://www.nidec.com/en/) | 企業 | 大規模 | San Jose／Santa Clara County | motors, manufacturing | 番地単位 | 確認済み（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
| ○ | [Nikon Research Corporation of America](https://www.nikon.com) | 企業 | 大規模 | Belmont／San Mateo County | optics, manufacturing | 都市中心（概略） | 要確認（2026-09-29） | 未照合（—） | 確認済み（2026-09-29） | 2026-09-29 |
| ○ | [Nippon Life Silicon Valley](https://www.nissay.co.jp/english/) | 企業 | 大規模 | Palo Alto／Santa Clara County | insurance, business-development | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 要確認（2026-09-29） | 2026-09-29 |
| ○ | [Nissan Advanced Technology Center Silicon Valley](https://www.nissan-global.com) | 企業 | 大規模 | Santa Clara／Santa Clara County | automotive, software | 番地単位 | 確認済み（2026-10-03） | 住所・座標一致（2026-10-03） | 確認済み（2026-09-29） | 2026-10-03 |
| ○ | [Nitto Denko Technical America Bay Area](https://www.nitto.com/us/en/) | 企業 | 大規模 | San Jose／Santa Clara County | materials, manufacturing | 都市中心（概略） | 要確認（2026-09-29） | 未照合（—） | 要確認（2026-09-29） | 2026-09-29 |
| ○ | [Nomura Securities International San Francisco](https://www.nomura.com/) | 企業 | 大規模 | San Francisco／San Francisco County | finance, securities | 都市中心（概略） | 要確認（2026-09-29） | 未照合（—） | 確認済み（2026-09-29） | 2026-09-29 |
| ○ | [NRI IT Solutions America Pacific Branch](https://www.nri.com/en/) | 企業 | 大規模 | San Mateo／San Mateo County | consulting, technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
| ○ | [NTT Communications San Francisco](https://www.ntt.com/en/) | 企業 | 大規模 | San Francisco／San Francisco County | telecommunications, cloud | 都市中心（概略） | 要確認（2026-09-29） | 未照合（—） | 要確認（2026-09-29） | 2026-09-29 |
| ○ | [NTT DATA Silicon Valley](https://us.nttdata.com/) | 企業 | 大規模 | San Jose／Santa Clara County | software, consulting | 都市中心（概略） | 要確認（2026-09-29） | 未照合（—） | 確認済み（2026-09-29） | 2026-09-29 |
| ○ | [NTT Research](https://ntt-research.com) | 企業 | 大規模 | Sunnyvale／Santa Clara County | research, technology | 番地単位 | 確認済み（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
| ○ | [Olympus America](https://www.olympusamerica.com/) | 企業 | 大規模 | San Jose／Santa Clara County | medical-devices, imaging | 番地単位 | 確認済み（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
| ○ | [OMRON Robotics and Safety Technologies](https://automation.omron.com) | 企業 | 大規模 | Pleasanton／Alameda County | robotics, manufacturing | 番地単位 | 確認済み（2026-10-03） | 住所・座標一致（2026-10-03） | 確認済み（2026-09-29） | 2026-10-03 |
| ○ | [ORIX USA San Francisco](https://www.orix.com/) | 企業 | 大規模 | San Francisco／San Francisco County | finance, investment | 都市中心（概略） | 要確認（2026-09-29） | 未照合（—） | 確認済み（2026-09-29） | 2026-09-29 |
| ○ | [Panasonic North America](https://www.panasonic.com/us) | 企業 | 大規模 | Newark／Alameda County | electronics, manufacturing | 都市中心（概略） | 要確認（2026-10-03） | 未照合（—） | 要確認（2026-09-29） | 2026-10-03 |
| ○ | [Plug and Play Tech Center](https://www.plugandplaytechcenter.com/) | VC・CVC | 大規模 | Sunnyvale／Santa Clara County | venture-capital, accelerator, corporate-innovation | 番地単位 | 要確認（2026-09-29） | 要確認（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
| ○ | [RakuNest](https://www.rakunest.com/) | 支援機関 | 該当なし | San Mateo／San Mateo County | coworking, startup-support, community | 番地単位 | 確認済み（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
| ○ | [Rakuten USA, Inc.](https://global.rakuten.com/corp/about/map/am_us_rchw.html) | 企業 | 大規模 | San Mateo／San Mateo County | internet, ecommerce | 番地単位 | 確認済み（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
| ○ | [Rapidus Design Solutions](https://www.rapidus.inc/en/) | 企業 | 大規模 | Santa Clara／Santa Clara County | semiconductors, manufacturing | 番地単位 | 確認済み（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
| ○ | [Renesas Electronics America](https://www.renesas.com) | 企業 | 大規模 | San Jose／Santa Clara County | semiconductors, electronics | 番地単位 | 確認済み（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
| ○ | [Resonac US-JOINT](https://www.resonac.com/) | 企業 | 大規模 | Union City／Alameda County | semiconductors, materials, manufacturing | 都市中心（概略） | 要確認（2026-09-30） | 未照合（—） | 確認済み（2026-09-30） | 2026-09-30 |
| ○ | [Ricoh Innovations](https://www.ricoh.com) | 企業 | 大規模 | Menlo Park／San Mateo County | electronics, research | 都市中心（概略） | 要確認（2026-09-30） | 未照合（—） | 確認済み（2026-09-30） | 2026-09-30 |
| ○ | [ROHM Semiconductor USA](https://www.rohm.com) | 企業 | 大規模 | Santa Clara／Santa Clara County | semiconductors, electronics | 番地単位 | 確認済み（2026-10-03） | 住所・座標一致（2026-10-03） | 要確認（2026-09-30） | 2026-10-03 |
| ○ | [Santen](https://www.santen.com/us/) | 企業 | 大規模 | Emeryville／Alameda County | biotechnology, healthcare | 番地単位 | 確認済み（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
| ○ | [SCREEN SPE USA](https://www.screen.co.jp/spe/en/) | 企業 | 大規模 | Santa Clara／Santa Clara County | semiconductors, manufacturing | 番地単位 | 確認済み（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
| ○ | [SCSK USA Silicon Valley](https://www.scskusa.com/) | 企業 | 大規模 | Santa Clara／Santa Clara County | information-technology, business-development | 番地単位 | 確認済み（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
| ○ | [Sekisui Chemical Silicon Valley](https://www.sekisuichemical.com/) | 企業 | 大規模 | San Mateo／San Mateo County | materials, manufacturing | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
| ○ | [Shimadzu Scientific Instruments Bay Area](https://www.ssi.shimadzu.com/) | 企業 | 大規模 | San Jose／Santa Clara County | scientific-instruments, manufacturing | 番地単位 | 確認済み（2026-10-01） | 住所・座標一致（2026-10-01） | 確認済み（2026-10-01） | 2026-10-01 |
| ○ | [Shimizu Corporation Silicon Valley](https://www.shimz.co.jp/en/) | 企業 | 大規模 | San Mateo／San Mateo County | construction, technology-scouting | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
| ○ | [Shin-Etsu MicroSi](https://www.microsi.com/) | 企業 | 大規模 | San Jose／Santa Clara County | semiconductors, materials | 都市中心（概略） | 要確認（2026-10-01） | 未照合（—） | 確認済み（2026-10-01） | 2026-10-01 |
| ○ | [SmartNews US](https://www.smartnews.com/) | 企業 | 大規模 | Palo Alto／Santa Clara County | media, software | 番地単位 | 要確認（2026-09-28） | 住所・座標一致（2026-09-28） | 確認済み（2026-09-28） | 2026-09-28 |
| ○ | [SMBC Americas San Francisco](https://www.smbcgroup.com/) | 企業 | 大規模 | San Francisco／San Francisco County | finance, banking | 番地単位 | 要確認（2026-09-28） | 住所・座標一致（2026-09-28） | 確認済み（2026-09-28） | 2026-09-28 |
| ○ | [SMC Corporation of America Bay Area](https://www.smcusa.com/) | 企業 | 大規模 | San Jose／Santa Clara County | automation, manufacturing | 都市中心（概略） | 要確認（2026-09-28） | 未照合（—） | 確認済み（2026-09-28） | 2026-09-28 |
| ○ | [Socionext America](https://www.socionext.com) | 企業 | 大規模 | Milpitas／Santa Clara County | semiconductors, electronics | 番地単位 | 確認済み（2026-09-28） | 住所・座標一致（2026-09-28） | 確認済み（2026-09-28） | 2026-09-28 |
| ○ | [SoftBank Group International](https://group.softbank/en) | 企業 | 大規模 | San Carlos／San Mateo County | investment, technology | 都市中心（概略） | 要確認（2026-09-28） | 未照合（—） | 確認済み（2026-09-28） | 2026-09-28 |
| ○ | [Sojitz Corporation of America](https://www.sojitz.com/en/) | 企業 | 大規模 | San Jose／Santa Clara County | trading, investment | 番地単位 | 確認済み（2026-09-28） | 住所・座標一致（2026-09-28） | 確認済み（2026-09-28） | 2026-09-28 |
| ○ | [SOMPO Digital Lab Silicon Valley](https://www2.sompo-hd.com/digital/en/pc/) | 企業 | 大規模 | Foster City／San Mateo County | insurance, finance | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
| ○ | [Sony AI America](https://ai.sony/) | 企業 | 大規模 | San Jose／Santa Clara County | ai, research | 都市中心（概略） | 要確認（2026-09-28） | 未照合（—） | 確認済み（2026-09-28） | 2026-09-28 |
| ○ | [Sony Interactive Entertainment](https://sonyinteractive.com/) | 企業 | 大規模 | San Mateo／San Mateo County | electronics, entertainment | 番地単位 | 確認済み（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
| ○ | [Sumitomo Corporation of Americas](https://www.sumitomocorp.com/en/us) | 企業 | 大規模 | Santa Clara／Santa Clara County | trading, investment | 番地単位 | 確認済み（2026-09-28） | 住所・座標一致（2026-09-28） | 確認済み（2026-09-28） | 2026-09-28 |
| ○ | [Sumitomo Electric Device Innovations USA](https://www.sedi.co.jp/english/) | 企業 | 大規模 | San Jose／Santa Clara County | semiconductors, manufacturing | 都市中心（概略） | 要確認（2026-09-28） | 未照合（—） | 要確認（2026-09-28） | 2026-09-28 |
| ○ | [Systena Silicon Valley](https://www.systena.co.jp/eng/) | 企業 | 大規模 | San Mateo／San Mateo County | information-technology, business-development | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 要確認（2026-09-29） | 2026-09-29 |
| ○ | [Takara Bio USA](https://www.takarabio.com/) | 企業 | 大規模 | San Jose／Santa Clara County | biotechnology, life-sciences | 番地単位 | 確認済み（2026-09-28） | 住所・座標一致（2026-09-28） | 確認済み（2026-09-28） | 2026-09-28 |
| ○ | [TDK USA](https://www.tdk.com) | 企業 | 大規模 | San Jose／Santa Clara County | electronics, manufacturing | 番地単位 | 確認済み（2026-10-03） | 住所・座標一致（2026-10-03） | 要確認（2026-09-28） | 2026-10-03 |
| ○ | [THK America Bay Area](https://www.thk.com/) | 企業 | 大規模 | San Jose／Santa Clara County | industrial, manufacturing | 都市中心（概略） | 要確認（2026-09-28） | 未照合（—） | 確認済み（2026-09-28） | 2026-09-28 |
| ○ | [TOK America](https://www.tokamerica.com/) | 企業 | 大規模 | Milpitas／Santa Clara County | semiconductors, materials | 番地単位 | 確認済み（2026-09-28） | 住所・座標一致（2026-09-28） | 確認済み（2026-09-28） | 2026-09-28 |
| ○ | [Tokio Marine America San Francisco](https://www.tokiomarine.us/) | 企業 | 大規模 | San Francisco／San Francisco County | insurance, finance | 都市中心（概略） | 要確認（2026-09-28） | 未照合（—） | 確認済み（2026-09-28） | 2026-09-28 |
| ○ | [Tokyo Electron America](https://www.tel.com/) | 企業 | 大規模 | Fremont／Alameda County | semiconductors, manufacturing | 都市中心（概略） | 要確認（2026-09-28） | 未照合（—） | 確認済み（2026-09-28） | 2026-09-28 |
| ○ | [Toray Advanced Composites](https://www.toraytac.com/) | 企業 | 大規模 | Morgan Hill／Santa Clara County | materials, manufacturing, aerospace | 都市中心（概略） | 要確認（2026-09-28） | 未照合（—） | 確認済み（2026-09-28） | 2026-09-28 |
| ○ | [Toshiba America Electronic Components](https://toshiba.semicon-storage.com/us/) | 企業 | 大規模 | San Jose／Santa Clara County | semiconductors, electronics | 番地単位 | 確認済み（2026-09-28） | 住所・座標一致（2026-09-28） | 確認済み（2026-09-28） | 2026-09-28 |
| ○ | [Tosoh Silicon Valley](https://www.tosoh.com/) | 企業 | 大規模 | San Mateo／San Mateo County | chemicals, electronics, manufacturing | 番地単位 | 要確認（2026-09-28） | 住所・座標一致（2026-09-28） | 要確認（2026-09-28） | 2026-09-28 |
| ○ | [Toyota Research Institute](https://www.tri.global) | 企業 | 大規模 | Los Altos／Santa Clara County | automotive, robotics | 都市中心（概略） | 確認済み（2026-08-23） | 未照合（—） | 要確認（2026-09-28） | 2026-08-23 |
| ○ | [Toyota Tsusho America](https://www.taiamerica.com/) | 企業 | 大規模 | Santa Clara／Santa Clara County | trading, automotive | 都市中心（概略） | 要確認（2026-09-28） | 未照合（—） | 確認済み（2026-09-28） | 2026-09-28 |
| ○ | [Toyota Ventures](https://toyota.ventures/) | VC・CVC | 該当なし | Los Altos／Santa Clara County | venture-capital, mobility | 番地単位 | 確認済み（2026-08-23） | 住所・座標一致（2026-09-28） | 確認済み（2026-09-28） | 2026-08-23 |
| ○ | [Treasure Data](https://www.treasuredata.com/) | 企業 | 大規模 | Mountain View／Santa Clara County | data, software | 都市中心（概略） | 要確認（2026-09-28） | 未照合（—） | 確認済み（2026-09-28） | 2026-09-28 |
| ○ | [WHILL US](https://whill.inc/us/) | 企業 | グロース | San Carlos／San Mateo County | mobility, medical-devices | 都市中心（概略） | 要確認（2026-09-28） | 未照合（—） | 確認済み（2026-09-28） | 2026-09-28 |
| ○ | [Woven by Toyota](https://woven.toyota/en/) | 企業 | 大規模 | Palo Alto／Santa Clara County | automotive, software | 都市中心（概略） | 要確認（2026-09-28） | 未照合（—） | 確認済み（2026-09-28） | 2026-09-28 |
| ○ | [Yamaha Motor Ventures](https://www.yamahamotorventures.com) | VC・CVC | 該当なし | Palo Alto／Santa Clara County | venture-capital, mobility | 番地単位 | 確認済み（2026-10-03） | 住所・座標一致（2026-10-03） | 確認済み（2026-09-28） | 2026-10-03 |
| ○ | [Yaskawa America](https://www.yaskawa.com/) | 企業 | 大規模 | Fremont／Alameda County | robotics, manufacturing | 都市中心（概略） | 要確認（2026-09-28） | 未照合（—） | 確認済み（2026-09-28） | 2026-09-28 |
| ○ | [Yokogawa Corporation of America Bay Area](https://www.yokogawa.com/us/) | 企業 | 大規模 | San Jose／Santa Clara County | automation, manufacturing | 都市中心（概略） | 要確認（2026-09-28） | 未照合（—） | 確認済み（2026-09-28） | 2026-09-28 |
|  | [1stCollab](https://1stcollab.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, marketing, artificial-intelligence, machine-learning, advertising, creator-economy, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [64x Bio](http://www.64xbio.com) | 企業 | グロース | San Francisco／San Francisco County | healthcare, industrial-bio, gene-therapy, machine-learning | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [140 Proof](https://www.140proof.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 要確認（2026-09-30） | 2026-09-30 |
|  | [Abalone Bio](https://www.abalonebio.com) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, drug-discovery-and-delivery, machine-learning, synthetic-biology, therapeutics, drug-discovery | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Abl Schools](https://ablschools.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 都市中心（概略） | 要確認（2026-09-30） | 未照合（—） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Abstract](https://www.goabstract.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 要確認（2026-09-30） | 2026-09-30 |
|  | [Accenture](https://www.accenture.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Accord](https://inaccord.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, sales, saas, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Acely](https://acely.com) | 企業 | グロース | San Francisco／San Francisco County | education, elearning, consumer, services | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Activeloop](https://activeloop.ai/) | 企業 | スタートアップ | Mountain View／Santa Clara County | b2b, infrastructure, computational-storage, deep-learning, generative-ai, computer-vision, open-source, software | 番地単位 | 確認済み（2026-10-03） | 住所・座標一致（2026-10-03） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Admitsee](https://www.admitsee.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 要確認（2026-09-30） | 2026-09-30 |
|  | [Adobe](http://www.adobe.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [AdStage](https://www.adstage.io/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Advent Software](https://www.advent.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Affirm](https://www.affirm.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Affogato AI](https://affogato.ai) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, engineering-product-and-design, artificial-intelligence, generative-ai, ai, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Afriex](https://www.afriexapp.com) | 企業 | グロース | San Francisco／San Francisco County | fintech, payments, remittances | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [After College](https://www.aftercollege.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [AfterQuery](https://afterquery.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, infrastructure, artificial-intelligence, data-labeling, big-data, ai, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Agave](https://www.useagave.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, saas, construction, proptech, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [AgentCollect](https://www.agentcollect.com) | 企業 | グロース | San Francisco／San Francisco County | fintech, artificial-intelligence, b2b, enterprise-software, software | 番地単位 | 確認済み（2026-10-03） | 住所・座標一致（2026-10-03） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [AgileMD](https://agilemd.com) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, healthcare-it, machine-learning | 番地単位 | 確認済み（2026-10-03） | 住所・座標一致（2026-10-03） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [AIOS](https://www.aiosmedical.com/) | 企業 | 大規模 | San Francisco／San Francisco County | healthcare, consumer-health-and-wellness, consumer-health-services, health-tech, telemedicine | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [AiPrise](https://aiprise.com/) | 企業 | グロース | San Francisco／San Francisco County | fintech, b2b, identity, compliance, regtech, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Airbnb](https://www.airbnb.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Airbyte](https://airbyte.com/) | 企業 | グロース | San Francisco／San Francisco County | b2b, artificial-intelligence, developer-tools, open-source, data-engineering, ai, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [AirMyne](http://www.airmyne.com) | 企業 | スタートアップ | San Francisco／San Francisco County | industrials, climate, carbon-capture-and-removal, hard-tech, hardware, industrial | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Airware](https://www.airware.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 要確認（2026-09-30） | 2026-09-30 |
|  | [AiSDR](https://aisdr.com/) | 企業 | グロース | San Francisco／San Francisco County | b2b, sales, artificial-intelligence, saas, ai, software | 番地単位 | 確認済み（2026-10-03） | 住所・座標一致（2026-10-03） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [AIVideo.com](https://aivideo.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [AKQA](http://www.akqa.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Aktana](https://www.aktana.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Alex](https://alex.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, recruiting-and-talent, artificial-intelligence, saas, recruiting, hr-tech, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Algen Biotechnologies](https://www.algenbio.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, drug-discovery-and-delivery, crispr, biotech, therapeutics, drug-discovery, ai | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Algolia](https://www.algolia.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-10-03） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-10-03 |
|  | [Alpaca](https://alpaca.markets/) | 企業 | 大規模 | San Mateo／San Mateo County | fintech, banking-and-exchange, developer-tools, api, investing, infrastructure | 番地単位 | 確認済み（2026-10-03） | 住所・座標一致（2026-10-03） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Alpha Sense](https://www.alpha-sense.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [AltSchool](https://www.altschool.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 要確認（2026-09-30） | 2026-09-30 |
|  | [Always Hired](http://www.alwayshired.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Amazon Web Services](https://aws.amazon.com/) | 企業 | 大規模 | San Francisco／San Francisco County | cloud, enterprise-software | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Ambient.ai](https://ambient.ai) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, security, artificial-intelligence, computer-vision, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [AMD](https://www.amd.com/) | 企業 | 大規模 | Santa Clara／Santa Clara County | semiconductors, computing | 番地単位 | 確認済み（2026-08-23） | 住所・座標一致（2026-09-30） | 要確認（2026-09-30） | 2026-08-27 |
|  | [Amplitude Analytics](https://amplitude.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [AmpUp](https://ampup.io) | 企業 | グロース | Santa Clara／Santa Clara County | consumer, home-and-personal, climate, electric-vehicles, services | 番地単位 | 確認済み（2026-10-03） | 住所・座標一致（2026-10-03） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Andon Labs](https://andonlabs.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, engineering-product-and-design, machine-learning, ai, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Andreessen Horowitz](https://a16z.com/) | VC・CVC | 該当なし | Menlo Park／San Mateo County | venture-capital, technology | 番地単位 | 確認済み（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Andromeda Surgical](http://www.andromedasurgical.com) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, medical-devices, hard-tech, machine-learning, medical-robotics, ai | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [AngelList](https://angel.co/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Angle Health](https://www.anglehealth.com) | 企業 | 大規模 | San Francisco／San Francisco County | fintech, insurance, health-insurance | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Anjuna](https://www.anjuna.io) | 企業 | グロース | San Francisco／San Francisco County | b2b, security, cloud-workload-protection, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Ansa Biotechnologies](http://ansabio.com) | 企業 | グロース | San Francisco／San Francisco County | healthcare, industrial-bio, synthetic-biology, biotech | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Anthrogen](https://anthrogen.com) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, deep-learning, biotech, ai | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Anthropic](https://www.anthropic.com/) | 企業 | グロース | San Francisco／San Francisco County | ai, research, enterprise-software | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Apero Health](https://www.aperohealth.com) | 企業 | グロース | San Francisco／San Francisco County | healthcare, healthcare-it, health-tech, finance, digital-health, enterprise-software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Apollo](http://apollographql.com/) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, infrastructure, developer-tools, open-source, graphql, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Apollo.io](https://www.apollo.io/) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, marketing, sales, software | 番地単位 | 確認済み（2026-10-03） | 住所・座標一致（2026-10-03） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [AppDirect](https://www.appdirect.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Apple](https://www.apple.com/) | 企業 | 大規模 | Cupertino／Santa Clara County | electronics, software, services | 番地単位 | 確認済み（2026-09-30） | 要確認（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Applied Materials](https://www.appliedmaterials.com/) | 企業 | 大規模 | Santa Clara／Santa Clara County | semiconductors, manufacturing, equipment | 番地単位 | 確認済み（2026-08-24） | 住所・座標一致（2026-09-30） | 要確認（2026-09-30） | 2026-08-24 |
|  | [Apteligent](http://www.apteligent.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 要確認（2026-09-30） | 2026-09-30 |
|  | [ArchForm](http://archform.com) | 企業 | グロース | San Francisco／San Francisco County | healthcare, medical-devices, robotics, health-tech, 3d-printing | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Archil](https://archil.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, infrastructure, developer-tools, machine-learning, big-data, ai, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Arini](https://www.arini.ai) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, healthcare-it, artificial-intelligence, health-tech, dental, call-center, ai | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Arintra](https://www.arintra.com/) | 企業 | グロース | San Francisco／San Francisco County | healthcare, healthcare-it, saas, health-tech, digital-health, enterprise-software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [arnata](https://arnata.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, supply-chain-and-logistics, artificial-intelligence, generative-ai, logistics, supply-chain, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Array Labs](https://www.arraylabs.io/) | 企業 | グロース | San Francisco／San Francisco County | industrials, aviation-and-space, satellites, industrial | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Artie](https://www.artie.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, infrastructure, developer-tools, saas, data-engineering, enterprise-software, software | 番地単位 | 確認済み（2026-10-03） | 住所・座標一致（2026-10-03） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Artisan](https://artisan.co/?utm_source=ycombinator) | 企業 | グロース | San Francisco／San Francisco County | b2b, artificial-intelligence, sales, automation, ai-assistant, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Asana](https://asana.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Ashby](https://www.ashbyhq.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, recruiting-and-talent, human-resources, recruiting, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Assembly HOA](https://assemblyhoa.com) | 企業 | スタートアップ | San Francisco／San Francisco County | real-estate-and-construction, housing-and-real-estate, artificial-intelligence, fintech, real-estate, housing, proptech, construction | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Astranis](http://www.astranis.com) | 企業 | 大規模 | San Francisco／San Francisco County | industrials, aviation-and-space, space-exploration, satellites, industrial | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Astro Mechanica](https://astromecha.co/) | 企業 | グロース | San Francisco／San Francisco County | industrials, aviation-and-space, industrial | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Athelas](http://athelas.com) | 企業 | 大規模 | San Francisco／San Francisco County | healthcare, saas, health-tech, telehealth, ai | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [AthenaHQ](https://www.athenahq.ai) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, marketing, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Atlas](https://atlas.so) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, operations, saas, customer-success, customer-service, customer-support, software | 都市中心（概略） | 要確認（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Atlas](https://atlascard.com) | 企業 | グロース | San Francisco／San Francisco County | fintech, consumer-finance | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [AtoB](https://atob.com/) | 企業 | グロース | San Francisco／San Francisco County | fintech, saas, payments, supply-chain, transportation | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Atomic](https://www.atomicvest.com/) | 企業 | グロース | San Francisco／San Francisco County | b2b, retail, artificial-intelligence, fintech, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Automattic](https://automattic.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Awesomic](https://www.awesomic.com/?ref=yc) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, marketplace, recruiting, design, web-development, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [BackerKit](https://backerkit.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, sales, saas, crowdfunding, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Balance](https://www.getbalance.com) | 企業 | グロース | San Francisco／San Francisco County | fintech, payments, b2b, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Beacons](https://beacons.ai/) | 企業 | グロース | San Francisco／San Francisco County | consumer, social, saas, services | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Bebo](https://bebo.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [BeGo](http://www.bego.ai) | 企業 | グロース | San Francisco／San Francisco County | b2b, supply-chain-and-logistics, artificial-intelligence, banking-as-a-service, digital-freight-brokerage, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Bellabeat](http://bellabeat.com) | 企業 | 大規模 | San Francisco／San Francisco County | consumer, consumer-electronics, fitness, health-and-wellness, femtech, services | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Benchling](http://benchling.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, saas, biotech, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Berkeley SkyDeck](https://skydeck.berkeley.edu/) | 支援機関 | 該当なし | Berkeley／Alameda County | accelerator, startup-support | 都市中心（概略） | 要確認（2026-09-30） | 未照合（—） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [BetterUp](https://www.betterup.co/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Beyond Games](https://www.beyondgames.co/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [BigCommerce](https://www.bigcommerce.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [BIK](https://bik.ai/) | 企業 | グロース | San Francisco／San Francisco County | b2b, retail, saas, e-commerce, ai, ai-assistant, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Bindwell](https://www.bindwell.ai/) | 企業 | スタートアップ | San Francisco／San Francisco County | industrials, agriculture, industrial | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Binti](https://binti.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Bio-Rad Laboratories](https://www.bio-rad.com/) | 企業 | 大規模 | Hercules／Contra Costa County | biotechnology, life-sciences | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 要確認（2026-09-30） | 2026-09-30 |
|  | [Bitmovin](http://bitmovin.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, infrastructure, developer-tools, video, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Bitnami](https://bitnami.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Bland AI](https://bland.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, infrastructure, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [blend labs](https://blend.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Bloc](https://www.bloc.io/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [BloomThat](https://www.bloomthat.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Blueberry Pediatrics](https://blueberrypediatrics.com) | 企業 | スタートアップ | Mountain View／Santa Clara County | healthcare, healthcare-it, consumer-health-services, health-tech, telehealth, pediatrics, digital-health | 番地単位 | 確認済み（2026-10-03） | 住所・座標一致（2026-10-03） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Bluedot](https://thebluedot.co/) | 企業 | スタートアップ | San Francisco／San Francisco County | fintech, climate, transportation, climatetech | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Blurb](http://www.blurb.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Bodyport](http://bodyport.com) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, consumer-health-and-wellness, medical-devices, telemedicine | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Bolto](https://www.bolto.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, human-resources, recruiting, hr-tech, ai, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [BrainKey](https://www.brainkey.ai/) | 企業 | グロース | San Francisco／San Francisco County | healthcare, diagnostics, neurotechnology, health-tech, digital-health, ai | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Braintree](https://www.braintreepayments.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Bretton AI](https://www.bretton.com/) | 企業 | グロース | San Francisco／San Francisco County | fintech, artificial-intelligence, payments, b2b, compliance, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Brigade](http://www.brigade.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 要確認（2026-09-30） | 2026-09-30 |
|  | [BrightBytes](http://www.brightbytes.net/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 要確認（2026-09-30） | 2026-09-30 |
|  | [Brighterway](https://www.brighterway.ai/) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, healthcare-it, artificial-intelligence, health-tech, legaltech, ai | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Broccoli AI](https://www.broccoli.com/) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, artificial-intelligence, home-services, ai, ai-assistant, software | 番地単位 | 要確認（2026-10-03） | 住所・座標一致（2026-10-03） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Buck Institute for Research on Aging](https://www.buckinstitute.org/) | 大学・研究機関 | 該当なし | Novato／Marin County | research, life-sciences | 番地単位 | 確認済み（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Bugcrowd](https://www.bugcrowd.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [BuildBuddy](https://buildbuddy.io) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, infrastructure, developer-tools, saas, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [BuildZoom](https://www.buildzoom.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Bunkerhill Health](http://bunkerhillhealth.com) | 企業 | グロース | San Francisco／San Francisco County | healthcare, healthcare-it, health-tech, ai | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Cadence Design Systems](https://www.cadence.com/) | 企業 | 大規模 | San Jose／Santa Clara County | semiconductors, software, eda | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 要確認（2026-09-30） | 2026-09-30 |
|  | [Cairns Health](https://www.cairns.ai) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, consumer-health-and-wellness, hardware, machine-learning, consumer-health-services | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Calltree](https://calltree.ai) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, generative-ai, saas, customer-service, ai, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Cambio](https://www.cambio.ai/) | 企業 | グロース | San Francisco／San Francisco County | real-estate-and-construction, artificial-intelligence, real-estate, b2b, construction, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Cambly](http://www.cambly.com) | 企業 | 大規模 | San Francisco／San Francisco County | education | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Campfire](https://campfire.ai) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, finance-and-accounting, fintech, saas, ai, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Campsyte](https://www.campsyte.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 要確認（2026-09-30） | 2026-09-30 |
|  | [Candid Health](https://www.joincandidhealth.com) | 企業 | 大規模 | San Francisco／San Francisco County | healthcare, healthcare-it | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Canix](https://www.canix.com/) | 企業 | グロース | San Francisco／San Francisco County | b2b, security, saas, cannabis, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [CaptivateIQ](https://www.captivateiq.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, finance-and-accounting, saas, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Careerist](http://careerist.cc/) | 企業 | 大規模 | San Francisco／San Francisco County | education, fintech, recruiting | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Carma](https://www.joincarma.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, operations, workflow-automation, compliance, ai, automotive, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Cartage](https://cartage.ai) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, supply-chain-and-logistics, machine-learning, workflow-automation, logistics, supply-chain, ai, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Casca](https://www.cascading.ai/) | 企業 | グロース | San Francisco／San Francisco County | fintech, artificial-intelligence, conversational-banking, machine-learning, finance | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Castle](https://castle.io/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-10-03） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-10-03 |
|  | [Castle Global](http://castleglobal.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 要確認（2026-09-30） | 2026-09-30 |
|  | [CBS Interactive](https://www.cbsinteractive.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Cekura](https://www.cekura.ai/) | 企業 | スタートアップ | Sunnyvale／Santa Clara County | b2b, engineering-product-and-design, developer-tools, saas, software | 番地単位 | 確認済み（2026-10-03） | 住所・座標一致（2026-10-03） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Charge Robotics](https://chargerobotics.com/) | 企業 | グロース | San Francisco／San Francisco County | industrials, manufacturing-and-robotics, robotics, solar-power, construction, climate, industrial | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Chartboost](https://www.chartboost.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Chatfuel](http://chatfuel.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, messaging, chatbots, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Chatwoot](https://www.chatwoot.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, operations, customer-success, open-source, customer-service, customer-support, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Checkr](https://checkr.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-10-03） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-10-03 |
|  | [Chewse](https://www.chewse.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Chime Bank](https://www.chimebank.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 都市中心（概略） | 要確認（2026-09-30） | 未照合（—） | 要確認（2026-09-30） | 2026-09-30 |
|  | [Circle Medical](https://www.circlemedical.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Cisco](https://www.cisco.com/) | 企業 | 大規模 | San Jose／Santa Clara County | networking, cybersecurity, enterprise-software | 番地単位 | 確認済み（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Clara Lending](https://clara.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [ClassDojo](http://www.classdojo.com) | 企業 | 大規模 | San Francisco／San Francisco County | education, consumer, entertainment, kids, metaverse, services | 番地単位 | 確認済み（2026-10-03） | 住所・座標一致（2026-10-03） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Clearbit](https://clearbit.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [ClearMetal](http://www.clearmetal.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Cleva](https://www.getcleva.com) | 企業 | グロース | San Francisco／San Francisco County | fintech, crypto-web3, remote-work, emerging-markets, neobank | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Clever](https://clever.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Climate Corporation](https://climate.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Clipboard](https://www.clipboardworks.com/careers) | 企業 | 大規模 | San Francisco／San Francisco County | consumer, marketplace, consumer-health-services, health-tech, healthcare, services | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Cloud4Wi](https://cloud4wi.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Cloudflare](https://www.cloudflare.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Clover Health](https://www.cloverhealth.com/en/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [CodeAnt AI](https://codeant.ai/) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, cybersecurity, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Coffee Meets Bagel](https://coffeemeetsbagel.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Cognition IP](https://www.cognitionip.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, legal, artificial-intelligence, govtech, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Coinbase](https://www.coinbase.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 要確認（2026-09-30） | 2026-09-30 |
|  | [CoinTracker](https://cointracker.com) | 企業 | グロース | San Francisco／San Francisco County | fintech, saas, crypto-web3, consumer, services | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Collective Health](https://collectivehealth.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Collectly](http://collectly.co/) | 企業 | 大規模 | San Francisco／San Francisco County | healthcare, healthcare-it, payments, b2b, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [CombineHealth](https://www.combinehealth.ai/) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, healthcare-it, artificial-intelligence, machine-learning | 番地単位 | 確認済み（2026-10-03） | 住所・座標一致（2026-10-03） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Community Phone Company](https://www.communityphone.org/) | 企業 | 大規模 | San Francisco／San Francisco County | consumer, home-and-personal, artificial-intelligence, saas, b2b, customer-support, telecommunications, services, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Conduit](http://helloconduit.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, supply-chain-and-logistics, artificial-intelligence, saas, logistics, enterprise-software, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Conduit](https://conduit.ai/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, travel, sales, customer-service, ai, software | 番地単位 | 確認済み（2026-10-03） | 住所・座標一致（2026-10-03） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Confident LIMS](https://confidentlims.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, operations, saas, cannabis, compliance, enterprise-software, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Contrario](https://contrario.ai) | 企業 | グロース | San Francisco／San Francisco County | b2b, recruiting-and-talent, saas, recruiting, ai, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Copia](http://www.gocopia.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, office-management, saas, food-tech, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Corgi Insurance](https://corgi.com) | 企業 | 大規模 | San Francisco／San Francisco County | fintech, insurance, artificial-intelligence | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Cortex](https://cortex.io/) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, infrastructure, developer-tools, saas, productivity, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Corvus Robotics](https://www.corvus-robotics.com) | 企業 | グロース | Mountain View／Santa Clara County | industrials, drones, warehouse-management-tech, robotics, logistics, supply-chain, industrial | 番地単位 | 確認済み（2026-10-03） | 住所・座標一致（2026-10-03） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Courier](https://www.courier.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, developer-tools, messaging, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Creative Market](https://creativemarket.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 要確認（2026-09-30） | 要確認（2026-09-30） | 2026-09-30 |
|  | [Cricket Health](https://crickethealth.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Crowdcast](https://www.crowdcast.io) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [CrowdFlower](https://www.crowdflower.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 要確認（2026-09-30） | 2026-09-30 |
|  | [Crunchyroll](http://www.crunchyroll.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 要確認（2026-09-30） | 2026-09-30 |
|  | [Culdesac](http://culdesac.com) | 企業 | 大規模 | San Francisco／San Francisco County | real-estate-and-construction, housing-and-real-estate, real-estate, housing, proptech, climatetech, construction | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Culture Biosciences](https://culturebiosciences.com) | 企業 | グロース | San Francisco／San Francisco County | healthcare, industrial-bio, cellular-agriculture, biotech | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Curtsy](http://curtsyapp.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | consumer, apparel-and-cosmetics, marketplace, sustainable-fashion, e-commerce, services | 番地単位 | 確認済み（2026-10-03） | 住所・座標一致（2026-10-03） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Cyble](https://cyble.com/) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, security, saas, ai, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [d_model](https://www.dmodel.ai) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, software | 都市中心（概略） | 要確認（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Dagger](https://dagger.io) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, developer-tools, devsecops, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Daily](https://daily.co) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, productivity, developer-tools, open-source, ai, ai-assistant, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Databricks](https://www.databricks.com/) | 企業 | 大規模 | San Francisco／San Francisco County | ai, data, enterprise-software | 番地単位 | 確認済み（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [DataFox](https://www.datafox.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 要確認（2026-09-30） | 2026-09-30 |
|  | [Datasaur](https://datasaur.ai) | 企業 | グロース | San Francisco／San Francisco County | b2b, finance, compliance, healthcare, legaltech, ai, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Datrics](https://datrics.ai) | 企業 | グロース | San Francisco／San Francisco County | healthcare, b2b, analytics, health-insurance, ai, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Daybreak Health](https://www.daybreakhealth.com/) | 企業 | グロース | San Francisco／San Francisco County | healthcare, consumer-health-and-wellness, mental-health-tech, consumer-health-services, digital-health | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Deel](https://www.deel.com/) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, finance-and-accounting, fintech, saas, hr-tech, payroll, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Deepgram](https://www.deepgram.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, engineering-product-and-design, ai-enhanced-learning, api, ai, software | 番地単位 | 確認済み（2026-10-03） | 住所・座標一致（2026-10-03） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Deepnight](https://www.deepnight.com) | 企業 | スタートアップ | San Francisco／San Francisco County | industrials, defense, artificial-intelligence, computer-vision, industrial | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Delivery Agent](http://www.deliveryagent.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Demandbase](https://www.demandbase.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Didit](https://didit.me/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, infrastructure, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Disqus](https://disqus.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Distro](https://distro.app) | 企業 | スタートアップ | Palo Alto／Santa Clara County | b2b, supply-chain-and-logistics, saas, manufacturing, supply-chain, ai, software | 番地単位 | 確認済み（2026-10-03） | 住所・座標一致（2026-10-03） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Ditto](http://dittowords.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, engineering-product-and-design, developer-tools, saas, design-tools, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Docker](https://www.docker.com/) | 企業 | スタートアップ | Palo Alto／Santa Clara County | technology | 番地単位 | 確認済み（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Docusign](https://www.docusign.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Domu Technology Inc.](https://www.domu.ai/) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, aiops, artificial-intelligence, call-center, ai-assistant, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [DoorDash](https://www.doordash.com/) | 企業 | 大規模 | San Francisco／San Francisco County | delivery, marketplace, logistics | 番地単位 | 確認済み（2026-09-30） | 住所・座標一致（2026-09-30） | 要確認（2026-09-30） | 2026-09-30 |
|  | [Double Robotics](https://doublerobotics.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, productivity, hardware, robotics, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Dover](https://dover.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, recruiting-and-talent, recruiting, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Dr. Treat](https://www.drtreat.com/) | 企業 | グロース | San Francisco／San Francisco County | healthcare, healthcare-services, telehealth, consumer, digital-health, services | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [DreamCraft Entertainment, Inc.](https://www.dreamcraft.com/) | 企業 | グロース | San Francisco／San Francisco County | consumer, gaming, developer-tools, entertainment, services | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [DreamWorld](https://www.playdreamworld.com/) | 企業 | グロース | San Francisco／San Francisco County | consumer, gaming, services | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [DroneDeploy](https://www.dronedeploy.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology, drones, software, data, imaging | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Dropbox](https://www.dropbox.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Duncan Channon](http://www.duncanchannon.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-09-21） | 住所・座標一致（2026-09-30） | 要確認（2026-09-30） | 2026-09-21 |
|  | [Duranium](https://www.duranium.co/) | 企業 | スタートアップ | San Francisco／San Francisco County | industrials, manufacturing-and-robotics, manufacturing, advanced-materials, climatetech, industrial | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Dynamo AI](https://dynamo.ai) | 企業 | グロース | San Francisco／San Francisco County | b2b, machine-learning, privacy, data-engineering, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Earnest](https://www.earnest.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 要確認（2026-09-30） | 2026-09-30 |
|  | [EARTH AI](http://www.earth-ai.com) | 企業 | スタートアップ | San Francisco／San Francisco County | industrials, climate, ai-enhanced-learning, mining, industrial | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Easypost](https://www.easypost.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Eat Club](https://www.eatclub.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Eatsa](https://www.eatsa.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 都市中心（概略） | 要確認（2026-09-30） | 未照合（—） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [eBay](https://www.ebay.com/) | 企業 | 大規模 | San Jose／Santa Clara County | e-commerce, marketplace | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 要確認（2026-09-30） | 2026-09-30 |
|  | [Eden](https://edenmed.com) | 企業 | 大規模 | San Francisco／San Francisco County | healthcare, diagnostics, artificial-intelligence, digital-health | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Eero](https://eero.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Efference](https://efference.ai) | 企業 | スタートアップ | San Francisco／San Francisco County | industrials, manufacturing-and-robotics, robotics, computer-vision, industrial | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Electric Air](https://www.electricair.io/) | 企業 | スタートアップ | San Francisco／San Francisco County | real-estate-and-construction, construction, real-estate | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Elemeno Health](http://elemenohealth.com) | 企業 | グロース | San Francisco／San Francisco County | healthcare, healthcare-it, saas, digital-health | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Ello](https://www.ello.com) | 企業 | グロース | San Francisco／San Francisco County | education, artificial-intelligence | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Elroy Air](https://elroyair.com/) | 企業 | スタートアップ | South San Francisco／San Mateo County | drones, aerospace, delivery, logistics, robotics | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Embeddables](https://embeddables.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, productivity, saas, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Ember](https://www.embercopilot.ai) | 企業 | グロース | San Francisco／San Francisco County | healthcare | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [enSilo](https://www.ensilo.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Entangl](https://www.entangl.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, engineering-product-and-design, artificial-intelligence, aerospace, enterprise-software, automation, automotive, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Entelo](https://www.entelo.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Envoy](https://envoy.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Etleap](https://etleap.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, infrastructure, data-engineering, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Eventbrite](https://www.eventbrite.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Eventual](https://www.daft.ai/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, infrastructure, computer-vision, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Every](https://every.io/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Evolve (makers of Podcast App & Rest)](https://getrest.app) | 企業 | グロース | San Francisco／San Francisco County | consumer, content, sleep-tech, digital-health, podcasts, services | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Exa](https://exa.ai) | 企業 | グロース | San Francisco／San Francisco County | b2b, developer-tools, search, ai, apis, software | 番地単位 | 確認済み（2026-10-03） | 住所・座標一致（2026-10-03） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Expensify](https://use.expensify.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Expo](https://expo.dev) | 企業 | グロース | San Francisco／San Francisco County | b2b, infrastructure, developer-tools, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Extern](http://www.extern.com) | 企業 | グロース | San Francisco／San Francisco County | consumer, job-and-career-services, education, marketplace, elearning, recruiting, remote-work, services | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Extole](https://www.extole.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Eze](https://www.ezeit.ai/) | 企業 | グロース | San Francisco／San Francisco County | b2b, retail, marketplace, electronics, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Faire](https://www.faire.com/) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, retail, marketplace, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Farcast](https://www.farcast.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | industrials, aviation-and-space, satellites, telecommunications, industrial | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Fathom](https://www.fathom.ai) | 企業 | グロース | San Francisco／San Francisco County | b2b, productivity, saas, ai, note-taking, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [Ferveret](http://www.ferveret.com) | 企業 | スタートアップ | San Francisco／San Francisco County | industrials, energy, hardware, climate, industrial | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-03） | 2026-10-03 |
|  | [FidoCure®](https://www.fidocure.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, healthcare-services, oncology | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Fieldguide](http://fieldguide.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, productivity, artificial-intelligence, workflow-automation, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Finch](https://tryfinch.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, fintech, hr-tech, api, software | 番地単位 | 確認済み（2026-10-04） | 住所・座標一致（2026-10-04） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [FitBit](https://www.fitbit.com/home) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Fivetran](http://fivetran.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, infrastructure, saas, analytics, data-engineering, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Flagright](https://flagright.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, fintech, compliance, regtech, ai, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Flai](https://www.useflai.com/) | 企業 | グロース | San Francisco／San Francisco County | industrials, automotive, industrial | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [FleetWorks](https://fleetworks.ai) | 企業 | グロース | San Francisco／San Francisco County | b2b, supply-chain-and-logistics, logistics, ai, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Flexport](https://www.flexport.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-10-03） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-10-03 |
|  | [FlutterFlow](https://flutterflow.io) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Focal Systems](http://www.focal.systems) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, retail, deep-learning, grocery, computer-vision, software | 番地単位 | 要確認（2026-10-04） | 住所・座標一致（2026-10-04） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Fond](https://fond.co/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Fondo](https://fondo.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, finance-and-accounting, fintech, saas, ai, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Forage](http://www.joinforage.com) | 企業 | グロース | San Francisco／San Francisco County | fintech, payments, govtech | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Forkable](https://forkable.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 都市中心（概略） | 要確認（2026-09-30） | 未照合（—） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Forward](https://goforward.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 要確認（2026-09-30） | 2026-09-30 |
|  | [Fossa](https://www.fossa.io/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Freshpaint](https://freshpaint.io) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, infrastructure, developer-tools, saas, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Front](https://front.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, productivity, saas, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Fundbox](https://fundbox.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [FundersClub](https://fundersclub.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 要確認（2026-09-30） | 2026-09-30 |
|  | [FurtherAI](https://www.furtherai.com/) | 企業 | グロース | San Francisco／San Francisco County | b2b, insurance, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Fuse AI](https://fuseai.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, sales, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Galvanize](https://www.galvanize.com/san-francisco) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 要確認（2026-09-30） | 2026-09-30 |
|  | [Genentech](https://www.gene.com/) | 企業 | 大規模 | South San Francisco／San Mateo County | biotechnology, life-sciences | 番地単位 | 確認済み（2026-10-01） | 住所・座標一致（2026-10-01） | 確認済み（2026-10-01） | 2026-10-01 |
|  | [General Assembly](https://generalassemb.ly/locations/san-francisco) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [General Proximity](https://www.generalproximity.bio/) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, drug-discovery-and-delivery, biotech, drug-discovery | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Genomelink](https://genomelink.io/) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, consumer-health-and-wellness, consumer-health-services, genomics | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Getaround](https://www.getaround.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [GETASAP](https://www.getasap.us) | 企業 | グロース | San Francisco／San Francisco County | b2b, supply-chain-and-logistics, logistics, supply-chain, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Giga](https://giga.ai/) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, artificial-intelligence, ai, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Gigs](https://gigs.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, engineering-product-and-design, fintech, hr-tech, api, ai, software | 番地単位 | 確認済み（2026-10-04） | 住所・座標一致（2026-10-04） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Gigster](https://gigster.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Gilead Sciences](https://www.gilead.com/) | 企業 | 大規模 | Foster City／San Mateo County | biotechnology, life-sciences | 番地単位 | 確認済み（2026-10-01） | 住所・座標一致（2026-10-01） | 確認済み（2026-10-01） | 2026-10-01 |
|  | [GitStart](https://www.gitstart.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, engineering-product-and-design, developer-tools, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Givecampus](https://www.givecampus.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 都市中心（概略） | 要確認（2026-09-30） | 未照合（—） | 要確認（2026-09-30） | 2026-09-30 |
|  | [Glep](https://glep.com) | 企業 | グロース | San Francisco／San Francisco County | fintech, banking-and-exchange, enterprise-software, neobank | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Glide](https://www.glideapps.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, artificial-intelligence, developer-tools, no-code, enterprise-software, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [GoGoGrandparent](https://gogograndparent.com) | 企業 | グロース | San Francisco／San Francisco County | consumer, home-and-personal, assistive-tech, consumer-health-services, services | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [GoLinks](https://www.golinks.io) | 企業 | グロース | San Jose／Santa Clara County | b2b, productivity, saas, collaboration, software | 番地単位 | 確認済み（2026-10-04） | 住所・座標一致（2026-10-04） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Goodby Silverstein & Partners](https://goodbysilverstein.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Google](https://www.google.com/) | 企業 | 大規模 | Mountain View／Santa Clara County | internet, cloud, ai | 番地単位 | 確認済み（2026-10-01） | 住所・座標一致（2026-10-01） | 確認済み（2026-10-01） | 2026-10-01 |
|  | [Govly](https://www.govly.com/) | 企業 | グロース | San Francisco／San Francisco County | government, saas, govtech | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Grain](https://trygrain.com/) | 企業 | グロース | San Francisco／San Francisco County | fintech, credit-and-lending | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 未確認（—） | 2026-10-04 |
|  | [Great Question](https://greatquestion.co) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, saas, design-tools, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Greptile](https://www.greptile.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, artificial-intelligence, developer-tools, ai, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Grey](https://grey.co) | 企業 | スタートアップ | San Francisco／San Francisco County | fintech, consumer, b2b, neobank, services, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Gridware](https://www.gridware.io) | 企業 | 大規模 | San Francisco／San Francisco County | industrials, energy, hardware, climate, enterprise-software, industrial | 番地単位 | 確認済み（2026-10-04） | 住所・座標一致（2026-10-04） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Groove Labs](http://www.groove.co/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [GrowthBook](https://www.growthbook.io) | 企業 | グロース | San Francisco／San Francisco County | b2b, analytics, developer-tools, open-source, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [GrowthX](https://growthx.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [GrubMarket](http://grubmarket.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, supply-chain-and-logistics, e-commerce, supply-chain, food-tech, agriculture, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Gumloop](https://www.gumloop.com/) | 企業 | グロース | San Francisco／San Francisco County | b2b, artificial-intelligence, automation, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Gumroad](https://gumroad.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Gusto](https://gusto.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-10-03） | 住所・座標一致（2026-09-30） | 要確認（2026-09-30） | 2026-10-03 |
|  | [Gym Class](https://gymclass.com) | 企業 | グロース | San Francisco／San Francisco County | consumer, social, virtual-reality, gaming, ai, services | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Hack Reactor](https://www.hackreactor.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-01） | 住所・座標一致（2026-10-01） | 確認済み（2026-10-01） | 2026-10-01 |
|  | [HackerRank](http://hackerrank.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, recruiting-and-talent, developer-tools, recruiting, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Hammerhead](https://www.hammerhead.io/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 都市中心（概略） | 要確認（2026-10-01） | 未照合（—） | 確認済み（2026-10-01） | 2026-10-01 |
|  | [Handl](https://handl.ai/) | 企業 | グロース | San Francisco／San Francisco County | b2b, operations, documents, deep-learning, fintech, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Handle](https://www.handle.com) | 企業 | 大規模 | San Francisco／San Francisco County | real-estate-and-construction, construction, payments, real-estate | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Hapi](https://hapi.trade/) | 企業 | グロース | San Francisco／San Francisco County | fintech, consumer-finance, finance, trading, cryptocurrency | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 未確認（—） | 2026-10-04 |
|  | [HappyRobot](https://happyrobot.ai) | 企業 | グロース | San Francisco／San Francisco County | b2b, supply-chain-and-logistics, logistics, ai-assistant, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Harper](https://www.harperinsure.com/) | 企業 | グロース | San Francisco／San Francisco County | fintech, insurance, ai | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Haven](https://haveninc.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-01） | 住所・座標一致（2026-10-01） | 要確認（2026-10-01） | 2026-10-01 |
|  | [Heap](https://heapanalytics.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-01） | 住所・座標一致（2026-10-01） | 確認済み（2026-10-01） | 2026-10-01 |
|  | [Hedgehog](http://hedgehogfoods.com) | 企業 | グロース | San Francisco／San Francisco County | industrials, manufacturing-and-robotics, robotics, climate, food-tech, agriculture, ai, industrial | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [HelloSign](https://www.hellosign.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-01） | 住所・座標一致（2026-10-01） | 確認済み（2026-10-01） | 2026-10-01 |
|  | [Helpshift](https://www.helpshift.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-01） | 住所・座標一致（2026-10-01） | 確認済み（2026-10-01） | 2026-10-01 |
|  | [Hightouch](https://hightouch.com/) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, marketing, enterprise-software, ai, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Hired](https://hired.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-01） | 住所・座標一致（2026-10-01） | 確認済み（2026-10-01） | 2026-10-01 |
|  | [HockeyStack](https://hockeystack.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, sales, saas, analytics, marketing, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [HOKALI](https://www.hokali.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, marketing, marketplace, edtech, software | 番地単位 | 確認済み（2026-10-04） | 住所・座標一致（2026-10-04） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Holberton School](https://www.holbertonschool.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-01） | 住所・座標一致（2026-10-01） | 確認済み（2026-10-01） | 2026-10-01 |
|  | [Hoodline](https://hoodline.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-01） | 住所・座標一致（2026-10-01） | 要確認（2026-10-01） | 2026-10-01 |
|  | [Hornblower Cruises](https://www.hornblower.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-01） | 要確認（2026-10-01） | 確認済み（2026-10-01） | 2026-10-01 |
|  | [HotelTonight](https://www.hoteltonight.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-01） | 住所・座標一致（2026-10-01） | 確認済み（2026-10-01） | 2026-10-01 |
|  | [HotPads](https://hotpads.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 要確認（2026-10-02） | 2026-10-02 |
|  | [HotSchedules](https://www.hotschedules.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [HP Inc.](https://www.hp.com/) | 企業 | 大規模 | Palo Alto／Santa Clara County | computing, electronics, services | 番地単位 | 確認済み（2026-10-01） | 住所・座標一致（2026-10-01） | 確認済み（2026-10-01） | 2026-10-01 |
|  | [HUD](https://www.hud.ai) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, artificial-intelligence, marketplace, reinforcement-learning, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 未確認（—） | 2026-10-04 |
|  | [Human Archive](https://www.humanarchive.ai/) | 企業 | 大規模 | San Francisco／San Francisco County | industrials, manufacturing-and-robotics, industrial | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Human Dx](http://humandx.org) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, healthcare-it, health-tech, diagnostics | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Human Interest](http://humaninterest.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, human-resources, fintech, saas, hr-tech, investing, software | 番地単位 | 確認済み（2026-10-04） | 住所・座標一致（2026-10-04） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Humand](https://humand.co) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, human-resources, artificial-intelligence, generative-ai, saas, productivity, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Hustle Inc](https://hustle.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [Hyperbound](https://hyperbound.ai) | 企業 | グロース | San Francisco／San Francisco County | b2b, sales, ai-enhanced-learning, sales-enablement, conversational-ai, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Hypotenuse AI](https://hypotenuse.ai/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, generative-ai, machine-learning, e-commerce, ai, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [iCrossing](http://www.icrossing.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-01） | 住所・座標一致（2026-10-01） | 確認済み（2026-10-01） | 2026-10-01 |
|  | [Ideo](https://www.ideo.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [idler](https://idler.ai/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, engineering-product-and-design, reinforcement-learning, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [IGN Entertainment](http://corp.ign.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [Imgix](https://www.imgix.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, infrastructure, developer-tools, saas, video, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Imgur](https://imgurinc.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [Immunity Project](http://immunityproject.org) | 企業 | スタートアップ | San Francisco／San Francisco County | unspecified, health-tech, biotech | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Indiegogo](https://www.indiegogo.com/en) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 要確認（2026-10-02） | 2026-10-02 |
|  | [inDinero](https://www.indinero.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-10-03） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-03 |
|  | [Industrial Microbes](http://imicrobes.com) | 企業 | スタートアップ | Alameda／Alameda County | healthcare, industrial-bio, carbon-capture-and-removal, bioplastic, climate | 番地単位 | 要確認（2026-10-04） | 住所・座標一致（2026-10-04） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Infina](http://infina.vn) | 企業 | グロース | San Francisco／San Francisco County | fintech, investing | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Infisical](https://infisical.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, security, developer-tools, saas, open-source, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Inkeep](https://inkeep.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, engineering-product-and-design, developer-tools, workflow-automation, customer-support, no-code, ai-assistant, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Insacart](https://www.instacart.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 都市中心（概略） | 要確認（2026-10-01） | 未照合（—） | 確認済み（2026-10-01） | 2026-10-01 |
|  | [Inscribe](https://www.inscribe.ai/) | 企業 | グロース | San Francisco／San Francisco County | b2b, infrastructure, artificial-intelligence, fintech, fraud-detection, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [insightly](https://www.insightly.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-09-10） | 住所・座標一致（2026-10-02） | 要確認（2026-10-02） | 2026-09-10 |
|  | [Instawork](http://instawork.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, recruiting-and-talent, marketplace, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Instrumentl](https://www.instrumentl.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, saas, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Intel](https://www.intel.com/) | 企業 | 大規模 | Santa Clara／Santa Clara County | semiconductors, manufacturing, computing | 番地単位 | 要確認（2026-10-01） | 住所・座標一致（2026-10-01） | 確認済み（2026-10-01） | 2026-10-01 |
|  | [Intercom](https://www.intercom.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [Intryc](https://intryc.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, operations, customer-success, analytics, customer-support, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Intuit](https://www.intuit.com/) | 企業 | 大規模 | Mountain View／Santa Clara County | fintech, enterprise-software | 番地単位 | 確認済み（2026-10-01） | 住所・座標一致（2026-10-01） | 確認済み（2026-10-01） | 2026-10-01 |
|  | [Intuitive Surgical](https://www.intuitive.com/) | 企業 | 大規模 | Sunnyvale／Santa Clara County | medical-devices, robotics, healthcare | 番地単位 | 確認済み（2026-10-01） | 住所・座標一致（2026-10-01） | 確認済み（2026-10-01） | 2026-10-01 |
|  | [Inventive AI](https://www.inventive.ai/) | 企業 | スタートアップ | Mountain View／Santa Clara County | b2b, sales, artificial-intelligence, generative-ai, saas, software | 番地単位 | 確認済み（2026-10-04） | 住所・座標一致（2026-10-04） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Invert](http://www.invertbio.com/) | 企業 | グロース | San Francisco／San Francisco County | healthcare, industrial-bio, cellular-agriculture, machine-learning, synthetic-biology, biotech | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [IOMETE](https://www.iomete.com/) | 企業 | グロース | Mountain View／Santa Clara County | b2b, infrastructure, analytics, software | 番地単位 | 確認済み（2026-10-04） | 住所・座標一致（2026-10-04） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Ironclad](http://ironcladapp.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, legal, saas, legaltech, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Isengard Industries Inc](http://isengardindustries.com/) | 企業 | グロース | San Francisco／San Francisco County | industrials, defense, artificial-intelligence, swarm-robotics, unmanned-vehicle, industrial | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Jerry](https://jerry.ai/) | 企業 | 大規模 | San Francisco／San Francisco County | fintech, insurance | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Jestor](https://jestor.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, productivity, operations, ai, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [JITX](http://www.jitx.com) | 企業 | スタートアップ | San Francisco／San Francisco County | industrials, manufacturing-and-robotics, automation, ai, industrial | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Joy](https://withjoy.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 確認済み（2026-10-01） | 2026-10-03 |
|  | [Joyent](https://www.joyent.com) | 企業 | グロース | Mountain View／Santa Clara County | technology | 番地単位 | 確認済み（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [Juicebox](https://juicebox.ai/) | 企業 | グロース | San Francisco／San Francisco County | b2b, recruiting-and-talent, generative-ai, recruiting, hr-tech, ai, software | 番地単位 | 確認済み（2026-10-04） | 住所・座標一致（2026-10-04） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Jumpshot](https://www.jumpshot.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-01） | 住所・座標一致（2026-10-01） | 要確認（2026-10-01） | 2026-10-01 |
|  | [June Oven](https://juneoven.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [Juniper Networks](https://www.juniper.net/) | 企業 | 大規模 | Sunnyvale／Santa Clara County | networking, telecommunications | 番地単位 | 確認済み（2026-10-01） | 住所・座標一致（2026-10-01） | 確認済み（2026-10-01） | 2026-10-01 |
|  | [Just Appraised](https://www.justappraised.com) | 企業 | グロース | San Francisco／San Francisco County | government, saas, govtech | 番地単位 | 要確認（2026-10-04） | 住所・座標一致（2026-10-04） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Kastle](https://kastle.ai/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Keeper](https://keepertax.com) | 企業 | スタートアップ | San Francisco／San Francisco County | fintech, consumer-finance, consumer, services | 番地単位 | 確認済み（2026-10-04） | 住所・座標一致（2026-10-04） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Kentik](https://www.kentik.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [KERNEL](https://www.kernel.sh) | 企業 | グロース | San Francisco／San Francisco County | b2b, infrastructure, artificial-intelligence, developer-tools, cloud-computing, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Khosla Ventures](https://www.khoslaventures.com/) | VC・CVC | 該当なし | Menlo Park／San Mateo County | venture-capital, technology | 番地単位 | 確認済み（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Kinter](https://kinter.ai) | 企業 | グロース | San Francisco／San Francisco County | b2b, finance-and-accounting, saas, finance, ai, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Kissmetrics](https://www.kissmetrics.com/home/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 要確認（2026-10-02） | 2026-10-02 |
|  | [KittyHawk](https://kittyhawk.io/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 都市中心（概略） | 要確認（2026-10-01） | 未照合（—） | 要確認（2026-10-01） | 2026-10-01 |
|  | [Kivo Health](https://kivohealth.com) | 企業 | グロース | San Francisco／San Francisco County | healthcare, healthcare-services, consumer-health-services, telehealth, digital-health | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [KLA](https://www.kla.com/) | 企業 | 大規模 | Milpitas／Santa Clara County | semiconductors, manufacturing, equipment | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Koala](https://www.teachwithkoala.com) | 企業 | スタートアップ | San Francisco／San Francisco County | education, marketplace, gaming, metaverse | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Labdoor](https://labdoor.com) | 企業 | スタートアップ | San Francisco／San Francisco County | consumer, food-and-beverage, marketplace, consumer-health-services, services | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Lago](https://www.getlago.com/) | 企業 | グロース | San Francisco／San Francisco County | b2b, finance-and-accounting, finops, fintech, saas, open-source, billing, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Lam Research](https://www.lamresearch.com/) | 企業 | 大規模 | Fremont／Alameda County | semiconductors, manufacturing, equipment | 番地単位 | 確認済み（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Lamar Health](http://www.lamarhealth.com) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, healthcare-it, health-tech, ai | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Laminar](https://laminar.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, enterprise-software, ai, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [LanceDB](https://lancedb.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, infrastructure, aiops, machine-learning, open-source, data-engineering, software | 番地単位 | 確認済み（2026-10-04） | 住所・座標一致（2026-10-04） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Landor](https://landor.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [Lanesurf](https://www.lanesurf.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, artificial-intelligence, logistics, supply-chain, ai, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Lapel](https://lapel.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, artificial-intelligence, customer-success, sales, customer-support, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Latent](https://latenthealth.com) | 企業 | グロース | San Francisco／San Francisco County | healthcare, healthcare-it, artificial-intelligence, b2b, insurance, enterprise, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Lattice](https://lattice.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-10-03） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-03 |
|  | [Lawrence Berkeley National Laboratory](https://www.lbl.gov/) | 大学・研究機関 | 該当なし | Berkeley／Alameda County | research, energy | 番地単位 | 確認済み（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Lawrence Livermore National Laboratory](https://www.llnl.gov/) | 大学・研究機関 | 該当なし | Livermore／Alameda County | research, science, energy, defense | 番地単位 | 確認済み（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Layer](https://layer.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [Layerup](https://www.uselayerup.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, generative-ai, enterprise, ai, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [LeadGenius](http://leadgenius.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, sales, marketing, ai, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Leadspace](https://www.leadspace.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [Leanplum](https://www.leanplum.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [Leap Motion](https://www.leapmotion.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 要確認（2026-10-02） | 要確認（2026-10-02） | 2026-10-02 |
|  | [Leaping AI](https://www.leapingai.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, artificial-intelligence, conversational-ai, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Legalist](https://www.legalist.com) | 企業 | グロース | San Francisco／San Francisco County | fintech, credit-and-lending, legaltech | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Legion Health](https://legionhealth.com) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, consumer-health-and-wellness, consumer-health-services, telehealth, mental-health, ai | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [LemonBox](http://www.lemonbox.com/) | 企業 | グロース | San Francisco／San Francisco County | healthcare, consumer-health-and-wellness, generative-ai, health-tech, health-and-wellness, ai, china | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [LendingHome](https://www.lendinghome.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [Lendtable](http://lendtable.com) | 企業 | グロース | San Francisco／San Francisco County | fintech, credit-and-lending | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 未確認（—） | 2026-10-04 |
|  | [Lever](https://www.lever.co/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-01） | 住所・座標一致（2026-10-01） | 確認済み（2026-10-01） | 2026-10-01 |
|  | [Levro](https://www.levro.com) | 企業 | スタートアップ | San Francisco／San Francisco County | fintech, banking-and-exchange, payments, finance, b2b, international, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Lexi](https://getlexi.io/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, legal, saas, legaltech, ai, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Liftopia](https://about.liftopia.com/index.html) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 要確認（2026-10-02） | 2026-10-02 |
|  | [Lightbend](http://www.lightbend.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 要確認（2026-10-02） | 2026-10-02 |
|  | [LinkedIn](https://www.linkedin.com/) | 企業 | 大規模 | Sunnyvale／Santa Clara County | social-media, enterprise-software, recruiting | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Linqia](http://www.linqia.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [LiteLLM](https://www.litellm.ai/) | 企業 | グロース | San Francisco／San Francisco County | b2b, aiops, artificial-intelligence, developer-tools, generative-ai, open-source, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Literably](https://literably.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 要確認（2026-10-02） | 2026-10-02 |
|  | [Lithium Technologies](https://www.lithium.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 要確認（2026-10-02） | 2026-10-02 |
|  | [Lively, Inc.](https://livelyme.com) | 企業 | 大規模 | San Francisco／San Francisco County | healthcare, healthcare-it, fintech, health-tech, hr-tech | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Living Carbon](https://www.livingcarbon.com) | 企業 | グロース | San Francisco／San Francisco County | industrials, climate, synthetic-biology, biotech, agriculture, industrial | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Lob](https://lob.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [Locale](https://www.shoplocale.com) | 企業 | スタートアップ | San Francisco／San Francisco County | consumer, food-and-beverage, grocery, marketplace, delivery, food, services | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Lockheed Martin Space](https://www.lockheedmartin.com/en-us/who-we-are/business-areas/space.html) | 企業 | 大規模 | Sunnyvale／Santa Clara County | aerospace, defense, space, manufacturing | 番地単位 | 要確認（2026-09-29） | 要確認（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Logikcull](http://logikcull.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [Lollipuff](http://lollipuff.com) | 企業 | スタートアップ | San Francisco／San Francisco County | consumer, apparel-and-cosmetics, marketplace, e-commerce, fashion, services | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Long Term Stock Exchange](http://ltse.com) | 企業 | グロース | San Francisco／San Francisco County | fintech, banking-and-exchange, b2b, software | 都市中心（概略） | 要確認（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Looker](https://looker.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [loopfour](https://www.loopfour.com) | 企業 | グロース | San Francisco／San Francisco County | fintech, ai-enhanced-learning, workflow-automation, automation, operations, ai-assistant | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Luel](https://luel.ai) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, infrastructure, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Luminai](https://www.luminai.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, saas, enterprise, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Lyft](https://www.lyft.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [Lygos](http://www.lygos.com) | 企業 | グロース | San Francisco／San Francisco County | healthcare, industrial-bio, synthetic-biology, climate, biotechnology | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 未確認（—） | 2026-10-04 |
|  | [Mach9](https://www.mach9.ai/) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, machine-learning, computer-vision, design-tools, infrastructure, ai, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Macy's](https://www.macys.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 要確認（2026-10-02） | 2026-10-02 |
|  | [Mailgun](https://www.mailgun.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [Mapbox](http://www.mapbox.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [Marin Economic Forum](https://marineconomicforum.org/) | 支援機関 | 該当なし | San Rafael／Marin County | economic-development, networking | 都市中心（概略） | 要確認（2026-09-29） | 未照合（—） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Marvell Technology](https://www.marvell.com/) | 企業 | 大規模 | Santa Clara／Santa Clara County | semiconductors, data-infrastructure, networking | 番地単位 | 確認済み（2026-09-29） | 要確認（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Mashery (acquired)](https://www.mashery.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 要確認（2026-10-02） | 2026-10-02 |
|  | [Mashgin](http://mashgin.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, retail, artificial-intelligence, cashierless-checkout, deep-learning, hardware, computer-vision, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Massdrop](https://www.massdrop.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 都市中心（概略） | 要確認（2026-10-01） | 未照合（—） | 要確認（2026-10-01） | 2026-10-01 |
|  | [Mastra](https://mastra.ai) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, artificial-intelligence, developer-tools, open-source, ai, software | 番地単位 | 確認済み（2026-10-04） | 住所・座標一致（2026-10-04） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Mattermark](https://mattermark.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [Mattermost](http://mattermost.com) | 企業 | 大規模 | Palo Alto／Santa Clara County | b2b, productivity, devsecops, collaboration, security, open-source, software | 番地単位 | 要確認（2026-10-04） | 住所・座標一致（2026-10-04） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Matternet](https://www.matternet.com/) | 企業 | グロース | Mountain View／Santa Clara County | drones, aerospace, delivery, logistics, robotics | 番地単位 | 確認済み（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Mayfield](https://www.mayfield.com/) | VC・CVC | 該当なし | Menlo Park／San Mateo County | venture-capital, technology | 都市中心（概略） | 要確認（2026-09-29） | 未照合（—） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [MBX](http://us.memebox.com) | 企業 | 大規模 | San Francisco／San Francisco County | consumer, apparel-and-cosmetics, beauty, services | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 未確認（—） | 2026-10-04 |
|  | [McKesson](http://www.mckesson.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [mdhub](https://www.mdhub.ai/) | 企業 | グロース | San Francisco／San Francisco County | healthcare | 番地単位 | 確認済み（2026-10-04） | 住所・座標一致（2026-10-04） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Meadow](https://getmeadow.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, retail, saas, cannabis, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Mederva](https://medervahealth.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, consumer-health-services, telehealth, digital-health | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Medicare Vox (fka Fair Square)](https://www.medicarevox.com) | 企業 | グロース | San Francisco／San Francisco County | healthcare, consumer-health-and-wellness, fintech, consumer-health-services | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 未確認（—） | 2026-10-04 |
|  | [Medium](https://medium.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 要確認（2026-10-02） | 要確認（2026-10-02） | 2026-10-02 |
|  | [Medplum](https://www.medplum.com) | 企業 | グロース | San Francisco／San Francisco County | healthcare, healthcare-it, developer-tools, open-source | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Medrio](http://medrio.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [MemSQL](http://www.memsql.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [Mende Design](http://mendedesign.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [Mentra](https://mentra.glass) | 企業 | スタートアップ | San Francisco／San Francisco County | consumer, virtual-and-augmented-reality, artificial-intelligence, hardware, open-source, ar, services | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Meru Health](http://www.meruhealth.com) | 企業 | グロース | San Francisco／San Francisco County | healthcare, consumer-health-and-wellness, mental-health-tech, digital-health | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Mesh](https://mesh.ai/) | 企業 | グロース | San Francisco／San Francisco County | b2b, human-resources, saas, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Mesosphere](https://mesosphere.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [Meta](https://about.meta.com/) | 企業 | 大規模 | Menlo Park／San Mateo County | social-media, internet, ai | 番地単位 | 確認済み（2026-09-24） | 要確認（2026-09-29） | 確認済み（2026-09-29） | 2026-09-24 |
|  | [Metric Insights](http://www.metricinsights.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [Metriport](https://metriport.com/) | 企業 | グロース | San Francisco／San Francisco County | healthcare, healthcare-it, b2b, digital-health, api, ai, software | 番地単位 | 確認済み（2026-10-04） | 住所・座標一致（2026-10-04） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Metromile](https://www.metromile.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 要確認（2026-10-02） | 2026-10-02 |
|  | [Mezmo](https://www.mezmo.com/) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, infrastructure, developer-tools, devsecops, saas, kubernetes, data-engineering, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Microsoft](https://www.microsoft.com/en-us/) | 企業 | 大規模 | Mountain View／Santa Clara County | cloud, enterprise-software, ai | 番地単位 | 確認済み（2026-10-01） | 住所・座標一致（2026-10-01） | 確認済み（2026-10-01） | 2026-10-01 |
|  | [Middesk](http://www.middesk.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, operations, fintech, saas, software | 番地単位 | 確認済み（2026-10-04） | 住所・座標一致（2026-10-04） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Middleware](https://www.middleware.io) | 企業 | グロース | San Francisco／San Francisco County | b2b, infrastructure, aiops, saas, ai, software | 番地単位 | 確認済み（2026-10-04） | 住所・座標一致（2026-10-04） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [MindsDB](https://www.mindsdb.com/) | 企業 | グロース | San Francisco／San Francisco County | b2b, infrastructure, developer-tools, machine-learning, open-source, enterprise-software, ai, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Mino Games](http://minomonsters.com) | 企業 | スタートアップ | San Francisco／San Francisco County | consumer, gaming, services | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Mintlify](https://mintlify.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, developer-tools, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [MissionU](https://www.missionu.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 要確認（2026-10-02） | 2026-10-02 |
|  | [Mixpanel](https://mixpanel.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-10-03） | 住所・座標一致（2026-10-01） | 確認済み（2026-10-01） | 2026-10-03 |
|  | [Modern Treasury](http://www.moderntreasury.com/) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, finance-and-accounting, fintech, api, software | 番地単位 | 確認済み（2026-10-04） | 住所・座標一致（2026-10-04） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [ModernLoop](http://modernloop.io) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, recruiting-and-talent, recruiting, productivity, hr-tech, remote-work, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Moichor](https://moichor.com/) | 企業 | グロース | San Francisco／San Francisco County | healthcare, diagnostics | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Momentic](https://momentic.ai) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, engineering-product-and-design, developer-tools, enterprise-software, ai, software | 番地単位 | 確認済み（2026-10-04） | 住所・座標一致（2026-10-04） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Monkey Inferno](http://monkeyinferno.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [MoogSoft](https://www.moogsoft.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [Motion](https://www.usemotion.com/) | 企業 | グロース | San Francisco／San Francisco County | b2b, productivity, artificial-intelligence, saas, ai, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Mozart Data](http://www.mozartdata.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, infrastructure, saas, data-engineering, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Mth Sense](http://www.mthsense.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, marketing, privacy, advertising, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Multiply Labs](http://multiplylabs.com/) | 企業 | グロース | San Francisco／San Francisco County | industrials, manufacturing-and-robotics, robotics, industrial | 番地単位 | 確認済み（2026-10-04） | 住所・座標一致（2026-10-04） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Mux](https://mux.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-10-03） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-03 |
|  | [Names & Faces](http://www.namesandfaces.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, human-resources, saas, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [NanoNets](https://nanonets.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, productivity, developer-tools, saas, ai, software | 番地単位 | 確認済み（2026-10-04） | 住所・座標一致（2026-10-04） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Napa Valley College](https://www.napavalley.edu/) | 大学・研究機関 | 該当なし | Napa／Napa County | education, community | 番地単位 | 確認済み（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [NASA Ames Research Center](https://www.nasa.gov/ames/) | 大学・研究機関 | 該当なし | Moffett Field／Santa Clara County | aerospace, space, research | 番地単位 | 要確認（2026-09-29） | 要確認（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Nash](https://getnashglobal.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | fintech, banking-as-a-service, finops, b2b, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Nash](https://www.usenash.com/) | 企業 | グロース | San Francisco／San Francisco County | b2b, supply-chain-and-logistics, marketplace, saas, delivery, logistics, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Navdy](https://www.navdy.com/#see-the-road) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 要確認（2026-10-02） | 2026-10-02 |
|  | [Naytev](https://www.naytev.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [NepFin](https://www.nepfin.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [Nestor](https://nestorup.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, human-resources, saas, hr-tech, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [NetApp](https://www.netapp.com/) | 企業 | 大規模 | San Jose／Santa Clara County | data-storage, cloud, enterprise-software | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 要確認（2026-09-29） | 2026-09-29 |
|  | [Netflix](https://www.netflix.com/) | 企業 | 大規模 | Los Gatos／Santa Clara County | streaming, media, technology | 番地単位 | 確認済み（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [New Incentives](http://www.newincentives.org) | 企業 | グロース | San Francisco／San Francisco County | unspecified, nonprofit | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [New Relic](https://newrelic.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [NEXGENT](https://ngt.academy/) | 企業 | グロース | San Francisco／San Francisco County | education | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [NimbleRx](http://nimblerx.com) | 企業 | 大規模 | San Francisco／San Francisco County | healthcare, consumer-health-and-wellness, saas | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [No Means No Worldwide](https://www.nomeansnoworldwide.org/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [Nobell Foods](http://www.nobellfoods.com) | 企業 | グロース | San Francisco／San Francisco County | consumer, food-and-beverage, sustainability, climate, food-tech, climatetech, services | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 未確認（—） | 2026-10-04 |
|  | [NoRedInk](https://www.noredink.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [Notable Labs](https://www.notablelabs.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 要確認（2026-10-02） | 2026-10-02 |
|  | [Nova Credit](http://neednova.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [Numen](https://www.numen.com) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, diagnostics, machine-learning, biotech, ai | 番地単位 | 確認済み（2026-10-04） | 住所・座標一致（2026-10-04） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Numeral](https://www.numeral.com/) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, finance-and-accounting, fintech, saas, finance, compliance, e-commerce, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Numerion Labs](https://www.numerionlabs.ai) | 企業 | グロース | San Francisco／San Francisco County | healthcare, drug-discovery-and-delivery, ai-powered-drug-discovery, deep-learning, biotech, drug-discovery, oncology | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Numero](https://www.numero.ai) | 企業 | スタートアップ | San Francisco／San Francisco County | fintech, saas | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Nuna](https://www.nuna.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [NVIDIA](https://www.nvidia.com/) | 企業 | 大規模 | Santa Clara／Santa Clara County | semiconductors, ai, computing | 番地単位 | 確認済み（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Oath (former Yahoo!)](https://www.oath.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [Observe.AI](https://observe.ai) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, sales, saas, customer-service, ai, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Okta](https://www.okta.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [Okteto](https://okteto.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, infrastructure, developer-tools, saas, open-source, kubernetes, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Olark](http://olark.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, retail, sales, marketing, customer-service, chat, ai, software | 都市中心（概略） | 確認済み（2026-10-04） | 未照合（—） | 確認済み（2026-10-04） | 2026-10-04 |
|  | [Omnistrate](http://www.omnistrate.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, developer-tools, saas, cloud-computing, infrastructure, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [One Degree](http://1degree.org) | 企業 | スタートアップ | San Francisco／San Francisco County | unspecified, nonprofit | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [OneSchema](https://www.oneschema.co) | 企業 | グロース | San Francisco／San Francisco County | b2b, operations, artificial-intelligence, saas, workflow-automation, ai, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [OneSignal](https://onesignal.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, marketing, developer-tools, saas, messaging, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [OpenAI](https://www.openai.com/) | 企業 | 大規模 | San Francisco／San Francisco County | artificial-intelligence, technology | 番地単位 | 要確認（2026-10-01） | 住所・座標一致（2026-10-01） | 要確認（2026-10-01） | 2026-10-01 |
|  | [OpenDNS (Cisco)](http://www.opendns.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [Opendoor](https://www.opendoor.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [Openlayer](https://openlayer.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, aiops, artificial-intelligence, developer-tools, generative-ai, machine-learning, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Opentable](https://www.opentable.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 要確認（2026-10-02） | 2026-10-02 |
|  | [Optimizely](https://www.optimizely.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [Oracle](https://www.oracle.com/) | 企業 | 大規模 | Redwood City／San Mateo County | enterprise-software, cloud, database | 番地単位 | 確認済み（2026-09-29） | 住所・座標一致（2026-09-29） | 要確認（2026-09-29） | 2026-09-29 |
|  | [Orangewood Labs](http://www.orangewood.co) | 企業 | グロース | San Francisco／San Francisco County | industrials, manufacturing-and-robotics, artificial-intelligence, generative-ai, hardware, robotics, industrial | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Osmind](https://osmind.org/) | 企業 | グロース | San Francisco／San Francisco County | healthcare, healthcare-it, mental-health-tech, saas, health-tech | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Outschool](http://outschool.com) | 企業 | 大規模 | San Francisco／San Francisco County | education, marketplace | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Outset](https://outset.ai/) | 企業 | グロース | San Francisco／San Francisco County | b2b, analytics, saas, market-research, enterprise-software, ai, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Overview](https://overview.ai) | 企業 | グロース | San Francisco／San Francisco County | industrials, manufacturing-and-robotics, deep-learning, iot, computer-vision, manufacturing, ai, industrial | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Oway](https://www.shipoway.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, infrastructure, artificial-intelligence, api, supply-chain, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [OWNY](https://www.owny.com) | 企業 | スタートアップ | San Francisco／San Francisco County | fintech, artificial-intelligence, banking-as-a-service, crypto-web3 | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Oxygen](http://getoxygen.com) | 企業 | グロース | San Francisco／San Francisco County | fintech, consumer-finance, neobank | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Padlet](https://padlet.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, productivity, education, saas, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Pair Team](https://pairteam.com/) | 企業 | 大規模 | San Francisco／San Francisco County | healthcare, healthcare-services, health-tech, workflow-automation, digital-health, healthcare-it | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Palo Alto Networks](https://www.paloaltonetworks.com/) | 企業 | 大規模 | Santa Clara／Santa Clara County | cybersecurity, enterprise-software | 番地単位 | 確認済み（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Pantheon](https://pantheon.io/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [ParadeDB](https://paradedb.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, developer-tools, analytics, open-source, infrastructure, databases, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Parallel Bio](http://parallel.bio) | 企業 | グロース | San Francisco／San Francisco County | healthcare, drug-discovery-and-delivery, ai-powered-drug-discovery, biotech | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Parameter](https://parameter.ai?utm_source=ycombinator&utm_medium=referral&utm_campaign=parameter-profile) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, security, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Parsable](https://www.parsable.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [Patagonia](http://www.patagonia.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [PatternFast (prior: Tailornova/Couturme)](http://patternfast.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, artificial-intelligence, apparel, fashion, ai, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Pave](https://pave.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, recruiting-and-talent, fintech, hr-tech, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [PayPal](https://www.paypal.com/) | 企業 | 大規模 | San Jose／Santa Clara County | fintech, payments | 番地単位 | 確認済み（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [People.ai](https://people.ai) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, sales, artificial-intelligence, saas, enterprise, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Periscope Data](https://www.periscopedata.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [Perit.AI](https://www.perit.ai/) | 企業 | グロース | San Francisco／San Francisco County | b2b, data-labeling, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Petcube](http://petcube.com) | 企業 | グロース | San Francisco／San Francisco County | consumer, consumer-electronics, hardware, services | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Pibit.ai](https://pibit.ai) | 企業 | 大規模 | San Francisco／San Francisco County | fintech, insurance, artificial-intelligence, generative-ai, b2b, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Pickle](https://www.pickle.com) | 企業 | スタートアップ | San Francisco／San Francisco County | consumer, consumer-electronics, artificial-intelligence, hardware, augmented-reality, services | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [PicnicAI](https://picnic.ai) | 企業 | 大規模 | San Francisco／San Francisco County | healthcare, machine-learning, health-tech, digital-health, nlp | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Pine Park Health](http://pineparkhealth.com) | 企業 | グロース | San Francisco／San Francisco County | healthcare, healthcare-services | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Pinterest](https://www.pinterest.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [Pique Tea](https://www.piquetea.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-01） | 住所・座標一致（2026-10-01） | 確認済み（2026-10-01） | 2026-10-01 |
|  | [Plaid](https://plaid.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [Plane](https://plane.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, human-resources, fintech, saas, compliance, hr-tech, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Planet](https://www.planet.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology, space, satellites, imaging, data | 番地単位 | 確認済み（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [PlanGrid](https://www.plangrid.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [Platzi](https://platzi.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, productivity, ai-enhanced-learning, education, elearning, sales-enablement, hr-tech, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Ploy](https://ploy.ai) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Pocket](https://heypocket.com/now) | 企業 | スタートアップ | San Francisco／San Francisco County | consumer, services | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Poll Everywhere](https://www.polleverywhere.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, analytics, saas, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Polymath Robotics](http://www.polymathrobotics.com) | 企業 | グロース | San Francisco／San Francisco County | industrials, manufacturing-and-robotics, hard-tech, machine-learning, robotics, unmanned-vehicle, ai, industrial | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [PostHog](https://www.posthog.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, analytics, developer-tools, open-source, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Practice Fusion](https://www.practicefusion.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [Pramp](https://www.pramp.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 都市中心（概略） | 要確認（2026-10-01） | 未照合（—） | 確認済み（2026-10-01） | 2026-10-01 |
|  | [Prelim](https://prelim.com/) | 企業 | グロース | San Francisco／San Francisco County | fintech, banking-as-a-service | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Prezi](https://prezi.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [Probably Genetic](https://www.probablygenetic.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, diagnostics, health-tech, biotech, genomics, ai | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Prodigal](https://prodigaltech.com/) | 企業 | グロース | San Francisco／San Francisco County | fintech, credit-and-lending, saas, consumer-finance, ai | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Product School](https://www.productschool.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 確認済み（2026-10-02） | 2026-10-02 |
|  | [Promise](http://promise-pay.com) | 企業 | グロース | San Francisco／San Francisco County | government, artificial-intelligence, fintech, govtech, payments | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Prosperworks](https://www.prosperworks.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 要確認（2026-10-02） | 2026-10-02 |
|  | [Protocol Labs](https://protocol.ai/) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, infrastructure, crypto-web3, open-source, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Proven Group](https://www.provenskincare.com) | 企業 | グロース | San Francisco／San Francisco County | consumer, artificial-intelligence, machine-learning, e-commerce, services | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Pulley](https://pulley.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, finance-and-accounting, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Pulse](https://www.runpulse.com/) | 企業 | グロース | San Francisco／San Francisco County | b2b, infrastructure, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Pump.co](https://www.pump.co/) | 企業 | グロース | San Francisco／San Francisco County | fintech, artificial-intelligence, finops, saas, b2b, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Pyka](https://www.flypyka.com/) | 企業 | スタートアップ | Alameda／Alameda County | drones, aerospace, robotics, defense, manufacturing | 番地単位 | 確認済み（2026-09-29） | 要確認（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Qadium](https://qadium.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-02） | 住所・座標一致（2026-10-02） | 要確認（2026-10-02） | 2026-10-02 |
|  | [Quantcast](https://www.quantcast.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Quantstamp](https://quantstamp.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, security, crypto-web3, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Quartzy](https://www.quartzy.com) | 企業 | 大規模 | San Francisco／San Francisco County | healthcare, healthcare-it, saas, b2b, e-commerce, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Quid Inc](https://quid.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Quo (fka OpenPhone)](https://www.quo.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, operations, saas, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Qventus](http://qventus.com) | 企業 | 大規模 | San Francisco／San Francisco County | healthcare, healthcare-it, artificial-intelligence, saas, digital-health | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Qvin](https://qvin.com/) | 企業 | グロース | San Francisco／San Francisco County | healthcare, consumer-health-and-wellness, ai-powered-drug-discovery, consumer-health-services, telemedicine | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Radius](https://radius.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-01） | 住所・座標一致（2026-10-01） | 確認済み（2026-10-01） | 2026-10-01 |
|  | [Rainforest](https://www.rainforestqa.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, developer-tools, saas, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [RaiseMe](https://www.raise.me) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Ramen VR](https://ramenvr.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | consumer, gaming, artificial-intelligence, virtual-reality, social, ar, services | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [RazorFrog](https://razorfrog.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-10-01） | 住所・座標一致（2026-10-01） | 確認済み（2026-10-01） | 2026-10-01 |
|  | [Reach](https://reachpower.com) | 企業 | グロース | San Francisco／San Francisco County | industrials, energy, climate, industrial | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Readily](https://readily.ai) | 企業 | グロース | San Francisco／San Francisco County | healthcare, b2b, compliance, regtech, ai, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [ReadMe](http://readme.io/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Ready](https://ready.net) | 企業 | グロース | San Francisco／San Francisco County | b2b, fintech, saas, telecommunications, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Recall.ai](https://www.recall.ai) | 企業 | グロース | San Francisco／San Francisco County | b2b, infrastructure, artificial-intelligence, api, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Recurrency](http://www.recurrency.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, sales, saas, ai, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Red Bridge Internet](https://www.redbridgenet.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Reddit](https://www.reddit.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 要確認（2026-09-29） | 要確認（2026-09-29） | 2026-09-29 |
|  | [Reducto](https://reducto.ai) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, documents, data-engineering, enterprise-software, search, ai, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Reform](https://www.reformhq.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, supply-chain-and-logistics, artificial-intelligence, workflow-automation, compliance, logistics, supply-chain, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Remind](https://www.remind.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Remix](https://www.remix.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Replika](https://replika.ai/) | 企業 | グロース | San Francisco／San Francisco County | consumer, content, mental-health, conversational-ai, services | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Replit](https://replit.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, developer-tools, collaboration, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Replo](https://replo.app/) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, artificial-intelligence, developer-tools, marketing, ai, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Rescale](https://rescale.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, engineering-product-and-design, cloud-computing, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Respan](https://respan.ai) | 企業 | グロース | San Francisco／San Francisco County | b2b, infrastructure, aiops, developer-tools, saas, monitoring, ai, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [RetailReady](https://www.retailreadyai.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, supply-chain-and-logistics, compliance, logistics, supply-chain, ai, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Retell AI](https://retellai.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, artificial-intelligence, ai, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Retool](https://retool.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, productivity, developer-tools, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [RevenueCat](https://www.revenuecat.com/) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, engineering-product-and-design, developer-tools, subscriptions, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Revl](https://revl.com/) | 企業 | グロース | San Francisco／San Francisco County | b2b, marketing, machine-learning, saas, sports-tech, video, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Revyl](https://www.revyl.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, infrastructure, artificial-intelligence, developer-tools, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Ridecell](https://www.ridecell.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, saas, iot, enterprise, ai, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Rippling](http://rippling.com/) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, human-resources, hr-tech, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Rithm School](https://www.rithmschool.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 要確認（2026-09-29） | 2026-09-29 |
|  | [Roboflow](https://roboflow.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, engineering-product-and-design, developer-tools, machine-learning, computer-vision, enterprise, ai, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Roofr](https://roofr.com/) | 企業 | グロース | San Francisco／San Francisco County | consumer, home-and-personal, saas, construction, proptech, services | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Rootly](https://rootly.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, infrastructure, aiops, developer-tools, saas, security, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Routable](https://routable.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, finance-and-accounting, fintech, payments, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Runway Incubator](http://www.runway.is/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 要確認（2026-09-29） | 2026-09-29 |
|  | [SafetyWing](http://www.safetywing.com) | 企業 | 大規模 | San Francisco／San Francisco County | fintech, insurance, consumer-health-services, remote-work | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Saildrone](https://www.saildrone.com/) | 企業 | グロース | Alameda／Alameda County | drones, robotics, defense, science, manufacturing | 番地単位 | 確認済み（2026-08-24） | 要確認（2026-09-30） | 確認済み（2026-09-30） | 2026-08-24 |
|  | [Salesforce](https://www.salesforce.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [SalesPatriot](https://www.salespatriot.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, operations, saas, sales, ai, industrial, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Salient](https://www.trysalient.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, fintech, generative-ai, operations, ai, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Salon Media Group](https://www.salon.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [San José State University](https://www.sjsu.edu/) | 大学・研究機関 | 該当なし | San Jose／Santa Clara County | education, research | 番地単位 | 確認済み（2026-09-30） | 要確認（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Sandia National Laboratories, California](https://www.sandia.gov/) | 大学・研究機関 | 該当なし | Livermore／Alameda County | research, science, energy, defense | 番地単位 | 確認済み（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Sandisk](https://www.sandisk.com/) | 企業 | 大規模 | Milpitas／Santa Clara County | semiconductors, data-storage, electronics | 番地単位 | 確認済み（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Sano](https://sano.co/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 要確認（2026-09-29） | 2026-09-29 |
|  | [Santa Clara University](https://www.scu.edu/) | 大学・研究機関 | 該当なし | Santa Clara／Santa Clara County | education, research | 番地単位 | 確認済み（2026-09-30） | 住所・座標一致（2026-09-30） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [Say Media](https://www.saymedia.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Scale AI](http://scale.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, engineering-product-and-design, artificial-intelligence, machine-learning, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Scality](http://www.scality.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Scout](http://scouthealth.com) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, diagnostics, consumer-health-services, covid-19, health-tech, consumer-products | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Scribd](http://scribd.com) | 企業 | 大規模 | San Francisco／San Francisco County | consumer, content, ai-enhanced-learning, remote-work, edtech, services | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Scripted](https://www.scripted.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Seam](https://seam.co) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, developer-tools, iot, api, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Segmed](https://segmed.ai) | 企業 | グロース | San Francisco／San Francisco County | healthcare, diagnostics, health-tech, ai | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Segment](https://segment.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Semble](https://www.sembleai.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, artificial-intelligence, saas, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Sendbird](https://sendbird.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, engineering-product-and-design, artificial-intelligence, saas, enterprise, ai, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Sentry](https://sentry.io) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Sephora](https://www.sephora.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 要確認（2026-09-29） | 2026-09-29 |
|  | [Sequoia Capital](https://www.sequoiacap.com/) | VC・CVC | 該当なし | Menlo Park／San Mateo County | venture-capital, technology | 都市中心（概略） | 要確認（2026-09-30） | 未照合（—） | 確認済み（2026-09-30） | 2026-09-30 |
|  | [ServiceNow](https://www.servicenow.com/) | 企業 | 大規模 | Santa Clara／Santa Clara County | enterprise-software, cloud | 番地単位 | 確認済み（2026-08-23） | 住所・座標一致（2026-09-30） | 要確認（2026-09-30） | 2026-08-23 |
|  | [Shef](https://www.shef.com) | 企業 | グロース | San Francisco／San Francisco County | consumer, food-and-beverage, marketplace, food, food-tech, services | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Shepherd](https://shepherdinsurance.com) | 企業 | グロース | San Francisco／San Francisco County | fintech, insurance, construction, energy | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Shogun](http://www.shoguninc.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 要確認（2026-09-29） | 2026-09-29 |
|  | [Shogun](https://getshogun.com/) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, saas, e-commerce, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Shopify](https://www.shopify.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-01） | 住所・座標一致（2026-10-01） | 確認済み（2026-10-01） | 2026-10-01 |
|  | [Short Story](https://shortstorybox.com) | 企業 | 大規模 | San Francisco／San Francisco County | consumer, apparel-and-cosmetics, machine-learning, marketplace, e-commerce, services | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Sieve](https://sievedata.com/) | 企業 | グロース | San Francisco／San Francisco County | b2b, infrastructure, developer-tools, video, data-labeling, data-engineering, ai, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Sift Science](https://siftscience.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Sight Machine](http://sightmachine.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [SigmaMind AI](https://sigmamind.ai?utm_source=yc&utm_medium=web) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, saas, call-center, ai, conversational-ai, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [SigNoz](https://signoz.io) | 企業 | グロース | San Francisco／San Francisco County | b2b, infrastructure, developer-tools, saas, open-source, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [SimplyInsured](http://simplyinsured.com) | 企業 | グロース | San Francisco／San Francisco County | healthcare, healthcare-services, health-insurance | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [SINAI](http://www.sinai.com) | 企業 | グロース | San Francisco／San Francisco County | industrials, energy, carbon-capture-and-removal, saas, climate, industrial | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Sindeo](https://www.sindeo.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 要確認（2026-09-29） | 2026-09-29 |
|  | [SingleStore](https://www.singlestore.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, infrastructure, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [SIRUM](http://sirum.org) | 企業 | スタートアップ | San Francisco／San Francisco County | unspecified, consumer-health-services, nonprofit | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Sixtyfour](https://www.sixtyfour.ai/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, infrastructure, enterprise-software, ai, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Skydio](https://www.skydio.com/) | 企業 | グロース | San Mateo／San Mateo County | drones, aerospace, robotics, artificial-intelligence, defense | 番地単位 | 確認済み（2026-10-01） | 住所・座標一致（2026-10-01） | 確認済み（2026-10-01） | 2026-10-01 |
|  | [SLAC National Accelerator Laboratory](https://www6.slac.stanford.edu/) | 大学・研究機関 | 該当なし | Menlo Park／San Mateo County | research, science | 番地単位 | 確認済み（2026-09-28） | 要確認（2026-09-28） | 確認済み（2026-09-28） | 2026-09-28 |
|  | [Slack](https://slack.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-01） | 住所・座標一致（2026-10-01） | 確認済み（2026-10-01） | 2026-10-01 |
|  | [Slalom Consulting](https://www.slalom.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Slash](https://www.slash.com/) | 企業 | グロース | San Francisco／San Francisco County | fintech | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Slope](http://www.slopepay.com) | 企業 | スタートアップ | San Francisco／San Francisco County | fintech, payments, artificial-intelligence, machine-learning, fraud-detection | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Smarking](https://www.smarking.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [SmartBiz Loans](https://www.smartbizloans.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Snackpass](https://snackpass.co) | 企業 | グロース | San Francisco／San Francisco County | consumer, food-and-beverage, marketplace, e-commerce, services | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [SnapMagic](https://www.snapmagic.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, developer-tools, hardware, marketplace, ai, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Snappr](https://www.snappr.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, marketplace, workflow-automation, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Snowflake](https://www.snowflake.com/) | 企業 | 大規模 | Menlo Park／San Mateo County | cloud, data, enterprise-software | 番地単位 | 確認済み（2026-09-28） | 住所・座標一致（2026-09-28） | 確認済み（2026-09-28） | 2026-09-28 |
|  | [SockSoho](https://socksoho.com) | 企業 | グロース | San Francisco／San Francisco County | consumer, apparel-and-cosmetics, e-commerce, services | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [SoFi](https://www.sofi.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-01） | 住所・座標一致（2026-10-01） | 要確認（2026-10-01） | 2026-10-01 |
|  | [Solano Economic Development Corporation](https://solanoedc.org/) | 支援機関 | 該当なし | Fairfield／Solano County | economic-development, networking | 番地単位 | 確認済み（2026-09-28） | 住所・座標一致（2026-09-28） | 確認済み（2026-09-28） | 2026-09-28 |
|  | [Sonder](https://www.sonder.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-01） | 住所・座標一致（2026-10-01） | 確認済み（2026-10-01） | 2026-10-01 |
|  | [Sonoma State University](https://www.sonoma.edu/) | 大学・研究機関 | 該当なし | Rohnert Park／Sonoma County | education, research | 番地単位 | 確認済み（2026-08-24） | 要確認（2026-09-28） | 要確認（2026-09-28） | 2026-08-24 |
|  | [Sourceress](http://sourceress.com/) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, artificial-intelligence, machine-learning, data-engineering, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Spark Program](http://sparkprogram.org/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Sparkcentral](https://www.sparkcentral.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Speak](http://speak.com) | 企業 | グロース | San Francisco／San Francisco County | consumer, social, artificial-intelligence, education, services | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Spellbrush](https://spellbrush.com) | 企業 | グロース | San Francisco／San Francisco County | consumer, gaming, artificial-intelligence, deep-learning, generative-ai, services | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Sphinx](https://sphinxhq.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | fintech | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Splunk](https://www.splunk.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Spotify](https://www.spotifyjobs.com/location/san-francisco/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-01） | 住所・座標一致（2026-10-01） | 要確認（2026-10-01） | 2026-10-01 |
|  | [Square](https://squareup.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [SRI International](https://www.sri.com/) | 大学・研究機関 | 該当なし | Menlo Park／San Mateo County | research, technology, artificial-intelligence | 番地単位 | 確認済み（2026-09-28） | 住所・座標一致（2026-09-28） | 確認済み（2026-09-28） | 2026-09-28 |
|  | [Stably AI (Orca)](http://onorca.dev/) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, artificial-intelligence, developer-tools, saas, devops, web-development, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Stacksync](https://www.stacksync.com/) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Stamen Design](https://stamen.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Standard AI](https://standard.ai) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, retail, retail-tech, ai, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Stanford University](https://www.stanford.edu/) | 大学・研究機関 | 該当なし | Stanford／Santa Clara County | education, research | 番地単位 | 確認済み（2026-09-28） | 要確認（2026-09-28） | 確認済み（2026-09-28） | 2026-09-28 |
|  | [STARK BANK](https://starkbank.com) | 企業 | グロース | San Francisco／San Francisco County | fintech, banking-and-exchange, neobank | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Stayflexi](https://business.stayflexi.com/) | 企業 | グロース | San Francisco／San Francisco County | b2b, travel, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Stich Labs](https://www.stitchlabs.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Stitch Fix](https://www.stitchfix.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 要確認（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Storylane](https://www.storylane.io/) | 企業 | グロース | San Francisco／San Francisco County | b2b, saas, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Strada](https://www.getstrada.com/) | 企業 | グロース | San Francisco／San Francisco County | b2b, saas, insurance, ai, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Streak](http://streak.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, sales, saas, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Stream](http://www.stream.claims) | 企業 | スタートアップ | San Francisco／San Francisco County | fintech, insurance, saas, b2b, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Stripe](https://stripe.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-10-03） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-10-03 |
|  | [StubHub](https://www.stubhub.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 要確認（2026-09-29） | 2026-09-29 |
|  | [StumbleUpon](http://corp.stumbleupon.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 要確認（2026-09-29） | 2026-09-29 |
|  | [Substack](https://substack.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, marketing, marketplace, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Suger](https://www.suger.io/) | 企業 | グロース | San Francisco／San Francisco County | b2b, sales, marketplace, saas, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Sully](https://www.sully.ai) | 企業 | グロース | San Francisco／San Francisco County | b2b, productivity, artificial-intelligence, saas, health-tech, healthcare, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Sunflower](https://sunflowerclinic.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, healthcare-services | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Supabase](https://supabase.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, infrastructure, developer-tools, open-source, big-data, data-engineering, databases, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Svix](https://www.svix.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, infrastructure, developer-tools, open-source, api, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Swif.ai](https://www.swif.ai) | 企業 | グロース | San Francisco／San Francisco County | b2b, security, saas, compliance, enterprise, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Swift Navigation](https://www.swiftnav.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-01） | 住所・座標一致（2026-10-01） | 確認済み（2026-10-01） | 2026-10-01 |
|  | [Swiftly](https://www.goswift.ly/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Swrve](https://www.swrve.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 要確認（2026-09-29） | 2026-09-29 |
|  | [sync.](https://sync.so/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Syncly](https://syncly.app/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, marketing, generative-ai, saas, social-media, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Synopsys](https://www.synopsys.com/) | 企業 | 大規模 | Sunnyvale／Santa Clara County | semiconductors, software, eda | 番地単位 | 確認済み（2026-09-28） | 住所・座標一致（2026-09-28） | 確認済み（2026-09-28） | 2026-09-28 |
|  | [SyntheticFi](https://www.syntheticfi.com/) | 企業 | グロース | San Francisco／San Francisco County | fintech | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Synthio Labs](https://synthiolabs.com/) | 企業 | グロース | San Francisco／San Francisco County | healthcare, artificial-intelligence, biotech, enterprise | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Talkable](http://talkable.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, retail, e-commerce, referrals, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Tamarind Bio](https://www.tamarind.bio) | 企業 | グロース | San Francisco／San Francisco County | b2b, ai-powered-drug-discovery, artificial-intelligence, saas, biotech, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Tandem](https://tandemspace.com/) | 企業 | グロース | San Francisco／San Francisco County | b2b, office-management, real-estate, proptech, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Tara AI](http://www.tara.ai) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, productivity, artificial-intelligence, generative-ai, saas, devops, ai, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Tarjimly (acquired)](https://tarjimly.org) | 企業 | グロース | San Francisco／San Francisco County | healthcare, marketplace, nonprofit | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [TaskRabbit](https://www.taskrabbit.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Tavus](https://www.tavus.io) | 企業 | グロース | San Francisco／San Francisco County | b2b, artificial-intelligence, generative-ai, video, infrastructure, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [TaxGPT](https://www.taxgpt.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, finance-and-accounting, artificial-intelligence, fintech, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [TechSoup](http://www.techsoup.org/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Teespring](https://teespring.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Teleport](https://goteleport.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, infrastructure, developer-tools, devsecops, next-gen-network-security, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Telmai](https://www.telm.ai/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, analytics, ai, ml, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Tempo](https://tempo.fit/) | 企業 | 大規模 | San Francisco／San Francisco County | healthcare, consumer-health-and-wellness, machine-learning, consumer-health-services | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Terra API](http://tryterra.co) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, saas, digital-health, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Tesla Fremont Factory](https://www.tesla.com/) | 企業 | 大規模 | Fremont／Alameda County | automotive, manufacturing, energy | 番地単位 | 確認済み（2026-08-23） | 要確認（2026-09-28） | 要確認（2026-09-28） | 2026-08-23 |
|  | [Tesorio](https://www.tesorio.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, finance-and-accounting, fintech, saas, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [testRigor](https://testrigor.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, developer-tools, saas, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Tetra](https://asktetra.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 都市中心（概略） | 要確認（2026-10-01） | 未照合（—） | 確認済み（2026-10-01） | 2026-10-01 |
|  | [Thirdlove](https://www.thirdlove.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [ThousandEyes](https://www.thousandeyes.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-01） | 住所・座標一致（2026-10-01） | 要確認（2026-10-01） | 2026-10-01 |
|  | [Thumbtack](https://www.thumbtack.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Thunder](https://www.makethunder.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Thunkable](http://thunkable.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, marketing, developer-tools, saas, design-tools, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Tilt](https://www.tilt.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-01） | 住所・座標一致（2026-10-01） | 確認済み（2026-10-01） | 2026-10-01 |
|  | [Tint](http://www.tint.ai) | 企業 | グロース | San Francisco／San Francisco County | fintech, insurance, artificial-intelligence, developer-tools | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Token Transit](https://tokentransit.com) | 企業 | スタートアップ | San Francisco／San Francisco County | government, fintech, govtech, transportation | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Tolmo](https://www.tolmo.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, security, devsecops, ai, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Toma](http://www.toma.com/) | 企業 | グロース | San Francisco／San Francisco County | b2b, operations, artificial-intelligence, marketing, customer-support, automotive, conversational-ai, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Toothy AI](https://www.toothy.ai/) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, healthcare-it, artificial-intelligence, health-tech, dental, conversational-ai | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Topkey](https://www.topkey.io/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, finance-and-accounting, fintech, real-estate, proptech, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Townsquared](https://townsquared.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Traction](https://www.tractionco.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Tradecraft](http://tradecraft.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-01） | 住所・座標一致（2026-10-01） | 要確認（2026-10-01） | 2026-10-01 |
|  | [Treasury Prime](https://treasuryprime.com) | 企業 | 大規模 | San Francisco／San Francisco County | fintech, banking-and-exchange, banking-as-a-service, b2b, api, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Trellis AI](https://runtrellis.com/) | 企業 | グロース | San Francisco／San Francisco County | b2b, data-engineering, infrastructure, ai, databases, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [trendmedia](http://trendmedia.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Triplebyte](https://triplebyte.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 要確認（2026-09-29） | 2026-09-29 |
|  | [TRM Labs](https://trmlabs.com/) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, security, fintech, machine-learning, govtech, cybersecurity, data-engineering, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Truewind](https://www.trytruewind.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, finance-and-accounting, artificial-intelligence, fintech, generative-ai, saas, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Trulia](https://www.trulia.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Truss](https://trusspayments.com) | 企業 | スタートアップ | San Francisco／San Francisco County | fintech, banking-and-exchange, payments, construction | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Turo](https://turo.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 要確認（2026-09-29） | 2026-09-29 |
|  | [TwentyThree](https://www.twentythree.net/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Twilio](https://www.twilio.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Two Dots](https://www.twodots.com) | 企業 | グロース | San Francisco／San Francisco County | fintech, consumer-finance, artificial-intelligence, real-estate, b2b, ml, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Uber](https://www.uber.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 要確認（2026-09-29） | 2026-09-29 |
|  | [Ubicloud](https://www.ubicloud.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, infrastructure, cloud-computing, ai, databases, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [UC Santa Cruz Silicon Valley Campus](https://siliconvalley.ucsc.edu/) | 大学・研究機関 | 該当なし | Santa Clara／Santa Clara County | education, research | 番地単位 | 要確認（2026-09-28） | 要確認（2026-09-28） | 確認済み（2026-09-28） | 2026-09-28 |
|  | [UNISON](https://www.in-unison.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | consumer, virtual-and-augmented-reality, hardware, virtual-reality, gaming, services | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [University of California Berkeley](https://www.berkeley.edu/) | 大学・研究機関 | 該当なし | Berkeley／Alameda County | education, research | 番地単位 | 要確認（2026-09-28） | 要確認（2026-09-28） | 確認済み（2026-09-28） | 2026-09-28 |
|  | [University of California San Francisco](https://www.ucsf.edu/) | 大学・研究機関 | 該当なし | San Francisco／San Francisco County | education, life-sciences | 番地単位 | 確認済み（2026-09-28） | 住所・座標一致（2026-09-28） | 確認済み（2026-09-28） | 2026-09-28 |
|  | [Unlayer](https://unlayer.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, productivity, artificial-intelligence, developer-tools, saas, design-tools, ai-assistant, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Unsloth AI](https://unsloth.ai/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, engineering-product-and-design, developer-tools, generative-ai, open-source, infrastructure, ai, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Upfort](https://www.upfort.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, security, next-gen-network-security, insurance, cyber-insurance, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Upgrade](http://www.upgrade.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Upgraded](http://getupgraded.com) | 企業 | スタートアップ | San Francisco／San Francisco County | consumer, consumer-electronics, fintech, retail, services | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Uplane](https://uplane.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, marketing, artificial-intelligence, saas, analytics, advertising, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Upsight](http://www.upsight.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 要確認（2026-09-29） | 2026-09-29 |
|  | [Upwave](http://www.upwave.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, operations, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [UrbanSitter](https://www.urbansitter.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 都市中心（概略） | 要確認（2026-10-01） | 未照合（—） | 確認済み（2026-10-01） | 2026-10-01 |
|  | [User Testing Inc.](https://www.usertesting.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Usul](https://www.usul.com) | 企業 | スタートアップ | San Francisco／San Francisco County | government, artificial-intelligence, generative-ai, govtech | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Vanta](https://vanta.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, security, compliance, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Vapi](https://vapi.ai) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, artificial-intelligence, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Variance](https://www.variance.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, security, compliance, cybersecurity, enterprise-software, ai, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Velt](https://velt.dev) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, productivity, developer-tools, saas, collaboration, compliance, ai, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Verge Genomics](http://vergegenomics.com) | 企業 | グロース | San Francisco／San Francisco County | healthcare, drug-discovery-and-delivery | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [VergeSense](http://www.vergesense.com) | 企業 | グロース | San Francisco／San Francisco County | real-estate-and-construction, housing-and-real-estate, artificial-intelligence, proptech, real-estate, construction | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Verifiable](https://verifiable.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, healthcare-it, compliance, api | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Veryfi, Inc.](https://www.veryfi.com/) | 企業 | グロース | San Francisco／San Francisco County | b2b, artificial-intelligence, computer-vision, finance, api, ai, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Viglink](http://www.viglink.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Vitagene](https://vitagene.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Vitalize](https://vitalize.care) | 企業 | グロース | San Francisco／San Francisco County | healthcare, saas, b2b, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Voiceops](https://voiceops.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Vooma](https://www.vooma.ai) | 企業 | グロース | San Francisco／San Francisco County | b2b, supply-chain-and-logistics, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Vori](https://www.vori.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, retail, grocery, saas, retail-tech, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Wafer](https://www.wafer.ai) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, engineering-product-and-design, artificial-intelligence, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Wake](https://wake.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Wanelo](https://wanelo.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Waterplan](http://waterplan.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, machine-learning, saas, climate, climatetech, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Watsi](https://watsi.org/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 要確認（2026-09-29） | 2026-09-29 |
|  | [Weave](https://weaveos.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, engineering-product-and-design, artificial-intelligence, analytics, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Weave Robotics](https://www.weaverobotics.com) | 企業 | グロース | San Francisco／San Francisco County | industrials, manufacturing-and-robotics, industrial | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Webflow](https://webflow.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-10-03） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-10-03 |
|  | [Weebly](https://www.weebly.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Weekend (fmr. Volley)](https://weekend.com) | 企業 | グロース | San Francisco／San Francisco County | consumer, gaming, artificial-intelligence, entertainment, ai, conversational-ai, services | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Wefunder](http://wefunder.com) | 企業 | グロース | San Francisco／San Francisco County | fintech, asset-management, investing | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Wikia](http://www.wikia.com/fandom) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 要確認（2026-09-29） | 2026-09-29 |
|  | [Wing](https://wing.com/) | 企業 | グロース | Palo Alto／Santa Clara County | drones, aerospace, delivery, logistics, robotics | 番地単位 | 要確認（2026-09-28） | 要確認（2026-09-28） | 確認済み（2026-09-28） | 2026-09-28 |
|  | [Wish](https://www.wish.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 都市中心（概略） | 要確認（2026-10-01） | 未照合（—） | 確認済み（2026-10-01） | 2026-10-01 |
|  | [Within](http://within.ai) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, artificial-intelligence, enterprise, ai, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Wizeline](https://www.wizeline.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Womply](http://www.womply.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 要確認（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Wonderschool](https://www.wonderschool.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 都市中心（概略） | 要確認（2026-10-01） | 未照合（—） | 確認済み（2026-10-01） | 2026-10-01 |
|  | [Wordware](https://wordware.ai/) | 企業 | スタートアップ | San Francisco／San Francisco County | consumer, aiops, artificial-intelligence, developer-tools, infrastructure, services | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Y Combinator](https://www.ycombinator.com/) | VC・CVC | 該当なし | San Francisco／San Francisco County | accelerator, venture-capital | 都市中心（概略） | 要確認（2026-09-28） | 未照合（—） | 確認済み（2026-09-28） | 2026-09-28 |
|  | [Yammer](https://www.yammer.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Yelp](https://www.yelpblog.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Yoneda Health](https://tambua.health/) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, health-tech | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Zapier](http://zapier.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, productivity, saas, automation, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [ZBiotics](https://zbiotics.com/) | 企業 | グロース | San Francisco／San Francisco County | healthcare, consumer-health-and-wellness, synthetic-biology, health-and-wellness, food-and-beverage | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Zeal](https://www.zeal.com) | 企業 | グロース | San Francisco／San Francisco County | fintech, saas, b2b, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Zedo](https://www.zedo.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 要確認（2026-09-29） | 2026-09-29 |
|  | [Zendar](http://www.zendar.io) | 企業 | グロース | San Francisco／San Francisco County | industrials, automotive, hardware, radar, industrial | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Zendesk](https://www.zendesk.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Zendrive](https://www.zendrive.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 要確認（2026-09-29） | 2026-09-29 |
|  | [Zenflow](http://zenflow.com) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, medical-devices | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Zenput](https://www.zenput.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Zenreach](https://www.zenreach.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Zensors](https://www.zensors.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, aiops, artificial-intelligence, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Zeo Route Planner](https://zeorouteplanner.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, supply-chain-and-logistics, saas, logistics, supply-chain, transportation, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Zeplin](https://zeplin.io) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, engineering-product-and-design, developer-tools, saas, design-tools, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [ZeroCater](https://zerocater.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 要確認（2026-09-29） | 2026-09-29 |
|  | [Zignal Labs](http://zignallabs.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Zinc](https://www.zinc.it/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 要確認（2026-09-29） | 2026-09-29 |
|  | [Zip](https://ziphq.com/) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, operations, procurement, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Zipline](https://www.zipline.com/) | 企業 | グロース | South San Francisco／San Mateo County | drones, aerospace, delivery, logistics, robotics | 番地単位 | 要確認（2026-09-28） | 住所・座標一致（2026-09-28） | 確認済み（2026-09-28） | 2026-09-28 |
|  | [Zitara Technologies, Inc.](https://zitara.com) | 企業 | グロース | San Francisco／San Francisco County | industrials, energy, climate, electric-vehicles, industrial | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Zoom](https://www.zoom.com/) | 企業 | 大規模 | San Jose／Santa Clara County | enterprise-software, communications | 番地単位 | 確認済み（2026-09-28） | 住所・座標一致（2026-09-28） | 確認済み（2026-09-28） | 2026-09-28 |
|  | [Zozi](https://www.zozi.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-01） | 住所・座標一致（2026-10-01） | 確認済み（2026-10-01） | 2026-10-01 |
|  | [Zuddl](http://www.zuddl.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, saas, software | 都市中心（概略） | 確認済み（2026-10-03） | 未照合（—） | 未確認（—） | 2026-10-03 |
|  | [Zumper](https://www.zumper.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
|  | [Zynga](https://www.zynga.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-29） | 住所・座標一致（2026-09-29） | 確認済み（2026-09-29） | 2026-09-29 |
