-- PR16: Trash (soft delete) status for essays

ALTER TYPE essay_status ADD VALUE IF NOT EXISTS 'deleted';
