import type { Essay, EssaySeries } from "@/lib/essays";

/**
 * Content backend for essays and series aggregation.
 * MDX implementation lives in lib/essays.ts today; Supabase in lib/content/supabase-repository.ts (later PR).
 */
export type EssayRepositoryOptions = {
  includeDrafts?: boolean;
};

export type EssayRepository = {
  getEssayBySlug(
    slug: string,
    options?: EssayRepositoryOptions,
  ): Promise<Essay | null>;
  getAllEssays(options?: EssayRepositoryOptions): Promise<Essay[]>;
  getAllSeries(options?: EssayRepositoryOptions): Promise<EssaySeries[]>;
  getSeriesBySlug(
    slug: string,
    options?: EssayRepositoryOptions,
  ): Promise<EssaySeries | null>;
};
