// テックツリーのノード選択 → 学習画面遷移の純ロジック（SPEC §6.1）。
// 解放済み（unlocked / mastered）のみ学習導線を有効化、未解放（locked）は無効。
import type { ProgressState } from "../../types/enums";

/** そのノードが学習に進めるか。未解放（locked）は無効、ロマンノード（遠景）も無効（SPEC §6.1, concept §1.2）。 */
export function canLearn(state: ProgressState, isRomance = false): boolean {
  return state !== "locked" && !isRomance;
}

/** ノード選択時の遷移先パス。進めない / slug 無しなら null（no-op）。 */
export function learnTarget(node: {
  slug?: string;
  canLearn?: boolean;
}): string | null {
  if (!node.canLearn) return null;
  if (!node.slug) return null;
  return `/learn/${node.slug}`;
}
