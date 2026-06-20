# _shared/legal 単体テスト計画

> **入力**: `./001__shared_legal_SPEC.md`, `./002__shared_legal_PLAN.md`
> **最終更新**: 2026-06-20

## 1. テストケース一覧
### 1.1 正常系
| ID | 対象 | 期待 |
| N1 | フッタ導線 | /legal/privacy・terms・sct に到達リンクが存在（O55） |
| N2 | privacy 文言 | DSR セルフサービス削除を明記、窓口削除を約束しない（SEC-004/O54） |
### 1.2 異常系
| ID | 対象 | 期待 |
| E1 | privacy 文言 | 「削除請求は窓口まで」式の履行不能定型文を含まない（grep で不在確認） |
### 1.3 境界値
| B1 | 各 legal ルート直 URL | 200 で表示 |

## 2. Mock 方針
| 対象 | 方針 |
| ルーティング | Testing Library で導線存在を assert |

## 3. カバレッジ目標
| DSR 文言整合チェック 100%（SEC-004） |

## 4. 既存ユーティリティ依存
- _shared/ui。

## 5. テスト実行環境
- Vitest + Testing Library。

## 6. 更新履歴
| 2026-06-20 | 初版作成 | /flow:feature |
