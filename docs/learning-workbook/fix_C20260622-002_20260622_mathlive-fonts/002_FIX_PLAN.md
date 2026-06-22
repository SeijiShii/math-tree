# 修正計画: MathLive フォント配備

## 1. 修正対象ファイル
| ファイル | 修正内容 |
|---|---|
| public/mathlive/fonts/*.woff2（新規 20 件） | node_modules/mathlive/fonts からコピー = 配信パスに同梱 |
| src/lib/mathlive-config.ts（新規） | `MATHLIVE_FONTS_DIR = '/mathlive/fonts'`（純定数） |
| src/lib/mathlive-setup.ts（新規） | `configureMathlive()`: `MathfieldElement.fontsDirectory='/mathlive/fonts'` + `soundsDirectory=null`。非ブラウザは no-op ガード |
| src/features/learning-workbook/WorkbookView.tsx | `import "mathlive"` → `configureMathlive()` 呼出（チャンク読込時、math-field render 前） |

## 2. 修正範囲の限定方針
根本原因（配信漏れ + fontsDirectory 未設定）のみ。mathlive は learn チャンクに code-split 維持（main bundle に載せない）。

## 3. 副作用なき確認方法
- 既存テスト維持（smoke.test = App→Workbookwith mathlive 読込でも no-op ガードで green）。
- 追加テスト: 003。手動: 本番 /learn でフォント 200 + 数式描画。

## 4. リリース戦略
即時（severity=high）。/flow:tdd → green → CLI デプロイ → 本番でフォント 200 検証。

## 5. ロールバック方針
コード revert + public/mathlive 削除で戻せる ✅。DB 影響なし。

## 7. DoD
- [ ] /mathlive/fonts/*.woff2 が dist/本番に配信され 200
- [ ] MathfieldElement.fontsDirectory='/mathlive/fonts'
- [ ] 003 全 green / 既存破壊なし
- [ ] 本番で数式フォント読込（NetworkError 消滅）
