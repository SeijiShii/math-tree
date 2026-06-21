// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, waitFor } from "@testing-library/react";

// authClient / authProvider をモックして UI の出し分けと呼び出しを検証
const linkAccount = vi.fn(async () => ({ ok: true as const }));
const signOut = vi.fn(async () => {});
let available = true;
let linked = false;

vi.mock("../../lib/auth/authProvider", () => ({
  getAuthProvider: () => ({
    isAvailable: () => available,
    isLinked: () => linked,
  }),
}));
vi.mock("../../lib/auth/authClient", () => ({
  linkAccount: (...a: unknown[]) => linkAccount(...(a as [])),
  signOut: (...a: unknown[]) => signOut(...(a as [])),
  getAuthState: () => ({ linked }),
}));
vi.mock("../../app/bootstrap", () => ({ bootstrapSession: () => ({}) }));

import { AccountAuthSection } from "./AccountAuthSection";

beforeEach(() => {
  linkAccount.mockClear();
  signOut.mockClear();
  available = true;
  linked = false;
});

describe("AccountAuthSection (O22(B+E) 両輪 UI)", () => {
  it("N4: ゲスト & seam available → 連携ボタン表示・押下で linkAccount 呼出", async () => {
    const { getByText } = render(<AccountAuthSection />);
    expect(getByText("ゲストで利用中", { exact: false })).toBeTruthy();
    const btn = getByText("Googleで連携してデータを引き継ぐ");
    fireEvent.click(btn);
    await waitFor(() => expect(linkAccount).toHaveBeenCalled());
  });

  it("E3: seam unavailable（keyless）→「準備中」で無効化、linkAccount 呼ばない", () => {
    available = false;
    const { getByText } = render(<AccountAuthSection />);
    const btn = getByText(
      "アカウント連携はもうしばらくお待ちください",
    ) as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    fireEvent.click(btn);
    expect(linkAccount).not.toHaveBeenCalled();
  });

  it("N5: 連携済み → サインアウトボタン表示・押下で signOut 呼出", async () => {
    linked = true;
    const { getByText } = render(<AccountAuthSection />);
    expect(getByText("アカウント連携済み", { exact: false })).toBeTruthy();
    fireEvent.click(getByText("サインアウト"));
    await waitFor(() => expect(signOut).toHaveBeenCalled());
  });
});
