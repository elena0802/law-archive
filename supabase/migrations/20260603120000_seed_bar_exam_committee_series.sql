-- Seed series for bar exam committee essays (seed import FK target)

INSERT INTO series (slug, title, description, display_order)
VALUES
  (
    '사법시험-출제위원을-하며-느낀-것',
    '사법시험 출제위원을 하며 느낀 것',
    '사법시험 출제와 채점을 경험하며 느낀 평가의 무게, 공정함, 그리고 법조인 선발의 책임을 기록합니다.',
    8
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order;
