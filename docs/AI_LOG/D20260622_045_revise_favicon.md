# AI_LOG セッション D20260622_045 — favicon 配線（O56 drift シュート）

**実行日時**: 2026-06-22 (+09:00)
**コマンド**: /flow:auto §3.0c drift シューティング（AUDIT_20260622_0816 [AUDIT-perspective-001] O56）
**対象**: _shared/ui（ブランドマーク / favicon）
**状態**: 完了

## Decisions
```yaml
- id: D20260622-095
  command: revise(drift-shoot)
  phase: §3.0c drift シューティング（audit Medium 抽出点）
  question: O56 favicon 不在（index.html rel=icon 無 / manifest icons:[] / public favicon アセット無）
  chosen: 自作 SVG favicon（design-system §7 モチーフ）を作成 + index.html/manifest 配線
  chosen_type: auto-recommended
  context: |
    design-system §7「藍地に琥珀のノードが連なる小さなツリー/ルート記号 √ のモチーフ」が
    deferred to 適用フェーズのまま未配線だった。
    実装:
      - public/favicon.svg 新規（viewBox 32x32、藍地 #0f1729 角丸 + √ ルート記号を藍 #3b5bdb で、
        琥珀ノード #f59e0b/#fbbf24 が枝に連なるツリー。絵文字 NG 準拠の自作 line-art）。
      - index.html: <link rel="icon" type="image/svg+xml" href="/favicon.svg"> + apple-touch-icon。
      - public/manifest.json: icons[] に SVG（type image/svg+xml, sizes any, purpose any maskable）。
    検証: typecheck clean / build green / 113 tests passed / dist に favicon.svg + manifest 反映 +
      dist/index.html に rel=icon 配線確認。O56 PASS 化。
    残: 本変更は本番反映に再デプロイが必要（release Phase 3）。PNG 派生（192/512）は
      SVG manifest icon で当面充足、必要時 scripts/gen-favicon で派生。
```

## 生成・更新ファイル
- public/favicon.svg（新規）
- index.html（rel=icon + apple-touch-icon 追加）
- public/manifest.json（icons[] 配線）
- docs/AI_LOG/D20260622_045_revise_favicon.md（本ファイル）
