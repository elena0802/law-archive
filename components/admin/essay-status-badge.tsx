import type { EssayStatus } from "@/lib/content/db-types";

export function essayStatusLabel(status: EssayStatus) {
  switch (status) {
    case "published":
      return "공개";
    case "archived":
      return "보관";
    case "deleted":
      return "휴지통";
    default:
      return "임시 저장";
  }
}

type EssayStatusBadgeProps = {
  status: EssayStatus;
  showHelper?: boolean;
};

export function EssayStatusBadge({
  status,
  showHelper = true,
}: EssayStatusBadgeProps) {
  return (
    <div className="rounded border border-line bg-paper-muted px-5 py-4">
      <p className="text-sm tracking-[0.12em] text-accent uppercase">현재 상태</p>
      <p className="text-keep mt-2 font-serif text-2xl text-ink">
        {essayStatusLabel(status)}
      </p>
      {showHelper ? (
        <div className="text-keep mt-4 space-y-2 text-sm leading-7 text-ink-muted">
          <p>
            <span className="font-medium text-ink">임시 저장</span> — 공개하지
            않습니다. 다듬는 동안에 사용합니다.
          </p>
          <p>
            <span className="font-medium text-ink">공개</span> — 공개 서재에
            표시됩니다.
          </p>
          <p>
            <span className="font-medium text-ink">보관</span> — 공개 서재에서는
            보이지 않지만, 관리 화면에 보관해 둡니다.
          </p>
          <p>
            <span className="font-medium text-ink">휴지통</span> — 공개 서재에서는
            보이지 않으며, 휴지통 목록에서 따로 관리합니다.
          </p>
        </div>
      ) : null}
    </div>
  );
}
