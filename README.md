# ベイエリア企業マップ

**公開URL: <https://map.nightly.dedyn.io/>**

バージョン2.0：企業探索・現所在確認・フィールドノートを統合したディレクトリです。

サンフランシスコ・ベイエリアの日本関連企業・VC/CVC・支援機関・大学などを地図上に可視化する個人プロジェクトです。ベイエリア進出検討時の初回コンタクト先の把握を目的としています。

> [!WARNING]
> 本データは個人的な利用を想定してゆるく管理しているものです。正確性・網羅性・鮮度は保証しません。実務で使う場合は必ず各社の公式情報をご確認ください。

## データサマリ

- データ更新日: 2026-10-09
- 現所在確認日: 2026-10-09
- 座標照合日: 2026-10-09
- URL確認日: 2026-10-09
- 掲載件数: 1040件
- 日本関連: 135件
- 大規模（scale: large）: 263件
- 製造業関連: 115件
- 企業以外（VC/CVC・支援機関・大学など）: 30件
- 位置精度: 番地単位 508件／都市中心の概略位置 532件
- 現在のベイエリア所在を確認済み: 656件
- 対象カウンティ: 全9カウンティ（Alameda County・Contra Costa County・Marin County・Napa County・San Francisco County・San Mateo County・Santa Clara County・Solano County・Sonoma County）

## 初回コンタクトの目安

1. **JETRO San Francisco / Global Acceleration Hub** と **Japan Innovation Campus**
2. **Plug and Play Tech Center** と **500 Global**
3. **Stanford / UC Berkeley** 系エコシステム、主要VC、日本人コミュニティ

## 使い方

