// 学習セッションのスコア/合否の純ロジック（C20260622-006）。
// プールから K 問ランダム出題し、正答率が PASS_RATE 以上で習得とする。
export const SESSION_SIZE = 5; // 1 セッションで出題する最大問数（プールが少なければプール数）
export const PASS_RATE = 0.6; // 合格率（60%）

/** 正答率（%）。total=0 は 0。 */
export function scorePercent(correct: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((correct / total) * 100);
}

/** 合格判定。1 問以上解いて正答率が PASS_RATE 以上。 */
export function passed(correct: number, total: number): boolean {
  return total > 0 && correct / total >= PASS_RATE;
}
