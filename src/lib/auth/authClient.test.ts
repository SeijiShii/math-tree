import { describe, it, expect, vi, beforeEach } from "vitest";
import { linkAccount, signOut, getAuthState } from "./authClient";
import type { AuthProvider } from "./authProvider";
import { StubAuthProvider } from "./authProvider";

// localStorage polyfill（node 環境）
beforeEach(() => {
  const store = new Map<string, string>();
  (globalThis as any).localStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => store.set(k, v),
    removeItem: (k: string) => store.delete(k),
  };
  store.set("mathtree_guest_token", "guest_jwt_abc");
});

function mockProvider(over: Partial<AuthProvider> = {}): AuthProvider {
  return {
    isAvailable: () => true,
    isLinked: () => false,
    signInWithGoogle: async () => ({ accountToken: "ck_jwt" }),
    signOut: async () => {},
    ...over,
  };
}

describe("authClient.linkAccount (O22(B))", () => {
  it("N2: 連携成功 — guest Bearer + account_token で link API を呼び、guest token を破棄", async () => {
    const fetchFn = vi.fn(async () => new Response(null, { status: 204 }));
    const r = await linkAccount(mockProvider(), { fetchFn: fetchFn as any });
    expect(r).toEqual({ ok: true });
    const [url, init] = fetchFn.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    expect(url).toBe("/api/auth?action=link");
    expect((init as any).method).toBe("POST");
    expect((init as any).headers.Authorization).toBe("Bearer guest_jwt_abc");
    expect(JSON.parse((init as any).body).account_token).toBe("ck_jwt");
    expect(localStorage.getItem("mathtree_guest_token")).toBeNull(); // clear
  });

  it("E3: seam unavailable（keyless）→ unavailable、API 呼ばない", async () => {
    const fetchFn = vi.fn();
    const r = await linkAccount(new StubAuthProvider(), {
      fetchFn: fetchFn as any,
    });
    expect(r).toEqual({ ok: false, reason: "unavailable" });
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it("E2: OAuth キャンセル → cancelled、状態据え置き（guest token 維持）", async () => {
    const fetchFn = vi.fn();
    const p = mockProvider({
      signInWithGoogle: async () => {
        throw new Error("cancelled");
      },
    });
    const r = await linkAccount(p, { fetchFn: fetchFn as any });
    expect(r).toEqual({ ok: false, reason: "cancelled" });
    expect(fetchFn).not.toHaveBeenCalled();
    expect(localStorage.getItem("mathtree_guest_token")).toBe("guest_jwt_abc");
  });

  it("E1: link API 401 → failed、guest token を消さない（state 維持）", async () => {
    const fetchFn = vi.fn(async () => new Response(null, { status: 401 }));
    const r = await linkAccount(mockProvider(), { fetchFn: fetchFn as any });
    expect(r).toEqual({ ok: false, reason: "failed" });
    expect(localStorage.getItem("mathtree_guest_token")).toBe("guest_jwt_abc");
  });

  it("E4: fetch reject（オフライン）→ failed、state 維持", async () => {
    const fetchFn = vi.fn(async () => {
      throw new Error("offline");
    });
    const r = await linkAccount(mockProvider(), { fetchFn: fetchFn as any });
    expect(r).toEqual({ ok: false, reason: "failed" });
    expect(localStorage.getItem("mathtree_guest_token")).toBe("guest_jwt_abc");
  });
});

describe("authClient.signOut (O22(E) 両輪)", () => {
  it("N3: Clerk signOut + guest token 破棄 + 新規ゲスト再 bootstrap", async () => {
    const signOutSpy = vi.fn(async () => {});
    const reBootstrap = vi.fn();
    await signOut(mockProvider({ signOut: signOutSpy }), { reBootstrap });
    expect(signOutSpy).toHaveBeenCalled();
    expect(reBootstrap).toHaveBeenCalled();
    expect(localStorage.getItem("mathtree_guest_token")).toBeNull();
  });

  it("provider.signOut が失敗してもローカルはゲストに戻す", async () => {
    const reBootstrap = vi.fn();
    await signOut(
      mockProvider({
        signOut: async () => {
          throw new Error("x");
        },
      }),
      { reBootstrap },
    );
    expect(reBootstrap).toHaveBeenCalled();
  });
});

describe("authClient.getAuthState", () => {
  it("provider.isLinked を反映", () => {
    expect(getAuthState(mockProvider({ isLinked: () => true })).linked).toBe(
      true,
    );
    expect(getAuthState(new StubAuthProvider()).linked).toBe(false);
  });
});
