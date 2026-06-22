# 実装レポート: learning-workbook C20260622-002（MathLive フォント配備）
## 実装日時
2026-06-22 (JST) / モード: fix
## 変更一覧（Phase 1・単一）
- public/mathlive/fonts/*.woff2（20 件）= node_modules/mathlive/fonts からコピー（配信パスに同梱）。
- src/lib/mathlive-config.ts（新規）: `MATHLIVE_FONTS_DIR='/mathlive/fonts'`（純定数）。
- src/lib/mathlive-setup.ts（新規）: `configureMathlive()` で `MathfieldElement.fontsDirectory='/mathlive/fonts'` + `soundsDirectory=null`。非ブラウザ no-op ガード。
- WorkbookView.tsx: `import "mathlive"` → `configureMathlive()` 呼出（learn チャンク読込時、math-field render 前）。mathlive は learn チャンクに code-split 維持。
- src/lib/mathlive-config.test.ts（新規）: R1/R2。
## 計画からの差分
- 非ブラウザで MathfieldElement undefined → throw（smoke.test fail）を no-op ガードで解消（計画の「副作用なき確認」に従い既存 smoke 維持）。
- sounds は null で無効化（音声アセット 404 も予防）。
## 検証
typecheck / build green / 129 tests green / dist に /mathlive/fonts 20 件 + JS に fontsDirectory='/mathlive/fonts' 焼込確認。
## PR Description
### タイトル
fix(learning-workbook): MathLive フォントを同梱配信 + fontsDirectory 固定（C20260622-002）
### 概要
本番で数式フォントが /assets/fonts から 404（NetworkError）になっていた。フォントを public/mathlive/fonts に同梱し fontsDirectory を固定、音声は無効化。
