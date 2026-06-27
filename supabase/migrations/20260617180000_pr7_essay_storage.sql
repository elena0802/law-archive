-- PR7: Essay cover image storage bucket

INSERT INTO storage.buckets (id, name, public)
VALUES ('essays', 'essays', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

DROP POLICY IF EXISTS essay_images_public_read ON storage.objects;
DROP POLICY IF EXISTS essay_images_authenticated_insert ON storage.objects;
DROP POLICY IF EXISTS essay_images_authenticated_update ON storage.objects;
DROP POLICY IF EXISTS essay_images_authenticated_delete ON storage.objects;

CREATE POLICY essay_images_public_read
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'essays');

CREATE POLICY essay_images_authenticated_insert
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'essays');

CREATE POLICY essay_images_authenticated_update
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'essays')
  WITH CHECK (bucket_id = 'essays');

CREATE POLICY essay_images_authenticated_delete
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'essays');
