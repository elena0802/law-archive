-- PR19.2: human-friendly series ordering starts from 1

UPDATE series
SET display_order = display_order + 1;
