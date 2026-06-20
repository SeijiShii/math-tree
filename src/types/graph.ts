// React Flow 用テックツリー表現
import type { ProgressState } from './enums'

export interface TechTreeNode {
  id: string
  slug: string
  title: string
  state: ProgressState
  isRomanceNode: boolean
}
export interface TechTreeEdge { id: string; from: string; to: string }
export interface TechTreeGraph { nodes: TechTreeNode[]; edges: TechTreeEdge[] }
