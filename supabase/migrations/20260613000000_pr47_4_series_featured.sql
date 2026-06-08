-- PR47.4: Homepage featured series flag

ALTER TABLE series
  ADD COLUMN featured boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN series.featured IS
  'When true and status is active, series appears in the homepage 대표 연재 section.';

-- Preserve previously homepage-featured series (matched by stable slug).
UPDATE series
SET featured = true
WHERE slug IN (
  '형사법-교수로-산다는-것',
  '사법시험-출제위원을-하며-느낀-것'
);
