-- PR49.1: Threaded comment replies foundation

ALTER TABLE comments
  ADD COLUMN parent_id uuid REFERENCES comments (id) ON DELETE CASCADE;

CREATE INDEX comments_parent_id_idx ON comments (parent_id);
