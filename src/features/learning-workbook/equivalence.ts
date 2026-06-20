// [論点-LW1] 数式同値判定: CAS 正規化（mathjs）優先。判定不能は null → AI フォールバック。
import { simplify, parse } from 'mathjs'

// MathLive の内部 LaTeX を mathjs 構文へ軽変換（中学数学の縦スライス範囲）
export function latexToExpr(latex: string): string {
  return latex
    .replace(/\\left|\\right/g, '')
    .replace(/\\cdot|\\times/g, '*')
    .replace(/\\div/g, '/')
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '(($1)/($2))')
    .replace(/\\sqrt\{([^{}]+)\}/g, 'sqrt($1)')
    .replace(/\\[a-zA-Z]+/g, '')
    .replace(/\s+/g, '')
    .trim()
}

// 同値判定。true/false で確定、parse 不能なら null（AI フォールバックへ）。
export function areEquivalent(aLatex: string, bLatex: string): boolean | null {
  try {
    const a = latexToExpr(aLatex)
    const b = latexToExpr(bLatex)
    parse(a); parse(b) // パース可能性チェック
    const diff = simplify(`(${a}) - (${b})`)
    return diff.toString() === '0'
  } catch {
    return null
  }
}
