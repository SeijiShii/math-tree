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

/** MiniMap のノード色（解放=藍 / 未解放=muted、design-system トークン実値）。 */
export function miniMapNodeColor(canLearnFlag: boolean | undefined): string {
  return canLearnFlag ? "#3b5bdb" : "#9fb0d0";
}

/** MiniMap の暗マスク色（design-system --bg #0f1729 由来）。 */
export const MINIMAP_MASK_COLOR = "rgba(15, 23, 41, 0.75)";
