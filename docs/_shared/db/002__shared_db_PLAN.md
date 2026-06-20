# _shared/db 実装計画書

> **入力**: `./001__shared_db_SPEC.md`, `../../concept.md` §1.4 / §4.3
> **最終更新**: 2026-06-20

---

## 1. 実装対象ファイル一覧（db/ + src/）

| ファイル | 責務 | 依存 | LOC 見積 |
|---|---|---|---|
| `db/schema/units.ts` | units / unit_edges Drizzle 定義 | drizzle-orm/pg | 70 |
| `db/schema/problems.ts` | problems / steps | units | 60 |
| `db/schema/progress.ts` | progress（owner-scoped） | units | 40 |
| `db/schema/support.ts` | supports | — | 30 |
| `db/schema/feedback.ts` | feedback | — | 35 |
| `db/schema/ops.ts` | ai_call_logs / reviews | — | 60 |
| `db/schema/index.ts` | 集約 export + enums | 上記 | 30 |
| `db/client.ts` | Neon クライアント（serverless driver） | @neondatabase/serverless | 25 |
| `db/owner.ts` | `withOwner` / `requireOwner` / `purgeOwnerData`（SEC-001/004） | client, schema | 90 |
| `drizzle.config.ts` | drizzle-kit 設定（dev branch） | — | 20 |
| `db/migrations/*` | 生成マイグレーション | — | 自動生成 |

## 2. 実装 Phase 分割（/flow:tdd 連携）

### Phase 1 (RED→GREEN→IMPROVE): スキーマ定義 + クライアント
- units/edges/problems/steps/progress/supports/feedback/ops の Drizzle 定義 + enums
- Neon クライアント（serverless）
- ゴール: `drizzle-kit generate` でマイグレーション生成、型が引ける

### Phase 2: owner scoping ヘルパ（SEC-001/004）
- `withOwner(ownerId)` で owner-scoped クエリビルダ（progress/supports/feedback を owner_id フィルタ強制）
- `requireOwner(ctx)` で Clerk セッションから owner 解決
- `purgeOwnerData(ownerId)` で owner 全データ cascade 削除
- ゴール: owner 分離テスト green、他人データ 0 件、purge で全削除

### Phase 3: マイグレーション検証
- Neon dev branch にマイグレーション適用、ロールバック確認

## 3. 依存関係順序
```
schema 定義 → client → owner ヘルパ → migration 生成/検証
```

## 4. 既存ファイルへの影響
- なし（新規基盤）。後続の _shared/auth が `requireOwner` を、cost-tracking が `ai_call_logs` を利用。

## 5. 横断フォルダへの追加・変更
- 本フォルダが起点。`db/owner.ts` は _shared/auth と協調（auth が Clerk セッション → ownerId、db が scoping）。

## 6. リスク・注意点
- owner scoping を型レベルで強制しないと SEC-001 が漏れる → owner-scoped テーブルは raw query 禁止、`withOwner` 経由のみを lint/レビューで担保。
- Neon serverless driver はエッジ/Functions 文脈でコネクション管理に注意。

## 7. 完了の定義（DoD）
- [ ] 全スキーマ定義 + マイグレーション生成
- [ ] owner 分離 + purge のユニットテスト green
- [ ] Neon dev branch で migration 適用確認
- [ ] typecheck green

## 8. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-20 | 初版作成 | /flow:feature |
