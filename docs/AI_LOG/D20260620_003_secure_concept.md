# AI_LOG セッション D20260620_003 — /flow:secure (concept)

**実行日時**: 2026-06-20 08:55 (+09:00)
**コマンド**: /flow:secure --phase=design --scope=concept（/flow:auto 反復1 から dispatch）
**対象**: プロダクト全体（concept 設計レベル L1 レビュー）
**実行者**: Claude (Opus 4.8) + seiji
**状態**: 完了
**含まれる decision**: D20260620-015 〜 D20260620-021
**ファイル**: `D20260620_003_secure_concept.md`

---

## 主要決定サマリ

| ID | SEC | 観点 | severity | route |
|---|---|---|---|---|
| D20260620-016 | SEC-001 | O23 認可 | High | accepted-as-requirement |
| D20260620-017 | SEC-002 | O24 入力検証 | High | accepted-as-requirement |
| D20260620-018 | SEC-003 | O26 PII ログ(法令) | High | accepted-as-requirement |
| D20260620-019 | SEC-004 | O54 DSR 履行(法令) | High | accepted-as-requirement |
| D20260620-020 | SEC-005 | O27 レート制限 | Medium | open |
| D20260620-021 | SEC-006 | O25 秘密情報 | Info | 対応済(注記) |

## 生成・更新したアーティファクト
- 新規: `docs/SECURITY_REVIEW_20260620.md`（L1 レポート）
- 更新: `docs/concept.md` §3.X セキュリティ要件（auto-added）+ §8 [論点-003〜007]

## 学習・改善
- O54 DSR-feasibility ペア検査（ゲスト認証 × 法務 DSR 約束）を concept 段階で照合 = §9.1 既記載と整合。

---

## Decisions

```yaml
- id: D20260620-015
  timestamp: 2026-06-20T08:55:00+09:00
  command: /flow:secure
  phase: Step 1 / PJ 性質判定
  question: PJ 性質 7 軸
  options: []
  recommended: null
  chosen: 複数ユーザー / 公開 / 無償(+tip-jar) / 個人情報扱いあり(最小・匿名中心) / AI 利用あり / 主に国内
  chosen_type: auto-recommended
  depends_on: []
  context: concept §1.2 / preferences から確定。観点フィルタ: O23/O24/O25/O26/O27/O54 が require 該当（O28 は --phase=deps 対象外）。

- id: D20260620-016
  timestamp: 2026-06-20T08:56:00+09:00
  command: /flow:secure
  phase: Step 2.2 / L1 SEC-001
  question: O23 認可漏れ（所有者チェック）
  options: [accepted-as-requirement (recommended)]
  recommended: accepted-as-requirement
  chosen: accepted-as-requirement（concept §3.X 要件化 + §8 [論点-003]）
  chosen_type: auto-recommended
  depends_on: [D20260620-015]
  context: 複数ユーザー PJ だが progress/support/feedback の所有者チェック未明示。High。--scope=concept のため accepted-as-requirement 自動 route。

- id: D20260620-017
  timestamp: 2026-06-20T08:56:30+09:00
  command: /flow:secure
  phase: Step 2.2 / L1 SEC-002
  question: O24 入力検証（XSS/sanitize）
  options: [accepted-as-requirement (recommended)]
  recommended: accepted-as-requirement
  chosen: accepted-as-requirement（concept §3.X + §8 [論点-004]）
  chosen_type: auto-recommended
  depends_on: [D20260620-015]
  context: MathLive/LaTeX・feedback 自由記述・AI 生成表示の sanitize/入力スキーマ未明示。KaTeX trust:false 必須。High。

- id: D20260620-018
  timestamp: 2026-06-20T08:57:00+09:00
  command: /flow:secure
  phase: Step 2.2 / L1 SEC-003
  question: O26 PII ログ漏洩（法令必須）
  options: [accepted-as-requirement (recommended)]
  recommended: accepted-as-requirement
  chosen: accepted-as-requirement（concept §3.X + §8 [論点-005]）
  chosen_type: auto-recommended
  depends_on: [D20260620-015]
  context: feedback PII scrub は明示だが Sentry beforeSend マスク未明示=部分対応。legal_required → High。

- id: D20260620-019
  timestamp: 2026-06-20T08:57:30+09:00
  command: /flow:secure
  phase: Step 2.1 / L1 SEC-004（O22×O12/O14 DSR-feasibility ペア検査）
  question: O54 DSR 履行可能性（ゲスト認証 × 法務 DSR 約束）
  options: [accepted-as-requirement (recommended)]
  recommended: accepted-as-requirement
  chosen: accepted-as-requirement（concept §3.X + §8 [論点-006]）
  chosen_type: auto-recommended
  depends_on: [D20260620-015, D20260620-006]
  context: |
    O22 ゲスト認証採用 + §9.1 で DSR 約束。§9.1 はセルフサービス削除を既に明記済み（設計対応済）だが、
    in-app 実削除 + 全ストア cascade purge の実装担保が未確定。legal_required → High。
    運用者 identify/delete ツールは作らない（匿名で incoherent）を要件に明記。

- id: D20260620-020
  timestamp: 2026-06-20T08:58:00+09:00
  command: /flow:secure
  phase: Step 2.2 / L1 SEC-005
  question: O27 レート制限
  options: [open (Medium 登録のみ)]
  recommended: open
  chosen: open（§8 [論点-007]、feature 設計時に再評価）
  chosen_type: auto-recommended
  depends_on: [D20260620-015]
  context: AI コスト爆発は事前生成+キャッシュで緩和済み（公開から直接 Claude を叩かない）。一般書き込み API のレート制限は未設計 → Medium（部分対応で1段階下げ）。

- id: D20260620-021
  timestamp: 2026-06-20T08:58:30+09:00
  command: /flow:secure
  phase: Step 2.2 / L1 SEC-006
  question: O25 秘密情報管理
  options: []
  recommended: null
  chosen: 対応済み（注記のみ）
  chosen_type: auto-recommended
  depends_on: [D20260620-015]
  context: §4.5.3/§10.7/.gitignore で対応済。VITE_* にシークレットを置かない注意のみ Info 記載。
```
