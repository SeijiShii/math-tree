// [論点-LW1] 数式同値判定: CAS 正規化（mathjs）優先。判定不能は null → AI フォールバック。
import { simplify, rationalize, parse } from "mathjs";

// MathLive の内部 LaTeX を mathjs 構文へ軽変換（中学数学の縦スライス範囲）
export function latexToExpr(latex: string): string {
  return (
    latex
      .replace(/\\left|\\right/g, "")
      .replace(/\\cdot|\\times/g, "*")
      .replace(/\\div/g, "/")
      .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "(($1)/($2))")
      .replace(/\\sqrt\{([^{}]+)\}/g, "sqrt($1)")
      // 累乗 x^{2} → x^(2)（MathLive の上付き、mathjs が解釈できる形へ。式の展開で必要）
      .replace(/\^\{([^{}]+)\}/g, "^($1)")
      .replace(/\\[a-zA-Z]+/g, "")
      .replace(/\s+/g, "")
      .trim()
  );
}

// 同値判定。true/false で確定、parse 不能なら null（AI フォールバックへ）。
export function areEquivalent(aLatex: string, bLatex: string): boolean | null {
  try {
    const a = latexToExpr(aLatex);
    const b = latexToExpr(bLatex);
    parse(a);
    parse(b); // パース可能性チェック
    const diff = `(${a}) - (${b})`;
    // simplify は積を展開しないため、分配・展開は rationalize で多項式正規化して 0 判定。
    if (simplify(diff).toString() === "0") return true;
    if (rationalize(diff).toString() === "0") return true;
    return false;
  } catch {
    return null;
  }
}

// 「=」で区切る（中学数学の等式チェーン。\le \ge \ne 等は \command なので "=" を含まず誤分割しない）。
function splitEqualsChain(latex: string): string[] {
  return latex
    .split("=")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

// 計算の途中経過（イコールで繋いだ式）を採点する（concept UC#5 途中式入力）。
//   例: "-3+5=2" / "(-3)+5 = 5-3 = 2" を 1 入力として受け付ける。
//   判定: ① 各セグメントが相互に同値（途中式が正しい）かつ ② 末尾（答え）が模範解答と同値 → 正解。
//   いずれかのセグメントが parse 不能なら null（AI フォールバック/案内へ）。
export function gradeProcess(
  inputLatex: string,
  modelLatex: string,
): boolean | null {
  const segs = splitEqualsChain(inputLatex);
  if (segs.length === 0) return null;
  // チェーン内部の整合（途中式が正しいか）。1 セグメントなら検査なし。
  for (let i = 0; i < segs.length - 1; i++) {
    const eq = areEquivalent(segs[i], segs[i + 1]);
    if (eq === null) return null;
    if (eq === false) return false; // 途中式に誤りがある
  }
  // 末尾（最終的な答え）が模範解答と一致するか。
  return areEquivalent(segs[segs.length - 1], modelLatex);
}
