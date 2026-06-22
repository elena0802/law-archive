-- PR5.3: Featured Activity CTA behavior option

ALTER TABLE news_items
  ADD COLUMN IF NOT EXISTS featured_cta_behavior text NOT NULL DEFAULT 'link';

ALTER TABLE news_items
  DROP CONSTRAINT IF EXISTS news_items_featured_cta_behavior_check;

ALTER TABLE news_items
  ADD CONSTRAINT news_items_featured_cta_behavior_check
  CHECK (featured_cta_behavior IN ('image', 'link', 'none'));
