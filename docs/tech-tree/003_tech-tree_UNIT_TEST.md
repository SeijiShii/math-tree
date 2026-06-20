# tech-tree 単体テスト計画

> **入力**: 001 SPEC, 002 PLAN
> **最終更新**: 2026-06-20

## 1. テストケース一覧
### 1.1 正常系
| N1 | グラフ組成 | verified+progress を結合し state 付きノードを返す |
| N2 | UnitNode 状態色 | mastered/unlocked/locked/romance が design §2.1 配色 |
| N3 | アンロック連動 | progress mastered で次ノードが unlocked 表示 |
### 1.2 異常系
| E1 | 他人 progress | requireOwner で拒否（SEC-001） |
| E2 | 未解放ノードの学ぶ導線 | 無効化 |
### 1.3 境界値
| B1 | ノード多数 | 周辺フォーカスで描画（一括描画しない） |
| B2 | ロマンノード | 遠景表示・学習導線なし |

## 2. Mock 方針
| React Flow | Testing Library（ノード/エッジ存在） |
| db | テスト DB |

## 3. カバレッジ目標
| 行 80% / 分岐 70% / 状態色 + owner 経路 100% |

## 4. 既存ユーティリティ依存
- _shared/ui(nodeStyle), _shared/db。

## 5. テスト実行環境
- Vitest + Testing Library。

## 6. 更新履歴
| 2026-06-20 | 初版作成 | /flow:feature |
