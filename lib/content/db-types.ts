/**
 * Supabase row shapes for PR11 CMS tables.
 * @see design/PR11-CMS-ARCHITECTURE.md §3
 */

export type EssayStatus = "draft" | "published" | "archived";

export type SeriesRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type EssayRow = {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  essay_date: string;
  category: string;
  series_slug: string;
  status: EssayStatus;
  featured: boolean;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

export type EssayInsert = {
  title: string;
  slug: string;
  description: string;
  content: string;
  essay_date: string;
  category: string;
  series_slug: string;
  status: EssayStatus;
  featured: boolean;
  published_at?: string | null;
};

export type EssayUpdate = Partial<EssayInsert & { published_at: string | null }>;
