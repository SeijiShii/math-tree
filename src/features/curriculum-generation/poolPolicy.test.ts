import { describe, it, expect } from "vitest";
import {
  normalizeStatement,
  dedupNew,
  selectTopupUnits,
  topupCount,
  POOL_MAX,
} from "./poolPolicy";

describe("poolPolicy（成長プール・C20260622-007）", () => {
  it("normalizeStatement: 空白・大小を吸収", () => {
    expect(normalizeStatement(" 3X + 2x ")).toBe("3x+2x");
  });
  it("dedupNew: 既存と生成内の重複を除去", () => {
    const out = dedupNew(
      ["3x+2x"],
      [
        { statementLatex: "3x + 2x" }, // 既存と重複
        { statementLatex: "4x+x" },
        { statementLatex: "4x + x" }, // 生成内重複
      ],
    );
    expect(out.map((o) => o.statementLatex)).toEqual(["4x+x"]);
  });
  it("selectTopupUnits: 上限未満を空き少ない順に CAP まで", () => {
    const sel = selectTopupUnits(
      [
        { slug: "a", poolSize: POOL_MAX }, // 満杯→除外
        { slug: "b", poolSize: 5 },
        { slug: "c", poolSize: 2 },
      ],
      2,
    );
    expect(sel).toEqual(["c", "b"]);
  });
  it("topupCount: 上限と per-run CAP を尊重", () => {
    expect(topupCount(0, 5)).toBe(5);
    expect(topupCount(POOL_MAX - 2, 5)).toBe(2);
    expect(topupCount(POOL_MAX, 5)).toBe(0);
  });
});
