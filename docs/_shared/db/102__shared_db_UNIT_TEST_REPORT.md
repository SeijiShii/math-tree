# 単体テストレポート: _shared/db

## 実施日時
2026-06-20 12:25 (JST)

## テスト実行環境
- Node v22.11.0 / Vitest 2.1.9 / @electric-sql/pglite（in-process Postgres）/ drizzle-orm 0.36

## テスト結果
| # | テストケース | ファイル | 結果 |
|---|---|---|---|
| N4/E1 | owner は自分の進捗のみ（他人不可視, SEC-001） | db/owner.test.ts | ✅ |
| N3 | progress 前進（locked→unlocked→mastered） | db/owner.test.ts | ✅ |
| E3 | progress 後退拒否（mastered→locked 不可） | db/owner.test.ts | ✅ |
| N5 | purgeOwnerData で owner 全削除・公開不変（SEC-004） | db/owner.test.ts | ✅ |
| E2 | getPublicUnits は verified のみ・status 非露出 | db/owner.test.ts | ✅ |
| N6 | supports stripe_session_id 一意（冪等） | db/owner.test.ts | ✅ |

## サマリー
| 項目 | 値 |
|---|---|
| 計画テスト数 | 6 |
| 追加テスト数 | 0 |
| 合計 | 6 |
| 成功 | 6 |
| 失敗 | 0 |
| 成功率 | 100% |
| typecheck | green |
