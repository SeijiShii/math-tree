# クレーム判定レポート

**claim id**: C20260622-001
**判定日**: 2026-06-22
**判定者**: Claude (Opus 4.8) + seiji
**判定**: **バグ (fix)**

## 1. 三項照合

### 1.1 期待 (Expected)
- (A) ミニマップにテックツリー全体の俯瞰が見える。
- (B) ノード選択 → 詳細（豆知識）→ 解放済みなら学習画面（learning-workbook）へ。

### 1.2 既存仕様 (Spec)
- **concept §1.1 UC#1**: 「ミニマップ/ズームアウトで全体像と遠くのロマンノードも見える」。
- **concept §1.1 UC#3**: 「単元を選ぶ — グラフ上のノードを選ぶと、その単元の学習に入る」。
- **docs/tech-tree/001_tech-tree_SPEC.md §6.1**:
  - 「現在地周辺にフォーカス、別途**ミニマップで全体 + 遠くのロマンノード表示**」
  - 「**ノード選択 → 詳細パネル（豆知識=実世界の使われ方）→ 解放済みなら「学ぶ」で learning-workbook へ**」
  - 「**未解放ノードの学習導線 | 無効化**（前提未習得は入れない）」
- → 期待 (A)(B) はともに SPEC に明記されている。

### 1.3 現実 (Actual)
- (B) ノードクリック: `src/features/tech-tree/TechTreeView.tsx` の `<ReactFlow nodes edges fitView>` に **`onNodeClick` ハンドラが存在しない**（`grep onNodeClick|navigate|onClick` = 0 件）。`rfNodes` の `data` も `{ label }` のみで `slug` を持たず、クリック→`/learn/:slug` 遷移が一切配線されていない。詳細パネル（豆知識）UI も未実装。
  - 補足: ノードデータ源 `src/types/graph.ts` の `TechTreeNode` は `slug` を持つ（`/learn/:slug` への遷移は技術的に可能）。`WorkbookView` は `useParams().slug` を読む（受け口は在る）。
- (A) ミニマップ: 既定の React Flow `<MiniMap>` をそのまま使用。`screens.css` で `.react-flow__minimap` の背景のみ surface に上書きしたが、**mask（既定 `rgba(240,240,240,.6)` の明色）/ nodeColor が未テーマ化**のため、暗背景上で「白い箱」に見え俯瞰が判別できない。モバイル幅では占有も大きい。

### 1.4 照合結果
- (A)(B) ともに **期待 = SPEC 記載 ≠ 現実** → **バグ (fix)**。
  - (B) は核心 UC の導線がコードに存在しない実装漏れ（O57 系の「部品は在るが配線が無い」）。
  - (A) はミニマップが SPEC の「全体俯瞰」を満たさない視覚不具合（テーマ未適用）。

## 2. 判定根拠
1. 期待挙動はいずれも concept §1.1 と tech-tree SPEC §6.1 に**明文化**されており、解釈の余地はない（仕様検討漏れ=revise ではない）。
2. 現実は SPEC と乖離（ノード選択ハンドラ不在 / ミニマップ未テーマ化）= 実装の漏れ・欠陥であり、新規 SPEC を要しない（feature ではない）。
3. よって両事象とも **バグ (fix)**。同一画面（TechTreeView）・同一原因群（配線/テーマの実装漏れ）のため 1 つの fix で扱う。
4. severity = **high**: (B) は MVP の核心体験ループの起点が動かず、学習を開始できない。

## 3. 推奨分岐先
- **コマンド**: `/flow:fix`
- **引数**: `tech-tree C20260622-001 --severity=high --from-claim=C20260622-001`
- **修正の方向（fix で詳細化）**:
  - (B) `TechTreeView` に `onNodeClick` を配線 → ノード選択で詳細パネル（豆知識）表示 → **解放済みノードのみ**「学ぶ」で `/learn/<node.slug>` へ遷移（未解放は導線無効、SPEC §6.1）。`rfNodes.data` に `slug`/`state`/`trivia` を載せる。
  - (A) `<MiniMap>` を暗テーマ化（`maskColor` を暗色、`nodeColor` を状態色トークン）か、モバイルで非表示にして俯瞰を判別可能にする。
  - リグレッションテスト: ノードクリック→遷移（解放/未解放の分岐）、ミニマップのテーマ適用。

## 4. 却下時の対応
（該当なし＝バグ判定）

## 5. 判定保留時の論点
（該当なし）

## 6. 関連
- クレーム原文: `./000_CLAIM_REPORT.md`
- 基準 SPEC: `../001_tech-tree_SPEC.md`（§6.1）
- 分岐先サブフォルダ: `../fix_C20260622-001_20260622_*/`（Step 6 で作成）
