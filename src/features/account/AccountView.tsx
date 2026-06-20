import { useState } from 'react'
import { Button } from '../../components/ui/Button'

export function AccountView() {
  const [done, setDone] = useState(false)
  async function deleteAll() {
    if (!confirm('全データを完全に削除します。元に戻せません。よろしいですか？')) return
    await fetch('/api/account/delete', { method: 'POST' }).catch(() => {})
    setDone(true)
  }
  return (
    <section className="account">
      <h1>マイデータ</h1>
      <p>あなたの進捗・支援・フィードバックはここで確認できます（開示）。</p>
      {/* SEC-004 / O54: セルフサービス全削除（非交渉の必須導線） */}
      {done ? <p>削除しました。</p> : (
        <Button variant="ghost" onClick={deleteAll}>全データを削除する</Button>
      )}
      <p className="muted">運営側では個人を特定できないため、削除はこの画面でご自身で行えます。</p>
    </section>
  )
}
