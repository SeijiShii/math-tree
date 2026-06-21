// テックツリーの縦レイアウト: 依存の深さ（level）で縦に流す（前提=上 → 応用=下）。
// level = ルート（入次数 0）からの最長距離。同 level の単元は横に均等配置。
import type { TechTreeGraph } from "../../types/graph";

export interface NodeLayout {
  id: string;
  x: number;
  y: number;
}

const COL_GAP = 220; // 同 level 内の横間隔
const ROW_GAP = 150; // level 間の縦間隔

/** 各ノードの依存深さ（level）を longest-path で算出。循環があっても停止する。 */
export function computeLevels(graph: TechTreeGraph): Map<string, number> {
  const ids = graph.nodes.map((n) => n.id);
  const indeg = new Map(ids.map((id) => [id, 0]));
  const adj = new Map<string, string[]>(ids.map((id) => [id, []]));
  for (const e of graph.edges) {
    if (!adj.has(e.from) || !indeg.has(e.to)) continue;
    adj.get(e.from)!.push(e.to);
    indeg.set(e.to, (indeg.get(e.to) ?? 0) + 1);
  }
  const level = new Map(ids.map((id) => [id, 0]));
  const remaining = new Map(indeg);
  const queue = ids.filter((id) => (indeg.get(id) ?? 0) === 0);
  let processed = 0;
  while (queue.length) {
    const u = queue.shift()!;
    processed++;
    for (const v of adj.get(u) ?? []) {
      level.set(v, Math.max(level.get(v) ?? 0, (level.get(u) ?? 0) + 1));
      remaining.set(v, (remaining.get(v) ?? 0) - 1);
      if ((remaining.get(v) ?? 0) === 0) queue.push(v);
    }
  }
  // 循環で残ったノードは入力順の level に退避（描画は壊さない）
  if (processed < ids.length) {
    graph.nodes.forEach((n, i) => {
      if (!level.has(n.id)) level.set(n.id, i);
    });
  }
  return level;
}

/** level ごとに縦に積み、同 level 内は横に中央揃えで配置した座標を返す。 */
export function layoutVertical(graph: TechTreeGraph): NodeLayout[] {
  const level = computeLevels(graph);
  // level → その level に属するノード id（入力順を保持）
  const byLevel = new Map<number, string[]>();
  for (const n of graph.nodes) {
    const lv = level.get(n.id) ?? 0;
    if (!byLevel.has(lv)) byLevel.set(lv, []);
    byLevel.get(lv)!.push(n.id);
  }
  const pos = new Map<string, NodeLayout>();
  for (const [lv, idsInLevel] of byLevel) {
    const count = idsInLevel.length;
    idsInLevel.forEach((id, i) => {
      // 中央揃え: level の幅の中心に対して左右対称に置く
      const x = (i - (count - 1) / 2) * COL_GAP;
      pos.set(id, { id, x, y: lv * ROW_GAP });
    });
  }
  // 入力順で返す
  return graph.nodes.map(
    (n) => pos.get(n.id) ?? { id: n.id, x: 0, y: 0 },
  );
}
