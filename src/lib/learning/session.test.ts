import { describe, it, expect } from "vitest";
import { scorePercent, passed, PASS_RATE, SESSION_SIZE } from "./session";

describe("learning session スコア/合否（C20260622-006）", () => {
  it("scorePercent: 正答率を % で返す", () => {
    expect(scorePercent(3, 5)).toBe(60);
    expect(scorePercent(5, 5)).toBe(100);
    expect(scorePercent(0, 5)).toBe(0);
    expect(scorePercent(0, 0)).toBe(0);
  });

  it("passed: 正答率 60% 以上で合格（境界 3/5=合格, 2/5=不合格）", () => {
    expect(passed(3, 5)).toBe(true); // 60%
    expect(passed(2, 5)).toBe(false); // 40%
    expect(passed(5, 5)).toBe(true);
    expect(passed(0, 5)).toBe(false);
    expect(passed(0, 0)).toBe(false); // 未解答は不合格
  });

  it("既定値: SESSION_SIZE=5 / PASS_RATE=0.6", () => {
    expect(SESSION_SIZE).toBe(5);
    expect(PASS_RATE).toBe(0.6);
  });
});
