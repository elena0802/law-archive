import type { GuestbookEntryInsert, GuestbookEntryRow } from "@/lib/content/db-types";
import { hashCommentPassword } from "@/lib/comment-password";
import { formatCommentDate } from "@/lib/comment-display";
import { createSupabaseServerClient } from "@/lib/supabase/server-ssr";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type GuestbookEntry = {
  id: string;
  name: string;
  affiliation: string | null;
  content: string;
  status: GuestbookEntryRow["status"];
  createdAt: string;
  updatedAt: string;
};

const PUBLIC_GUESTBOOK_COLUMNS =
  "id, name, affiliation, content, status, created_at, updated_at" as const;

const MAX_CONTENT_LENGTH = 5000;
const MAX_NAME_LENGTH = 80;
const MAX_AFFILIATION_LENGTH = 120;
const MIN_PASSWORD_LENGTH = 4;

function mapGuestbookRow(row: Pick<
  GuestbookEntryRow,
  "id" | "name" | "affiliation" | "content" | "status" | "created_at" | "updated_at"
>): GuestbookEntry {
  return {
    id: row.id,
    name: row.name,
    affiliation: row.affiliation,
    content: row.content,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function normalizeOptionalText(value: string | undefined, maxLength: number) {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) {
    return null;
  }

  return trimmed.slice(0, maxLength);
}

export function formatGuestbookDate(isoDate: string) {
  return formatCommentDate(isoDate);
}

export function isGuestbookAvailable() {
  return isSupabaseConfigured();
}

export async function listApprovedGuestbookEntries(): Promise<GuestbookEntry[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("guestbook_entries")
    .select(PUBLIC_GUESTBOOK_COLUMNS)
    .eq("status", "approved")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to load guestbook entries: ${error.message}`);
  }

  return (data ?? []).map(mapGuestbookRow);
}

export type CreateGuestbookEntryInput = {
  name: string;
  affiliation?: string;
  content: string;
  password: string;
};

export type CreateGuestbookEntryResult =
  | { ok: true }
  | {
      ok: false;
      error: string;
      fieldErrors?: {
        name?: string;
        content?: string;
        password?: string;
      };
    };

export async function createGuestbookEntry(
  input: CreateGuestbookEntryInput,
): Promise<CreateGuestbookEntryResult> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      ok: false,
      error: "안부의 글 기능을 사용할 수 없습니다. Supabase 설정을 확인해 주세요.",
    };
  }

  const name = input.name.trim();
  const content = input.content.trim();
  const password = input.password;

  if (!name) {
    return {
      ok: false,
      error: "이름을 입력해 주세요.",
      fieldErrors: { name: "이름을 입력해 주세요." },
    };
  }

  if (name.length > MAX_NAME_LENGTH) {
    return {
      ok: false,
      error: `이름은 ${MAX_NAME_LENGTH}자 이내로 입력해 주세요.`,
      fieldErrors: { name: `이름은 ${MAX_NAME_LENGTH}자 이내로 입력해 주세요.` },
    };
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
      error: "안부의 글을 입력해 주세요.",
      fieldErrors: { content: "안부의 글을 입력해 주세요." },
    };
  }

  if (content.length > MAX_CONTENT_LENGTH) {
    return {
      ok: false,
      error: `안부의 글은 ${MAX_CONTENT_LENGTH}자 이내로 입력해 주세요.`,
      fieldErrors: {
        content: `안부의 글은 ${MAX_CONTENT_LENGTH}자 이내로 입력해 주세요.`,
      },
    };
  }

  const row: GuestbookEntryInsert = {
    name,
    affiliation: normalizeOptionalText(input.affiliation, MAX_AFFILIATION_LENGTH),
    content,
    status: "pending",
    password_hash: hashCommentPassword(password),
  };

  const { error } = await supabase.from("guestbook_entries").insert(row);

  if (error) {
    return {
      ok: false,
      error: "안부를 남기지 못했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }

  return { ok: true };
}
