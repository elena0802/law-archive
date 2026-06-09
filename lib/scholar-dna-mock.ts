import type { ScholarDnaTraitRow } from "@/lib/content/db-types";

export type ScholarDnaMockInput = {
  name: string;
  affiliation: string;
  fieldOfStudy: string;
  paperTitles: string[];
  recentInterest: string | null;
};

export type ScholarDnaMockResult = {
  scholarAlias: string;
  academicLifeStory: string;
  keywords: string[];
  scholarDna: ScholarDnaTraitRow[];
  aiOneLiner: string;
};

const FIELD_TOPIC_POOLS: Record<string, string[]> = {
  형사법: ["책임론", "형사정책", "법철학", "형사절차", "피해자학"],
  민법: ["민법 이론", "계약법", "채권법", "가족법", "손해배상"],
  헌법: ["기본권", "국가기관", "헌법재판", "비교헌법", "헌법이론"],
  상법: ["회사법", "자본시장법", "기업지배구조", "상행위", "증권법"],
  행정법: ["행정절차", "규제", "행정구제", "공법일반", "행정입법"],
};

const DEFAULT_TOPIC_POOL = [
  "제도 연구",
  "법교육",
  "비교법",
  "법철학",
  "법정책",
];

function buildAliasPhrase(topic: string, scholar: string, seed: number) {
  const frames = [
    `${topic}을 오래 바라본 ${scholar}`,
    `제도 속 ${topic}을 읽어온 ${scholar}`,
    `${topic} 너머의 현실을 바라본 학자`,
    `${topic}의 무게를 붙잡아온 연구자`,
    `${topic}의 흐름을 따라온 ${scholar}`,
  ];

  return frames[seed % frames.length];
}

function hashSeed(seed: string) {
  let hash = 0;

  for (const char of seed) {
    hash = (hash + char.charCodeAt(0) * 17) % 997;
  }

  return hash;
}

function scholarLabel(fieldOfStudy: string) {
  const trimmed = fieldOfStudy.trim();

  if (!trimmed) {
    return "학자";
  }

  if (trimmed.endsWith("법")) {
    return `${trimmed}학자`;
  }

  return `${trimmed} 연구자`;
}

function extractTopicCandidates(input: ScholarDnaMockInput): string[] {
  const candidates: string[] = [input.fieldOfStudy.trim()];

  if (input.recentInterest?.trim()) {
    candidates.push(input.recentInterest.trim());
  }

  for (const title of input.paperTitles) {
    const cleaned = title
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .map((token) => token.trim())
      .filter((token) => token.length >= 2);

    candidates.push(...cleaned.slice(0, 3));
  }

  const unique = [...new Set(candidates.map((item) => item.trim()).filter(Boolean))];
  const pool =
    FIELD_TOPIC_POOLS[input.fieldOfStudy.trim()] ??
    FIELD_TOPIC_POOLS[
      Object.keys(FIELD_TOPIC_POOLS).find((key) =>
        input.fieldOfStudy.includes(key),
      ) ?? ""
    ] ??
    DEFAULT_TOPIC_POOL;

  const seed = hashSeed(
    [input.name, input.fieldOfStudy, ...input.paperTitles].join("|"),
  );

  for (let index = 0; unique.length < 5; index += 1) {
    const topic = pool[(seed + index * 7) % pool.length];
    if (!unique.includes(topic)) {
      unique.push(topic);
    }
  }

  return unique.slice(0, 5);
}

function extractKeywords(input: ScholarDnaMockInput): string[] {
  return extractTopicCandidates(input).slice(0, 5);
}

function buildResearchInterestMap(
  topics: string[],
  seed: string,
): ScholarDnaTraitRow[] {
  const hash = hashSeed(seed);
  const selected = topics.slice(0, 5);

  const raw = selected.map((label, index) => {
    const value = 10 + ((hash + index * 37) % 26);
    return { label, percentage: value };
  });

  const total = raw.reduce((sum, topic) => sum + topic.percentage, 0);

  return raw.map((topic) => ({
    label: topic.label,
    percentage: Math.round((topic.percentage / total) * 100),
  }));
}

