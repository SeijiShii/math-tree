# learning-workbook 変更仕様書（複数問題プール + ランダム出題 + 合格率 + ライブスコア）
> 改修種別: 機能拡張 / issue: C20260622-006 / 起点クレーム: ../claim_C20260622-006_20260622_problem-pool-scoring/001_TRIAGE.md
> 基準 SPEC: ../001_learning-workbook_SPEC.md / 最終更新: 2026-06-22 / タグ: feature, auth-required(owner), stateful
## 1. 変更概要
1単元1問・即習得だった学習を、**複数問題プールからランダム出題し、セッションの正答率が合格率（60%）以上で習得→アンロック**するモデルに拡張。解きながらライブスコアを表示。
## 2. 変更前 vs 変更後
### 2.1 UC 変更
| UC | 変更前 | 変更後 |
|---|---|---|
| 解く | 先頭 problem 1 問のみ・毎回同じ | プールから K 問（既定 5、プール<5 なら全部）をランダム抽出して順に解く |
| 採点 | 先頭 problem step0 固定 | problemId 指定でその問題を採点 |
| 習得 | 1 問正解で即 mastered | セッション正答率 ≥ PASS_RATE(0.6) で mastered→アンロック。未満は再挑戦（新ランダム抽出） |
| スコア | なし | 解答ごとに「現在 X/K 正解（Y%）」をライブ表示、終了時に合否 |
### 2.2 入出力変更
| 対象 | 変更前 | 変更後 | 互換 |
|---|---|---|---|
| GET /api/problem?slug= | 先頭 1 問（statement+steps、模範解答非含） | **セッション**= K 問の配列 [{problemId, statementLatex, steps[order,hint]}]（模範解答非含、SEC-002） | 形状変更（単一→配列） |
| POST /api/grade-step | {slug, stepIndex, latex} | {slug, **problemId**, stepIndex, latex}（problemId でその問題を採点。無指定は先頭=後方互換） | 後方互換（problemId 任意） |
| POST /api/master?slug= | 変更なし | 変更なし（クライアントが合格時のみ呼ぶ） | — |
### 2.3 データモデル変更
| エンティティ | 変更 | マイグレーション |
|---|---|---|
| problems | 各 unit に複数行（seed 拡充。schema 変更なし、order で識別） | 不要（schema 既対応、seed データ追加のみ） |
## 3. 影響範囲
| 対象 | 影響度 | 説明 |
|---|---|---|
| learning-workbook | 高 | 採点・セッション・UI |
| _shared/db (grading) | 中 | 問題プール取得 + problemId 採点 |
| seed-data | 高 | 各単元に複数問追加 |
## 4. 後方互換性
互換維持 ✅（grade-step の problemId は任意、無指定は従来の先頭問題）。/api/problem の形状は単一→配列に変わるが、クライアント（WorkbookView）も同時改修するため実害なし。
## 5. ロールバック方針
コード revert + seed-data revert で戻せる ✅。DB は problems/progress 行が増えるのみ（破壊なし）。
## 6. リリース戦略
一括（severity medium、ゲスト専用 MVP・実ユーザー前）。tdd green → CLI デプロイ → 本番スモーク。
## 7. 詳細仕様（新仕様）
- **定数**: `SESSION_SIZE=5`, `PASS_RATE=0.6`（learning-workbook 既定。将来 unit 別可変は別途）。
- **セッション抽出**: verified problems からランダムに distinct K=min(SESSION_SIZE, pool) 問。`getProblemsForSession(slug, K)`。
- **採点**: `getStepByProblemId(problemId, stepIndex)`。gradeAnswer は problemId 優先・無指定は先頭（後方互換）。gradeProcess（途中式=チェーン、C20260622-004）は継続。
- **スコア**: クライアントが正答数/解答数を保持しライブ表示。
- **合否**: K 問すべて解答後、正答率 ≥ PASS_RATE → /api/master 呼び出し→完了パネル（習得🎉+アンロック+テックツリーへ）。未満 → 「合格まであと少し。もう一度」→ 新セッション再抽出。
## 9. 未決事項
現時点で論点なし（2026-06-22）。出題数/合格率の unit 別可変・AI 生成プール（curriculum-generation 配線）は将来拡張（本改修は seed 拡充 + 仕組み）。
