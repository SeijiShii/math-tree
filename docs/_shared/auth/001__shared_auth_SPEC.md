# _shared/auth 仕様書（横断: 認証・認可基盤）

> **役割**: Clerk による匿名ゲスト → 課金/同期時の段階認証（progressive auth, O22）。owner 解決（SEC-001）+ ゲスト→アカウント連携時のデータ引き継ぎ + DSR セルフサービス削除導線（SEC-004）。
> **タグ**: cross-cutting, auth-required
> **最終更新**: 2026-06-20
> **入力**: `../../concept.md`（§3.X, §9.1）, `../db/001__shared_db_SPEC.md`, `./README.md`

---

## 1. 提供インターフェース
- `requireOwner(ctx)` / `getOwnerId(req)`: Clerk セッション（匿名ゲスト含む）から owner_id（text）を解決。db の `withOwner` と協調（SEC-001）。
- `establishGuestSession()`: 初回起動でアカウント不要の匿名セッションを確立（0 タップ学習開始）。Clerk Anonymous sign-in。
- `linkGuestToAccount({ provider })`: 課金/同期時に Google OAuth 等へ段階認証 + ゲスト進捗データ引き継ぎ。
- `deleteAllOwnerData()`: in-app セルフサービス「全データ削除」（db.purgeOwnerData 呼び出し、SEC-004 の実体）+ 自分の全データ閲覧（開示の履行）。

## 2. 入出力
### 2.1 API（Functions 経由）
| 関数 | 入力 | 出力 | 認証 |
| establishGuestSession | — | guest session token | 公開（匿名発行） |
| requireOwner | request | owner_id | Clerk セッション |
| linkGuestToAccount | provider | linked account | ゲスト→authed |
| deleteAllOwnerData | （認証主体） | 削除完了 | 本人のみ |
- 副作用: Clerk セッション確立、ゲスト→アカウントのデータ移行、owner データの cascade 削除。

## 3. データモデル
- owner_id は Clerk の user id（匿名含む）。db の owner-scoped テーブルが参照。新規テーブルなし。

## 4. バリデーション + エラーケース
| ケース | 期待 |
| 未認証で保護 API | 匿名ゲストでも establishGuestSession 済みなら owner で 200（401 で詰まらせない、P4.46） |
| owner 不一致アクセス | db withOwner で 0 件（SEC-001） |
| deleteAllOwnerData | 本人の全データ実削除、他人/公開データ不変（SEC-004） |
| ゲスト→アカウント連携 | 既存ゲスト進捗が連携先に引き継がれる（取りこぼしなし） |

## 5. 機能固有 NFR + 既存連携
### 5.1 NFR
- **本番セッション経路の実コードを持つ**（stub 注入だけにしない、P4.46 ハードゲート）。匿名→authed で保護 API が 200。
### 5.2 連携
- 依存: _shared/db（withOwner/purgeOwnerData）。被依存: 全 owner-scoped 機能（progress/support/feedback）、support（課金時連携）。

## 6. タグ別追加項目
### 6.1 認可（auth-required）
- ロール: guest / user（運用者 admin は本 PJ では不要）。所有者チェック: 全 owner-scoped API で requireOwner。
- 認証摩擦設計（O22）: 初回起動はアカウント不要、クラウド同期/課金時のみ認証要求。重い MFA/実名強制は回避。

## 7. スコープ外
- 運用者向け identify/list/delete ツール（匿名で incoherent、O54）。作らない。

## 8. 未決事項
- 現時点で論点なし（2026-06-20）。ゲスト→アカウントのデータ引き継ぎ詳細は Clerk Anonymous→linking パターンに従う。

## 9. 更新履歴
| 2026-06-20 | 初版作成 | /flow:feature |
