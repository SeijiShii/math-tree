import { describe, it, expect } from 'vitest'
import { effectiveState } from './unlock'

describe('tech-tree effectiveState（C20260622-001 入口/前提解放）', () => {
  // 入口（前提なし）の非ロマンノードは進捗が無くても unlocked = クリックして学習開始できる
  it('入口ノード（前提なし・進捗なし）は unlocked', () => {
    expect(effectiveState('locked', [], false)).toBe('unlocked')
  })

  it('前提が全て mastered なら unlocked', () => {
    expect(effectiveState('locked', ['mastered'], false)).toBe('unlocked')
    expect(effectiveState('locked', ['mastered', 'mastered'], false)).toBe('unlocked')
  })

  it('前提が未充足（locked/unlocked が残る）なら locked', () => {
    expect(effectiveState('locked', ['locked'], false)).toBe('locked')
    expect(effectiveState('locked', ['mastered', 'unlocked'], false)).toBe('locked')
  })

  it('明示 mastered は維持', () => {
    expect(effectiveState('mastered', ['locked'], false)).toBe('mastered')
  })

  it('明示 unlocked は導出 locked より優先（高い方を採用）', () => {
    expect(effectiveState('unlocked', ['locked'], false)).toBe('unlocked')
  })

  it('ロマンノード（遠景）は前提なしでも自動解放しない', () => {
    expect(effectiveState('locked', [], true)).toBe('locked')
    expect(effectiveState('locked', ['mastered'], true)).toBe('locked')
  })
})
