import { getAllowedEditorEmails } from "@/lib/supabase/config";

export function normalizeEditorEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isAllowedEditorEmail(email: string | undefined | null) {
  const allowedEmails = getAllowedEditorEmails();

  if (allowedEmails.length === 0 || !email) {
    return false;
  }

  return allowedEmails.includes(normalizeEditorEmail(email));
}

export function isEditorAllowlistConfigured() {
  return getAllowedEditorEmails().length > 0;
}
