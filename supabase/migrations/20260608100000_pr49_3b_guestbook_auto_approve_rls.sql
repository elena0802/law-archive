-- PR49.3B: MVP auto-publish — allow anonymous inserts as approved (comments pattern)

DROP POLICY guestbook_entries_insert_anon ON guestbook_entries;

CREATE POLICY guestbook_entries_insert_anon
  ON guestbook_entries
  FOR INSERT
  TO anon
  WITH CHECK (status = 'approved');
