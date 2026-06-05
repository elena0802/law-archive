import { scholarProfile } from "@/lib/profile";

export const siteConfig = {
  name: "형사법 아카이브",
  nameEn: "Criminal Law Archive",
  authorName: scholarProfile.name,
  tagline: "형사법의 글과 강의 노트를 조용히 모으는 디지털 서재",
  description:
    "형사법을 연구하며 사람과 사회를 생각해 온 한 학자의 글과 사유를 글과 연재로 정리한 디지털 서재입니다.",
  flagshipSeriesTitle: "형벌과 사회",
  flagshipSeriesSlug: "형벌과-사회",
  hero: {
    eyebrow: "디지털 서재",
    headlineLine1: "형사법을 연구하며",
    /** Keep "생각해 왔습니다" together — avoids orphan "왔습니다." on narrow viewports */
    headlineLine2: "사람과 사회를 생각해\u00A0왔습니다.",
    lead:
      "오랜 세월 강의실과 서재 사이를 오가며 남긴 질문들입니다. 책상 위 메모와 판례 속의 문장처럼, 이곳에는 형사법을 가르치고 글쓰던 한 학자의 생각이 차분히 놓입니다. 빠른 논평보다 오래 남을 사유를 위해 기록합니다.",
    image: "/images/hero-study-v2.png",
    imageWidth: 1536,
    imageHeight: 1024,
    imageAlt:
      "책상 램프 아래 글을 쓰는 학자와 책, 원고가 있는 서재를 담은 수채화 일러스트",
    imageCaption: "서재 책상 위의 기록 — 오래 쌓인 책과 원고",
  },
  navigation: [
    { href: "/", label: "서재", match: "exact" as const },
    { href: "/essays", label: "글", match: "prefix" as const },
    { href: "/series", label: "연재", match: "prefix" as const },
    { href: "/categories", label: "주제", match: "prefix" as const },
    { href: "/search", label: "검색", match: "prefix" as const },
    { href: "/guestbook", label: "안부의 글", match: "exact" as const },
    { href: "/about", label: "서재 소개", match: "exact" as const },
  ],
  about: {
    pageTitle: "서재 소개",
  },
} as const;

export type SiteConfig = typeof siteConfig;

export function getSiteOrigin() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

  if (fromEnv) {
    return fromEnv;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

/** Korean citation line for essay pages (Phase 1 PR3). */
export function formatEssayCitation({
  title,
  slug,
  date,
  siteOrigin = getSiteOrigin(),
}: {
  title: string;
  slug: string;
  date: string;
  siteOrigin?: string;
}) {
  const formattedDate = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));

  return `${siteConfig.authorName}, 「${title}」, ${siteConfig.name}, ${formattedDate}, ${siteOrigin}/essays/${slug}`;
}
