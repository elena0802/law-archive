const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  형벌론: "국가의 처벌과 책임의 의미를 탐구하는 글입니다.",
  국가형벌권: "국가가 처벌할 수 있는 근거와 한계를 차분히 묻습니다.",
  "AI와 형사법": "기술 변화 속에서 형사법이 지켜야 할 기준을 살펴봅니다.",
  "디지털 형사법": "디지털 범죄 시대의 형사법 쟁점을 정리합니다.",
  법학교육: "법학을 배우고 가르치는 과정의 질문을 기록합니다.",
  법조윤리: "좋은 법조인의 태도와 사고 방식을 다룹니다.",
  법철학: "법과 인간, 책임의 근본 문제를 성찰합니다.",
  "학자로서의 기록": "연구와 교육 현장에서 마주한 생각을 남긴 글입니다.",
};

export function getCategoryDescription(categoryTitle: string) {
  return (
    CATEGORY_DESCRIPTIONS[categoryTitle] ??
    "이 주제에 속한 글의 흐름을 한자리에서 읽을 수 있습니다."
  );
}

