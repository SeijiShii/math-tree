// 中学〜高校数I・A の系統シラバス骨格（C20260622-007）。
//   AI 生成のガードレール: 教育的に妥当な単元構成・依存をプロンプトで枠付けし、AI に丸投げしない。
export interface SyllabusStrand {
  line: string; // 系統（学年帯）
  topics: string[]; // 単元見出し（依存は概ね列挙順 + strand 間で接続）
}

export const SYLLABUS: SyllabusStrand[] = [
  {
    line: "中1 数学",
    topics: [
      "正負の数の計算",
      "文字式の計算",
      "分配法則",
      "一次方程式",
      "比例と反比例",
      "平面図形",
      "空間図形",
      "資料の整理",
    ],
  },
  {
    line: "中2 数学",
    topics: [
      "式の計算（多項式）",
      "連立方程式",
      "一次関数",
      "平行と合同",
      "三角形と四角形",
      "確率",
    ],
  },
  {
    line: "中3 数学",
    topics: [
      "式の展開",
      "因数分解",
      "平方根",
      "二次方程式",
      "二次関数 y=ax^2",
      "相似",
      "円の性質",
      "三平方の定理",
      "標本調査",
    ],
  },
  {
    line: "高校 数I",
    topics: [
      "数と式（実数・絶対値）",
      "一次不等式",
      "集合と命題",
      "二次関数（一般形・最大最小）",
      "二次方程式と判別式",
      "三角比",
      "図形と計量（正弦・余弦定理）",
      "データの分析",
    ],
  },
  {
    line: "高校 数A",
    topics: ["場合の数", "順列と組合せ", "確率", "整数の性質", "図形の性質"],
  },
  {
    line: "高校 数II",
    topics: [
      "式と証明",
      "複素数と方程式",
      "図形と方程式",
      "軌跡と領域",
      "三角関数",
      "指数関数",
      "対数関数",
      "微分法",
      "積分法",
    ],
  },
  { line: "高校 数B", topics: ["数列", "統計的な推測", "数学と社会生活"] },
  {
    line: "高校 数III",
    topics: [
      "関数と極限",
      "微分法（数III）",
      "微分法の応用",
      "積分法（数III）",
      "積分法の応用",
      "平面上の曲線",
    ],
  },
  { line: "高校 数C", topics: ["ベクトル", "複素数平面", "媒介変数と極座標"] },
];

/** 系統名（line）からシラバスのトピック列を引く（生成スコープ指定用）。 */
export function topicsForLine(line: string): string[] {
  return SYLLABUS.filter((s) => s.line === line).flatMap((s) => s.topics);
}

/** 全系統の line 一覧（バッチが順に bootstrap する順序）。 */
export function allLines(): string[] {
  return SYLLABUS.map((s) => s.line);
}

/** 生成プロンプト用にシラバス骨格を文章化（line 指定時はその範囲のみ）。 */
export function buildSyllabusPrompt(line?: string): string {
  const strands = line ? SYLLABUS.filter((s) => s.line === line) : SYLLABUS;
  const body = strands
    .map((s) => `【${s.line}】${s.topics.join(" → ")}`)
    .join("\n");
  return (
    `以下のシラバス骨格に沿って、単元(units)と依存エッジ(edges)を JSON で生成してください。\n${body}\n` +
    `形式: {"units":[{"slug":"kebab-roman","title":"...","systemicLine":"...","description":"...","trivia":"..."}],"edges":[["from-slug","to-slug"]]}。` +
    `edges は前提→発展の有向。循環させない。slug はローマ字ケバブケース。`
  );
}
