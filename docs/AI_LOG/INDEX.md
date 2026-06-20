# AI_LOG インデックス — math-relax

**最終更新**: 2026-06-20 08:45 (+09:00)
**総セッション数**: 18
**総 decision 数**: 41

> このフォルダは AI 主導の自走 / 後追いトレースを目的とする詳細ログ。
> セッションごとに 1 ファイル、append-only、過去ファイルは削除・編集禁止。
> 人間向けサマリは `../concept.md` §7 決定事項ログ を参照。

<!-- auto-generated-start -->

## セッション一覧（新しい順）

| ファイル | 実行日 | コマンド | 対象 | decision 範囲 | 状態 |
|---|---|---|---|---|---|
| [D20260620_018_feature__shared_app-shell.md](./D20260620_018_feature__shared_app-shell.md) | 2026-06-20 | /flow:feature | _shared/app-shell | D20260620-042 | 完了 |
| [D20260620_017_feature_support.md](./D20260620_017_feature_support.md) | 2026-06-20 | /flow:feature | support | D20260620-041 | 完了 |
| [D20260620_016_feature_tech-tree.md](./D20260620_016_feature_tech-tree.md) | 2026-06-20 | /flow:feature | tech-tree | D20260620-040 | 完了 |
| [D20260620_015_feature_feedback.md](./D20260620_015_feature_feedback.md) | 2026-06-20 | /flow:feature | feedback | D20260620-039 | 完了 |
| [D20260620_014_feature_curriculum-generation.md](./D20260620_014_feature_curriculum-generation.md) | 2026-06-20 | /flow:feature | curriculum-generation | D20260620-038 | 完了 |
| [D20260620_013_feature_learning-workbook.md](./D20260620_013_feature_learning-workbook.md) | 2026-06-20 | /flow:feature | learning-workbook | D20260620-037 | 完了 |
| [D20260620_012_feature__shared_cost-tracking.md](./D20260620_012_feature__shared_cost-tracking.md) | 2026-06-20 | /flow:feature | _shared/cost-tracking | D20260620-036 | 完了 |
| [D20260620_011_feature__shared_auth.md](./D20260620_011_feature__shared_auth.md) | 2026-06-20 | /flow:feature | _shared/auth | D20260620-035 | 完了 |
| [D20260620_010_feature__shared_legal.md](./D20260620_010_feature__shared_legal.md) | 2026-06-20 | /flow:feature | _shared/legal | D20260620-034 | 完了 |
| [D20260620_009_feature__shared_ai.md](./D20260620_009_feature__shared_ai.md) | 2026-06-20 | /flow:feature | _shared/ai | D20260620-033 | 完了 |
| [D20260620_008_feature__shared_ui.md](./D20260620_008_feature__shared_ui.md) | 2026-06-20 | /flow:feature | _shared/ui | D20260620-032 | 完了 |
| [D20260620_007_feature__shared_types.md](./D20260620_007_feature__shared_types.md) | 2026-06-20 | /flow:feature | _shared/types | D20260620-031 | 完了 |
| [D20260620_006_feature__shared_db.md](./D20260620_006_feature__shared_db.md) | 2026-06-20 | /flow:feature | _shared/db | D20260620-028〜029 | 完了 |
| [D20260620_005_design_system.md](./D20260620_005_design_system.md) | 2026-06-20 | /flow:design | system | D20260620-025〜026 | SoT 完了/適用 未 |
| [D20260620_004_estimate_whole.md](./D20260620_004_estimate_whole.md) | 2026-06-20 | /flow:estimate | whole | D20260620-023 | 完了 |
| [D20260620_003_secure_concept.md](./D20260620_003_secure_concept.md) | 2026-06-20 | /flow:secure | concept | D20260620-015〜021 | 完了 |
| [D20260620_002_resume_continuous.md](./D20260620_002_resume_continuous.md) | 2026-06-20 | /flow:auto | continuous | D20260620-013〜014+ | 進行中 |
| [D20260620_001_concept_initial.md](./D20260620_001_concept_initial.md) | 2026-06-20 | /flow:concept | initial | D20260620-001〜012 | 完了 |

## decision_id 索引（grep 用、新しい順）

| ID | command | phase | chosen (短縮) | type | ファイル |
|---|---|---|---|---|---|
| D20260620-008 | /flow:concept | Step 3 論点抽出 | [論点-001][論点-002] | open | D20260620_001_concept_initial.md |
| D20260620-007 | /flow:concept | Step 2 規模/NFR | 小規模 / 無料枠 $0 / 正確性最優先 | auto-recommended | D20260620_001_concept_initial.md |
| D20260620-006 | /flow:concept | Step 2 Q12.7(1) | Clerk 匿名ゲスト→段階認証 | auto-recommended | D20260620_001_concept_initial.md |
| D20260620-005 | /flow:concept | Step 2 復習 | SRS は MVP 除外 | auto-recommended | D20260620_001_concept_initial.md |
| D20260620-004 | /flow:concept | Step 2 グラフ見せ方 | 周辺フォーカス + ミニマップ | auto-recommended | D20260620_001_concept_initial.md |
| D20260620-003 | /flow:concept | Step 2 MVP 範囲 | 中学数学 1 系統の縦スライス | auto-recommended | D20260620_001_concept_initial.md |
| D20260620-002 | /flow:concept | Step 2 AI 生成方式 | AI 生成 + 多段クロス検証 | explicit-choice | D20260620_001_concept_initial.md |
| D20260620-001 | /flow:concept | Step 1.7 preferences | 標準 Neon スタック | auto-recommended | D20260620_001_concept_initial.md |

## Open 論点（chosen_type=open、全期間横断）

| ID | 論点タイトル | 採番セッション | 関連 decision |
|---|---|---|---|
| 論点-001 | AI 多段クロス検証パイプラインの具体設計 | D20260620_001 | D20260620-002 |
| 論点-002 | 数式ステップの同値判定（自己採点の照合ロジック） | D20260620_001 | D20260620-002 |
| 論点-007 | [SEC-005] レート制限 | D20260620_003 | D20260620-020 |

> [論点-003〜006] は SEC findings で `accepted-as-requirement`（§3.X 要件化済、open ではない）。

## Superseded chain（旧 Open → 新解決）

| 旧 ID | 新 ID | 解決日 | 解決セッション |
|---|---|---|---|
| (なし) | | | |

<!-- auto-generated-end -->

<!-- user-edit-start -->
<!-- user-edit-end -->
