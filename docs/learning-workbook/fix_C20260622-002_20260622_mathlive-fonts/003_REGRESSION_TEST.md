# リグレッションテスト計画: MathLive フォント

## 1. 再発防止テストケース（src/lib/mathlive-config.test.ts）
| ID | 対象 | 期待 |
|---|---|---|
| R1 | MATHLIVE_FONTS_DIR | === '/mathlive/fonts'（/assets/fonts 推定を上書き） |
| R2 | public/mathlive/fonts | woff2 が実在（KaTeX_Main / KaTeX_Math 含む）= 404 にならない |

## 2. 類似境界条件
| ID | 境界 | 期待 |
|---|---|---|
| R3 | 非ブラウザ環境（MathfieldElement undefined） | configureMathlive() が throw せず no-op（smoke.test で担保） |

## 3. 既存テスト維持
| ID | テスト | 維持理由 |
|---|---|---|
| K1 | smoke.test.tsx | App→WorkbookView 読込で mathlive 評価しても no-op ガードで green |

## 6. カバレッジ
mathlive-config / setup の分岐 100%。実フォント読込は本番 200 スモークで担保。
