-- PR26: Anonymous public comments on essay detail pages

CREATE TABLE comments (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  essay_slug         text NOT NULL,
  author_name        text,
  author_affiliation text,
  content            text NOT NULL,
  status             text NOT NULL DEFAULT 'approved',
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT comments_status_check CHECK (status IN ('pending', 'approved', 'rejected')),
  CONSTRAINT comments_content_not_blank CHECK (length(trim(content)) > 0)
);

CREATE INDEX comments_essay_slug_status_created_at_idx
  ON comments (essay_slug, status, created_at ASC);

CREATE TRIGGER comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY comments_select_anon
  ON comments
  FOR SELECT
  TO anon
  USING (status = 'approved');

CREATE POLICY comments_select_authenticated
  ON comments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY comments_insert_anon
  ON comments
  FOR INSERT
  TO anon
  WITH CHECK (status = 'approved');

CREATE POLICY comments_insert_authenticated
  ON comments
  FOR INSERT
  TO authenticated
  WITH CHECK (status = 'approved');
