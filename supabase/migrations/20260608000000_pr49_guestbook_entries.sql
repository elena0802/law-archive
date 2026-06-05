-- PR49.3: Guestbook entries for scholar greetings

CREATE TABLE guestbook_entries (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name           text NOT NULL,
  affiliation    text,
  content        text NOT NULL,
  password_hash  text,
  status         text NOT NULL DEFAULT 'pending',
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT guestbook_entries_status_check
    CHECK (status IN ('pending', 'approved', 'rejected')),
  CONSTRAINT guestbook_entries_name_not_blank
    CHECK (length(trim(name)) > 0),
  CONSTRAINT guestbook_entries_content_not_blank
    CHECK (length(trim(content)) > 0)
);

CREATE INDEX guestbook_entries_status_created_at_idx
  ON guestbook_entries (status, created_at ASC);

CREATE TRIGGER guestbook_entries_updated_at
  BEFORE UPDATE ON guestbook_entries
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

ALTER TABLE guestbook_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY guestbook_entries_select_anon
  ON guestbook_entries
  FOR SELECT
  TO anon
  USING (status = 'approved');

CREATE POLICY guestbook_entries_select_authenticated
  ON guestbook_entries
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY guestbook_entries_insert_anon
  ON guestbook_entries
  FOR INSERT
  TO anon
  WITH CHECK (status = 'pending');

CREATE POLICY guestbook_entries_insert_authenticated
  ON guestbook_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (status IN ('pending', 'approved'));
