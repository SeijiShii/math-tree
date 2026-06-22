import { describe, it, expect } from "vitest";
import { areEquivalent, gradeProcess } from "./equivalence";

describe("gradeProcess（途中式・イコールチェーン採点、C20260622-004）", () => {
  // 答えだけ
  it("答えのみ: 模範解答と同値なら正解", () => {
    expect(gradeProcess("2", "2")).toBe(true);
    expect(gradeProcess("3", "2")).toBe(false);
  });

  // 計算式（=なし）も最終値で正解
  it("式のみ（=なし）: 模範解答と同値なら正解", () => {
    expect(gradeProcess("-3+5", "2")).toBe(true);
  });

  // 途中経過をイコールで繋いだ入力（本要件の核）
  it("途中式 -3+5=2 を 1 入力として正解判定（イコール許容）", () => {
    expect(gradeProcess("-3+5=2", "2")).toBe(true);
  });

  it("複数ステップのチェーン (-3)+5 = 5-3 = 2 を正解判定", () => {
    expect(gradeProcess("(-3)+5=5-3=2", "2")).toBe(true);
  });

  it("途中式が誤り（-3+5=3）は不正解", () => {
    expect(gradeProcess("-3+5=3", "2")).toBe(false);
  });

  it("チェーン内の変形が誤り（-3+5=1+1=3）は不正解（途中式の誤り）", () => {
    // -3+5=2, 1+1=2 だが最終 3 が不一致、かつ 1+1 ≠ 3
    expect(gradeProcess("-3+5=1+1=3", "2")).toBe(false);
  });

  it("文字式も途中式で正解（2x+3 = 3+2x）", () => {
    expect(gradeProcess("2x+3=3+2x", "3+2x")).toBe(true);
  });

  it("parse 不能は null（AI フォールバック/案内へ）", () => {
    expect(gradeProcess("2 +", "2")).toBeNull();
  });

  it("空入力は null", () => {
    expect(gradeProcess("", "2")).toBeNull();
    expect(gradeProcess("=", "2")).toBeNull();
  });
});

describe("areEquivalent（既存）", () => {
  it("交換法則で同値", () => {
    expect(areEquivalent("3+2x", "2x+3")).toBe(true);
  });
});
