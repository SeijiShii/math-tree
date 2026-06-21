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
});
