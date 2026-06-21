# AI_LOG セッション D20260621_039 — /flow:revise _shared/auth 001
**実行日時**: 2026-06-21 (+09:00)
**コマンド**: /flow:revise _shared/auth（連携/サインアウト UI 動線追加）
**対象機能+issue**: _shared/auth / 001 auth-ui-signin-signout
**実行者**: Claude (Opus 4.8) + seiji
**状態**: 完了（設計 4 文書生成 → tdd へ）
**含まれる decision**: D20260621-079 〜 D20260621-082
**依存**: [D20260620-068/069（feature _shared/auth guest-JWT 実装）], [D20260621-077（O22 連携UI を MVP 実装へ）], AUDIT_20260621_1813（O22(B+E) High）

## 主要決定サマリ
| decision | 内容 |
|---|---|
| D20260621-079 | 改修要望: O22(B+E) 連携/サインアウト UI 欠落、MVP 実装（ユーザー明示）|
| D20260621-080 | Read スコープ: account.ts/client.ts/api/auth.ts/main.tsx/AccountView.tsx |
| D20260621-081 | 改修固有 5 項目（auto-pick）: 互換維持/一括+seam/全維持+追加/コード revert/migration 不要 |
| D20260621-082 | 設計確定 + tdd へ自動進行 |

## Decisions
```yaml
- id: D20260621-079
  command: /flow:revise
  phase: Step 1.2 / 改修要望取得
  question: 改修要望の確定
  chosen: O22(B+E) 連携/サインアウト UI 動線を MVP 追加（backend linkGuestToAccount 実装済・UI 欠落）
  chosen_type: explicit-choice
  depends_on: [D20260621-077]
  context: |
    audit 2026-06-21 が O22(B+E) High 検出。ユーザーが「サインイン/連携/サインアウト 含める」と明示。
    feature ではなく revise（_shared/auth SPEC が linkGuestToAccount を契約済、UI 層改修）と判定。

- id: D20260621-080
  command: /flow:revise
  phase: Step 2.2 / Read スコープ
  question: 既存実装の Read 範囲
  chosen: src/lib/auth/account.ts, src/lib/api/client.ts, api/auth.ts, src/main.tsx, src/features/account/AccountView.tsx
  chosen_type: auto-recommended
  context: |
    連携 backend（linkGuestToAccount + api/auth?action=link）+ フロント token 管理（client.ts）+
    bootstrap（main.tsx）+ UI 宿主（AccountView）を読み、UI 層の欠落を確認。横断連携（hub 等）なし。

- id: D20260621-081
  command: /flow:revise
  phase: Step 3.1 / 改修固有 5 項目（Class A auto-pick）
  question: 動機/後方互換/リリース/テスト扱い/ロールバック
  chosen: 互換維持（純加算）/ 一括 + Clerk injectable seam（実 OAuth は release キー注入）/ 既存全維持+追加 / コード revert（migration 不要）
  chosen_type: auto-recommended
  context: |
    UI 層のみ追加で既存ゲストフロー・backend 契約は不変 = 互換維持。Clerk フロントは authProvider seam
    （keyless で isAvailable=false→「準備中」無効化、backend の computed-specifier seam と対称）。
    新規 schema なし = migration 不要、ロールバックはコード revert のみ。tag=auth-required。

- id: D20260621-082
  command: /flow:revise
  phase: Step 10 / 完了 → 自動進行
  question: 設計完了後の next-step
  chosen: /flow:tdd _shared/auth 001（連携/サインアウト UI 実装、stub/mock 緑）→ auto loop 継続
  chosen_type: auto-recommended
  depends_on: [D20260621-081]
  context: |
    REVISE_SPEC/PLAN/UNIT/E2E + README + INDEX 生成。Phase 1 seam interface → Phase 2 orchestration
    → Phase 3 UI 配線（O22(B+E) 充足）→ Phase 3.5 実 Clerk は release。auto-drivable のため tdd へ自動進行。
```
