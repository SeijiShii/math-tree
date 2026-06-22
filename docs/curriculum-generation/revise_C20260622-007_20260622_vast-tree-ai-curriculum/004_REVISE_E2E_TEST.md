# E2E テスト計画
## 変更 UC（本番スモーク、Phase 5 key 後）
| ① bootstrap 実行 → GET /api/curriculum が ~40-50 単元・依存を返す ② /api/problem が各単元の verified 問題セッションを返す ③ 同単元を再挑戦して別問題が出る（プール成長×ランダム）④ Cron 手動トリガで top-up が走りプールが増える |
## リグレッション
既存 5 単元の学習ループ（解く→採点→習得→アンロック）が広大ツリーでも不変。
## 環境
ANTHROPIC_API_KEY（生成）+ CRON_SECRET（Cron）。生成は事前バッチ、公開配信は verified キャッシュ（SEC-005）。
