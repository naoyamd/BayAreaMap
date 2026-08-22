# ベイエリア企業マップ

**公開予定URL: <https://naoyamd.github.io/BayAreaMap/>**

サンフランシスコ・ベイエリアの日本関連企業・VC/CVC・支援機関・大学などを地図上に可視化する個人プロジェクトです。ベイエリア進出検討時の初回コンタクト先の把握を目的としています。

> [!WARNING]
> 本データは個人的な利用を想定してゆるく管理しているものです。正確性・網羅性・鮮度は保証しません。実務で使う場合は必ず各社の公式情報をご確認ください。

## データサマリ

- データ更新日: 2026-08-22
- URL確認日: 2026-08-22
- 掲載件数: 422件
- 日本関連: 110件
- 大規模（scale: large）: 102件
- 製造業関連: 60件
- 企業以外（VC/CVC・支援機関・大学など）: 22件
- 対象カウンティ: 全9カウンティ（Alameda County・Contra Costa County・Marin County・Napa County・San Francisco County・San Mateo County・Santa Clara County・Solano County・Sonoma County）

## 初回コンタクトの目安

1. **JETRO San Francisco / Global Acceleration Hub** と **Japan Innovation Campus**
2. **Plug and Play Tech Center** と **500 Global**
3. **Stanford / UC Berkeley** 系エコシステム、主要VC、日本人コミュニティ

## 使い方

- 各ピンはサイトのロゴ（favicon）を使った**正方形アイコン**で、ロゴが取得できない場合は名称の頭文字を表示します。日本関連のピンは枠色で強調されます。
- **検索ボックス**で社名・日本語名・都市などのキーワードで絞り込めます。
- **フィルター**で日系／タイプ／規模／業種／カウンティを組み合わせて絞り込めます（日系・大企業・製造業などのプリセットボタン付き）。

## URL監査（シャード方式）

各エンティティIDのハッシュで全件を45シャードに決定論的に分割し、毎日1シャード分のURLを自動確認します。約1.5か月で全件を一巡します。結果は checkStatus に記録され、ok=確認済み／review=要確認／unchecked=未確認 として一覧表に反映されます。

## ホスティング

GitHub Pages（https://naoyamd.github.io/BayAreaMap/）向けに設定済みで、初回のpush／Pagesデプロイ後に公開されます。将来の独自ドメイン移行に備え、CSS/JS/データはすべて相対パスで参照しています。

## 出典

- JETRO「ベイエリア進出日本企業調査報告書」: <https://www.jetro.go.jp/usa/topics/survey-report-on-japan-based-companies-operating-in-the-san-francisco-bay-area.html>
- sf-companies（theShiva）: <https://github.com/theShiva/sf-companies>

## ローカルコマンド

```sh
npm test                     # テストとデータ検証
npm run readme               # README.md 再生成
npm run audit -- --shard 0   # シャード0のURL確認
npm run audit -- --all       # 全件のURL確認
```

## 掲載データ一覧

