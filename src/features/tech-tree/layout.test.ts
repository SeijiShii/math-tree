import { describe, it, expect } from "vitest";
import { computeLevels, layoutVertical } from "./layout";
import type { TechTreeGraph } from "../../types/graph";

function node(id: string): TechTreeGraph["nodes"][number] {
  return { id, slug: id, title: id, state: "locked", isRomanceNode: false };
}

describe("tech-tree 縦レイアウト", () => {
  // 正負 → 文字式 → 分配 → {一次方程式, 式の展開}
  const graph: TechTreeGraph = {
    nodes: ["seisu", "moji", "bunpai", "ichiji", "tenkai"].map(node),
    edges: [
      { id: "e1", from: "seisu", to: "moji" },
      { id: "e2", from: "moji", to: "bunpai" },
      { id: "e3", from: "bunpai", to: "ichiji" },
      { id: "e4", from: "bunpai", to: "tenkai" },
    ],
  };

  it("依存の深さ（level）が longest-path で算出される", () => {
    const lv = computeLevels(graph);
    expect(lv.get("seisu")).toBe(0);
    expect(lv.get("moji")).toBe(1);
    expect(lv.get("bunpai")).toBe(2);
    expect(lv.get("ichiji")).toBe(3);
    expect(lv.get("tenkai")).toBe(3);
  });

  it("縦に流れる: 前提ほど y が小さく、応用ほど y が大きい", () => {
    const layout = layoutVertical(graph);
    const y = (id: string) => layout.find((p) => p.id === id)!.y;
    expect(y("seisu")).toBeLessThan(y("moji"));
    expect(y("moji")).toBeLessThan(y("bunpai"));
    expect(y("bunpai")).toBeLessThan(y("ichiji"));
    // 横並びグリッドではない: 4 単元が同じ y に並ばない
    const distinctY = new Set(layout.map((p) => p.y));
    expect(distinctY.size).toBeGreaterThanOrEqual(4);
  });

  it("同 level の兄弟は同じ y・異なる x（横に分散）", () => {
    const layout = layoutVertical(graph);
    const a = layout.find((p) => p.id === "ichiji")!;
    const b = layout.find((p) => p.id === "tenkai")!;
    expect(a.y).toBe(b.y);
    expect(a.x).not.toBe(b.x);
  });

  it("循環があっても停止し全ノードに座標を返す", () => {
    const cyclic: TechTreeGraph = {
      nodes: ["a", "b"].map(node),
      edges: [
        { id: "e1", from: "a", to: "b" },
        { id: "e2", from: "b", to: "a" },
      ],
    };
    const layout = layoutVertical(cyclic);
    expect(layout).toHaveLength(2);
  });
});
