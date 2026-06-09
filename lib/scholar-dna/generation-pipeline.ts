
import {
  getOpenAIApiKey,
  getOpenAIModel,
  isOpenAIConfigured,
} from "@/lib/openai/config";
import type {
  ScholarDnaGenerateInput,
  ScholarDnaGeneratedResult,
  ScholarDnaGptResultJson,
  ScholarDnaInterestMapItem,
  ScholarDnaResearchAnalysis,
} from "@/lib/scholar-dna/types";
import {
  buildAnalysisSystemPrompt,
  buildPolishSystemPrompt,
  buildStorySystemPrompt,
  formatAnalysisContext,
} from "@/lib/scholar-dna/prompts";

const OPENAI_CHAT_URL = "https://api.openai.com/v1/chat/completions";
const REQUEST_TIMEOUT_MS = 90_000;

const PERSONALITY_TRAIT_PATTERNS = [
  /체계적\s*사고/,
  /실천적\s*문제의식/,
  /개념\s*정밀성/,
  /제도\s*비평/,
  /비교법적\s*시야/,
  /교육·전승/,
  /분석적/,
  /비판적\s*사고/,
  /창의적/,
  /통합적/,
];

export class ScholarDnaGenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ScholarDnaGenerationError";
  }
}

type ChatMessage = {
  role: "system" | "user";
  content: string;
};

function formatInputBlock(input: ScholarDnaGenerateInput) {
  const papers = input.paperTitles
    .map((title, index) => `${index + 1}. ${title}`)
    .join("\n");

  return [
    `이름: ${input.name}`,
    `소속/직함: ${input.affiliation}`,
    `전공 분야: ${input.fieldOfStudy}`,
    `대표 논문 제목:\n${papers}`,
    input.recentInterest
      ? `최근 관심 주제: ${input.recentInterest}`
      : "최근 관심 주제: (미입력)",
  ].join("\n");
}

function parseJsonObject(content: string): Record<string, unknown> {
  const trimmed = content.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonText = fenced?.[1]?.trim() ?? trimmed;

  try {
    const parsed = JSON.parse(jsonText) as unknown;

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new ScholarDnaGenerationError("GPT 응답 형식이 올바르지 않습니다.");
    }

    return parsed as Record<string, unknown>;
  } catch (error) {
    if (error instanceof ScholarDnaGenerationError) {
      throw error;
    }

    throw new ScholarDnaGenerationError("GPT 응답을 해석하지 못했습니다.");
  }
}

function readString(value: unknown, fieldName: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new ScholarDnaGenerationError(
      `GPT 응답에 ${fieldName}이(가) 없습니다.`,
    );
  }

  return value.trim();
}

function readStringArray(value: unknown, fieldName: string, length = 5) {
  if (!Array.isArray(value)) {
    throw new ScholarDnaGenerationError(
      `GPT 응답에 ${fieldName} 배열이 없습니다.`,
    );
  }

  const items = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, length);

  if (items.length < Math.min(3, length)) {
    throw new ScholarDnaGenerationError(
      `GPT 응답의 ${fieldName} 항목이 부족합니다.`,
    );
  }

  while (items.length < length) {
    items.push(items[items.length - 1] ?? fieldName);
  }

  return items.slice(0, length);
}

function isPersonalityTraitLabel(label: string) {
  return PERSONALITY_TRAIT_PATTERNS.some((pattern) => pattern.test(label));
}

function normalizeInterestMap(
  value: unknown,
): ScholarDnaInterestMapItem[] {
  if (!Array.isArray(value)) {
    throw new ScholarDnaGenerationError(
      "GPT 응답에 interestMap 배열이 없습니다.",
    );
  }

  const items = value
    .map((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        return null;
      }

      const record = item as Record<string, unknown>;
      const label =
        typeof record.label === "string" ? record.label.trim() : "";
      const rawValue =
        typeof record.value === "number"
          ? record.value
          : typeof record.percentage === "number"
            ? record.percentage
            : null;

      if (!label || rawValue === null || rawValue <= 0) {
        return null;
      }

      if (isPersonalityTraitLabel(label)) {
        return null;
      }

      return { label, value: rawValue };
    })
    .filter((item): item is ScholarDnaInterestMapItem => item !== null)
    .slice(0, 5);

  if (items.length < 3) {
    throw new ScholarDnaGenerationError(
      "GPT 응답의 interestMap 항목이 부족합니다.",
    );
  }

  const total = items.reduce((sum, item) => sum + item.value, 0);

  if (total <= 0) {
    throw new ScholarDnaGenerationError(
      "GPT 응답의 interestMap 비율이 올바르지 않습니다.",
    );
  }

  const normalized = items.map((item) => ({
    label: item.label,
    value: Math.round((item.value / total) * 100),
  }));

  const diff = 100 - normalized.reduce((sum, item) => sum + item.value, 0);

  if (diff !== 0) {
    normalized[0] = {
      ...normalized[0],
      value: normalized[0].value + diff,
    };
  }

  return normalized;
}

