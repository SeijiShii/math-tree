# curriculum-generation 機能仕様書

> **役割**: AI がテックツリー/単元/豆知識/問題/模範解答を生成し、別 AI が多段クロス検証して数学的正確性をゲートし、verified のみキャッシュ配信する（事前生成）。
> **タグ**: feature, server-only, analytics（生成コスト）
> **最終更新**: 2026-06-20
> **入力**: `../concept.md`（§1, §4.1, §6, §8 [論点-001]）, `./README.md`

---

## 1. 詳細 UC（生成パイプライン）
### UC-CG1: カリキュラム事前生成 + 多段検証
- トリガー: 生成バッチ実行（運用者、`npm run generate:curriculum`）
- 前提: 系統指定（MVP=中学数学 1 系統）
- 処理: ① Claude が単元/依存エッジ/豆知識/問題/模範解答を生成 → ② 別 AI（gpt-4o-mini + Claude 別プロンプト）が多段クロス検証（数学的正確性）→ ③ 全段合格で verification_status=verified → ④ キャッシュ
- 出力: verified コンテンツが DB に保存、reviews に検証履歴
- 例外: 不一致/重大指摘 → under_review のまま（未公開差し戻し）+ 再生成フラグ

### UC-CG2: キャッシュ配信
- GET /api/curriculum/:line → verified なテックツリー + 単元（公開 DTO）。公開エンドポイントは AI を直叩きしない（SEC-005）。

## 2. 入出力
### 2.1 API
| メソッド | パス | 入力 | 出力 | 認証 |
| POST | (batch) generate | line | 生成 + 検証結果 | 運用者/server |
| GET | /api/curriculum/:line | line | TechTreeGraph + UnitPublic[] | 公開（キャッシュ） |
### 2.3 副作用
- units/unit_edges/problems/steps 書き込み、reviews 記録、ai_call_logs 積算。

## 3. データモデル
- 既存（units/edges/problems/steps/reviews）を使用。生成バッチが投入。

## 4. バリデーション + エラーケース
| 対象 | ルール |
| 公開取得 | verified のみ配信（draft/under_review 除外） |
| 多段検証不一致 | [論点-001] 合格基準（異モデル多数決 + 重大指摘ゼロ）未達 → 未公開差し戻し |
| 循環依存 | 生成エッジの循環を検出して拒否 |
| 公開から AI 直叩き | 不可（事前生成キャッシュのみ、SEC-005） |

## 5. 機能固有 NFR + 既存連携
### 5.1 NFR
- **数学的正確性（最優先）**: verified のみ公開。多段クロス検証が品質の生命線（§3 NFR）。生成コストは事前生成 + キャッシュで抑制（§4.6）。
### 5.2 連携
- 依存: _shared/ai(crossValidation), _shared/db(units/reviews), _shared/types, _shared/cost-tracking。被依存: tech-tree（グラフ表示）, learning-workbook（問題取得）。

## 6. タグ別追加項目
### 6.6 ログ・分析
- イベント: `curriculum_generated`(line/units/verified率), `review_stage`(model/verdict)。

## 7. スコープ外
- 最先端ロマンノードの実単元生成（concept §1.2 除外、将来）。

## 8. 未決事項
### [論点-CG1] 多段クロス検証の具体設計（concept [論点-001] を継承）
- 影響範囲: 生成バッチ, _shared/ai
- 推奨: 異モデル 2 系統（Claude 生成 → gpt-4o-mini + Claude 別プロンプトでレビュー）の多数決 + 重大指摘ゼロで verified
- 判断期限: 実装着手前
- 担当: seiji

## 9. 更新履歴
| 2026-06-20 | 初版作成 | /flow:feature |
