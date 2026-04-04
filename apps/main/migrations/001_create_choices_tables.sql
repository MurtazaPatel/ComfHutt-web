CREATE TABLE leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text NOT NULL UNIQUE, -- Changed from citext for broader compatibility if citext extension not enabled, but uniqueness enforced
  created_at timestamptz DEFAULT now(),
  source text,
  anonymous boolean DEFAULT true
);

CREATE TABLE choice_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id) ON DELETE SET NULL,
  intent text NOT NULL CHECK (intent IN ('invest','list-property')),
  nps smallint CHECK (nps BETWEEN 0 AND 10),
  meta jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);