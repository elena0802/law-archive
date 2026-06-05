import type { CommentInsert, CommentRow } from "@/lib/content/db-types";
import { hashCommentPassword, verifyCommentPassword } from "@/lib/comment-password";
import {
  MAX_COMMENT_DEPTH,
  type Comment,
  type CommentThread,
} from "@/lib/comment-types";
import { createSupabaseServerClient } from "@/lib/supabase/server-ssr";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { requireSupabaseServiceRoleClient } from "@/lib/supabase/server";

export {
  MAX_COMMENT_DEPTH,
  type Comment,
  type CommentThread,
} from "@/lib/comment-types";
export {
  formatCommentDate,
  getCommentAuthorDisplayName,
  isArchiveAuthorComment,
} from "@/lib/comment-display";

const PUBLIC_COMMENT_COLUMNS =
  "id, essay_slug, parent_id, author_name, author_affiliation, content, status, created_at, updated_at, password_hash" as const;

type CommentListRow = Pick<
  CommentRow,
  | "id"
  | "essay_slug"
  | "parent_id"
  | "author_name"
  | "author_affiliation"
  | "content"
  | "status"
  | "created_at"
  | "updated_at"
> & {
  password_hash: string | null;
};

const MAX_CONTENT_LENGTH = 5000;
const MAX_NAME_LENGTH = 80;
const MAX_AFFILIATION_LENGTH = 120;
const MIN_PASSWORD_LENGTH = 4;

function mapCommentRow(row: CommentListRow): Comment {
  return {
    id: row.id,
    essaySlug: row.essay_slug,
    parentId: row.parent_id,
    authorName: row.author_name,
    authorAffiliation: row.author_affiliation,
    content: row.content,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    authorDeleteSupported: Boolean(row.password_hash),
  };
}

function buildCommentThreads(comments: Comment[]): CommentThread[] {
  const nodes = new Map<string, CommentThread>(
    comments.map((comment) => [comment.id, { ...comment, replies: [] }]),
  );
  const roots: CommentThread[] = [];

  for (const comment of comments) {
    const node = nodes.get(comment.id);
    if (!node) {
      continue;
    }

    if (comment.parentId) {
      const parent = nodes.get(comment.parentId);
      if (parent) {
        parent.replies.push(node);
        continue;
      }
    }

    roots.push(node);
  }

  const sortByCreatedAt = (left: CommentThread, right: CommentThread) =>
    left.createdAt.localeCompare(right.createdAt);

  const sortReplies = (thread: CommentThread[]) => {
    thread.sort(sortByCreatedAt);
    for (const node of thread) {
      sortReplies(node.replies);
    }
  };

  sortReplies(roots);
  return roots;
}

