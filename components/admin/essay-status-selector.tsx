import type { EssayStatus } from "@/lib/content/db-types";
import { essayStatusLabel } from "@/components/admin/essay-status-badge";

const options: { value: EssayStatus; label: string }[] = [
  { value: "draft", label: essayStatusLabel("draft") },
  { value: "published", label: essayStatusLabel("published") },
  { value: "archived", label: essayStatusLabel("archived") },
  { value: "deleted", label: essayStatusLabel("deleted") },
];

type EssayStatusSelectorProps = {
  currentStatus: EssayStatus;
};

export function EssayStatusSelector({
  currentStatus,
}: EssayStatusSelectorProps) {
  return (
    <fieldset className="rounded border border-line bg-paper-muted px-5 py-5">
      <legend className="text-keep px-1 text-base font-medium text-ink">
        공개 상태
      </legend>

      <div className="mt-4 space-y-3">
        {options.map((option) => (
          <label
            className="text-keep flex cursor-pointer gap-3 rounded border border-line bg-paper px-4 py-4 has-[:checked]:border-accent/60 has-[:checked]:ring-2 has-[:checked]:ring-accent/20"
            key={option.value}
          >
            <input
              className="mt-1 size-4 accent-accent"
              defaultChecked={currentStatus === option.value}
              name="essay_status"
              type="radio"
              value={option.value}
            />
            <span className="text-base font-medium text-ink">
              {option.label}
            </span>
          </label>
        ))}
      </div>

      <div className="text-keep mt-6 space-y-2 text-sm leading-7 text-ink-muted">
        <p>
          <span className="font-medium text-ink">임시 저장</span> — 공개
          사이트에 보이지 않습니다.
        </p>
        <p>
          <span className="font-medium text-ink">공개</span> — 공개 사이트에
          표시됩니다.
        </p>
        <p>
          <span className="font-medium text-ink">보관</span> — 공개
          사이트에서는 보이지 않지만
          <br />
          관리 화면에는 계속 보관됩니다.
        </p>
        <p>
          <span className="font-medium text-ink">휴지통</span> — 공개
          사이트에서는 보이지 않으며 휴지통 목록에서만 관리됩니다.
        </p>
      </div>
    </fieldset>
  );
}
