-- PR50.2: Allow draft essays without series assignment
ALTER TABLE public.essays
  ALTER COLUMN series_slug DROP NOT NULL;

COMMENT ON COLUMN public.essays.series_slug IS
  'FK to series; null allowed for unfinished drafts.';
