# 実装レポート: _shared/db

## 実装日時
2026-06-20 12:25 (JST)

## モード
feature (cross-cutting)

## 関連ドキュメント
- 001__shared_db_SPEC.md / 002__shared_db_PLAN.md / 003__shared_db_UNIT_TEST.md
- AI_LOG: ../AI_LOG/D20260620_020_tdd__shared_db.md

## 変更一覧
### Phase 1: スキーマ定義 + クライアント
- `db/schema.ts`: 9 テーブル（units/unit_edges/problems/steps/progress/supports/feedback/ai_call_logs/reviews）を Drizzle pg-core で定義。owner-scoped テーブルに owner_id、progress に unique(owner_id,unit_id)、supports に unique(stripe_session_id)。
- `db/ddl.ts`: テスト/初期化用 DDL（schema をミラー、PGlite 用）。
- `db/client.ts`: Neon serverless クライアント（本番）。

### Phase 2: owner scoping ヘルパ（SEC-001/004）
- `db/owner.ts`: `getOwnerProgress`（owner 分離 SEC-001）/ `advanceProgress`（前進のみ）/ `purgeOwnerData`（DSR cascade 削除 SEC-004）/ `getPublicUnits`（verified のみ + verification_status 非露出）。
- Db 非依存（任意 drizzle インスタンス）= Neon 本番 / PGlite テスト両対応（可逆性 O35）。

### Phase 3: マイグレーション検証
- PGlite（in-process Postgres）でスキーマ適用 + 全制約を検証（実 DB 不要・オフライン green）。

## 実装計画からの差分
| 項目 | 内容 |
|---|---|
| 追加 | テスト DB に PGlite を採用（Neon dev branch の代わり、オフライン green）。owner.ts を Db 非依存化して本番/テスト両対応。 |
| 省略 | drizzle-kit migration ファイル生成は Phase 3.5（app-shell bootstrap）に後ろ倒し（DDL で代替検証済）。 |

## PR Description
### タイトル
_shared/db: DB スキーマ + owner scoping/DSR purge 実装
### 概要
Math-Tree の DB 基盤。9 テーブル + owner 分離(SEC-001)/DSR セルフ削除(SEC-004)/verified-only 配信を実装し PGlite で検証。
### テスト
- 6/6 green（owner 分離 / 前進のみ / 後退拒否 / DSR purge / verified-only / supports 冪等）。
