# _shared/types 仕様書（横断: 共通型定義）

> **役割**: 機能間で共有するドメイン型・列挙・API DTO の単一定義。Drizzle 推論型を土台に、公開 DTO / グラフ表現 / 進捗状態などアプリ層の型を提供。
> **タグ**: cross-cutting
> **最終更新**: 2026-06-20
> **入力アーティファクト**: `../../concept.md`（§5, §1.3.2）, `../db/001__shared_db_SPEC.md`, `./README.md`

---

## 1. 提供インターフェース（型）

### 1.1 列挙
- `ProgressState = 'locked' | 'unlocked' | 'mastered'`
- `VerificationStatus = 'draft' | 'under_review' | 'verified'`
- `FeedbackKind = 'like' | 'dislike' | 'bug'`
- `AiPurpose = 'generation' | 'review'`
- `ReviewVerdict = 'pass' | 'fail'`

### 1.2 ドメイン型（DB 由来 + 公開 DTO）
- `Unit` / `UnitPublic`（公開時は verification_status を出さない、is_romance_node/trivia を含む）
- `UnitEdge`（from/to）
- `Problem` / `Step`（model_answer_latex は学習中は隠す DTO `StepPrompt` を別途）
- `UnitProgress`（owner × unit × state）
- `TechTreeGraph`（React Flow 用: `nodes: TechTreeNode[]`, `edges: TechTreeEdge[]`、各ノードに state を載せる）
- `Trivia`（実世界の使われ方、unit に内包）
- `SupportRecord` / `FeedbackInput` / `AiCallLog`

### 1.3 API DTO
- リクエスト/レスポンスの Zod スキーマ（SEC-002 入力検証と協調）から推論する型を export。

## 2. 入出力
- 型のみ（ランタイム挙動なし）。Zod スキーマは `z.infer` で型に変換。
- 副作用: なし。

## 3. データモデル
- 新規エンティティなし（db の型を再 export + アプリ層 DTO を追加）。

## 4. バリデーション + エラーケース
- 型レベルの制約のみ。ランタイム検証は各 feature の Zod スキーマ（SEC-002）が担う。
- `StepPrompt`（学習中表示用）は `model_answer_latex` を**含まない**型にして、模範解答の漏洩を型で防ぐ。

## 5. 機能固有 NFR + 既存連携
### 5.1 NFR
- 型の単一情報源化（重複型定義を作らない）。
### 5.2 連携
- 依存: なし（優先度1）。db のスキーマ型を参照（型のみ、循環なし）。
- 被依存: 全機能。

## 6. タグ別追加項目
- なし（純型定義）。

## 7. スコープ外
- ランタイムバリデーション実体（各 feature の Zod）。

## 8. 未決事項
- 現時点で論点なし（2026-06-20）。`TechTreeNode` のロマンノード表現は tech-tree 設計で詳細化。

## 9. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-20 | 初版作成 | /flow:feature |
