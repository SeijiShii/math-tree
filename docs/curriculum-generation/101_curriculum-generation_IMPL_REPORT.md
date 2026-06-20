# 実装レポート: curriculum-generation
## 実装日時
2026-06-20 12:44 (JST)
## 変更一覧
- `src/features/curriculum-generation/pipeline.ts`: validateAndStore（**多段クロス検証ゲート → verified のみ保存、不一致は under_review 差し戻し** [論点-CG1]、検証履歴を reviews に記録）。配信は db.getPublicUnits（verified のみ、SEC-005 公開から直叩き不可）。
## テスト
- 2/2 green: 多段 pass→verified→配信 / 重大指摘→under_review→非配信。typecheck green。
## 論点解決
[論点-CG1]（concept [論点-001]）= 異モデル多数決 + 重大指摘ゼロ で verified（_shared/ai runCrossValidation）。
## PR Description
### タイトル
curriculum-generation: AI 生成 + 多段クロス検証ゲート
