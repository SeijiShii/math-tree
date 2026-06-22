# クレーム判定レポート

**claim id**: C20260622-002
**判定日**: 2026-06-22
**判定者**: Claude (Opus 4.8) + seiji
**判定**: **バグ (fix)**

## 1. 三項照合
### 1.1 期待
数式エディタが MathLive フォントを読み込み数式を描画する（concept §1.1 UC#5）。
### 1.2 既存仕様 (Spec)
- concept §1.1 UC#5「WYSIWYG 数式エディタ（MathLive、内部 LaTeX）で途中式を書く」。
- learning-workbook が `import "mathlive"` + `<math-field>` を使用（WorkbookView.tsx）。
### 1.3 現実 (Actual)
- `src/features/learning-workbook/WorkbookView.tsx`: `import "mathlive"` のみで **`MathfieldElement.fontsDirectory` 未設定**。
- MathLive のフォントは `node_modules/mathlive/fonts/*.woff2`（+ sounds）にあるが、**Vite が静的配信せず** `public/` にも無い。
- MathLive は実行時に bundle 位置（`/assets/index-*.js`）基準で `/assets/fonts` を推定し 404（NetworkError）。
### 1.4 照合結果
期待（数式描画 = SPEC UC#5）≠ 現実（フォント 404）→ **バグ (fix)**。フォント資産の未配信 + fontsDirectory 未設定という実装漏れ。

## 2. 判定根拠
1. 期待は concept UC#5 に明記（数式エディタが機能すること）= 解釈の余地なし（revise でない）。
2. learning-workbook SPEC は MathLive 採用済み = 機能は存在（feature でない）。
3. 現実はフォント資産の配信漏れ + 設定漏れ（実装バグ）。新規 SPEC 不要。
4. severity=high: 数式描画は学習中核 UI。

## 3. 推奨分岐先
- **コマンド**: `/flow:fix`
- **引数**: `learning-workbook C20260622-002 --severity=high --from-claim=C20260622-002`
- **修正方向（fix で詳細化）**: MathLive フォント（+ sounds）を配信パスに配置（`public/` へコピー）+ `MathfieldElement.fontsDirectory`（必要なら `soundsDirectory`）を設定。dev/build/本番でフォント 200 になることを検証。

## 4. 却下時の対応
（該当なし）

## 6. 関連
- クレーム原文: ./000_CLAIM_REPORT.md
- 分岐先: ../fix_C20260622-002_20260622_*/
