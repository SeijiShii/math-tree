// 無料枠超過アラート（§4.6.2、想定上限の 80/100/120%）
export type AlertLevel = 'ok' | 'warn80' | 'over100' | 'over120'
export function checkFreeTierAlert(total: number, limit: number): AlertLevel {
  if (limit <= 0) return 'ok'
  const r = total / limit
  if (r >= 1.2) return 'over120'
  if (r >= 1.0) return 'over100'
  if (r >= 0.8) return 'warn80'
  return 'ok'
}
