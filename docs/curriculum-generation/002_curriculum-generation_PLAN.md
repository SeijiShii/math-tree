# curriculum-generation 実装計画書

> **入力**: 001 SPEC, ../concept.md §4.1/§6
> **最終更新**: 2026-06-20

## 1. 実装対象ファイル一覧
| ファイル | 責務 | 依存 | LOC |
| `api/curriculum/generate.ts` | 生成オーケストレーション | ai, db | 120 |
| `api/curriculum/validate.ts` | 多段クロス検証ゲート（[論点-CG1]） | ai(crossValidation), db(reviews) | 110 |
| `api/curriculum/[line].ts` | verified キャッシュ配信 | db | 50 |
| `scripts/generate-curriculum.ts` | バッチ起動 | generate/validate | 40 |
| `src/features/curriculum-generation/prompts.ts` | 生成/検証プロンプト | — | 90 |

## 2. 実装 Phase 分割
### Phase 1: prompts + generate（mock AI で構造生成）
### Phase 2: validate（多段クロス検証ゲート、mock）+ verified 判定
### Phase 3 (bootstrap): 実 AI inject + バッチ実行で中学数学1系統を生成・検証・キャッシュ

## 3. 依存関係順序
prompts → generate → validate(gate) → cache 配信 / batch

## 4. 既存ファイルへの影響
- units/edges/problems/steps/reviews へ投入（tech-tree/learning-workbook が消費）。

## 5. 横断フォルダへの追加・変更
- _shared/ai の crossValidation を検証ゲートに利用。cost-tracking で生成コスト監視。

## 6. リスク・注意点
- **正確性の生命線**: verified ゲートを通さない公開を作らない。循環依存検出。公開から AI 直叩き不可（SEC-005）。

## 7. 完了の定義（DoD）
- [ ] 生成 → 多段検証 → verified ゲート → キャッシュ
- [ ] 不一致は under_review 差し戻し
- [ ] 中学数学1系統が verified で配信
- [ ] unit + integration green

## 8. 更新履歴
| 2026-06-20 | 初版作成 | /flow:feature |
