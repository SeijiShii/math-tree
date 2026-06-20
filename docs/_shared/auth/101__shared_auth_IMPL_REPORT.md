# 実装レポート: _shared/auth
## 実装日時
2026-06-20 12:37 (JST)
## 変更一覧
- `src/lib/auth/session.ts`: establishGuestSession（匿名 owner、O22）/ requireOwner（owner 強制、SEC-001、不在=MissingOwnerError 401）。O35 injectable（実 Clerk は integration）。
- `src/lib/auth/account.ts`: deleteAllOwnerData（DSR セルフ削除 SEC-004）/ linkGuestToAccount（ゲスト→アカウント データ引き継ぎ）。
## テスト
- 5/5 green: 匿名 owner 発行 / **匿名ゲストで保護操作が通る(401 にしない, P4.46)** / owner 不在=401 / データ引き継ぎ / DSR 全削除。typecheck green。
## P4.46 充足
匿名セッション確立 → authed owner で保護操作（progress 更新）が 200 相当で通ることを実 DB(PGlite)で検証。stub 固定注入でなく owner 解決の実経路。実 Clerk セッションは integration phase で inject。
## PR Description
### タイトル
_shared/auth: Clerk 匿名→段階認証（owner 解決 + DSR + 引き継ぎ）
