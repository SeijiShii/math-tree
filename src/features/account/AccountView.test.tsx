// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { AccountView } from "./AccountView";

describe("AccountView (SEC-004 DSR セルフ削除)", () => {
  it("全データ削除のセルフサービス導線 + 開示説明がある", () => {
    const { getByText } = render(<AccountView />);
    expect(getByText("全データを削除する")).toBeTruthy();
    expect(getByText(/誰かを特定できない/)).toBeTruthy();
  });

  it("M1: O22(B+E) 認証セクション（状態表示 + 連携/サインアウト動線）が存在する", () => {
    const { getByText } = render(<AccountView />);
    // keyless（テスト env に VITE_CLERK_PUBLISHABLE_KEY なし）→ ゲスト + 準備中表示
    expect(getByText(/ゲストで利用中/)).toBeTruthy();
    expect(getByText(/もうしばらくお待ち/)).toBeTruthy();
  });
});
