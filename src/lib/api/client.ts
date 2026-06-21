/**
 * API クライアント: 匿名ゲストトークンを bootstrap し、全 /api 呼び出しに
 * `Authorization: Bearer <token>` を付与する（SEC-001 の認証主体提示）。
 *
 * 0 タップ学習開始（O22）: 初回呼び出しで /api/auth?action=guest が guest JWT を発行 → localStorage
 * に保持 → 以後の保護 API が同一 owner で 200。x-owner-id 等のクライアント申告は送らない。
 */
const GUEST_KEY = "mathtree_guest_token";

let inflight: Promise<string | null> | null = null;

/**
 * 連携後の認証 token 供給源（O22(B)）。連携成功で実 Clerk provider が Clerk セッション JWT を返す
 * getter を登録し、apiFetch は guest token より優先する。サインアウトで null に戻す。
 * 未登録（ゲスト匿名フロー）は従来どおり guest token を使う。
 */
let sessionTokenGetter: (() => Promise<string | null>) | null = null;

export function setSessionTokenGetter(
  fn: (() => Promise<string | null>) | null,
): void {
  sessionTokenGetter = fn;
}

function readToken(): string | null {
  try {
    return localStorage.getItem(GUEST_KEY);
  } catch {
    return null;
  }
}

/** guest トークンを取得（無ければ発行）。同時呼び出しは 1 発行に集約。 */
export async function ensureGuestToken(): Promise<string | null> {
  const existing = readToken();
  if (existing) return existing;
  if (inflight) return inflight;
  inflight = (async () => {
    try {
      const r = await fetch("/api/auth?action=guest", { method: "POST" });
      if (!r.ok) return null;
      const data = (await r.json()) as { guestToken?: string };
      if (data.guestToken) {
        try {
          localStorage.setItem(GUEST_KEY, data.guestToken);
        } catch {
          /* storage 不可（プライベートモード等）でも token は返す */
        }
        return data.guestToken;
      }
      return null;
    } catch {
      return null; // オフライン等
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}

/** 認証ヘッダ付きで fetch する。保護 API はこれ経由で呼ぶ。 */
export async function apiFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const token = sessionTokenGetter
    ? ((await sessionTokenGetter()) ?? (await ensureGuestToken()))
    : await ensureGuestToken();
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(path, { ...init, headers });
}

/** 連携完了/サインアウト時にゲストトークンを破棄。 */
export function clearGuestToken(): void {
  try {
    localStorage.removeItem(GUEST_KEY);
  } catch {
    /* no-op */
  }
}
