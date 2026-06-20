import { Button } from '../../components/ui/Button'
import { SUPPORT_AMOUNT_JPY } from './checkout'

export function SupportButton({ onSupport }: { onSupport?: () => void }) {
  return (
    <div className="support">
      {/* O43: 金額 + 対価を CTA 前に明示。押し付けない常設（charter §2.2） */}
      <p className="support-price">{SUPPORT_AMOUNT_JPY}円で作者を支援できます（任意）</p>
      <Button variant="accent" onClick={onSupport}>{SUPPORT_AMOUNT_JPY}円で支援</Button>
    </div>
  )
}
