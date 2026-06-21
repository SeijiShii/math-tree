# AI_LOG セッション D20260621_043 — fix: テックツリー縦レイアウト
**実行日時**: 2026-06-21 (+09:00)
**コマンド**: /flow:release 中のユーザー報告 → 即時 fix
**対象**: tech-tree レイアウト（本番 claim）
**状態**: 完了

## Decisions
```yaml
- id: D20260621-093
  command: fix
  phase: 本番 claim → fix
  question: テックツリーが横一列に並ぶ（縦フローのはず）
  chosen: 依存深さ（level）で縦レイアウト化 + 縦フロー handle
  chosen_type: explicit-choice
  context: |
    ユーザー報告（本番スクショ）: 「縦に使用するはずのフローチャートを無理やり横に並べている」。
    原因: TechTreeView が固定 4 列グリッド position={x:(i%4)*200, y:floor(i/4)*140} で依存無視の横並び。
    修正: src/features/tech-tree/layout.ts（computeLevels=longest-path / layoutVertical=level で縦積み +
    同 level 兄弟は横中央揃え、循環 guard 付き）。TechTreeView を layoutVertical 配置 +
    sourcePosition=Bottom/targetPosition=Top で縦エッジフロー化。
    テスト: layout.test.ts 4 件（level 算出 / 縦順序 / 兄弟分散 / 循環停止）。全 113 passed / typecheck・build green。
    → 本番再デプロイ。
```
