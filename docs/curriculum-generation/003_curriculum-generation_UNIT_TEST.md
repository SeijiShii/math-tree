# curriculum-generation 単体テスト計画

> **入力**: 001 SPEC, 002 PLAN
> **最終更新**: 2026-06-20

## 1. テストケース一覧
### 1.1 正常系
| N1 | generate(mock) | 単元/エッジ/問題/模範解答を構造生成 |
| N2 | validate 全段 pass | verification_status=verified |
| N3 | GET /curriculum/:line | verified のみ返す |
### 1.2 異常系
| E1 | validate 不一致 | under_review 差し戻し + 再生成フラグ（[論点-CG1]） |
| E2 | 生成エッジ循環 | 検出して拒否 |
| E3 | 公開取得が draft | 除外（verified のみ） |
| E4 | 公開から AI 直叩き | 不可（キャッシュのみ、SEC-005） |
### 1.3 境界値
| B1 | 重大指摘 1 件 | verified にしない（合格基準） |

## 2. Mock 方針
| AI | MockAiClient（生成/検証） |
| db | テスト DB |

## 3. カバレッジ目標
| 行 80% / 分岐 70% / verified ゲート経路 100%（正確性の生命線） |

## 4. 既存ユーティリティ依存
- _shared/ai, _shared/db, _shared/cost-tracking。

## 5. テスト実行環境
- Vitest（実 AI 呼ばない）。

## 6. 更新履歴
| 2026-06-20 | 初版作成 | /flow:feature |
