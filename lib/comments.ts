import type { CommentInsert, CommentRow } from "@/lib/content/db-types";
import { createSupabaseServerClient } from "@/lib/supabase/server-ssr";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type Comment = {
  id: string;
  essaySlug: string;
  authorName: string | null;
  authorAffiliation: string | null;
  content: string;
  status: CommentRow["status"];
  createdAt: string;
  updatedAt: string;
};

const MAX_CONTENT_LENGTH = 5000;
const MAX_NAME_LENGTH = 80;
const MAX_AFFILIATION_LENGTH = 120;

function mapCommentRow(row: CommentRow): Comment {
  return {
    id: row.id,
    essaySlug: row.essay_slug,
    authorName: row.author_name,
    authorAffiliation: row.author_affiliation,
    content: row.content,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function formatCommentDate(isoDate: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(isoDate));
}

export function getCommentAuthorDisplayName(authorName: string | null) {
  const trimmed = authorName?.trim();
  return trimmed ? trimmed : "익명";
}

export function isCommentsAvailable() {
  return isSupabaseConfigured();
}

export async function listApprovedCommentsByEssaySlug(
  essaySlug: string,
): Promise<Comment[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("essay_slug", essaySlug)
    .eq("status", "approved")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to load comments for "${essaySlug}": ${error.message}`);
  }

  return (data ?? []).map(mapCommentRow);
}

export type CreateCommentInput = {
  essaySlug: string;
  authorName?: string;
  authorAffiliation?: string;
  content: string;
};

export type CreateCommentResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: { content?: string } };

function normalizeOptionalText(value: string | undefined, maxLength: number) {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) {
    return null;
  }

  return trimmed.slice(0, maxLength);
}

export async function createComment(
  input: CreateCommentInput,
): Promise<CreateCommentResult> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      ok: false,
      error: "댓글 기능을 사용할 수 없습니다. Supabase 설정을 확인해 주세요.",
    };
  }

  const essaySlug = input.essaySlug.trim();
  const content = input.content.trim();

  if (!essaySlug) {
    return { ok: false, error: "글 정보를 확인할 수 없습니다." };
  }

  if (!content) {
    return {
      ok: false,
      error: "댓글 내용을 입력해 주세요.",
      fieldErrors: { content: "댓글 내용을 입력해 주세요." },
    };
  }

  if (content.length > MAX_CONTENT_LENGTH) {
    return {
      ok: false,
      error: `댓글은 ${MAX_CONTENT_LENGTH}자 이내로 입력해 주세요.`,
      fieldErrors: { content: `댓글은 ${MAX_CONTENT_LENGTH}자 이내로 입력해 주세요.` },
    };
  }

  const row: CommentInsert = {
    essay_slug: essaySlug,
    author_name: normalizeOptionalText(input.authorName, MAX_NAME_LENGTH),
    author_affiliation: normalizeOptionalText(
      input.authorAffiliation,
      MAX_AFFILIATION_LENGTH,
    ),
    content,
    status: "approved",
  };

  const { error } = await supabase.from("comments").insert(row);

  if (error) {
    return {
      ok: false,
      error: "댓글을 등록하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }

  return { ok: true };
}
