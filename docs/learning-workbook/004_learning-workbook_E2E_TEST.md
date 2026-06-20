# learning-workbook E2E テスト計画

> **入力**: 001 SPEC, ../concept.md §1.1
> **最終更新**: 2026-06-20

## 1. ユーザージャーニー
### UC-LW1: 単元を解いて習得
| シナリオ | 前提 | 操作 | 期待 |
| LW1-S1 (happy) | 解放済み単元 | ステップを正しく入力×全ステップ | 習得表示 + 次ノードアンロック |
| LW1-S2 (edge) | 誤った途中式 | 不正解ステップ入力 | 「惜しい」ヒント、習得進まず |
| LW1-S3 (equiv) | 等価な別表現 | `3+2x` 入力（模範 `2x+3`） | 正解扱い（[論点-LW1]） |

## 2. 環境要件
| ブラウザ | Chromium（主）/ WebKit |
| 画面サイズ | モバイル中心（360px）|
| 認証 | 匿名ゲストセッション |
| オフライン | ❌ |

## 3. データセットアップ
- Seed: verified unit + problem + steps（normalized_form 付き）。
- Cleanup: テスト owner の progress 削除。

## 5. レイアウト・ビジュアル検証
- Level 1 (snapshot): ✅ 学習画面
- Level 2 (意味的): ✅ MathLive 入力欄が主役、ステップ結果が視認できる（5 点）
- Level 3 (AI Vision): ❌（コスト回避、重要画面だが MVP では Level 1/2）

## 6. 期待 KPI
| シナリオ成功率 100% / 同値判定の誤判定 0 |

## 7. 更新履歴
| 2026-06-20 | 初版作成 | /flow:feature |
