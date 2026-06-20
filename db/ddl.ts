// テスト/初期化用 DDL（schema.ts をミラー）。本番マイグレーションは drizzle-kit generate。
export const DDL = /* sql */ `
CREATE TABLE IF NOT EXISTS units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  systemic_line text NOT NULL,
  description text NOT NULL,
  trivia text NOT NULL,
  is_romance_node boolean NOT NULL DEFAULT false,
  verification_status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS unit_edges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_unit_id uuid NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  to_unit_id uuid NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  UNIQUE (from_unit_id, to_unit_id)
);
CREATE TABLE IF NOT EXISTS problems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id uuid NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  statement_latex text NOT NULL,
  "order" integer NOT NULL DEFAULT 0,
  verification_status text NOT NULL DEFAULT 'draft'
);
CREATE TABLE IF NOT EXISTS steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_id uuid NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  "order" integer NOT NULL,
  model_answer_latex text NOT NULL,
  normalized_form text,
  hint text
);
CREATE TABLE IF NOT EXISTS progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id text NOT NULL,
  unit_id uuid NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  state text NOT NULL DEFAULT 'locked',
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (owner_id, unit_id)
);
CREATE TABLE IF NOT EXISTS supports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id text NOT NULL,
  amount integer NOT NULL DEFAULT 100,
  stripe_session_id text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id text,
  kind text NOT NULL,
  body text,
  context jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS ai_call_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  purpose text NOT NULL,
  model text,
  input_tokens integer,
  output_tokens integer,
  est_cost_usd numeric(10,4),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type text NOT NULL,
  target_id uuid NOT NULL,
  review_model text,
  stage integer NOT NULL DEFAULT 1,
  verdict text NOT NULL,
  findings text,
  created_at timestamptz NOT NULL DEFAULT now()
);
`