async function listApprovedCommentRowsByEssaySlug(essaySlug: string) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("comments")
    .select(PUBLIC_COMMENT_COLUMNS)
    .eq("essay_slug", essaySlug)
    .eq("status", "approved")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to load comments for "${essaySlug}": ${error.message}`);
  }

  return (data ?? []).map(mapCommentRow);
}

export function isCommentsAvailable() {
  return isSupabaseConfigured();
}

export { hashCommentPassword, verifyCommentPassword } from "@/lib/comment-password";

export async function listApprovedCommentsByEssaySlug(
  essaySlug: string,
): Promise<Comment[]> {
  const comments = await listApprovedCommentRowsByEssaySlug(essaySlug);
  return comments.filter((comment) => comment.parentId === null);
}

export async function listApprovedCommentThreadsByEssaySlug(
  essaySlug: string,
): Promise<CommentThread[]> {
  const comments = await listApprovedCommentRowsByEssaySlug(essaySlug);
  return buildCommentThreads(comments);
}

export type CreateCommentInput = {
  essaySlug: string;
  parentId?: string | null;
  authorName?: string;
  authorAffiliation?: string;
  content: string;
  password: string;
};

export type CreateCommentResult =
  | { ok: true }
  | {
      ok: false;
      error: string;
      fieldErrors?: { content?: string; password?: string; parentId?: string };
    };

export type DeleteCommentWithPasswordResult =
  | { ok: true }
  | { ok: false; error: string; code?: "wrong_password" | "unsupported" };

function normalizeOptionalText(value: string | undefined, maxLength: number) {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) {
    return null;
  }

  return trimmed.slice(0, maxLength);
}

async function fetchApprovedParentId(
  supabase: NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>,
  commentId: string,
): Promise<string | null | undefined> {
  const { data, error } = await supabase
    .from("comments")
    .select("parent_id")
    .eq("id", commentId)
    .eq("status", "approved")
    .maybeSingle();

  if (error || !data) {
    return undefined;
  }

  return data.parent_id;
}

async function getApprovedCommentDepth(
  supabase: NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>,
  commentId: string,
): Promise<number | null> {
  let currentId: string | null = commentId;

  for (let depth = 1; depth <= MAX_COMMENT_DEPTH; depth += 1) {
    const parentId = await fetchApprovedParentId(supabase, currentId);

    if (parentId === undefined) {
      return null;
    }

    if (!parentId) {
      return depth;
    }

    currentId = parentId;
  }

  return MAX_COMMENT_DEPTH;
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
  const password = input.password;
  const parentId = input.parentId?.trim() || null;

  if (!essaySlug) {
    return { ok: false, error: "글 정보를 확인할 수 없습니다." };
  }

  if (!password) {
    return {
      ok: false,
      error: "비밀번호를 입력해 주세요.",
      fieldErrors: { password: "비밀번호를 입력해 주세요." },
    };
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      ok: false,
      error: `비밀번호는 ${MIN_PASSWORD_LENGTH}자 이상 입력해 주세요.`,
      fieldErrors: {
        password: `비밀번호는 ${MIN_PASSWORD_LENGTH}자 이상 입력해 주세요.`,
      },
    };
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

  if (parentId) {
    const { data: parent, error: parentError } = await supabase
      .from("comments")
      .select("id, essay_slug, status")
      .eq("id", parentId)
      .maybeSingle();

    if (parentError || !parent) {
      return {
        ok: false,
        error: "답글 대상 댓글을 찾을 수 없습니다.",
        fieldErrors: { parentId: "답글 대상 댓글을 찾을 수 없습니다." },
      };
    }

    if (parent.essay_slug !== essaySlug) {
      return {
        ok: false,
        error: "같은 글에 속한 댓글에만 답글을 달 수 있습니다.",
        fieldErrors: { parentId: "같은 글에 속한 댓글에만 답글을 달 수 있습니다." },
      };
    }

    if (parent.status !== "approved") {
      return {
        ok: false,
        error: "승인된 댓글에만 답글을 달 수 있습니다.",
        fieldErrors: { parentId: "승인된 댓글에만 답글을 달 수 있습니다." },
      };
    }

    const parentDepth = await getApprovedCommentDepth(supabase, parentId);
    if (parentDepth === null) {
      return {
        ok: false,
        error: "답글 대상 댓글을 확인할 수 없습니다.",
        fieldErrors: { parentId: "답글 대상 댓글을 확인할 수 없습니다." },
      };
    }

    if (parentDepth >= MAX_COMMENT_DEPTH) {
      return {
        ok: false,
        error: `답글은 최대 ${MAX_COMMENT_DEPTH}단계까지만 작성할 수 있습니다.`,
        fieldErrors: {
          parentId: `답글은 최대 ${MAX_COMMENT_DEPTH}단계까지만 작성할 수 있습니다.`,
        },
      };
    }
  }

  const row: CommentInsert = {
    essay_slug: essaySlug,
    parent_id: parentId,
    author_name: normalizeOptionalText(input.authorName, MAX_NAME_LENGTH),
    author_affiliation: normalizeOptionalText(
      input.authorAffiliation,
      MAX_AFFILIATION_LENGTH,
    ),
    content,
    status: "approved",
    password_hash: hashCommentPassword(password),
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

export async function deleteCommentWithPassword(
  commentId: string,
  essaySlug: string,
  password: string,
): Promise<DeleteCommentWithPasswordResult> {
  const normalizedSlug = essaySlug.trim();
  const trimmedPassword = password;

  if (!commentId || !normalizedSlug) {
    return { ok: false, error: "댓글 정보를 확인할 수 없습니다." };
  }

  if (!trimmedPassword) {
    return { ok: false, error: "비밀번호를 입력해 주세요." };
  }

  const supabase = requireSupabaseServiceRoleClient();

  const { data: comment, error: fetchError } = await supabase
    .from("comments")
    .select("id, essay_slug, password_hash, status")
    .eq("id", commentId)
    .maybeSingle();

  if (fetchError) {
    return {
      ok: false,
      error: "댓글을 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }

  if (!comment || comment.essay_slug !== normalizedSlug) {
    return { ok: false, error: "댓글을 찾을 수 없습니다." };
  }

  if (!comment.password_hash) {
    return {
      ok: false,
      error: "이 댓글은 작성자 삭제를 지원하지 않습니다.",
      code: "unsupported",
    };
  }

  if (!verifyCommentPassword(trimmedPassword, comment.password_hash)) {
    return {
      ok: false,
      error: "비밀번호가 일치하지 않습니다.",
      code: "wrong_password",
    };
  }

  const { error: deleteError } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId);

  if (deleteError) {
    return {
      ok: false,
      error: "댓글을 삭제하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }

  return { ok: true };
}