function buildAlias(input: ScholarDnaMockInput, topics: string[]): string {
  const seed = hashSeed(
    [input.name, input.affiliation, ...input.paperTitles].join("|"),
  );
  const primaryTopic = topics[1] ?? topics[0] ?? input.fieldOfStudy;
  const scholar = scholarLabel(input.fieldOfStudy);

  return buildAliasPhrase(primaryTopic, scholar, seed);
}

function buildLifeStory(input: ScholarDnaMockInput): string {
  const papers = input.paperTitles.filter(Boolean);
  const firstPaper = papers[0] ?? "대표 연구";
  const secondPaper = papers[1];
  const thirdPaper = papers[2];
  const interest = input.recentInterest?.trim();

  const paragraphs = [
    `${input.name} 교수의 연구 여정은 ${input.fieldOfStudy}를 중심으로 한 오랜 학문적 성찰의 기록입니다. ${input.affiliation}에서 쌓아 온 경험은 단순한 논문 목록이 아니라, 하나의 문제의식이 어떻게 깊어지고 넓어지는지를 보여 줍니다.`,
    `초기의 「${firstPaper}」는 연구의 출발점을 말해 줍니다. 이 글에서 드러나는 관심은 이후의 연구가 어떤 기준으로 이어질지를 암시합니다.${secondPaper ? ` 이어지는 「${secondPaper}」는 같은 문제를 다른 각도에서 조명하며, 연구의 내면적 일관성을 드러냅니다.` : ""}${thirdPaper ? ` 「${thirdPaper}」는 그 흐름 위에 또 하나의 층위를 더합니다.` : ""}`,
    interest
      ? `최근의 관심인 「${interest}」는 지금 이 학문 인생이 어디를 향하고 있는지를 가장 선명하게 보여 줍니다. 과거의 논문들이 남긴 질문이, 여전히 살아 있는 문제의식으로 이어지고 있음을 알 수 있습니다.`
      : `대표 논문들이 남긴 질문은 여전히 살아 있습니다. 표면의 주제를 넘어, 제도와 사람, 규범과 실천 사이의 긴장을 어떻게 읽어 왔는지가 이 학문 인생의 중심에 있습니다.`,
    `이 기록은 성적표가 아니라 헌정문에 가깝습니다. ${input.fieldOfStudy}를 연구하며 쌓아 온 시간은, 한 학자가 세상을 어떻게 이해하고 설명해 왔는지를 말해 주는 작은 전기입니다.`,
  ];

  return paragraphs.join("\n\n");
}

function buildOneLiner(input: ScholarDnaMockInput): string {
  const interest = input.recentInterest?.trim();

  if (interest) {
    return `${input.name} 교수의 연구는 ${input.fieldOfStudy}의 오래된 질문을, 지금의 「${interest}」로 이어 읽는 학문의 시간입니다.`;
  }

  return `${input.name} 교수의 연구는 ${input.fieldOfStudy}에서 출발해, 논문 하나하나에 학문의 온도를 남겨 온 길입니다.`;
}

/**
 * Development fallback when SCHOLAR_DNA_MOCK_FALLBACK=true.
 * Production uses lib/scholar-dna/generate.ts (GPT).
 */
export function generateMockScholarDnaResult(
  input: ScholarDnaMockInput,
): ScholarDnaMockResult {
  const topics = extractTopicCandidates(input);
  const seed = [input.name, input.fieldOfStudy, ...input.paperTitles].join("|");

  return {
    scholarAlias: buildAlias(input, topics),
    academicLifeStory: buildLifeStory(input),
    keywords: extractKeywords(input),
    scholarDna: buildResearchInterestMap(topics, seed),
    aiOneLiner: buildOneLiner(input),
  };
}
