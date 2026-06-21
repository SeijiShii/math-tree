# AI_LOG セッション D20260621_042 — /flow:release
**実行日時**: 2026-06-21 (+09:00)
**コマンド**: /flow:release
**対象**: Math-Tree（pre-release 初回）
**実行者**: Claude (Opus 4.8) + seiji
**状態**: 完了（ゲスト専用 MVP 本番デプロイ + post-deploy スモーク green）
metrics: { deploy_target: production, deployed_url: "https://math-tree-psi.vercel.app", check_result: green, paid_confirmed: n/a(無課金 MVP) }

## 追記 decision（デプロイ実行）
```yaml
- id: D20260621-091
  command: /flow:release
  phase: launch scope（Class C 人間判断）
  question: 公開 scope
  chosen: ゲスト専用 MVP を最速公開（*.vercel.app 検証フェーズ）
  chosen_type: explicit-choice
  context: |
    ユーザー選択。core（tech-tree+CAS自己採点+seeded カリキュラム+ゲスト認証）は配線済 2 キーで稼働。
    tip-jar を VITE_ENABLE_TIPJAR でゲート（Stripe 未配線で非表示、死にボタン排除）= Class A cleanup 実施。

- id: D20260621-092
  command: /flow:release
  phase: Phase 3 / デプロイ実行（Class B 承認済 agent 連続実行）
  question: 本番デプロイ結果
  chosen: 成功・post-deploy スモーク全 green
  chosen_type: auto-recommended
  depends_on: [D20260621-091]
  context: |
    ① GitHub public repo SeijiShii/math-tree 作成+push（B-2、秘密 gitignore 済）。
    ② vercel link → quadiishii-9506s-projects/math-tree（GitHub連携 400 は cross-account 想定内 = CLI デプロイ運用、CF-20260529-001）。
    ③ Neon migrate+seed（schema 9 stmts + 5 units、idempotent）。
    ④ deploy-prod.sh: sync-prod-env（masked）→ vercel-build（7 functions ≤12 Hobby）→ handler/関数数/raw-body guard → deploy --prebuilt --prod。
       本番 https://math-tree-psi.vercel.app（aliased）READY。
    ⑤ smoke（smoke-prod.sh）: frontend 200 / guest provision 201(JWT) / 保護API 無token 401 / guest Bearer 200 /
       tech-tree が seeded units 配信。O51(非500) + O22(認証 end-to-end 200) 充足。
    「完成」残（Class C/B）: 独自サブドメイン+DNS / Stripe live+特商法で tip-jar / promote（サブドメ確定後）。
    promote は *.vercel.app では告知 URL 非確定（CF-008）ゆえ deferred（独自サブドメイン後）。
```

## Decisions
```yaml
- id: D20260621-090
  command: /flow:release
  phase: Step 0 + Phase 1 §1.0 / live 化判定 + readiness
  question: リリース準備状態
  chosen: pre-release（未デプロイ）。core はゲスト専用で稼働可（DATABASE_URL + GUEST_TOKEN_SECRET 配線済）
  chosen_type: auto-recommended
  context: |
    §1.0 SoT 判定: .env.production.local 実 read — DATABASE_URL(151字, postgres=Neon 配線済) +
    GUEST_TOKEN_SECRET(64字, 配線済) + COST_* 設定済。CLERK/ANTHROPIC/STRIPE/TURNSTILE は空。
    live キー無し → pre-release（未デプロイ、git remote 無し）。
    deploy scaffold 済: vercel.json + scripts/{deploy-prod,sync-prod-env,vercel-build,dev,stop,migrate-seed}。
    §1.0c fleet model: 既定 prod-direct。
    機能の鍵依存マッピング（graceful degrade 確認）:
      - core 学習（tech-tree + CAS 自己採点 + seeded 中1代数カリキュラム）= DATABASE_URL + GUEST_TOKEN_SECRET のみ → 配線済 ✅
      - AI 採点フォールバック = ANTHROPIC_API_KEY（無=「準備中」案内, E3 test 確認済、CAS でほぼ充足）
      - アカウント連携 = Clerk（無=「準備中」無効化, 本セッション seam 実装済）
      - tip-jar 支援 = Stripe（無=checkout 501）+ 特商法（Class C）
      - bot 対策 = Turnstile（無=feedback/support フォーム無防備）
    残: launch scope 決定（ゲスト専用 MVP vs フルキー）→ 実キー FILL(Class C) → GitHub remote(§3.0a) →
        独自サブドメイン+DNS(§3.2, ユーザー保有ドメイン未確定) → deploy(Class B)。
    .env.production.local の CLERK_PUBLISHABLE_KEY は非 VITE 名のまま（.env.example fix で VITE_ へ統一済）→
        Clerk 使う場合は VITE_CLERK_PUBLISHABLE_KEY に修正要。
    → launch scope は本質的に人間判断（実キー provision 範囲 + ドメイン + デプロイ承認）= Class C/B ゲート。
```
