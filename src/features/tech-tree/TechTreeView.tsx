import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  Position,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { TechTreeGraph } from "../../types/graph";
import { nodeVisual, NODE_TOKEN } from "../../lib/nodeStyle";
import { layoutVertical } from "./layout";
import { canLearn, learnTarget, pickCurrentNodeId } from "./nodeNav";
import { apiFetch } from "../../lib/api/client";

function TechTreeCanvas({ graph }: { graph: TechTreeGraph }) {
  const navigate = useNavigate();
  const { setCenter } = useReactFlow();
  // 依存の深さで縦に流す（前提=上 → 応用=下）。横一列グリッドではなく依存グラフのレイヤ配置。
  const layout = layoutVertical(graph);
  const posById = new Map(layout.map((p) => [p.id, p]));
  const rfNodes = graph.nodes.map((n) => {
    const v = nodeVisual(n.state, n.isRomanceNode);
    const t = NODE_TOKEN[v];
    const p = posById.get(n.id) ?? { x: 0, y: 0 };
    const learnable = canLearn(n.state, n.isRomanceNode);
    return {
      id: n.id,
      position: { x: p.x, y: p.y },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
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
  // エッジは装飾線（依存の可視化）。クリック選択・フォーカスを無効化（C20260622-008）。
  const rfEdges = graph.edges.map((e) => ({
    id: e.id,
    source: e.from,
    target: e.to,
    selectable: false,
    focusable: false,
    interactionWidth: 0,
  }));

  // 広大ツリーは全体 fitView せず「現在地（進捗フロンティア）あたり」を初期ズーム表示（C20260622-008）。
  // graph は非同期ロードのため、ロード後に setCenter する。
  useEffect(() => {
    if (graph.nodes.length === 0) return;
    const yById = new Map(layout.map((p) => [p.id, p.y]));
    const currentId = pickCurrentNodeId(graph.nodes, yById);
    const p = currentId ? posById.get(currentId) : undefined;
    if (p) setCenter(p.x + 75, p.y + 20, { zoom: 0.85, duration: 400 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graph]);

  return (
    <ReactFlow
      nodes={rfNodes}
      edges={rfEdges}
      edgesFocusable={false}
      minZoom={0.2}
      onNodeClick={(_, node) => {
        // 解放済みノードのみ学習画面へ（未解放は no-op、SPEC §6.1）
        const target = learnTarget(
          node.data as { slug?: string; canLearn?: boolean },
        );
        if (target) navigate(target);
      }}
    >
      <Background />
      <Controls />
    </ReactFlow>
  );
}

export function TechTreeView() {
  const [graph, setGraph] = useState<TechTreeGraph>({ nodes: [], edges: [] });
  useEffect(() => {
    apiFetch("/api/tech-tree")
      .then((r) => r.json())
      .then(setGraph)
      .catch(() => {});
  }, []);
  return (
    <div style={{ width: "100%", height: "70vh" }}>
      <p className="lead">
        どこから学べばいいか、ひと目でわかる。少しずつ進めば、その先の単元も開いていきます。
      </p>
      <ReactFlowProvider>
        <TechTreeCanvas graph={graph} />
      </ReactFlowProvider>
    </div>
  );
}
