# 単体テストレポート: _shared/auth 連携/サインアウト UI 動線（revise 001）

## 実施日時
2026-06-21 18:33 (JST)

## 関連ドキュメント
- [003_REVISE_UNIT_TEST.md] — 単体テスト項目（計画）

## テスト実行環境
- TypeScript / Vite, Vitest v3.2.6（jsdom for UI）

## テスト結果
| # | テストケース | テストファイル | 結果 | 備考 |
|---|---|---|---|---|
| N2 | 連携成功（guest Bearer + account_token, guest token clear）| authClient.test.ts | ✅ | |
| E3 | seam unavailable → unavailable, API 呼ばない | authClient.test.ts | ✅ | |
| E2 | OAuth キャンセル → cancelled, guest 維持 | authClient.test.ts | ✅ | |
| E1 | link API 401 → failed, guest 維持 | authClient.test.ts | ✅ | |
| E4 | fetch reject → failed, guest 維持 | authClient.test.ts | ✅ | |
| N3 | signOut: Clerk signOut + guest clear + reBootstrap | authClient.test.ts | ✅ | 両輪 |
| — | provider.signOut 失敗でもゲスト復帰 | authClient.test.ts | ✅ | |
| — | getAuthState が isLinked 反映 | authClient.test.ts | ✅ | |
| N4 | ゲスト&available → 連携ボタン押下で linkAccount | AccountAuthSection.test.tsx | ✅ | |
| E3-UI | unavailable → 「準備中」無効, linkAccount 呼ばない | AccountAuthSection.test.tsx | ✅ | |
| N5 | 連携済み → サインアウトボタン押下で signOut | AccountAuthSection.test.tsx | ✅ | |
| M1 | AccountView に認証セクション存在 | AccountView.test.tsx | ✅ | |

## 追加テストケース
追加テストケースなし（計画 003 を全実装）。

## サマリー
| 項目 | 値 |
|---|---|
| 計画テスト数 | 13 |
| 追加テスト数 | 0 |
| 合計 | 13 |
| 成功 | 13（プロジェクト全体 109 passed）|
| 失敗 | 0 |
| 成功率 | 100% |
