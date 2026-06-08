import "server-only";

import { isAllowedEditorEmail } from "@/lib/auth/editor";
import {
  createSupabaseServerClient,
  requireSupabaseServerClient,
} from "@/lib/supabase/server-ssr";

export async function requireEditorSupabase() {
  const supabase = await requireSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAllowedEditorEmail(user.email)) {
    throw new Error("관리자만 이 작업을 수행할 수 있습니다.");
  }

  return { supabase, user };
}

export async function getEditorSupabase() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAllowedEditorEmail(user.email)) {
    return null;
  }

  return { supabase, user };
}
