# クレーム調査レポート

**claim id**: C20260622-002
**実施日**: 2026-06-22
**対象機能**: learning-workbook
**緊急度推定**: high（数式エディタは学習の中核 UI、フォント欠落で数式が正しく描画されない）

## 1. クレーム原文
```
index-CgHeJZeW.js:2996 MathLive 0.105.3: The math fonts could not be loaded from
"https://math-tree-psi.vercel.app/assets/fonts" {cause: NetworkError: A network error occurred.}
```

## 2. 分解結果
### 2.1 期待挙動 (Expected)
学習画面の数式エディタ（math-field）が MathLive の数式フォントを読み込み、数式が正しく描画される（concept §1.1 UC#5 WYSIWYG 数式エディタ）。
### 2.2 現実挙動 (Actual)
MathLive がフォントを `https://<host>/assets/fonts` から読み込もうとして NetworkError（404）。数式フォントが当たらない。
### 2.3 発生条件
- 本番（math-tree.givers.work / *.vercel.app）の学習画面（/learn/:slug）を開いたとき。
- 常時（フォント未配信のため確定的）。
### 2.4 影響範囲
- 全ユーザー / 学習画面の数式表示。データ影響なし。
### 2.5 報告経路
- 本人（seiji）、本番コンソールエラー貼付。冷静。
### 2.6 報告者文脈
数式を書いて学習したい。

## 3. 過去類似クレーム
該当なし（learning-workbook 初の claim）。直前の C20260622-001 は tech-tree（別機能）。
