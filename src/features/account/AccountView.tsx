import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { apiFetch } from "../../lib/api/client";
import { AccountAuthSection } from "./AccountAuthSection";

export function AccountView() {
  const [done, setDone] = useState(false);
  async function deleteAll() {
    if (
      !confirm("全データを完全に削除します。元に戻せません。よろしいですか？")
    )
      return;
    await apiFetch("/api/account/delete", { method: "POST" }).catch(() => {});
    setDone(true);
  }
  return (
    <section className="account">
      <h1>マイデータ</h1>
      <p>あなたの進捗・支援・いただいた声を、ここでいつでも確認できます。</p>
      {/* O22(B+E): ゲスト→アカウント連携 ↔ サインアウトの両輪 */}
      <AccountAuthSection />
      {/* SEC-004 / O54: セルフサービス全削除（非交渉の必須導線） */}
      {done ? (
        <p>削除しました。</p>
      ) : (
        <Button variant="ghost" onClick={deleteAll}>
          全データを削除する
        </Button>
      )}
      <p className="muted">
        運営からはあなたが誰かを特定できない仕組みのため、削除はこの画面からいつでもご自身で行えます。
      </p>
    </section>
  );
}
