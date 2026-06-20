import { useEffect, useState } from 'react'
import { ReactFlow, Background, MiniMap, Controls } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import type { TechTreeGraph } from '../../types/graph'
import { nodeVisual, NODE_TOKEN } from '../../lib/nodeStyle'

export function TechTreeView() {
  const [graph, setGraph] = useState<TechTreeGraph>({ nodes: [], edges: [] })
  useEffect(() => {
    fetch('/api/tech-tree/chugaku-1').then(r => r.json()).then(setGraph).catch(() => {})
  }, [])
  const rfNodes = graph.nodes.map((n, i) => {
    const v = nodeVisual(n.state, n.isRomanceNode)
    const t = NODE_TOKEN[v]
    return {
      id: n.id, position: { x: (i % 4) * 200, y: Math.floor(i / 4) * 140 },
      data: { label: n.title },
      style: { border: `2px ${v === 'locked' ? 'dashed' : 'solid'} ${t.outline}`,
        background: t.fill, borderRadius: 10, padding: 8, color: 'var(--text)' },
    }
  })
  const rfEdges = graph.edges.map(e => ({ id: e.id, source: e.from, target: e.to }))
  return (
    <div style={{ width: '100%', height: '70vh' }}>
      <p className="lead">学ぶ順番と到達点が見える知識マップ。学んだ単元が解放されます。</p>
      <ReactFlow nodes={rfNodes} edges={rfEdges} fitView>
        <Background /><MiniMap /><Controls />
      </ReactFlow>
    </div>
  )
}
