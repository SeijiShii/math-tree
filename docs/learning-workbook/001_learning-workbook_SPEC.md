# learning-workbook 機能仕様書

> **役割**: WYSIWYG 数式エディタ（MathLive）でステップ別に途中式を書き、模範解答とステップ単位で照合する自己採点。習得判定までを担う。
> **タグ**: feature, auth-required(owner), stateful（ステップ進行）
> **最終更新**: 2026-06-20
> **入力**: `../concept.md`（§1.1 UC5-7, §3, §8 [論点-002]）, `./README.md`

---

## 1. 詳細 UC
### UC-LW1: 単元を解く（concept §1.1 #5-7 由来）
- トリガー: テックツリーで解放済み単元を選択
- 前提: ゲスト/ユーザーセッション（owner）、単元に verified 問題がある
- 入力: MathLive で 1 ステップの途中式（内部 LaTeX）
- 処理: ステップを模範解答と照合（[論点-002] CAS 正規化優先 + AI フォールバック）→ 一致なら次ステップ、不一致なら「惜しい、見直して」
- 出力: ステップ結果表示、最終ステップ到達で習得 → progress を mastered に、次ノードアンロック
- 例外: 照合不能/AI ダウン → ヒント提示 + リトライ

## 2. 入出力
### 2.1 API
| メソッド | パス | 入力 | 出力 | 認証 |
| GET | /api/units/:slug/problem | slug | StepPrompt[]（模範解答非含、SEC-002） | owner |
| POST | /api/grade-step | {problemId, stepIndex, latex} | {match: bool, hint?} | owner |
| POST | /api/units/:slug/master | slug | {mastered, unlockedNext[]} | owner |
### 2.3 副作用
- progress 更新（mastered）+ 次ノード unlocked。grade-step が CAS/AI を server で実行。

## 3. データモデル
- 既存（units/problems/steps/progress）を使用。新規なし。StepPrompt は model_answer を含まない（SEC-002）。

## 4. バリデーション + エラーケース
| 対象 | ルール |
| latex 入力 | Zod 検証 + KaTeX trust:false 描画（SEC-002） |
| grade-step | server 側で照合（クライアントに模範解答を出さない） |
| 他人の progress 更新 | requireOwner で拒否（SEC-001） |
| エラー: 照合不能 | ヒント + リトライ、習得は進めない |

## 5. 機能固有 NFR + 既存連携
### 5.1 NFR
- 照合精度（同値な式の表現揺れを正解扱い、§3 NFR 最優先、[論点-002]）。数式入力レイテンシ最小。
### 5.2 連携
- 依存: _shared/db, _shared/types, _shared/ui(Katex/MathLive), _shared/auth(owner), _shared/ai([論点-002] AI フォールバック)。被依存: tech-tree（習得→アンロック連動）。

## 6. タグ別追加項目
### 6.1 認可
- 所有者: progress は requireOwner。模範解答は server-only。
### 6.2 状態遷移
- ステップ: pending → 各ステップ matched → 全ステップ matched で unit mastered。後退なし。

## 7. スコープ外
- リアルタイム AI 添削（自己採点がコア、将来）。SRS 復習（v2）。

## 8. 未決事項
### [論点-LW1] 数式同値判定の実装（concept [論点-002] を継承）
- 影響範囲: grade-step API, _shared/ai
- 推奨: CAS 正規化（server, 例: sympy 相当）優先 + 判定不能時のみ AI 照合（コストと精度両立）
- 判断期限: 実装着手前（Phase 2）
- 担当: seiji

## 9. 更新履歴
| 2026-06-20 | 初版作成 | /flow:feature |

> **採点入力（C20260622-004 確定）**: 解答は「計算の途中経過」をイコールで繋いで 1 入力として書ける（例: `-3+5 = 2`、複数ステップのチェーン可）。採点は各セグメントの相互同値（途中式の正しさ）＋末尾＝模範解答で判定する（`gradeProcess`）。模範解答のみ/式のみの入力も可。
