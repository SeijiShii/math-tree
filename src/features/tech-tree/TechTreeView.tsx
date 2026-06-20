import { useEffect, useState } from "react";
import { ReactFlow, Background, MiniMap, Controls } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { TechTreeGraph } from "../../types/graph";
import { nodeVisual, NODE_TOKEN } from "../../lib/nodeStyle";
import { apiFetch } from "../../lib/api/client";

export function TechTreeView() {
  const [graph, setGraph] = useState<TechTreeGraph>({ nodes: [], edges: [] });
  useEffect(() => {
    apiFetch("/api/tech-tree")
      .then((r) => r.json())
      .then(setGraph)
      .catch(() => {});
  }, []);
  const rfNodes = graph.nodes.map((n, i) => {
    const v = nodeVisual(n.state, n.isRomanceNode);
    const t = NODE_TOKEN[v];
    return {
      id: n.id,
      position: { x: (i % 4) * 200, y: Math.floor(i / 4) * 140 },
      data: { label: n.title },
      style: {
        border: `2px ${v === "locked" ? "dashed" : "solid"} ${t.outline}`,
        background: t.fill,
        borderRadius: 10,
        padding: 8,
        color: "var(--text)",
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
      <ReactFlow nodes={rfNodes} edges={rfEdges} fitView>
        <Background />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}
