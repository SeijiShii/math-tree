# 根本原因分析: ノードクリック無反応 + ミニマップ白箱

> **入力**: ./000_調査レポート.md, src/features/tech-tree/TechTreeView.tsx
> **最終更新**: 2026-06-22

## 1. 5 Whys

### (B) ノードクリックで学習画面に移らない
| # | 問い | 答え |
|---|---|---|
| Why1 | なぜクリックで遷移しないか | `TechTreeView` の `<ReactFlow>` に `onNodeClick` ハンドラが無い |
| Why2 | なぜハンドラが無いか | tdd 実装時にノード描画・状態配色・レイアウトは作ったが、選択→遷移の配線を作らなかった |
| Why3 | なぜ配線が漏れたか | SPEC §6.1 のインタラクション（選択→詳細→学ぶ）が「描画」とは別工程で、描画完了をもって「実装済み」と見なした |
| Why4 | なぜ見なせたか | unit テストが「グラフ生成・状態配色」のロジックのみで、**ユーザー操作→遷移の E2E/結合テストが無い**ため未配線が緑のまま通った |
| Why5（根本原因） | なぜテストが無かったか | **核心 write/nav 導線（クリック→学習）の到達性を検証するテストが計画に無く、O57 系の「動かない核心導線」を検知できなかった** |

### (A) ミニマップが白箱
| # | 問い | 答え |
|---|---|---|
| Why1 | なぜ白箱か | 既定 `<MiniMap>` の mask（`rgba(240,240,240,.6)` 明色）/ nodeColor がテーマ未適用 |
| Why2 | なぜ未適用か | screen スタイル適用（800ffae）で container 背景のみ上書きし、mask/nodeColor の prop 指定をしなかった |
| 根本原因 | — | MiniMap は CSS だけでは mask/node 色を制御できず **prop（maskColor/nodeColor）指定が必要**だが、その視覚レビュー観点が漏れた |

## 2. 直接原因
| ファイル | 箇所 | 問題 |
|---|---|---|
| src/features/tech-tree/TechTreeView.tsx | `<ReactFlow nodes edges fitView>` | `onNodeClick` 不在。`rfNodes.data` が `{label}` のみで `slug`/`state` を持たず遷移に必要な情報が無い |
| src/features/tech-tree/TechTreeView.tsx | `<MiniMap />` | `maskColor`/`nodeColor` prop 未指定で既定の明色のまま |

## 3. 根本原因
核心インタラクション（ノード選択→学習遷移）の**到達性テストが計画になく**、描画実装だけで「完了」扱いされ配線漏れが緑のまま出荷された（O57 core-flow-wiring）。MiniMap は prop ベースのテーマ指定が視覚レビュー観点から漏れた。

## 4. 寄与要因
| 種別 | 内容 |
|---|---|
| テスト不足 | クリック→遷移（解放/未解放分岐）の結合テストが無い |
| レビュー漏れ | 視覚レビューで MiniMap の mask/node 色を観点化していなかった |

## 5. 仮説と検証
| 仮説 | 検証 | 結果 |
|---|---|---|
| onNodeClick 未配線 | grep `onNodeClick` = 0 | ✓ 確定 |
| node data に slug 無し | `data: { label }` のみ | ✓ 確定 |
| MiniMap prop 未指定 | `<MiniMap />` 引数なし | ✓ 確定 |
