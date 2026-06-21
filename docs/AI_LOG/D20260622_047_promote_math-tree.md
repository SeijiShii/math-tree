# AI_LOG セッション D20260622_047 — /flow:promote

**実行日時**: 2026-06-22 (+09:00)
**コマンド**: /flow:promote（/flow:auto P4.8 Promote gate から dispatch）
**対象**: Math-Tree
**状態**: 完了（告知文生成 = Class A。投稿は user 手番 = Class C）

## Decisions
```yaml
- id: D20260622-098
  command: /flow:promote
  phase: 告知文生成（全チャネル）
  question: 公開向け PJ + subdomain 確定 → 告知文生成
  chosen: note(長文+短文) / X(2案) / FB + 抽象 OGP バナー生成
  chosen_type: auto-recommended
  context: |
    URL 解決: services.toml subdomain = https://math-tree.givers.work（live・確定済、§URL 解決 (a)）。
    内容 = concept §1.1 主要 UC（テックツリー知識マップ / アンロック / 豆知識 / ステップ別自己採点 /
      AI 生成 + 多段クロス検証）から導出。切り口 = launch。
    コピー O38 準拠（PWA/API 等の技術語なし）、煽りセルフチェック pass（数字煽り/ランキング/
      誇大なし = 本 PJ の射幸性 NG 方針と整合）。メイカーフッター 1 行・助詞「で」自然。
    画像: sharp 不在のため経路1=抽象 SVG OGP バナー（藍×琥珀の知識グラフ、文字/人物なし、
      1200×630、docs/marketing/images/ogp-banner.svg）+ 経路2=画像生成 AI プロンプト併記。
    publish-status: note=pending（concept §4.7 ヘッダ）。投稿は user 手番、URL 受領で published 化。
```

## 生成・更新ファイル
- docs/marketing/D20260622_math-tree_posts.md（note 長/短 + X×2 + FB + 画像プロンプト）
- docs/marketing/images/ogp-banner.svg（抽象 OGP バナー）
- docs/concept.md §4.7（publish-status: note=pending マーカー）
- docs/AI_LOG/D20260622_047_promote_math-tree.md（本ファイル）

## ハンドオフ
- 投稿は user が内容確認のうえ手動（SNS 送信 = Class C）。投稿後に記事 URL を `/flow:promote --posted=<url>` で記録すれば published 化。
