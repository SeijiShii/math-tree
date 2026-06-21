import { useState } from "react";
import { useParams } from "react-router-dom";
import "mathlive";
import { Button } from "../../components/ui/Button";
import { SupportButton } from "../support/SupportButton";
import { apiFetch } from "../../lib/api/client";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "math-field": any;
    }
  }
}

export function WorkbookView() {
  const { slug } = useParams();
  const [latex, setLatex] = useState("");
  const [result, setResult] = useState<string | null>(null);
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
  return (
    <section className="workbook">
      <h1>{slug}</h1>
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
