import type { getResearchAreaCounts } from "@/src/lib/research";

type ResearchAreasProps = {
  areas: ReturnType<typeof getResearchAreaCounts>;
};

export function ResearchAreas({ areas }: ResearchAreasProps) {
  if (areas.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="research-areas-heading">
      <h2
        id="research-areas-heading"
        className="font-serif text-2xl leading-tight text-ink sm:text-[1.75rem]"
      >
        연구 분야
      </h2>
      <ul className="mt-6 list-none space-y-0 p-0">
        {areas.map((area) => (
          <li
            key={area.category}
            className="flex items-baseline justify-between gap-6 border-t border-line/70 py-4 first:border-t-0 first:pt-0 last:pb-0"
          >
            <span className="text-keep font-serif text-lg leading-snug text-ink">
              {area.label}
            </span>
            <span className="shrink-0 text-sm tabular-nums text-ink-muted">
              {area.count}편
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
