"use server";

import { ADMIN_LOGIN_CONFIG_ERROR } from "@/lib/admin/admin-messages";
import {
  isAllowedEditorEmail,
  isEditorAllowlistConfigured,
  normalizeEditorEmail,
} from "@/lib/auth/editor";
import { getSiteOrigin } from "@/lib/site";
import { requireSupabaseServerClient } from "@/lib/supabase/server-ssr";

export type LoginActionState = {
  status: "idle" | "sent" | "error";
  message?: string;
};

export async function sendMagicLink(
  _prevState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const rawEmail = formData.get("email");

  if (typeof rawEmail !== "string" || rawEmail.trim() === "") {
    return {
      status: "error",
      message: "이메일 주소를 입력해 주세요.",
    };
  }

  const email = normalizeEditorEmail(rawEmail);

  if (!isEditorAllowlistConfigured()) {
    return {
      status: "error",
      message: ADMIN_LOGIN_CONFIG_ERROR,
    };
  }

  if (!isAllowedEditorEmail(email)) {
    return {
      status: "error",
      message: "등록된 관리자 이메일만 로그인할 수 있습니다.",
    };
  }

  try {
    const supabase = await requireSupabaseServerClient();
    const origin = getSiteOrigin();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${origin}/admin/auth/callback`,
      },
    });

    if (error) {
      return {
        status: "error",
        message: "로그인 링크를 보내지 못했습니다. 잠시 후 다시 시도해 주세요.",
      };
    }

    return {
      status: "sent",
      message: `${email}로 로그인 링크를 보냈습니다. 메일함을 확인해 주세요.`,
    };
  } catch (error) {
    console.error("Admin login failed:", error);
    return {
      status: "error",
      message: ADMIN_LOGIN_CONFIG_ERROR,
    };
  }
}
