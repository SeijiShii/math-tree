# 実装レポート: tech-tree C20260622-001（ノードクリック→学習遷移 + ミニマップ）

## 実装日時
2026-06-22 (JST)

## モード
fix

## 関連ドキュメント
- 000_調査レポート.md / 001_ROOT_CAUSE.md / 002_FIX_PLAN.md / 003_REGRESSION_TEST.md / 004_POSTMORTEM.md
- 起点クレーム: ../claim_C20260622-001_20260622_node-click-minimap/001_TRIAGE.md

## 変更一覧

### Phase 1（単一・軽）: ノード選択遷移 + ミニマップテーマ
- **新規** `src/features/tech-tree/nodeNav.ts` — 純ロジック:
  - `canLearn(state)`: 解放済み（unlocked/mastered）のみ true、未解放（locked）false（SPEC §6.1）。
  - `learnTarget({slug,canLearn})`: 進める & slug あり → `/learn/<slug>`、それ以外 null（no-op）。
  - `miniMapNodeColor(canLearn)`: 解放=`#3b5bdb` / 未解放=`#9fb0d0`。`MINIMAP_MASK_COLOR`: `rgba(15,23,41,0.75)`（--bg 由来の暗マスク）。
- **新規** `src/features/tech-tree/nodeNav.test.ts` — R1-R7（6 ケース）。
- **修正** `src/features/tech-tree/TechTreeView.tsx`:
  - `useNavigate` 配線。`rfNodes.data` に `slug` + `canLearn` を追加。解放ノードは `cursor: pointer`。
  - `<ReactFlow onNodeClick>`: `learnTarget(node.data)` が非 null なら `navigate()`（解放済みのみ遷移、未解放 no-op）。
  - `<MiniMap maskColor nodeColor pannable zoomable>`: 暗マスク + 状態色で俯瞰可能に。

## 実装計画からの差分
| 項目 | 内容 |
|---|---|
| 計画にない追加 | なし |
| 計画から省略 | 豆知識詳細パネル（graph に trivia 無し、別 enhancement として送り）。claim 主訴=直接遷移は解消。 |
| 想定外の問題 | dev に backend 無くノード描画されないため、クリックの UI 検証は本番（seeded）で実施。純ロジックは unit で検証。 |

## PR Description
### タイトル
fix(tech-tree): ノード選択で学習画面へ遷移 + ミニマップ暗テーマ化（C20260622-001）
### 概要
テックツリーのノードクリックが学習画面に遷移しない / ミニマップが白箱、を修正。解放済みノード選択で `/learn/<slug>` へ遷移（未解放は無効、SPEC §6.1）、ミニマップを暗テーマ + 状態色で俯瞰可能に。
### テスト
- nodeNav 6 ケース（R1-R7）green。全体 119 passed / typecheck / build green。
