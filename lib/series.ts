/**
 * Curator introductions for series volumes.
 * Falls back to auto-generated description when a slug is not listed.
 */
const seriesIntroductions: Record<string, string> = {
  "형벌과-사회":
    "국가 형벌권과 공동체의 응답을 형사법의 관점에서 차분히 정리하는 연재입니다. 복수의 감정과 제도적 형벌이 만나는 지점에서, 우리는 무엇을 묻어야 하는가.",
  "ai와-형사법":
    "디지털 기술이 수사·재판·책임 개념에 던지는 질문을 형사법의 언어로 따라갑니다. 도구의 시대에도 남는 판단과 윤리의 자리를 묻습니다.",
  "로스쿨-시대":
    "법학 교육과 법조인의 사유 방식을 돌아보는 연재입니다. 강의실에서 시작된 질문이 어떻게 오래 가는 사유가 되는지 기록합니다.",
  "형사법-교수로-산다는-것":
    "형사법을 가르치고 연구하며 살아온 시간의 기록입니다. 학자로서의 일상과 강의실의 질문을 차분히 남깁니다.",
  "법과-인간":
    "법이 인간을 어디까지 바꿀 수 있는지, 그리고 어디까지 바꿔서는 안 되는지를 묻는 연재입니다. 제도 너머의 인간을 향한 사유입니다.",
};

export function getSeriesIntroduction(slug: string, fallback: string) {
  return seriesIntroductions[slug] ?? fallback;
}
