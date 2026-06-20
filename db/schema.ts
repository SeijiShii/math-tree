// _shared/db — Drizzle schema (Neon Postgres)。SPEC 001__shared_db 由来。
import {
  pgTable, uuid, text, boolean, integer, timestamp, numeric, jsonb, unique,
} from 'drizzle-orm/pg-core'

export const units = pgTable('units', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  systemicLine: text('systemic_line').notNull(),
  description: text('description').notNull(),
  trivia: text('trivia').notNull(),
  isRomanceNode: boolean('is_romance_node').notNull().default(false),
  verificationStatus: text('verification_status').notNull().default('draft'), // draft|under_review|verified
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const unitEdges = pgTable('unit_edges', {
  id: uuid('id').primaryKey().defaultRandom(),
  fromUnitId: uuid('from_unit_id').notNull().references(() => units.id, { onDelete: 'cascade' }),
  toUnitId: uuid('to_unit_id').notNull().references(() => units.id, { onDelete: 'cascade' }),
}, (t) => ({ uq: unique().on(t.fromUnitId, t.toUnitId) }))

export const problems = pgTable('problems', {
  id: uuid('id').primaryKey().defaultRandom(),
  unitId: uuid('unit_id').notNull().references(() => units.id, { onDelete: 'cascade' }),
  statementLatex: text('statement_latex').notNull(),
  order: integer('order').notNull().default(0),
  verificationStatus: text('verification_status').notNull().default('draft'),
})

export const steps = pgTable('steps', {
  id: uuid('id').primaryKey().defaultRandom(),
  problemId: uuid('problem_id').notNull().references(() => problems.id, { onDelete: 'cascade' }),
  order: integer('order').notNull(),
  modelAnswerLatex: text('model_answer_latex').notNull(),
  normalizedForm: text('normalized_form'),
  hint: text('hint'),
})

export const progress = pgTable('progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  ownerId: text('owner_id').notNull(),
  unitId: uuid('unit_id').notNull().references(() => units.id, { onDelete: 'cascade' }),
  state: text('state').notNull().default('locked'), // locked|unlocked|mastered
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({ uq: unique().on(t.ownerId, t.unitId) }))

export const supports = pgTable('supports', {
  id: uuid('id').primaryKey().defaultRandom(),
  ownerId: text('owner_id').notNull(),
  amount: integer('amount').notNull().default(100),
  stripeSessionId: text('stripe_session_id').unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const feedback = pgTable('feedback', {
  id: uuid('id').primaryKey().defaultRandom(),
  ownerId: text('owner_id'),
  kind: text('kind').notNull(), // like|dislike|bug
  body: text('body'),
  context: jsonb('context'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const aiCallLogs = pgTable('ai_call_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  provider: text('provider').notNull(),
  purpose: text('purpose').notNull(), // generation|review
  model: text('model'),
  inputTokens: integer('input_tokens'),
  outputTokens: integer('output_tokens'),
  estCostUsd: numeric('est_cost_usd', { precision: 10, scale: 4 }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  targetType: text('target_type').notNull(), // unit|problem|step
  targetId: uuid('target_id').notNull(),
  reviewModel: text('review_model'),
  stage: integer('stage').notNull().default(1),
  verdict: text('verdict').notNull(), // pass|fail
  findings: text('findings'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
