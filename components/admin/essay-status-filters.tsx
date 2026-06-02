import Link from "next/link";
import type { EssayStatus } from "@/lib/content/db-types";

export type EssayListFilter = "all" | EssayStatus;

type EssayStatusFiltersProps = {
  current: EssayListFilter;
  baseParams?: {
    q?: string;
    series?: string;
    sort?: string;
  };
};

const filters: { value: EssayListFilter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "published", label: "공개" },
  { value: "draft", label: "임시" },
  { value: "archived", label: "보관" },
];

function filterHref(
  value: EssayListFilter,
  baseParams: EssayStatusFiltersProps["baseParams"],
) {
  const params = new URLSearchParams();

  if (value !== "all") {
    params.set("status", value);
  }

  if (baseParams?.series) {
    params.set("series", baseParams.series);
  }

  if (baseParams?.q) {
    params.set("q", baseParams.q);
  }

  if (baseParams?.sort) {
    params.set("sort", baseParams.sort);
  }

  const query = params.toString();
  return query ? `/admin/essays?${query}` : "/admin/essays";
}

export function EssayStatusFilters({
  current,
  baseParams,
}: EssayStatusFiltersProps) {
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
            href={filterHref(filter.value, baseParams)}
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
