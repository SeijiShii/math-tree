# math-relax 開発シナリオ

**最終更新**: 2026-06-20 08:45
**生成元**: /flow:concept (初回) / /flow:scenario (更新)
**シナリオ種別**: 新規 MVP 立ち上げ

> 本ファイルは AI が「次に何をすべきか」を判断する際の参照ドキュメント。
> `/flow:auto` および引数空起動された各 flow コマンドが本ファイルを Read する。
> §5 現在地カーソルは flow コマンドが auto-generated 範囲で書き換える。

---

## 1. ゴール
初歩から数学をテックツリー風の知識マップで学びなおせる無料 Web サービスを MVP として立ち上げる。中学数学 1 系統の縦スライスで「テックツリー + アンロック + 豆知識 + ステップ別自己採点」の体験ループを完成させ、AI 生成 + 多段クロス検証で正確性を担保する。

## 2. 進行フェーズ
1. **Phase 1: 概念設計** — concept.md + SCENARIO.md 確定
2. **Phase 1.5: デザインシステム** — concept からデザイン SoT (`docs/design/design-system.md`) を導出 + 基盤適用（`/flow:design`、O39）
3. **Phase 2: 機能設計** — concept §1.3 優先度順に SPEC + PLAN + UNIT_TEST + E2E_TEST 生成
4. **Phase 3: 実装** — TDD で各機能を実装。画面実装後に視覚デザインレビュー（Design gate）
5. **Phase 4: 公開準備** — audit + secure(deps) + 法務書類 + PR 作成
6. **Phase 5: 公開後運用** — claim / fix / revise の循環

## 3. 各フェーズで使う flow コマンド + 完了ゲート

### Phase 1: 概念設計
- 主コマンド: `/flow:concept`（初回 NEW、完了）
- セキュア: `/flow:secure --phase=design --scope=concept`（特に [論点-001] 検証パイプラインの設計レビュー）
- 見積（1 回目）: `/flow:estimate`
- 完了ゲート: concept.md 全節 / secure Critical/High クローズ / 初回見積生成

### Phase 1.5: デザインシステム (UI あり、O39)
- 主コマンド: `/flow:design`
- 期待アーティファクト: `docs/design/design-system.md`（穏やか/学び/到達感の世界観 + トークン + コンポーネント + 数式表示 + 自作 SVG）
- 完了ゲート: design-system.md 生成 + トークンが基盤に反映

### Phase 2: 機能設計
- 主コマンド: `/flow:feature <target>`（優先度順: _shared/db → types → ui → ai → legal → auth → cost-tracking → learning-workbook → curriculum-generation → feedback → tech-tree → support → _shared/app-shell）
- 見積（2 回目）: 最初の 1 feature 完了直後に `/flow:estimate` 再キャリブレ
- 完了ゲート: 全機能の 001〜004 生成 + Critical/High 解決

### Phase 3: 実装
- 主コマンド: `/flow:tdd`
- 完了ゲート: 全機能の IMPL_REPORT + UNIT_TEST_REPORT + 全テスト通過

### Phase 4: 公開準備
- `/flow:audit` + `/flow:secure --phase=deps` + 法務書類 + PR
- 完了ゲート: PR マージ + 本番デプロイ

### Phase 5: 公開後運用（循環）
- バグ報告 → `/flow:claim` → `/flow:fix` or `/flow:revise` → `/flow:tdd` → PR

## 4. 分岐ルール
| イベント | 切替先 | 戻り先 |
|---|---|---|
| Critical/High SEC finding | `/flow:revise` or `/flow:fix` | 元 Phase |
| クレーム受領 | `/flow:claim` | 判定先 |
| 設計 drift（audit 発覚） | `/flow:revise` | 元 Phase |

## 5. 現在地カーソル

<!-- AUTO-GENERATED:BEGIN scenario-cursor -->
- 現在フェーズ: Phase 2 (機能設計) 完了 → Phase 3 (実装) 着手前
- 進行中ターゲット: 全 13 フォルダ設計済（SPEC/PLAN/UNIT_TEST/E2E）+ initial/refined 見積完了
- 最終更新セッション: D20260620_018_feature__shared_app-shell
- 最終更新時刻: 2026-06-20 10:16
- 完了フェーズ: [Phase 1 概念設計, Phase 1.5 デザイン SoT, Phase 2 機能設計(13/13)]
- 次の推奨コマンド: /flow:tdd（Phase 3 実装、優先度順 _shared/db から。先に [論点-LW1]/[論点-CG1] 確定推奨）
- 注記: Phase 3 着手前に各 feature の spec-review(P3.7) も評価対象。Design gate(b)(視覚レビュー)/wording は画面実装後
<!-- AUTO-GENERATED:END scenario-cursor -->

## 6. 変更履歴
- 2026-06-20: /flow:concept で初回生成
