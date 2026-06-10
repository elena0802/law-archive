-- PR56: Essay cover image (URL + alt for cards, detail, newsletter, OG)

ALTER TABLE essays
  ADD COLUMN cover_image_url text,
  ADD COLUMN cover_image_alt text;

COMMENT ON COLUMN essays.cover_image_url IS
  'Optional cover image URL (absolute or /images/essays/...). Used on cards, detail, newsletter, and OG.';

COMMENT ON COLUMN essays.cover_image_alt IS
  'Accessible description for cover_image_url. Falls back to essay title when empty.';
