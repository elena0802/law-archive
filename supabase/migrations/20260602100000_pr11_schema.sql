-- PR11: CMS schema (essays + series)
-- See design/PR11-CMS-ARCHITECTURE.md

CREATE TYPE essay_status AS ENUM ('draft', 'published');

CREATE TABLE series (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          text NOT NULL UNIQUE,
  title         text NOT NULL,
  description   text NOT NULL DEFAULT '',
  display_order integer NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX series_display_order_idx ON series (display_order);

CREATE TABLE essays (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  slug          text NOT NULL UNIQUE,
  description   text NOT NULL,
  content       text NOT NULL DEFAULT '',
  essay_date    date NOT NULL,
  category      text NOT NULL DEFAULT '',
  series_slug   text NOT NULL REFERENCES series (slug) ON UPDATE RESTRICT ON DELETE RESTRICT,
  status        essay_status NOT NULL DEFAULT 'draft',
  featured      boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  published_at  timestamptz
);

CREATE INDEX essays_status_essay_date_idx ON essays (status, essay_date DESC);
CREATE INDEX essays_series_slug_idx ON essays (series_slug);
CREATE INDEX essays_updated_at_idx ON essays (updated_at DESC);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER series_updated_at
  BEFORE UPDATE ON series
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER essays_updated_at
  BEFORE UPDATE ON essays
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();
