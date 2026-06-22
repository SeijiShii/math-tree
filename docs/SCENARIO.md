# Math-Tree 開発シナリオ

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
- 現在フェーズ: Phase 4 完了 → Phase 5 (公開後運用) — ゲスト専用 MVP「完成」（独自サブドメイン live + 全スモーク green）
- 進行中ターゲット: P4.8 Promote（告知文生成）→ 公開後運用（claim/fix/revise 循環）
- 最終更新セッション: D20260622_046_release_math-tree（favicon 再デプロイ + サブドメイン live 確認）
- 最終更新時刻: 2026-06-22
- 完了フェーズ: [Phase 1, Phase 1.5 design SoT, Phase 2 機能設計, Phase 3 実装, O22(B+E)連携UI revise, Wording, full audit, standard audit(fresh), O56 favicon, Phase 4 本番デプロイ + 独自サブドメイン live]
- 公開 URL: https://math-tree.givers.work（canonical、DNS 伝播済・配信中。raw fallback = math-tree-psi.vercel.app）
- リポジトリ: https://github.com/SeijiShii/math-tree（public）
- 配線済キー: DATABASE_URL + GUEST_TOKEN_SECRET（core 稼働）。空: Clerk(連携=準備中) / Anthropic(AI採点=CASで充足) / Stripe(tip-jar=VITE_ENABLE_TIPJAR で非表示)
- post-deploy スモーク green（2026-06-22、canonical subdomain）: frontend 200 / favicon.svg 200 / manifest 200 / guest 認証 201 / 保護API 401→200
- 次の推奨: ① P4.8 Promote（告知文生成 note/X/FB、URL=math-tree.givers.work）② [将来] Stripe live + 特商法で tip-jar 有効化（現状 VITE_ENABLE_TIPJAR 非表示でスコープ外）③ 公開後運用（claim/fix/revise）
- 2026-06-22 監査+リリース: standard audit fresh（C/H 0）→ O56 favicon 配線+本番反映済 → 独自サブドメイン math-tree.givers.work live 確認（DNS 既設定）。O64 Stripe webhook は tip-jar と共に deferred
- 2026-06-22 claim C20260622-001（本番）: テックツリーのノードクリック無反応 + ミニマップ白箱 → fix 完了・本番反映済（入口ノード unlocked 化 + onNodeClick→/learn 配線 + MiniMap 暗テーマ、127 tests green、本番でクリック→/learn 遷移を実検証）
- 2026-06-22 claim C20260622-002（本番）: MathLive 数式フォントが /assets/fonts で 404 → fix 完了・本番反映済（フォントを public/mathlive/fonts に同梱 + fontsDirectory='/mathlive/fonts' 固定、128 tests green、本番で woff2 200 + font 読込失敗ゼロを実検証）
- 2026-06-22 UI: マップ右下のミニマップ（現在地インジケータ）をユーザー要望で削除（本番反映済、Controls=ズームは維持）
- 2026-06-22 claim C20260622-003（本番）: 学習画面で問題が表示されない → fix 完了・本番反映済（問題取得 API /api/problem[模範解答非含 SEC-002] + WorkbookView に単元名/問題文/豆知識/手がかり表示、132 tests green、本番 /learn で問題文 (-3)+5・豆知識の表示を実検証）
- 2026-06-22 claim C20260622-004（本番）: 入力欄が分かりづらい + 途中式（=）が採点されない → fix 完了・本番反映済（gradeProcess で『計算の途中経過を=で繋いだ式』を採点[-3+5=2 / 複数チェーン]、入力欄を design-system §5 でテーマ化、142 tests green、本番 /api/grade-step で -3+5=2→正解/-3+5=3→不正解 を実検証）
- 2026-06-22 CI: GitHub Actions ci.yml の npm ci が vitest/coverage-v8 peer 競合(ERESOLVE)で失敗し続けていた → .npmrc(legacy-peer-deps=true) で解消、CI run success(53s) を確認。ci.yml は GitHub テストのみで Vercel 非接続（CLI デプロイ運用維持）
- 2026-06-22 claim C20260622-005（本番）: 正解後に次へ進む UI がない → fix 完了・本番反映済（SPEC §2.2 習得 endpoint POST /api/master を実装[masterUnitBySlug, 関数9/12] + WorkbookView 完了パネル＋テックツリーへ戻る導線、146 tests green、本番で 習得→2単元目 moji-shiki が unlocked になることを実検証 = 解く→習得→アンロックの学習ループが閉じた）
- 2026-06-22 Design gate: 視覚デザインレビュー green（headless playwright で全画面スクショ → screen/layout スタイル適用 + 逸脱 2 件修正: 絵文字→SVG / React Flow 暗テーマ化）。dead-class（CSS 未適用）を是正 → **本番反映済**（math-tree.givers.work で styled tech-tree + 実データ配信を視覚確認）
- 注記: E2E(P4.5) は browser tooling での網羅自動テスト未整備（release post-deploy スモークで主要導線 green）。AI 採点は ANTHROPIC_API_KEY 注入時に有効化（現状 CAS で充足）
<!-- AUTO-GENERATED:END scenario-cursor -->

## 6. 変更履歴
- 2026-06-20: /flow:concept で初回生成
