# curriculum-generation

AI 生成 + 多段クロス検証パイプライン。テックツリー/単元/豆知識/問題/模範解答を事前生成し、別 AI レビューで数学的正確性をゲートしてキャッシュする。

## このフォルダに置くドキュメント

- `001_<feature>_SPEC.md` — 仕様書（`/flow:feature` で生成）
- `002_<feature>_PLAN.md` — 実装計画書
- `003_<feature>_UNIT_TEST.md` — 単体テスト計画
- `004_<feature>_E2E_TEST.md` — E2E テスト計画
- `101_<feature>_IMPL_REPORT.md` — 実装レポート（`/dev-tdd` で生成）
- `estimate_YYYYMMDD.md` — 機能単位見積もり（`/flow:estimate` で生成）

## 関連

- 概念設計: `../concept.md` §1.3.1
- 全体見積: `../estimates/`
- 実装コード対応: `src/features/curriculum-generation/`（§1.4 参照）
