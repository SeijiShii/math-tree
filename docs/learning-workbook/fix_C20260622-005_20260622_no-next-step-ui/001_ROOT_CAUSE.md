# 根本原因
## 5 Whys
| # | 問い | 答え |
|---|---|---|
| Why1 | なぜ次へ進めないか | 正解時に習得処理も導線提示もしていない |
| Why2 | なぜ習得処理が無いか | 習得 endpoint（SPEC §2.2）が未実装で、masterUnitAndUnlock がどこからも呼ばれない |
| Why3 | なぜ未実装か | grade-step（採点）まで作って「習得→アンロック」工程を配線しなかった |
| Why4 | なぜ漏れたか | 「採点が動く」を完了基準にし、体験ループの完了（習得→次へ）の到達性を検証しなかった |
| 根本原因 | — | 学習ループ完了（習得→アンロック→次へ）の endpoint + UI 配線漏れ。正解メッセージが実装と乖離して over-promise |
## 直接原因
- 習得 endpoint 不在 / WorkbookView に習得呼び出し・完了 UI なし / grade-step は progress 前進なし。
## 寄与要因
| テスト不足 | 完了ループの到達性テストが無い |
| 実装漏れ | SPEC §2.2 endpoint 未作成、master.ts orphaned |
