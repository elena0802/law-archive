import type { CommentRow, CommentStatus } from "@/lib/content/db-types";
import { requireEditorSupabase } from "@/lib/admin/require-editor";
import { isSupabaseServiceRoleConfigured } from "@/lib/supabase/config";
import { requireSupabaseServiceRoleClient } from "@/lib/supabase/server";

export type CommentListFilter = "all" | CommentStatus;

export type AdminComment = {
  id: string;
  essaySlug: string;
  authorName: string | null;
  authorAffiliation: string | null;
  content: string;
  status: CommentStatus;
  createdAt: string;
  updatedAt: string;
};

function mapCommentRow(row: CommentRow): AdminComment {
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

export function commentStatusLabel(status: CommentStatus) {
  switch (status) {
    case "approved":
      return "승인됨";
    case "pending":
      return "대기";
    case "rejected":
      return "거절됨";
    default:
      return status;
  }
}

export function isAdminCommentsAvailable() {
  return isSupabaseServiceRoleConfigured();
}

export async function listAdminComments(params: {
  status?: CommentStatus;
} = {}): Promise<AdminComment[]> {
  await requireEditorSupabase();
  const supabase = requireSupabaseServiceRoleClient();

  let query = supabase
    .from("comments")
    .select("*")
    .order("created_at", { ascending: false });

  if (params.status) {
    query = query.eq("status", params.status);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to load comments: ${error.message}`);
  }

  return (data ?? []).map(mapCommentRow);
}

export async function getAdminCommentById(
  commentId: string,
): Promise<AdminComment | null> {
  await requireEditorSupabase();
  const supabase = requireSupabaseServiceRoleClient();

  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("id", commentId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load comment: ${error.message}`);
  }

  return data ? mapCommentRow(data) : null;
}

export async function setAdminCommentStatus(
  commentId: string,
  status: CommentStatus,
): Promise<string | null> {
  await requireEditorSupabase();
  const supabase = requireSupabaseServiceRoleClient();

  const { data, error } = await supabase
    .from("comments")
    .update({ status })
    .eq("id", commentId)
    .select("essay_slug")
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to update comment: ${error.message}`);
  }

  return data?.essay_slug ?? null;
}

export async function deleteAdminComment(
  commentId: string,
): Promise<string | null> {
  await requireEditorSupabase();
  const supabase = requireSupabaseServiceRoleClient();

  const { data: existing, error: fetchError } = await supabase
    .from("comments")
    .select("essay_slug")
    .eq("id", commentId)
    .maybeSingle();

  if (fetchError) {
    throw new Error(`Failed to load comment: ${fetchError.message}`);
  }

  if (!existing) {
    return null;
  }

  const { error } = await supabase.from("comments").delete().eq("id", commentId);

  if (error) {
    throw new Error(`Failed to delete comment: ${error.message}`);
  }

  return existing.essay_slug;
}
