-- PR11: Row Level Security

ALTER TABLE series ENABLE ROW LEVEL SECURITY;
ALTER TABLE essays ENABLE ROW LEVEL SECURITY;

-- series: public read (volume metadata is not secret)
CREATE POLICY series_select_anon
  ON series
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY series_select_authenticated
  ON series
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY series_insert_authenticated
  ON series
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY series_update_authenticated
  ON series
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY series_delete_authenticated
  ON series
  FOR DELETE
  TO authenticated
  USING (true);

-- essays: anon sees published only
CREATE POLICY essays_select_anon
  ON essays
  FOR SELECT
  TO anon
  USING (status = 'published');

CREATE POLICY essays_select_authenticated
  ON essays
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY essays_insert_authenticated
  ON essays
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY essays_update_authenticated
  ON essays
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY essays_delete_authenticated
  ON essays
  FOR DELETE
  TO authenticated
  USING (true);
