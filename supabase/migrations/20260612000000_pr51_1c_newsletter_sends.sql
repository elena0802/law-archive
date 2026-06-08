-- PR51.1C: Newsletter broadcast send log

CREATE TABLE newsletter_sends (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject         text NOT NULL,
  body            text NOT NULL,
  related_url     text,
  recipient_count integer NOT NULL,
  success_count   integer NOT NULL,
  failure_count   integer NOT NULL,
  sent_at         timestamptz NOT NULL DEFAULT now(),
  created_by      text NOT NULL,
  CONSTRAINT newsletter_sends_subject_not_blank
    CHECK (length(trim(subject)) > 0),
  CONSTRAINT newsletter_sends_body_not_blank
    CHECK (length(trim(body)) > 0),
  CONSTRAINT newsletter_sends_recipient_count_non_negative
    CHECK (recipient_count >= 0),
  CONSTRAINT newsletter_sends_success_count_non_negative
    CHECK (success_count >= 0),
  CONSTRAINT newsletter_sends_failure_count_non_negative
    CHECK (failure_count >= 0)
);

CREATE INDEX newsletter_sends_sent_at_idx
  ON newsletter_sends (sent_at DESC);

ALTER TABLE newsletter_sends ENABLE ROW LEVEL SECURITY;
