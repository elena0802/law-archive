import { requireEditorSupabase } from "@/lib/admin/require-editor";
import { isSupabaseServiceRoleConfigured } from "@/lib/supabase/config";
import { requireSupabaseServiceRoleClient } from "@/lib/supabase/server";
import { scholarProfile } from "@/lib/profile";
import {
  mapGuestbookEntryFromRow,
  type GuestbookEntry,
  type GuestbookListRow,
} from "@/lib/guestbook";

const ADMIN_GUESTBOOK_COLUMNS =
  "id, name, affiliation, content, status, reply_content, replied_at, replied_by, created_at, updated_at, password_hash" as const;

const MAX_REPLY_LENGTH = 2000;

export type AdminGuestbookEntry = GuestbookEntry;

export function isAdminGuestbookAvailable() {
  return isSupabaseServiceRoleConfigured();
}

export async function listAdminGuestbookEntries(): Promise<AdminGuestbookEntry[]> {
  await requireEditorSupabase();
  const supabase = requireSupabaseServiceRoleClient();

  const { data, error } = await supabase
    .from("guestbook_entries")
    .select(ADMIN_GUESTBOOK_COLUMNS)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load guestbook entries: ${error.message}`);
  }

  return (data ?? []).map((row) =>
    mapGuestbookEntryFromRow(row as GuestbookListRow),
  );
}

export type SaveGuestbookReplyResult =
  | { ok: true }
  | {
      ok: false;
      error: string;
      fieldErrors?: {
        reply_content?: string;
      };
    };

export async function saveGuestbookReply(
  entryId: string,
  replyContent: string,
): Promise<SaveGuestbookReplyResult> {
  await requireEditorSupabase();

  const trimmed = replyContent.trim();

  if (!entryId) {
    return { ok: false, error: "안부 정보를 확인할 수 없습니다." };
  }

  if (!trimmed) {
    return {
      ok: false,
      error: "답글을 입력해 주세요.",
      fieldErrors: { reply_content: "답글을 입력해 주세요." },
    };
  }

  if (trimmed.length > MAX_REPLY_LENGTH) {
    return {
      ok: false,
      error: `답글은 ${MAX_REPLY_LENGTH}자 이내로 입력해 주세요.`,
      fieldErrors: {
        reply_content: `답글은 ${MAX_REPLY_LENGTH}자 이내로 입력해 주세요.`,
      },
    };
  }

  const supabase = requireSupabaseServiceRoleClient();

  const { data: entry, error: fetchError } = await supabase
    .from("guestbook_entries")
    .select("id")
    .eq("id", entryId)
    .maybeSingle();

  if (fetchError) {
    return {
      ok: false,
      error: "안부를 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }

  if (!entry) {
    return { ok: false, error: "안부를 찾을 수 없습니다." };
  }

  const { error: updateError } = await supabase
    .from("guestbook_entries")
    .update({
      reply_content: trimmed,
      replied_at: new Date().toISOString(),
      replied_by: scholarProfile.name,
    })
    .eq("id", entryId);

  if (updateError) {
    return {
      ok: false,
      error: "답글을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }

  return { ok: true };
}
