# プロダクトドキュメントマップ (math-relax)

**最終更新**: 2026-06-20 08:45 (+09:00)
**最新コマンド**: /flow:concept — D20260620_001_concept_initial
**統計**: 機能フォルダ 5 / 横断フォルダ 8 / 改修件数 0 / バグ修正件数 0 / クレーム判定件数 0 / Open 論点 2 件

> **このファイルは AI 用エントリポイント**。
> 目的別に「どこから読めばいいか」「次に何を Read すべきか」を示す。詳細は各 INDEX / 各ファイルを参照。

<!-- auto-generated-start -->

## 0. AI 用クイックアクセス（目的別）

| 目的 | 最初に Read | 次に Read | 注記 |
|---|---|---|---|
| プロダクト全体を理解する | `./concept.md` (§1, §1.3, §4.2) | `./INDEX.md` | 5 分で全体像 |
| 次に何をすべきか判断する | `./SCENARIO.md` (§5 現在地カーソル) | `./AI_LOG/INDEX.md` | `/flow:auto` 起動 |
| 特定機能を理解する | `./<feature>/README.md` | `./<feature>/INDEX.md` | feature 一覧は §2 |
| 設計判断の経緯を辿る | `./AI_LOG/INDEX.md` | 該当セッションファイル | decision_id 索引で grep |
| 未決論点を見る | `./concept.md §8` | `./AI_LOG/INDEX.md` Open 論点 | [論点-001] 検証パイプライン / [論点-002] 数式同値判定 |
| 実装前の準備物を知る | `./PREREQUISITES.md` | — | API キー / アカウント / 法務 |
| 工数感を知る | `./estimates/` | 機能別 estimate | `/flow:estimate` で生成 |
| 法務書類対応状況 | `./concept.md §9` | `./_shared/legal/README.md` | 公開 PJ、プラポリ必須 |

## 1. プロダクト全体
- **概念設計 (SoT)**: [./concept.md](./concept.md)
  - 一行で言うと: 初歩から数学をテックツリー風の知識マップで学びなおせる無料 Web サービス（AI 生成 + 多段検証）
  - 現フェーズ: 企画（concept 確定）
  - 最終更新: 2026-06-20
- **プロジェクト INDEX (フラット一覧)**: [./INDEX.md](./INDEX.md)
- **実装前準備**: [./PREREQUISITES.md](./PREREQUISITES.md)
- **見積もり**: [./estimates/](./estimates/)

## 2. 機能フォルダ（業務ドメイン）
| 優先度 | 基盤 | フォルダ | 状態 | INDEX |
|---|---|---|---|---|
| 3 | ✅ | learning-workbook | 設計待ち | [INDEX](./learning-workbook/INDEX.md) |
| 3 | ❌ | curriculum-generation | 設計待ち | [INDEX](./curriculum-generation/INDEX.md) |
| 3 | ❌ | feedback | 設計待ち | [INDEX](./feedback/INDEX.md) |
| 4 | ✅ | tech-tree | 設計待ち | [INDEX](./tech-tree/INDEX.md) |
| 4 | ❌ | support | 設計待ち | [INDEX](./support/INDEX.md) |

## 3. 横断フォルダ（_shared/*）
| 優先度 | フォルダ | 状態 | INDEX |
|---|---|---|---|
| 1 | _shared/db | 設計待ち | [INDEX](./_shared/db/INDEX.md) |
| 1 | _shared/types | 設計待ち | [INDEX](./_shared/types/INDEX.md) |
| 1 | _shared/ui | 設計待ち | [INDEX](./_shared/ui/INDEX.md) |
| 1 | _shared/ai | 設計待ち | [INDEX](./_shared/ai/INDEX.md) |
| 1 | _shared/legal | 設計待ち | [INDEX](./_shared/legal/INDEX.md) |
| 2 | _shared/auth | 設計待ち | [INDEX](./_shared/auth/INDEX.md) |
| 2 | _shared/cost-tracking | 設計待ち | [INDEX](./_shared/cost-tracking/INDEX.md) |
| 最後 | _shared/app-shell | 設計待ち | [INDEX](./_shared/app-shell/INDEX.md) |

## 4. 設計判断の経緯
- **AI_LOG インデックス**: [./AI_LOG/INDEX.md](./AI_LOG/INDEX.md)
- **最新セッション**: D20260620_001_concept_initial（完了、D20260620-001〜008）
- **Open 論点**: 2 件（concept §8 と同期）
- **Superseded chain**: 0 件

## 5. 観点・選好データ（PJ 外部参照）
- **観点 SoT**: `~/.claude/flow-data/perspectives.md`
- **開発者選好**: `~/.claude/flow-data/preferences.md`（学習元 11 PJ、強い選好 = Neon スタック）

## 6. ファイル種別ガイド（番号体系）
| 種別 | 番号 / パターン | 生成元 |
|---|---|---|
| 機能 SPEC | `001_*_SPEC.md` | `/flow:feature` |
| 機能 PLAN | `002_*_PLAN.md` | `/flow:feature` |
| 単体テスト計画 | `003_*_UNIT_TEST.md` | `/flow:feature` |
| E2E テスト計画 | `004_*_E2E_TEST.md` | `/flow:feature` |
| AI_LOG セッション | `D<date>_<sess>_<cmd>_<target>.md` | 各 flow コマンド |
| 見積もり | `estimates/*.md` | `/flow:estimate` |

## 7. 依存・優先度グラフ（concept §1.3.4 から導出）
```
_shared/db (優先度1, 基盤 ✅)
_shared/types (優先度1, 基盤 ✅)
_shared/ui (優先度1, 基盤 ✅)
_shared/ai (優先度1, 基盤 ✅)
_shared/legal (優先度1, 基盤 ✅)
_shared/auth (優先度2) ← db
_shared/cost-tracking (優先度2) ← db, ai
learning-workbook (優先度3) ← db, types, ui
curriculum-generation (優先度3) ← ai, db, types, cost-tracking
feedback (優先度3) ← db
tech-tree (優先度4) ← db, types, ui, learning-workbook
support (優先度4) ← auth, db, cost-tracking
_shared/app-shell (最後) ← 全 feature + 全 _shared
```
循環依存: なし

## 8. コマンド使い分けガイド
| やりたいこと | コマンド | 主要出力 |
|---|---|---|
| 概念設計の更新 | `/flow:concept` | `./concept.md` + 各 INDEX + AI_LOG |
| 新規機能を設計 | `/flow:feature <feature>` | `001_SPEC` 〜 `004_E2E_TEST` |
| 工数見積もり | `/flow:estimate` | estimate ファイル |
| デザインシステム | `/flow:design` | `docs/design/design-system.md` |

## 9. 履歴サマリ
- **改修件数 (累計)**: 0 件
- **バグ修正件数 (累計)**: 0 件
- **クレーム判定件数 (累計)**: 0 件

<!-- auto-generated-end -->

<!-- user-edit-start -->
<!-- user-edit-end -->
