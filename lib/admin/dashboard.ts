import { isAdminCommentsAvailable } from "@/lib/admin/comments";
import { requireEditorSupabase } from "@/lib/admin/require-editor";
import { requireSupabaseServiceRoleClient } from "@/lib/supabase/server";
import type { EssayStatus } from "@/lib/content/db-types";

type DashboardCounts = {
  total: number;
  published: number;
  draft: number;
  archived: number;
  deleted: number;
};

export type DashboardRecentEssay = {
  id: string;
  title: string;
  status: EssayStatus;
  updated_at: string;
};

async function countEssaysByStatus(status?: EssayStatus) {
  const { supabase } = await requireEditorSupabase();
  let query = supabase
    .from("essays")
    .select("id", { count: "exact", head: true });

  if (status) {
    query = query.eq("status", status);
  }

  const { count, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
}

export async function getAdminDashboardCounts(): Promise<DashboardCounts> {
  const [total, published, draft, archived, deleted] = await Promise.all([
    countEssaysByStatus(),
    countEssaysByStatus("published"),
    countEssaysByStatus("draft"),
    countEssaysByStatus("archived"),
    countEssaysByStatus("deleted"),
  ]);

  return {
    total,
    published,
    draft,
    archived,
    deleted,
  };
}

export async function listRecentAdminEssays(
  limit = 5,
): Promise<DashboardRecentEssay[]> {
  const { supabase } = await requireEditorSupabase();
  const { data, error } = await supabase
    .from("essays")
    .select("id,title,status,updated_at")
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export type DashboardAttention = {
  pendingComments: number | null;
};

export async function getAdminDashboardAttention(): Promise<DashboardAttention> {
  let pendingComments: number | null = null;

  if (isAdminCommentsAvailable()) {
    try {
      await requireEditorSupabase();
      const supabase = requireSupabaseServiceRoleClient();
      const { count, error } = await supabase
        .from("comments")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending");

      if (error) {
        console.error("Failed to count pending comments:", error);
      } else {
        pendingComments = count ?? 0;
      }
    } catch (error) {
      console.error("Failed to load pending comment count:", error);
    }
  }

  return { pendingComments };
}
