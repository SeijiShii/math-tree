# _shared/auth 実装計画書

> **入力**: `./001__shared_auth_SPEC.md`, `../../concept.md` §3.X/§9.1
> **最終更新**: 2026-06-20

## 1. 実装対象ファイル一覧
| ファイル | 責務 | 依存 | LOC |
| `src/lib/auth/clerk.ts` | Clerk provider 設定（匿名有効化） | @clerk/clerk-react | 40 |
| `api/auth/guest.ts` | establishGuestSession（匿名発行） | clerk server | 50 |
| `api/auth/owner.ts` | requireOwner/getOwnerId（owner 解決） | clerk, db | 50 |
| `api/auth/link.ts` | linkGuestToAccount + データ引き継ぎ | clerk, db | 60 |
| `api/account/delete.ts` | deleteAllOwnerData（purge 呼び出し、SEC-004） | db | 40 |
| `src/features/account/AccountView.tsx` | 自分の全データ閲覧（開示）+ 削除導線 | ui, types | 60 |

## 2. 実装 Phase 分割（P4.46 を満たす本番経路の実コード）
### Phase 1: requireOwner/getOwnerId（owner 解決 interface + 実装）
### Phase 2: establishGuestSession（匿名）+ linkGuestToAccount（段階認証 + 引き継ぎ）
### Phase 3: deleteAllOwnerData + AccountView（DSR セルフサービス、SEC-004）
### Phase 3.5 (bootstrap): @clerk SDK install + provider 配線 + env（CLERK_*）+ .env.example 更新
- ゴール: 匿名セッション→authed owner で保護 API 200 を検証（P4.46、stub だけにしない）。

## 3. 依存関係順序
owner 解決 → guest/link → delete/AccountView → 実 SDK inject

## 4. 既存ファイルへの影響
- 全 owner-scoped API が requireOwner を使う（被依存）。

## 5. 横断フォルダへの追加・変更
- db の withOwner/purgeOwnerData を利用。

## 6. リスク・注意点
- **P4.46**: 本番で実セッションが張れる経路の実コードを必ず実装（fake 注入の service テストだけにしない）。初回 prod で全 /api 401 を防ぐ。

## 7. 完了の定義（DoD）
- [ ] 匿名セッション確立 → authed owner で保護 API 200（integration）
- [ ] ゲスト→アカウント連携でデータ引き継ぎ
- [ ] deleteAllOwnerData で全データ実削除（SEC-004）
- [ ] 実 Clerk inject 結合

## 8. 更新履歴
| 2026-06-20 | 初版作成 | /flow:feature |
