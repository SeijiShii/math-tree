// ドメイン型。db schema の推論型を土台に、公開 DTO で内部フィールド/模範解答を型封じ込め（SEC-002）。
import type { units, problems, steps, progress } from '../../db/schema'
import type { ProgressState } from './enums'

export type Unit = typeof units.$inferSelect
export type Problem = typeof problems.$inferSelect
export type Step = typeof steps.$inferSelect
export type Progress = typeof progress.$inferSelect

// UnitPublic: verification_status を露出しない（SEC-002 / 公開 DTO）
export type UnitPublic = Omit<Unit, 'verificationStatus'>

// StepPrompt: 学習中表示用。model_answer_latex / normalized_form を含まない（模範解答漏洩防止 SEC-002）
export type StepPrompt = Omit<Step, 'modelAnswerLatex' | 'normalizedForm'>

export interface UnitProgress {
  unitId: string
  state: ProgressState
}
