import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { getAuthProvider } from "../../lib/auth/authProvider";
import { linkAccount, signOut, getAuthState } from "../../lib/auth/authClient";
import { bootstrapSession } from "../../app/bootstrap";

/**
 * O22(B+E): ゲスト→アカウント連携 ↔ サインアウトの両輪 UI。
 * Clerk seam が unavailable（keyless）なら「準備中」で無効化し、ゲスト学習は継続可能。
 */
export function AccountAuthSection() {
  const provider = getAuthProvider();
  const [linked, setLinked] = useState(getAuthState(provider).linked);
  const [msg, setMsg] = useState<string | null>(null);
  const available = provider.isAvailable();

  async function onLink() {
    const r = await linkAccount(provider);
    if (r.ok) {
      setLinked(true);
      setMsg("データを引き継いでアカウント連携しました。");
    } else if (r.reason === "failed") {
      setMsg("連携に失敗しました。時間をおいて再度お試しください。");
    }
    // unavailable / cancelled は状態据え置き（white-screen にしない）
  }

  async function onSignOut() {
    await signOut(provider, { reBootstrap: () => bootstrapSession() });
    setLinked(false);
    setMsg("サインアウトしました。連携先のデータは保持されます。");
  }

  return (
    <section className="account-auth">
      <p className="muted">
        現在: {linked ? "アカウント連携済み" : "ゲストで利用中"}
      </p>
      {linked ? (
        <Button variant="ghost" onClick={onSignOut}>
          サインアウト
        </Button>
      ) : available ? (
        <Button variant="primary" onClick={onLink}>
          Googleで連携してデータを引き継ぐ
        </Button>
      ) : (
        <Button variant="ghost" disabled>
          連携は準備中（公開後に有効）
        </Button>
      )}
      {msg && <p className="muted">{msg}</p>}
    </section>
  );
}
