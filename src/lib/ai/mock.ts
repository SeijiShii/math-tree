import type { AiClient, GenerateResult, ReviewResult } from './types'

// テスト注入用（実 Anthropic SDK は integration phase で inject、O35）
export class MockAiClient implements AiClient {
  constructor(
    private scripted: {
      generate?: Partial<GenerateResult>
      reviews?: Record<string, Partial<ReviewResult>> // model -> result
    } = {},
  ) {}
  async generate(_p: string, opts: { model: string }): Promise<GenerateResult> {
    return { text: '生成結果', usage: { inputTokens: 100, outputTokens: 200 }, model: opts.model, ...this.scripted.generate }
  }
  async review(_c: string, _cr: string, opts: { model: string }): Promise<ReviewResult> {
    const r = this.scripted.reviews?.[opts.model] ?? {}
    return { verdict: 'pass', critical: false, findings: '', model: opts.model, usage: { inputTokens: 80, outputTokens: 40 }, ...r }
  }
}
