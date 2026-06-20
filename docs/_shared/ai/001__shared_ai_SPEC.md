# _shared/ai 仕様書（横断: Claude API クライアント基盤）

> **役割**: Claude API 呼び出しをサーバー側（Vercel Functions）に隠蔽し、キーを秘匿する基盤。生成/多段クロス検証の共通プリミティブ + 呼び出しログ（コスト積算）を提供。
> **タグ**: cross-cutting, auth-required（server-only）, analytics（コストログ）
> **最終更新**: 2026-06-20
> **入力**: `../../concept.md`（§4.1, §4.6.2, §6, §3.X）, `../db/001__shared_db_SPEC.md`, `./README.md`

---

## 1. 提供インターフェース
- `AiClient`（interface）: `generate(prompt, opts)` / `review(content, criteria, opts)` を持つ。実装版 `AnthropicClient`（実 SDK）と `MockAiClient`（テスト注入）を分離（可逆性原則 O35）。
- `runCrossValidation(content, { models, stages })`: 生成物を複数モデル/多段で検証し `reviews` レコードを蓄積、合格判定（[論点-001]）を返す。**異モデルクロス検証（Claude 生成 × gpt-4o-mini + Claude 別プロンプトでレビュー）を default**。
- `logAiCall(record)`: 呼び出しごとに input/output tokens + 概算コストを `ai_call_logs` に記録（§4.6.2、_shared/cost-tracking と協調）。
- すべて **server-only**（Vercel Functions 内のみ、ブラウザに API キー非露出、SEC=秘匿）。

## 2. 入出力
### 2.1 API（内部、Functions 経由）
| 関数 | 入力 | 出力 | 認証 |
| generate | prompt, model, purpose | text + usage | server env キー |
| review | content, criteria, model | verdict + findings | 同上 |
- 副作用: ai_call_logs / reviews への書き込み。Claude API への外部呼び出し（送信前 PII scrub、SEC-003）。

## 3. データモデル
- 新規なし（ai_call_logs / reviews は _shared/db 定義を使用）。

## 4. バリデーション + エラーケース
| ケース | 期待 |
| API ダウン/レート超過 | リトライ + フォールバック（事前生成キャッシュ配信は curriculum-generation 側、§6）。呼び出しは指数バックオフ |
| キー未設定 | server で明示エラー（ブラウザに漏らさない） |
| 送信コンテンツの PII | 送信前 scrub（学習入力を送らない設計、SEC-003） |

## 5. 機能固有 NFR + 既存連携
### 5.1 NFR
- キー秘匿（クライアント非露出、§3 NFR セキュリティ）。コスト積算 100%（全呼び出し記録、§4.6.2）。多段検証は数学的正確性の生命線（§3 NFR 最優先）。
### 5.2 連携
- 依存: _shared/db（ai_call_logs/reviews）。被依存: curriculum-generation（生成+検証）、learning-workbook（[論点-002] AI 同値判定フォールバック）。

## 6. タグ別追加項目
### 6.1 認可（server-only）
- 本基盤はブラウザから直接呼べない。公開エンドポイントは事前生成キャッシュのみ配信し、AI 直叩きを許さない（SEC-005 コスト爆発防止）。
### 6.6 ログ・分析
- イベント: `ai_call`（provider/purpose/model/input_tokens/output_tokens/est_cost_usd）。

## 7. スコープ外
- カリキュラム生成のオーケストレーション本体（curriculum-generation feature）。本基盤はプリミティブのみ。

## 8. 未決事項
- [論点-001]（多段検証の段数/合格基準/不一致時）は curriculum-generation 設計で具体化。本基盤は `runCrossValidation` の差し替え可能な構造で受ける。

## 9. 更新履歴
| 2026-06-20 | 初版作成 | /flow:feature |
