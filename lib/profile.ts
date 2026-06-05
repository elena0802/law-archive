import {
  representativeBooks,
  representativeBooksHeading,
  representativeBooksIntro,
} from "@/src/data/books";

/** Scholar profile content — single source for About, Research, and future pages. */

export type ProfileNarrativeSection = {
  id: string;
  heading: string;
  paragraphs: readonly string[];
};

export type ProfileResearchArea = {
  id: string;
  title: string;
  description: string;
};

export type ProfileBook = {
  id: string;
  title: string;
  publisher: string;
  year: number;
  pages?: number;
  note?: string;
  coverImage?: string;
};

export type ProfileBooksSection = {
  heading: string;
  intro?: string;
  books: readonly ProfileBook[];
};

export type ScholarProfile = {
  name: string;
  nameHanja: string;
  role: string;
  introduction: ProfileNarrativeSection;
  academicBackground: ProfileNarrativeSection;
  research: ProfileNarrativeSection & {
    areas: readonly ProfileResearchArea[];
  };
  academicActivities: ProfileNarrativeSection;
  publicService: ProfileNarrativeSection;
  selectedBooks: ProfileBooksSection;
  whyArchive: ProfileNarrativeSection;
};

export const scholarProfile = {
  name: "천진호",
  nameHanja: "千鎭豪",
  role: "형사법학자",
  introduction: {
    id: "introduction",
    heading: "소개",
    paragraphs: [
      "천진호(千鎭豪)는 형사법을 가르치고 연구해 온 학자입니다. 형법 총각론과 형사소송법, 형사정책을 아우르며 법이 사람과 사회를 어떻게 대하는지를 질문해 왔습니다.",
      "이 페이지는 홍보나 연락을 위한 공간이 아닙니다. 한 학자의 강의와 연구, 공익 활동이 어떤 흐름 위에 있었는지를 밝히기 위한 기록이며, 이 아카이브에 실린 글은 그 연속 위에 놓입니다.",
    ],
  },
  academicBackground: {
    id: "academic-background",
    heading: "학력과 경력",
    paragraphs: [
      "1958년 대구에서 태어나 인창고등학교를 거쳐 경북대학교 법과대학에서 법학을 공부했습니다. 대학원에서 형사법을 깊이 익힌 뒤, 1991년부터 경북대학교 공법학과에서 전임강사·조교수·부교수·교수로 재직하며 형법과 형사소송법을 가르쳤습니다. 법학연구소장과 법률상담소장을 맡기도 했습니다.",
      "2007년 동아대학교 법학전문대학원 교수로 옮겨 형법·형사소송법 강의와 연구를 이어 왔습니다. 오랜 대학 강의를 마친 뒤에도 강의 노트와 원고를 정리하며, 형사법이 마주하는 근본적인 질문을 글로 옮기고 있습니다.",
    ],
  },
  research: {
    id: "research",
    heading: "연구 분야",
    paragraphs: [
      "형사법의 이론적 기초—범죄 성립, 고의와 과실, 위법성과 책임, 미수와 공범—를 정리하는 데서 출발합니다. 형벌의 정당화와 국가형벌권의 한계, 증거법과 수사절차에서의 인권 보장, 범죄피해자와 형사정책도 오랫동안 다뤄 왔습니다.",
      "정보사회의 범죄 양상과 디지털 증거, 경제범죄에 대한 정책적 대응, 형법 개정과 입법론에도 관심을 두었습니다. 판례를 나열하기보다, 제도 너머에 남는 질문을 범죄체계론과 형사정책의 관점에서 차분히 기록하는 것을 연구의 방향으로 삼아 왔습니다.",
    ],
    areas: [
      {
        id: "criminal-theory",
        title: "형사법 이론과 범죄체계",
        description:
          "고의·과실, 위법성과 책임, 미수와 공범 등 범죄 성립의 기초를 범죄체계론의 관점에서 정리합니다.",
      },
      {
        id: "punishment-state-power",
        title: "형벌론과 국가형벌권",
        description:
          "형벌의 정당화, 국가형벌권의 한계, 형벌과 복수·예방의 관계를 형사정책과 연결해 탐구합니다.",
      },
      {
        id: "evidence-procedure",
        title: "증거법과 수사절차",
        description:
          "증거능력·증명력, 위법수집증거, 영상녹화물 등 증거법과 수사절차에서의 인권 보장을 다룹니다.",
      },
      {
        id: "victims-policy",
        title: "범죄피해자와 형사정책",
        description:
          "피해자학, 피해자 보호, 형사조정과 회복적 사법의 관점에서 형사정책을 검토합니다.",
      },
      {
        id: "digital-economic-crime",
        title: "디지털·경제범죄와 입법론",
        description:
          "정보사회의 범죄 양상, 경제범죄에 대한 정책적 대응, 형법 개정과 입법론에 관심을 둡니다.",
      },
    ],
  },
  academicActivities: {
    id: "academic-activities",
    heading: "학술 활동",
    paragraphs: [
      "경북대학교와 동아대학교 법학전문대학원에서 형법·형사소송법을 가르치며, 로스쿨 교육과 법학전문대학원 교재 개발에도 참여했습니다. 한국학술진흥재단의 법학전문대학원 교재 개발·우수논문 사후지원·단독연구 사업을 수행했고, 「미수범이론의 발전과 전망」(2002)으로 한국형사법학회 학술상, 「위법수집증거배제법칙의 私人効」(2004)으로 한국비교형사법학회 학술상을 수상했습니다.",
      "한국형사법학회·한국비교형사법학회·한국형사정책학회에서 활동했으며, 한국형사법학회장을 역임하였습니다. 한국형사정책연구원 형법개정연구 등 정책 연구의 위원장을 맡은 바 있습니다. 사법시험·변호사시험·행정고등고시·입법고등고시에서 형법·형사소송법·형사정책·교정학 분야의 출제와 채점에도 참여했습니다.",
    ],
  },
  publicService: {
    id: "public-service",
    heading: "공익 활동",
    paragraphs: [
      "학문을 강의실에만 두지 않고, 수사·재판·인권의 현장과 맞닿는 자리에서도 형사법의 원칙을 논의해 왔습니다. 대구고등검찰청 항고심사회 위원, 범죄피해자지원센터 형사조정위원, 대법원 사법참여기획단 설립준비위원회 위원 등을 역임했습니다.",
      "대구지방경찰청 시민단체 경찰협력위원회 위원·위원장, 국가인권위원회 인권순회교육단 강사, 부산지방경찰청 집회시위 자문위원회 위원 등을 맡으며 수사권 행사와 인권 보장, 피해자 보호가 균형을 이루도록 관심을 기울였습니다.",
    ],
  },
  selectedBooks: {
    heading: representativeBooksHeading,
    intro: representativeBooksIntro,
    books: representativeBooks,
  },
  whyArchive: {
    id: "why-archive",
    heading: "이 서재가 있는 이유",
    paragraphs: [
      "이곳은 빠른 논평이나 홍보를 위한 공간이 아닙니다. 오래 가르치고 쓰며 남긴 질문들을, 연재와 글의 형태로 차분히 모아 두는 개인 서재입니다.",
      "판례와 제도는 시대마다 바뀝니다. 그러나 형사법이 마주하는 근본적인 질문—책임, 형벌, 국가의 역할—은 오래 남습니다. 이 아카이브는 그 질문들을 다시 펼쳐 읽을 수 있도록 정리합니다.",
      "독자가 한 편의 글에서 출발해 연재 전체를 읽고, 다시 처음으로 돌아갈 수 있도록 연재를 중심에 두었습니다.",
    ],
  },
} as const satisfies ScholarProfile;

export function formatBookCitation(book: ProfileBook) {
  return `《${book.title}》, ${book.publisher}, ${book.year}.`;
}

export function formatBookLabel(book: ProfileBook) {
  if (book.pages) {
    return `${book.publisher} · ${book.pages}면 · ${book.year}`;
  }

  return `${book.publisher} · ${book.year}`;
}
