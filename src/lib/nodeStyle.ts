// テックツリーのノード状態 → デザイントークン（design-system.md §2.1）
import type { ProgressState } from '../types/enums'

export type NodeVisual = 'mastered' | 'unlocked' | 'locked' | 'romance'

export function nodeVisual(state: ProgressState, isRomanceNode: boolean): NodeVisual {
  if (isRomanceNode && state !== 'mastered') return 'romance'
  return state
}

// design-system §2.1 のトークン参照（生値直書きしない、原則#3）
export const NODE_TOKEN: Record<NodeVisual, { fill: string; ring: string; outline: string }> = {
  mastered: { fill: 'var(--primary)', ring: 'var(--accent-soft)', outline: 'var(--primary)' },
  unlocked: { fill: 'transparent', ring: 'transparent', outline: 'var(--primary)' },
  locked: { fill: 'transparent', ring: 'transparent', outline: 'var(--text-muted)' },
  romance: { fill: 'transparent', ring: 'transparent', outline: 'var(--accent)' },
}
