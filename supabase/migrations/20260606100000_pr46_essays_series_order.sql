-- PR46: stable installment order within a series

ALTER TABLE public.essays
  ADD COLUMN IF NOT EXISTS series_order integer;

COMMENT ON COLUMN public.essays.series_order IS
  'Installment order within series_slug; null uses title/slug/date fallbacks on public pages.';

CREATE INDEX IF NOT EXISTS essays_series_slug_series_order_essay_date_idx
  ON public.essays (series_slug, series_order, essay_date);

-- Backfill from trailing (N) in title when order is not set yet.
UPDATE public.essays
SET series_order = (regexp_match(title, '\((\d+)\)\s*$'))[1]::integer
WHERE series_slug IS NOT NULL
  AND series_order IS NULL
  AND title ~ '\([0-9]+\)\s*$';
