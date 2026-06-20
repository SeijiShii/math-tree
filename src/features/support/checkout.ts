// tip-jar: 固定 100 円（任意金額・サブスクなし、charter §1.2）。価格透明性 O43。
export const SUPPORT_AMOUNT_JPY = 100
export function createCheckoutParams(ownerId: string) {
  return {
    mode: 'payment' as const,
    amount: SUPPORT_AMOUNT_JPY,
    currency: 'jpy',
    metadata: { ownerId },
    // 価格 + 対価を CTA 前に明示（O43）
    description: '100円で作者を支援',
  }
}
