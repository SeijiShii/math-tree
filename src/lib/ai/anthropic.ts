// 実 Anthropic AiClient（O35 の実 SDK 差し替え）。
// computed specifier で @anthropic-ai/sdk を遅延 import（未 install でも build/typecheck を壊さない）。
// CAS 判定不能時のフォールバック採点に使う。ANTHROPIC_API_KEY が無ければ makeAiClientFromEnv が null を返す。
import type { AiClient, GenerateResult, ReviewResult } from './types'
import type { AiPurpose } from '../../types/enums'

export class AnthropicAiClient implements AiClient {
  constructor(
    private apiKey: string,
    private reviewModel = 'claude-haiku-4-5-20251001',
  ) {}

  private async sdk(): Promise<any> {
    const spec = ['@anthropic-ai', 'sdk'].join('/')
    const mod: any = await import(/* @vite-ignore */ spec)
    const Anthropic = mod.default ?? mod.Anthropic
    return new Anthropic({ apiKey: this.apiKey })
  }

  async generate(prompt: string, opts: { model: string; purpose: AiPurpose }): Promise<GenerateResult> {
    const client = await this.sdk()
    const msg = await client.messages.create({
      model: opts.model || this.reviewModel,
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })
    const text = msg.content?.[0]?.text ?? ''
    return {
      text,
      usage: { inputTokens: msg.usage?.input_tokens ?? 0, outputTokens: msg.usage?.output_tokens ?? 0 },
      model: opts.model,
    }
  }

  async review(content: string, criteria: string, _opts: { model: string }): Promise<ReviewResult> {
    const client = await this.sdk()
    const prompt = `${criteria}\n\n${content}\n\n判定を JSON 1 行で: {"verdict":"pass"|"fail","critical":true|false,"findings":"..."}`
    const msg = await client.messages.create({
      model: this.reviewModel,
      max_tokens: 256,
      messages: [{ role: 'user', content: prompt }],
    })
    const text: string = msg.content?.[0]?.text ?? ''
    let verdict: 'pass' | 'fail' = 'fail'
    let critical = false
    let findings = ''
    try {
      const j = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] ?? '{}')
      verdict = j.verdict === 'pass' ? 'pass' : 'fail'
      critical = !!j.critical
      findings = String(j.findings ?? '')
    } catch {
      verdict = /pass|同値/.test(text) ? 'pass' : 'fail'
    }
    return {
      verdict,
      critical,
      findings,
      model: this.reviewModel,
      usage: { inputTokens: msg.usage?.input_tokens ?? 0, outputTokens: msg.usage?.output_tokens ?? 0 },
    }
  }
}

// env にキーがあれば実クライアント、無ければ null（呼び出し側で CAS のみ + 準備中案内に degrade）。
export function makeAiClientFromEnv(): AiClient | null {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return null
  return new AnthropicAiClient(key)
}
