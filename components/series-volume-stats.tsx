import { formatEssayDate } from "@/lib/essays";

type SeriesVolumeStatsProps = {
  count: number;
  firstDate: string;
  latestDate: string;
  layout?: "inline" | "grid";
};

export function SeriesVolumeStats({
  count,
  firstDate,
  latestDate,
  layout = "inline",
}: SeriesVolumeStatsProps) {
  const firstLabel = formatEssayDate(firstDate);
  const latestLabel = formatEssayDate(latestDate);
  const dateSpan =
    firstLabel === latestLabel ? firstLabel : `${firstLabel} – ${latestLabel}`;

  if (layout === "inline") {
    return (
      <p className="text-sm leading-6 text-ink-muted">
        <span>{count}편</span>
        <span aria-hidden="true" className="mx-2 text-line">
          ·
        </span>
        <span>첫 발행 {firstLabel}</span>
        <span aria-hidden="true" className="mx-2 text-line">
          ·
        </span>
        <span>최근 발행 {latestLabel}</span>
        <span aria-hidden="true" className="mx-2 text-line">
          ·
        </span>
        <span>발행일 순서로 읽기</span>
      </p>
    );
  }

  return (
    <dl className="mt-6 grid gap-4 border-t border-line pt-6 sm:grid-cols-2">
      <div>
        <dt className="text-xs tracking-[0.12em] text-accent uppercase">글 수</dt>
        <dd className="mt-1 text-base text-ink">{count}편</dd>
      </div>
      <div>
        <dt className="text-xs tracking-[0.12em] text-accent uppercase">
          읽는 순서
        </dt>
        <dd className="mt-1 text-base text-ink">발행일 오름차순</dd>
      </div>
      <div>
        <dt className="text-xs tracking-[0.12em] text-accent uppercase">
          첫 발행
        </dt>
        <dd className="mt-1 text-base text-ink">{firstLabel}</dd>
      </div>
      <div>
        <dt className="text-xs tracking-[0.12em] text-accent uppercase">
          최근 발행
        </dt>
        <dd className="mt-1 text-base text-ink">{latestLabel}</dd>
      </div>
      <div className="sm:col-span-2">
        <dt className="sr-only">발행 기간</dt>
        <dd className="text-sm text-ink-muted">{dateSpan}</dd>
      </div>
    </dl>
  );
}
