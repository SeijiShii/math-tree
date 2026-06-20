export const PROGRESS_STATES = ['locked', 'unlocked', 'mastered'] as const
export type ProgressState = (typeof PROGRESS_STATES)[number]

export const VERIFICATION_STATUSES = ['draft', 'under_review', 'verified'] as const
export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number]

export const FEEDBACK_KINDS = ['like', 'dislike', 'bug'] as const
export type FeedbackKind = (typeof FEEDBACK_KINDS)[number]

export const AI_PURPOSES = ['generation', 'review'] as const
export type AiPurpose = (typeof AI_PURPOSES)[number]

export const REVIEW_VERDICTS = ['pass', 'fail'] as const
export type ReviewVerdict = (typeof REVIEW_VERDICTS)[number]
