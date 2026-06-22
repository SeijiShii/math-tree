# 根本原因分析: MathLive フォント 404

## 1. 5 Whys
| # | 問い | 答え |
|---|---|---|
| Why1 | なぜフォントが 404 か | MathLive が /assets/fonts を要求するがそこにフォントが無い |
| Why2 | なぜ無いか | mathlive のフォント（node_modules/mathlive/fonts）が public/ にも dist にも配信されていない |
| Why3 | なぜ配信されないか | Vite は import されない静的アセットを自動コピーしない。public/ にも置いていない |
| Why4 | なぜ /assets/fonts を見るのか | MathfieldElement.fontsDirectory 未設定 → MathLive が bundle (/assets/*.js) 相対で fonts を推定 |
| Why5（根本原因） | なぜ未設定/未配信か | **MathLive 統合時に「フォント資産の配信 + fontsDirectory 設定」という配備手順が実装・テスト計画に無かった**（ブラウザ実機でしか露見しない＝unit/build green をすり抜けた） |

## 2. 直接原因
| ファイル | 箇所 | 問題 |
|---|---|---|
| src/features/learning-workbook/WorkbookView.tsx | `import "mathlive"` のみ | fontsDirectory 未設定 |
| （配信） | public/mathlive/fonts 不在 | フォント資産が配信されない |

## 3. 根本原因
MathLive のフォント配備（資産コピー + fontsDirectory 固定）が統合手順から漏れ、ブラウザ実機でのみ顕在化する 404 が build/unit green をすり抜けた。

## 4. 寄与要因
| 種別 | 内容 |
|---|---|
| テスト不足 | フォント資産の実在を検証するテストが無かった |
| 外部要因 | MathLive の既定 fontsDirectory が bundle 相対で本番レイアウトに不適合 |
