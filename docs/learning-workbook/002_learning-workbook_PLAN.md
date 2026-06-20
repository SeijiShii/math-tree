# learning-workbook 実装計画書

> **入力**: `./001_learning-workbook_SPEC.md`, `../concept.md` §1.4
> **最終更新**: 2026-06-20

## 1. 実装対象ファイル一覧
| ファイル | 責務 | 依存 | LOC |
| `src/features/learning-workbook/WorkbookView.tsx` | 学習画面（ステップ UI） | ui, types | 150 |
| `src/features/learning-workbook/MathInput.tsx` | MathLive ラッパ | mathlive | 70 |
| `api/grade-step.ts` | ステップ照合（CAS/AI） | ai, equivalence | 90 |
| `src/features/learning-workbook/equivalence.ts` | CAS 正規化同値判定（[論点-002]） | — | 120 |
| `api/units/[slug]/master.ts` | 習得判定 + アンロック | db(progress) | 60 |
| `src/services/workbook.ts` | TanStack Query フック | — | 60 |

## 2. 実装 Phase 分割
### Phase 1: equivalence（CAS 正規化）+ grade-step（CAS のみ、mock AI）
### Phase 2: WorkbookView + MathInput（MathLive）+ services
### Phase 3: master（習得→アンロック）+ AI フォールバック照合（実 _shared/ai）

## 3. 依存関係順序
equivalence → grade-step → UI(MathInput/WorkbookView) → master/アンロック

## 4. 既存ファイルへの影響
- progress を mastered に更新（tech-tree が表示連動）。

## 5. 横断フォルダへの追加・変更
- _shared/ai の crossValidation/review を同値判定フォールバックに利用。

## 6. リスク・注意点
- 模範解答を server-only に保つ（SEC-002）。同値判定の表現揺れ（[論点-LW1]）。MathLive のスマホ入力 UX。

## 7. 完了の定義（DoD）
- [ ] CAS 同値判定が表現揺れを正解扱い + 誤答を弾く
- [ ] ステップ照合 → 習得 → アンロック
- [ ] 模範解答がクライアントに出ない（SEC-002）
- [ ] unit + E2E green

## 8. 更新履歴
| 2026-06-20 | 初版作成 | /flow:feature |
