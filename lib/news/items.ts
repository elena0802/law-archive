import type { NewsItem } from "@/lib/news/types";

/** Operating activity log — replace with Supabase adapter in a future PR. */
export const newsItems: NewsItem[] = [
  {
    id: "news-2026-06-24-korea-law-ai-symposium",
    date: "2026-06-24",
    category: "학술제",
    title: "고려대 법학전문대학원 AI 학술제 참여",
    summary:
      "인공지능 시대의 법교육과 연구의 변화를 논의하는 학술제에 참여합니다.",
    featured: true,
    published: true,
    featuredCtaBehavior: "link",
    image: "/images/news/korea-law-ai-symposium-poster.jpg",
    link: "https://www.lawtimes.co.kr/news/articleView.html?idxno=221845",
  },
  {
    id: "news-2026-06-14-series-ai",
    date: "2026-06-14",
    category: "연재",
    title: "AI와 형사법 연재 시작",
    summary: "AI 기술과 형사법의 접점을 연구노트 형식으로 기록합니다.",
    published: true,
    featuredCtaBehavior: "link",
  },
  {
    id: "news-2026-06-11-curation",
    date: "2026-06-11",
    category: "사이트",
    title: "요즘의 시선 공개",
    summary: "외부 콘텐츠 큐레이션 섹션을 새롭게 공개했습니다.",
    published: true,
    featuredCtaBehavior: "link",
  },
  {
    id: "news-2026-05-22-comparative-criminal-law-debate",
    date: "2026-05-22",
    category: "학회",
    title: "한국비교형사법학회·한국형사법학회 공동 대토론회 참여",
    summary:
      "「형법상 고의란 무엇인가?」를 주제로 연세대 법학전문대학원에서 열린 대토론회에 사회자로 참여했습니다.",
    published: true,
    featuredCtaBehavior: "link",
  },
  {
    id: "news-2026-05-20-series-punishment-society",
    date: "2026-05-20",
    category: "연재",
    title: "형벌과 사회 연재 시작",
    summary: "국가 형벌권과 공동체의 응답을 형사법의 관점에서 기록합니다.",
    published: true,
    featuredCtaBehavior: "link",
  },
  {
    id: "news-2026-04-17-spring-conference",
    date: "2026-04-17",
    category: "학회",
    title: "한국형사법학회 춘계학술대회",
    summary: "제주대 로스쿨에서 열린 춘계공동학술대회에 토론자로 참여했습니다.",
    published: true,
    featuredCtaBehavior: "link",
  },
];
