# _shared/ui 実装計画書

> **入力**: `./001__shared_ui_SPEC.md`, `../../design/design-system.md`, `../../concept.md` §4.3
> **最終更新**: 2026-06-20

## 1. 実装対象ファイル一覧
| ファイル | 責務 | 依存 | LOC |
|---|---|---|---|
| `tailwind.config.ts` | design トークンを theme に反映 | design-system | 60 |
| `src/styles/tokens.css` | CSS 変数（カラー/余白/角丸/影） | — | 50 |
| `src/components/ui/Button.tsx` | primary/accent/ghost | tokens | 40 |
| `src/components/ui/Card.tsx` / `Chip.tsx` / `Input.tsx` / `Modal.tsx` | 基本要素 | tokens | 120 |
| `src/components/ui/InfoButton.tsx` | 「これは何？」O41 | Modal | 30 |
| `src/components/ui/Header.tsx` | モバイル横一列 O61 | tokens | 40 |
| `src/components/Katex.tsx` | 数式描画ラッパ（trust:false） | katex | 35 |
| `src/components/illustrations/*.tsx` | 自作 SVG（空状態/ヒーロー） | tokens | 80 |
| `src/lib/nodeStyle.ts` | ノード状態 → トークン配色 | types | 30 |

## 2. 実装 Phase 分割
### Phase 1: トークン基盤（tailwind config + tokens.css）
### Phase 2: 基本コンポーネント（Button/Card/Chip/Input/Modal/InfoButton/Header）
### Phase 3: Katex ラッパ + 自作 SVG + nodeStyle ユーティリティ
- ゴール: 各機能がトークン経由で UI を組める。Katex が trust:false で安全描画。

## 3. 依存関係順序
tokens → 基本コンポーネント → Katex/SVG/nodeStyle

## 4. 既存ファイルへの影響
- Vite default の素 CSS を置換。

## 5. 横断フォルダへの追加・変更
- _shared/types の状態型を参照。

## 6. リスク・注意点
- KaTeX の trust:false / strict:true を必ず設定（SEC-002）。生値直書き禁止（原則#3）。

## 7. 完了の定義（DoD）
- [ ] トークンが Tailwind/CSS に反映
- [ ] 基本コンポーネントがトークン参照
- [ ] Katex が trust:false で描画 + フォールバック
- [ ] typecheck/unit green

## 8. 更新履歴
| 2026-06-20 | 初版作成 | /flow:feature |
