// 問題プールの成長ポリシー（純ロジック、C20260622-007）。
//   定期バッチが各単元のプールを上限まで追記成長させ、ランダム出題(C20260622-006)で再挑戦の新鮮さを担保。
export const POOL_MAX = 30; // 単元あたりの問題プール上限
export const TOPUP_UNIT_CAP = 5; // 1 回の Cron で top-up する単元数
export const TOPUP_PROBLEM_CAP = 5; // 1 回の Cron で 1 単元に追加する問題数

/** 表記揺れ・空白を吸収して dedup キー化。 */
export function normalizeStatement(s: string): string {
  return s.replace(/\s+/g, "").toLowerCase();
}

/** 既存プールと重複しない生成問題だけを残す（生成内の重複も除去）。 */
export function dedupNew<T extends { statementLatex: string }>(
  existing: string[],
  generated: T[],
): T[] {
  const seen = new Set(existing.map(normalizeStatement));
  const out: T[] = [];
  for (const g of generated) {
    const k = normalizeStatement(g.statementLatex);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(g);
  }
  return out;
}

/** プールが上限未満の単元を、空き順（少ない順）に per-run CAP まで選ぶ。 */
export function selectTopupUnits(
  units: { slug: string; poolSize: number }[],
  cap = TOPUP_UNIT_CAP,
): string[] {
  return units
    .filter((u) => u.poolSize < POOL_MAX)
    .sort((a, b) => a.poolSize - b.poolSize)
    .slice(0, cap)
    .map((u) => u.slug);
}

/** ある単元に今回追加してよい問題数（上限到達・per-run CAP を尊重）。 */
export function topupCount(poolSize: number, perRun = TOPUP_PROBLEM_CAP): number {
  return Math.max(0, Math.min(perRun, POOL_MAX - poolSize));
}
