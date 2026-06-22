import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { configureMathlive } from "../../lib/mathlive-setup";
import { Button } from "../../components/ui/Button";
import { SupportButton } from "../support/SupportButton";
import { apiFetch } from "../../lib/api/client";
import { scorePercent, passed, PASS_RATE } from "../../lib/learning/session";

// MathLive のフォント配信パスを固定（/assets/fonts 推定での 404 を防ぐ、C20260622-002）。
configureMathlive();

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "math-field": any;
    }
  }
}

interface SessionProblem {
  problemId: string;
  statementLatex: string;
  steps: { order: number; hint: string | null }[];
}
interface Session {
  title: string;
  trivia: string;
  problems: SessionProblem[];
}

export function WorkbookView() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [idx, setIdx] = useState(0); // 現在の問題
  const [correct, setCorrect] = useState(0); // 正答数
  const [latex, setLatex] = useState("");
  const [judged, setJudged] = useState<{ ok: boolean; msg: string } | null>(
    null,
  ); // 現問題の採点結果
  const [done, setDone] = useState<null | {
    pass: boolean;
    unlockedNext: number;
  }>(null);
  const [fieldKey, setFieldKey] = useState(0); // 入力欄リセット用

  const loadSession = useCallback(() => {
    if (!slug) return;
    setSession(null);
    setLoadError(false);
    setIdx(0);
    setCorrect(0);
    setLatex("");
    setJudged(null);
    setDone(null);
    setFieldKey((k) => k + 1);
    apiFetch(`/api/problem?slug=${encodeURIComponent(slug)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((s) => setSession(s))
      .catch(() => setLoadError(true));
  }, [slug]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const total = session?.problems.length ?? 0;
  const cur = session?.problems[idx];
  const answered = idx + (judged ? 1 : 0); // 採点済みの数

  async function grade() {
    if (!cur || judged) return;
    const r = await apiFetch("/api/grade-step", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        slug,
        problemId: cur.problemId,
        stepIndex: 0,
        latex,
      }),
    })
      .then((res) => res.json())
      .catch(() => null);
    const ok = !!r?.match;
    if (ok) setCorrect((c) => c + 1);
    setJudged({
      ok,
      msg: ok ? "正解！" : (r?.hint ?? "惜しい、見直してみましょう"),
    });
  }

  async function next() {
    if (idx + 1 < total) {
      setIdx((i) => i + 1);
      setLatex("");
      setJudged(null);
      setFieldKey((k) => k + 1);
      return;
    }
    // 最終問題 → セッション終了。合格なら習得→アンロック。
    const finalCorrect = correct; // grade() で加算済み
    if (passed(finalCorrect, total)) {
      const m = await apiFetch(
        `/api/master?slug=${encodeURIComponent(slug ?? "")}`,
        { method: "POST" },
      )
        .then((res) => (res.ok ? res.json() : null))
        .catch(() => null);
      setDone({ pass: true, unlockedNext: m?.unlockedNext?.length ?? 0 });
    } else {
      setDone({ pass: false, unlockedNext: 0 });
    }
  }

  const curHint = cur?.steps?.[0]?.hint ?? null;
  const passPct = Math.round(PASS_RATE * 100);

  return (
    <section className="workbook">
      <h1>{session?.title ?? slug}</h1>

      {loadError && (
        <p className="muted">
          問題を読み込めませんでした。少し待って開き直してください。
        </p>
      )}

      {done ? (
        done.pass ? (
          <div className="mastered-panel">
            <p className="mastered-title">習得しました 🎉</p>
            <p className="muted">
              {correct} / {total} 正解（{scorePercent(correct, total)}点）。
              {done.unlockedNext > 0
                ? "次の単元が開きました。テックツリーから続けて学べます。"
                : "この系統はここまでです。テックツリーで全体を確認できます。"}
            </p>
            <Button variant="accent" onClick={() => navigate("/")}>
              テックツリーに戻る
            </Button>
          </div>
        ) : (
          <div className="failed-panel">
            <p className="failed-title">
              合格まであと少し（{scorePercent(correct, total)}点 / 合格 {passPct}
              点）
            </p>
            <p className="muted">
              {correct} / {total}{" "}
              正解でした。問題はランダムに選ばれます。もう一度挑戦しましょう。
            </p>
            <Button variant="primary" onClick={loadSession}>
              もう一度挑戦する
            </Button>
            <Button variant="ghost" onClick={() => navigate("/")}>
              テックツリーに戻る
            </Button>
          </div>
        )
      ) : (
        session &&
        cur && (
          <>
            {/* 進捗 + ライブスコア */}
            <div className="session-progress">
              <span>
                第 {idx + 1} 問 / 全 {total} 問
              </span>
              <span className="score-badge">
                現在 {correct} / {answered} 正解
              </span>
            </div>

            {/* 問題文（読み取り専用） */}
            <div className="problem-statement">
              <math-field read-only style={{ fontSize: 24 }} key={`q${idx}`}>
                {cur.statementLatex}
              </math-field>
            </div>
            {curHint && <p className="muted">ヒント: {curHint}</p>}
            {idx === 0 && session.trivia && (
              <p className="trivia">💡 {session.trivia}</p>
            )}

            {/* 解答入力 / 採点結果 */}
            {!judged ? (
              <>
                <label className="answer-label">
                  計算の途中を書いて答え合わせ
                </label>
                <p className="muted answer-help">
                  計算の経過を「=」でつないで書けます（例: -3+5 = 2）
                </p>
                <math-field
                  class="answer-field"
                  key={`a${fieldKey}`}
                  onInput={(e: any) => setLatex(e.target.value)}
                  style={{ fontSize: 22 }}
                />
                <Button variant="primary" onClick={grade}>
                  答え合わせ
                </Button>
              </>
            ) : (
              <>
                <p className={judged.ok ? "result result-ok" : "result"}>
                  {judged.msg}
                </p>
                <Button variant="accent" onClick={next}>
                  {idx + 1 < total ? "次の問題へ" : "結果を見る"}
                </Button>
              </>
            )}
          </>
        )
      )}
      {/* tip-jar は Stripe 配線時のみ表示（VITE_ENABLE_TIPJAR）。 */}
      {import.meta.env.VITE_ENABLE_TIPJAR === "true" && <SupportButton />}
    </section>
  );
}
