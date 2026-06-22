# 修正計画: ノードクリック→学習遷移 + ミニマップ暗テーマ化

> **入力**: ./000_調査レポート.md, ./001_ROOT_CAUSE.md, src/features/tech-tree/TechTreeView.tsx
> **最終更新**: 2026-06-22

## 1. 修正対象ファイル

### 1.1 src/features/tech-tree/TechTreeView.tsx（主修正）
**(B) ノードクリック → 学習遷移**
- `useNavigate`（react-router-dom）を import。
- `rfNodes` の `data` に `slug` と `canLearn`（= `state === 'unlocked' || state === 'mastered'`）を追加。
  - before: `data: { label: n.title }`
  - after: `data: { label: n.title, slug: n.slug, canLearn: n.state !== 'locked' }`
- `<ReactFlow>` に `onNodeClick={(_, node) => { if (node.data.canLearn) navigate(\`/learn/${node.data.slug}\`) }}` を配線。
  - **解放済み（unlocked/mastered）のみ遷移、未解放（locked）は no-op**（SPEC §6.1「未解放ノードの学習導線は無効化」）。
- カーソル: 解放済みノードは `cursor: pointer`、未解放は `cursor: default`（node.style に反映）。

**(A) MiniMap 暗テーマ化**
- `<MiniMap />` に prop 指定:
  - `maskColor="rgba(15, 23, 41, 0.75)"`（= --bg 由来の暗マスク。CSS var が MiniMap SVG 属性に効かないため rgba 直値だが、design-system の --bg #0f1729 と一致）
  - `nodeColor={(n) => n.data?.canLearn ? '#3b5bdb' : '#9fb0d0'}`（解放=藍 / 未解放=muted。design-system トークンの実値）
  - `pannable zoomable`（任意、操作性）。
  - 補足: screens.css の `.react-flow__minimap` 背景 surface は維持。

### 1.2 src/lib/nodeStyle.ts
- 変更なし（既存トークンを流用）。`canLearn` は state から TechTreeView 側で算出。

> 注: SPEC §6.1 の「詳細パネル（豆知識）」は graph node に trivia データが無いため本 fix では直接遷移とし、豆知識パネルは別途データ配線を要する enhancement として送る（claim の主訴=「クリックで学習に移らない」は直接遷移で解消）。

## 2. 修正範囲の限定方針
- 根本原因（クリック導線の未配線 + MiniMap 未テーマ）のみ修正。豆知識詳細パネルは scope 外（trivia データ未配線のため別 issue）。
- 理由: claim の主訴を最小差分で解消しつつ、SPEC §6.1 の「未解放は無効」分岐は守る。

## 3. 副作用なき確認方法
- 既存 unit テスト（layout/nodeStyle/buildGraph）維持。
- 追加テスト: 003_REGRESSION_TEST.md（クリック→遷移の解放/未解放分岐 + MiniMap prop）。
- 手動確認（release post-deploy）: 本番でノードクリック→学習画面遷移 / ミニマップが暗テーマで俯瞰可。

## 4. リリース戦略
- 方式: 即時（severity=high、核心導線）。`/flow:tdd` 実装 → green → `/flow:release` で本番再デプロイ。
- フラグ: 不要。

## 5. ロールバック方針
- コード revert で戻せる: ✅（TechTreeView の差分のみ）。DB 影響なし。

## 6. 関係者通知
- seiji（本人）。

## 7. DoD
- [ ] 解放ノードクリック → `/learn/<slug>` 遷移
- [ ] 未解放ノードクリック → 遷移しない
- [ ] MiniMap が暗テーマで俯瞰判別可
- [ ] 003 REGRESSION_TEST 全 green / 既存テスト破壊なし
- [ ] 本番再デプロイ後に実機確認

## 8. 更新履歴
| 日付 | 変更 | 実行者 |
|---|---|---|
| 2026-06-22 | 初版 | /flow:fix |
