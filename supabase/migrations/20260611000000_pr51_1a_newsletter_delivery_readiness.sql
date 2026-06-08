-- PR51.1A: Newsletter subscriber delivery readiness (additive)

ALTER TABLE newsletter_subscribers
  ADD COLUMN unsubscribe_token text,
  ADD COLUMN unsubscribed_at timestamptz;

UPDATE newsletter_subscribers
SET unsubscribe_token = encode(gen_random_bytes(32), 'hex')
WHERE unsubscribe_token IS NULL;

UPDATE newsletter_subscribers
SET unsubscribed_at = updated_at
WHERE status = 'unsubscribed'
  AND unsubscribed_at IS NULL;

ALTER TABLE newsletter_subscribers
  ALTER COLUMN unsubscribe_token SET DEFAULT encode(gen_random_bytes(32), 'hex'),
  ALTER COLUMN unsubscribe_token SET NOT NULL;

ALTER TABLE newsletter_subscribers
  ADD CONSTRAINT newsletter_subscribers_unsubscribe_token_unique
    UNIQUE (unsubscribe_token);

CREATE OR REPLACE FUNCTION newsletter_subscribers_status_timestamps()
RETURNS trigger AS $$
BEGIN
  IF NEW.status = 'unsubscribed' AND (OLD.status IS DISTINCT FROM 'unsubscribed') THEN
    NEW.unsubscribed_at := COALESCE(NEW.unsubscribed_at, now());
  ELSIF NEW.status = 'active' AND OLD.status = 'unsubscribed' THEN
    NEW.unsubscribed_at := NULL;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER newsletter_subscribers_status_timestamps
  BEFORE UPDATE ON newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION newsletter_subscribers_status_timestamps();
