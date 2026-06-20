// 数式描画。SEC-002: trust:false で任意コマンド実行（\href javascript:, \includegraphics, \url）を防ぐ。
import katex from 'katex'

export function renderMath(latex: string): string {
  try {
    return katex.renderToString(latex, {
      trust: false,        // SEC-002: 危険コマンドを実行しない
      strict: false,
      throwOnError: false, // 不正 LaTeX はエラー span にフォールバック
      output: 'html',
    })
  } catch {
    return '<span class="katex-error">式を表示できません</span>'
  }
}
