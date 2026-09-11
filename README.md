# ベイエリア企業マップ

**公開URL: <https://map.nightly.dedyn.io/>**

サンフランシスコ・ベイエリアの日本関連企業・VC/CVC・支援機関・大学などを地図上に可視化する個人プロジェクトです。ベイエリア進出検討時の初回コンタクト先の把握を目的としています。

> [!WARNING]
> 本データは個人的な利用を想定してゆるく管理しているものです。正確性・網羅性・鮮度は保証しません。実務で使う場合は必ず各社の公式情報をご確認ください。

## データサマリ

- データ更新日: 2026-09-11
- 現所在確認日: 2026-09-11
- 座標照合日: 2026-09-11
- URL確認日: 2026-09-11
- 掲載件数: 492件
- 日本関連: 130件
- 大規模（scale: large）: 160件
- 製造業関連: 93件
- 企業以外（VC/CVC・支援機関・大学など）: 30件
- 位置精度: 番地単位 410件／都市中心の概略位置 82件
- 現在のベイエリア所在を確認済み: 120件
- 対象カウンティ: 全9カウンティ（Alameda County・Contra Costa County・Marin County・Napa County・San Francisco County・San Mateo County・Santa Clara County・Solano County・Sonoma County）

## 初回コンタクトの目安

1. **JETRO San Francisco / Global Acceleration Hub** と **Japan Innovation Campus**
2. **Plug and Play Tech Center** と **500 Global**
3. **Stanford / UC Berkeley** 系エコシステム、主要VC、日本人コミュニティ

## 使い方

- 各ピンは公式サイトのロゴ候補（apple-touch-icon / favicon）を使った**正方形アイコン**です。縮小時は近隣企業を件数表示へまとめ、町レベルでは同一座標のピンだけを自動で放射展開します。日本関連は枠色、都市中心の概略位置は破線、現所在未確認は淡色で表示します。
- **検索ボックス**で社名・日本語名・都市などのキーワードで絞り込めます。
- **フィルター**で日系／タイプ／規模／業種／カウンティを組み合わせて絞り込めます（日系・大企業・製造業などのプリセットボタン付き）。

## 所在地データ設計（schema v3）

- GeoJSON座標はWGS84の `[経度, 緯度]`。`location.precision` で番地単位（address）と都市中心（city）を区別します。
- `location.status` は住所と座標の照合結果だけを表し、`presenceCheck` は現在もベイエリアに拠点がある根拠を別管理します。住所が座標化できただけでは現所在確認済みにしません。
- `presenceCheck.status: review` は探索済みでも現在地を確定できる公式根拠がない状態です。`sourceUrl: null` の要確認は試行記録であり、確認済み件数には含めません。
- 親会社のブランド名と現地法人・子会社名は同一視しません。公式の拠点・連絡先・グループ会社ページ内で、対象法人名と住所が同じ掲載区画にある場合だけ自動採用します。
- `websiteCheck` はサイト疎通です。データ更新日・現所在確認日・座標照合日・URL確認日を分けて表示します。

## 最古優先監査

URL確認日が未設定または最も古い75件を毎日確認します。成功した結果だけをGitHubへ保存するため、途中で失敗した対象は次回も最古のまま再試行され、約7回の成功で全件を一巡します。各社公式サイト内リンクに加えてrobots.txtのsitemapとJSON-LDから拠点・連絡先・グループ会社ページを探索します。同じ都市というだけでは採用せず、法人名と住所を同時確認できた場合だけ番地へ昇格します。既存の番地も公式ページを探索して出典を補完し、根拠なしや退去疑いで自動削除はせず「要確認」に留めます。
GitHub Actionsの定期実行とは別に、OpenClawが6時間ごとに最終成功を監視し、30時間以上成功がなければ同じ監査を再実行します。監査がデータを保存すると、完了イベントからPagesを再配信し、Actions由来のコミットも公開地図まで反映します。

## Wikipedia候補探索（月次）

Wikipediaの Silicon Valley企業、Bay Areaテクノロジー企業、米国の無人航空機メーカー、大学、研究機関カテゴリを月1回だけ直列取得し、未掲載候補のJSONをGitHub Actions artifactへ保存します。Wikipediaは候補発見にだけ使い、自動登録はしません。現役で、地域的・産業的な重要性が高い大企業／上場企業／主要スタートアップ／大学・研究機関を選び、公式サイトで現住所を確認できたものだけGeoJSONへ採用します。

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

## ローカルコマンド

```sh
npm test                     # テストとデータ検証
npm run readme               # README.md 再生成
npm run audit                # 未確認・最古の75件を監査
npm run audit -- --shard 0   # シャード0のデータ監査
npm run audit -- --all       # 全件のデータ監査
npm run audit -- --all --city-only # 都市中心データだけ住所探索
npm run discover:wikipedia    # Wikipediaから未掲載候補を生成（データへは自動登録しない）
npm run audit -- --all --city-only --city "San Francisco" # 都市を絞って住所探索
```

## 掲載データ一覧

