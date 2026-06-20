# _shared/app-shell 実装計画書

> **入力**: 001 SPEC, ../../concept.md §4/§10/§12.9, 全 feature PLAN
> **最終更新**: 2026-06-20

## 1. 実装対象ファイル一覧
| `index.html` | エントリ + head（favicon/manifest/OGP） | — | 40 |
| `src/main.tsx` | providers 合成（Clerk/Query/Router/Sentry） | 全 _shared | 60 |
| `src/App.tsx` | ルーティング + レイアウト + FeedbackWidget + フッタ | 全 feature | 90 |
| `src/routes/*` | 各ルート結線 | features | 80 |
| `api/*` | 各機能 API ハンドラの公開配線 | features api | 60 |
| `scripts/dev.sh` / `stop.sh` | ローカル launcher（O36） | — | 80 |
| `.github/workflows/ci.yml` | lint/typecheck/unit/E2E/audit（O37） | — | 70 |
| `.github/workflows/cd-*.yml` / `dependabot.yml` | CD/依存監視 | — | 50 |
| `public/manifest.json` + favicon 一式 | PWA + ブランドマーク（design） | design | 40 |

## 2. 実装 Phase 分割（最後に実装、O57）
### Phase 1: 合成ルート（main/App/providers）+ ルーティング + 匿名セッション確立（P4.46）
### Phase 2: API ルートハンドラ層の公開配線 + UI↔data 結線（TanStack Query）
### Phase 3 (bootstrap, O36/O37): dev.sh/stop.sh + CI/CD + dependabot + manifest/favicon + README バッジ
### Phase 4: 全画面結線後に /flow:design --review-only（視覚レビュー green、Design gate(b)）+ /flow:wording

## 3. 依存関係順序
全 feature + 全 _shared 実装済 → 合成ルート → API 配線 → deploy scaffold → 視覚レビュー/wording

## 4. 既存ファイルへの影響
- 全機能を結線（合成のみ、各機能ロジックは不変）。

## 5. 横断フォルダへの追加・変更
- 全 _shared を providers に組み込み。

## 6. リスク・注意点
- **O57**: 合成 target を最後に必ず実装（部品だけで release に進まない）。**P4.46**: 匿名セッション確立 → 保護 API 200 を起動時に担保。**Design gate(b)**: 画面結線後に視覚レビュー green まで完了にしない。

## 7. 完了の定義（DoD）
- [ ] `bash scripts/dev.sh` で起動 + smoke green（O36）
- [ ] 匿名→authed で全保護 API 200（P4.46）
- [ ] 全ルートに導線（O55）+ FeedbackWidget 常設 + フッタ法務
- [ ] CI green（O37）+ manifest/favicon
- [ ] 視覚レビュー green（Design gate(b)）+ wording 通過

## 8. 更新履歴
| 2026-06-20 | 初版作成 | /flow:feature |
