import type {
  ScholarDnaAnalysisInsert,
  ScholarDnaAnalysisRow,
  ScholarDnaTraitRow,
} from "@/lib/content/db-types";
import {
  generateScholarDnaResult,
  ScholarDnaGenerationError,
} from "@/lib/scholar-dna/generate";
import {
  generateMockScholarDnaResult,
  type ScholarDnaMockInput,
} from "@/lib/scholar-dna-mock";
import { shouldUseScholarDnaMockFallback } from "@/lib/openai/config";
import { createSupabaseServerClient } from "@/lib/supabase/server-ssr";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type ScholarDnaTrait = ScholarDnaTraitRow;

export type ScholarDnaAnalysis = {
  id: string;
  name: string;
  affiliation: string;
  fieldOfStudy: string;
  paperTitle1: string;
  paperTitle2: string | null;
  paperTitle3: string | null;
  recentInterest: string | null;
  scholarAlias: string;
  academicLifeStory: string;
  keywords: string[];
  scholarDna: ScholarDnaTrait[];
  aiOneLiner: string;
  createdAt: string;
};

const PUBLIC_COLUMNS =
  "id, name, affiliation, field_of_study, paper_title_1, paper_title_2, paper_title_3, recent_interest, scholar_alias, academic_life_story, keywords, scholar_dna, ai_one_liner, status, created_at" as const;

const MAX_NAME_LENGTH = 80;
const MAX_AFFILIATION_LENGTH = 120;
const MAX_FIELD_LENGTH = 120;
const MAX_PAPER_TITLE_LENGTH = 300;
const MAX_INTEREST_LENGTH = 300;

function normalizeOptionalText(value: string | undefined, maxLength: number) {
  const trimmed = value?.trim() ?? "";

  if (!trimmed) {
    return null;
  }

  return trimmed.slice(0, maxLength);
}

function mapScholarDnaAnalysisFromRow(row: ScholarDnaAnalysisRow): ScholarDnaAnalysis {
  return {
    id: row.id,
    name: row.name,
    affiliation: row.affiliation,
    fieldOfStudy: row.field_of_study,
    paperTitle1: row.paper_title_1,
    paperTitle2: row.paper_title_2,
    paperTitle3: row.paper_title_3,
    recentInterest: row.recent_interest,
    scholarAlias: row.scholar_alias ?? "",
    academicLifeStory: row.academic_life_story ?? "",
    keywords: row.keywords ?? [],
    scholarDna: row.scholar_dna ?? [],
    aiOneLiner: row.ai_one_liner ?? "",
    createdAt: row.created_at,
  };
}

export function isScholarDnaAvailable() {
  return isSupabaseConfigured();
}

export async function getScholarDnaAnalysisById(
  id: string,
): Promise<ScholarDnaAnalysis | null> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("scholar_dna_analyses")
    .select(PUBLIC_COLUMNS)
    .eq("id", id)
    .eq("status", "completed")
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load scholar DNA analysis: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  return mapScholarDnaAnalysisFromRow(data as ScholarDnaAnalysisRow);
}

export type CreateScholarDnaAnalysisInput = {
  name: string;
  affiliation: string;
  fieldOfStudy: string;
  paperTitle1: string;
  paperTitle2?: string;
  paperTitle3?: string;
  recentInterest?: string;
};

export type CreateScholarDnaAnalysisResult =
  | { ok: true; id: string }
  | {
      ok: false;
      error: string;
      fieldErrors?: {
        name?: string;
        affiliation?: string;
        fieldOfStudy?: string;
        paperTitle1?: string;
        paperTitle2?: string;
        paperTitle3?: string;
        recentInterest?: string;
      };
    };

