import type { NewsCategory } from "@/lib/news/types";

type NewsCategoryLabelProps = {
  category: NewsCategory;
};

export function NewsCategoryLabel({ category }: NewsCategoryLabelProps) {
  return (
    <span className="text-keep inline-flex rounded-sm border border-line bg-paper-muted px-2 py-0.5 text-[0.6875rem] font-medium tracking-[0.08em] text-ink-muted">
      {category}
    </span>
  );
}
