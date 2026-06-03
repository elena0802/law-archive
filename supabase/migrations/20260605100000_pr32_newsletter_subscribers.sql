-- PR32: Newsletter subscriber collection (no sending yet)

CREATE TABLE newsletter_subscribers (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email      text NOT NULL,
  status     text NOT NULL DEFAULT 'active',
  source     text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT newsletter_subscribers_status_check
    CHECK (status IN ('active', 'unsubscribed')),
  CONSTRAINT newsletter_subscribers_email_not_blank
    CHECK (length(trim(email)) > 0),
  CONSTRAINT newsletter_subscribers_email_unique UNIQUE (email)
);

CREATE TRIGGER newsletter_subscribers_updated_at
  BEFORE UPDATE ON newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY newsletter_subscribers_insert_anon
  ON newsletter_subscribers
  FOR INSERT
  TO anon
  WITH CHECK (status = 'active');

CREATE POLICY newsletter_subscribers_insert_authenticated
  ON newsletter_subscribers
  FOR INSERT
  TO authenticated
  WITH CHECK (status = 'active');
