-- PR54: Professor curation items ("요즘의 시선")

CREATE TABLE professor_curation_items (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type           text NOT NULL,
  title          text NOT NULL,
  description    text NOT NULL DEFAULT '',
  url            text NOT NULL,
  source         text NOT NULL DEFAULT '',
  thumbnail_url  text,
  published_at   date,
  recommended_at date NOT NULL DEFAULT CURRENT_DATE,
  is_featured    boolean NOT NULL DEFAULT false,
  is_visible     boolean NOT NULL DEFAULT true,
  sort_order     integer NOT NULL DEFAULT 0,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT professor_curation_items_type_check
    CHECK (type IN ('youtube', 'article', 'blog', 'paper', 'book')),
  CONSTRAINT professor_curation_items_title_not_blank
    CHECK (length(trim(title)) > 0),
  CONSTRAINT professor_curation_items_url_not_blank
    CHECK (length(trim(url)) > 0),
  CONSTRAINT professor_curation_items_sort_order_non_negative
    CHECK (sort_order >= 0)
);

CREATE INDEX professor_curation_items_visible_sort_idx
  ON professor_curation_items (is_visible, sort_order DESC, recommended_at DESC);

CREATE INDEX professor_curation_items_featured_youtube_idx
  ON professor_curation_items (type, is_featured, is_visible)
  WHERE type = 'youtube' AND is_featured = true AND is_visible = true;

CREATE TRIGGER professor_curation_items_updated_at
  BEFORE UPDATE ON professor_curation_items
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

ALTER TABLE professor_curation_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY professor_curation_items_select_anon
  ON professor_curation_items
  FOR SELECT
  TO anon
  USING (is_visible = true);

CREATE POLICY professor_curation_items_select_authenticated
  ON professor_curation_items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY professor_curation_items_insert_authenticated
  ON professor_curation_items
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY professor_curation_items_update_authenticated
  ON professor_curation_items
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY professor_curation_items_delete_authenticated
  ON professor_curation_items
  FOR DELETE
  TO authenticated
  USING (true);
