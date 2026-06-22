# 単体テストレポート: tech-tree C20260622-001

## 実施日時
2026-06-22 (JST)

## テスト実行環境
- Vitest（node env、純ロジック）

## テスト結果
| # | テストケース | ファイル | 結果 |
|---|---|---|---|
| R4 | canLearn: 解放=true / 未解放=false | nodeNav.test.ts | ✅ |
| R1/R2 | 解放ノード → /learn/<slug> | nodeNav.test.ts | ✅ |
| R3 | 未解放ノード → null（無効） | nodeNav.test.ts | ✅ |
| R5 | slug 欠落・空 → null（null セーフ） | nodeNav.test.ts | ✅ |
| R6 | romance 未習得（canLearn=false）→ 遷移しない | nodeNav.test.ts | ✅ |
| R7 | MiniMap 暗マスク + 状態色 | nodeNav.test.ts | ✅ |

## 追加テストケース
上記 R1-R7 が本 fix の追加分（6 件）。

## サマリー
| 項目 | 値 |
|---|---|
| 追加テスト | 6 件 |
| 合計（全体） | 119 件 |
| 成功 | 119 件 |
| 失敗 | 0 件 |
| 成功率 | 100% |

## 補足（UI 結合の検証方針）
ReactFlow の onNodeClick→navigate の UI 結合は jsdom（ResizeObserver 無し）で flaky なため、遷移ロジックを純関数 `learnTarget` に抽出して unit 検証。実 UI のクリック遷移は本番（seeded データ）の post-deploy 手動確認で担保（R1-R3 のエンドツーエンド）。
