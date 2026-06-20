# tech-tree E2E テスト計画

> **入力**: 001 SPEC, ../concept.md §1.1
> **最終更新**: 2026-06-20

## 1. ユーザージャーニー
| TT-S1 (happy) | 配信 curriculum + 進捗 | ツリー表示 → ノード選択 → 豆知識 → 学ぶ | learning-workbook へ遷移 |
| TT-S2 (unlock) | 単元習得後 | 戻る | 次ノードが解放表示に更新 |
| TT-S3 (focus) | 多ノード | 初期表示 | 周辺フォーカス + ミニマップで全体把握 |

## 2. 環境要件
| ブラウザ | Chromium / WebKit |
| 画面サイズ | モバイル 360px（横一列ヘッダー O61 確認）|
| 認証 | 匿名ゲスト |

## 3. データセットアップ
- Seed: verified 中学数学1系統 + owner progress。Cleanup: progress 削除。

## 5. レイアウト・ビジュアル検証
- Level 1 (snapshot): ✅ ツリー画面（状態色）
- Level 2 (意味的): ✅ 習得/解放/未解放が色で区別、ミニマップ存在、ヘッダー横一列（O61）（7 点）
- Level 3 (AI Vision): ❌（MVP は Level 1/2）

## 6. 期待 KPI
| シナリオ成功率 100% / 周辺フォーカスで初期描画 |

## 7. 更新履歴
| 2026-06-20 | 初版作成 | /flow:feature |
