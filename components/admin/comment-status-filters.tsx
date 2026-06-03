import Link from "next/link";
import type { CommentListFilter } from "@/lib/admin/comments";

type CommentStatusFiltersProps = {
  current: CommentListFilter;
};

const filters: { value: CommentListFilter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "approved", label: "승인됨" },
  { value: "pending", label: "대기" },
  { value: "rejected", label: "거절됨" },
];

function filterHref(value: CommentListFilter) {
  return value === "all"
    ? "/admin/comments"
    : `/admin/comments?status=${value}`;
}

export function CommentStatusFilters({ current }: CommentStatusFiltersProps) {
  return (
    <div
      aria-label="댓글 상태 필터"
      className="mt-8 flex flex-wrap gap-2"
      role="tablist"
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
