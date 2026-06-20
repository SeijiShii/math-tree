# feedback 機能仕様書

> **役割**: どの画面からでも好き嫌い 👍/👎 + バグ報告を 1 タップ。自動コンテキスト付与（送信前 PII scrub）→ 即時通知 + 中央 feedback-hub へ蓄積。
> **タグ**: feature, auth-required(owner nullable), analytics
> **最終更新**: 2026-06-20
> **入力**: `../concept.md`（§1.1 UC9, §3.X, §6）, `./README.md`

---

## 1. 詳細 UC
### UC-FB1: フィードバック送信（concept §1.1 #9）
- トリガー: 常設ウィジェットを 1 タップ
- 入力: kind（like/dislike/bug）+ 任意自由記述（bug 時）
- 処理: 自動コンテキスト（画面/route/app_version/UA）付与 → **送信前 PII scrub（SEC-003）** → ① 即時通知（運用チャンネル）② feedback-hub に POST
- 出力: 「ありがとう」軽い表示（押し付けない）
- 例外: hub 未到達 → ローカル保存 + リトライ

## 2. 入出力
### 2.1 API
| POST | /api/feedback | {kind, body?, context} | {ok} | owner(nullable) |
### 2.3 副作用
- feedback テーブル書き込み（PII scrub 済 body）+ 即時通知 + hub POST（`service` ID + endpoint env）。

## 3. データモデル
- 既存 feedback テーブル使用。新規なし。

## 4. バリデーション + エラーケース
| body | Zod 検証 + 表示時エスケープ（SEC-002） |
| context | PII scrub 必須（email/位置/本文中 PII を除去、SEC-003） |
| スパム | Turnstile + レート制限（SEC-005） |
| hub ダウン | ローカル保存 + 再送 |

## 5. 機能固有 NFR + 既存連携
### 5.1 NFR
- 送信前 PII scrub 100%（SEC-003、法令）。1 タップで送れる軽さ。
### 5.2 連携
- 依存: _shared/db, _shared/ui, _shared/auth(owner nullable)。外部: feedback-hub（別 PJ、安定 ingestion 契約 `POST /api/feedback`）。**hub 未構築なら別 PJ で立ち上げを論点化（concept §1.3）**。被依存: 全画面（ウィジェット埋め込み）。

## 6. タグ別追加項目
### 6.6 ログ・分析
- イベント: `feedback_submit`(kind)。運用者→ユーザーの通知（Q12.7(2)）とは逆向き（ユーザー→運用者）。混同しない。

## 7. スコープ外
- feedback-hub 本体（別 PJ）。本機能は ingestion 契約に接続するのみ。

## 8. 未決事項
- feedback-hub が未構築なら「共有 feedback-hub を別 PJ で立ち上げ」を要検討（concept §8 候補）。MVP は即時通知 + ローカル蓄積で先行可。

## 9. 更新履歴
| 2026-06-20 | 初版作成 | /flow:feature |
