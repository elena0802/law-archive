import { newsItems } from "@/lib/news/items";
import { createSupabaseServerClient } from "@/lib/supabase/server-ssr";
import type { NewsItem, NewsMonthGroup } from "@/lib/news/types";
import { resolveFeaturedCtaBehavior } from "@/lib/news/types";

function formatMonthLabel(date: string) {
  const parsed = new Date(date);
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  return `${year}.${month}`;
}

function getMonthKey(date: string) {
  const parsed = new Date(date);
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

/** Public read path — swap body for Supabase when admin CMS lands. */
export async function getNewsItems(): Promise<NewsItem[]> {
  const fallback = [...newsItems]
    .filter((item) => item.published !== false)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return fallback;
  }

  const { data, error } = await supabase
    .from("news_items")
    .select("*")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getNewsItems] supabase read failed", { error });
    return fallback;
  }

  if (!data || data.length === 0) {
    return fallback;
  }

  return data
    .filter((row) => row.published)
    .map((row) => ({
      id: row.id,
      date: row.date,
      category: row.category,
      title: row.title,
      summary: row.summary,
      featured: row.featured,
      published: row.published,
      image: row.image_url ?? undefined,
      link: row.link_url ?? undefined,
      featuredCtaBehavior: resolveFeaturedCtaBehavior(row.featured_cta_behavior),
    }));
}

export async function getRecentNewsItems(limit = 3): Promise<NewsItem[]> {
  if (limit <= 0) {
    return [];
  }

  const items = await getNewsItems();
  return items.slice(0, limit);
}

export async function getFeaturedNewsItem(): Promise<NewsItem | null> {
  const items = await getNewsItems();
  return items.find((item) => item.featured === true) ?? null;
}

export async function getNewsItemsGroupedByMonth(): Promise<NewsMonthGroup[]> {
  const items = await getNewsItems();
  const groups = new Map<string, NewsMonthGroup>();

  for (const item of items) {
    const monthKey = getMonthKey(item.date);
    const existing = groups.get(monthKey);

    if (existing) {
      existing.items.push(item);
      continue;
    }

    groups.set(monthKey, {
      monthKey,
      label: formatMonthLabel(item.date),
      items: [item],
    });
  }

  return [...groups.values()];
}
