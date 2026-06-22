// テックツリーの解放状態の導出（SPEC §6.2）。
// 入口（前提なし）または前提が全て mastered の「非ロマンノード」を unlocked にする。
// ロマンノード（遠景ゴール、concept §1.2）は自動解放しない＝遠景表示のまま。
// mastered は明示進捗からのみ。明示進捗があればそれと導出値の高い方を採用。
import type { ProgressState } from '../../types/enums'

const RANK: Record<ProgressState, number> = { locked: 0, unlocked: 1, mastered: 2 }

/**
 * @param own           当該ユニットの明示進捗（progress 行が無ければ 'locked'）
 * @param prereqStates  前提ユニット群の明示進捗（前提なし = 空配列 = 入口）
 * @param isRomance     ロマンノード（遠景）か
 */
export function effectiveState(
  own: ProgressState,
  prereqStates: ProgressState[],
  isRomance: boolean,
): ProgressState {
  if (own === 'mastered') return 'mastered'
  if (isRomance) return own // 遠景ゴールは自動解放しない
  const allPrereqMastered = prereqStates.every((s) => s === 'mastered') // 前提なしは true（入口）
  const derived: ProgressState = allPrereqMastered ? 'unlocked' : 'locked'
  return RANK[own] >= RANK[derived] ? own : derived
}
