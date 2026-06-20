# math-relax

初歩から数学を**ゲームのテックツリー風の知識マップ**で学びなおせる無料 Web サービス。AI が依存グラフ型カリキュラムを生成し（別 AI が多段クロス検証して正確性を担保）、習得した単元がアンロックされて到達点が見える。

## 概要

個人ツール（完全無料 + tip-jar）。学生時代に数学でつまずいた大人の独学者向けに、「学ぶ順番（前提 → 応用）」と「到達点」をテックツリーで可視化し、各単元に実世界での使われ方の豆知識を添え、WYSIWYG 数式エディタで途中式を 1 ステップずつ自己採点して進める。開発者自身が数学を学びなおしたい当事者であり、人手監修に頼らず **AI 生成 + 別 AI 多段クロス検証**で正確性を担保するのが設計の核。

## 主要機能

- **テックツリー（知識グラフ UI）**: React Flow で単元/依存を描画、現在地周辺フォーカス + 全体ミニマップ、アンロック進捗連動
- **学習ワークブック**: WYSIWYG 数式エディタ（MathLive）でステップ別に途中式を書き、模範解答とステップ単位で照合する自己採点
- **AI 生成 + 多段検証パイプライン**: カリキュラム/豆知識/問題/模範解答を AI 生成し、別 AI が複数回レビューして正確性をゲート（事前生成 + キャッシュ）
- **tip-jar**: 固定 100 円「作者を支援」をゲストのままワンタップ（Stripe 単発）

## 技術スタック

- フロント: Vite + React + TypeScript / React Flow / MathLive + KaTeX / shadcn/ui + Tailwind / TanStack Query
- バック: Vercel Functions（AI 呼び出し・決済・ingestion をキー秘匿）
- データ: Neon (Postgres) + Drizzle ORM
- 認証: Clerk（匿名ゲスト → 課金/同期時に段階認証）
- AI: Claude API（生成 + 多段クロス検証）
- 監視 / 分析 / CI: Sentry / Vercel Web Analytics / GitHub Actions

## Getting Started (Local Development)

### 前提条件
- Node.js（nvm 等で管理）
- Vercel CLI（`npm i -g vercel`）
- `.env.local` の準備（`.env.example` をコピーして実値を埋める。詳細は [PREREQUISITES.md](./docs/PREREQUISITES.md)）

### 起動
```bash
./scripts/dev.sh        # Vite + vercel dev を並列起動（実装後）
```

### よく使うコマンド
| 用途 | コマンド |
|---|---|
| dev サーバー起動 | `./scripts/dev.sh` |
| カリキュラム事前生成 + 多段検証 | `npm run generate:curriculum` |
| DB マイグレーション | `npm run db:migrate` |
| 型チェック | `npm run typecheck` |
| ユニットテスト | `npm run test` |

詳細: [docs/concept.md §4.5](./docs/concept.md)

## 開発状態

企画中（concept 確定、機能設計待ち）。

## 設計ドキュメント

- [全体概念・要件・設計](./docs/concept.md) — プロジェクト中央書類（`/flow:concept` で生成・更新）
- [開発シナリオ](./docs/SCENARIO.md) — next-step 判断用ナラティブ
- [機能フォルダ INDEX](./docs/INDEX.md) — 全機能フォルダ + 横断フォルダのリスト
- [AI 用エントリポイント](./docs/DOC_MAP.md) — 目的別アクセスガイド
- [実装前準備チェックリスト](./docs/PREREQUISITES.md) — API キー / アカウント / 法務書類

## ライセンス

未定（公開時に決定）。
