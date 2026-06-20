# _shared/ui 単体テスト計画

> **入力**: `./001__shared_ui_SPEC.md`, `./002__shared_ui_PLAN.md`
> **最終更新**: 2026-06-20

## 1. テストケース一覧
### 1.1 正常系
| ID | 対象 | 期待 |
| N1 | Button variant | primary/accent/ghost が対応トークン class を持つ |
| N2 | Katex | 妥当な LaTeX を描画 |
| N3 | nodeStyle | mastered/unlocked/locked/romance が design-system §2.1 配色 |
### 1.2 異常系
| ID | 対象 | 期待 |
| E1 | Katex 不正 LaTeX | フォールバック表示、例外を投げない（throwOnError:false） |
| E2 | Katex trust | `\href`/`\includegraphics` 等が実行されない（trust:false、SEC-002） |
### 1.3 境界値
| ID | 対象 | 期待 |
| B1 | Header 狭幅 360px | 横一列維持（nowrap）/ ブランド ellipsis |

## 2. Mock 方針
| 対象 | 方針 |
| DOM | jsdom + Testing Library（role/text） |
| KaTeX | 実物（描画検証） |

## 3. カバレッジ目標
| 行 80% / 分岐 70% / Katex trust 経路 100%（SEC-002） |

## 4. 既存ユーティリティ依存
- katex, @testing-library/react, tailwind。

## 5. テスト実行環境
- Vitest + Testing Library（jsdom）。

## 6. 更新履歴
| 2026-06-20 | 初版作成 | /flow:feature |
