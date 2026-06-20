# AI_LOG セッション D20260620_016 — /flow:feature (tech-tree)

**実行日時**: 2026-06-20 10:04 (+09:00)
**コマンド**: /flow:feature tech-tree（/flow:auto 反復14、インライン実行）
**対象**: tech-tree（機能: 看板 UI）
**状態**: 完了
**含まれる decision**: D20260620-040

## 主要決定サマリ
| D20260620-040 | テックツリー UI 設計 | React Flow + 周辺フォーカス+ミニマップ + 状態色(design §2.1) + 豆知識 + アンロック連動 | auto-recommended |

## Decisions
```yaml
- id: D20260620-040
  timestamp: 2026-06-20T10:04:00+09:00
  command: /flow:feature
  phase: Step 2-3 / テックツリー UI 設計
  question: tech-tree の構成
  options: []
  recommended: null
  chosen: TechTreeView(React Flow)+UnitNode(状態色)+MiniMap(周辺フォーカス)+UnitDetailPanel(豆知識)+アンロック連動
  chosen_type: auto-recommended
  depends_on: [D20260620-004, D20260620-031, D20260620-032, D20260620-037]
  context: |
    D-004 見せ方=周辺フォーカス+ミニマップ。design §2.1 ノード状態色。認知負荷回避(一括描画しない)。
    SEC-001 progress owner scoped。確定的解放のみ(charter §2.2)。learning-workbook 習得で解放連動。
```
