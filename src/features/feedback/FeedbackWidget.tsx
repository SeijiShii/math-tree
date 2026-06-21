import { useState } from "react";
import { apiFetch } from "../../lib/api/client";

/* design-system §7: 絵文字は使わない → 自作 SVG line-art アイコン（currentColor 追従） */
const ICON = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;
function ThumbUpIcon() {
  return (
    <svg {...ICON} aria-hidden="true">
      <path d="M7 10v11H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h3Z" />
      <path d="M7 10l4-7a2 2 0 0 1 2 2v4h5a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 17.8 21H7" />
    </svg>
  );
}
function ThumbDownIcon() {
  return (
    <svg {...ICON} aria-hidden="true">
      <path d="M17 14V3h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-3Z" />
      <path d="M17 14l-4 7a2 2 0 0 1-2-2v-4H6a2 2 0 0 1-2-2.3l1.2-6A2 2 0 0 1 7.2 3H17" />
    </svg>
  );
}
function FeedbackIcon() {
  return (
    <svg {...ICON} aria-hidden="true">
      <path d="M21 12a8 8 0 0 1-11.3 7.3L3 21l1.7-6.7A8 8 0 1 1 21 12Z" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  );
}

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
            <ThumbUpIcon />
          </button>
          <button aria-label="いまいち" onClick={() => send("dislike")}>
            <ThumbDownIcon />
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
            <FeedbackIcon />
          </button>
        </>
      )}
    </div>
  );
}
