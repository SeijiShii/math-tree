/**
 * 単純な in-memory レート制限（単一プロセス dev / serverless cold-start ごと）。
 * 本番で分散制限が要れば Upstash 等に差し替え（interface 維持）。匿名量産防止（SEC）。
 */
export interface RateLimiter {
  allow(key: string): Promise<boolean>
}

export class InMemoryRateLimiter implements RateLimiter {
  private hits = new Map<string, number[]>()
  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
  ) {}

  async allow(key: string): Promise<boolean> {
    const now = Date.now()
    const arr = (this.hits.get(key) ?? []).filter((t) => now - t < this.windowMs)
    if (arr.length >= this.limit) {
      this.hits.set(key, arr)
      return false
    }
    arr.push(now)
    this.hits.set(key, arr)
    return true
  }
}

/** 制限しない（テスト/未配線時の既定）。 */
export const allowAllRateLimiter: RateLimiter = { allow: async () => true }
