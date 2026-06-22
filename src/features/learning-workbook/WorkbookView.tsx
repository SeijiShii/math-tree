import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { configureMathlive } from "../../lib/mathlive-setup";
import { Button } from "../../components/ui/Button";
import { SupportButton } from "../support/SupportButton";
import { apiFetch } from "../../lib/api/client";

// MathLive のフォント配信パスを固定（/assets/fonts 推定での 404 を防ぐ、C20260622-002）。
// チャンク読込時に 1 度だけ実行 = math-field の初回 render より前。
configureMathlive();

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "math-field": any;
    }
  }
}

interface LearningProblem {
  slug: string;
  title: string;
  trivia: string;
  statementLatex: string;
  steps: { order: number; hint: string | null }[];
}

export function WorkbookView() {
  const { slug } = useParams();
  const [problem, setProblem] = useState<LearningProblem | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [latex, setLatex] = useState("");
  const [result, setResult] = useState<string | null>(null);

  // 問題文を取得して表示（SPEC §6.1、模範解答は含まれない）。
  useEffect(() => {
    if (!slug) return;
    let alive = true;
    setProblem(null);
    setLoadError(false);
    apiFetch(`/api/problem?slug=${encodeURIComponent(slug)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((p) => alive && setProblem(p))
      .catch(() => alive && setLoadError(true));
    return () => {
      alive = false;
    };
  }, [slug]);

  async function grade() {
    const r = await apiFetch("/api/grade-step", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ slug, stepIndex: 0, latex }),
    })
      .then((r) => r.json())
      .catch(() => null);
    setResult(
      r?.match
        ? "正解。次のステップへ"
        : (r?.hint ?? "惜しい、見直してみましょう"),
    );
  }

  const firstHint = problem?.steps?.[0]?.hint ?? null;

  return (
    <section className="workbook">
      <h1>{problem?.title ?? slug}</h1>

      {loadError && (
        <p className="muted">問題を読み込めませんでした。少し待って開き直してください。</p>
      )}

      {problem && (
        <>
          {/* 問題文（読み取り専用の数式表示） */}
          <div className="problem-statement">
            <math-field read-only style={{ fontSize: 24 }}>
              {problem.statementLatex}
            </math-field>
          </div>
          {firstHint && <p className="muted">ヒント: {firstHint}</p>}
          {problem.trivia && (
            <p className="trivia">💡 {problem.trivia}</p>
          )}
        </>
      )}

      {/* 解答入力 */}
      <label className="muted answer-label">あなたの答え（途中式）</label>
      <math-field
        onInput={(e: any) => setLatex(e.target.value)}
        style={{ fontSize: 22 }}
      />
      <Button variant="primary" onClick={grade}>
        答え合わせ
      </Button>
      {result && <p className="result">{result}</p>}
      {/* tip-jar は Stripe 配線時のみ表示（VITE_ENABLE_TIPJAR）。ゲスト専用 MVP では非表示 */}
      {import.meta.env.VITE_ENABLE_TIPJAR === "true" && <SupportButton />}
    </section>
  );
}
