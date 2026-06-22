import { describe, it, expect } from "vitest";
import {
  canLearn,
  learnTarget,
  miniMapNodeColor,
  MINIMAP_MASK_COLOR,
} from "./nodeNav";

describe("tech-tree nodeNav（C20260622-001 ノード選択→学習遷移）", () => {
  // R4: canLearn 配線（locked のみ false）
  it("canLearn: 解放済み（unlocked/mastered）は true、未解放（locked）は false", () => {
    expect(canLearn("unlocked")).toBe(true);
    expect(canLearn("mastered")).toBe(true);
    expect(canLearn("locked")).toBe(false);
  });

  // R6': ロマンノード（遠景ゴール）は解放済みでも学習導線無効（concept §1.2）
  it("canLearn: ロマンノードは unlocked でも false（遠景のみ）", () => {
    expect(canLearn("unlocked", true)).toBe(false);
    expect(canLearn("mastered", true)).toBe(false);
  });

  // R1/R2: 解放ノード → /learn/<slug>
  it("R1/R2: 解放済みノードは /learn/<slug> を返す", () => {
    expect(learnTarget({ slug: "seisuu", canLearn: true })).toBe(
      "/learn/seisuu",
    );
    expect(learnTarget({ slug: "mojishiki", canLearn: true })).toBe(
      "/learn/mojishiki",
    );
  });

  // R3: 未解放ノード → null（遷移しない）
  it("R3: 未解放ノードは null（学習導線無効、SPEC §6.1）", () => {
    expect(learnTarget({ slug: "bunpai", canLearn: false })).toBeNull();
  });

  // R5: slug 欠落 / 空 → null（null セーフ、例外を投げない）
  it("R5: slug 欠落・空は null（no-op）", () => {
    expect(learnTarget({ canLearn: true })).toBeNull();
    expect(learnTarget({ slug: "", canLearn: true })).toBeNull();
    expect(learnTarget({})).toBeNull();
  });

  // R6: romance（未習得）は canLearn=false 扱いで遷移しない
  it("R6: 進めないノード（romance 未習得など canLearn=false）は遷移しない", () => {
    expect(learnTarget({ slug: "rsa", canLearn: false })).toBeNull();
  });

  // R7: MiniMap テーマ（暗マスク + 状態色）
  it("R7: MiniMap は暗マスク + 状態色トークン（解放=藍 / 未解放=muted）", () => {
    expect(MINIMAP_MASK_COLOR).toMatch(/rgba\(15, 23, 41/);
    expect(miniMapNodeColor(true)).toBe("#3b5bdb");
    expect(miniMapNodeColor(false)).toBe("#9fb0d0");
  });
});
