-- PR19: Series management fields and visibility

CREATE TYPE series_status AS ENUM ('active', 'hidden');

ALTER TABLE series
  ADD COLUMN introduction text NOT NULL DEFAULT '',
  ADD COLUMN status series_status NOT NULL DEFAULT 'active';

CREATE INDEX series_status_display_order_idx ON series (status, display_order, title);