| 日系 | 名称 | タイプ | 規模 | 都市／カウンティ | 業種 | 位置精度 | 現所在確認 | 座標照合 | URL確認 | 更新日 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ○ | [500 Global](https://500.co/) | VC・CVC | 大規模 | San Francisco／San Francisco County | venture-capital, accelerator, startup-education | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
| ○ | [Acario Innovation / Tokyo Gas](https://acarioinnovation.com/) | 企業 | 大規模 | San Mateo／San Mateo County | energy, venture-capital | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
| ○ | [Advantest America](https://www.advantest.com) | 企業 | 大規模 | San Jose／Santa Clara County | semiconductors, manufacturing | 番地単位 | 確認済み（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
| ○ | [Aflac Ventures](https://www.aflacventures.com/) | 企業 | 大規模 | Palo Alto／Santa Clara County | venture-capital, insurance | 都市中心（概略） | 要確認（2026-09-11） | 未照合（—） | 確認済み（2026-09-11） | 2026-09-11 |
| ○ | [AGC Electronics America](https://www.agc.com/) | 企業 | 大規模 | San Jose／Santa Clara County | materials, manufacturing | 都市中心（概略） | 要確認（2026-09-11） | 未照合（—） | 確認済み（2026-09-11） | 2026-09-11 |
| ○ | [Alps Alpine North America](https://www.alpsalpine.com/) | 企業 | 大規模 | San Jose／Santa Clara County | electronics, automotive | 都市中心（概略） | 要確認（2026-09-11） | 未照合（—） | 確認済み（2026-09-11） | 2026-09-11 |
| ○ | [Anritsu Company](https://www.anritsu.com/en-us/) | 企業 | 大規模 | Morgan Hill／Santa Clara County | telecommunications, manufacturing | 都市中心（概略） | 要確認（2026-09-11） | 未照合（—） | 要確認（2026-09-11） | 2026-09-11 |
| ○ | [Astellas South San Francisco](https://www.astellas.com/us/) | 企業 | 大規模 | South San Francisco／San Mateo County | biotechnology, life-sciences | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
| ○ | [Autify](https://autify.com/) | 企業 | グロース | San Francisco／San Francisco County | software, ai | 番地単位 | 確認済み（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
| ○ | [Azbil North America](https://www.azbil.com/) | 企業 | 大規模 | Santa Clara／Santa Clara County | automation, manufacturing | 都市中心（概略） | 要確認（2026-09-11） | 未照合（—） | 確認済み（2026-09-11） | 2026-09-11 |
| ○ | [Canon USA](https://www.usa.canon.com/) | 企業 | 大規模 | San Jose／Santa Clara County | imaging, electronics | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 要確認（2026-09-11） | 2026-09-11 |
| ○ | [Chugai Pharmabody Research](https://www.chugai-pharmabody.com/) | 企業 | 大規模 | South San Francisco／San Mateo County | biotechnology, life-sciences | 都市中心（概略） | 要確認（2026-09-11） | 未照合（—） | 確認済み（2026-09-11） | 2026-09-11 |
| ○ | [Dai-ichi Life Innovation Lab Silicon Valley](https://www.dai-ichi-life-hd.com/en/) | 企業 | 大規模 | Palo Alto／Santa Clara County | insurance, innovation | 都市中心（概略） | 要確認（2026-09-11） | 未照合（—） | 確認済み（2026-09-11） | 2026-09-11 |
| ○ | [Daiwa Capital Markets America San Francisco](https://us.daiwacm.com/) | 企業 | 大規模 | San Francisco／San Francisco County | finance, securities | 番地単位 | 確認済み（2026-08-23） | 住所・座標一致（2026-09-11） | 要確認（2026-09-11） | 2026-08-23 |
| ○ | [DENSO Silicon Valley Innovation Center](https://www.denso.com/us-ca/en/) | 企業 | 大規模 | Palo Alto／Santa Clara County | automotive, manufacturing | 都市中心（概略） | 要確認（2026-09-11） | 未照合（—） | 要確認（2026-09-11） | 2026-09-11 |
| ○ | [DISCO Hi-Tec America](https://www.disco.co.jp/eg/) | 企業 | 大規模 | Santa Clara／Santa Clara County | semiconductors, manufacturing | 都市中心（概略） | 要確認（2026-09-11） | 未照合（—） | 確認済み（2026-09-11） | 2026-09-11 |
| ○ | [dotData](https://dotdata.com/) | 企業 | 大規模 | San Mateo／San Mateo County | ai, data | 番地単位 | 確認済み（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
| ○ | [ENEOS Silicon Valley](https://www.hd.eneos-hd.co.jp/english/) | 企業 | 大規模 | San Mateo／San Mateo County | energy, materials | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 要確認（2026-09-11） | 2026-09-11 |
| ○ | [Epson America](https://epson.com/) | 企業 | 大規模 | San Jose／Santa Clara County | imaging, electronics | 都市中心（概略） | 要確認（2026-09-11） | 未照合（—） | 確認済み（2026-09-11） | 2026-09-11 |
| ○ | [EXEDY Silicon Valley](https://www.exedy.com/en/) | 企業 | 大規模 | San Mateo／San Mateo County | automotive, manufacturing | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [FANUC America](https://www.fanucamerica.com/) | 企業 | 大規模 | Union City／Alameda County | robotics, manufacturing | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [FUJIFILM Dimatix](https://www.fujifilm.com/fdmx/en/) | 企業 | 大規模 | Santa Clara／Santa Clara County | industrial-printing, electronics, manufacturing | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Fujitsu North America](https://www.fujitsu.com/us) | 企業 | 大規模 | Sunnyvale／Santa Clara County | electronics, software | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 要確認（2026-09-09） | 2026-09-09 |
| ○ | [Furukawa Electric North America Bay Area](https://www.furukawa.co.jp/en/) | 企業 | 大規模 | San Jose／Santa Clara County | electronics, manufacturing | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Hakuhodo DY Group / Irep](https://www.hakuhodody-holdings.co.jp/english/) | 企業 | 大規模 | San Mateo／San Mateo County | advertising, marketing | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Hitachi America](https://www.hitachi.us) | 企業 | 大規模 | Santa Clara／Santa Clara County | electronics, industrial | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Honda Innovations Silicon Valley](https://www.honda.com/innovation) | 企業 | 大規模 | Mountain View／Santa Clara County | automotive, innovation | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 要確認（2026-09-09） | 2026-09-09 |
| ○ | [Honda Research Institute USA](https://usa.honda-ri.com) | 企業 | 大規模 | San Jose／Santa Clara County | automotive, robotics | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [HORIBA Instruments Bay Area](https://www.horiba.com/usa/) | 企業 | 大規模 | Sunnyvale／Santa Clara County | scientific-instruments, manufacturing | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [HOYA Corporation USA](https://www.hoya.com/) | 企業 | 大規模 | Milpitas／Santa Clara County | optics, manufacturing | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Idemitsu Americas](https://idemitsuamericas.com/) | 企業 | 大規模 | San Jose／Santa Clara County | energy, materials, manufacturing | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [IHI](https://www.ihi.co.jp/en/) | 企業 | 大規模 | San Mateo／San Mateo County | industrial, manufacturing, aerospace, defense, space | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Innovation Core SEI](https://sumitomoelectric.com/) | 企業 | 大規模 | San Jose／Santa Clara County | electronics, materials, manufacturing | 番地単位 | 確認済み（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
| ○ | [ITOCHU International](https://www.itochu.com/us/en/) | 企業 | 大規模 | Menlo Park／San Mateo County | trading, investment | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Japan Innovation Campus](https://jp-innovation-campus.org/) | 支援機関 | 該当なし | Palo Alto／Santa Clara County | startup-support, open-innovation, community | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [JCB Silicon Valley](https://www.global.jcb/en/) | 企業 | 大規模 | San Mateo／San Mateo County | payments, finance | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [JEOL USA Bay Area](https://www.jeolusa.com/) | 企業 | 大規模 | Pleasanton／Alameda County | scientific-instruments, manufacturing | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [JETRO San Francisco](https://www.jetro.go.jp/jetro/overseas/us_sanfrancisco/) | 支援機関 | 該当なし | San Francisco／San Francisco County | trade-promotion, investment-promotion, startup-support | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [JSR Micro](https://www.jsrmicro.com/) | 企業 | 大規模 | Sunnyvale／Santa Clara County | semiconductors, materials | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [JTB Group Silicon Valley](https://www.jtbcorp.jp/en/) | 企業 | 大規模 | San Mateo／San Mateo County | travel, business-development | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [JX Advanced Metals America Bay Area](https://www.jx-nmm.com/english/) | 企業 | 大規模 | San Jose／Santa Clara County | materials, manufacturing | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Kanematsu USA](https://www.kanematsuusa.com/) | 企業 | 大規模 | San Jose／Santa Clara County | trading, technology | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 要確認（2026-09-09） | 2026-09-09 |
| ○ | [Kawasaki Heavy Industries Silicon Valley](https://global.kawasaki.com/en/) | 企業 | 大規模 | San Jose／Santa Clara County | robotics, manufacturing, aerospace, defense | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [KDDI America Silicon Valley](https://us.kddi.com/) | 企業 | 大規模 | San Jose／Santa Clara County | telecommunications, cloud | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [KEYENCE America Bay Area](https://www.keyence.com/) | 企業 | 大規模 | San Jose／Santa Clara County | automation, manufacturing | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Kikkoman San Francisco](https://www.kikkoman.com/en/) | 企業 | 大規模 | San Francisco／San Francisco County | food, manufacturing | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Kintone Corporation (Cybozu Group)](https://www.kintone.com/) | 企業 | グロース | San Francisco／San Francisco County | software, collaboration | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Kioxia America](https://americas.kioxia.com) | 企業 | 大規模 | San Jose／Santa Clara County | semiconductors, electronics | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Komatsu Silicon Valley](https://www.komatsu.com/) | 企業 | 大規模 | San Francisco／San Francisco County | industrial, manufacturing | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Konica Minolta Laboratory USA](https://research.konicaminolta.com) | 企業 | 大規模 | San Mateo／San Mateo County | imaging, research | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Kurita Water Industries Silicon Valley](https://www.kurita-water.com/en/) | 企業 | 大規模 | San Mateo／San Mateo County | water, semiconductors, manufacturing | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 要確認（2026-09-09） | 2026-09-09 |
| ○ | [Kyocera Document Solutions](https://www.kyoceradocumentsolutions.us/) | 企業 | 大規模 | Union City／Alameda County | imaging, electronics | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [LegalOn Technologies US](https://www.legalontech.com/) | 企業 | 大規模 | San Francisco／San Francisco County | legaltech, ai | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Makita USA](https://www.makitatools.com/) | 企業 | 大規模 | Hayward／Alameda County | tools, manufacturing | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 要確認（2026-09-09） | 2026-09-09 |
| ○ | [Marubeni America](https://www.marubeniamerica.com/) | 企業 | 大規模 | San Francisco／San Francisco County | trading, investment | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Mercari US](https://www.mercari.com/) | 企業 | 大規模 | Palo Alto／Santa Clara County | ecommerce, software | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 要確認（2026-09-09） | 2026-09-09 |
| ○ | [MinebeaMitsumi Technology Center](https://www.minebeamitsumi.com/) | 企業 | 大規模 | San Jose／Santa Clara County | electronics, manufacturing | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Mitsubishi Chemical America](https://www.mcam.com/) | 企業 | 大規模 | San Jose／Santa Clara County | materials, manufacturing | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Mitsubishi Corporation Americas](https://www.mitsubishicorp.com/us/en/) | 企業 | 大規模 | Palo Alto／Santa Clara County | trading, investment | 番地単位 | 確認済み（2026-08-23） | 住所・座標一致（2026-09-09） | 要確認（2026-09-09） | 2026-08-23 |
| ○ | [Mitsubishi Electric US](https://us.mitsubishielectric.com/) | 企業 | 大規模 | Mountain View／Santa Clara County | electronics, manufacturing, aerospace, space, satellites | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Mitsubishi Heavy Industries America](https://www.mhi.com/) | 企業 | 大規模 | Mountain View／Santa Clara County | industrial, manufacturing, aerospace, defense, space | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Mitsubishi Materials USA Bay Area](https://www.mitsubishimaterials.com/) | 企業 | 大規模 | San Jose／Santa Clara County | materials, manufacturing | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 要確認（2026-09-09） | 2026-09-09 |
| ○ | [Mitsui and Co USA](https://www.mitsui.com/us/en/) | 企業 | 大規模 | Menlo Park／San Mateo County | trading, investment | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Mitsui Fudosan San Francisco](https://www.mfamerica.com/) | 企業 | 大規模 | San Francisco／San Francisco County | real-estate, urban-development | 番地単位 | 確認済み（2026-09-09） | 要確認（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Mizuho Americas San Francisco](https://www.mizuhogroup.com/americas) | 企業 | 大規模 | San Francisco／San Francisco County | finance, banking | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [MODE Inc](https://www.tinkermode.com/) | 企業 | 大規模 | San Mateo／San Mateo County | iot, software | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [MSIG USA San Francisco](https://www.msigusa.com/) | 企業 | 大規模 | San Francisco／San Francisco County | insurance, finance | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [MUFG Bank San Francisco](https://www.mufgamericas.com/) | 企業 | 大規模 | San Francisco／San Francisco County | finance, banking | 番地単位 | 確認済み（2026-08-23） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-08-23 |
| ○ | [Murata Electronics North America](https://www.murata.com) | 企業 | 大規模 | San Mateo／San Mateo County | electronics, manufacturing | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Nagase America](https://www.nagaseamerica.com/) | 企業 | 大規模 | San Jose／Santa Clara County | materials, trading | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [NEC Corporation of America](https://www.necam.com) | 企業 | 大規模 | San Jose／Santa Clara County | electronics, software | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 要確認（2026-09-09） | 2026-09-09 |
| ○ | [Nidec America](https://www.nidec.com/en/) | 企業 | 大規模 | San Jose／Santa Clara County | motors, manufacturing | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Nikon Research Corporation of America](https://www.nikon.com) | 企業 | 大規模 | Belmont／San Mateo County | optics, manufacturing | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Nippon Life Silicon Valley](https://www.nissay.co.jp/english/) | 企業 | 大規模 | Palo Alto／Santa Clara County | insurance, business-development | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 要確認（2026-09-09） | 2026-09-09 |
| ○ | [Nissan Research Center Silicon Valley](https://www.nissan-global.com) | 企業 | 大規模 | Sunnyvale／Santa Clara County | automotive, software | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Nitto Denko Technical America Bay Area](https://www.nitto.com/us/en/) | 企業 | 大規模 | San Jose／Santa Clara County | materials, manufacturing | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 要確認（2026-09-09） | 2026-09-09 |
| ○ | [Nomura Securities International San Francisco](https://www.nomura.com/) | 企業 | 大規模 | San Francisco／San Francisco County | finance, securities | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [NRI IT Solutions America Pacific Branch](https://www.nri.com/en/) | 企業 | 大規模 | San Mateo／San Mateo County | consulting, technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [NTT Communications San Francisco](https://www.ntt.com/en/) | 企業 | 大規模 | San Francisco／San Francisco County | telecommunications, cloud | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 要確認（2026-09-09） | 2026-09-09 |
| ○ | [NTT DATA Silicon Valley](https://us.nttdata.com/) | 企業 | 大規模 | San Jose／Santa Clara County | software, consulting | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [NTT Research](https://ntt-research.com) | 企業 | 大規模 | Sunnyvale／Santa Clara County | research, technology | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Olympus America](https://www.olympusamerica.com/) | 企業 | 大規模 | San Jose／Santa Clara County | medical-devices, imaging | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [OMRON Robotics and Safety Technologies](https://automation.omron.com) | 企業 | 大規模 | Pleasanton／Alameda County | robotics, manufacturing | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [ORIX USA San Francisco](https://www.orix.com/) | 企業 | 大規模 | San Francisco／San Francisco County | finance, investment | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Panasonic North America](https://www.panasonic.com/us) | 企業 | 大規模 | Newark／Alameda County | electronics, manufacturing | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 要確認（2026-09-09） | 2026-09-09 |
| ○ | [Plug and Play Tech Center](https://www.plugandplaytechcenter.com/) | VC・CVC | 大規模 | Sunnyvale／Santa Clara County | venture-capital, accelerator, corporate-innovation | 番地単位 | 要確認（2026-09-09） | 要確認（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [RakuNest](https://www.rakunest.com/) | 支援機関 | 該当なし | San Mateo／San Mateo County | coworking, startup-support, community | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Rakuten USA, Inc.](https://global.rakuten.com/corp/about/map/am_us_rchw.html) | 企業 | 大規模 | San Mateo／San Mateo County | internet, ecommerce | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Rapidus Design Solutions](https://www.rapidus.inc/en/) | 企業 | 大規模 | Santa Clara／Santa Clara County | semiconductors, manufacturing | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Renesas Electronics America](https://www.renesas.com) | 企業 | 大規模 | San Jose／Santa Clara County | semiconductors, electronics | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Resonac US-JOINT](https://www.resonac.com/) | 企業 | 大規模 | Union City／Alameda County | semiconductors, materials, manufacturing | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Ricoh Innovations](https://www.ricoh.com) | 企業 | 大規模 | Menlo Park／San Mateo County | electronics, research | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [ROHM Semiconductor USA](https://www.rohm.com) | 企業 | 大規模 | Santa Clara／Santa Clara County | semiconductors, electronics | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 要確認（2026-09-09） | 2026-09-09 |
| ○ | [Santen](https://www.santen.com/us/) | 企業 | 大規模 | Emeryville／Alameda County | biotechnology, healthcare | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [SCREEN SPE USA](https://www.screen.co.jp/spe/en/) | 企業 | 大規模 | Santa Clara／Santa Clara County | semiconductors, manufacturing | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [SCSK USA Silicon Valley](https://www.scskusa.com/) | 企業 | 大規模 | Santa Clara／Santa Clara County | information-technology, business-development | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Sekisui Chemical Silicon Valley](https://www.sekisuichemical.com/) | 企業 | 大規模 | San Mateo／San Mateo County | materials, manufacturing | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Shimadzu Scientific Instruments Bay Area](https://www.ssi.shimadzu.com/) | 企業 | 大規模 | San Jose／Santa Clara County | scientific-instruments, manufacturing | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Shimizu Corporation Silicon Valley](https://www.shimz.co.jp/en/) | 企業 | 大規模 | San Mateo／San Mateo County | construction, technology-scouting | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
| ○ | [Shin-Etsu MicroSi](https://www.microsi.com/) | 企業 | 大規模 | San Jose／Santa Clara County | semiconductors, materials | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [SmartNews US](https://www.smartnews.com/) | 企業 | 大規模 | Palo Alto／Santa Clara County | media, software | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [SMBC Americas San Francisco](https://www.smbcgroup.com/) | 企業 | 大規模 | San Francisco／San Francisco County | finance, banking | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [SMC Corporation of America Bay Area](https://www.smcusa.com/) | 企業 | 大規模 | San Jose／Santa Clara County | automation, manufacturing | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Socionext America](https://www.socionext.com) | 企業 | 大規模 | Milpitas／Santa Clara County | semiconductors, electronics | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [SoftBank Group International](https://group.softbank/en) | 企業 | 大規模 | San Carlos／San Mateo County | investment, technology | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Sojitz Corporation of America](https://www.sojitz.com/en/) | 企業 | 大規模 | San Jose／Santa Clara County | trading, investment | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [SOMPO Digital Lab Silicon Valley](https://www2.sompo-hd.com/digital/en/pc/) | 企業 | 大規模 | Foster City／San Mateo County | insurance, finance | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
| ○ | [Sony AI America](https://ai.sony/) | 企業 | 大規模 | San Jose／Santa Clara County | ai, research | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Sony Interactive Entertainment](https://sonyinteractive.com/) | 企業 | 大規模 | San Mateo／San Mateo County | electronics, entertainment | 番地単位 | 確認済み（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
| ○ | [Sumitomo Corporation of Americas](https://www.sumitomocorp.com/en/us) | 企業 | 大規模 | Santa Clara／Santa Clara County | trading, investment | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Sumitomo Electric Device Innovations USA](https://www.sedi.co.jp/english/) | 企業 | 大規模 | San Jose／Santa Clara County | semiconductors, manufacturing | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 要確認（2026-09-09） | 2026-09-09 |
| ○ | [Systena Silicon Valley](https://www.systena.co.jp/eng/) | 企業 | 大規模 | San Mateo／San Mateo County | information-technology, business-development | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 要確認（2026-09-11） | 2026-09-11 |
| ○ | [Takara Bio USA](https://www.takarabio.com/) | 企業 | 大規模 | San Jose／Santa Clara County | biotechnology, life-sciences | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [TDK USA](https://www.tdk.com) | 企業 | 大規模 | San Jose／Santa Clara County | electronics, manufacturing | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 要確認（2026-09-09） | 2026-09-09 |
| ○ | [THK America Bay Area](https://www.thk.com/) | 企業 | 大規模 | San Jose／Santa Clara County | industrial, manufacturing | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [TOK America](https://www.tokamerica.com/) | 企業 | 大規模 | Milpitas／Santa Clara County | semiconductors, materials | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Tokio Marine America San Francisco](https://www.tokiomarine.us/) | 企業 | 大規模 | San Francisco／San Francisco County | insurance, finance | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Tokyo Electron America](https://www.tel.com/) | 企業 | 大規模 | Fremont／Alameda County | semiconductors, manufacturing | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Toray Advanced Composites](https://www.toraytac.com/) | 企業 | 大規模 | Morgan Hill／Santa Clara County | materials, manufacturing, aerospace | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Toshiba America Electronic Components](https://toshiba.semicon-storage.com/us/) | 企業 | 大規模 | San Jose／Santa Clara County | semiconductors, electronics | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Tosoh Silicon Valley](https://www.tosoh.com/) | 企業 | 大規模 | San Mateo／San Mateo County | chemicals, electronics, manufacturing | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 要確認（2026-09-09） | 2026-09-09 |
| ○ | [Toyota Research Institute](https://www.tri.global) | 企業 | 大規模 | Los Altos／Santa Clara County | automotive, robotics | 都市中心（概略） | 確認済み（2026-08-23） | 未照合（—） | 要確認（2026-09-09） | 2026-08-23 |
| ○ | [Toyota Tsusho America](https://www.taiamerica.com/) | 企業 | 大規模 | Santa Clara／Santa Clara County | trading, automotive | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Toyota Ventures](https://toyota.ventures/) | VC・CVC | 該当なし | Los Altos／Santa Clara County | venture-capital, mobility | 番地単位 | 確認済み（2026-08-23） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-08-23 |
| ○ | [Treasure Data](https://www.treasuredata.com/) | 企業 | 大規模 | Mountain View／Santa Clara County | data, software | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [WHILL US](https://whill.inc/us/) | 企業 | グロース | San Carlos／San Mateo County | mobility, medical-devices | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Woven by Toyota](https://woven.toyota/en/) | 企業 | 大規模 | Palo Alto／Santa Clara County | automotive, software | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Yamaha Motor Ventures](https://www.yamahamotorventures.com) | VC・CVC | 該当なし | Palo Alto／Santa Clara County | venture-capital, mobility | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Yaskawa America](https://www.yaskawa.com/) | 企業 | 大規模 | Fremont／Alameda County | robotics, manufacturing | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
| ○ | [Yokogawa Corporation of America Bay Area](https://www.yokogawa.com/us/) | 企業 | 大規模 | San Jose／Santa Clara County | automation, manufacturing | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [140 Proof](https://www.140proof.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 要確認（2026-09-09） | 2026-09-09 |
|  | [Abl Schools](https://ablschools.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Abstract](https://www.goabstract.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 要確認（2026-09-09） | 2026-09-09 |
|  | [Accenture](https://www.accenture.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Admitsee](https://www.admitsee.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Adobe](http://www.adobe.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [AdStage](https://www.adstage.io/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Advent Software](https://www.advent.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Affirm](https://www.affirm.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [After College](https://www.aftercollege.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Airbnb](https://www.airbnb.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Airware](https://www.airware.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 要確認（2026-09-09） | 2026-09-09 |
|  | [AKQA](http://www.akqa.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Aktana](https://www.aktana.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Algolia](https://www.algolia.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Alpha Sense](https://www.alpha-sense.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [AltSchool](https://www.altschool.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 要確認（2026-09-09） | 2026-09-09 |
|  | [Always Hired](http://www.alwayshired.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Amazon Web Services](https://aws.amazon.com/) | 企業 | 大規模 | San Francisco／San Francisco County | cloud, enterprise-software | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [AMD](https://www.amd.com/) | 企業 | 大規模 | Santa Clara／Santa Clara County | semiconductors, computing | 番地単位 | 確認済み（2026-08-23） | 住所・座標一致（2026-09-11） | 要確認（2026-09-11） | 2026-08-27 |
|  | [Amplitude Analytics](https://amplitude.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Andreessen Horowitz](https://a16z.com/) | VC・CVC | 該当なし | Menlo Park／San Mateo County | venture-capital, technology | 番地単位 | 確認済み（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [AngelList](https://angel.co/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Anthropic](https://www.anthropic.com/) | 企業 | グロース | San Francisco／San Francisco County | ai, research, enterprise-software | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [AppDirect](https://www.appdirect.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Apple](https://www.apple.com/) | 企業 | 大規模 | Cupertino／Santa Clara County | electronics, software, services | 番地単位 | 確認済み（2026-09-11） | 要確認（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Applied Materials](https://www.appliedmaterials.com/) | 企業 | 大規模 | Santa Clara／Santa Clara County | semiconductors, manufacturing, equipment | 番地単位 | 確認済み（2026-08-24） | 住所・座標一致（2026-09-11） | 要確認（2026-09-11） | 2026-08-24 |
|  | [Apteligent](http://www.apteligent.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 要確認（2026-09-09） | 2026-09-09 |
|  | [Asana](https://asana.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Automattic](https://automattic.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Bebo](https://bebo.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Berkeley SkyDeck](https://skydeck.berkeley.edu/) | 支援機関 | 該当なし | Berkeley／Alameda County | accelerator, startup-support | 都市中心（概略） | 要確認（2026-09-11） | 未照合（—） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [BetterUp](https://www.betterup.co/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Beyond Games](https://www.beyondgames.co/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [BigCommerce](https://www.bigcommerce.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Binti](https://binti.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Bio-Rad Laboratories](https://www.bio-rad.com/) | 企業 | 大規模 | Hercules／Contra Costa County | biotechnology, life-sciences | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 要確認（2026-09-11） | 2026-09-11 |
|  | [Bitnami](https://bitnami.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [blend labs](https://blend.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Bloc](https://www.bloc.io/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [BloomThat](https://www.bloomthat.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Blurb](http://www.blurb.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Braintree](https://www.braintreepayments.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Brigade](http://www.brigade.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 要確認（2026-09-09） | 2026-09-09 |
|  | [BrightBytes](http://www.brightbytes.net/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 要確認（2026-09-09） | 2026-09-09 |
|  | [Buck Institute for Research on Aging](https://www.buckinstitute.org/) | 大学・研究機関 | 該当なし | Novato／Marin County | research, life-sciences | 番地単位 | 確認済み（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Bugcrowd](https://www.bugcrowd.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [BuildZoom](https://www.buildzoom.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Cadence Design Systems](https://www.cadence.com/) | 企業 | 大規模 | San Jose／Santa Clara County | semiconductors, software, eda | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 要確認（2026-09-11） | 2026-09-11 |
|  | [Campsyte](https://www.campsyte.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 要確認（2026-09-09） | 2026-09-09 |
|  | [Castle](https://castle.io/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Castle Global](http://castleglobal.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 要確認（2026-09-09） | 2026-09-09 |
|  | [CBS Interactive](https://www.cbsinteractive.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Chartboost](https://www.chartboost.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Checkr](https://checkr.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Chewse](https://www.chewse.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Chime Bank](https://www.chimebank.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 要確認（2026-09-09） | 2026-09-09 |
|  | [Circle Medical](https://www.circlemedical.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Cisco](https://www.cisco.com/) | 企業 | 大規模 | San Jose／Santa Clara County | networking, cybersecurity, enterprise-software | 番地単位 | 確認済み（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Clara Lending](https://clara.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Clearbit](https://clearbit.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [ClearMetal](http://www.clearmetal.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Clever](https://clever.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Climate Corporation](https://climate.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Cloud4Wi](https://cloud4wi.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Cloudflare](https://www.cloudflare.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Clover Health](https://www.cloverhealth.com/en/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Coffee Meets Bagel](https://coffeemeetsbagel.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Coinbase](https://www.coinbase.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 要確認（2026-09-09） | 2026-09-09 |
|  | [Collective Health](https://collectivehealth.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Creative Market](https://creativemarket.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 要確認（2026-09-09） | 要確認（2026-09-09） | 2026-09-09 |
|  | [Cricket Health](https://crickethealth.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Crowdcast](https://www.crowdcast.io) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [CrowdFlower](https://www.crowdflower.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 要確認（2026-09-09） | 2026-09-09 |
|  | [Crunchyroll](http://www.crunchyroll.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 要確認（2026-09-09） | 2026-09-09 |
|  | [Databricks](https://www.databricks.com/) | 企業 | 大規模 | San Francisco／San Francisco County | ai, data, enterprise-software | 番地単位 | 確認済み（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [DataFox](https://www.datafox.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 要確認（2026-09-09） | 2026-09-09 |
|  | [Delivery Agent](http://www.deliveryagent.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Demandbase](https://www.demandbase.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Disqus](https://disqus.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Docker](https://www.docker.com/) | 企業 | スタートアップ | Palo Alto／Santa Clara County | technology | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Docusign](https://www.docusign.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [DoorDash](https://www.doordash.com/) | 企業 | 大規模 | San Francisco／San Francisco County | delivery, marketplace, logistics | 番地単位 | 確認済み（2026-09-11） | 住所・座標一致（2026-09-11） | 要確認（2026-09-11） | 2026-09-11 |
|  | [DroneDeploy](https://www.dronedeploy.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology, drones, software, data, imaging | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Dropbox](https://www.dropbox.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Duncan Channon](http://www.duncanchannon.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 要確認（2026-09-09） | 2026-09-09 |
|  | [Earnest](https://www.earnest.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 要確認（2026-09-09） | 2026-09-09 |
|  | [Easypost](https://www.easypost.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Eat Club](https://www.eatclub.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Eatsa](https://www.eatsa.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 都市中心（概略） | 要確認（2026-09-10） | 未照合（—） | 要確認（2026-09-10） | 2026-09-10 |
|  | [eBay](https://www.ebay.com/) | 企業 | 大規模 | San Jose／Santa Clara County | e-commerce, marketplace | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 要確認（2026-09-11） | 2026-09-11 |
|  | [Eero](https://eero.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [Elroy Air](https://elroyair.com/) | 企業 | スタートアップ | South San Francisco／San Mateo County | drones, aerospace, delivery, logistics, robotics | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [enSilo](https://www.ensilo.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 要確認（2026-09-10） | 2026-09-10 |
|  | [Entelo](https://www.entelo.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [Envoy](https://envoy.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [Eventbrite](https://www.eventbrite.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [Expensify](https://use.expensify.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [Extole](https://www.extole.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [FitBit](https://www.fitbit.com/home) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [Flexport](https://www.flexport.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [Fond](https://fond.co/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [Forkable](https://forkable.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 都市中心（概略） | 要確認（2026-09-10） | 未照合（—） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [Forward](https://goforward.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 要確認（2026-09-10） | 2026-09-10 |
|  | [Fossa](https://www.fossa.io/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [Fundbox](https://fundbox.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [FundersClub](https://fundersclub.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 要確認（2026-09-10） | 2026-09-10 |
|  | [Galvanize](https://www.galvanize.com/san-francisco) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 要確認（2026-09-10） | 2026-09-10 |
|  | [Genentech](https://www.gene.com/) | 企業 | 大規模 | South San Francisco／San Mateo County | biotechnology, life-sciences | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [General Assembly](https://generalassemb.ly/locations/san-francisco) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [Getaround](https://www.getaround.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [Gigster](https://gigster.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [Gilead Sciences](https://www.gilead.com/) | 企業 | 大規模 | Foster City／San Mateo County | biotechnology, life-sciences | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Givecampus](https://www.givecampus.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 都市中心（概略） | 要確認（2026-09-10） | 未照合（—） | 要確認（2026-09-10） | 2026-09-10 |
|  | [Goodby Silverstein & Partners](https://goodbysilverstein.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [Google](https://www.google.com/) | 企業 | 大規模 | Mountain View／Santa Clara County | internet, cloud, ai | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Groove Labs](http://www.groove.co/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [GrowthX](https://growthx.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Gumroad](https://gumroad.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [Gusto](https://gusto.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 要確認（2026-09-10） | 2026-09-10 |
|  | [Hack Reactor](https://www.hackreactor.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Hammerhead](https://www.hammerhead.io/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 都市中心（概略） | 要確認（2026-09-10） | 未照合（—） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [Haven](https://haveninc.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 要確認（2026-09-10） | 2026-09-10 |
|  | [Heap](https://heapanalytics.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [HelloSign](https://www.hellosign.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Helpshift](https://www.helpshift.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [Hired](https://hired.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Holberton School](https://www.holbertonschool.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [Hoodline](https://hoodline.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 要確認（2026-09-10） | 2026-09-10 |
|  | [Hornblower Cruises](https://www.hornblower.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 要確認（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [HotelTonight](https://www.hoteltonight.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [HotPads](https://hotpads.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 要確認（2026-09-10） | 2026-09-10 |
|  | [HotSchedules](https://www.hotschedules.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [HP Inc.](https://www.hp.com/) | 企業 | 大規模 | Palo Alto／Santa Clara County | computing, electronics, services | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Hustle Inc](https://hustle.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [iCrossing](http://www.icrossing.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Ideo](https://www.ideo.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [IGN Entertainment](http://corp.ign.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [Imgur](https://imgurinc.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [Indiegogo](https://www.indiegogo.com/en) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 要確認（2026-09-10） | 2026-09-10 |
|  | [inDinero](https://www.indinero.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [Insacart](https://www.instacart.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [insightly](https://www.insightly.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-09-10） | 住所・座標一致（2026-09-10） | 要確認（2026-09-10） | 2026-09-10 |
|  | [Intel](https://www.intel.com/) | 企業 | 大規模 | Santa Clara／Santa Clara County | semiconductors, manufacturing, computing | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Intercom](https://www.intercom.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [Intuit](https://www.intuit.com/) | 企業 | 大規模 | Mountain View／Santa Clara County | fintech, enterprise-software | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 要確認（2026-09-09） | 2026-09-09 |
|  | [Intuitive Surgical](https://www.intuitive.com/) | 企業 | 大規模 | Sunnyvale／Santa Clara County | medical-devices, robotics, healthcare | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Joy](https://withjoy.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Joyent](https://www.joyent.com) | 企業 | グロース | Mountain View／Santa Clara County | technology | 番地単位 | 確認済み（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [Jumpshot](https://www.jumpshot.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 要確認（2026-09-09） | 2026-09-09 |
|  | [June Oven](https://juneoven.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [Juniper Networks](https://www.juniper.net/) | 企業 | 大規模 | Sunnyvale／Santa Clara County | networking, telecommunications | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Kentik](https://www.kentik.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [Khosla Ventures](https://www.khoslaventures.com/) | VC・CVC | 該当なし | Menlo Park／San Mateo County | venture-capital, technology | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Kissmetrics](https://www.kissmetrics.com/home/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 要確認（2026-09-10） | 2026-09-10 |
|  | [KittyHawk](https://kittyhawk.io/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 要確認（2026-09-09） | 2026-09-09 |
|  | [KLA](https://www.kla.com/) | 企業 | 大規模 | Milpitas／Santa Clara County | semiconductors, manufacturing, equipment | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Lam Research](https://www.lamresearch.com/) | 企業 | 大規模 | Fremont／Alameda County | semiconductors, manufacturing, equipment | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Landor](https://landor.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [Lattice](https://lattice.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [Lawrence Berkeley National Laboratory](https://www.lbl.gov/) | 大学・研究機関 | 該当なし | Berkeley／Alameda County | research, energy | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Lawrence Livermore National Laboratory](https://www.llnl.gov/) | 大学・研究機関 | 該当なし | Livermore／Alameda County | research, science, energy, defense | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Layer](https://layer.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [Leadspace](https://www.leadspace.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [Leanplum](https://www.leanplum.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [Leap Motion](https://www.leapmotion.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 要確認（2026-09-10） | 要確認（2026-09-10） | 2026-09-10 |
|  | [LendingHome](https://www.lendinghome.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [Lever](https://www.lever.co/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Liftopia](https://about.liftopia.com/index.html) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 要確認（2026-09-10） | 2026-09-10 |
|  | [Lightbend](http://www.lightbend.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 要確認（2026-09-10） | 2026-09-10 |
|  | [LinkedIn](https://www.linkedin.com/) | 企業 | 大規模 | Sunnyvale／Santa Clara County | social-media, enterprise-software, recruiting | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Linqia](http://www.linqia.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [Literably](https://literably.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [Lithium Technologies](https://www.lithium.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 要確認（2026-09-10） | 2026-09-10 |
|  | [Lob](https://lob.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [Lockheed Martin Space](https://www.lockheedmartin.com/en-us/who-we-are/business-areas/space.html) | 企業 | 大規模 | Sunnyvale／Santa Clara County | aerospace, defense, space, manufacturing | 番地単位 | 要確認（2026-09-09） | 要確認（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Logikcull](http://logikcull.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [Looker](https://looker.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [Lyft](https://www.lyft.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [Macy's](https://www.macys.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 要確認（2026-09-10） | 2026-09-10 |
|  | [Mailgun](https://www.mailgun.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [Mapbox](http://www.mapbox.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [Marin Economic Forum](https://marineconomicforum.org/) | 支援機関 | 該当なし | San Rafael／Marin County | economic-development, networking | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Marvell Technology](https://www.marvell.com/) | 企業 | 大規模 | Santa Clara／Santa Clara County | semiconductors, data-infrastructure, networking | 番地単位 | 確認済み（2026-09-09） | 要確認（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Mashery (acquired)](https://www.mashery.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 要確認（2026-09-10） | 2026-09-10 |
|  | [Massdrop](https://www.massdrop.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 要確認（2026-09-09） | 2026-09-09 |
|  | [Mattermark](https://mattermark.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [Matternet](https://www.matternet.com/) | 企業 | グロース | Mountain View／Santa Clara County | drones, aerospace, delivery, logistics, robotics | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Mayfield](https://www.mayfield.com/) | VC・CVC | 該当なし | Menlo Park／San Mateo County | venture-capital, technology | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [McKesson](http://www.mckesson.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [Medium](https://medium.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 要確認（2026-09-10） | 要確認（2026-09-10） | 2026-09-10 |
|  | [Medrio](http://medrio.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [MemSQL](http://www.memsql.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [Mende Design](http://mendedesign.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [Mesosphere](https://mesosphere.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [Meta](https://about.meta.com/) | 企業 | 大規模 | Menlo Park／San Mateo County | social-media, internet, ai | 番地単位 | 確認済み（2026-08-23） | 要確認（2026-09-09） | 確認済み（2026-09-09） | 2026-08-23 |
|  | [Metric Insights](http://www.metricinsights.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-10） | 住所・座標一致（2026-09-10） | 確認済み（2026-09-10） | 2026-09-10 |
|  | [Metromile](https://www.metromile.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 要確認（2026-09-11） | 2026-09-11 |
|  | [Microsoft](https://www.microsoft.com/en-us/) | 企業 | 大規模 | Mountain View／Santa Clara County | cloud, enterprise-software, ai | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [MissionU](https://www.missionu.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 要確認（2026-09-11） | 2026-09-11 |
|  | [Mixpanel](https://mixpanel.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Monkey Inferno](http://monkeyinferno.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [MoogSoft](https://www.moogsoft.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Mux](https://mux.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Napa Valley College](https://www.napavalley.edu/) | 大学・研究機関 | 該当なし | Napa／Napa County | education, community | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [NASA Ames Research Center](https://www.nasa.gov/ames/) | 大学・研究機関 | 該当なし | Moffett Field／Santa Clara County | aerospace, space, research | 番地単位 | 確認済み（2026-09-09） | 要確認（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Navdy](https://www.navdy.com/#see-the-road) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 要確認（2026-09-11） | 2026-09-11 |
|  | [Naytev](https://www.naytev.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [NepFin](https://www.nepfin.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 要確認（2026-09-11） | 2026-09-11 |
|  | [NetApp](https://www.netapp.com/) | 企業 | 大規模 | San Jose／Santa Clara County | data-storage, cloud, enterprise-software | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 要確認（2026-09-09） | 2026-09-09 |
|  | [Netflix](https://www.netflix.com/) | 企業 | 大規模 | Los Gatos／Santa Clara County | streaming, media, technology | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [New Relic](https://newrelic.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [No Means No Worldwide](https://www.nomeansnoworldwide.org/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [NoRedInk](https://www.noredink.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Notable Labs](https://www.notablelabs.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 要確認（2026-09-11） | 2026-09-11 |
|  | [Nova Credit](http://neednova.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Nuna](https://www.nuna.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [NVIDIA](https://www.nvidia.com/) | 企業 | 大規模 | Santa Clara／Santa Clara County | semiconductors, ai, computing | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Oath (former Yahoo!)](https://www.oath.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Okta](https://www.okta.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [OpenAI](https://www.openai.com/) | 企業 | 大規模 | San Francisco／San Francisco County | artificial-intelligence, technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 要確認（2026-09-09） | 2026-09-09 |
|  | [OpenDNS (Cisco)](http://www.opendns.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 要確認（2026-09-11） | 2026-09-11 |
|  | [Opendoor](https://www.opendoor.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Opentable](https://www.opentable.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 要確認（2026-09-11） | 2026-09-11 |
|  | [Optimizely](https://www.optimizely.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Oracle](https://www.oracle.com/) | 企業 | 大規模 | Redwood City／San Mateo County | enterprise-software, cloud, database | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 要確認（2026-09-09） | 2026-09-09 |
|  | [Palo Alto Networks](https://www.paloaltonetworks.com/) | 企業 | 大規模 | Santa Clara／Santa Clara County | cybersecurity, enterprise-software | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Pantheon](https://pantheon.io/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Parsable](https://www.parsable.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Patagonia](http://www.patagonia.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 要確認（2026-09-11） | 2026-09-11 |
|  | [PayPal](https://www.paypal.com/) | 企業 | 大規模 | San Jose／Santa Clara County | fintech, payments | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Periscope Data](https://www.periscopedata.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Pinterest](https://www.pinterest.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Pique Tea](https://www.piquetea.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Plaid](https://plaid.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Planet](https://www.planet.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology, space, satellites, imaging, data | 番地単位 | 確認済み（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [PlanGrid](https://www.plangrid.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Practice Fusion](https://www.practicefusion.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Pramp](https://www.pramp.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Prezi](https://prezi.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Product School](https://www.productschool.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Prosperworks](https://www.prosperworks.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 要確認（2026-09-11） | 2026-09-11 |
|  | [Pyka](https://www.flypyka.com/) | 企業 | スタートアップ | Alameda／Alameda County | drones, aerospace, robotics, defense, manufacturing | 番地単位 | 確認済み（2026-09-09） | 要確認（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Qadium](https://qadium.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 要確認（2026-09-11） | 2026-09-11 |
|  | [Quantcast](https://www.quantcast.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Quid Inc](https://quid.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Radius](https://radius.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [RaiseMe](https://www.raise.me) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [RazorFrog](https://razorfrog.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [ReadMe](http://readme.io/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Red Bridge Internet](https://www.redbridgenet.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Reddit](https://www.reddit.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 要確認（2026-09-11） | 要確認（2026-09-11） | 2026-09-11 |
|  | [Remind](https://www.remind.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Remix](https://www.remix.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Rithm School](https://www.rithmschool.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 要確認（2026-09-11） | 2026-09-11 |
|  | [Runway Incubator](http://www.runway.is/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 要確認（2026-09-11） | 2026-09-11 |
|  | [Saildrone](https://www.saildrone.com/) | 企業 | グロース | Alameda／Alameda County | drones, robotics, defense, science, manufacturing | 番地単位 | 確認済み（2026-08-24） | 要確認（2026-09-09） | 確認済み（2026-09-09） | 2026-08-24 |
|  | [Salesforce](https://www.salesforce.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Salon Media Group](https://www.salon.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [San José State University](https://www.sjsu.edu/) | 大学・研究機関 | 該当なし | San Jose／Santa Clara County | education, research | 番地単位 | 確認済み（2026-09-09） | 要確認（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Sandia National Laboratories, California](https://www.sandia.gov/) | 大学・研究機関 | 該当なし | Livermore／Alameda County | research, science, energy, defense | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Sandisk](https://www.sandisk.com/) | 企業 | 大規模 | Milpitas／Santa Clara County | semiconductors, data-storage, electronics | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Sano](https://sano.co/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 要確認（2026-09-11） | 2026-09-11 |
|  | [Santa Clara University](https://www.scu.edu/) | 大学・研究機関 | 該当なし | Santa Clara／Santa Clara County | education, research | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Say Media](https://www.saymedia.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Scality](http://www.scality.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Scripted](https://www.scripted.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Segment](https://segment.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Sentry](https://sentry.io) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Sephora](https://www.sephora.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 要確認（2026-09-11） | 2026-09-11 |
|  | [Sequoia Capital](https://www.sequoiacap.com/) | VC・CVC | 該当なし | Menlo Park／San Mateo County | venture-capital, technology | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [ServiceNow](https://www.servicenow.com/) | 企業 | 大規模 | Santa Clara／Santa Clara County | enterprise-software, cloud | 番地単位 | 確認済み（2026-08-23） | 住所・座標一致（2026-09-09） | 要確認（2026-09-09） | 2026-08-23 |
|  | [Shogun](http://www.shoguninc.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 要確認（2026-09-11） | 2026-09-11 |
|  | [Shopify](https://www.shopify.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Sift Science](https://siftscience.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Sight Machine](http://sightmachine.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Sindeo](https://www.sindeo.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 要確認（2026-09-11） | 2026-09-11 |
|  | [Skydio](https://www.skydio.com/) | 企業 | グロース | San Mateo／San Mateo County | drones, aerospace, robotics, artificial-intelligence, defense | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [SLAC National Accelerator Laboratory](https://www6.slac.stanford.edu/) | 大学・研究機関 | 該当なし | Menlo Park／San Mateo County | research, science | 番地単位 | 確認済み（2026-09-09） | 要確認（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Slack](https://slack.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Slalom Consulting](https://www.slalom.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Smarking](https://www.smarking.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [SmartBiz Loans](https://www.smartbizloans.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Snowflake](https://www.snowflake.com/) | 企業 | 大規模 | Menlo Park／San Mateo County | cloud, data, enterprise-software | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [SoFi](https://www.sofi.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 要確認（2026-09-09） | 2026-09-09 |
|  | [Solano Economic Development Corporation](https://solanoedc.org/) | 支援機関 | 該当なし | Fairfield／Solano County | economic-development, networking | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Sonder](https://www.sonder.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Sonoma State University](https://www.sonoma.edu/) | 大学・研究機関 | 該当なし | Rohnert Park／Sonoma County | education, research | 番地単位 | 確認済み（2026-08-24） | 要確認（2026-09-09） | 要確認（2026-09-09） | 2026-08-24 |
|  | [Spark Program](http://sparkprogram.org/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Sparkcentral](https://www.sparkcentral.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Splunk](https://www.splunk.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Spotify](https://www.spotifyjobs.com/location/san-francisco/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 要確認（2026-09-09） | 2026-09-09 |
|  | [Square](https://squareup.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [SRI International](https://www.sri.com/) | 大学・研究機関 | 該当なし | Menlo Park／San Mateo County | research, technology, artificial-intelligence | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Stamen Design](https://stamen.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Stanford University](https://www.stanford.edu/) | 大学・研究機関 | 該当なし | Stanford／Santa Clara County | education, research | 番地単位 | 確認済み（2026-09-09） | 要確認（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Stich Labs](https://www.stitchlabs.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Stitch Fix](https://www.stitchfix.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 要確認（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Stripe](https://stripe.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [StubHub](https://www.stubhub.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [StumbleUpon](http://corp.stumbleupon.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 要確認（2026-09-11） | 2026-09-11 |
|  | [Swift Navigation](https://www.swiftnav.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Swiftly](https://www.goswift.ly/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Swrve](https://www.swrve.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 要確認（2026-09-11） | 2026-09-11 |
|  | [Synopsys](https://www.synopsys.com/) | 企業 | 大規模 | Sunnyvale／Santa Clara County | semiconductors, software, eda | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [TaskRabbit](https://www.taskrabbit.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [TechSoup](http://www.techsoup.org/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Teespring](https://teespring.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Tesla Fremont Factory](https://www.tesla.com/) | 企業 | 大規模 | Fremont／Alameda County | automotive, manufacturing, energy | 番地単位 | 確認済み（2026-08-23） | 要確認（2026-09-09） | 要確認（2026-09-09） | 2026-08-23 |
|  | [Tetra](https://asktetra.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 要確認（2026-09-09） | 2026-09-09 |
|  | [Thirdlove](https://www.thirdlove.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [ThousandEyes](https://www.thousandeyes.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 要確認（2026-09-09） | 2026-09-09 |
|  | [Thumbtack](https://www.thumbtack.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Thunder](https://www.makethunder.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Tilt](https://www.tilt.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Townsquared](https://townsquared.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Traction](https://www.tractionco.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Tradecraft](http://tradecraft.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 要確認（2026-09-09） | 2026-09-09 |
|  | [trendmedia](http://trendmedia.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Triplebyte](https://triplebyte.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 要確認（2026-09-11） | 2026-09-11 |
|  | [Trulia](https://www.trulia.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Turo](https://turo.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 要確認（2026-09-11） | 2026-09-11 |
|  | [TwentyThree](https://www.twentythree.net/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Twilio](https://www.twilio.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Uber](https://www.uber.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 要確認（2026-09-11） | 2026-09-11 |
|  | [UC Santa Cruz Silicon Valley Campus](https://siliconvalley.ucsc.edu/) | 大学・研究機関 | 該当なし | Santa Clara／Santa Clara County | education, research | 番地単位 | 要確認（2026-09-09） | 要確認（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [University of California Berkeley](https://www.berkeley.edu/) | 大学・研究機関 | 該当なし | Berkeley／Alameda County | education, research | 番地単位 | 要確認（2026-09-09） | 要確認（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [University of California San Francisco](https://www.ucsf.edu/) | 大学・研究機関 | 該当なし | San Francisco／San Francisco County | education, life-sciences | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Upgrade](http://www.upgrade.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Upsight](http://www.upsight.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 要確認（2026-09-11） | 2026-09-11 |
|  | [UrbanSitter](https://www.urbansitter.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [User Testing Inc.](https://www.usertesting.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Viglink](http://www.viglink.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Vitagene](https://vitagene.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Voiceops](https://voiceops.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Wake](https://wake.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Wanelo](https://wanelo.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Watsi](https://watsi.org/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 要確認（2026-09-11） | 2026-09-11 |
|  | [Webflow](https://webflow.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Weebly](https://www.weebly.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Wikia](http://www.wikia.com/fandom) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 要確認（2026-09-11） | 2026-09-11 |
|  | [Wing](https://wing.com/) | 企業 | グロース | Palo Alto／Santa Clara County | drones, aerospace, delivery, logistics, robotics | 番地単位 | 要確認（2026-09-09） | 要確認（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Wish](https://www.wish.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Wizeline](https://www.wizeline.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Womply](http://www.womply.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 要確認（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Wonderschool](https://www.wonderschool.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Y Combinator](https://www.ycombinator.com/) | VC・CVC | 該当なし | San Francisco／San Francisco County | accelerator, venture-capital | 都市中心（概略） | 要確認（2026-09-09） | 未照合（—） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Yammer](https://www.yammer.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Yelp](https://www.yelpblog.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Zedo](https://www.zedo.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 要確認（2026-09-11） | 2026-09-11 |
|  | [Zendesk](https://www.zendesk.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Zendrive](https://www.zendrive.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 要確認（2026-09-11） | 2026-09-11 |
|  | [Zenput](https://www.zenput.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Zenreach](https://www.zenreach.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [ZeroCater](https://zerocater.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Zignal Labs](http://zignallabs.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 確認済み（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Zinc](https://www.zinc.it/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 要確認（2026-09-11） | 2026-09-11 |
|  | [Zipline](https://www.zipline.com/) | 企業 | グロース | South San Francisco／San Mateo County | drones, aerospace, delivery, logistics, robotics | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Zoom](https://www.zoom.com/) | 企業 | 大規模 | San Jose／Santa Clara County | enterprise-software, communications | 番地単位 | 確認済み（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Zozi](https://www.zozi.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-09） | 住所・座標一致（2026-09-09） | 確認済み（2026-09-09） | 2026-09-09 |
|  | [Zumper](https://www.zumper.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
|  | [Zynga](https://www.zynga.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 番地単位 | 要確認（2026-09-11） | 住所・座標一致（2026-09-11） | 確認済み（2026-09-11） | 2026-09-11 |
