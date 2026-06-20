# curriculum-generation E2E テスト計画

> **入力**: 001 SPEC, ../concept.md §1.1
> **最終更新**: 2026-06-20

## 1. ユーザージャーニー（主に統合/バッチ）
### UC-CG: 生成→検証→配信
| CG-S1 | 系統指定でバッチ実行（mock AI） | verified コンテンツが配信 API に出る |
| CG-S2 | 検証不一致を含む生成 | 該当単元は配信されない（under_review） |

> ユーザー操作 UI は無く、tech-tree/learning-workbook 経由で消費されるため、本 E2E は配信 API の統合検証中心（人力テスト不要、自動化）。

## 2. 環境要件
| ブラウザ | N/A（API 統合） |
| 認証 | 公開 GET（キャッシュ）+ server バッチ |

## 3. データセットアップ
- Seed: なし（バッチが生成）。Cleanup: 生成 units/reviews 削除。

## 6. 期待 KPI
| verified ゲート通過のみ配信 / under_review は非公開 |

## 7. 更新履歴
| 2026-06-20 | 初版作成 | /flow:feature |
