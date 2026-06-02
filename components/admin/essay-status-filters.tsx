import Link from "next/link";
import type { EssayStatus } from "@/lib/content/db-types";

export type EssayListFilter = "all" | EssayStatus;

type EssayStatusFiltersProps = {
  current: EssayListFilter;
};

const filters: { value: EssayListFilter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "published", label: "공개" },
  { value: "draft", label: "임시" },
  { value: "archived", label: "보관" },
];

function filterHref(value: EssayListFilter) {
  if (value === "all") {
    return "/admin/essays";
  }

  return `/admin/essays?status=${value}`;
}

export function EssayStatusFilters({ current }: EssayStatusFiltersProps) {
  return (
    <div
      className="mt-8 flex flex-wrap gap-2"
      role="tablist"
      aria-label="글 상태 필터"
    >
      {filters.map((filter) => {
        const isActive = current === filter.value;

        return (
          <Link
            aria-current={isActive ? "page" : undefined}
            className={
              isActive
                ? "rounded-full border border-accent bg-accent px-4 py-2 text-sm font-medium text-paper"
                : "rounded-full border border-line bg-paper px-4 py-2 text-sm text-ink-muted transition hover:border-accent/40 hover:text-ink"
            }
            href={filterHref(filter.value)}
            key={filter.value}
            role="tab"
          >
            {filter.label}
          </Link>
        );
      })}
    </div>
  );
}
