# クレーム判定レポート
**claim id**: C20260622-006 / 判定日: 2026-06-22 / **判定: 仕様変更 (revise)**
## 1. 三項照合
### 1.1 期待
複数問題/単元 + プールからランダム出題 + 合格率（60点等）で習得判定 + ライブスコア表示。
### 1.2 既存仕様 (Spec)
- learning-workbook SPEC §6.1「**1 unit = 先頭 problem の steps を順に解く想定（MVP）**」= 単一問題前提。
- 合格率・スコア・ランダム出題・問題プールの記述は SPEC に**無い**。
- DB schema: `problems`(unitId, order) は複数問題/unit を**格納可能**だが、コード（getStepForGrading/getProblemForLearning）は `orderBy(order).limit(1)` で先頭 1 問固定。
- 習得は masterUnitBySlug（1 問正解で即 mastered、C20260622-005）。
### 1.3 現実 (Actual)
- seed: 1 unit = 1 problem = 1 step。常に同一問題。スコア/合格率/ランダムなし。
### 1.4 照合結果
期待は現行 SPEC に該当記述なし（SPEC は単一問題 MVP、現実 = SPEC 通り）→ **仕様検討漏れ/仕様変更 (revise)**。learning-workbook 機能は存在するが、学習モデル（複数問・ランダム・合格率・スコア）の拡張が必要。
## 2. 判定根拠
1. 現実（1 問・即習得）は現行 SPEC §6.1（MVP 単一問題）**通り**＝バグではない。
2. 期待（複数問・ランダム・合格率・スコア）は SPEC に**未記載の新仕様**＝ feature 相当だが、learning-workbook 機能フォルダは既存で、その**改修（revise）**が適切（新規フォルダ feature ではない）。
3. よって **revise**（learning-workbook の学習モデル拡張）。
## 3. 推奨分岐先
- **コマンド**: `/flow:revise`
- **引数**: `learning-workbook C20260622-006 --from-claim=C20260622-006`
- **改修方向（revise で設計）**:
  1. **問題プール**: 1 unit に複数 problem（簡単な単元は ~10）。seed/curriculum-generation で問題群を用意（schema は既に対応）。
  2. **ランダム出題**: セッション開始時にプールから N 問をランダム抽出（毎回同じにしない）。
  3. **合格率**: セッションの正答率が閾値（例 60%）以上で習得→アンロック。未満は再挑戦。閾値の所在（unit 固定 or 全体既定）は設計判断。
  4. **ライブスコア**: 解答ごとに「現在 X/N 正解（Y点）」を表示。
  - 設計論点（revise で 1問1答）: 1セッションの出題数、合格閾値の既定値/可変性、問題の出所（seed 拡充 vs curriculum-generation 連携）、進捗の永続（途中保存要否）。
## 6. 関連
- クレーム原文: ./000_CLAIM_REPORT.md / 分岐先: ../revise_C20260622-006_20260622_*/
