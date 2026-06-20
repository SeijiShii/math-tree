import { useState } from "react";
import { apiFetch } from "../../lib/api/client";

export function FeedbackWidget() {
  const [sent, setSent] = useState(false);
  async function send(kind: "like" | "dislike" | "bug", body?: string) {
    const context = {
      route: window.location?.pathname,
      ua: navigator?.userAgent,
    };
    await apiFetch("/api/feedback", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kind, body, context }),
    }).catch(() => {});
    setSent(true);
  }
  return (
    <div className="feedback-widget" aria-label="ご意見・感想">
      {sent ? (
        <span>ありがとうございます</span>
      ) : (
        <>
          <button aria-label="よい" onClick={() => send("like")}>
            👍
          </button>
          <button aria-label="いまいち" onClick={() => send("dislike")}>
            👎
          </button>
          <button
            aria-label="不具合の報告"
            onClick={() => {
              const b =
                prompt("気づいたことがあれば教えてください（任意）") ??
                undefined;
              send("bug", b);
            }}
          >
            🐛
          </button>
        </>
      )}
    </div>
  );
}