function toScholarDnaTraits(interestMap: ScholarDnaInterestMapItem[]) {
  return interestMap.map((item) => ({
    label: item.label,
    percentage: item.value,
  }));
}

async function callOpenAIJson(
  messages: ChatMessage[],
  label: string,
): Promise<Record<string, unknown>> {
  if (!isOpenAIConfigured()) {
    throw new ScholarDnaGenerationError(
      "AI 분석 기능을 사용할 수 없습니다. OPENAI_API_KEY 설정을 확인해 주세요.",
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(OPENAI_CHAT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getOpenAIApiKey()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: getOpenAIModel(),
        messages,
        response_format: { type: "json_object" },
        temperature: 0.6,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      console.error(`[scholar-dna] OpenAI ${label} failed:`, response.status, errorBody);
      throw new ScholarDnaGenerationError(
        "학문 인생 분석을 생성하지 못했습니다. 잠시 후 다시 시도해 주세요.",
      );
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string | null } }>;
    };

    const content = payload.choices?.[0]?.message?.content;

    if (!content) {
      throw new ScholarDnaGenerationError(
        "학문 인생 분석을 생성하지 못했습니다. 잠시 후 다시 시도해 주세요.",
      );
    }

    return parseJsonObject(content);
  } catch (error) {
    if (error instanceof ScholarDnaGenerationError) {
      throw error;
    }

    if (error instanceof Error && error.name === "AbortError") {
      throw new ScholarDnaGenerationError(
        "분석 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.",
      );
    }

    console.error(`[scholar-dna] OpenAI ${label} error:`, error);
    throw new ScholarDnaGenerationError(
      "학문 인생 분석을 생성하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    );
  } finally {
    clearTimeout(timeout);
  }
}

async function analyzeResearchStructure(
  input: ScholarDnaGenerateInput,
): Promise<ScholarDnaResearchAnalysis> {
  const parsed = await callOpenAIJson(
    [
      {
        role: "system",
        content: buildAnalysisSystemPrompt(),
      },
      {
        role: "user",
        content: formatInputBlock(input),
      },
    ],
    "analysis",
  );

  return {
    centralQuestion: readString(parsed.centralQuestion, "centralQuestion"),
    startingPoint: readString(parsed.startingPoint, "startingPoint"),
    development: readString(parsed.development, "development"),
    tension: readString(parsed.tension, "tension"),
    keywords: readStringArray(parsed.keywords, "keywords"),
    scholarAlias: readString(parsed.scholarAlias, "scholarAlias"),
    interestMap: normalizeInterestMap(parsed.interestMap),
    legacyMeaning: readString(parsed.legacyMeaning, "legacyMeaning"),
  };
}

async function writeAcademicLifeStory(
  input: ScholarDnaGenerateInput,
  analysis: ScholarDnaResearchAnalysis,
): Promise<string> {
  const parsed = await callOpenAIJson(
    [
      {
        role: "system",
        content: buildStorySystemPrompt(),
      },
      {
        role: "user",
        content: `${formatInputBlock(input)}

${formatAnalysisContext(analysis)}`,
      },
    ],
    "story",
  );

  return readString(parsed.academicLifeStory, "academicLifeStory");
}

async function polishResult(
  input: ScholarDnaGenerateInput,
  analysis: ScholarDnaResearchAnalysis,
  draftStory: string,
): Promise<ScholarDnaGptResultJson> {
  const parsed = await callOpenAIJson(
    [
      {
        role: "system",
        content: buildPolishSystemPrompt(input.name),
      },
      {
        role: "user",
        content: `${formatInputBlock(input)}

${formatAnalysisContext(analysis)}

[초안 Academic Life Story]
${draftStory}

[초안 interestMap]
${JSON.stringify(analysis.interestMap)}

[초안 scholarAlias]
${analysis.scholarAlias}`,
      },
    ],
    "polish",
  );

  return {
    scholarAlias: readString(parsed.scholarAlias, "scholarAlias"),
    academicLifeStory: readString(parsed.academicLifeStory, "academicLifeStory"),
    keywords: readStringArray(parsed.keywords, "keywords"),
    interestMap: normalizeInterestMap(parsed.interestMap),
    aiOneLiner: readString(parsed.aiOneLiner, "aiOneLiner"),
  };
}

export async function generateScholarDnaResult(
  input: ScholarDnaGenerateInput,
): Promise<ScholarDnaGeneratedResult> {
  const analysis = await analyzeResearchStructure(input);
  const draftStory = await writeAcademicLifeStory(input, analysis);
  const polished = await polishResult(input, analysis, draftStory);

  return {
    scholarAlias: polished.scholarAlias,
    academicLifeStory: polished.academicLifeStory,
    keywords: polished.keywords,
    scholarDna: toScholarDnaTraits(polished.interestMap),
    aiOneLiner: polished.aiOneLiner,
  };
}
