// セッション → owner 解決（O35 injectable: 実 Clerk は integration phase で inject）
export interface SessionContext { ownerId: string | null }
export interface SessionProvider { resolve(req: unknown): Promise<SessionContext> }

export class MissingOwnerError extends Error {
  constructor() { super('owner not resolved (401)'); this.name = 'MissingOwnerError' }
}

// 匿名ゲストセッション確立（0 タップ学習開始、O22）。実 Clerk は signInAnonymously を inject。
export function establishGuestSession(): SessionContext {
  return { ownerId: `guest_${crypto.randomUUID()}` }
}

// 保護 API の owner 強制（SEC-001）。匿名ゲストでも owner があれば通る（401 にしない、P4.46）。
export async function requireOwner(provider: SessionProvider, req: unknown): Promise<string> {
  const ctx = await provider.resolve(req)
  if (!ctx.ownerId) throw new MissingOwnerError()
  return ctx.ownerId
}
