import { getAllowedEditorEmail } from "@/lib/supabase/config";

export function normalizeEditorEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isAllowedEditorEmail(email: string | undefined | null) {
  const allowed = getAllowedEditorEmail();

  if (!allowed || !email) {
    return false;
  }

  return normalizeEditorEmail(email) === allowed;
}

export function isEditorAllowlistConfigured() {
  return getAllowedEditorEmail().length > 0;
}
