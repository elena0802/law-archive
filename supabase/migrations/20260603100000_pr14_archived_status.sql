-- PR14: Archive (보관) status for essays

ALTER TYPE essay_status ADD VALUE IF NOT EXISTS 'archived';
