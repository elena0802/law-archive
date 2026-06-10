type PostgrestErrorShape = {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
};

const COVER_COLUMN_MARKERS = ["cover_image_url", "cover_image_alt"] as const;

function mentionsMissingCoverColumn(message: string) {
  const lower = message.toLowerCase();
  return COVER_COLUMN_MARKERS.some((column) => lower.includes(column));
}

export function isMissingEssayCoverColumnError(error: PostgrestErrorShape) {
  const message = error.message?.trim() ?? "";
  if (!message) {
    return false;
  }

  if (mentionsMissingCoverColumn(message)) {
    return true;
  }

  if (error.code === "PGRST204" && message.toLowerCase().includes("column")) {
    return true;
  }

  return (
    error.code === "42703" &&
    message.toLowerCase().includes("column") &&
    mentionsMissingCoverColumn(message)
  );
}

export function formatEssaySaveErrorMessage(error: PostgrestErrorShape) {
  if (isMissingEssayCoverColumnError(error)) {
    return (
      "대표 이미지 컬럼이 데이터베이스에 없습니다. " +
      "supabase/migrations/20260616100000_pr56_essay_cover_image.sql 마이그레이션을 적용한 뒤 다시 시도해 주세요."
    );
  }

  return "변경 내용을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.";
}

export function logEssaySaveError(
  action: string,
  context: Record<string, unknown>,
  error: PostgrestErrorShape | unknown,
) {
  const postgrest =
    error && typeof error === "object" && "message" in error
      ? (error as PostgrestErrorShape)
      : null;

  console.error(`[${action}] failed`, {
    ...context,
    errorCode: postgrest?.code,
    errorMessage:
      postgrest?.message ??
      (error instanceof Error ? error.message : String(error)),
    errorDetails: postgrest?.details,
    errorHint: postgrest?.hint,
    missingCoverColumns: postgrest
      ? isMissingEssayCoverColumnError(postgrest)
      : false,
  });
}
