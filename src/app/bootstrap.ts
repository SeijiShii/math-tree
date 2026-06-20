// 起動時の合成: 匿名ゲストセッション確立（P4.46、0 タップ学習開始）
import { establishGuestSession, type SessionContext } from '../lib/auth/session'

export function bootstrapSession(existing?: SessionContext): SessionContext {
  if (existing?.ownerId) return existing
  return establishGuestSession() // 匿名で必ず owner を確立 → 保護 API が 401 にならない
}
