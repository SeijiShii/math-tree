import { useState } from 'react'

export function FeedbackWidget() {
  const [sent, setSent] = useState(false)
  async function send(kind: 'like' | 'dislike' | 'bug', body?: string) {
    const context = { route: window.location?.pathname, ua: navigator?.userAgent }
    await fetch('/api/feedback', { method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ kind, body, context }) }).catch(() => {})
    setSent(true)
  }
  return (
    <div className="feedback-widget" aria-label="フィードバック">
      {sent ? <span>ありがとう</span> : (
        <>
          <button aria-label="よい" onClick={() => send('like')}>👍</button>
          <button aria-label="いまいち" onClick={() => send('dislike')}>👎</button>
          <button aria-label="バグ報告" onClick={() => { const b = prompt('気づいた点があれば（任意）') ?? undefined; send('bug', b) }}>🐛</button>
        </>
      )}
    </div>
  )
}
