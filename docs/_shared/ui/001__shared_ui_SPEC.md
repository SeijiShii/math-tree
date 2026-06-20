# _shared/ui 仕様書（横断: デザイン基盤）

> **役割**: design-system.md（SoT）のトークン・コンポーネントをスタイル基盤（Tailwind theme / CSS 変数 + shadcn/ui）に落とし、数式描画（KaTeX）ラッパと自作 SVG を提供する共通 UI 基盤。
> **タグ**: cross-cutting
> **最終更新**: 2026-06-20
> **入力**: `../../concept.md`（§4.3）, `../../design/design-system.md`, `./README.md`

---

## 1. 提供インターフェース（UI 基盤）
- **デザイントークン**: design-system.md §2-4 のカラー/タイポ/形/影/余白を CSS 変数 + Tailwind theme に反映。
- **基本コンポーネント**: Button(primary/accent/ghost) / Card / Chip(状態タグ) / Input / Modal / InfoButton(「これは何？」O41) / Header(モバイル横一列 O61)。すべてトークン参照（生値直書き禁止、原則#3）。
- **数式描画ラッパ**: `<Katex latex=... />`（`trust:false, strict:true`、SEC-002）。
- **自作 SVG イラスト**: 空状態（まだ育っていないツリー）/ ヒーロー（育つテックツリー）、テーマ色追従。
- **ノード状態スタイルユーティリティ**: 習得/解放/未解放/ロマンノードの配色（design-system §2.1）をトークン化し tech-tree が参照。

## 2. 入出力
- React コンポーネント + Tailwind preset。副作用なし（描画のみ）。KaTeX は CSS 同梱。

## 3. データモデル
- なし（型は _shared/types の TechTreeNode 状態を参照）。

## 4. バリデーション + エラーケース
- Katex ラッパは不正 LaTeX 時にエラー境界で「式を表示できません」を出す（throwOnError:false + フォールバック）。SEC-002: trust:false で任意コマンド実行を防ぐ。

## 5. 機能固有 NFR + 既存連携
### 5.1 NFR
- 全コンポーネントがトークン参照（token-conformance、design Step4 #2.6）。KaTeX 描画は軽量・高速（§3 NFR 数式可読性）。
### 5.2 連携
- 依存: _shared/types（状態型）, design-system.md（SoT）。被依存: 全 UI 機能。

## 6. タグ別追加項目
- なし。

## 7. スコープ外
- ブランドマーク scaffold（favicon 一式）は design 適用フェーズ（画面実装後）で実施。

## 8. 未決事項
- 現時点で論点なし（2026-06-20）。

## 9. 更新履歴
| 日付 | 変更概要 | 実行者 |
| 2026-06-20 | 初版作成 | /flow:feature |
