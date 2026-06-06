-- PR49.5: Professor replies on guestbook entries

ALTER TABLE guestbook_entries
  ADD COLUMN reply_content text,
  ADD COLUMN replied_at timestamptz,
  ADD COLUMN replied_by text;

ALTER TABLE guestbook_entries
  ADD CONSTRAINT guestbook_entries_reply_content_not_blank
    CHECK (reply_content IS NULL OR length(trim(reply_content)) > 0);
