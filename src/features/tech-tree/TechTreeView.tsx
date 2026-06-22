import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ReactFlow,
  Background,
  MiniMap,
  Controls,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { TechTreeGraph } from "../../types/graph";
import { nodeVisual, NODE_TOKEN } from "../../lib/nodeStyle";
import { layoutVertical } from "./layout";
import {
  canLearn,
  learnTarget,
  miniMapNodeColor,
  MINIMAP_MASK_COLOR,
} from "./nodeNav";
import { apiFetch } from "../../lib/api/client";

export function TechTreeView() {
  const navigate = useNavigate();
  const [graph, setGraph] = useState<TechTreeGraph>({ nodes: [], edges: [] });
  useEffect(() => {
    apiFetch("/api/tech-tree")
      .then((r) => r.json())
      .then(setGraph)
      .catch(() => {});
  }, []);
  // 依存の深さで縦に流す（前提=上 → 応用=下）。横一列グリッドではなく依存グラフのレイヤ配置。
  const layout = layoutVertical(graph);
  const posById = new Map(layout.map((p) => [p.id, p]));
  const rfNodes = graph.nodes.map((n) => {
    const v = nodeVisual(n.state, n.isRomanceNode);
    const t = NODE_TOKEN[v];
    const p = posById.get(n.id) ?? { x: 0, y: 0 };
    const learnable = canLearn(n.state);
    return {
      id: n.id,
      position: { x: p.x, y: p.y },
      // 縦フロー: 前提は上端から、応用は下端へ繋ぐ
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      // slug + canLearn を載せてノード選択時の遷移に使う（SPEC §6.1）
      data: { label: n.title, slug: n.slug, canLearn: learnable },
      style: {
        border: `2px ${v === "locked" ? "dashed" : "solid"} ${t.outline}`,
        background: t.fill,
        borderRadius: 10,
        padding: 8,
        color: "var(--text)",
        cursor: learnable ? "pointer" : "default",
      },
    };
  });
  const rfEdges = graph.edges.map((e) => ({
    id: e.id,
    source: e.from,
    target: e.to,
  }));
  return (
    <div style={{ width: "100%", height: "70vh" }}>
      <p className="lead">
        どこから学べばいいか、ひと目でわかる。少しずつ進めば、その先の単元も開いていきます。
      </p>
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        fitView
        onNodeClick={(_, node) => {
          // 解放済みノードのみ学習画面へ（未解放は no-op、SPEC §6.1）
          const target = learnTarget(
            node.data as { slug?: string; canLearn?: boolean },
          );
          if (target) navigate(target);
        }}
      >
        <Background />
        <MiniMap
          maskColor={MINIMAP_MASK_COLOR}
          nodeColor={(n) =>
            miniMapNodeColor((n.data as { canLearn?: boolean })?.canLearn)
          }
          pannable
          zoomable
        />
        <Controls />
      </ReactFlow>
    </div>
  );
}
