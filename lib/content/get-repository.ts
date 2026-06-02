import { getContentSource, isSupabaseContentSource } from "@/lib/content/content-source";
import type { EssayRepository } from "@/lib/content/essay-repository";
import { createMdxEssayRepository } from "@/lib/content/mdx-repository";
import { createSupabaseEssayRepository } from "@/lib/content/supabase-repository";
import { isSupabaseServiceRoleConfigured } from "@/lib/supabase/config";

let mdxRepository: EssayRepository | null = null;
let supabaseRepository: EssayRepository | null = null;

export function getEssayRepository(): EssayRepository {
  if (isSupabaseContentSource()) {
    if (!isSupabaseServiceRoleConfigured()) {
      throw new Error(
        "CONTENT_SOURCE=supabase requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
      );
    }

    if (!supabaseRepository) {
      supabaseRepository = createSupabaseEssayRepository();
    }

    return supabaseRepository;
  }

  if (!mdxRepository) {
    mdxRepository = createMdxEssayRepository();
  }

  return mdxRepository;
}

export function getActiveContentSourceLabel() {
  return getContentSource();
}
