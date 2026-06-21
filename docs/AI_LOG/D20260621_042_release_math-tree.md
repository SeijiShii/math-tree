# AI_LOG セッション D20260621_042 — /flow:release
**実行日時**: 2026-06-21 (+09:00)
**コマンド**: /flow:release
**対象**: Math-Tree（pre-release 初回）
**実行者**: Claude (Opus 4.8) + seiji
**状態**: 進行中（Phase 1 §1.0 判定 → launch scope 決定待ち = Class C 人間ゲート）

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
