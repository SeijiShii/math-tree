# 実装レポート: tech-tree
## 実装日時
2026-06-20 12:48 (JST)
## 変更一覧
- `src/features/tech-tree/buildGraph.ts`: buildTechTreeGraph（**verified units + edges + owner progress → TechTreeGraph**、状態反映、SEC-001 owner 分離、draft 非配信、ロマンノード）。React Flow 描画 + 周辺フォーカス/ミニマップ/豆知識 UI は app-shell 結線で配線。
## テスト
- 4/4 green: グラフ組成+状態 / owner 分離(SEC-001) / draft 非配信 / ロマンノード romance visual(design §2.1)。typecheck green。
## PR Description
### タイトル
tech-tree: 知識グラフ組成（状態反映 + owner 分離）
