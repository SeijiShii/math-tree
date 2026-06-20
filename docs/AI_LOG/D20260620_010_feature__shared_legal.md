# AI_LOG セッション D20260620_010 — /flow:feature (_shared/legal)

**実行日時**: 2026-06-20 09:40 (+09:00)
**コマンド**: /flow:feature _shared/legal（/flow:auto 反復8、インライン実行）
**対象**: _shared/legal（横断: 法務書類）
**状態**: 完了
**含まれる decision**: D20260620-034

## 主要決定サマリ
| D20260620-034 | 法務書類設計 | プラポリ/規約/特商法 + DSR セルフサービス削除文言（O54）+ フッタ導線（O55） | auto-recommended |

## Decisions
```yaml
- id: D20260620-034
  timestamp: 2026-06-20T09:40:00+09:00
  command: /flow:feature
  phase: Step 2-3 / 法務書類設計
  question: _shared/legal の構成
  options: []
  recommended: null
  chosen: 3 法務原稿 + 公開ページ + フッタ全ページ導線 + ConsentNotice。DSR はセルフサービス削除を明記
  chosen_type: auto-recommended
  depends_on: [D20260620-019]
  context: |
    SEC-004/O54: ゲスト匿名は本人特定不可 → in-app セルフ削除を約束、窓口削除は約束しない正直明記。
    「削除請求は窓口まで」式の履行不能定型文を置かない（テストで不在確認）。O55: フッタ全ページ導線。
    実削除の実体は account 領域で実装、本フォルダは文言整合を担保。特商法の有償該当性は公開前最終確認。
```