- 各ピンは公式サイトのロゴ候補（favicon）を使った**正方形アイコン**です。縮小時は近隣企業を件数表示へまとめ、町レベルでは同一番地や都市中心の代表地点に集まったピンを展開します（8件以下は円形、9件以上はらせん）。日本関連は枠色、都市中心の概略位置はアイコンと接続線の破線、現所在未確認は琥珀色のマークで表示します。概略位置の展開は企業の実際の番地を示すものではありません。
- **検索ボックス**で社名・日本語名・都市・企業紹介などのキーワードで絞り込めます。
- **フィルター**で日系／タイプ／規模／業種／カウンティを組み合わせて絞り込めます（日系・大企業・製造業などのプリセットボタン付き）。
- **Your field notebook**で企業を保存し、詳細パネルに個別メモを残せます。保存先は利用中のブラウザのlocalStorageです。保存・メモの同期は行いません。ストレージに保存できない場合は警告します。
- **City / Around San Mateo**で都市やSan Mateoの中心から10・25・50km圏内に絞れます。概略位置の企業では距離も概算です。**Verified presence**は現在の所在確認済みだけを表示します。
- ズーム16以下では実住所の企業を件数表示でまとめ、17以上では全企業を個別アイコンで表示します。同一住所の企業は円形・らせんで展開します。**Shared offices** ボタンはauto（ズーム17から自動展開）とexpanded（任意のズームで共有住所を展開）を切り替えます。黄色い都市代表地点は24社以下ならズーム17で自動展開、25社以上はクリック後に24社ずつ表示し、Previous / Nextで全社を閲覧できます。Collapseで代表地点の数字へ戻れます。同じ都市の概略位置は1つの代表印にまとめ、番地ピンの背後に置かれます。
- **Export results CSV**で絞り込み中の全件と個別メモ、確認出典を出力できます。日本語対応のUTF-8 BOM付きです。**Fit results**で表示対象が地図内に収まります。
- サンフランシスコの黄色い代表印だけは、同じ座標にある実住所アイコンと重ならないよう画面上で72px左へずらします。都市アイコンを閲覧している間は代表印を隠し、件数とページ操作は専用パネルに表示します。保存された所在地の座標は変更しません。
- 検索・都市・距離・地図範囲はURLで共有できます。保存リストとメモはブラウザごとの情報です。地図ライブラリが読み込めない場合も企業リストを利用できます。
- URLの共有プレビューには、日本語のタイトル・説明と1200×630の地図カードを設定しています。共有画像は `assets/og-bay-area-v1.jpg` として静的配信し、OGPとTwitterカードに対応しています。

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
| ○ | [500 Global](https://500.co/) | VC・CVC | 大規模 | San Francisco／San Francisco County | venture-capital, accelerator, startup-education | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
| ○ | [Acario Innovation / Tokyo Gas](https://acarioinnovation.com/) | 企業 | 大規模 | San Mateo／San Mateo County | energy, venture-capital | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
| ○ | [Advantest America](https://www.advantest.com) | 企業 | 大規模 | San Jose／Santa Clara County | semiconductors, manufacturing | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
| ○ | [Aflac Ventures](https://www.aflacventures.com/) | 企業 | 大規模 | Palo Alto／Santa Clara County | venture-capital, insurance | 都市中心（概略） | 要確認（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
| ○ | [AGC Electronics America](https://www.agc.com/) | 企業 | 大規模 | San Jose／Santa Clara County | materials, manufacturing | 都市中心（概略） | 要確認（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
| ○ | [Alps Alpine North America](https://www.alpsalpine.com/) | 企業 | 大規模 | San Jose／Santa Clara County | electronics, automotive | 都市中心（概略） | 要確認（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
| ○ | [Anritsu Company](https://www.anritsu.com/en-us/) | 企業 | 大規模 | Morgan Hill／Santa Clara County | telecommunications, manufacturing | 都市中心（概略） | 要確認（2026-10-06） | 未照合（—） | 要確認（2026-09-30） | 2026-10-06 |
| ○ | [Astellas South San Francisco](https://www.astellas.com/us/) | 企業 | 大規模 | South San Francisco／San Mateo County | biotechnology, life-sciences | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
| ○ | [Autify](https://autify.com/) | 企業 | グロース | San Francisco／San Francisco County | software, ai | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
| ○ | [Azbil North America](https://www.azbil.com/) | 企業 | 大規模 | Santa Clara／Santa Clara County | automation, manufacturing | 都市中心（概略） | 要確認（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
| ○ | [Canon USA](https://www.usa.canon.com/) | 企業 | 大規模 | San Jose／Santa Clara County | imaging, electronics | 番地単位 | 要確認（2026-09-30） | 住所・座標一致（2026-10-06） | 要確認（2026-09-30） | 2026-09-30 |
| ○ | [Chugai Pharmabody Research](https://www.chugai-pharmabody.com/) | 企業 | 大規模 | South San Francisco／San Mateo County | biotechnology, life-sciences | 都市中心（概略） | 要確認（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
| ○ | [Dai-ichi Life Innovation Lab Silicon Valley](https://www.dai-ichi-life-hd.com/en/) | 企業 | 大規模 | Palo Alto／Santa Clara County | insurance, innovation | 都市中心（概略） | 要確認（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
| ○ | [Daiwa Capital Markets America San Francisco](https://us.daiwacm.com/) | 企業 | 大規模 | San Francisco／San Francisco County | finance, securities | 番地単位 | 確認済み（2026-08-23） | 住所・座標一致（2026-10-06） | 要確認（2026-09-30） | 2026-08-23 |
| ○ | [DENSO Silicon Valley Innovation Center](https://www.denso.com/us-ca/en/) | 企業 | 大規模 | Palo Alto／Santa Clara County | automotive, manufacturing | 番地単位 | 確認済み（2026-10-03） | 住所・座標一致（2026-10-06） | 要確認（2026-09-30） | 2026-10-03 |
| ○ | [DISCO Hi-Tec America](https://www.disco.co.jp/eg/) | 企業 | 大規模 | Santa Clara／Santa Clara County | semiconductors, manufacturing | 都市中心（概略） | 要確認（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
| ○ | [dotData](https://dotdata.com/) | 企業 | 大規模 | San Mateo／San Mateo County | ai, data | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
| ○ | [ENEOS Silicon Valley](https://www.hd.eneos-hd.co.jp/english/) | 企業 | 大規模 | San Mateo／San Mateo County | energy, materials | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 要確認（2026-09-30） | 2026-10-06 |
| ○ | [Epson America](https://epson.com/) | 企業 | 大規模 | San Jose／Santa Clara County | imaging, electronics | 都市中心（概略） | 要確認（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
| ○ | [EXEDY Corporation — Silicon Valley Office](https://www.exedy.com/en/) | 企業 | 大規模 | San Mateo／San Mateo County | automotive, manufacturing | 番地単位 | 要確認（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [FANUC America](https://www.fanucamerica.com/) | 企業 | 大規模 | Union City／Alameda County | robotics, manufacturing | 都市中心（概略） | 要確認（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
| ○ | [FUJIFILM Dimatix](https://www.fujifilm.com/fdmx/en/) | 企業 | 大規模 | Santa Clara／Santa Clara County | industrial-printing, electronics, manufacturing | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
| ○ | [Fujitsu North America](https://www.fujitsu.com/us) | 企業 | 大規模 | Sunnyvale／Santa Clara County | electronics, software | 都市中心（概略） | 要確認（2026-10-03） | 未照合（—） | 要確認（2026-10-01） | 2026-10-03 |
| ○ | [Furukawa Electric North America Bay Area](https://www.furukawa.co.jp/en/) | 企業 | 大規模 | San Jose／Santa Clara County | electronics, manufacturing | 都市中心（概略） | 要確認（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
| ○ | [Hitachi America](https://www.hitachi.us) | 企業 | 大規模 | Santa Clara／Santa Clara County | electronics, industrial | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
| ○ | [Hitachi Solutions America, Ltd. — Bay Area](https://global.hitachi-solutions.com/) | 企業 | 大規模 | San Mateo／San Mateo County | information-technology, consulting | 番地単位 | 確認済み（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [Honda Innovations Silicon Valley](https://www.honda.com/innovation) | 企業 | 大規模 | Mountain View／Santa Clara County | automotive, innovation | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 要確認（2026-10-01） | 2026-10-06 |
| ○ | [Honda Research Institute USA](https://usa.honda-ri.com) | 企業 | 大規模 | San Jose／Santa Clara County | automotive, robotics | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
| ○ | [HORIBA Instruments Bay Area](https://www.horiba.com/usa/) | 企業 | 大規模 | Sunnyvale／Santa Clara County | scientific-instruments, manufacturing | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
| ○ | [HOYA Corporation USA](https://www.hoya.com/) | 企業 | 大規模 | Milpitas／Santa Clara County | optics, manufacturing | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
| ○ | [Idemitsu Americas](https://idemitsuamericas.com/) | 企業 | 大規模 | San Jose／Santa Clara County | energy, materials, manufacturing | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
| ○ | [IHI](https://www.ihi.co.jp/en/) | 企業 | 大規模 | San Mateo／San Mateo County | industrial, manufacturing, aerospace, defense, space | 番地単位 | 確認済み（2026-10-03） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-07） | 2026-10-09 |
| ○ | [Innovation Core SEI](https://sumitomoelectric.com/) | 企業 | 大規模 | San Jose／Santa Clara County | electronics, materials, manufacturing | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
| ○ | [Irep Inc.](https://irep.inc/) | 企業 | 大規模 | San Mateo／San Mateo County | advertising, marketing | 番地単位 | 確認済み（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [ITOCHU International](https://www.itochu.com/us/en/) | 企業 | 大規模 | Menlo Park／San Mateo County | trading, investment | 番地単位 | 確認済み（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
| ○ | [Japan Innovation Campus](https://jp-innovation-campus.org/) | 支援機関 | 該当なし | Palo Alto／Santa Clara County | startup-support, open-innovation, community | 番地単位 | 確認済み（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
| ○ | [JCB International Credit Card Co., Ltd. — Silicon Valley Office](https://www.global.jcb/en/) | 企業 | 大規模 | San Mateo／San Mateo County | payments, finance | 番地単位 | 確認済み（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [JEOL USA Bay Area](https://www.jeolusa.com/) | 企業 | 大規模 | Pleasanton／Alameda County | scientific-instruments, manufacturing | 都市中心（概略） | 要確認（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
| ○ | [JETRO San Francisco](https://www.jetro.go.jp/jetro/overseas/us_sanfrancisco/) | 支援機関 | 該当なし | San Francisco／San Francisco County | trade-promotion, investment-promotion, startup-support | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
| ○ | [JSR Micro](https://www.jsrmicro.com/) | 企業 | 大規模 | Sunnyvale／Santa Clara County | semiconductors, materials | 番地単位 | 確認済み（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
| ○ | [JTB Group Silicon Valley](https://www.jtbcorp.jp/en/) | 企業 | 大規模 | San Mateo／San Mateo County | travel, business-development | 番地単位 | 確認済み（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [JX Advanced Metals America Bay Area](https://www.jx-nmm.com/english/) | 企業 | 大規模 | San Jose／Santa Clara County | materials, manufacturing | 都市中心（概略） | 要確認（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
| ○ | [Kanematsu USA](https://www.kanematsuusa.com/) | 企業 | 大規模 | San Jose／Santa Clara County | trading, technology | 都市中心（概略） | 要確認（2026-10-07） | 未照合（—） | 要確認（2026-10-01） | 2026-10-07 |
| ○ | [Kawasaki Heavy Industries Silicon Valley](https://global.kawasaki.com/en/) | 企業 | 大規模 | San Jose／Santa Clara County | robotics, manufacturing, aerospace, defense | 番地単位 | 要確認（2026-10-07） | 要確認（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
| ○ | [KDDI America Silicon Valley](https://us.kddi.com/) | 企業 | 大規模 | San Jose／Santa Clara County | telecommunications, cloud | 都市中心（概略） | 要確認（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
| ○ | [KEYENCE America Bay Area](https://www.keyence.com/) | 企業 | 大規模 | San Jose／Santa Clara County | automation, manufacturing | 都市中心（概略） | 要確認（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
| ○ | [Kikkoman San Francisco](https://www.kikkoman.com/en/) | 企業 | 大規模 | San Francisco／San Francisco County | food, manufacturing | 番地単位 | 確認済み（2026-10-08） | 住所・座標一致（2026-10-08） | 確認済み（2026-10-08） | 2026-10-08 |
| ○ | [Kintone Corporation (Cybozu Group)](https://www.kintone.com/) | 企業 | グロース | San Francisco／San Francisco County | software, collaboration | 番地単位 | 要確認（2026-10-08） | 住所・座標一致（2026-10-08） | 確認済み（2026-10-08） | 2026-10-08 |
| ○ | [Kioxia America](https://americas.kioxia.com) | 企業 | 大規模 | San Jose／Santa Clara County | semiconductors, electronics | 番地単位 | 確認済み（2026-10-08） | 住所・座標一致（2026-10-08） | 確認済み（2026-10-08） | 2026-10-08 |
| ○ | [Komatsu Silicon Valley](https://www.komatsu.com/) | 企業 | 大規模 | San Francisco／San Francisco County | industrial, manufacturing | 都市中心（概略） | 要確認（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
| ○ | [Konica Minolta Laboratory USA](https://research.konicaminolta.com) | 企業 | 大規模 | San Mateo／San Mateo County | imaging, research | 都市中心（概略） | 要確認（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
| ○ | [Kurita Water Industries Silicon Valley](https://www.kurita-water.com/en/) | 企業 | 大規模 | San Mateo／San Mateo County | water, semiconductors, manufacturing | 番地単位 | 要確認（2026-10-08） | 住所・座標一致（2026-10-08） | 要確認（2026-09-29） | 2026-10-08 |
| ○ | [Kyocera Document Solutions](https://www.kyoceradocumentsolutions.us/) | 企業 | 大規模 | Union City／Alameda County | imaging, electronics | 番地単位 | 要確認（2026-10-08） | 住所・座標一致（2026-10-08） | 確認済み（2026-10-08） | 2026-10-08 |
| ○ | [LegalOn Technologies US](https://www.legalontech.com/) | 企業 | 大規模 | San Francisco／San Francisco County | legaltech, ai | 番地単位 | 要確認（2026-10-08） | 住所・座標一致（2026-10-08） | 確認済み（2026-10-08） | 2026-10-08 |
| ○ | [Makita USA](https://www.makitatools.com/) | 企業 | 大規模 | Hayward／Alameda County | tools, manufacturing | 都市中心（概略） | 要確認（2026-10-08） | 未照合（—） | 要確認（2026-09-29） | 2026-10-08 |
| ○ | [Marubeni America](https://www.marubeniamerica.com/) | 企業 | 大規模 | San Francisco／San Francisco County | trading, investment | 都市中心（概略） | 要確認（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [Mercari US](https://www.mercari.com/) | 企業 | 大規模 | Palo Alto／Santa Clara County | ecommerce, software | 都市中心（概略） | 要確認（2026-10-09） | 未照合（—） | 要確認（2026-09-29） | 2026-10-09 |
| ○ | [MinebeaMitsumi Technology Center](https://www.minebeamitsumi.com/) | 企業 | 大規模 | San Jose／Santa Clara County | electronics, manufacturing | 都市中心（概略） | 要確認（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [Mitsubishi Chemical America](https://www.mcam.com/) | 企業 | 大規模 | San Jose／Santa Clara County | materials, manufacturing | 都市中心（概略） | 要確認（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [Mitsubishi Corporation Americas](https://www.mitsubishicorp.com/us/en/) | 企業 | 大規模 | Palo Alto／Santa Clara County | trading, investment | 番地単位 | 確認済み（2026-08-23） | 住所・座標一致（2026-10-09） | 要確認（2026-09-29） | 2026-08-23 |
| ○ | [Mitsubishi Electric US](https://us.mitsubishielectric.com/) | 企業 | 大規模 | Mountain View／Santa Clara County | electronics, manufacturing, aerospace, space, satellites | 番地単位 | 要確認（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [Mitsubishi Heavy Industries America](https://www.mhi.com/) | 企業 | 大規模 | Mountain View／Santa Clara County | industrial, manufacturing, aerospace, defense, space | 番地単位 | 要確認（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [Mitsubishi Materials USA Bay Area](https://www.mitsubishimaterials.com/) | 企業 | 大規模 | San Jose／Santa Clara County | materials, manufacturing | 都市中心（概略） | 要確認（2026-10-09） | 未照合（—） | 要確認（2026-09-29） | 2026-10-09 |
| ○ | [Mitsui and Co USA](https://www.mitsui.com/us/en/) | 企業 | 大規模 | Menlo Park／San Mateo County | trading, investment | 番地単位 | 要確認（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [Mitsui Fudosan San Francisco](https://www.mfamerica.com/) | 企業 | 大規模 | San Francisco／San Francisco County | real-estate, urban-development | 番地単位 | 確認済み（2026-10-09） | 要確認（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [Mizuho Americas San Francisco](https://www.mizuhogroup.com/americas) | 企業 | 大規模 | San Francisco／San Francisco County | finance, banking | 番地単位 | 要確認（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [MODE Inc](https://www.tinkermode.com/) | 企業 | 大規模 | San Mateo／San Mateo County | iot, software | 番地単位 | 要確認（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [Mori Hamada US LLP — San Mateo](https://www.morihamada.com/en/) | 企業 | 大規模 | San Mateo／San Mateo County | legal-services, startup-support | 番地単位 | 確認済み（2026-10-09） | 住所・座標一致（2026-10-09） | 未確認（—） | 2026-10-09 |
| ○ | [Morisawa USA Inc.](https://en.morisawa.co.jp/) | 企業 | グロース | San Mateo／San Mateo County | software, typography | 番地単位 | 確認済み（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [MSIG USA San Francisco](https://www.msigusa.com/) | 企業 | 大規模 | San Francisco／San Francisco County | insurance, finance | 都市中心（概略） | 要確認（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [MUFG Bank San Francisco](https://www.mufgamericas.com/) | 企業 | 大規模 | San Francisco／San Francisco County | finance, banking | 番地単位 | 確認済み（2026-08-23） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-08-23 |
| ○ | [Murata Electronics North America](https://www.murata.com) | 企業 | 大規模 | San Mateo／San Mateo County | electronics, manufacturing | 番地単位 | 要確認（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [Nagase America](https://www.nagaseamerica.com/) | 企業 | 大規模 | San Jose／Santa Clara County | materials, trading | 都市中心（概略） | 要確認（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [Nagashima Ohno & Tsunematsu US LLP — Silicon Valley](https://www.nagashima.com/en/) | 企業 | 大規模 | San Mateo／San Mateo County | legal-services, startup-support | 番地単位 | 確認済み（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [NEC Corporation of America](https://www.necam.com) | 企業 | 大規模 | San Jose／Santa Clara County | electronics, software | 都市中心（概略） | 要確認（2026-10-03） | 未照合（—） | 要確認（2026-09-29） | 2026-10-03 |
| ○ | [Nidec America](https://www.nidec.com/en/) | 企業 | 大規模 | San Jose／Santa Clara County | motors, manufacturing | 番地単位 | 確認済み（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [Nikon Research Corporation of America](https://www.nikon.com) | 企業 | 大規模 | Belmont／San Mateo County | optics, manufacturing | 番地単位 | 確認済み（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [Nippon Life Silicon Valley](https://www.nissay.co.jp/english/) | 企業 | 大規模 | Palo Alto／Santa Clara County | insurance, business-development | 番地単位 | 要確認（2026-10-09） | 住所・座標一致（2026-10-09） | 要確認（2026-09-29） | 2026-10-09 |
| ○ | [Nissan Advanced Technology Center Silicon Valley](https://www.nissan-global.com) | 企業 | 大規模 | Santa Clara／Santa Clara County | automotive, software | 番地単位 | 確認済み（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [Nissan Chemical America Corporation — Open Innovation Office](https://nissanchem-usa.com/) | 企業 | 大規模 | San Mateo／San Mateo County | chemicals, research | 番地単位 | 確認済み（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [Nitto Denko Technical America Bay Area](https://www.nitto.com/us/en/) | 企業 | 大規模 | San Jose／Santa Clara County | materials, manufacturing | 都市中心（概略） | 要確認（2026-10-09） | 未照合（—） | 要確認（2026-09-29） | 2026-10-09 |
| ○ | [Nomura Securities International San Francisco](https://www.nomura.com/) | 企業 | 大規模 | San Francisco／San Francisco County | finance, securities | 都市中心（概略） | 要確認（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [NRI IT Solutions America Pacific Branch](https://www.nri.com/en/) | 企業 | 大規模 | San Mateo／San Mateo County | consulting, technology | 番地単位 | 要確認（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [NTT Communications San Francisco](https://www.ntt.com/en/) | 企業 | 大規模 | San Francisco／San Francisco County | telecommunications, cloud | 都市中心（概略） | 要確認（2026-10-09） | 未照合（—） | 要確認（2026-09-29） | 2026-10-09 |
| ○ | [NTT DATA Silicon Valley](https://us.nttdata.com/) | 企業 | 大規模 | San Jose／Santa Clara County | software, consulting | 都市中心（概略） | 要確認（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [NTT Research](https://ntt-research.com) | 企業 | 大規模 | Sunnyvale／Santa Clara County | research, technology | 番地単位 | 確認済み（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [Olympus America](https://www.olympusamerica.com/) | 企業 | 大規模 | San Jose／Santa Clara County | medical-devices, imaging | 番地単位 | 要確認（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [OMRON Robotics and Safety Technologies](https://automation.omron.com) | 企業 | 大規模 | Pleasanton／Alameda County | robotics, manufacturing | 番地単位 | 確認済み（2026-10-09） | 要確認（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [ORIX USA San Francisco](https://www.orix.com/) | 企業 | 大規模 | San Francisco／San Francisco County | finance, investment | 都市中心（概略） | 要確認（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [Panasonic North America](https://www.panasonic.com/us) | 企業 | 大規模 | Newark／Alameda County | electronics, manufacturing | 都市中心（概略） | 要確認（2026-10-09） | 未照合（—） | 要確認（2026-09-29） | 2026-10-09 |
| ○ | [Plug and Play Tech Center](https://www.plugandplaytechcenter.com/) | VC・CVC | 大規模 | Sunnyvale／Santa Clara County | venture-capital, accelerator, corporate-innovation | 番地単位 | 要確認（2026-10-09） | 要確認（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [RakuNest](https://www.rakunest.com/) | 支援機関 | 該当なし | San Mateo／San Mateo County | coworking, startup-support, community | 番地単位 | 確認済み（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [Rakuten USA, Inc.](https://global.rakuten.com/corp/about/map/am_us_rchw.html) | 企業 | 大規模 | San Mateo／San Mateo County | internet, ecommerce | 番地単位 | 確認済み（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [Rapidus Design Solutions](https://www.rapidus.inc/en/) | 企業 | 大規模 | Santa Clara／Santa Clara County | semiconductors, manufacturing | 番地単位 | 確認済み（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [Renesas Electronics America](https://www.renesas.com) | 企業 | 大規模 | San Jose／Santa Clara County | semiconductors, electronics | 番地単位 | 確認済み（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [Resonac US-JOINT](https://www.resonac.com/) | 企業 | 大規模 | Union City／Alameda County | semiconductors, materials, manufacturing | 都市中心（概略） | 要確認（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
| ○ | [Ricoh Innovations](https://www.ricoh.com) | 企業 | 大規模 | Menlo Park／San Mateo County | electronics, research | 都市中心（概略） | 要確認（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
| ○ | [ROHM Semiconductor USA](https://www.rohm.com) | 企業 | 大規模 | Santa Clara／Santa Clara County | semiconductors, electronics | 番地単位 | 確認済み（2026-10-03） | 住所・座標一致（2026-10-06） | 要確認（2026-09-30） | 2026-10-03 |
| ○ | [Santen](https://www.santen.com/us/) | 企業 | 大規模 | Emeryville／Alameda County | biotechnology, healthcare | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
| ○ | [SCREEN SPE USA](https://www.screen.co.jp/spe/en/) | 企業 | 大規模 | Santa Clara／Santa Clara County | semiconductors, manufacturing | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
| ○ | [SCSK USA Silicon Valley](https://www.scskusa.com/) | 企業 | 大規模 | Santa Clara／Santa Clara County | information-technology, business-development | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
| ○ | [Sekisui Chemical Silicon Valley](https://www.sekisuichemical.com/) | 企業 | 大規模 | San Mateo／San Mateo County | materials, manufacturing | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
| ○ | [Shimadzu Scientific Instruments Bay Area](https://www.ssi.shimadzu.com/) | 企業 | 大規模 | San Jose／Santa Clara County | scientific-instruments, manufacturing | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
| ○ | [Shimizu Corporation Silicon Valley](https://www.shimz.co.jp/en/) | 企業 | 大規模 | San Mateo／San Mateo County | construction, technology-scouting | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
| ○ | [Shin-Etsu MicroSi](https://www.microsi.com/) | 企業 | 大規模 | San Jose／Santa Clara County | semiconductors, materials | 都市中心（概略） | 要確認（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
| ○ | [SmartNews US](https://www.smartnews.com/) | 企業 | 大規模 | Palo Alto／Santa Clara County | media, software | 番地単位 | 要確認（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [SMBC Americas San Francisco](https://www.smbcgroup.com/) | 企業 | 大規模 | San Francisco／San Francisco County | finance, banking | 番地単位 | 要確認（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [SMC Corporation of America Bay Area](https://www.smcusa.com/) | 企業 | 大規模 | San Jose／Santa Clara County | automation, manufacturing | 都市中心（概略） | 要確認（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [Socionext America](https://www.socionext.com) | 企業 | 大規模 | Milpitas／Santa Clara County | semiconductors, electronics | 番地単位 | 確認済み（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [SoftBank Group International](https://group.softbank/en) | 企業 | 大規模 | San Carlos／San Mateo County | investment, technology | 都市中心（概略） | 要確認（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [Sojitz Corporation of America](https://www.sojitz.com/en/) | 企業 | 大規模 | San Jose／Santa Clara County | trading, investment | 番地単位 | 確認済み（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [SOMPO Digital Lab Silicon Valley](https://www2.sompo-hd.com/digital/en/pc/) | 企業 | 大規模 | Foster City／San Mateo County | insurance, finance | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
| ○ | [Sony AI America](https://ai.sony/) | 企業 | 大規模 | San Jose／Santa Clara County | ai, research | 都市中心（概略） | 要確認（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [Sony Interactive Entertainment](https://sonyinteractive.com/) | 企業 | 大規模 | San Mateo／San Mateo County | electronics, entertainment | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
| ○ | [Sumitomo Corporation of Americas](https://www.sumitomocorp.com/en/us) | 企業 | 大規模 | Santa Clara／Santa Clara County | trading, investment | 番地単位 | 要確認（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [Sumitomo Electric Device Innovations USA](https://www.sedi.co.jp/english/) | 企業 | 大規模 | San Jose／Santa Clara County | semiconductors, manufacturing | 都市中心（概略） | 要確認（2026-10-09） | 未照合（—） | 要確認（2026-09-28） | 2026-10-09 |
| ○ | [Systena America Inc. — Silicon Valley Mobility Center](https://www.systena.us/) | 企業 | 大規模 | San Mateo／San Mateo County | information-technology, business-development | 番地単位 | 確認済み（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [Takara Bio USA](https://www.takarabio.com/) | 企業 | 大規模 | San Jose／Santa Clara County | biotechnology, life-sciences | 番地単位 | 確認済み（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [TDK USA](https://www.tdk.com) | 企業 | 大規模 | San Jose／Santa Clara County | electronics, manufacturing | 番地単位 | 確認済み（2026-10-03） | 住所・座標一致（2026-10-09） | 要確認（2026-09-28） | 2026-10-03 |
| ○ | [THK America Bay Area](https://www.thk.com/) | 企業 | 大規模 | San Jose／Santa Clara County | industrial, manufacturing | 都市中心（概略） | 要確認（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [TOK America](https://www.tokamerica.com/) | 企業 | 大規模 | Milpitas／Santa Clara County | semiconductors, materials | 番地単位 | 要確認（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [Tokio Marine America San Francisco](https://www.tokiomarine.us/) | 企業 | 大規模 | San Francisco／San Francisco County | insurance, finance | 都市中心（概略） | 要確認（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [Tokyo Electron America](https://www.tel.com/) | 企業 | 大規模 | Fremont／Alameda County | semiconductors, manufacturing | 都市中心（概略） | 要確認（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [Toray Advanced Composites](https://www.toraytac.com/) | 企業 | 大規模 | Morgan Hill／Santa Clara County | materials, manufacturing, aerospace | 都市中心（概略） | 要確認（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [Toshiba America Electronic Components](https://toshiba.semicon-storage.com/us/) | 企業 | 大規模 | San Jose／Santa Clara County | semiconductors, electronics | 番地単位 | 確認済み（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [Tosoh Silicon Valley](https://www.tosoh.com/) | 企業 | 大規模 | San Mateo／San Mateo County | chemicals, electronics, manufacturing | 番地単位 | 要確認（2026-10-09） | 住所・座標一致（2026-10-09） | 要確認（2026-09-28） | 2026-10-09 |
| ○ | [Toyota Research Institute](https://www.tri.global) | 企業 | 大規模 | Los Altos／Santa Clara County | automotive, robotics | 都市中心（概略） | 確認済み（2026-08-23） | 未照合（—） | 要確認（2026-09-28） | 2026-08-23 |
| ○ | [Toyota Tsusho America](https://www.taiamerica.com/) | 企業 | 大規模 | Santa Clara／Santa Clara County | trading, automotive | 都市中心（概略） | 要確認（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [Toyota Ventures](https://toyota.ventures/) | VC・CVC | 該当なし | Los Altos／Santa Clara County | venture-capital, mobility | 番地単位 | 確認済み（2026-08-23） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-08-23 |
| ○ | [Treasure Data](https://www.treasuredata.com/) | 企業 | 大規模 | Mountain View／Santa Clara County | data, software | 都市中心（概略） | 要確認（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [WHILL US](https://whill.inc/us/) | 企業 | グロース | San Carlos／San Mateo County | mobility, medical-devices | 都市中心（概略） | 要確認（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [Woven by Toyota](https://woven.toyota/en/) | 企業 | 大規模 | Palo Alto／Santa Clara County | automotive, software | 都市中心（概略） | 要確認（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [Yamaha Motor Ventures](https://www.yamahamotorventures.com) | VC・CVC | 該当なし | Palo Alto／Santa Clara County | venture-capital, mobility | 番地単位 | 確認済み（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [Yaskawa America](https://www.yaskawa.com/) | 企業 | 大規模 | Fremont／Alameda County | robotics, manufacturing | 都市中心（概略） | 要確認（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
| ○ | [Yokogawa Corporation of America Bay Area](https://www.yokogawa.com/us/) | 企業 | 大規模 | San Jose／Santa Clara County | automation, manufacturing | 都市中心（概略） | 要確認（2026-10-05） | 未照合（—） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [1stCollab](https://1stcollab.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, marketing, artificial-intelligence, machine-learning, advertising, creator-economy, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [64x Bio](http://www.64xbio.com) | 企業 | グロース | San Francisco／San Francisco County | healthcare, industrial-bio, gene-therapy, machine-learning | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [140 Proof](https://www.140proof.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 要確認（2026-09-30） | 2026-10-06 |
|  | [Abalone Bio](https://www.abalonebio.com) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, drug-discovery-and-delivery, machine-learning, synthetic-biology, therapeutics, drug-discovery | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Abl Schools](https://ablschools.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 都市中心（概略） | 要確認（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Abstract](https://www.goabstract.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 要確認（2026-09-30） | 2026-10-06 |
|  | [Accenture](https://www.accenture.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Accord](https://inaccord.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, sales, saas, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Acely](https://acely.com) | 企業 | グロース | San Francisco／San Francisco County | education, elearning, consumer, services | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Activeloop](https://activeloop.ai/) | 企業 | スタートアップ | Mountain View／Santa Clara County | b2b, infrastructure, computational-storage, deep-learning, generative-ai, computer-vision, open-source, software | 番地単位 | 確認済み（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Activepieces](https://www.activepieces.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, engineering-product-and-design, workflow-automation, open-source, no-code, enterprise-software, ai, software | 都市中心（概略） | 確認済み（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Admitsee](https://www.admitsee.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Adobe](http://www.adobe.com/) | 企業 | グロース | San Jose／Santa Clara County | technology | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [AdStage](https://www.adstage.io/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Advent Software](https://www.advent.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Affirm](https://www.affirm.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Affogato AI](https://affogato.ai) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, engineering-product-and-design, artificial-intelligence, generative-ai, ai, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Afriex](https://www.afriexapp.com) | 企業 | グロース | San Francisco／San Francisco County | fintech, payments, remittances | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [After College](https://www.aftercollege.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [AfterQuery](https://afterquery.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, infrastructure, artificial-intelligence, data-labeling, big-data, ai, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Agave](https://www.useagave.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, saas, construction, proptech, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [AgentCollect](https://www.agentcollect.com) | 企業 | グロース | San Francisco／San Francisco County | fintech, artificial-intelligence, b2b, enterprise-software, software | 番地単位 | 確認済み（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [AgentMail](https://agentmail.to) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, infrastructure, developer-tools, api, email, software | 都市中心（概略） | 確認済み（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [AgileMD](https://agilemd.com) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, healthcare-it, machine-learning | 番地単位 | 確認済み（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [AIOS](https://www.aiosmedical.com/) | 企業 | 大規模 | San Francisco／San Francisco County | healthcare, consumer-health-and-wellness, consumer-health-services, health-tech, telemedicine | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [AiPrise](https://aiprise.com/) | 企業 | グロース | San Francisco／San Francisco County | fintech, b2b, identity, compliance, regtech, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Airbnb](https://www.airbnb.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Airbyte](https://airbyte.com/) | 企業 | グロース | San Francisco／San Francisco County | b2b, artificial-intelligence, developer-tools, open-source, data-engineering, ai, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [AirMyne](http://www.airmyne.com) | 企業 | スタートアップ | San Francisco／San Francisco County | industrials, climate, carbon-capture-and-removal, hard-tech, hardware, industrial | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Airware](https://www.airware.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 要確認（2026-09-30） | 2026-10-06 |
|  | [AiSDR](https://aisdr.com/) | 企業 | グロース | San Francisco／San Francisco County | b2b, sales, artificial-intelligence, saas, ai, software | 番地単位 | 確認済み（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [AIVideo.com](https://aivideo.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [AKQA](http://www.akqa.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Aktana](https://www.aktana.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Alex](https://alex.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, recruiting-and-talent, artificial-intelligence, saas, recruiting, hr-tech, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Algen Biotechnologies](https://www.algenbio.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, drug-discovery-and-delivery, crispr, biotech, therapeutics, drug-discovery, ai | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Algolia](https://www.algolia.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Alpaca](https://alpaca.markets/) | 企業 | 大規模 | San Mateo／San Mateo County | fintech, banking-and-exchange, developer-tools, api, investing, infrastructure | 番地単位 | 確認済み（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Alpha Sense](https://www.alpha-sense.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [AltSchool](https://www.altschool.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 要確認（2026-09-30） | 2026-10-06 |
|  | [Always Hired](http://www.alwayshired.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Amazon Web Services](https://aws.amazon.com/) | 企業 | 大規模 | San Francisco／San Francisco County | cloud, enterprise-software | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Ambient.ai](https://ambient.ai) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, security, artificial-intelligence, computer-vision, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [AMD](https://www.amd.com/) | 企業 | 大規模 | Santa Clara／Santa Clara County | semiconductors, computing | 番地単位 | 確認済み（2026-08-23） | 住所・座標一致（2026-10-06） | 要確認（2026-09-30） | 2026-08-27 |
|  | [Amplitude Analytics](https://amplitude.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [AmpUp](https://ampup.io) | 企業 | グロース | Santa Clara／Santa Clara County | consumer, home-and-personal, climate, electric-vehicles, services | 番地単位 | 確認済み（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Andon Labs](https://andonlabs.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, engineering-product-and-design, machine-learning, ai, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Andreessen Horowitz](https://a16z.com/) | VC・CVC | 該当なし | Menlo Park／San Mateo County | venture-capital, technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Andromeda Surgical](http://www.andromedasurgical.com) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, medical-devices, hard-tech, machine-learning, medical-robotics, ai | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [AngelList](https://angel.co/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Angle Health](https://www.anglehealth.com) | 企業 | 大規模 | San Francisco／San Francisco County | fintech, insurance, health-insurance | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Anjuna](https://www.anjuna.io) | 企業 | グロース | San Francisco／San Francisco County | b2b, security, cloud-workload-protection, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Ansa Biotechnologies](http://ansabio.com) | 企業 | グロース | Emeryville／Alameda County | healthcare, industrial-bio, synthetic-biology, biotech | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Anthrogen](https://anthrogen.com) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, deep-learning, biotech, ai | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Anthropic](https://www.anthropic.com/) | 企業 | グロース | San Francisco／San Francisco County | ai, research, enterprise-software | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Apero Health](https://www.aperohealth.com) | 企業 | グロース | San Francisco／San Francisco County | healthcare, healthcare-it, health-tech, finance, digital-health, enterprise-software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Apollo](http://apollographql.com/) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, infrastructure, developer-tools, open-source, graphql, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Apollo.io](https://www.apollo.io/) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, marketing, sales, software | 番地単位 | 確認済み（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [AppDirect](https://www.appdirect.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Apple](https://www.apple.com/) | 企業 | 大規模 | Cupertino／Santa Clara County | electronics, software, services | 番地単位 | 要確認（2026-10-06） | 要確認（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Applied Materials](https://www.appliedmaterials.com/) | 企業 | 大規模 | Santa Clara／Santa Clara County | semiconductors, manufacturing, equipment | 番地単位 | 確認済み（2026-08-24） | 住所・座標一致（2026-10-06） | 要確認（2026-09-30） | 2026-08-24 |
|  | [Apteligent](http://www.apteligent.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 要確認（2026-09-30） | 2026-10-06 |
|  | [ArchForm](http://archform.com) | 企業 | グロース | San Francisco／San Francisco County | healthcare, medical-devices, robotics, health-tech, 3d-printing | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Archil](https://archil.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, infrastructure, developer-tools, machine-learning, big-data, ai, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Arini](https://www.arini.ai) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, healthcare-it, artificial-intelligence, health-tech, dental, call-center, ai | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Arintra](https://www.arintra.com/) | 企業 | グロース | San Francisco／San Francisco County | healthcare, healthcare-it, saas, health-tech, digital-health, enterprise-software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [arnata](https://arnata.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, supply-chain-and-logistics, artificial-intelligence, generative-ai, logistics, supply-chain, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Array Labs](https://www.arraylabs.io/) | 企業 | グロース | San Francisco／San Francisco County | industrials, aviation-and-space, satellites, industrial | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Artie](https://www.artie.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, infrastructure, developer-tools, saas, data-engineering, enterprise-software, software | 番地単位 | 確認済み（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Artisan](https://artisan.co/?utm_source=ycombinator) | 企業 | グロース | San Francisco／San Francisco County | b2b, artificial-intelligence, sales, automation, ai-assistant, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Asana](https://asana.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Ashby](https://www.ashbyhq.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, recruiting-and-talent, human-resources, recruiting, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Assembly HOA](https://assemblyhoa.com) | 企業 | スタートアップ | San Francisco／San Francisco County | real-estate-and-construction, housing-and-real-estate, artificial-intelligence, fintech, real-estate, housing, proptech, construction | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Astranis](http://www.astranis.com) | 企業 | 大規模 | San Francisco／San Francisco County | industrials, aviation-and-space, space-exploration, satellites, industrial | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Astro Mechanica](https://astromecha.co/) | 企業 | グロース | San Francisco／San Francisco County | industrials, aviation-and-space, industrial | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Athelas](http://athelas.com) | 企業 | 大規模 | San Francisco／San Francisco County | healthcare, saas, health-tech, telehealth, ai | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [AthenaHQ](https://www.athenahq.ai) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, marketing, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Atlas](https://atlas.so) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, operations, saas, customer-success, customer-service, customer-support, software | 都市中心（概略） | 要確認（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Atlas](https://atlascard.com) | 企業 | グロース | San Francisco／San Francisco County | fintech, consumer-finance | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Atmo](http://atmo.ai) | 企業 | スタートアップ | San Francisco／San Francisco County | industrials, artificial-intelligence, machine-learning, weather, climate, ai, industrial | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [AtoB](https://atob.com/) | 企業 | グロース | San Francisco／San Francisco County | fintech, saas, payments, supply-chain, transportation | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Atomic](https://www.atomicvest.com/) | 企業 | グロース | San Francisco／San Francisco County | b2b, retail, artificial-intelligence, fintech, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Automattic](https://automattic.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Awesomic](https://www.awesomic.com/?ref=yc) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, marketplace, recruiting, design, web-development, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [BackerKit](https://backerkit.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, sales, saas, crowdfunding, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 未確認（—） | 2026-10-07 |
|  | [Balance](https://www.getbalance.com) | 企業 | グロース | San Francisco／San Francisco County | fintech, payments, b2b, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Basalt](https://basalt.space/) | 企業 | スタートアップ | San Francisco／San Francisco County | industrials, aviation-and-space, satellites, aerospace, automation, defense, ai, industrial | 都市中心（概略） | 確認済み（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Beacons](https://beacons.ai/) | 企業 | グロース | San Francisco／San Francisco County | consumer, social, saas, services | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 未確認（—） | 2026-10-07 |
|  | [Bebo](https://bebo.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [BeGo](http://www.bego.ai) | 企業 | グロース | San Francisco／San Francisco County | b2b, supply-chain-and-logistics, artificial-intelligence, banking-as-a-service, digital-freight-brokerage, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Bellabeat](http://bellabeat.com) | 企業 | 大規模 | San Francisco／San Francisco County | consumer, consumer-electronics, fitness, health-and-wellness, femtech, services | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Benchling](http://benchling.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, saas, biotech, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Berkeley SkyDeck](https://skydeck.berkeley.edu/) | 支援機関 | 該当なし | Berkeley／Alameda County | accelerator, startup-support | 都市中心（概略） | 要確認（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Besimple AI](https://besimple.ai) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, aiops, data-labeling, ai, software | 都市中心（概略） | 確認済み（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [BetterUp](https://www.betterup.co/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Beyond Games](https://www.beyondgames.co/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [BigCommerce](https://www.bigcommerce.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [BIK](https://bik.ai/) | 企業 | グロース | San Francisco／San Francisco County | b2b, retail, saas, e-commerce, ai, ai-assistant, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Bindwell](https://www.bindwell.ai/) | 企業 | スタートアップ | San Francisco／San Francisco County | industrials, agriculture, industrial | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Binti](https://binti.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Bio-Rad Laboratories](https://www.bio-rad.com/) | 企業 | 大規模 | Hercules／Contra Costa County | biotechnology, life-sciences | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 要確認（2026-09-30） | 2026-10-06 |
|  | [BioStack Platforms](https://www.getbiostack.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare | 都市中心（概略） | 確認済み（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Bitmovin](http://bitmovin.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, infrastructure, developer-tools, video, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 未確認（—） | 2026-10-07 |
|  | [Bitnami](https://bitnami.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Bland AI](https://bland.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, infrastructure, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Blaze](https://withblaze.app/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, saas, sales, marketing, software | 都市中心（概略） | 確認済み（2026-10-06） | 未照合（—） | 未確認（—） | 2026-10-06 |
|  | [blend labs](https://blend.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Bloc](https://www.bloc.io/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [BloomThat](https://www.bloomthat.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Blueberry Pediatrics](https://blueberrypediatrics.com) | 企業 | スタートアップ | Mountain View／Santa Clara County | healthcare, healthcare-it, consumer-health-services, health-tech, telehealth, pediatrics, digital-health | 番地単位 | 確認済み（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Bluedot](https://thebluedot.co/) | 企業 | スタートアップ | San Francisco／San Francisco County | fintech, climate, transportation, climatetech | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Bluejay](https://getbluejay.ai/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, artificial-intelligence, conversational-ai, software | 都市中心（概略） | 確認済み（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Blurb](http://www.blurb.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Bodyport](http://bodyport.com) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, consumer-health-and-wellness, medical-devices, telemedicine | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Bolto](https://www.bolto.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, human-resources, recruiting, hr-tech, ai, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [BrainKey](https://www.brainkey.ai/) | 企業 | グロース | San Francisco／San Francisco County | healthcare, diagnostics, neurotechnology, health-tech, digital-health, ai | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Braintree](https://www.braintreepayments.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Bretton AI](https://www.bretton.com/) | 企業 | グロース | San Francisco／San Francisco County | fintech, artificial-intelligence, payments, b2b, compliance, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Brigade](http://www.brigade.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 要確認（2026-09-30） | 2026-10-06 |
|  | [BrightBytes](http://www.brightbytes.net/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 要確認（2026-09-30） | 2026-10-06 |
|  | [Brighterway](https://www.brighterway.ai/) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, healthcare-it, artificial-intelligence, health-tech, legaltech, ai | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Broccoli AI](https://www.broccoli.com/) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, artificial-intelligence, home-services, ai, ai-assistant, software | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Buck Institute for Research on Aging](https://www.buckinstitute.org/) | 大学・研究機関 | 該当なし | Novato／Marin County | research, life-sciences | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Bugcrowd](https://www.bugcrowd.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [BuildBuddy](https://buildbuddy.io) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, infrastructure, developer-tools, saas, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [BuildZoom](https://www.buildzoom.com/) | 企業 | スタートアップ | Palo Alto／Santa Clara County | technology | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Bunkerhill Health](http://bunkerhillhealth.com) | 企業 | グロース | San Francisco／San Francisco County | healthcare, healthcare-it, health-tech, ai | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Cadence Design Systems](https://www.cadence.com/) | 企業 | 大規模 | San Jose／Santa Clara County | semiconductors, software, eda | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 要確認（2026-09-30） | 2026-10-06 |
|  | [Cairns Health](https://www.cairns.ai) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, consumer-health-and-wellness, hardware, machine-learning, consumer-health-services | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 未確認（—） | 2026-10-07 |
|  | [Calltree](https://calltree.ai) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, generative-ai, saas, customer-service, ai, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Cambio](https://www.cambio.ai/) | 企業 | グロース | San Francisco／San Francisco County | real-estate-and-construction, artificial-intelligence, real-estate, b2b, construction, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Cambly](http://www.cambly.com) | 企業 | 大規模 | San Francisco／San Francisco County | education | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Campfire](https://campfire.ai) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, finance-and-accounting, fintech, saas, ai, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Campsyte](https://www.campsyte.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 要確認（2026-09-30） | 2026-10-06 |
|  | [Candid Health](https://www.joincandidhealth.com) | 企業 | 大規模 | San Francisco／San Francisco County | healthcare, healthcare-it | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Canix](https://www.canix.com/) | 企業 | グロース | San Francisco／San Francisco County | b2b, security, saas, cannabis, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [CaptivateIQ](https://www.captivateiq.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, finance-and-accounting, saas, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Careerist](http://careerist.cc/) | 企業 | 大規模 | San Francisco／San Francisco County | education, fintech, recruiting | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Carma](https://www.joincarma.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, operations, workflow-automation, compliance, ai, automotive, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Cartage](https://cartage.ai) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, supply-chain-and-logistics, machine-learning, workflow-automation, logistics, supply-chain, ai, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Casca](https://www.cascading.ai/) | 企業 | グロース | San Francisco／San Francisco County | fintech, artificial-intelligence, conversational-banking, machine-learning, finance | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Castle](https://castle.io/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Castle Global](http://castleglobal.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 要確認（2026-09-30） | 2026-10-06 |
|  | [CBS Interactive](https://www.cbsinteractive.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Cekura](https://www.cekura.ai/) | 企業 | スタートアップ | Sunnyvale／Santa Clara County | b2b, engineering-product-and-design, developer-tools, saas, software | 番地単位 | 確認済み（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Charge Robotics](https://chargerobotics.com/) | 企業 | グロース | San Francisco／San Francisco County | industrials, manufacturing-and-robotics, robotics, solar-power, construction, climate, industrial | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Chartboost](https://www.chartboost.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Chatfuel](http://chatfuel.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, messaging, chatbots, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Chatwoot](https://www.chatwoot.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, operations, customer-success, open-source, customer-service, customer-support, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Checkr](https://checkr.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Chewse](https://www.chewse.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Chime Bank](https://www.chimebank.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 都市中心（概略） | 要確認（2026-10-06） | 未照合（—） | 要確認（2026-09-30） | 2026-10-06 |
|  | [Circle Medical](https://www.circlemedical.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Cisco](https://www.cisco.com/) | 企業 | 大規模 | San Jose／Santa Clara County | networking, cybersecurity, enterprise-software | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Clara Lending](https://clara.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [ClassDojo](http://www.classdojo.com) | 企業 | 大規模 | San Francisco／San Francisco County | education, consumer, entertainment, kids, metaverse, services | 番地単位 | 確認済み（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Clearbit](https://clearbit.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [ClearMetal](http://www.clearmetal.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Cleva](https://www.getcleva.com) | 企業 | グロース | San Francisco／San Francisco County | fintech, crypto-web3, remote-work, emerging-markets, neobank | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Clever](https://clever.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Climate Corporation](https://climate.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Clipboard](https://www.clipboardworks.com/careers) | 企業 | 大規模 | San Francisco／San Francisco County | consumer, marketplace, consumer-health-services, health-tech, healthcare, services | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Cloud4Wi](https://cloud4wi.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Cloudflare](https://www.cloudflare.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Clover Health](https://www.cloverhealth.com/en/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [cocreate](https://cocreate.so) | 企業 | スタートアップ | San Francisco／San Francisco County | consumer, content, video, services | 都市中心（概略） | 確認済み（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [CodeAnt AI](https://codeant.ai/) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, cybersecurity, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [CodeCrafters](https://codecrafters.io) | 企業 | スタートアップ | San Francisco／San Francisco County | consumer, job-and-career-services, developer-tools, education, elearning, careers, services | 都市中心（概略） | 確認済み（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Coffee Meets Bagel](https://coffeemeetsbagel.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Cognition IP](https://www.cognitionip.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, legal, artificial-intelligence, govtech, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Coinbase](https://www.coinbase.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 要確認（2026-09-30） | 2026-10-06 |
|  | [CoinTracker](https://cointracker.com) | 企業 | グロース | San Francisco／San Francisco County | fintech, saas, crypto-web3, consumer, services | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 未確認（—） | 2026-10-07 |
|  | [Collective Health](https://collectivehealth.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Collectly](http://collectly.co/) | 企業 | 大規模 | San Francisco／San Francisco County | healthcare, healthcare-it, payments, b2b, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [CombineHealth](https://www.combinehealth.ai/) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, healthcare-it, artificial-intelligence, machine-learning | 番地単位 | 確認済み（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Community Phone Company](https://www.communityphone.org/) | 企業 | 大規模 | San Francisco／San Francisco County | consumer, home-and-personal, artificial-intelligence, saas, b2b, customer-support, telecommunications, services, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Conduit](http://helloconduit.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, supply-chain-and-logistics, artificial-intelligence, saas, logistics, enterprise-software, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Conduit](https://conduit.ai/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, travel, sales, customer-service, ai, software | 番地単位 | 確認済み（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Confident LIMS](https://confidentlims.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, operations, saas, cannabis, compliance, enterprise-software, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Contrario](https://contrario.ai) | 企業 | グロース | San Francisco／San Francisco County | b2b, recruiting-and-talent, saas, recruiting, ai, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Copia](http://www.gocopia.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, office-management, saas, food-tech, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Corgi Insurance](https://corgi.com) | 企業 | 大規模 | San Francisco／San Francisco County | fintech, insurance, artificial-intelligence | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Coris](https://coris.ai/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, infrastructure, artificial-intelligence, fintech, compliance, software | 都市中心（概略） | 確認済み（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Cortex](https://cortex.io/) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, infrastructure, developer-tools, saas, productivity, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Corvus Robotics](https://www.corvus-robotics.com) | 企業 | グロース | Mountain View／Santa Clara County | industrials, drones, warehouse-management-tech, robotics, logistics, supply-chain, industrial | 番地単位 | 確認済み（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Courier](https://www.courier.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, developer-tools, messaging, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Coval](https://coval.dev) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, engineering-product-and-design, artificial-intelligence, developer-tools, saas, monitoring, software | 都市中心（概略） | 確認済み（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Creative Market](https://creativemarket.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 要確認（2026-10-06） | 要確認（2026-09-30） | 2026-10-06 |
|  | [Cricket Health](https://crickethealth.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Crowdcast](https://www.crowdcast.io) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [CrowdFlower](https://www.crowdflower.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 要確認（2026-09-30） | 2026-10-06 |
|  | [Crunchyroll](http://www.crunchyroll.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 要確認（2026-09-30） | 2026-10-06 |
|  | [CTGT](https://www.ctgt.ai/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, infrastructure, enterprise, ai, software | 都市中心（概略） | 確認済み（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Culdesac](http://culdesac.com) | 企業 | 大規模 | San Francisco／San Francisco County | real-estate-and-construction, housing-and-real-estate, real-estate, housing, proptech, climatetech, construction | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Culture Biosciences](https://culturebiosciences.com) | 企業 | グロース | San Francisco／San Francisco County | healthcare, industrial-bio, cellular-agriculture, biotech | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Curtsy](http://curtsyapp.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | consumer, apparel-and-cosmetics, marketplace, sustainable-fashion, e-commerce, services | 番地単位 | 確認済み（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Cyble](https://cyble.com/) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, security, saas, ai, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [d_model](https://www.dmodel.ai) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, software | 都市中心（概略） | 要確認（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Dagger](https://dagger.io) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, developer-tools, devsecops, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Daily](https://daily.co) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, productivity, developer-tools, open-source, ai, ai-assistant, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Dart](https://www.dartai.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, productivity, artificial-intelligence, generative-ai, ai, software | 都市中心（概略） | 確認済み（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Databricks](https://www.databricks.com/) | 企業 | 大規模 | San Francisco／San Francisco County | ai, data, enterprise-software | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [DataFox](https://www.datafox.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 要確認（2026-09-30） | 2026-10-06 |
|  | [Datasaur](https://datasaur.ai) | 企業 | グロース | San Francisco／San Francisco County | b2b, finance, compliance, healthcare, legaltech, ai, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Datrics](https://datrics.ai) | 企業 | グロース | San Francisco／San Francisco County | healthcare, b2b, analytics, health-insurance, ai, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [David AI](https://www.withdavid.ai/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, software | 都市中心（概略） | 確認済み（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Daybreak Health](https://www.daybreakhealth.com/) | 企業 | グロース | San Francisco／San Francisco County | healthcare, consumer-health-and-wellness, mental-health-tech, consumer-health-services, digital-health | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Deel](https://www.deel.com/) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, finance-and-accounting, fintech, saas, hr-tech, payroll, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Deepgram](https://www.deepgram.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, engineering-product-and-design, ai-enhanced-learning, api, ai, software | 番地単位 | 確認済み（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Deepnight](https://www.deepnight.com) | 企業 | スタートアップ | San Francisco／San Francisco County | industrials, defense, artificial-intelligence, computer-vision, industrial | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Delivery Agent](http://www.deliveryagent.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Demand Curve](https://www.demandcurve.com) | 企業 | スタートアップ | San Francisco／San Francisco County | education, b2b, media, marketing, software | 都市中心（概略） | 確認済み（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Demandbase](https://www.demandbase.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Didit](https://didit.me/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, infrastructure, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Diffuse Bio](http://diffuse.bio) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, drug-discovery-and-delivery, ai-powered-drug-discovery, deep-learning, generative-ai, machine-learning, biotech | 都市中心（概略） | 確認済み（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Disqus](https://disqus.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Distro](https://distro.app) | 企業 | スタートアップ | Palo Alto／Santa Clara County | b2b, supply-chain-and-logistics, saas, manufacturing, supply-chain, ai, software | 番地単位 | 確認済み（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Ditto](http://dittowords.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, engineering-product-and-design, developer-tools, saas, design-tools, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Docker](https://www.docker.com/) | 企業 | スタートアップ | Palo Alto／Santa Clara County | technology | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Docusign](https://www.docusign.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Domu Technology Inc.](https://www.domu.ai/) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, aiops, artificial-intelligence, call-center, ai-assistant, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [DoorDash](https://www.doordash.com/) | 企業 | 大規模 | San Francisco／San Francisco County | delivery, marketplace, logistics | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 要確認（2026-09-30） | 2026-10-06 |
|  | [Dots 💸](https://usedots.com) | 企業 | スタートアップ | San Francisco／San Francisco County | fintech, payments, api, creator-economy | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Double Robotics](https://doublerobotics.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, productivity, hardware, robotics, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Dover](https://dover.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, recruiting-and-talent, recruiting, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Dr. Treat](https://www.drtreat.com/) | 企業 | グロース | San Francisco／San Francisco County | healthcare, healthcare-services, telehealth, consumer, digital-health, services | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [DreamCraft Entertainment, Inc.](https://www.dreamcraft.com/) | 企業 | グロース | San Francisco／San Francisco County | consumer, gaming, developer-tools, entertainment, services | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [DreamWorld](https://www.playdreamworld.com/) | 企業 | グロース | San Francisco／San Francisco County | consumer, gaming, services | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [DroneDeploy](https://www.dronedeploy.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology, drones, software, data, imaging | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Dropbox](https://www.dropbox.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Duncan Channon](http://www.duncanchannon.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-09-21） | 住所・座標一致（2026-10-06） | 要確認（2026-09-30） | 2026-09-21 |
|  | [Duranium](https://www.duranium.co/) | 企業 | スタートアップ | San Francisco／San Francisco County | industrials, manufacturing-and-robotics, manufacturing, advanced-materials, climatetech, industrial | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Dynamo AI](https://dynamo.ai) | 企業 | グロース | San Francisco／San Francisco County | b2b, machine-learning, privacy, data-engineering, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Earnest](https://www.earnest.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 要確認（2026-09-30） | 2026-10-06 |
|  | [EARTH AI](http://www.earth-ai.com) | 企業 | スタートアップ | San Francisco／San Francisco County | industrials, climate, ai-enhanced-learning, mining, industrial | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Easypost](https://www.easypost.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Eat Club](https://www.eatclub.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Eatsa](https://www.eatsa.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 都市中心（概略） | 要確認（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [eBay](https://www.ebay.com/) | 企業 | 大規模 | San Jose／Santa Clara County | e-commerce, marketplace | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 要確認（2026-09-30） | 2026-10-06 |
|  | [eBrandvalue](https://www.ebrandvalue.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, marketing, analytics, social, software | 都市中心（概略） | 確認済み（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Eden](https://edenmed.com) | 企業 | 大規模 | San Francisco／San Francisco County | healthcare, diagnostics, artificial-intelligence, digital-health | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Eero](https://eero.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Efference](https://efference.ai) | 企業 | スタートアップ | San Francisco／San Francisco County | industrials, manufacturing-and-robotics, robotics, computer-vision, industrial | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Electric Air](https://www.electricair.io/) | 企業 | スタートアップ | San Francisco／San Francisco County | real-estate-and-construction, construction, real-estate | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Elemeno Health](http://elemenohealth.com) | 企業 | グロース | San Francisco／San Francisco County | healthcare, healthcare-it, saas, digital-health | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Ello](https://www.ello.com) | 企業 | グロース | San Francisco／San Francisco County | education, artificial-intelligence | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Elroy Air](https://elroyair.com/) | 企業 | スタートアップ | South San Francisco／San Mateo County | drones, aerospace, delivery, logistics, robotics | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Embeddables](https://embeddables.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, productivity, saas, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Ember](https://www.embercopilot.ai) | 企業 | グロース | San Francisco／San Francisco County | healthcare | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Energent AI](https://energent.ai/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, productivity, big-data, enterprise-software, automation, ai-assistant, software | 都市中心（概略） | 確認済み（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [enSilo](https://www.ensilo.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Entangl](https://www.entangl.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, engineering-product-and-design, artificial-intelligence, aerospace, enterprise-software, automation, automotive, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Entelo](https://www.entelo.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Envoy](https://envoy.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Etleap](https://etleap.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, infrastructure, data-engineering, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Event Horizon Labs](https://www.ehl.markets/) | 企業 | スタートアップ | San Francisco／San Francisco County | fintech, asset-management, finance, investing, ai | 都市中心（概略） | 確認済み（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Eventbrite](https://www.eventbrite.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Eventual](https://www.daft.ai/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, infrastructure, computer-vision, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Every](https://every.io/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Evolve (makers of Podcast App & Rest)](https://getrest.app) | 企業 | グロース | San Francisco／San Francisco County | consumer, content, sleep-tech, digital-health, podcasts, services | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Exa](https://exa.ai) | 企業 | グロース | San Francisco／San Francisco County | b2b, developer-tools, search, ai, apis, software | 番地単位 | 確認済み（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Expensify](https://use.expensify.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Expent Inc](https://www.expent.ai/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, operations, artificial-intelligence, machine-learning, saas, software | 都市中心（概略） | 確認済み（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Expo](https://expo.dev) | 企業 | グロース | San Francisco／San Francisco County | b2b, infrastructure, developer-tools, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Extern](http://www.extern.com) | 企業 | グロース | San Francisco／San Francisco County | consumer, job-and-career-services, education, marketplace, elearning, recruiting, remote-work, services | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Extole](https://www.extole.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Eze](https://www.ezeit.ai/) | 企業 | グロース | San Francisco／San Francisco County | b2b, retail, marketplace, electronics, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Faire](https://www.faire.com/) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, retail, marketplace, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 未確認（—） | 2026-10-07 |
|  | [Farcast](https://www.farcast.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | industrials, aviation-and-space, satellites, telecommunications, industrial | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Fathom](https://www.fathom.ai) | 企業 | グロース | San Francisco／San Francisco County | b2b, productivity, saas, ai, note-taking, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Ferveret](http://www.ferveret.com) | 企業 | スタートアップ | San Francisco／San Francisco County | industrials, energy, hardware, climate, industrial | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [FidoCure®](https://www.fidocure.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, healthcare-services, oncology | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Fieldguide](http://fieldguide.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, productivity, artificial-intelligence, workflow-automation, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Finch](https://tryfinch.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, fintech, hr-tech, api, software | 番地単位 | 確認済み（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [FitBit](https://www.fitbit.com/home) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Fivetran](http://fivetran.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, infrastructure, saas, analytics, data-engineering, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Flagright](https://flagright.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, fintech, compliance, regtech, ai, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Flai](https://www.useflai.com/) | 企業 | グロース | San Francisco／San Francisco County | industrials, automotive, industrial | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [FleetWorks](https://fleetworks.ai) | 企業 | グロース | San Francisco／San Francisco County | b2b, supply-chain-and-logistics, logistics, ai, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Flexport](https://www.flexport.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Flockjay](https://flockjay.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, sales, artificial-intelligence, saas, elearning, productivity, software | 都市中心（概略） | 確認済み（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [FlutterFlow](https://flutterflow.io) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Focal Systems](http://www.focal.systems) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, retail, deep-learning, grocery, computer-vision, software | 番地単位 | 確認済み（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Fond](https://fond.co/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Fondo](https://fondo.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, finance-and-accounting, fintech, saas, ai, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Forage](http://www.joinforage.com) | 企業 | グロース | San Francisco／San Francisco County | fintech, payments, govtech | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Forkable](https://forkable.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 都市中心（概略） | 要確認（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Formal](https://joinformal.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, cybersecurity, software | 都市中心（概略） | 確認済み（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Forward](https://goforward.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 要確認（2026-09-30） | 2026-10-06 |
|  | [Fossa](https://www.fossa.io/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Fractional](https://fractional.app) | 企業 | スタートアップ | San Francisco／San Francisco County | fintech, real-estate, community | 都市中心（概略） | 確認済み（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Freshpaint](https://freshpaint.io) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, infrastructure, developer-tools, saas, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Front](https://front.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, productivity, saas, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Fundbox](https://fundbox.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [FundersClub](https://fundersclub.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 要確認（2026-09-30） | 2026-10-06 |
|  | [FurtherAI](https://www.furtherai.com/) | 企業 | グロース | San Francisco／San Francisco County | b2b, insurance, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Fuse AI](https://fuseai.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, sales, software | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Galvanize](https://www.galvanize.com/san-francisco) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 要確認（2026-09-30） | 2026-10-06 |
|  | [Genentech](https://www.gene.com/) | 企業 | 大規模 | South San Francisco／San Mateo County | biotechnology, life-sciences | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [General Assembly](https://generalassemb.ly/locations/san-francisco) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [General Proximity](https://www.generalproximity.bio/) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, drug-discovery-and-delivery, biotech, drug-discovery | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Genomelink](https://genomelink.io/) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, consumer-health-and-wellness, consumer-health-services, genomics | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Getaround](https://www.getaround.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [GETASAP](https://www.getasap.us) | 企業 | グロース | San Francisco／San Francisco County | b2b, supply-chain-and-logistics, logistics, supply-chain, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Giga](https://giga.ai/) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, artificial-intelligence, ai, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Gigs](https://gigs.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, engineering-product-and-design, fintech, hr-tech, api, ai, software | 番地単位 | 確認済み（2026-10-08） | 住所・座標一致（2026-10-08） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Gigster](https://gigster.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Gilead Sciences](https://www.gilead.com/) | 企業 | 大規模 | Foster City／San Mateo County | biotechnology, life-sciences | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [GitStart](https://www.gitstart.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, engineering-product-and-design, developer-tools, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Givecampus](https://www.givecampus.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 都市中心（概略） | 要確認（2026-10-06） | 未照合（—） | 要確認（2026-09-30） | 2026-10-06 |
|  | [Glep](https://glep.com) | 企業 | グロース | San Francisco／San Francisco County | fintech, banking-and-exchange, enterprise-software, neobank | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Glide](https://www.glideapps.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, artificial-intelligence, developer-tools, no-code, enterprise-software, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Godela](http://godela.ai) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, engineering-product-and-design, artificial-intelligence, hard-tech, hardware, aerospace, ml, software | 都市中心（概略） | 確認済み（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [GoGoGrandparent](https://gogograndparent.com) | 企業 | グロース | San Francisco／San Francisco County | consumer, home-and-personal, assistive-tech, consumer-health-services, services | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [GoLinks](https://www.golinks.io) | 企業 | グロース | San Jose／Santa Clara County | b2b, productivity, saas, collaboration, software | 番地単位 | 確認済み（2026-10-08） | 住所・座標一致（2026-10-08） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Goodby Silverstein & Partners](https://goodbysilverstein.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Google](https://www.google.com/) | 企業 | 大規模 | Mountain View／Santa Clara County | internet, cloud, ai | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Govly](https://www.govly.com/) | 企業 | グロース | San Francisco／San Francisco County | government, saas, govtech | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Grain](https://trygrain.com/) | 企業 | グロース | San Francisco／San Francisco County | fintech, credit-and-lending | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 未確認（—） | 2026-10-08 |
|  | [Great Question](https://greatquestion.co) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, saas, design-tools, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Greptile](https://www.greptile.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, artificial-intelligence, developer-tools, ai, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Grey](https://grey.co) | 企業 | スタートアップ | San Francisco／San Francisco County | fintech, consumer, b2b, neobank, services, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Gridware](https://www.gridware.io) | 企業 | 大規模 | San Francisco／San Francisco County | industrials, energy, hardware, climate, enterprise-software, industrial | 番地単位 | 確認済み（2026-10-08） | 住所・座標一致（2026-10-08） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Groove Labs](http://www.groove.co/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [GrowthBook](https://www.growthbook.io) | 企業 | グロース | San Francisco／San Francisco County | b2b, analytics, developer-tools, open-source, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [GrowthX](https://growthx.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [GrubMarket](http://grubmarket.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, supply-chain-and-logistics, e-commerce, supply-chain, food-tech, agriculture, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Gumloop](https://www.gumloop.com/) | 企業 | グロース | San Francisco／San Francisco County | b2b, artificial-intelligence, automation, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Gumroad](https://gumroad.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Gusto](https://gusto.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 要確認（2026-09-30） | 2026-10-06 |
|  | [Gym Class](https://gymclass.com) | 企業 | グロース | San Francisco／San Francisco County | consumer, social, virtual-reality, gaming, ai, services | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Hack Reactor](https://www.hackreactor.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [HackerRank](http://hackerrank.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, recruiting-and-talent, developer-tools, recruiting, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Hammerhead](https://www.hammerhead.io/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 都市中心（概略） | 要確認（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Hamming AI](https://hamming.ai/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, engineering-product-and-design, software | 都市中心（概略） | 確認済み（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Hammr](https://www.hammr.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, human-resources, hr-tech, payroll, software | 都市中心（概略） | 確認済み（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Handl](https://handl.ai/) | 企業 | グロース | San Francisco／San Francisco County | b2b, operations, documents, deep-learning, fintech, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Handle](https://www.handle.com) | 企業 | 大規模 | San Francisco／San Francisco County | real-estate-and-construction, construction, payments, real-estate | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Hapi](https://hapi.trade/) | 企業 | グロース | San Francisco／San Francisco County | fintech, consumer-finance, finance, trading, cryptocurrency | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 未確認（—） | 2026-10-08 |
|  | [HappyRobot](https://happyrobot.ai) | 企業 | グロース | San Francisco／San Francisco County | b2b, supply-chain-and-logistics, logistics, ai-assistant, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Harper](https://www.harperinsure.com/) | 企業 | グロース | San Francisco／San Francisco County | fintech, insurance, ai | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Haven](https://haveninc.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 要確認（2026-10-01） | 2026-10-07 |
|  | [Heap](https://heapanalytics.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Hedgehog](http://hedgehogfoods.com) | 企業 | グロース | San Francisco／San Francisco County | industrials, manufacturing-and-robotics, robotics, climate, food-tech, agriculture, ai, industrial | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [HelloSign](https://www.hellosign.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Helpshift](https://www.helpshift.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Hightouch](https://hightouch.com/) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, marketing, enterprise-software, ai, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Hired](https://hired.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [HockeyStack](https://hockeystack.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, sales, saas, analytics, marketing, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [HOKALI](https://www.hokali.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, marketing, marketplace, edtech, software | 番地単位 | 確認済み（2026-10-08） | 住所・座標一致（2026-10-08） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Holberton School](https://www.holbertonschool.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Hoodline](https://hoodline.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 要確認（2026-10-01） | 2026-10-07 |
|  | [Hornblower Cruises](https://www.hornblower.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 要確認（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [HotelTonight](https://www.hoteltonight.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [HotPads](https://hotpads.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 要確認（2026-10-02） | 2026-10-07 |
|  | [HotSchedules](https://www.hotschedules.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [HP Inc.](https://www.hp.com/) | 企業 | 大規模 | Palo Alto／Santa Clara County | computing, electronics, services | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Hub](https://hub.xyz) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, infrastructure, robotics, crowdsourcing, big-data, ai, software | 都市中心（概略） | 確認済み（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [HUD](https://www.hud.ai) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, artificial-intelligence, marketplace, reinforcement-learning, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 未確認（—） | 2026-10-08 |
|  | [Human Archive](https://www.humanarchive.ai/) | 企業 | 大規模 | San Francisco／San Francisco County | industrials, manufacturing-and-robotics, industrial | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Human Dx](http://humandx.org) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, healthcare-it, health-tech, diagnostics | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Human Interest](http://humaninterest.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, human-resources, fintech, saas, hr-tech, investing, software | 番地単位 | 確認済み（2026-10-08） | 住所・座標一致（2026-10-08） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Humand](https://humand.co) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, human-resources, artificial-intelligence, generative-ai, saas, productivity, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Hustle Inc](https://hustle.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Hyperbound](https://hyperbound.ai) | 企業 | グロース | San Francisco／San Francisco County | b2b, sales, ai-enhanced-learning, sales-enablement, conversational-ai, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Hypotenuse AI](https://hypotenuse.ai/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, generative-ai, machine-learning, e-commerce, ai, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [iCrossing](http://www.icrossing.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 要確認（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [idemeum](https://www.idemeum.com) | 企業 | スタートアップ | Sunnyvale／Santa Clara County | b2b, security, software | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Ideo](https://www.ideo.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [idler](https://idler.ai/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, engineering-product-and-design, reinforcement-learning, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [IGN Entertainment](http://corp.ign.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Imgix](https://www.imgix.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, infrastructure, developer-tools, saas, video, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Imgur](https://imgurinc.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Immunity Project](http://immunityproject.org) | 企業 | スタートアップ | San Francisco／San Francisco County | unspecified, health-tech, biotech | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Indiegogo](https://www.indiegogo.com/en) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 要確認（2026-10-02） | 2026-10-07 |
|  | [inDinero](https://www.indinero.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Industrial Microbes](http://imicrobes.com) | 企業 | スタートアップ | Alameda／Alameda County | healthcare, industrial-bio, carbon-capture-and-removal, bioplastic, climate | 番地単位 | 要確認（2026-10-08） | 住所・座標一致（2026-10-08） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Infina](http://infina.vn) | 企業 | グロース | San Francisco／San Francisco County | fintech, investing | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Infisical](https://infisical.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, security, developer-tools, saas, open-source, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Inkeep](https://inkeep.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, engineering-product-and-design, developer-tools, workflow-automation, customer-support, no-code, ai-assistant, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Insacart](https://www.instacart.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 都市中心（概略） | 要確認（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Inscribe](https://www.inscribe.ai/) | 企業 | グロース | San Francisco／San Francisco County | b2b, infrastructure, artificial-intelligence, fintech, fraud-detection, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [insightly](https://www.insightly.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-09-10） | 要確認（2026-10-07） | 要確認（2026-10-02） | 2026-09-10 |
|  | [InstaAgent](https://instaagent.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, marketing, advertising, software | 都市中心（概略） | 確認済み（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Instawork](http://instawork.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, recruiting-and-talent, marketplace, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Instrumentl](https://www.instrumentl.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, saas, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Intel](https://www.intel.com/) | 企業 | 大規模 | Santa Clara／Santa Clara County | semiconductors, manufacturing, computing | 番地単位 | 確認済み（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Intercom](https://www.intercom.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Intryc](https://intryc.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, operations, customer-success, analytics, customer-support, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Intuit](https://www.intuit.com/) | 企業 | 大規模 | Mountain View／Santa Clara County | fintech, enterprise-software | 番地単位 | 確認済み（2026-10-01） | 住所・座標一致（2026-10-07） | 要確認（2026-10-01） | 2026-10-01 |
|  | [Intuitive Surgical](https://www.intuitive.com/) | 企業 | 大規模 | Sunnyvale／Santa Clara County | medical-devices, robotics, healthcare | 番地単位 | 確認済み（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Inventive AI](https://www.inventive.ai/) | 企業 | スタートアップ | Mountain View／Santa Clara County | b2b, sales, artificial-intelligence, generative-ai, saas, software | 番地単位 | 確認済み（2026-10-08） | 住所・座標一致（2026-10-08） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Invert](http://www.invertbio.com/) | 企業 | グロース | San Francisco／San Francisco County | healthcare, industrial-bio, cellular-agriculture, machine-learning, synthetic-biology, biotech | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [IOMETE](https://www.iomete.com/) | 企業 | グロース | Mountain View／Santa Clara County | b2b, infrastructure, analytics, software | 番地単位 | 確認済み（2026-10-08） | 住所・座標一致（2026-10-08） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Ironclad](http://ironcladapp.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, legal, saas, legaltech, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Isengard Industries Inc](http://isengardindustries.com/) | 企業 | グロース | San Francisco／San Francisco County | industrials, defense, artificial-intelligence, swarm-robotics, unmanned-vehicle, industrial | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Jerry](https://jerry.ai/) | 企業 | 大規模 | San Francisco／San Francisco County | fintech, insurance | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Jestor](https://jestor.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, productivity, operations, ai, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [JITX](http://www.jitx.com) | 企業 | スタートアップ | San Francisco／San Francisco County | industrials, manufacturing-and-robotics, automation, ai, industrial | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Joon Health](https://joonhealth.co) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, consumer-health-and-wellness, mental-health-tech, consumer-health-services, consumer, services | 都市中心（概略） | 確認済み（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Joy](https://withjoy.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 都市中心（概略） | 確認済み（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Joyent](https://www.joyent.com) | 企業 | グロース | Mountain View／Santa Clara County | technology | 番地単位 | 確認済み（2026-10-07） | 要確認（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Juicebox](https://juicebox.ai/) | 企業 | グロース | San Francisco／San Francisco County | b2b, recruiting-and-talent, generative-ai, recruiting, hr-tech, ai, software | 番地単位 | 確認済み（2026-10-08） | 住所・座標一致（2026-10-08） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Julius](https://julius.ai) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, artificial-intelligence, software | 都市中心（概略） | 確認済み（2026-10-06） | 未照合（—） | 未確認（—） | 2026-10-06 |
|  | [Jumpshot](https://www.jumpshot.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 要確認（2026-10-01） | 2026-10-07 |
|  | [June Oven](https://juneoven.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Juniper Networks](https://www.juniper.net/) | 企業 | 大規模 | Sunnyvale／Santa Clara County | networking, telecommunications | 番地単位 | 確認済み（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Just Appraised](https://www.justappraised.com) | 企業 | グロース | San Francisco／San Francisco County | government, saas, govtech | 番地単位 | 要確認（2026-10-08） | 住所・座標一致（2026-10-08） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Kastle](https://kastle.ai/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Keeper](https://keepertax.com) | 企業 | スタートアップ | San Francisco／San Francisco County | fintech, consumer-finance, consumer, services | 番地単位 | 確認済み（2026-10-08） | 住所・座標一致（2026-10-08） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Kentik](https://www.kentik.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [KERNEL](https://www.kernel.sh) | 企業 | グロース | San Francisco／San Francisco County | b2b, infrastructure, artificial-intelligence, developer-tools, cloud-computing, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Khosla Ventures](https://www.khoslaventures.com/) | VC・CVC | 該当なし | Menlo Park／San Mateo County | venture-capital, technology | 番地単位 | 確認済み（2026-10-08） | 住所・座標一致（2026-10-08） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Kinter](https://kinter.ai) | 企業 | グロース | San Francisco／San Francisco County | b2b, finance-and-accounting, saas, finance, ai, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Kissmetrics](https://www.kissmetrics.com/home/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 要確認（2026-10-02） | 2026-10-07 |
|  | [KittyHawk](https://kittyhawk.io/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 都市中心（概略） | 要確認（2026-10-07） | 未照合（—） | 要確認（2026-10-01） | 2026-10-07 |
|  | [Kivo Health](https://kivohealth.com) | 企業 | グロース | San Francisco／San Francisco County | healthcare, healthcare-services, consumer-health-services, telehealth, digital-health | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [KLA](https://www.kla.com/) | 企業 | 大規模 | Milpitas／Santa Clara County | semiconductors, manufacturing, equipment | 番地単位 | 要確認（2026-10-08） | 住所・座標一致（2026-10-08） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Koala](https://www.teachwithkoala.com) | 企業 | スタートアップ | San Francisco／San Francisco County | education, marketplace, gaming, metaverse | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Kontigo](https://kontigo.lat/) | 企業 | スタートアップ | San Francisco／San Francisco County | fintech, banking-and-exchange | 都市中心（概略） | 確認済み（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Labdoor](https://labdoor.com) | 企業 | スタートアップ | San Francisco／San Francisco County | consumer, food-and-beverage, marketplace, consumer-health-services, services | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Lago](https://www.getlago.com/) | 企業 | グロース | San Francisco／San Francisco County | b2b, finance-and-accounting, finops, fintech, saas, open-source, billing, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Lam Research](https://www.lamresearch.com/) | 企業 | 大規模 | Fremont／Alameda County | semiconductors, manufacturing, equipment | 番地単位 | 確認済み（2026-10-08） | 住所・座標一致（2026-10-08） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Lamar Health](http://www.lamarhealth.com) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, healthcare-it, health-tech, ai | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Laminar](https://laminar.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, enterprise-software, ai, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Lance](https://www.lance.live) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, software | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [LanceDB](https://lancedb.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, infrastructure, aiops, machine-learning, open-source, data-engineering, software | 番地単位 | 確認済み（2026-10-08） | 住所・座標一致（2026-10-08） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Landor](https://landor.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 要確認（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Lanesurf](https://www.lanesurf.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, artificial-intelligence, logistics, supply-chain, ai, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Lapel](https://lapel.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, artificial-intelligence, customer-success, sales, customer-support, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Latent](https://latenthealth.com) | 企業 | グロース | San Francisco／San Francisco County | healthcare, healthcare-it, artificial-intelligence, b2b, insurance, enterprise, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Lattice](https://lattice.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-10-07） | 要確認（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Lawrence Berkeley National Laboratory](https://www.lbl.gov/) | 大学・研究機関 | 該当なし | Berkeley／Alameda County | research, energy | 番地単位 | 確認済み（2026-10-08） | 住所・座標一致（2026-10-08） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Lawrence Livermore National Laboratory](https://www.llnl.gov/) | 大学・研究機関 | 該当なし | Livermore／Alameda County | research, science, energy, defense | 番地単位 | 確認済み（2026-10-08） | 住所・座標一致（2026-10-08） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Layer](https://layer.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Layerup](https://www.uselayerup.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, generative-ai, enterprise, ai, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [LeadGenius](http://leadgenius.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, sales, marketing, ai, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Leadspace](https://www.leadspace.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Leanplum](https://www.leanplum.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Leap Motion](https://www.leapmotion.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 要確認（2026-10-07） | 要確認（2026-10-02） | 2026-10-07 |
|  | [Leaping AI](https://www.leapingai.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, artificial-intelligence, conversational-ai, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Legalist](https://www.legalist.com) | 企業 | グロース | San Francisco／San Francisco County | fintech, credit-and-lending, legaltech | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Legion Health](https://legionhealth.com) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, consumer-health-and-wellness, consumer-health-services, telehealth, mental-health, ai | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [LemonBox](http://www.lemonbox.com/) | 企業 | グロース | San Francisco／San Francisco County | healthcare, consumer-health-and-wellness, generative-ai, health-tech, health-and-wellness, ai, china | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [LendingHome](https://www.lendinghome.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Lendtable](http://lendtable.com) | 企業 | グロース | San Francisco／San Francisco County | fintech, credit-and-lending | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 未確認（—） | 2026-10-08 |
|  | [Letterdrop](https://letterdrop.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, sales, generative-ai, marketing, software | 都市中心（概略） | 確認済み（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Lever](https://www.lever.co/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Levro](https://www.levro.com) | 企業 | スタートアップ | San Francisco／San Francisco County | fintech, banking-and-exchange, payments, finance, b2b, international, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Lexi](https://getlexi.io/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, legal, saas, legaltech, ai, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Liftopia](https://about.liftopia.com/index.html) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 要確認（2026-10-02） | 2026-10-07 |
|  | [Lightbend](http://www.lightbend.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 要確認（2026-10-02） | 2026-10-07 |
|  | [LinkedIn](https://www.linkedin.com/) | 企業 | 大規模 | Sunnyvale／Santa Clara County | social-media, enterprise-software, recruiting | 番地単位 | 要確認（2026-10-08） | 住所・座標一致（2026-10-08） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Linqia](http://www.linqia.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [LiteLLM](https://www.litellm.ai/) | 企業 | グロース | San Francisco／San Francisco County | b2b, aiops, artificial-intelligence, developer-tools, generative-ai, open-source, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Literably](https://literably.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 要確認（2026-10-02） | 2026-10-07 |
|  | [Lithium Technologies](https://www.lithium.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 要確認（2026-10-02） | 2026-10-07 |
|  | [Lively, Inc.](https://livelyme.com) | 企業 | 大規模 | San Francisco／San Francisco County | healthcare, healthcare-it, fintech, health-tech, hr-tech | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Living Carbon](https://www.livingcarbon.com) | 企業 | グロース | San Francisco／San Francisco County | industrials, climate, synthetic-biology, biotech, agriculture, industrial | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Lob](https://lob.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Locale](https://www.shoplocale.com) | 企業 | スタートアップ | San Francisco／San Francisco County | consumer, food-and-beverage, grocery, marketplace, delivery, food, services | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Lockheed Martin Space](https://www.lockheedmartin.com/en-us/who-we-are/business-areas/space.html) | 企業 | 大規模 | Sunnyvale／Santa Clara County | aerospace, defense, space, manufacturing | 番地単位 | 要確認（2026-10-08） | 要確認（2026-10-08） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Logikcull](http://logikcull.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Lollipuff](http://lollipuff.com) | 企業 | スタートアップ | San Francisco／San Francisco County | consumer, apparel-and-cosmetics, marketplace, e-commerce, fashion, services | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Long Term Stock Exchange](http://ltse.com) | 企業 | グロース | San Francisco／San Francisco County | fintech, banking-and-exchange, b2b, software | 都市中心（概略） | 要確認（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Looker](https://looker.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [loopfour](https://www.loopfour.com) | 企業 | グロース | San Francisco／San Francisco County | fintech, ai-enhanced-learning, workflow-automation, automation, operations, ai-assistant | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Luel](https://luel.ai) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, infrastructure, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Luminai](https://www.luminai.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, saas, enterprise, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Lyft](https://www.lyft.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Lygos](http://www.lygos.com) | 企業 | グロース | San Francisco／San Francisco County | healthcare, industrial-bio, synthetic-biology, climate, biotechnology | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 未確認（—） | 2026-10-08 |
|  | [Mach9](https://www.mach9.ai/) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, machine-learning, computer-vision, design-tools, infrastructure, ai, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Macy's](https://www.macys.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 要確認（2026-10-02） | 2026-10-07 |
|  | [Magic Patterns](https://www.magicpatterns.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, engineering-product-and-design, software | 都市中心（概略） | 確認済み（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Magnetic](https://www.magnetictax.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, productivity, software | 都市中心（概略） | 確認済み（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Mailgun](https://www.mailgun.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Manara](http://www.manara.tech) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, recruiting-and-talent, education, edtech, software | 都市中心（概略） | 確認済み（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Mapbox](http://www.mapbox.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Marin Economic Forum](https://marineconomicforum.org/) | 支援機関 | 該当なし | San Rafael／Marin County | economic-development, networking | 都市中心（概略） | 要確認（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Marvell Technology](https://www.marvell.com/) | 企業 | 大規模 | Santa Clara／Santa Clara County | semiconductors, data-infrastructure, networking | 番地単位 | 要確認（2026-10-09） | 要確認（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Mashery (acquired)](https://www.mashery.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 要確認（2026-10-02） | 2026-10-07 |
|  | [Mashgin](http://mashgin.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, retail, artificial-intelligence, cashierless-checkout, deep-learning, hardware, computer-vision, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Massdrop](https://www.massdrop.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 都市中心（概略） | 要確認（2026-10-07） | 未照合（—） | 要確認（2026-10-01） | 2026-10-07 |
|  | [Mastra](https://mastra.ai) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, artificial-intelligence, developer-tools, open-source, ai, software | 番地単位 | 確認済み（2026-10-08） | 住所・座標一致（2026-10-08） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Mattermark](https://mattermark.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Mattermost](http://mattermost.com) | 企業 | 大規模 | Palo Alto／Santa Clara County | b2b, productivity, devsecops, collaboration, security, open-source, software | 番地単位 | 要確認（2026-10-08） | 住所・座標一致（2026-10-08） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Matternet](https://www.matternet.com/) | 企業 | グロース | Mountain View／Santa Clara County | drones, aerospace, delivery, logistics, robotics | 番地単位 | 確認済み（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Mayfield](https://www.mayfield.com/) | VC・CVC | 該当なし | Menlo Park／San Mateo County | venture-capital, technology | 都市中心（概略） | 要確認（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [MBX](http://us.memebox.com) | 企業 | 大規模 | San Francisco／San Francisco County | consumer, apparel-and-cosmetics, beauty, services | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 未確認（—） | 2026-10-08 |
|  | [McKesson](http://www.mckesson.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [mdhub](https://www.mdhub.ai/) | 企業 | グロース | San Francisco／San Francisco County | healthcare | 番地単位 | 確認済み（2026-10-08） | 住所・座標一致（2026-10-08） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Meadow](https://getmeadow.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, retail, saas, cannabis, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Mederva](https://medervahealth.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, consumer-health-services, telehealth, digital-health | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Medicare Vox (fka Fair Square)](https://www.medicarevox.com) | 企業 | グロース | San Francisco／San Francisco County | healthcare, consumer-health-and-wellness, fintech, consumer-health-services | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 未確認（—） | 2026-10-08 |
|  | [Medium](https://medium.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 要確認（2026-10-07） | 要確認（2026-10-02） | 2026-10-07 |
|  | [Medplum](https://www.medplum.com) | 企業 | グロース | San Francisco／San Francisco County | healthcare, healthcare-it, developer-tools, open-source | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Medrio](http://medrio.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Mem0](https://mem0.ai) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, infrastructure, developer-tools, generative-ai, open-source, ai, software | 都市中心（概略） | 確認済み（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [MemSQL](http://www.memsql.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Mende Design](http://mendedesign.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Mentra](https://mentra.glass) | 企業 | スタートアップ | San Francisco／San Francisco County | consumer, virtual-and-augmented-reality, artificial-intelligence, hardware, open-source, ar, services | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Meru Health](http://www.meruhealth.com) | 企業 | グロース | San Francisco／San Francisco County | healthcare, consumer-health-and-wellness, mental-health-tech, digital-health | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Mesh](https://mesh.ai/) | 企業 | グロース | San Francisco／San Francisco County | b2b, human-resources, saas, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Mesosphere](https://mesosphere.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Meta](https://about.meta.com/) | 企業 | 大規模 | Menlo Park／San Mateo County | social-media, internet, ai | 番地単位 | 確認済み（2026-09-24） | 要確認（2026-10-09） | 確認済み（2026-10-09） | 2026-09-24 |
|  | [Metric Insights](http://www.metricinsights.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Metriport](https://metriport.com/) | 企業 | グロース | San Francisco／San Francisco County | healthcare, healthcare-it, b2b, digital-health, api, ai, software | 番地単位 | 確認済み（2026-10-08） | 住所・座標一致（2026-10-08） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Metromile](https://www.metromile.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 要確認（2026-10-02） | 2026-10-07 |
|  | [Mezmo](https://www.mezmo.com/) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, infrastructure, developer-tools, devsecops, saas, kubernetes, data-engineering, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Microsoft](https://www.microsoft.com/en-us/) | 企業 | 大規模 | Mountain View／Santa Clara County | cloud, enterprise-software, ai | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Middesk](http://www.middesk.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, operations, fintech, saas, software | 番地単位 | 確認済み（2026-10-08） | 住所・座標一致（2026-10-08） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Middleware](https://www.middleware.io) | 企業 | グロース | San Francisco／San Francisco County | b2b, infrastructure, aiops, saas, ai, software | 番地単位 | 確認済み（2026-10-08） | 住所・座標一致（2026-10-08） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [MindsDB](https://www.mindsdb.com/) | 企業 | グロース | San Francisco／San Francisco County | b2b, infrastructure, developer-tools, machine-learning, open-source, enterprise-software, ai, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Mino Games](http://minomonsters.com) | 企業 | スタートアップ | San Francisco／San Francisco County | consumer, gaming, services | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Mintlify](https://mintlify.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, developer-tools, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [MissionU](https://www.missionu.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 要確認（2026-10-02） | 2026-10-07 |
|  | [Mixpanel](https://mixpanel.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Modern Treasury](http://www.moderntreasury.com/) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, finance-and-accounting, fintech, api, software | 番地単位 | 確認済み（2026-10-08） | 住所・座標一致（2026-10-08） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [ModernLoop](http://modernloop.io) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, recruiting-and-talent, recruiting, productivity, hr-tech, remote-work, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Moichor](https://moichor.com/) | 企業 | グロース | San Francisco／San Francisco County | healthcare, diagnostics | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Momentic](https://momentic.ai) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, engineering-product-and-design, developer-tools, enterprise-software, ai, software | 番地単位 | 確認済み（2026-10-08） | 住所・座標一致（2026-10-08） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Monkey Inferno](http://monkeyinferno.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [MoogSoft](https://www.moogsoft.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Motion](https://www.usemotion.com/) | 企業 | グロース | San Francisco／San Francisco County | b2b, productivity, artificial-intelligence, saas, ai, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Mozart Data](http://www.mozartdata.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, infrastructure, saas, data-engineering, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Mth Sense](http://www.mthsense.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, marketing, privacy, advertising, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Multiply Labs](http://multiplylabs.com/) | 企業 | グロース | San Francisco／San Francisco County | industrials, manufacturing-and-robotics, robotics, industrial | 番地単位 | 確認済み（2026-10-08） | 住所・座標一致（2026-10-08） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Mux](https://mux.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Names & Faces](http://www.namesandfaces.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, human-resources, saas, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [NanoNets](https://nanonets.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, productivity, developer-tools, saas, ai, software | 番地単位 | 確認済み（2026-10-08） | 住所・座標一致（2026-10-08） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Napa Valley College](https://www.napavalley.edu/) | 大学・研究機関 | 該当なし | Napa／Napa County | education, community | 番地単位 | 要確認（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [NASA Ames Research Center](https://www.nasa.gov/ames/) | 大学・研究機関 | 該当なし | Moffett Field／Santa Clara County | aerospace, space, research | 番地単位 | 要確認（2026-10-09） | 要確認（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Nash](https://getnashglobal.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | fintech, banking-as-a-service, finops, b2b, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 要確認（2026-10-04） | 2026-10-08 |
|  | [Nash](https://www.usenash.com/) | 企業 | グロース | San Francisco／San Francisco County | b2b, supply-chain-and-logistics, marketplace, saas, delivery, logistics, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Navdy](https://www.navdy.com/#see-the-road) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 要確認（2026-10-02） | 2026-10-07 |
|  | [Naytev](https://www.naytev.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [NepFin](https://www.nepfin.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Nestor](https://nestorup.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, human-resources, saas, hr-tech, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [NetApp](https://www.netapp.com/) | 企業 | 大規模 | San Jose／Santa Clara County | data-storage, cloud, enterprise-software | 番地単位 | 要確認（2026-10-09） | 住所・座標一致（2026-10-09） | 要確認（2026-09-29） | 2026-10-09 |
|  | [Netflix](https://www.netflix.com/) | 企業 | 大規模 | Los Gatos／Santa Clara County | streaming, media, technology | 番地単位 | 確認済み（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [New Incentives](http://www.newincentives.org) | 企業 | グロース | San Francisco／San Francisco County | unspecified, nonprofit | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [New Relic](https://newrelic.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [NEXGENT](https://ngt.academy/) | 企業 | グロース | San Francisco／San Francisco County | education | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [NimbleRx](http://nimblerx.com) | 企業 | 大規模 | San Francisco／San Francisco County | healthcare, consumer-health-and-wellness, saas | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [No Means No Worldwide](https://www.nomeansnoworldwide.org/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Nobell Foods](http://www.nobellfoods.com) | 企業 | グロース | San Francisco／San Francisco County | consumer, food-and-beverage, sustainability, climate, food-tech, climatetech, services | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 未確認（—） | 2026-10-08 |
|  | [NoRedInk](https://www.noredink.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Notable Labs](https://www.notablelabs.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 要確認（2026-10-02） | 2026-10-07 |
|  | [Nova Credit](http://neednova.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Numen](https://www.numen.com) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, diagnostics, machine-learning, biotech, ai | 番地単位 | 確認済み（2026-10-08） | 住所・座標一致（2026-10-08） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Numeral](https://www.numeral.com/) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, finance-and-accounting, fintech, saas, finance, compliance, e-commerce, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Numerion Labs](https://www.numerionlabs.ai) | 企業 | グロース | San Francisco／San Francisco County | healthcare, drug-discovery-and-delivery, ai-powered-drug-discovery, deep-learning, biotech, drug-discovery, oncology | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Numero](https://www.numero.ai) | 企業 | スタートアップ | San Francisco／San Francisco County | fintech, saas | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Nuna](https://www.nuna.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [NVIDIA](https://www.nvidia.com/) | 企業 | 大規模 | Santa Clara／Santa Clara County | semiconductors, ai, computing | 番地単位 | 確認済み（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Oath (former Yahoo!)](https://www.oath.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Observe.AI](https://observe.ai) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, sales, saas, customer-service, ai, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Okta](https://www.okta.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Okteto](https://okteto.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, infrastructure, developer-tools, saas, open-source, kubernetes, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Olark](http://olark.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, retail, sales, marketing, customer-service, chat, ai, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Omnistrate](http://www.omnistrate.com) | 企業 | スタートアップ | Redwood City／San Mateo County | b2b, developer-tools, saas, cloud-computing, infrastructure, software | 番地単位 | 確認済み（2026-10-08） | 住所・座標一致（2026-10-08） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [One Degree](http://1degree.org) | 企業 | スタートアップ | San Francisco／San Francisco County | unspecified, nonprofit | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [OneSchema](https://www.oneschema.co) | 企業 | グロース | San Francisco／San Francisco County | b2b, operations, artificial-intelligence, saas, workflow-automation, ai, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [OneSignal](https://onesignal.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, marketing, developer-tools, saas, messaging, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [OpenAI](https://www.openai.com/) | 企業 | 大規模 | San Francisco／San Francisco County | artificial-intelligence, technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 要確認（2026-10-01） | 2026-10-07 |
|  | [OpenDNS (Cisco)](http://www.opendns.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 要確認（2026-10-02） | 2026-10-07 |
|  | [Opendoor](https://www.opendoor.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Openlayer](https://openlayer.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, aiops, artificial-intelligence, developer-tools, generative-ai, machine-learning, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Opentable](https://www.opentable.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 要確認（2026-10-02） | 2026-10-07 |
|  | [Optimizely](https://www.optimizely.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Oracle](https://www.oracle.com/) | 企業 | 大規模 | Redwood City／San Mateo County | enterprise-software, cloud, database | 番地単位 | 確認済み（2026-10-09） | 住所・座標一致（2026-10-09） | 要確認（2026-09-29） | 2026-10-09 |
|  | [Orangewood Labs](http://www.orangewood.co) | 企業 | グロース | San Francisco／San Francisco County | industrials, manufacturing-and-robotics, artificial-intelligence, generative-ai, hardware, robotics, industrial | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Osmind](https://osmind.org/) | 企業 | グロース | San Francisco／San Francisco County | healthcare, healthcare-it, mental-health-tech, saas, health-tech | 番地単位 | 確認済み（2026-10-08） | 住所・座標一致（2026-10-08） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Outschool](http://outschool.com) | 企業 | 大規模 | San Francisco／San Francisco County | education, marketplace | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Outset](https://outset.ai/) | 企業 | グロース | San Francisco／San Francisco County | b2b, analytics, saas, market-research, enterprise-software, ai, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Overview](https://overview.ai) | 企業 | グロース | San Francisco／San Francisco County | industrials, manufacturing-and-robotics, deep-learning, iot, computer-vision, manufacturing, ai, industrial | 番地単位 | 確認済み（2026-10-08） | 住所・座標一致（2026-10-08） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Oway](https://www.shipoway.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, infrastructure, artificial-intelligence, api, supply-chain, software | 番地単位 | 確認済み（2026-10-08） | 住所・座標一致（2026-10-08） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [OWNY](https://www.owny.com) | 企業 | スタートアップ | San Francisco／San Francisco County | fintech, artificial-intelligence, banking-as-a-service, crypto-web3 | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 未確認（—） | 2026-10-08 |
|  | [Oxygen](http://getoxygen.com) | 企業 | グロース | San Francisco／San Francisco County | fintech, consumer-finance, neobank | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 未確認（—） | 2026-10-08 |
|  | [Padlet](https://padlet.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, productivity, education, saas, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Pair Team](https://pairteam.com/) | 企業 | 大規模 | San Francisco／San Francisco County | healthcare, healthcare-services, health-tech, workflow-automation, digital-health, healthcare-it | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Palo Alto Networks](https://www.paloaltonetworks.com/) | 企業 | 大規模 | Santa Clara／Santa Clara County | cybersecurity, enterprise-software | 番地単位 | 確認済み（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Pantheon](https://pantheon.io/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [ParadeDB](https://paradedb.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, developer-tools, analytics, open-source, infrastructure, databases, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Parahelp](https://parahelp.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, operations, customer-success, customer-service, customer-support, ai, conversational-ai, software | 都市中心（概略） | 確認済み（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Parallel Bio](http://parallel.bio) | 企業 | グロース | San Francisco／San Francisco County | healthcare, drug-discovery-and-delivery, ai-powered-drug-discovery, biotech | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Parameter](https://parameter.ai?utm_source=ycombinator&utm_medium=referral&utm_campaign=parameter-profile) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, security, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Parsable](https://www.parsable.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Patagonia](http://www.patagonia.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [PatternFast (prior: Tailornova/Couturme)](http://patternfast.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, artificial-intelligence, apparel, fashion, ai, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Pave](https://pave.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, recruiting-and-talent, fintech, hr-tech, software | 番地単位 | 確認済み（2026-10-08） | 住所・座標一致（2026-10-08） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [PayPal](https://www.paypal.com/) | 企業 | 大規模 | San Jose／Santa Clara County | fintech, payments | 番地単位 | 要確認（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [People.ai](https://people.ai) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, sales, artificial-intelligence, saas, enterprise, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Periscope Data](https://www.periscopedata.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Perit.AI](https://www.perit.ai/) | 企業 | グロース | San Francisco／San Francisco County | b2b, data-labeling, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Petcube](http://petcube.com) | 企業 | グロース | San Francisco／San Francisco County | consumer, consumer-electronics, hardware, services | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Pibit.ai](https://pibit.ai) | 企業 | 大規模 | South San Francisco／San Mateo County | fintech, insurance, artificial-intelligence, generative-ai, b2b, software | 番地単位 | 要確認（2026-10-08） | 住所・座標一致（2026-10-08） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Pickle](https://www.pickle.com) | 企業 | スタートアップ | San Francisco／San Francisco County | consumer, consumer-electronics, artificial-intelligence, hardware, augmented-reality, services | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [PicnicAI](https://picnic.ai) | 企業 | 大規模 | San Francisco／San Francisco County | healthcare, machine-learning, health-tech, digital-health, nlp | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Pine Park Health](http://pineparkhealth.com) | 企業 | グロース | Berkeley／Alameda County | healthcare, healthcare-services | 番地単位 | 確認済み（2026-10-08） | 住所・座標一致（2026-10-08） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Pinterest](https://www.pinterest.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Pique Tea](https://www.piquetea.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Plaid](https://plaid.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Plane](https://plane.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, human-resources, fintech, saas, compliance, hr-tech, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Planet](https://www.planet.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology, space, satellites, imaging, data | 番地単位 | 確認済み（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [PlanGrid](https://www.plangrid.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Platzi](https://platzi.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, productivity, ai-enhanced-learning, education, elearning, sales-enablement, hr-tech, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Ploy](https://ploy.ai) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Pocket](https://heypocket.com/now) | 企業 | スタートアップ | San Francisco／San Francisco County | consumer, services | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Poll Everywhere](https://www.polleverywhere.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, analytics, saas, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Polymath Robotics](http://www.polymathrobotics.com) | 企業 | グロース | San Francisco／San Francisco County | industrials, manufacturing-and-robotics, hard-tech, machine-learning, robotics, unmanned-vehicle, ai, industrial | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [PostHog](https://www.posthog.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, analytics, developer-tools, open-source, software | 番地単位 | 確認済み（2026-10-08） | 住所・座標一致（2026-10-08） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Practice Fusion](https://www.practicefusion.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Pramp](https://www.pramp.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 都市中心（概略） | 要確認（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Prelim](https://prelim.com/) | 企業 | グロース | San Francisco／San Francisco County | fintech, banking-as-a-service | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Prezi](https://prezi.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Probably Genetic](https://www.probablygenetic.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, diagnostics, health-tech, biotech, genomics, ai | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Prodigal](https://prodigaltech.com/) | 企業 | グロース | Mountain View／Santa Clara County | fintech, credit-and-lending, saas, consumer-finance, ai | 番地単位 | 要確認（2026-10-08） | 住所・座標一致（2026-10-08） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Product School](https://www.productschool.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Promise](http://promise-pay.com) | 企業 | グロース | San Francisco／San Francisco County | government, artificial-intelligence, fintech, govtech, payments | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Prosperworks](https://www.prosperworks.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 要確認（2026-10-02） | 2026-10-07 |
|  | [Protocol Labs](https://protocol.ai/) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, infrastructure, crypto-web3, open-source, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Proven Group](https://www.provenskincare.com) | 企業 | グロース | San Francisco／San Francisco County | consumer, artificial-intelligence, machine-learning, e-commerce, services | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Pulley](https://pulley.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, finance-and-accounting, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Pulse](https://www.runpulse.com/) | 企業 | グロース | San Francisco／San Francisco County | b2b, infrastructure, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Pump.co](https://www.pump.co/) | 企業 | グロース | San Francisco／San Francisco County | fintech, artificial-intelligence, finops, saas, b2b, software | 番地単位 | 確認済み（2026-10-08） | 住所・座標一致（2026-10-08） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Pyka](https://www.flypyka.com/) | 企業 | スタートアップ | Alameda／Alameda County | drones, aerospace, robotics, defense, manufacturing | 番地単位 | 確認済み（2026-10-09） | 要確認（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Pylon](https://usepylon.com/?utm_source=bookface&utm_medium=referral&utm_campaign=pylon-profile) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, operations, artificial-intelligence, customer-success, customer-support, software | 都市中心（概略） | 確認済み（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Qadium](https://qadium.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 要確認（2026-10-02） | 2026-10-07 |
|  | [Quantcast](https://www.quantcast.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Quantstamp](https://quantstamp.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, security, crypto-web3, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Quartzy](https://www.quartzy.com) | 企業 | 大規模 | San Francisco／San Francisco County | healthcare, healthcare-it, saas, b2b, e-commerce, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Quid Inc](https://quid.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Quo (fka OpenPhone)](https://www.quo.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, operations, saas, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Qventus](http://qventus.com) | 企業 | 大規模 | San Francisco／San Francisco County | healthcare, healthcare-it, artificial-intelligence, saas, digital-health | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Qvin](https://qvin.com/) | 企業 | グロース | San Francisco／San Francisco County | healthcare, consumer-health-and-wellness, ai-powered-drug-discovery, consumer-health-services, telemedicine | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Radius](https://radius.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Rainforest](https://www.rainforestqa.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, developer-tools, saas, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [RaiseMe](https://www.raise.me) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Ramen VR](https://ramenvr.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | consumer, gaming, artificial-intelligence, virtual-reality, social, ar, services | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [RazorFrog](https://razorfrog.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Reach](https://reachpower.com) | 企業 | グロース | San Francisco／San Francisco County | industrials, energy, climate, industrial | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Readily](https://readily.ai) | 企業 | グロース | San Francisco／San Francisco County | healthcare, b2b, compliance, regtech, ai, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [ReadMe](http://readme.io/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Ready](https://ready.net) | 企業 | グロース | San Francisco／San Francisco County | b2b, fintech, saas, telecommunications, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Recall.ai](https://www.recall.ai) | 企業 | グロース | San Francisco／San Francisco County | b2b, infrastructure, artificial-intelligence, api, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Recurrency](http://www.recurrency.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, sales, saas, ai, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Red Bridge Internet](https://www.redbridgenet.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Reddit](https://www.reddit.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 要確認（2026-10-06） | 要確認（2026-09-29） | 2026-10-06 |
|  | [Reducto](https://reducto.ai) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, documents, data-engineering, enterprise-software, search, ai, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Reform](https://www.reformhq.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, supply-chain-and-logistics, artificial-intelligence, workflow-automation, compliance, logistics, supply-chain, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Remind](https://www.remind.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Remix](https://www.remix.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Replika](https://replika.ai/) | 企業 | グロース | San Francisco／San Francisco County | consumer, content, mental-health, conversational-ai, services | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Replit](https://replit.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, developer-tools, collaboration, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Replo](https://replo.app/) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, artificial-intelligence, developer-tools, marketing, ai, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Rescale](https://rescale.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, engineering-product-and-design, cloud-computing, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Respan](https://respan.ai) | 企業 | グロース | San Francisco／San Francisco County | b2b, infrastructure, aiops, developer-tools, saas, monitoring, ai, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [RetailReady](https://www.retailreadyai.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, supply-chain-and-logistics, compliance, logistics, supply-chain, ai, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Retell AI](https://retellai.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, artificial-intelligence, ai, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Retool](https://retool.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, productivity, developer-tools, software | 番地単位 | 確認済み（2026-10-08） | 住所・座標一致（2026-10-08） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [RevenueCat](https://www.revenuecat.com/) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, engineering-product-and-design, developer-tools, subscriptions, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Revl](https://revl.com/) | 企業 | グロース | San Francisco／San Francisco County | b2b, marketing, machine-learning, saas, sports-tech, video, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Revvo Technologies, Inc.](https://www.revvo.ai/) | 企業 | スタートアップ | San Mateo／San Mateo County | automotive, iot, ai | 番地単位 | 確認済み（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Revyl](https://www.revyl.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, infrastructure, artificial-intelligence, developer-tools, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Ridecell](https://www.ridecell.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, saas, iot, enterprise, ai, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Rippling](http://rippling.com/) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, human-resources, hr-tech, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Rithm School](https://www.rithmschool.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 要確認（2026-09-29） | 2026-10-06 |
|  | [Roboflow](https://roboflow.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, engineering-product-and-design, developer-tools, machine-learning, computer-vision, enterprise, ai, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Roofr](https://roofr.com/) | 企業 | グロース | San Francisco／San Francisco County | consumer, home-and-personal, saas, construction, proptech, services | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Rootly](https://rootly.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, infrastructure, aiops, developer-tools, saas, security, software | 番地単位 | 確認済み（2026-10-08） | 住所・座標一致（2026-10-08） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Routable](https://routable.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, finance-and-accounting, fintech, payments, software | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Runway Incubator](http://www.runway.is/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 要確認（2026-09-29） | 2026-10-06 |
|  | [SafetyWing](http://www.safetywing.com) | 企業 | 大規模 | San Francisco／San Francisco County | fintech, insurance, consumer-health-services, remote-work | 都市中心（概略） | 確認済み（2026-10-08） | 未照合（—） | 確認済み（2026-10-08） | 2026-10-08 |
|  | [Saildrone](https://www.saildrone.com/) | 企業 | グロース | Alameda／Alameda County | drones, robotics, defense, science, manufacturing | 番地単位 | 確認済み（2026-08-24） | 要確認（2026-10-06） | 確認済み（2026-10-06） | 2026-08-24 |
|  | [Salesforce](https://www.salesforce.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [SalesPatriot](https://www.salespatriot.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, operations, saas, sales, ai, industrial, software | 都市中心（概略） | 確認済み（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Salient](https://www.trysalient.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, fintech, generative-ai, operations, ai, software | 都市中心（概略） | 確認済み（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Salon Media Group](https://www.salon.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [San José State University](https://www.sjsu.edu/) | 大学・研究機関 | 該当なし | San Jose／Santa Clara County | education, research | 番地単位 | 確認済み（2026-10-06） | 要確認（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Sandia National Laboratories, California](https://www.sandia.gov/) | 大学・研究機関 | 該当なし | Livermore／Alameda County | research, science, energy, defense | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Sandisk](https://www.sandisk.com/) | 企業 | 大規模 | Milpitas／Santa Clara County | semiconductors, data-storage, electronics | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Sano](https://sano.co/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 要確認（2026-09-29） | 2026-10-06 |
|  | [Santa Clara University](https://www.scu.edu/) | 大学・研究機関 | 該当なし | Santa Clara／Santa Clara County | education, research | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Say Media](https://www.saymedia.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Scale AI](http://scale.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, engineering-product-and-design, artificial-intelligence, machine-learning, software | 都市中心（概略） | 確認済み（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Scality](http://www.scality.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Scout](http://scouthealth.com) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, diagnostics, consumer-health-services, covid-19, health-tech, consumer-products | 都市中心（概略） | 確認済み（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Scribd](http://scribd.com) | 企業 | 大規模 | San Francisco／San Francisco County | consumer, content, ai-enhanced-learning, remote-work, edtech, services | 都市中心（概略） | 確認済み（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Scripted](https://www.scripted.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Seam](https://seam.co) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, developer-tools, iot, api, software | 都市中心（概略） | 確認済み（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Segmed](https://segmed.ai) | 企業 | グロース | Palo Alto／Santa Clara County | healthcare, diagnostics, health-tech, ai | 番地単位 | 確認済み（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Segment](https://segment.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Semble](https://www.sembleai.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, artificial-intelligence, saas, software | 都市中心（概略） | 確認済み（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Sendbird](https://sendbird.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, engineering-product-and-design, artificial-intelligence, saas, enterprise, ai, software | 都市中心（概略） | 要確認（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Sentry](https://sentry.io) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Sephora](https://www.sephora.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 要確認（2026-09-29） | 2026-10-06 |
|  | [Sequoia Capital](https://www.sequoiacap.com/) | VC・CVC | 該当なし | Menlo Park／San Mateo County | venture-capital, technology | 都市中心（概略） | 要確認（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [ServiceNow](https://www.servicenow.com/) | 企業 | 大規模 | Santa Clara／Santa Clara County | enterprise-software, cloud | 番地単位 | 確認済み（2026-08-23） | 住所・座標一致（2026-10-06） | 要確認（2026-09-30） | 2026-08-23 |
|  | [Shef](https://www.shef.com) | 企業 | グロース | San Francisco／San Francisco County | consumer, food-and-beverage, marketplace, food, food-tech, services | 都市中心（概略） | 確認済み（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Shepherd](https://shepherdinsurance.com) | 企業 | グロース | San Francisco／San Francisco County | fintech, insurance, construction, energy | 都市中心（概略） | 確認済み（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Shogun](http://www.shoguninc.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 要確認（2026-09-29） | 2026-10-06 |
|  | [Shogun](https://getshogun.com/) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, saas, e-commerce, software | 都市中心（概略） | 確認済み（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Shopify](https://www.shopify.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Short Story](https://shortstorybox.com) | 企業 | 大規模 | San Francisco／San Francisco County | consumer, apparel-and-cosmetics, machine-learning, marketplace, e-commerce, services | 都市中心（概略） | 確認済み（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Sieve](https://sievedata.com/) | 企業 | グロース | San Francisco／San Francisco County | b2b, infrastructure, developer-tools, video, data-labeling, data-engineering, ai, software | 都市中心（概略） | 確認済み（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Sift Science](https://siftscience.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Sight Machine](http://sightmachine.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [SigmaMind AI](https://sigmamind.ai?utm_source=yc&utm_medium=web) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, saas, call-center, ai, conversational-ai, software | 都市中心（概略） | 確認済み（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [SigNoz](https://signoz.io) | 企業 | グロース | San Francisco／San Francisco County | b2b, infrastructure, developer-tools, saas, open-source, software | 都市中心（概略） | 確認済み（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Simple AI](https://www.usesimple.ai) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, sales, artificial-intelligence, call-center, operations, ai, software | 都市中心（概略） | 確認済み（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [SimplyInsured](http://simplyinsured.com) | 企業 | グロース | San Francisco／San Francisco County | healthcare, healthcare-services, health-insurance | 都市中心（概略） | 確認済み（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [SINAI](http://www.sinai.com) | 企業 | グロース | San Francisco／San Francisco County | industrials, energy, carbon-capture-and-removal, saas, climate, industrial | 番地単位 | 確認済み（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Sindeo](https://www.sindeo.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 要確認（2026-09-29） | 2026-10-06 |
|  | [SingleStore](https://www.singlestore.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, infrastructure, software | 都市中心（概略） | 要確認（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [SIRUM](http://sirum.org) | 企業 | スタートアップ | San Francisco／San Francisco County | unspecified, consumer-health-services, nonprofit | 都市中心（概略） | 確認済み（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Sixtyfour](https://www.sixtyfour.ai/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, infrastructure, enterprise-software, ai, software | 都市中心（概略） | 確認済み（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Skydio](https://www.skydio.com/) | 企業 | グロース | San Mateo／San Mateo County | drones, aerospace, robotics, artificial-intelligence, defense | 番地単位 | 確認済み（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [SLAC National Accelerator Laboratory](https://www6.slac.stanford.edu/) | 大学・研究機関 | 該当なし | Menlo Park／San Mateo County | research, science | 番地単位 | 確認済み（2026-10-09） | 要確認（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Slack](https://slack.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Slalom Consulting](https://www.slalom.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Slash](https://www.slash.com/) | 企業 | グロース | San Francisco／San Francisco County | fintech | 番地単位 | 確認済み（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Slope](http://www.slopepay.com) | 企業 | スタートアップ | San Francisco／San Francisco County | fintech, payments, artificial-intelligence, machine-learning, fraud-detection | 都市中心（概略） | 確認済み（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Smarking](https://www.smarking.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [SmartBiz Loans](https://www.smartbizloans.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Snackpass](https://snackpass.co) | 企業 | グロース | San Francisco／San Francisco County | consumer, food-and-beverage, marketplace, e-commerce, services | 都市中心（概略） | 確認済み（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [SnapMagic](https://www.snapmagic.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, developer-tools, hardware, marketplace, ai, software | 都市中心（概略） | 確認済み（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Snappr](https://www.snappr.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, marketplace, workflow-automation, software | 都市中心（概略） | 確認済み（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Snowflake](https://www.snowflake.com/) | 企業 | 大規模 | Menlo Park／San Mateo County | cloud, data, enterprise-software | 番地単位 | 確認済み（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [SockSoho](https://socksoho.com) | 企業 | グロース | San Francisco／San Francisco County | consumer, apparel-and-cosmetics, e-commerce, services | 都市中心（概略） | 確認済み（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [SoFi](https://www.sofi.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 要確認（2026-10-01） | 2026-10-07 |
|  | [Solano Economic Development Corporation](https://solanoedc.org/) | 支援機関 | 該当なし | Fairfield／Solano County | economic-development, networking | 番地単位 | 確認済み（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Sonder](https://www.sonder.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Sonoma State University](https://www.sonoma.edu/) | 大学・研究機関 | 該当なし | Rohnert Park／Sonoma County | education, research | 番地単位 | 確認済み（2026-08-24） | 要確認（2026-10-09） | 要確認（2026-09-28） | 2026-08-24 |
|  | [Sourceress](http://sourceress.com/) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, artificial-intelligence, machine-learning, data-engineering, software | 都市中心（概略） | 確認済み（2026-10-09） | 未照合（—） | 未確認（—） | 2026-10-09 |
|  | [Spark Program](http://sparkprogram.org/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Sparkcentral](https://www.sparkcentral.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Speak](http://speak.com) | 企業 | グロース | San Francisco／San Francisco County | consumer, social, artificial-intelligence, education, services | 都市中心（概略） | 確認済み（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Spellbrush](https://spellbrush.com) | 企業 | グロース | San Francisco／San Francisco County | consumer, gaming, artificial-intelligence, deep-learning, generative-ai, services | 都市中心（概略） | 確認済み（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Sphinx](https://sphinxhq.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | fintech | 都市中心（概略） | 確認済み（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Splunk](https://www.splunk.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [SpotAngels](http://www.spotangels.com) | 企業 | スタートアップ | San Francisco／San Francisco County | consumer, transportation-services, navigation, services | 都市中心（概略） | 確認済み（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Spotify](https://www.spotifyjobs.com/location/san-francisco/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 要確認（2026-10-01） | 2026-10-07 |
|  | [Square](https://squareup.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [SRI International](https://www.sri.com/) | 大学・研究機関 | 該当なし | Menlo Park／San Mateo County | research, technology, artificial-intelligence | 番地単位 | 要確認（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Stably AI (Orca)](http://onorca.dev/) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, artificial-intelligence, developer-tools, saas, devops, web-development, software | 都市中心（概略） | 確認済み（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Stacksync](https://www.stacksync.com/) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, software | 番地単位 | 確認済み（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Stamen Design](https://stamen.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Standard AI](https://standard.ai) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, retail, retail-tech, ai, software | 番地単位 | 確認済み（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Stanford University](https://www.stanford.edu/) | 大学・研究機関 | 該当なし | Stanford／Santa Clara County | education, research | 番地単位 | 確認済み（2026-10-09） | 要確認（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [STARK BANK](https://starkbank.com) | 企業 | グロース | San Francisco／San Francisco County | fintech, banking-and-exchange, neobank | 都市中心（概略） | 確認済み（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Stayflexi](https://business.stayflexi.com/) | 企業 | グロース | San Francisco／San Francisco County | b2b, travel, software | 都市中心（概略） | 確認済み（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Stich Labs](https://www.stitchlabs.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Stitch Fix](https://www.stitchfix.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 要確認（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Storylane](https://www.storylane.io/) | 企業 | グロース | San Francisco／San Francisco County | b2b, saas, software | 都市中心（概略） | 確認済み（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Strada](https://www.getstrada.com/) | 企業 | グロース | San Francisco／San Francisco County | b2b, saas, insurance, ai, software | 都市中心（概略） | 確認済み（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Streak](http://streak.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, sales, saas, software | 番地単位 | 確認済み（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Stream](http://www.stream.claims) | 企業 | スタートアップ | San Francisco／San Francisco County | fintech, insurance, saas, b2b, software | 都市中心（概略） | 確認済み（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Stripe](https://stripe.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [StubHub](https://www.stubhub.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 要確認（2026-09-29） | 2026-10-06 |
|  | [StumbleUpon](http://corp.stumbleupon.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 要確認（2026-09-29） | 2026-10-06 |
|  | [Substack](https://substack.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, marketing, marketplace, software | 都市中心（概略） | 確認済み（2026-10-09） | 未照合（—） | 未確認（—） | 2026-10-09 |
|  | [Suger](https://www.suger.io/) | 企業 | グロース | San Francisco／San Francisco County | b2b, sales, marketplace, saas, software | 都市中心（概略） | 確認済み（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Sully](https://www.sully.ai) | 企業 | グロース | San Francisco／San Francisco County | b2b, productivity, artificial-intelligence, saas, health-tech, healthcare, software | 都市中心（概略） | 確認済み（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Sunflower](https://sunflowerclinic.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, healthcare-services | 都市中心（概略） | 確認済み（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Supabase](https://supabase.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, infrastructure, developer-tools, open-source, big-data, data-engineering, databases, software | 都市中心（概略） | 確認済み（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Svix](https://www.svix.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, infrastructure, developer-tools, open-source, api, software | 都市中心（概略） | 確認済み（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Swif.ai](https://www.swif.ai) | 企業 | グロース | San Francisco／San Francisco County | b2b, security, saas, compliance, enterprise, software | 都市中心（概略） | 確認済み（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Swift Navigation](https://www.swiftnav.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Swiftly](https://www.goswift.ly/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Swrve](https://www.swrve.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 要確認（2026-09-29） | 2026-10-06 |
|  | [sync.](https://sync.so/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, software | 番地単位 | 確認済み（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Syncly](https://syncly.app/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, marketing, generative-ai, saas, social-media, software | 都市中心（概略） | 確認済み（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Synopsys](https://www.synopsys.com/) | 企業 | 大規模 | Sunnyvale／Santa Clara County | semiconductors, software, eda | 番地単位 | 確認済み（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [SyntheticFi](https://www.syntheticfi.com/) | 企業 | グロース | San Francisco／San Francisco County | fintech | 番地単位 | 確認済み（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Synthio Labs](https://synthiolabs.com/) | 企業 | グロース | San Francisco／San Francisco County | healthcare, artificial-intelligence, biotech, enterprise | 都市中心（概略） | 確認済み（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Talkable](http://talkable.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, retail, e-commerce, referrals, software | 番地単位 | 要確認（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Tamarind Bio](https://www.tamarind.bio) | 企業 | グロース | San Francisco／San Francisco County | b2b, ai-powered-drug-discovery, artificial-intelligence, saas, biotech, software | 都市中心（概略） | 確認済み（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Tandem](https://tandemspace.com/) | 企業 | グロース | San Francisco／San Francisco County | b2b, office-management, real-estate, proptech, software | 都市中心（概略） | 確認済み（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Tara AI](http://www.tara.ai) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, productivity, artificial-intelligence, generative-ai, saas, devops, ai, software | 都市中心（概略） | 確認済み（2026-10-09） | 未照合（—） | 未確認（—） | 2026-10-09 |
|  | [Tarjimly (acquired)](https://tarjimly.org) | 企業 | グロース | San Francisco／San Francisco County | healthcare, marketplace, nonprofit | 都市中心（概略） | 確認済み（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [TaskRabbit](https://www.taskrabbit.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Tavus](https://www.tavus.io) | 企業 | グロース | San Francisco／San Francisco County | b2b, artificial-intelligence, generative-ai, video, infrastructure, software | 都市中心（概略） | 確認済み（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [TaxGPT](https://www.taxgpt.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, finance-and-accounting, artificial-intelligence, fintech, software | 番地単位 | 確認済み（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [TechSoup](http://www.techsoup.org/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Teespring](https://teespring.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Teleport](https://goteleport.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, infrastructure, developer-tools, devsecops, next-gen-network-security, software | 都市中心（概略） | 確認済み（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Telmai](https://www.telm.ai/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, analytics, ai, ml, software | 番地単位 | 確認済み（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Tempo](https://tempo.fit/) | 企業 | 大規模 | San Francisco／San Francisco County | healthcare, consumer-health-and-wellness, machine-learning, consumer-health-services | 都市中心（概略） | 確認済み（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Terra API](http://tryterra.co) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, saas, digital-health, software | 都市中心（概略） | 確認済み（2026-10-05） | 未照合（—） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [Tesla Fremont Factory](https://www.tesla.com/) | 企業 | 大規模 | Fremont／Alameda County | automotive, manufacturing, energy | 番地単位 | 確認済み（2026-08-23） | 要確認（2026-10-09） | 要確認（2026-09-28） | 2026-08-23 |
|  | [Tesorio](https://www.tesorio.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, finance-and-accounting, fintech, saas, software | 番地単位 | 確認済み（2026-10-05） | 住所・座標一致（2026-10-05） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [testRigor](https://testrigor.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, developer-tools, saas, software | 番地単位 | 確認済み（2026-10-05） | 住所・座標一致（2026-10-05） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [Tetra](https://asktetra.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 都市中心（概略） | 要確認（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [The Essential](http://www.theessential.com) | 企業 | スタートアップ | San Francisco／San Francisco County | consumer, manufacturing, e-commerce, supply-chain, services | 都市中心（概略） | 確認済み（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Thirdlove](https://www.thirdlove.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [ThousandEyes](https://www.thousandeyes.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 要確認（2026-10-01） | 2026-10-07 |
|  | [Thumbtack](https://www.thumbtack.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Thunder](https://www.makethunder.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Thunkable](http://thunkable.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, marketing, developer-tools, saas, design-tools, software | 都市中心（概略） | 確認済み（2026-10-05） | 未照合（—） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [Tilt](https://www.tilt.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Tint](http://www.tint.ai) | 企業 | グロース | San Francisco／San Francisco County | fintech, insurance, artificial-intelligence, developer-tools | 番地単位 | 確認済み（2026-10-05） | 住所・座標一致（2026-10-05） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [Token Transit](https://tokentransit.com) | 企業 | スタートアップ | San Francisco／San Francisco County | government, fintech, govtech, transportation | 都市中心（概略） | 確認済み（2026-10-05） | 未照合（—） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [Tolmo](https://www.tolmo.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, security, devsecops, ai, software | 都市中心（概略） | 確認済み（2026-10-05） | 未照合（—） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [Toma](http://www.toma.com/) | 企業 | グロース | San Francisco／San Francisco County | b2b, operations, artificial-intelligence, marketing, customer-support, automotive, conversational-ai, software | 都市中心（概略） | 確認済み（2026-10-05） | 未照合（—） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [Toothy AI](https://www.toothy.ai/) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, healthcare-it, artificial-intelligence, health-tech, dental, conversational-ai | 都市中心（概略） | 確認済み（2026-10-05） | 未照合（—） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [Topkey](https://www.topkey.io/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, finance-and-accounting, fintech, real-estate, proptech, software | 都市中心（概略） | 確認済み（2026-10-05） | 未照合（—） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [Townsquared](https://townsquared.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Traction](https://www.tractionco.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Tradecraft](http://tradecraft.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 要確認（2026-10-07） | 要確認（2026-10-01） | 2026-10-07 |
|  | [Treasury Prime](https://treasuryprime.com) | 企業 | 大規模 | San Francisco／San Francisco County | fintech, banking-and-exchange, banking-as-a-service, b2b, api, software | 都市中心（概略） | 確認済み（2026-10-05） | 未照合（—） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [Trellis AI](https://runtrellis.com/) | 企業 | グロース | San Francisco／San Francisco County | b2b, data-engineering, infrastructure, ai, databases, software | 都市中心（概略） | 確認済み（2026-10-05） | 未照合（—） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [trendmedia](http://trendmedia.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Triplebyte](https://triplebyte.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 要確認（2026-09-29） | 2026-10-06 |
|  | [TRM Labs](https://trmlabs.com/) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, security, fintech, machine-learning, govtech, cybersecurity, data-engineering, software | 都市中心（概略） | 確認済み（2026-10-05） | 未照合（—） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [Truewind](https://www.trytruewind.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, finance-and-accounting, artificial-intelligence, fintech, generative-ai, saas, software | 都市中心（概略） | 確認済み（2026-10-05） | 未照合（—） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [Trulia](https://www.trulia.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Truss](https://trusspayments.com) | 企業 | スタートアップ | San Francisco／San Francisco County | fintech, banking-and-exchange, payments, construction | 都市中心（概略） | 確認済み（2026-10-05） | 未照合（—） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [Turo](https://turo.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 要確認（2026-09-29） | 2026-10-06 |
|  | [TwentyThree](https://www.twentythree.net/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Twilio](https://www.twilio.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Two Dots](https://www.twodots.com) | 企業 | グロース | San Francisco／San Francisco County | fintech, consumer-finance, artificial-intelligence, real-estate, b2b, ml, software | 都市中心（概略） | 確認済み（2026-10-05） | 未照合（—） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [Uber](https://www.uber.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 要確認（2026-09-29） | 2026-10-06 |
|  | [Ubicloud](https://www.ubicloud.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, infrastructure, cloud-computing, ai, databases, software | 番地単位 | 確認済み（2026-10-05） | 住所・座標一致（2026-10-05） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [UC Santa Cruz Silicon Valley Campus](https://siliconvalley.ucsc.edu/) | 大学・研究機関 | 該当なし | Santa Clara／Santa Clara County | education, research | 番地単位 | 要確認（2026-10-09） | 要確認（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [UNISON](https://www.in-unison.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | consumer, virtual-and-augmented-reality, hardware, virtual-reality, gaming, services | 都市中心（概略） | 確認済み（2026-10-05） | 未照合（—） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [University of California Berkeley](https://www.berkeley.edu/) | 大学・研究機関 | 該当なし | Berkeley／Alameda County | education, research | 番地単位 | 要確認（2026-10-09） | 要確認（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [University of California San Francisco](https://www.ucsf.edu/) | 大学・研究機関 | 該当なし | San Francisco／San Francisco County | education, life-sciences | 番地単位 | 要確認（2026-10-09） | 住所・座標一致（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Unlayer](https://unlayer.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, productivity, artificial-intelligence, developer-tools, saas, design-tools, ai-assistant, software | 都市中心（概略） | 確認済み（2026-10-05） | 未照合（—） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [Unsloth AI](https://unsloth.ai/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, engineering-product-and-design, developer-tools, generative-ai, open-source, infrastructure, ai, software | 都市中心（概略） | 確認済み（2026-10-05） | 未照合（—） | 未確認（—） | 2026-10-05 |
|  | [Upfort](https://www.upfort.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, security, next-gen-network-security, insurance, cyber-insurance, software | 都市中心（概略） | 確認済み（2026-10-05） | 未照合（—） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [Upgrade](http://www.upgrade.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Upgraded](http://getupgraded.com) | 企業 | スタートアップ | San Francisco／San Francisco County | consumer, consumer-electronics, fintech, retail, services | 都市中心（概略） | 確認済み（2026-10-05） | 未照合（—） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [Uplane](https://uplane.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, marketing, artificial-intelligence, saas, analytics, advertising, software | 番地単位 | 確認済み（2026-10-05） | 住所・座標一致（2026-10-05） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [Upsight](http://www.upsight.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 要確認（2026-09-29） | 2026-10-06 |
|  | [Upwave](http://www.upwave.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, operations, software | 都市中心（概略） | 確認済み（2026-10-05） | 未照合（—） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [UrbanSitter](https://www.urbansitter.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 都市中心（概略） | 要確認（2026-10-07） | 未照合（—） | 要確認（2026-10-01） | 2026-10-07 |
|  | [User Testing Inc.](https://www.usertesting.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Usul](https://www.usul.com) | 企業 | スタートアップ | San Francisco／San Francisco County | government, artificial-intelligence, generative-ai, govtech | 都市中心（概略） | 確認済み（2026-10-05） | 未照合（—） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [Vanta](https://vanta.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, security, compliance, software | 都市中心（概略） | 確認済み（2026-10-05） | 未照合（—） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [Vapi](https://vapi.ai) | 企業 | グロース | San Francisco／San Francisco County | b2b, engineering-product-and-design, artificial-intelligence, software | 都市中心（概略） | 確認済み（2026-10-05） | 未照合（—） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [Variance](https://www.variance.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, security, compliance, cybersecurity, enterprise-software, ai, software | 都市中心（概略） | 確認済み（2026-10-05） | 未照合（—） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [Vela](https://tryvela.ai) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, software | 都市中心（概略） | 確認済み（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Velt](https://velt.dev) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, productivity, developer-tools, saas, collaboration, compliance, ai, software | 都市中心（概略） | 確認済み（2026-10-05） | 未照合（—） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [Verge Genomics](http://vergegenomics.com) | 企業 | グロース | San Francisco／San Francisco County | healthcare, drug-discovery-and-delivery | 都市中心（概略） | 確認済み（2026-10-05） | 未照合（—） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [VergeSense](http://www.vergesense.com) | 企業 | グロース | San Francisco／San Francisco County | real-estate-and-construction, housing-and-real-estate, artificial-intelligence, proptech, real-estate, construction | 都市中心（概略） | 確認済み（2026-10-05） | 未照合（—） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [Verifiable](https://verifiable.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, healthcare-it, compliance, api | 都市中心（概略） | 確認済み（2026-10-05） | 未照合（—） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [Veryfi, Inc.](https://www.veryfi.com/) | 企業 | グロース | San Mateo／San Mateo County | b2b, artificial-intelligence, computer-vision, finance, api, ai, software | 番地単位 | 要確認（2026-10-05） | 住所・座標一致（2026-10-05） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [Videopixie](http://videopixie.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, marketing, marketplace, video, software | 都市中心（概略） | 確認済み（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Viglink](http://www.viglink.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Vision Lab](https://thevisionlab.ai/) | 企業 | スタートアップ | San Francisco／San Francisco County | industrials, manufacturing-and-robotics, robotics, manufacturing, data-engineering, ai, industrial | 都市中心（概略） | 確認済み（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Vitagene](https://vitagene.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Vitalize](https://vitalize.care) | 企業 | グロース | San Francisco／San Francisco County | healthcare, saas, b2b, software | 都市中心（概略） | 確認済み（2026-10-05） | 未照合（—） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [Voiceops](https://voiceops.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Vooma](https://www.vooma.ai) | 企業 | グロース | San Francisco／San Francisco County | b2b, supply-chain-and-logistics, software | 都市中心（概略） | 確認済み（2026-10-05） | 未照合（—） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [Vori](https://www.vori.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, retail, grocery, saas, retail-tech, software | 番地単位 | 確認済み（2026-10-05） | 住所・座標一致（2026-10-05） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [Wafer](https://www.wafer.ai) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, engineering-product-and-design, artificial-intelligence, software | 都市中心（概略） | 確認済み（2026-10-05） | 未照合（—） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [Wake](https://wake.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Wanelo](https://wanelo.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Wasmer](https://wasmer.io) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, infrastructure, developer-tools, open-source, software | 都市中心（概略） | 確認済み（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Waterplan](http://waterplan.com) | 企業 | グロース | San Francisco／San Francisco County | b2b, machine-learning, saas, climate, climatetech, software | 番地単位 | 確認済み（2026-10-05） | 住所・座標一致（2026-10-05） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [Watsi](https://watsi.org/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 要確認（2026-09-29） | 2026-10-06 |
|  | [Weave](https://weaveos.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, engineering-product-and-design, artificial-intelligence, analytics, software | 都市中心（概略） | 確認済み（2026-10-05） | 未照合（—） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [Weave Robotics](https://www.weaverobotics.com) | 企業 | グロース | San Francisco／San Francisco County | industrials, manufacturing-and-robotics, industrial | 都市中心（概略） | 確認済み（2026-10-05） | 未照合（—） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [Webflow](https://webflow.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Weebly](https://www.weebly.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Weekend (fmr. Volley)](https://weekend.com) | 企業 | グロース | San Francisco／San Francisco County | consumer, gaming, artificial-intelligence, entertainment, ai, conversational-ai, services | 都市中心（概略） | 確認済み（2026-10-05） | 未照合（—） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [Wefunder](http://wefunder.com) | 企業 | グロース | San Francisco／San Francisco County | fintech, asset-management, investing | 都市中心（概略） | 確認済み（2026-10-05） | 未照合（—） | 未確認（—） | 2026-10-05 |
|  | [Wikia](http://www.wikia.com/fandom) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 要確認（2026-09-29） | 2026-10-06 |
|  | [Wing](https://wing.com/) | 企業 | グロース | Palo Alto／Santa Clara County | drones, aerospace, delivery, logistics, robotics | 番地単位 | 要確認（2026-10-09） | 要確認（2026-10-09） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Wish](https://www.wish.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 都市中心（概略） | 要確認（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Within](http://within.ai) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, artificial-intelligence, enterprise, ai, software | 都市中心（概略） | 確認済み（2026-10-05） | 未照合（—） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [Wizeline](https://www.wizeline.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Womply](http://www.womply.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 要確認（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Wonderschool](https://www.wonderschool.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 都市中心（概略） | 要確認（2026-10-07） | 未照合（—） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Wordware](https://wordware.ai/) | 企業 | スタートアップ | San Francisco／San Francisco County | consumer, aiops, artificial-intelligence, developer-tools, infrastructure, services | 都市中心（概略） | 確認済み（2026-10-05） | 未照合（—） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [Y Combinator](https://www.ycombinator.com/) | VC・CVC | 該当なし | San Francisco／San Francisco County | accelerator, venture-capital | 都市中心（概略） | 要確認（2026-10-09） | 未照合（—） | 確認済み（2026-10-09） | 2026-10-09 |
|  | [Yammer](https://www.yammer.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Yelp](https://www.yelpblog.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Yoneda Health](https://tambua.health/) | 企業 | スタートアップ | San Francisco／San Francisco County | healthcare, health-tech | 都市中心（概略） | 確認済み（2026-10-05） | 未照合（—） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [Zapier](http://zapier.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, productivity, saas, automation, software | 番地単位 | 確認済み（2026-10-05） | 住所・座標一致（2026-10-05） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [ZBiotics](https://zbiotics.com/) | 企業 | グロース | San Francisco／San Francisco County | healthcare, consumer-health-and-wellness, synthetic-biology, health-and-wellness, food-and-beverage | 都市中心（概略） | 確認済み（2026-10-05） | 未照合（—） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [Zeal](https://www.zeal.com) | 企業 | グロース | San Francisco／San Francisco County | fintech, saas, b2b, software | 都市中心（概略） | 確認済み（2026-10-05） | 未照合（—） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [Zedo](https://www.zedo.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 要確認（2026-09-29） | 2026-10-06 |
|  | [Zendar](http://www.zendar.io) | 企業 | グロース | San Francisco／San Francisco County | industrials, automotive, hardware, radar, industrial | 都市中心（概略） | 確認済み（2026-10-05） | 未照合（—） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [Zendesk](https://www.zendesk.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Zendrive](https://www.zendrive.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 要確認（2026-09-29） | 2026-10-06 |
|  | [Zenflow](http://zenflow.com) | 企業 | スタートアップ | South San Francisco／San Mateo County | healthcare, medical-devices | 番地単位 | 確認済み（2026-10-05） | 住所・座標一致（2026-10-05） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [Zenput](https://www.zenput.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Zenreach](https://www.zenreach.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Zensors](https://www.zensors.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, aiops, artificial-intelligence, software | 都市中心（概略） | 確認済み（2026-10-05） | 未照合（—） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [Zenysis](http://www.zenysis.com) | 企業 | スタートアップ | San Francisco／San Francisco County | government | 都市中心（概略） | 確認済み（2026-10-06） | 未照合（—） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Zeo Route Planner](https://zeorouteplanner.com) | 企業 | スタートアップ | San Francisco／San Francisco County | b2b, supply-chain-and-logistics, saas, logistics, supply-chain, transportation, software | 都市中心（概略） | 確認済み（2026-10-05） | 未照合（—） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [Zeplin](https://zeplin.io) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, engineering-product-and-design, developer-tools, saas, design-tools, software | 都市中心（概略） | 確認済み（2026-10-05） | 未照合（—） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [ZeroCater](https://zerocater.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Zignal Labs](http://zignallabs.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Zinc](https://www.zinc.it/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 要確認（2026-09-29） | 2026-10-06 |
|  | [Zip](https://ziphq.com/) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, operations, procurement, software | 都市中心（概略） | 確認済み（2026-10-05） | 未照合（—） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [Zipline](https://www.zipline.com/) | 企業 | グロース | South San Francisco／San Mateo County | drones, aerospace, delivery, logistics, robotics | 番地単位 | 要確認（2026-10-05） | 住所・座標一致（2026-10-05） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [Zitara Technologies, Inc.](https://zitara.com) | 企業 | グロース | San Francisco／San Francisco County | industrials, energy, climate, electric-vehicles, industrial | 都市中心（概略） | 確認済み（2026-10-05） | 未照合（—） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [Zoom](https://www.zoom.com/) | 企業 | 大規模 | San Jose／Santa Clara County | enterprise-software, communications | 番地単位 | 確認済み（2026-10-05） | 住所・座標一致（2026-10-05） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [Zozi](https://www.zozi.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-07） | 住所・座標一致（2026-10-07） | 確認済み（2026-10-07） | 2026-10-07 |
|  | [Zuddl](http://www.zuddl.com) | 企業 | 大規模 | San Francisco／San Francisco County | b2b, saas, software | 都市中心（概略） | 確認済み（2026-10-05） | 未照合（—） | 確認済み（2026-10-05） | 2026-10-05 |
|  | [Zumper](https://www.zumper.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
|  | [Zynga](https://www.zynga.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-10-06） | 住所・座標一致（2026-10-06） | 確認済み（2026-10-06） | 2026-10-06 |
