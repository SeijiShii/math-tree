# _shared/db ドキュメントインデックス

**最終更新**: 2026-06-20 08:45
**生成元**: /flow:concept (初期化)

<!-- auto-generated-start -->

## 機能概要 (短縮、詳細は README.md)
DB スキーマ・マイグレーション（Neon + Drizzle）

## ファイル一覧（番号順）
| 番号 | ファイル | 種別 | 状態 | 最終更新 | 短い説明 |
|---|---|---|---|---|---|
| 001 | 001__shared_db_SPEC.md | SPEC | 設計済 | 2026-06-20 | 9 テーブル + owner scoping/purge インターフェース |
| 002 | 002__shared_db_PLAN.md | PLAN | 設計済 | 2026-06-20 | schema → client → owner ヘルパ → migration の 3 Phase |
| 003 | 003__shared_db_UNIT_TEST.md | UNIT_TEST | 設計済 | 2026-06-20 | owner 分離(SEC-001)/purge(SEC-004) 含む |
| 004 | (E2E スキップ) | — | n/a | — | cross-cutting、統合テストは feature 側 E2E でカバー |

## サブフォルダ（改修・バグ修正・クレーム判定履歴）
| パス | 種別 | issue/slug | 状態 | 概要 | INDEX |
|---|---|---|---|---|---|
| (なし) |

## 関連
- 親 concept: `../../concept.md` §1.3.2
- 実装コード: §1.4 参照（db/ + src/）

## 機能性質タグ
- cross-cutting, auth-required（owner scoping）

<!-- auto-generated-end -->

<!-- user-edit-start -->
<!-- user-edit-end -->
