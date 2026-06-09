-- PR52.1: Scholar DNA / Academic Life Story analyses

CREATE TABLE scholar_dna_analyses (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name             text NOT NULL,
  affiliation      text NOT NULL,
  field_of_study   text NOT NULL,
  paper_title_1    text NOT NULL,
  paper_title_2    text,
  paper_title_3    text,
  recent_interest  text,
  scholar_alias    text,
  academic_life_story text,
  keywords         text[] NOT NULL DEFAULT '{}',
  scholar_dna      jsonb NOT NULL DEFAULT '[]',
  ai_one_liner     text,
  status           text NOT NULL DEFAULT 'pending',
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT scholar_dna_analyses_status_check
    CHECK (status IN ('pending', 'completed', 'failed')),
  CONSTRAINT scholar_dna_analyses_name_not_blank
    CHECK (length(trim(name)) > 0),
  CONSTRAINT scholar_dna_analyses_affiliation_not_blank
    CHECK (length(trim(affiliation)) > 0),
  CONSTRAINT scholar_dna_analyses_field_not_blank
    CHECK (length(trim(field_of_study)) > 0),
  CONSTRAINT scholar_dna_analyses_paper_1_not_blank
    CHECK (length(trim(paper_title_1)) > 0)
);

CREATE INDEX scholar_dna_analyses_status_created_at_idx
  ON scholar_dna_analyses (status, created_at DESC);

CREATE TRIGGER scholar_dna_analyses_updated_at
  BEFORE UPDATE ON scholar_dna_analyses
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

ALTER TABLE scholar_dna_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY scholar_dna_analyses_select_anon
  ON scholar_dna_analyses
  FOR SELECT
  TO anon
  USING (status = 'completed');

CREATE POLICY scholar_dna_analyses_select_authenticated
  ON scholar_dna_analyses
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY scholar_dna_analyses_insert_anon
  ON scholar_dna_analyses
  FOR INSERT
  TO anon
  WITH CHECK (status IN ('pending', 'completed'));

CREATE POLICY scholar_dna_analyses_insert_authenticated
  ON scholar_dna_analyses
  FOR INSERT
  TO authenticated
  WITH CHECK (status IN ('pending', 'completed'));
