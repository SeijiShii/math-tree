# 実装レポート: _shared/app-shell
## 実装日時
2026-06-20 12:52 (JST)
## 変更一覧
- `src/app/routes.ts`: ROUTES manifest + orphanedRoutes（**O55 全ルートに inbound 導線**、法務 3 点フッタ常設）。
- `src/app/bootstrap.ts`: bootstrapSession（**起動で匿名ゲストセッション確立 P4.46**、401 にしない）。
- deploy scaffold（O36/O37）: `scripts/dev.sh` / `stop.sh` / `.env.example`（コスト単価含む §4.6.2）/ `.github/workflows/ci.yml`（typecheck+test）/ `dependabot.yml` / `public/manifest.json`（PWA, theme=藍）。
## テスト
- 5/5 green: orphaned なし(O55) / 主要ルート / 法務フッタ常設 / 匿名ゲスト確立(P4.46) / 既存セッション維持。typecheck green。
## 残（presentation 結線）
React presentation views（TechTreeView@xyflow / WorkbookView@MathLive 等の描画コンポーネント）+ Design gate(b) 視覚レビュー + 実キー release(Class B/C) は後続。ロジック層は全 13 モジュール green。
## PR Description
### タイトル
_shared/app-shell: 合成レイヤ（ルート/ゲスト確立/deploy scaffold O57）
