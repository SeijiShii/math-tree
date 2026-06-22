# リグレッションテスト計画: ノードクリック→学習遷移 + ミニマップ

> **入力**: ./001_ROOT_CAUSE.md, ./002_FIX_PLAN.md
> **最終更新**: 2026-06-22

## 1. 再発防止テストケース

### 1.1 直接原因を捉えるテスト（TechTreeView 結合、MemoryRouter + mock fetch）
| ID | 対象 | 入力 | 期待（修正前: 失敗 / 修正後: 成功） |
|---|---|---|---|
| R1 | 解放ノードクリック | state='unlocked' の node を click | `/learn/<slug>` へ遷移（location.pathname 検証） |
| R2 | 習得ノードクリック | state='mastered' の node を click | `/learn/<slug>` へ遷移 |
| R3 | 未解放ノードクリック | state='locked' の node を click | 遷移しない（pathname 変化なし） |

### 1.2 node data 配線テスト
| ID | 対象 | 期待 |
|---|---|---|
| R4 | rfNodes.data | 各 node の data に `slug` と `canLearn`（locked=false / unlocked・mastered=true）が載る |

## 2. 類似境界条件テスト
| ID | 境界条件 | 期待 |
|---|---|---|
| R5 | slug 欠落 / 空グラフ | クリックしても例外を投げない（no-op、null セーフ） |
| R6 | romance（isRomanceNode かつ未習得） | locked 同様に遷移しない（canLearn=false） |

## 3. MiniMap テーマ
| ID | 対象 | 期待 |
|---|---|---|
| R7 | `<MiniMap>` 描画 | `maskColor` / `nodeColor` prop が指定されている（暗テーマ。スナップショット or prop アサート） |

## 4. 既存テスト維持確認
| ID | 既存テスト | 維持理由 |
|---|---|---|
| K1 | layout.test.ts（縦レイアウト 4 件） | レイアウト算出は不変 |
| K2 | nodeStyle / buildGraph テスト | 状態配色・グラフ生成は不変 |

## 5. Mock 方針
| 対象 | 固定値 | 理由 |
|---|---|---|
| `apiFetch('/api/tech-tree')` | 固定 graph（locked/unlocked/mastered/romance を各 1） | 再現性 |
| router | MemoryRouter + `/learn/:slug` ルート | 遷移先 pathname 検証 |

## 6. カバレッジ目標
- 修正コード行（onNodeClick / data 拡張 / MiniMap prop）: 100%。

## 7. 更新履歴
| 日付 | 変更 | 実行者 |
|---|---|---|
| 2026-06-22 | 初版 | /flow:fix |
