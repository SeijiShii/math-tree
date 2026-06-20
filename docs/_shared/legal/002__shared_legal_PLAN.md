# _shared/legal 実装計画書

> **入力**: `./001__shared_legal_SPEC.md`, `../../concept.md` §9
> **最終更新**: 2026-06-20

## 1. 実装対象ファイル一覧
| ファイル | 責務 | 依存 | LOC |
| `src/content/legal/privacy.mdx` | プラポリ（DSR セルフサービス明記） | — | 120 |
| `src/content/legal/terms.mdx` | 利用規約（AI 生成の正確性免責 / tip-jar 返金不可） | — | 100 |
| `src/content/legal/sct.mdx` | 特定商取引法表記 | — | 60 |
| `src/routes/legal/*` | 公開ページルート | content, ui | 50 |
| `src/components/ConsentNotice.tsx` | 初回案内 + 同意導線 | ui | 40 |

## 2. 実装 Phase 分割
### Phase 1: 法務原稿（mdx）作成（DSR セルフサービス文言、O54）
### Phase 2: 公開ページルート + フッタ導線（O55）+ ConsentNotice
- ゴール: フッタから全法務ページに到達でき、DSR 文言が実態（セルフ削除）と整合。

## 3. 依存関係順序
原稿 → ページ/ルート → フッタ配線（app-shell）

## 4. 既存ファイルへの影響
- app-shell のフッタにリンク追加（被依存）。

## 5. 横断フォルダへの追加・変更
- なし（コンテンツ主体）。

## 6. リスク・注意点
- DSR 約束と実装の乖離を作らない（SEC-004）。公開前に有償該当性（特商法）確認。

## 7. 完了の定義（DoD）
- [ ] 3 法務原稿作成（DSR セルフサービス明記）
- [ ] 公開ページ + フッタ全ページ導線
- [ ] consent 導線

## 8. 更新履歴
| 2026-06-20 | 初版作成 | /flow:feature |
