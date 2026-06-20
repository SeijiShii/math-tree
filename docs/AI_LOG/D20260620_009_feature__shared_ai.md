# AI_LOG セッション D20260620_009 — /flow:feature (_shared/ai)

**実行日時**: 2026-06-20 09:36 (+09:00)
**コマンド**: /flow:feature _shared/ai（/flow:auto 反復7、インライン実行）
**対象**: _shared/ai（横断: Claude クライアント基盤）
**状態**: 完了
**含まれる decision**: D20260620-033

## 主要決定サマリ
| D20260620-033 | Claude 基盤設計 | server-only client + runCrossValidation(異モデル多段) + costLog + piiScrub | auto-recommended |

## Decisions
```yaml
- id: D20260620-033
  timestamp: 2026-06-20T09:36:00+09:00
  command: /flow:feature
  phase: Step 2-3 / タグ + 基盤設計
  question: _shared/ai の構成
  options: []
  recommended: null
  chosen: AiClient interface(mock/実 SDK 分離) + runCrossValidation(異モデル多段) + logAiCall + piiScrub、全 server-only
  chosen_type: auto-recommended
  depends_on: [D20260620-002, D20260620-018, D20260620-029]
  context: |
    [論点-001] 多段クロス検証の差し替え可能な基盤。SEC: キー秘匿(server-only)、SEC-003 送信前 PII scrub、
    SEC-005 公開から AI 直叩き不可(事前生成キャッシュのみ)。可逆性 O35: interface→mock→実 SDK inject。
    コスト積算(§4.6.2) を全呼び出しで ai_call_logs に記録。
```
