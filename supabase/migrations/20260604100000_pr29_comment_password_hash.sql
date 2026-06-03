-- PR29: Author self-delete password hash (nullable for existing comments)

ALTER TABLE comments
  ADD COLUMN password_hash text;
