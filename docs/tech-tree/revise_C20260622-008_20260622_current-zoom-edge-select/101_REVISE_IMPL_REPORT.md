# 実装レポート: tech-tree C20260622-008（現在地ズーム + エッジ選択無効化）
## 2026-06-22 / revise
## 変更
- nodeNav.ts: pickCurrentNodeId（純・現在地=解放済み最深、無→mastered最深、無→先頭）追加。
- TechTreeView.tsx: ReactFlowProvider 化 + TechTreeCanvas 内で useReactFlow().setCenter（現在地に zoom=0.85、graph 非同期ロード後の useEffect）。fitView 撤去。エッジに selectable:false/focusable:false/interactionWidth:0 + ReactFlow edgesFocusable={false}。minZoom=0.2。
## 検証
typecheck/build green / 185 tests green（pickCurrentNodeId 4 追加）。
## 本番検証予定
初期表示が現在地中心ズーム / エッジがクリック選択不可（装飾線化）/ ノード学習遷移は不変。
