-- PR54.1: Professor recommendation note on curation items

ALTER TABLE professor_curation_items
  ADD COLUMN professor_note text;

DROP INDEX IF EXISTS professor_curation_items_featured_youtube_idx;

CREATE INDEX professor_curation_items_featured_idx
  ON professor_curation_items (is_featured, is_visible, sort_order DESC, recommended_at DESC)
  WHERE is_featured = true AND is_visible = true;
