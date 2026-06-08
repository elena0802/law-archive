export type RepresentativeBook = {
  id: string;
  title: string;
  publisher: string;
  pages: number;
  year: number;
  coverImage: string;
  note?: string;
};

export const representativeBooksHeading = "대표 연구저서";

export const representativeBooksIntro =
  "강의와 연구를 바탕으로 집필한 대표 저서입니다. 수험용 총서가 아니라, 형사법의 기본 문제를 차분히 정리한 교재와 논저입니다.";

/** Reviewed representative books — shared by About and Research pages. */
export const representativeBooks: readonly RepresentativeBook[] = [
  {
    id: "criminal-law-general",
    title: "형법 총론",
    publisher: "준커뮤니케이션즈",
    pages: 1006,
    year: 2016,
    coverImage: "/images/books/criminal-law-general.jpg",
  },
  {
    id: "criminal-evidence",
    title: "형사증거법",
    publisher: "준커뮤니케이션즈",
    pages: 328,
    year: 2016,
    coverImage: "/images/books/criminal-evidence-law.jpg",
  },
  {
    id: "criminal-law-issues",
    title: "형사법쟁점정리",
    publisher: "준커뮤니케이션즈",
    pages: 390,
    year: 2016,
    coverImage: "/images/books/criminal-law-issues.jpg",
  },
  {
    id: "criminal-procedure-issues",
    title: "쟁점 형사소송법",
    publisher: "준커뮤니케이션즈",
    pages: 490,
    year: 2020,
    coverImage: "/images/books/criminal-procedure-issues.jpg",
  },
  {
    id: "precedent-criminal-law-general",
    title: "판례교재 형법총론 (5인공저)",
    publisher: "준커뮤니케이션즈",
    pages: 486,
    year: 2010,
    coverImage: "/images/books/precedent-criminal-law-general.jpg",
  },
  {
    id: "international-criminal-law",
    title: "국제형법 (4인공저)",
    publisher: "준커뮤니케이션즈",
    pages: 280,
    year: 2011,
    coverImage: "/images/books/international-criminal-law.jpg",
  },
] as const;
