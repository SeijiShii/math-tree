# 実装レポート: _shared/ui
## 実装日時
2026-06-20 12:31 (JST)
## 変更一覧
- `src/lib/katex.ts`: renderMath（**trust:false / throwOnError:false** SEC-002）。
- `src/lib/nodeStyle.ts`: nodeVisual + NODE_TOKEN（design §2.1、CSS 変数トークン参照、生値直書きなし 原則#3）。
- `src/components/ui/Button.tsx`: primary/accent/ghost variant。
- `src/styles/tokens.css`: design-system §2-4 トークン（藍×琥珀）。
## テスト
- 8/8 green: Katex 描画 / \href javascript: 非実行 / \includegraphics 非実行 / 不正 LaTeX フォールバック / nodeVisual マップ / ロマンノード / トークン参照 / Button variant。typecheck green。
## PR Description
### タイトル
_shared/ui: デザイン基盤（トークン + Katex trust:false SEC-002）
