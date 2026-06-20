# tech-tree 実装計画書

> **入力**: 001 SPEC, ../concept.md §1.4, ../design/design-system.md
> **最終更新**: 2026-06-20

## 1. 実装対象ファイル一覧
| `src/features/tech-tree/TechTreeView.tsx` | React Flow キャンバス + フォーカス | @xyflow/react, ui | 160 |
| `src/features/tech-tree/UnitNode.tsx` | カスタムノード（状態色 design §2.1） | ui(nodeStyle) | 80 |
| `src/features/tech-tree/MiniMap.tsx` | 全体ミニマップ + ロマンノード | @xyflow | 50 |
| `src/features/tech-tree/UnitDetailPanel.tsx` | 豆知識 + 学ぶ導線 | ui(Katex) | 70 |
| `api/tech-tree/[line].ts` | TechTreeGraph 組成（verified+progress） | db | 70 |
| `src/services/techTree.ts` | TanStack Query | — | 50 |

## 2. 実装 Phase 分割
### Phase 1: api/tech-tree（グラフ組成）+ services
### Phase 2: TechTreeView + UnitNode（状態色）+ MiniMap（周辺フォーカス）
### Phase 3: UnitDetailPanel（豆知識）+ learning-workbook 導線 + アンロック連動

## 3. 依存関係順序
api 組成 → View/Node/MiniMap → DetailPanel/導線

## 4. 既存ファイルへの影響
- learning-workbook の習得で progress 更新 → 本グラフが再取得で解放表示。

## 5. 横断フォルダへの追加・変更
- _shared/ui の nodeStyle / Katex を使用。

## 6. リスク・注意点
- 認知負荷（周辺フォーカス必須、全ノード一括描画回避）。状態色のコントラスト（design §2.1）。owner scoping（SEC-001）。

## 7. 完了の定義（DoD）
- [ ] 周辺フォーカス + ミニマップで描画
- [ ] 状態色（習得/解放/未解放/ロマン）が design §2.1 準拠
- [ ] ノード選択 → 豆知識 → 学ぶ導線
- [ ] 習得 → アンロック連動
- [ ] unit + E2E green

## 8. 更新履歴
| 2026-06-20 | 初版作成 | /flow:feature |
