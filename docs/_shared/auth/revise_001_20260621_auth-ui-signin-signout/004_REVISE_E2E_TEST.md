# _shared/auth E2E テスト計画（連携 / サインアウト UI 動線追加）

> **入力**: `./001_REVISE_SPEC.md`, `../../concept.md` §1.1
> **最終更新**: 2026-06-21

---

## 1. 変更 UC シナリオ

### UC-link / UC-signout（連携 ↔ サインアウト の両輪、可逆性）
| シナリオ ID | 前提 | 操作ステップ | 期待結果 |
|---|---|---|---|
| AUTH-S1 (happy, mock provider) | ゲストで進捗あり / Clerk seam=mock available | マイデータ→「Googleで連携」→(mock OAuth)→連携 | 状態=連携済み表示 / link API 204 / guest token clear |
| AUTH-S2 (両輪) | AUTH-S1 後（連携済み）| 「サインアウト」押下 | 状態=ゲスト表示 / 新規ゲスト確立 / white-screen にならない |
| AUTH-S3 (edge, keyless) | Clerk seam unavailable（publishable key なし）| マイデータ表示 | 「準備中（公開後に有効）」で連携ボタン無効、ゲスト学習は継続可 |
| AUTH-S4 (edge, 連携失敗) | seam available / link API 401 をモック | 連携試行 | エラーメッセージ表示 / ゲスト状態維持 / 詰まない |

## 2. リグレッションシナリオ（既存 UC、重要度高）
| UC | シナリオ ID | 確認観点 |
|---|---|---|
| 0タップ学習開始（O22 A）| REG-1 | 連携 UI 追加後も初回起動でゲスト確立 → tech-tree 表示が不変 |
| DSR セルフ削除（SEC-004）| REG-2 | AccountView の「全データ削除」が AuthSection 追加後も動作 |
| owner-scoped API（SEC-001）| REG-3 | 連携 token 切替後も他人データが見えない |

## 3. 移行検証シナリオ
なし（マイグレーション不要）。

## 4. 環境要件差分
| 項目 | 前回 | 今回 | 理由 |
|---|---|---|---|
| Clerk フロント | — | mock provider（local headless）/ 実 OAuth は release smoke | keyless で E2E 緑、実 OAuth は実キー時 |
| 認証 | guest のみ | guest + mock linked | 両輪検証 |

> **実 OAuth の aged-guest smoke は release Phase 2 で実施**（O22 step-up/reverification、production+aged guest で連携が 403 詰みしないこと）。本 E2E 計画は mock provider による local headless の両輪可逆性を担保する。

## 5. 期待 KPI
| 指標 | 目標 |
|---|---|
| シナリオ成功率 | 100%（mock provider）|
| 両輪可逆性（連携→サインアウト→ゲスト）| white-screen ゼロ |

## 6. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-21 | 初版作成 | /flow:revise |