| 日系 | 名称 | タイプ | 規模 | 都市／カウンティ | 業種 | 更新日 | 確認日 | 状態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ○ | [500 Global](https://500.co/) | VC・CVC | 大規模 | San Francisco／San Francisco County | venture-capital, accelerator, startup-education | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Advantest America](https://www.advantest.com) | 企業 | 大規模 | San Jose／Santa Clara County | semiconductors, manufacturing | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Aflac Ventures](https://www.aflacventures.com/) | 企業 | 大規模 | Palo Alto／Santa Clara County | venture-capital, insurance | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [AGC Electronics America](https://www.agc.com/) | 企業 | 大規模 | San Jose／Santa Clara County | materials, manufacturing | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Alps Alpine North America](https://www.alpsalpine.com/) | 企業 | 大規模 | San Jose／Santa Clara County | electronics, automotive | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Anritsu Company](https://www.anritsu.com/en-us/) | 企業 | 大規模 | Morgan Hill／Santa Clara County | telecommunications, manufacturing | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Autify](https://autify.com/) | 企業 | グロース | San Francisco／San Francisco County | software, ai | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Azbil North America](https://www.azbil.com/) | 企業 | 大規模 | Santa Clara／Santa Clara County | automation, manufacturing | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Canon USA](https://www.usa.canon.com/) | 企業 | 大規模 | San Jose／Santa Clara County | imaging, electronics | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Chugai Pharmabody Research](https://www.chugai-pharmabody.com/) | 企業 | 大規模 | South San Francisco／San Mateo County | biotechnology, life-sciences | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Cybozu US](https://www.cybozu.com/us/) | 企業 | グロース | San Francisco／San Francisco County | software, collaboration | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Dai-ichi Life Innovation Lab Silicon Valley](https://www.dai-ichi-life-hd.com/en/) | 企業 | 大規模 | Palo Alto／Santa Clara County | insurance, innovation | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Daiwa Capital Markets America San Francisco](https://www.daiwacm.com/) | 企業 | 大規模 | San Francisco／San Francisco County | finance, securities | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [DENSO International America](https://www.denso.com/us-ca/en/) | 企業 | 大規模 | San Jose／Santa Clara County | automotive, manufacturing | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [DISCO Hi-Tec America](https://www.disco.co.jp/eg/) | 企業 | 大規模 | Santa Clara／Santa Clara County | semiconductors, manufacturing | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [dotData](https://dotdata.com/) | 企業 | 大規模 | San Mateo／San Mateo County | ai, data | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Epson America](https://epson.com/) | 企業 | 大規模 | San Jose／Santa Clara County | imaging, electronics | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [FANUC America](https://www.fanucamerica.com/) | 企業 | 大規模 | Union City／Alameda County | robotics, manufacturing | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Fujitsu North America](https://www.fujitsu.com/us) | 企業 | 大規模 | Sunnyvale／Santa Clara County | electronics, software | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Furukawa Electric North America Bay Area](https://www.furukawa.co.jp/en/) | 企業 | 大規模 | San Jose／Santa Clara County | electronics, manufacturing | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Hitachi America](https://www.hitachi.us) | 企業 | 大規模 | Santa Clara／Santa Clara County | electronics, industrial | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Honda Innovations Silicon Valley](https://www.honda.com/innovation) | 企業 | 大規模 | Mountain View／Santa Clara County | automotive, innovation | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Honda Research Institute USA](https://usa.honda-ri.com) | 企業 | 大規模 | San Jose／Santa Clara County | automotive, robotics | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [HORIBA Instruments Bay Area](https://www.horiba.com/usa/) | 企業 | 大規模 | Santa Clara／Santa Clara County | scientific-instruments, manufacturing | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [HOYA Corporation USA](https://www.hoya.com/) | 企業 | 大規模 | Milpitas／Santa Clara County | optics, manufacturing | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [IHI Americas](https://www.ihi.co.jp/ia/en/) | 企業 | 大規模 | San Francisco／San Francisco County | industrial, manufacturing | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [ITOCHU International](https://www.itochu.com/us/en/) | 企業 | 大規模 | San Francisco／San Francisco County | trading, investment | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Japan Innovation Campus](https://jp-innovation-campus.org/) | 支援機関 | 該当なし | Palo Alto／Santa Clara County | startup-support, open-innovation, community | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [JEOL USA Bay Area](https://www.jeolusa.com/) | 企業 | 大規模 | Pleasanton／Alameda County | scientific-instruments, manufacturing | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [JETRO San Francisco](https://www.jetro.go.jp/jetro/overseas/us_sanfrancisco/) | 支援機関 | 該当なし | San Francisco／San Francisco County | trade-promotion, investment-promotion, startup-support | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [JSR Micro](https://www.jsrmicro.com/) | 企業 | 大規模 | Sunnyvale／Santa Clara County | semiconductors, materials | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [JX Advanced Metals America Bay Area](https://www.jx-nmm.com/english/) | 企業 | 大規模 | San Jose／Santa Clara County | materials, manufacturing | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Kanematsu USA](https://www.kanematsuusa.com/) | 企業 | 大規模 | San Jose／Santa Clara County | trading, technology | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [KDDI America Silicon Valley](https://us.kddi.com/) | 企業 | 大規模 | San Jose／Santa Clara County | telecommunications, cloud | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [KEYENCE America Bay Area](https://www.keyence.com/) | 企業 | 大規模 | San Jose／Santa Clara County | automation, manufacturing | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Kioxia America](https://americas.kioxia.com) | 企業 | 大規模 | San Jose／Santa Clara County | semiconductors, electronics | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Komatsu Silicon Valley](https://www.komatsu.com/) | 企業 | 大規模 | San Francisco／San Francisco County | industrial, manufacturing | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Konica Minolta Laboratory USA](https://research.konicaminolta.com) | 企業 | 大規模 | San Mateo／San Mateo County | imaging, research | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Kyocera Document Solutions](https://www.kyoceradocumentsolutions.us/) | 企業 | 大規模 | San Ramon／Contra Costa County | imaging, electronics | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [LegalOn Technologies US](https://www.legalontech.com/) | 企業 | 大規模 | San Francisco／San Francisco County | legaltech, ai | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Makita USA](https://www.makitatools.com/) | 企業 | 大規模 | Hayward／Alameda County | tools, manufacturing | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Marubeni America](https://www.marubeniamerica.com/) | 企業 | 大規模 | San Francisco／San Francisco County | trading, investment | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Mercari US](https://www.mercari.com/) | 企業 | 大規模 | Palo Alto／Santa Clara County | ecommerce, software | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [MinebeaMitsumi Technology Center](https://www.minebeamitsumi.com/) | 企業 | 大規模 | San Jose／Santa Clara County | electronics, manufacturing | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Mitsubishi Chemical America](https://www.mcam.com/) | 企業 | 大規模 | San Jose／Santa Clara County | materials, manufacturing | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Mitsubishi Corporation Americas](https://www.mitsubishicorp.com/us/en/) | 企業 | 大規模 | San Francisco／San Francisco County | trading, investment | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Mitsubishi Electric US](https://us.mitsubishielectric.com/) | 企業 | 大規模 | Santa Clara／Santa Clara County | electronics, manufacturing | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Mitsubishi Heavy Industries America](https://www.mhi.com/) | 企業 | 大規模 | San Francisco／San Francisco County | industrial, manufacturing | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Mitsubishi Materials USA Bay Area](https://www.mitsubishimaterials.com/) | 企業 | 大規模 | San Jose／Santa Clara County | materials, manufacturing | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Mitsui and Co USA](https://www.mitsui.com/us/en/) | 企業 | 大規模 | San Francisco／San Francisco County | trading, investment | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Mizuho Americas San Francisco](https://www.mizuhogroup.com/americas) | 企業 | 大規模 | San Francisco／San Francisco County | finance, banking | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [MODE Inc](https://www.tinkermode.com/) | 企業 | 大規模 | San Mateo／San Mateo County | iot, software | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [MSIG USA San Francisco](https://www.msigusa.com/) | 企業 | 大規模 | San Francisco／San Francisco County | insurance, finance | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [MUFG Bank San Francisco](https://www.bk.mufg.jp/global/) | 企業 | 大規模 | San Francisco／San Francisco County | finance, banking | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Murata Electronics North America](https://www.murata.com) | 企業 | 大規模 | San Jose／Santa Clara County | electronics, manufacturing | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Nagase America](https://www.nagaseamerica.com/) | 企業 | 大規模 | San Jose／Santa Clara County | materials, trading | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [NEC Corporation of America](https://www.necam.com) | 企業 | 大規模 | San Jose／Santa Clara County | electronics, software | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Nidec America](https://www.nidec.com/en/) | 企業 | 大規模 | San Jose／Santa Clara County | motors, manufacturing | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Nikon Research Corporation of America](https://www.nikon.com) | 企業 | 大規模 | Belmont／San Mateo County | optics, manufacturing | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Nissan Research Center Silicon Valley](https://www.nissan-global.com) | 企業 | 大規模 | Sunnyvale／Santa Clara County | automotive, software | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Nitto Denko Technical America Bay Area](https://www.nitto.com/us/en/) | 企業 | 大規模 | San Jose／Santa Clara County | materials, manufacturing | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Nomura Securities International San Francisco](https://www.nomura.com/) | 企業 | 大規模 | San Francisco／San Francisco County | finance, securities | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [NRI America San Francisco](https://www.nri.com/en/) | 企業 | 大規模 | San Francisco／San Francisco County | consulting, technology | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [NTT Communications San Francisco](https://www.ntt.com/en/) | 企業 | 大規模 | San Francisco／San Francisco County | telecommunications, cloud | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [NTT DATA Silicon Valley](https://us.nttdata.com/) | 企業 | 大規模 | San Jose／Santa Clara County | software, consulting | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [NTT Research](https://ntt-research.com) | 企業 | 大規模 | Sunnyvale／Santa Clara County | research, technology | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Olympus America](https://www.olympusamerica.com/) | 企業 | 大規模 | San Jose／Santa Clara County | medical-devices, imaging | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [OMRON Robotics and Safety Technologies](https://automation.omron.com) | 企業 | 大規模 | Pleasanton／Alameda County | robotics, manufacturing | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [ORIX USA San Francisco](https://www.orix.com/) | 企業 | 大規模 | San Francisco／San Francisco County | finance, investment | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Panasonic North America](https://www.panasonic.com/us) | 企業 | 大規模 | Newark／Alameda County | electronics, manufacturing | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Plug and Play Tech Center](https://www.plugandplaytechcenter.com/) | VC・CVC | 大規模 | Sunnyvale／Santa Clara County | venture-capital, accelerator, corporate-innovation | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Rakuten Americas](https://global.rakuten.com) | 企業 | 大規模 | San Mateo／San Mateo County | internet, ecommerce | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Rakuten Medical](https://rakuten-med.com/) | 企業 | 大規模 | San Mateo／San Mateo County | biotechnology, healthcare | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Rakuten Symphony Americas](https://symphony.rakuten.com/) | 企業 | 大規模 | San Mateo／San Mateo County | telecommunications, cloud | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Renesas Electronics America](https://www.renesas.com) | 企業 | 大規模 | San Jose／Santa Clara County | semiconductors, electronics | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Ricoh Innovations](https://www.ricoh.com) | 企業 | 大規模 | Menlo Park／San Mateo County | electronics, research | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [ROHM Semiconductor USA](https://www.rohm.com) | 企業 | 大規模 | Santa Clara／Santa Clara County | semiconductors, electronics | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Santen](https://www.santen.com/us/) | 企業 | 大規模 | Emeryville／Alameda County | biotechnology, healthcare | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [SCREEN SPE USA](https://www.screen.co.jp/spe/en/) | 企業 | 大規模 | Sunnyvale／Santa Clara County | semiconductors, manufacturing | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Shimadzu Scientific Instruments Bay Area](https://www.ssi.shimadzu.com/) | 企業 | 大規模 | Pleasanton／Alameda County | scientific-instruments, manufacturing | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Shin-Etsu MicroSi](https://www.microsi.com/) | 企業 | 大規模 | San Jose／Santa Clara County | semiconductors, materials | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [SmartNews US](https://www.smartnews.com/) | 企業 | 大規模 | San Francisco／San Francisco County | media, software | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [SMBC Americas San Francisco](https://www.smbcgroup.com/) | 企業 | 大規模 | San Francisco／San Francisco County | finance, banking | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [SMC Corporation of America Bay Area](https://www.smcusa.com/) | 企業 | 大規模 | San Jose／Santa Clara County | automation, manufacturing | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Socionext America](https://www.socionext.com) | 企業 | 大規模 | Milpitas／Santa Clara County | semiconductors, electronics | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [SoftBank Group International](https://group.softbank/en) | 企業 | 大規模 | San Carlos／San Mateo County | investment, technology | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Sojitz Corporation of America](https://www.sojitz.com/en/) | 企業 | 大規模 | San Francisco／San Francisco County | trading, investment | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Sompo International San Francisco](https://www.sompo-intl.com/) | 企業 | 大規模 | San Francisco／San Francisco County | insurance, finance | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Sony](https://www.sony.com/) | 企業 | 大規模 | San Mateo／San Mateo County | electronics, entertainment | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Sony AI America](https://ai.sony/) | 企業 | 大規模 | San Jose／Santa Clara County | ai, research | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [SORACOM US](https://www.soracom.io/) | 企業 | グロース | San Francisco／San Francisco County | iot, telecommunications | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Sumitomo Corporation of Americas](https://www.sumitomocorp.com/en/us) | 企業 | 大規模 | San Francisco／San Francisco County | trading, investment | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Sumitomo Electric Device Innovations USA](https://www.sedi.co.jp/english/) | 企業 | 大規模 | San Jose／Santa Clara County | semiconductors, manufacturing | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Takara Bio USA](https://www.takarabio.com/) | 企業 | 大規模 | San Jose／Santa Clara County | biotechnology, life-sciences | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [TDK USA](https://www.tdk.com) | 企業 | 大規模 | San Jose／Santa Clara County | electronics, manufacturing | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [THK America Bay Area](https://www.thk.com/) | 企業 | 大規模 | San Jose／Santa Clara County | industrial, manufacturing | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [TOK America](https://www.tokamerica.com/) | 企業 | 大規模 | Fremont／Alameda County | semiconductors, materials | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Tokio Marine America San Francisco](https://www.tokiomarine.us/) | 企業 | 大規模 | San Francisco／San Francisco County | insurance, finance | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Tokyo Electron America](https://www.tel.com/) | 企業 | 大規模 | Santa Clara／Santa Clara County | semiconductors, manufacturing | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Toray Advanced Composites](https://www.toraytac.com/) | 企業 | 大規模 | Morgan Hill／Santa Clara County | materials, manufacturing | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Toshiba America Electronic Components](https://toshiba.semicon-storage.com/us/) | 企業 | 大規模 | San Jose／Santa Clara County | semiconductors, electronics | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Toyota Research Institute](https://www.tri.global) | 企業 | 大規模 | Los Altos／Santa Clara County | automotive, robotics | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Toyota Tsusho America](https://www.taiamerica.com/) | 企業 | 大規模 | Santa Clara／Santa Clara County | trading, automotive | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Toyota Ventures](https://toyota.ventures/) | VC・CVC | 該当なし | Los Altos／Santa Clara County | venture-capital, mobility | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Treasure Data](https://www.treasuredata.com/) | 企業 | 大規模 | Mountain View／Santa Clara County | data, software | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [WHILL US](https://whill.inc/us/) | 企業 | グロース | San Carlos／San Mateo County | mobility, medical-devices | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Woven by Toyota](https://woven.toyota/en/) | 企業 | 大規模 | Palo Alto／Santa Clara County | automotive, software | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Yamaha Motor Ventures](https://www.yamahamotorventures.com) | VC・CVC | 該当なし | Palo Alto／Santa Clara County | venture-capital, mobility | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Yaskawa America](https://www.yaskawa.com/) | 企業 | 大規模 | Fremont／Alameda County | robotics, manufacturing | 2026-08-22 | 2026-08-22 | 未確認 |
| ○ | [Yokogawa Corporation of America Bay Area](https://www.yokogawa.com/us/) | 企業 | 大規模 | San Jose／Santa Clara County | automation, manufacturing | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [140 Proof](https://www.140proof.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Abl Schools](https://ablschools.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Abstract](https://www.goabstract.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Accenture](https://www.accenture.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Admitsee](https://www.admitsee.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Adobe](http://www.adobe.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [AdStage](https://www.adstage.io/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Advent Software](https://www.advent.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Affirm](https://www.affirm.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [After College](https://www.aftercollege.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Airbnb](https://www.airbnb.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Airware](https://www.airware.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [AKQA](http://www.akqa.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Aktana](https://www.aktana.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Algolia](https://www.algolia.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Alpha Sense](https://www.alpha-sense.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [AltSchool](https://www.altschool.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Always Hired](http://www.alwayshired.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Amazon Web Services](https://www.amazon.jobs/en) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Amplitude Analytics](https://amplitude.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Andreessen Horowitz](https://a16z.com/) | VC・CVC | 該当なし | Menlo Park／San Mateo County | venture-capital, technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [AngelList](https://angel.co/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [AppDirect](https://www.appdirect.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Apteligent](http://www.apteligent.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Asana](https://asana.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Automattic](https://automattic.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Bebo](https://bebo.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Berkeley SkyDeck](https://skydeck.berkeley.edu/) | 支援機関 | 該当なし | Berkeley／Alameda County | accelerator, startup-support | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [BetterUp](https://www.betterup.co/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Beyond Games](https://www.beyondgames.co/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [BigCommerce](https://www.bigcommerce.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Binti](https://binti.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Bitnami](https://bitnami.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [blend labs](https://blend.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Bloc](https://www.bloc.io/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [BloomThat](https://www.bloomthat.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Blurb](http://www.blurb.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Braintree](https://www.braintreepayments.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Brigade](http://www.brigade.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [BrightBytes](http://www.brightbytes.net/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Buck Institute for Research on Aging](https://www.buckinstitute.org/) | 大学・研究機関 | 該当なし | Novato／Marin County | research, life-sciences | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Bugcrowd](https://www.bugcrowd.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [BuildZoom](https://www.buildzoom.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Campsyte](https://www.campsyte.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Castle](https://castle.io/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Castle Global](http://castleglobal.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [CBS Interactive](https://www.cbsinteractive.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Chartboost](https://www.chartboost.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Checkr](https://checkr.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Chewse](https://www.chewse.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Chime Bank](https://www.chimebank.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Circle Medical](https://www.circlemedical.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Clara Lending](https://clara.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Clearbit](https://clearbit.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [ClearMetal](http://www.clearmetal.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Clever](https://clever.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Climate Corporation](https://climate.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Cloud4Wi](https://cloud4wi.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Cloudflare](https://www.cloudflare.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Clover Health](https://www.cloverhealth.com/en/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Coffee Meets Bagel](https://coffeemeetsbagel.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Coinbase](https://www.coinbase.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Collective Health](https://collectivehealth.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Creative Market](https://creativemarket.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Cricket Health](https://crickethealth.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Crowdcast](https://www.crowdcast.io) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [CrowdFlower](https://www.crowdflower.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Crunchyroll](http://www.crunchyroll.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [DataFox](https://www.datafox.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Delivery Agent](http://www.deliveryagent.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Demandbase](https://www.demandbase.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Disqus](https://disqus.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Docker](https://www.docker.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Docusign](https://www.docusign.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [DroneDeploy](https://www.dronedeploy.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Dropbox](https://www.dropbox.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Duncan Channon](http://www.duncanchannon.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Earnest](https://www.earnest.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Easypost](https://www.easypost.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Eat Club](https://www.eatclub.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Eatsa](https://www.eatsa.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Eero](https://eero.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [enSilo](https://www.ensilo.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Entelo](https://www.entelo.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Envoy](https://envoy.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Eventbrite](https://www.eventbrite.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Expensify](https://use.expensify.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Extole](https://www.extole.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [FitBit](https://www.fitbit.com/home) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Flexport](https://www.flexport.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Fond](https://fond.co/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Forkable](https://forkable.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Forward](https://goforward.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Fossa](https://www.fossa.io/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Fundbox](https://fundbox.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [FundersClub](https://fundersclub.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Galvanize](https://www.galvanize.com/san-francisco) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [General Assembly](https://generalassemb.ly/locations/san-francisco) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Getaround](https://www.getaround.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Gigster](https://gigster.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Givecampus](https://www.givecampus.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Goodby Silverstein & Partners](https://goodbysilverstein.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Groove Labs](http://www.groove.co/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [GrowthX](https://growthx.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Gumroad](https://gumroad.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Gusto](https://gusto.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Hack Reactor](https://www.hackreactor.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Hammerhead](https://www.hammerhead.io/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Haven](https://haveninc.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Heap](https://heapanalytics.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [HelloSign](https://www.hellosign.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Helpshift](https://www.helpshift.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Hired](https://hired.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Holberton School](https://www.holbertonschool.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Hoodline](https://hoodline.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Hornblower Cruises](https://www.hornblower.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [HotelTonight](https://www.hoteltonight.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [HotPads](https://hotpads.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [HotSchedules](https://www.hotschedules.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Hustle Inc](https://hustle.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [iCrossing](http://www.icrossing.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Ideo](https://www.ideo.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [IGN Entertainment](http://corp.ign.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Imgur](https://imgurinc.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Indiegogo](https://www.indiegogo.com/en) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [inDinero](https://www.indinero.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Insacart](https://www.instacart.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [insightly](https://www.insightly.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Intercom](https://www.intercom.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Joy](https://withjoy.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Joyent](https://www.joyent.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Jumpshot](https://www.jumpshot.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [June Oven](https://juneoven.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Kentik](https://www.kentik.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Khosla Ventures](https://www.khoslaventures.com/) | VC・CVC | 該当なし | Menlo Park／San Mateo County | venture-capital, technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Kissmetrics](https://www.kissmetrics.com/home/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [KittyHawk](https://kittyhawk.io/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Landor](https://landor.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Lattice](https://lattice.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Lawrence Berkeley National Laboratory](https://www.lbl.gov/) | 大学・研究機関 | 該当なし | Berkeley／Alameda County | research, energy | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Layer](https://layer.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Leadspace](https://www.leadspace.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Leanplum](https://www.leanplum.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Leap Motion](https://www.leapmotion.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [LendingHome](https://www.lendinghome.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Lever](https://www.lever.co/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Liftopia](https://about.liftopia.com/index.html) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Lightbend](http://www.lightbend.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Linqia](http://www.linqia.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Literably](https://literably.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Lithium Technologies](https://www.lithium.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Lob](https://lob.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Logikcull](http://logikcull.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Looker](https://looker.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Lyft](https://www.lyft.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Macy's](https://www.macys.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Mailgun](https://www.mailgun.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Mapbox](http://www.mapbox.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Marin Economic Forum](https://marineconomicforum.org/) | 支援機関 | 該当なし | San Rafael／Marin County | economic-development, networking | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Mashery (acquired)](https://www.mashery.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Massdrop](https://www.massdrop.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Mattermark](https://mattermark.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Mayfield](https://www.mayfield.com/) | VC・CVC | 該当なし | Menlo Park／San Mateo County | venture-capital, technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [McKesson](http://www.mckesson.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Medium](https://medium.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Medrio](http://medrio.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [MemSQL](http://www.memsql.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Mende Design](http://mendedesign.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Mesosphere](https://mesosphere.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Metric Insights](http://www.metricinsights.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Metromile](https://www.metromile.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Microsoft](https://www.microsoft.com/en-us/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [MissionU](https://www.missionu.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Mixpanel](https://mixpanel.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Monkey Inferno](http://monkeyinferno.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [MoogSoft](https://www.moogsoft.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Mux](https://mux.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Napa Valley College](https://www.napavalley.edu/) | 大学・研究機関 | 該当なし | Napa／Napa County | education, community | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Navdy](https://www.navdy.com/#see-the-road) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Naytev](https://www.naytev.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [NepFin](https://www.nepfin.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [New Relic](https://newrelic.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [No Means No Worldwide](https://www.nomeansnoworldwide.org/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [NoRedInk](https://www.noredink.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Notable Labs](https://www.notablelabs.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Nova Credit](http://neednova.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Nuna](https://www.nuna.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Oath (former Yahoo!)](https://www.oath.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Okta](https://www.okta.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [OpenAI](https://www.openai.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [OpenDNS (Cisco)](http://www.opendns.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Opendoor](https://www.opendoor.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Opentable](https://www.opentable.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Optimizely](https://www.optimizely.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Pantheon](https://pantheon.io/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Parsable](https://www.parsable.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Patagonia](http://www.patagonia.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Periscope Data](https://www.periscopedata.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Pinterest](https://www.pinterest.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Pique Tea](https://www.piquetea.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Plaid](https://plaid.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Planet](https://www.planet.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [PlanGrid](https://www.plangrid.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Practice Fusion](https://www.practicefusion.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Pramp](https://www.pramp.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Prezi](https://prezi.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Product School](https://www.productschool.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Prosperworks](https://www.prosperworks.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Qadium](https://qadium.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Quantcast](https://www.quantcast.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Quid Inc](https://quid.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Radius](https://radius.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [RaiseMe](https://www.raise.me) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [RazorFrog](https://razorfrog.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [ReadMe](http://readme.io/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Red Bridge Internet](https://www.redbridgenet.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Reddit](https://www.reddit.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Remind](https://www.remind.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Remix](https://www.remix.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Rithm School](https://www.rithmschool.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Runway Incubator](http://www.runway.is/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Salesforce](https://www.salesforce.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Salon Media Group](https://www.salon.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Sano](https://sano.co/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Say Media](https://www.saymedia.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Scality](http://www.scality.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Scripted](https://www.scripted.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Segment](https://segment.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Sentry](https://sentry.io) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Sephora](https://www.sephora.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Sequoia Capital](https://www.sequoiacap.com/) | VC・CVC | 該当なし | Menlo Park／San Mateo County | venture-capital, technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Shogun](http://www.shoguninc.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Shopify](https://www.shopify.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Sift Science](https://siftscience.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Sight Machine](http://sightmachine.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Sindeo](https://www.sindeo.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [SLAC National Accelerator Laboratory](https://www6.slac.stanford.edu/) | 大学・研究機関 | 該当なし | Menlo Park／San Mateo County | research, science | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Slack](https://slack.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Slalom Consulting](https://www.slalom.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Smarking](https://www.smarking.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [SmartBiz Loans](https://www.smartbizloans.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [SoFi](https://www.sofi.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Solano Economic Development Corporation](https://solanoedc.org/) | 支援機関 | 該当なし | Fairfield／Solano County | economic-development, networking | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Sonder](https://www.sonder.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Sonoma State University](https://www.sonoma.edu/) | 大学・研究機関 | 該当なし | Rohnert Park／Sonoma County | education, research | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Spark Program](http://sparkprogram.org/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Sparkcentral](https://www.sparkcentral.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Splunk](https://www.splunk.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Spotify](https://www.spotifyjobs.com/location/san-francisco/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Square](https://squareup.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Stamen Design](https://stamen.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Stanford University](https://www.stanford.edu/) | 大学・研究機関 | 該当なし | Stanford／Santa Clara County | education, research | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Stich Labs](https://www.stitchlabs.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Stitch Fix](https://www.stitchfix.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Stripe](https://stripe.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [StubHub](https://www.stubhub.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [StumbleUpon](http://corp.stumbleupon.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Swift Navigation](https://www.swiftnav.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Swiftly](https://www.goswift.ly/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Swrve](https://www.swrve.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [TaskRabbit](https://www.taskrabbit.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [TechSoup](http://www.techsoup.org/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Teespring](https://teespring.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Tetra](https://asktetra.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Thirdlove](https://www.thirdlove.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [ThousandEyes](https://www.thousandeyes.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Thumbtack](https://www.thumbtack.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Thunder](https://www.makethunder.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Tilt](https://www.tilt.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Townsquared](https://townsquared.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Traction](https://www.tractionco.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Tradecraft](http://tradecraft.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [trendmedia](http://trendmedia.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Triplebyte](https://triplebyte.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Trulia](https://www.trulia.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Turo](https://turo.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [TwentyThree](https://www.twentythree.net/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Twilio](https://www.twilio.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Uber](https://www.uber.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [University of California Berkeley](https://www.berkeley.edu/) | 大学・研究機関 | 該当なし | Berkeley／Alameda County | education, research | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [University of California San Francisco](https://www.ucsf.edu/) | 大学・研究機関 | 該当なし | San Francisco／San Francisco County | education, life-sciences | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Upgrade](http://www.upgrade.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Upsight](http://www.upsight.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [UrbanSitter](https://www.urbansitter.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [User Testing Inc.](https://www.usertesting.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Viglink](http://www.viglink.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Vitagene](https://vitagene.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Voiceops](https://voiceops.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Wake](https://wake.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Wanelo](https://wanelo.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Watsi](https://watsi.org/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Webflow](https://webflow.com) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Weebly](https://www.weebly.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Wikia](http://www.wikia.com/fandom) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Wish](https://www.wish.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Wizeline](https://www.wizeline.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Womply](http://www.womply.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Wonderschool](https://www.wonderschool.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Y Combinator](https://www.ycombinator.com/) | VC・CVC | 該当なし | San Francisco／San Francisco County | accelerator, venture-capital | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Yammer](https://www.yammer.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Yelp](https://www.yelpblog.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Zedo](https://www.zedo.com) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Zendesk](https://www.zendesk.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Zendrive](https://www.zendrive.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Zenput](https://www.zenput.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Zenreach](https://www.zenreach.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [ZeroCater](https://zerocater.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Zignal Labs](http://zignallabs.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Zinc](https://www.zinc.it/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Zozi](https://www.zozi.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Zumper](https://www.zumper.com/) | 企業 | スタートアップ | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
|  | [Zynga](https://www.zynga.com/) | 企業 | グロース | San Francisco／San Francisco County | technology | 2026-08-22 | 2026-08-22 | 未確認 |
