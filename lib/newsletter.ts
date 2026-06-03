import type { NewsletterSubscriberInsert } from "@/lib/content/db-types";
import { createSupabaseServerClient } from "@/lib/supabase/server-ssr";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 320;

export function isNewsletterAvailable() {
  return isSupabaseConfigured();
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isValidNewsletterEmail(email: string) {
  const normalized = normalizeEmail(email);

  if (!normalized || normalized.length > MAX_EMAIL_LENGTH) {
    return false;
  }

  return EMAIL_PATTERN.test(normalized);
}

export type SubscribeToNewsletterResult =
  | { ok: true }
  | {
      ok: false;
      error: string;
      code?: "duplicate" | "invalid_email";
      fieldErrors?: { email?: string };
    };

export async function subscribeToNewsletter(
  email: string,
  source?: string,
): Promise<SubscribeToNewsletterResult> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      ok: false,
      error: "구독 기능을 사용할 수 없습니다. Supabase 설정을 확인해 주세요.",
    };
  }

  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return {
      ok: false,
      error: "이메일을 입력해 주세요.",
      code: "invalid_email",
      fieldErrors: { email: "이메일을 입력해 주세요." },
    };
  }

  if (!isValidNewsletterEmail(normalizedEmail)) {
    return {
      ok: false,
      error: "올바른 이메일 주소를 입력해 주세요.",
      code: "invalid_email",
      fieldErrors: { email: "올바른 이메일 주소를 입력해 주세요." },
    };
  }

  const row: NewsletterSubscriberInsert = {
    email: normalizedEmail,
    status: "active",
    source: source?.trim() || null,
  };

  const { error } = await supabase.from("newsletter_subscribers").insert(row);

  if (error) {
    if (error.code === "23505") {
      return {
        ok: false,
        error: "이미 구독 중인 이메일입니다.",
        code: "duplicate",
      };
    }

    return {
      ok: false,
      error: "구독 신청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }

  return { ok: true };
}
