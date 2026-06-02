import { redirect } from "next/navigation";
import { getEditorSupabase } from "@/lib/admin/require-editor";

/**
 * Server-side guard for editor-only routes (preview). Middleware is the first line of defense.
 */
export async function ensureEditorAccess(returnPath: string) {
  const editor = await getEditorSupabase();

  if (!editor) {
    redirect(
      `/admin/login?next=${encodeURIComponent(returnPath)}`,
    );
  }

  return editor;
}
