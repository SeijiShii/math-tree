# tech-tree 変更仕様書（現在地デフォルトズーム + エッジ選択無効化）
> 改修種別: UI 改善 / issue: C20260622-008 / 基準: ../001_tech-tree_SPEC.md / タグ: feature / 2026-06-22
## 1. 変更概要
57 単元の広大ツリーで `fitView`（全体表示）だと各ノードが小さすぎる。**初期表示を「現在地（進捗フロンティア=解放済みノード）あたり」にズーム**する。あわせて、React Flow の**接続線（エッジ）が既定でクリック選択できてしまう**のを無効化（学習グラフでエッジ選択は不要・誤操作の元）。
## 2. 変更前 vs 変更後
| 対象 | 変更前 | 変更後 | 互換 |
|---|---|---|---|
| 初期ビューポート | `fitView`（全 57 ノードを画面に収める＝極小表示） | 現在地ノード（最深の unlocked、無ければ mastered/先頭）を `setCenter` で中心化＋zoom≈0.85（周辺も見える） | UI のみ |
| エッジ操作 | 既定で selectable/focusable（クリックで選択ハイライト） | `selectable:false` + `focusable:false` + `interactionWidth:0`、ReactFlow `edgesFocusable={false}`（クリック不可・装飾線化） | UI のみ |
| ノード操作 | onNodeClick で学習遷移（不変） | 不変 | — |
## 3. 影響範囲
| tech-tree（TechTreeView/nodeNav） | 中 | 表示ロジックのみ。データ/API/unlock 不変 |
## 4. 後方互換性
互換維持 ✅（表示挙動のみ、DB/API/型 不変）。
## 5. ロールバック
コード revert のみ。
## 6. リリース戦略
一括（UI 改善、CLI デプロイ）。ローカル headless で視覚確認 → 本番。
## 7. 詳細仕様
- `pickCurrentNodeId(nodes, yById)`（純）: state==='unlocked' があればその中で最深（y 最大＝進捗フロンティア）、無ければ mastered の最深、無ければ先頭。現在地として中心化対象を返す。
- TechTreeView: `ReactFlowProvider` で包み、内側で `useReactFlow().setCenter(p.x+75, p.y+20, {zoom:0.85, duration:400})` を graph ロード後の useEffect で実行（async ロードに追従、fitView は撤去）。
- エッジ: 各 edge に `selectable:false, focusable:false, interactionWidth:0`、ReactFlow に `edgesFocusable={false}`。
## 9. 未決事項
現時点で論点なし（2026-06-22）。
