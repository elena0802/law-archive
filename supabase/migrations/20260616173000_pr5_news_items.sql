-- PR5: News admin table

CREATE TABLE IF NOT EXISTS news_items (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date       date NOT NULL,
  category   text NOT NULL,
  title      text NOT NULL,
  summary    text NOT NULL DEFAULT '',
  image_url  text,
  link_url   text,
  featured   boolean NOT NULL DEFAULT false,
  published  boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT news_items_category_check
    CHECK (category IN ('학회', '학술제', '강연', '연재', '기고', '인터뷰', '사이트', '프로젝트')),
  CONSTRAINT news_items_title_not_blank
    CHECK (length(trim(title)) > 0)
);

CREATE INDEX IF NOT EXISTS news_items_published_date_idx
  ON news_items (published, date DESC, created_at DESC);

CREATE INDEX IF NOT EXISTS news_items_featured_idx
  ON news_items (featured)
  WHERE featured = true;

CREATE TRIGGER news_items_updated_at
  BEFORE UPDATE ON news_items
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

ALTER TABLE news_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY news_items_select_anon
  ON news_items
  FOR SELECT
  TO anon
  USING (published = true);

CREATE POLICY news_items_select_authenticated
  ON news_items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY news_items_insert_authenticated
  ON news_items
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY news_items_update_authenticated
  ON news_items
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY news_items_delete_authenticated
  ON news_items
  FOR DELETE
  TO authenticated
  USING (true);

INSERT INTO news_items (date, category, title, summary, image_url, link_url, featured, published)
SELECT * FROM (
  VALUES
    ('2026-06-24'::date, '학술제', '고려대 법학전문대학원 AI 학술제 참여', '인공지능 시대의 법교육과 연구의 변화를 논의하는 학술제에 참여합니다.', '/images/news/korea-law-ai-symposium-poster.jpg', 'https://www.lawtimes.co.kr/news/articleView.html?idxno=221845', true, true),
    ('2026-06-14'::date, '연재', 'AI와 형사법 연재 시작', 'AI 기술과 형사법의 접점을 연구노트 형식으로 기록합니다.', null, null, false, true),
    ('2026-06-11'::date, '사이트', '요즘의 시선 공개', '외부 콘텐츠 큐레이션 섹션을 새롭게 공개했습니다.', null, null, false, true),
    ('2026-05-22'::date, '학회', '한국비교형사법학회·한국형사법학회 공동 대토론회 참여', '「형법상 고의란 무엇인가?」를 주제로 연세대 법학전문대학원에서 열린 대토론회에 사회자로 참여했습니다.', null, null, false, true),
    ('2026-05-20'::date, '연재', '형벌과 사회 연재 시작', '국가 형벌권과 공동체의 응답을 형사법의 관점에서 기록합니다.', null, null, false, true),
    ('2026-04-17'::date, '학회', '한국형사법학회 춘계학술대회', '제주대 로스쿨에서 열린 춘계공동학술대회에 토론자로 참여했습니다.', null, null, false, true)
) AS seed(date, category, title, summary, image_url, link_url, featured, published)
WHERE NOT EXISTS (SELECT 1 FROM news_items);
