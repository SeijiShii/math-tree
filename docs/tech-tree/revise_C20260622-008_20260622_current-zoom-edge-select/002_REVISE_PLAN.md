# 変更計画書（現在地ズーム + エッジ選択無効化）
## 1. 既存ファイル変更
| src/features/tech-tree/nodeNav.ts | pickCurrentNodeId 追加（純・現在地選定） | 低 |
| src/features/tech-tree/TechTreeView.tsx | ReactFlowProvider 化 + useReactFlow().setCenter（fitView 撤去）+ エッジ selectable/focusable/interactionWidth 無効化 | 中 |
## 2. 新規ファイル
なし
## 4. マイグレーション
不要
## 5. Phase
- Phase 1: pickCurrentNodeId（純）+ テスト。
- Phase 2: TechTreeView 配線（Provider/setCenter/エッジ無効化）。
## 9. DoD
- [ ] pickCurrentNodeId が unlocked フロンティアを返す（テスト green）
- [ ] 初期表示が現在地中心ズーム / エッジがクリック選択不可
- [ ] 既存テスト不変 / 本番で視覚確認
