// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from "vitest";
import { apiFetch, ensureGuestToken, clearGuestToken } from "./client";

describe("api client（ゲストトークン bootstrap + Bearer 付与）", () => {
  beforeEach(() => {
    localStorage.clear();
    clearGuestToken();
    vi.restoreAllMocks();
  });

  it("N1: 初回は /api/auth?action=guest を叩いて token を保持", async () => {
    const fetchMock = vi.fn(async (url: string) => {
      if (String(url).includes("action=guest")) {
        return new Response(JSON.stringify({ guestToken: "gt_123" }), {
          status: 201,
        });
      }
      return new Response("{}", { status: 200 });
    });
    vi.stubGlobal("fetch", fetchMock);

    const t = await ensureGuestToken();
    expect(t).toBe("gt_123");
    expect(localStorage.getItem("mathtree_guest_token")).toBe("gt_123");
    expect(fetchMock).toHaveBeenCalledWith("/api/auth?action=guest", {
      method: "POST",
    });
  });

  it("N2: 2 回目は再発行せず保持トークンを使う", async () => {
    localStorage.setItem("mathtree_guest_token", "gt_existing");
    const fetchMock = vi.fn(async () => new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const t = await ensureGuestToken();
    expect(t).toBe("gt_existing");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("N3: apiFetch は Authorization: Bearer を付与する", async () => {
    localStorage.setItem("mathtree_guest_token", "gt_abc");
    let seen: Headers | undefined;
    const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
      seen = new Headers(init?.headers);
      return new Response("{}", { status: 200 });
    });
    vi.stubGlobal("fetch", fetchMock);
    await apiFetch("/api/tech-tree/chugaku-1");
    expect(seen?.get("authorization")).toBe("Bearer gt_abc");
  });

  it("E1: 発行失敗（503）でも例外を投げず null（オフライン耐性）", async () => {
    const fetchMock = vi.fn(async () => new Response("{}", { status: 503 }));
    vi.stubGlobal("fetch", fetchMock);
    const t = await ensureGuestToken();
    expect(t).toBeNull();
  });
});