export async function createScholarDnaAnalysis(
  input: CreateScholarDnaAnalysisInput,
): Promise<CreateScholarDnaAnalysisResult> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      ok: false,
      error:
        "Scholar DNA 기능을 사용할 수 없습니다. Supabase 설정을 확인해 주세요.",
    };
  }

  const name = input.name.trim();
  const affiliation = input.affiliation.trim();
  const fieldOfStudy = input.fieldOfStudy.trim();
  const paperTitle1 = input.paperTitle1.trim();
  const paperTitle2 = normalizeOptionalText(input.paperTitle2, MAX_PAPER_TITLE_LENGTH);
  const paperTitle3 = normalizeOptionalText(input.paperTitle3, MAX_PAPER_TITLE_LENGTH);
  const recentInterest = normalizeOptionalText(
    input.recentInterest,
    MAX_INTEREST_LENGTH,
  );

  const fieldErrors: NonNullable<
    Extract<CreateScholarDnaAnalysisResult, { ok: false }>["fieldErrors"]
  > = {};

  if (!name) {
    fieldErrors.name = "이름을 입력해 주세요.";
  } else if (name.length > MAX_NAME_LENGTH) {
    fieldErrors.name = `이름은 ${MAX_NAME_LENGTH}자 이내로 입력해 주세요.`;
  }

  if (!affiliation) {
    fieldErrors.affiliation = "소속/직함을 입력해 주세요.";
  } else if (affiliation.length > MAX_AFFILIATION_LENGTH) {
    fieldErrors.affiliation = `소속/직함은 ${MAX_AFFILIATION_LENGTH}자 이내로 입력해 주세요.`;
  }

  if (!fieldOfStudy) {
    fieldErrors.fieldOfStudy = "전공 분야를 입력해 주세요.";
  } else if (fieldOfStudy.length > MAX_FIELD_LENGTH) {
    fieldErrors.fieldOfStudy = `전공 분야는 ${MAX_FIELD_LENGTH}자 이내로 입력해 주세요.`;
  }

  if (!paperTitle1) {
    fieldErrors.paperTitle1 = "대표 논문 제목 1을 입력해 주세요.";
  } else if (paperTitle1.length > MAX_PAPER_TITLE_LENGTH) {
    fieldErrors.paperTitle1 = `논문 제목은 ${MAX_PAPER_TITLE_LENGTH}자 이내로 입력해 주세요.`;
  }

  if (paperTitle2 && paperTitle2.length > MAX_PAPER_TITLE_LENGTH) {
    fieldErrors.paperTitle2 = `논문 제목은 ${MAX_PAPER_TITLE_LENGTH}자 이내로 입력해 주세요.`;
  }

  if (paperTitle3 && paperTitle3.length > MAX_PAPER_TITLE_LENGTH) {
    fieldErrors.paperTitle3 = `논문 제목은 ${MAX_PAPER_TITLE_LENGTH}자 이내로 입력해 주세요.`;
  }

  if (recentInterest && recentInterest.length > MAX_INTEREST_LENGTH) {
    fieldErrors.recentInterest = `최근 관심 주제는 ${MAX_INTEREST_LENGTH}자 이내로 입력해 주세요.`;
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      error: "입력 내용을 확인해 주세요.",
      fieldErrors,
    };
  }

  const generationInput: ScholarDnaMockInput = {
    name,
    affiliation,
    fieldOfStudy,
    paperTitles: [paperTitle1, paperTitle2 ?? "", paperTitle3 ?? ""].filter(
      Boolean,
    ),
    recentInterest,
  };

  let generated: {
    scholarAlias: string;
    academicLifeStory: string;
    keywords: string[];
    scholarDna: ScholarDnaTraitRow[];
    aiOneLiner: string;
  };

  try {
    generated = await generateScholarDnaResult(generationInput);
  } catch (error) {
    if (shouldUseScholarDnaMockFallback()) {
      console.warn(
        "[createScholarDnaAnalysis] GPT generation failed; using mock fallback:",
        error,
      );
      generated = generateMockScholarDnaResult(generationInput);
    } else {
      console.error("[createScholarDnaAnalysis] GPT generation failed:", error);

      return {
        ok: false,
        error:
          error instanceof ScholarDnaGenerationError
            ? error.message
            : "학문 인생 분석을 생성하지 못했습니다. 잠시 후 다시 시도해 주세요.",
      };
    }
  }

  const row: ScholarDnaAnalysisInsert = {
    name,
    affiliation,
    field_of_study: fieldOfStudy,
    paper_title_1: paperTitle1,
    paper_title_2: paperTitle2,
    paper_title_3: paperTitle3,
    recent_interest: recentInterest,
    scholar_alias: generated.scholarAlias,
    academic_life_story: generated.academicLifeStory,
    keywords: generated.keywords,
    scholar_dna: generated.scholarDna,
    ai_one_liner: generated.aiOneLiner,
    status: "completed",
  };

  const { data, error } = await supabase
    .from("scholar_dna_analyses")
    .insert(row)
    .select("id")
    .single();

  if (error || !data) {
    return {
      ok: false,
      error: "학문 인생 분석을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }

  return { ok: true, id: data.id };
}
