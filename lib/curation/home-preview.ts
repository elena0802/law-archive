import type { CurationItem } from "@/lib/curation/types";

export const HOME_CURATION_RECENT_MAX = 8;

export type HomeCurationPreviewData = {
  featuredSlots: readonly [CurationItem | null, CurationItem | null];
  recent: readonly CurationItem[];
};

function compareCurationRecency(a: CurationItem, b: CurationItem): number {
  if (b.sortOrder !== a.sortOrder) {
    return b.sortOrder - a.sortOrder;
  }

  const dateDiff =
    new Date(b.recommendedAt).getTime() - new Date(a.recommendedAt).getTime();

  if (dateDiff !== 0) {
    return dateDiff;
  }

  return a.id.localeCompare(b.id);
}

function sortCurationItems(items: readonly CurationItem[]): CurationItem[] {
  return [...items].sort(compareCurationRecency);
}

/**
 * Picks the two homepage featured slots.
 *
 * Today: `is_featured` items ranked by `sort_order` / `recommended_at`.
 * Future: prefer explicit `featuredOrder === 1 | 2` once the column exists.
 */
export function resolveHomeFeaturedSlots(
  items: readonly CurationItem[],
): [CurationItem | null, CurationItem | null] {
  const sorted = sortCurationItems(items);

  // Future: slot1 = items.find((item) => item.featuredOrder === 1) ?? ...
  const featuredItems = sorted.filter((item) => item.isFeatured);

  let slot1: CurationItem | null = featuredItems[0] ?? null;
  let slot2: CurationItem | null = featuredItems[1] ?? null;

  if (slot1 && !slot2) {
    const firstSlot = slot1;
    slot2 = sorted.find((item) => item.id !== firstSlot.id) ?? null;
  } else if (!slot1) {
    slot1 = sorted[0] ?? null;
    slot2 = sorted[1] ?? null;
  }

  return [slot1, slot2];
}

export function resolveHomeCurationRecent(
  items: readonly CurationItem[],
  featuredSlots: readonly [CurationItem | null, CurationItem | null],
  max = HOME_CURATION_RECENT_MAX,
): CurationItem[] {
  const excludeIds = new Set(
    featuredSlots.flatMap((item) => (item ? [item.id] : [])),
  );

  return sortCurationItems(items)
    .filter((item) => !excludeIds.has(item.id))
    .slice(0, max);
}

export function buildHomeCurationPreview(
  items: readonly CurationItem[],
): HomeCurationPreviewData {
  const featuredSlots = resolveHomeFeaturedSlots(items);
  const recent = resolveHomeCurationRecent(items, featuredSlots);

  return { featuredSlots, recent };
}
